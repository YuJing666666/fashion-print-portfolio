import {
  defaultManagedProjects,
  defaultSiteSettings,
  type ManagedProject,
  type PortfolioContent,
  type SiteSettings,
} from "./projects";

type Bindings = { DB?: D1Database };

const schemaStatements = [
  `CREATE TABLE IF NOT EXISTS portfolio_settings (
    id TEXT PRIMARY KEY NOT NULL,
    data TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS portfolio_projects (
    slug TEXT PRIMARY KEY NOT NULL,
    data TEXT NOT NULL,
    display_order INTEGER NOT NULL,
    visible INTEGER NOT NULL DEFAULT 1,
    hero INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS portfolio_admins (
    user_id TEXT PRIMARY KEY NOT NULL,
    email TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS idx_portfolio_projects_display_order
   ON portfolio_projects(display_order)`,
];

async function getBinding(): Promise<D1Database> {
  const { env } = await import("cloudflare:workers");
  const db = (env as unknown as Bindings).DB;
  if (!db) throw new Error("Portfolio database is unavailable");
  return db;
}

async function ensureSchema(db: D1Database) {
  await db.batch(schemaStatements.map(statement => db.prepare(statement)));
}

async function ensureSeeded(db: D1Database) {
  await ensureSchema(db);
  const settings = await db.prepare("SELECT id FROM portfolio_settings WHERE id = ?").bind("site").first();
  if (!settings) {
    await db.prepare("INSERT INTO portfolio_settings (id, data) VALUES (?, ?)")
      .bind("site", JSON.stringify(defaultSiteSettings)).run();
  }

  // 同步缺失的默认项目：D1 可能用旧版 defaults 播种，需要补入新增项目
  const existing = await db.prepare("SELECT slug FROM portfolio_projects").all<{ slug: string }>();
  const existingSet = new Set(existing.results.map(r => r.slug));
  const missing = defaultManagedProjects.filter(p => !existingSet.has(p.slug));
  if (missing.length > 0) {
    await db.batch(missing.map(project => db.prepare(
      "INSERT INTO portfolio_projects (slug, data, display_order, visible, hero) VALUES (?, ?, ?, ?, ?)",
    ).bind(project.slug, JSON.stringify(project), project.order, project.visible ? 1 : 0, project.hero ? 1 : 0)));
  }
}

export async function readPortfolioContent(includeHidden = false): Promise<PortfolioContent> {
  const db = await getBinding();
  await ensureSeeded(db);
  const settingsRow = await db.prepare("SELECT data FROM portfolio_settings WHERE id = ?").bind("site").first<{ data: string }>();
  const projectRows = await db.prepare(
    `SELECT data, display_order, visible, hero
     FROM portfolio_projects
     ${includeHidden ? "" : "WHERE visible = 1"}
     ORDER BY display_order ASC`,
  ).all<{ data: string; display_order: number; visible: number; hero: number }>();

  const settings = settingsRow?.data ? JSON.parse(settingsRow.data) as SiteSettings : defaultSiteSettings;
  const projects = projectRows.results.map(row => ({
    ...(JSON.parse(row.data) as ManagedProject),
    order: row.display_order,
    visible: Boolean(row.visible),
    hero: Boolean(row.hero),
  }));
  return { settings, projects };
}

function normalizeSettings(input: SiteSettings): SiteSettings {
  const accentColor = /^#[0-9a-fA-F]{6}$/.test(input.accentColor) ? input.accentColor : defaultSiteSettings.accentColor;
  return {
    ...defaultSiteSettings,
    ...input,
    displayName: String(input.displayName || defaultSiteSettings.displayName).slice(0, 80),
    city: String(input.city || defaultSiteSettings.city).slice(0, 100),
    email: String(input.email || defaultSiteSettings.email).slice(0, 160),
    accentColor,
    heroWeight: input.heroWeight === "800" ? "800" : "900",
    heroSlugs: Array.isArray(input.heroSlugs) ? input.heroSlugs.slice(0, 3) : defaultSiteSettings.heroSlugs,
    software: Array.isArray(input.software) ? input.software.slice(0, 12) : defaultSiteSettings.software,
  };
}

export async function savePortfolioContent(payload: PortfolioContent) {
  if (!payload?.settings || !Array.isArray(payload.projects) || payload.projects.length > 100) {
    throw new Error("Invalid portfolio payload");
  }
  const db = await getBinding();
  await ensureSeeded(db);
  const settings = normalizeSettings(payload.settings);
  const projectStatements = payload.projects.map((project, index) => {
    const normalized = {
      ...project,
      slug: String(project.slug).slice(0, 100),
      title: String(project.title).slice(0, 120),
      order: Number.isFinite(project.order) ? project.order : index + 1,
      visible: Boolean(project.visible),
      hero: Boolean(project.hero),
    };
    return db.prepare(
      `INSERT INTO portfolio_projects (slug, data, display_order, visible, hero, updated_at)
       VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(slug) DO UPDATE SET
         data = excluded.data,
         display_order = excluded.display_order,
         visible = excluded.visible,
         hero = excluded.hero,
         updated_at = CURRENT_TIMESTAMP`,
    ).bind(normalized.slug, JSON.stringify(normalized), normalized.order, normalized.visible ? 1 : 0, normalized.hero ? 1 : 0);
  });

  await db.batch([
    db.prepare(
      `INSERT INTO portfolio_settings (id, data, updated_at)
       VALUES (?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = CURRENT_TIMESTAMP`,
    ).bind("site", JSON.stringify(settings)),
    ...projectStatements,
  ]);
  await db.prepare("PRAGMA optimize").run();
}

export async function requirePortfolioAdmin(request: Request) {
  const url = new URL(request.url);
  const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  const userId = request.headers.get("oai-authenticated-user-id") || (isLocal ? "local-preview-admin" : "");
  const email = request.headers.get("oai-authenticated-user-email") || (isLocal ? "local@preview" : "");
  if (!userId) throw new Error("AUTH_REQUIRED");

  const db = await getBinding();
  await ensureSeeded(db);
  const total = await db.prepare("SELECT COUNT(*) AS total FROM portfolio_admins").first<{ total: number }>();
  if (!total?.total) {
    await db.prepare("INSERT INTO portfolio_admins (user_id, email) VALUES (?, ?)").bind(userId, email).run();
    return { userId, email };
  }
  const admin = await db.prepare("SELECT user_id FROM portfolio_admins WHERE user_id = ?").bind(userId).first();
  if (!admin) throw new Error("FORBIDDEN");
  return { userId, email };
}
