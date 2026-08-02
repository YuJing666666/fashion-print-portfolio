import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }), {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  }, { waitUntil() {}, passThroughOnException() {} });
}

test("server-renders the bilingual fashion portfolio", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>YOUR NAME — Fashion Print Designer \/ 服装图案设计师<\/title>/i);
  assert.match(html, /24 个图案实验/);
  assert.match(html, /STATIC GARDEN/);
  assert.match(html, /CONCEPT PORTFOLIO \/ NON-COMMERCIAL|概念作品集 \/ 非商业项目/);
  assert.match(html, /og:image/);
  assert.match(html, /twitter:card/);
});

test("ships 24 concept boards and the required interaction contracts", async () => {
  const [page, css, projects, assets] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/projects.ts", import.meta.url), "utf8"),
    readdir(new URL("../public/projects/", import.meta.url)),
  ]);
  assert.equal(assets.filter(name => name.endsWith(".jpg")).length, 24);
  assert.equal((projects.match(/^  \["[a-z0-9-]+"/gm) ?? []).length, 24);
  assert.match(page, /IntersectionObserver/);
  assert.match(page, /searchParams\.set\("case"/);
  assert.match(page, /event\.key === "Escape"/);
  assert.match(page, /aria-modal="true"/);
  assert.match(page, /loading="lazy"/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /\.case-drawer[^}]*width:100vw/);
  await access(new URL("../public/og.png", import.meta.url));
});

test("ships the persistent content console and mixed typography system", async () => {
  const [page, admin, adminCss, contentStore, schema, hosting] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/admin/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/admin/admin.css", import.meta.url), "utf8"),
    readFile(new URL("../app/content-store.ts", import.meta.url), "utf8"),
    readFile(new URL("../db/schema.ts", import.meta.url), "utf8"),
    readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"),
  ]);
  assert.match(page, /fetch\("\/api\/content"/);
  assert.match(page, /CONTENT ADMIN/);
  assert.match(admin, /Adobe Illustrator|软件能力/);
  assert.match(admin, /\/api\/admin\/content/);
  assert.match(adminCss, /var\(--font-hand\)/);
  assert.match(contentStore, /portfolio_admins/);
  assert.match(schema, /idx_portfolio_projects_display_order/);
  assert.equal(JSON.parse(hosting).d1, "DB");
  await access(new URL("../drizzle/0000_redundant_puppet_master.sql", import.meta.url));
  await access(new URL("../drizzle/0001_woozy_pandemic.sql", import.meta.url));
});

test("ships female lookbook hover states and a three-column rounded archive", async () => {
  const [page, css, modelAssets] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readdir(new URL("../public/models/", import.meta.url)),
  ]);
  assert.equal(modelAssets.filter(name => name.startsWith("female-lookbook-") && name.endsWith(".png")).length, 3);
  assert.match(page, /className="model-layer single-model"/);
  assert.match(page, /made by hand — Y\.N\./);
  assert.match(page, /hero-3d-garments-v1\.png/);
  assert.match(page, /hero-color-card/);
  assert.match(page, /fashion-tags/);
  assert.match(css, /grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
  assert.match(css, /border-radius:clamp\(16px,2vw,27px\)/);
  assert.match(css, /project-card:hover \.model-layer/);
});

test("ships a theme-aware secondary page with 12 centered 16:9 garment bases", async () => {
  const [home, bases, css, baseAssets] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/bases/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readdir(new URL("../public/models/garment-bases-v1/", import.meta.url)),
  ]);
  const pngs = baseAssets.filter(name => name.endsWith(".png"));
  assert.equal(pngs.length, 12);
  assert.match(home, /href="\/bases"/);
  assert.doesNotMatch(home, /className="garment-library"/);
  assert.match(bases, /WOMENSWEAR BASES/);
  assert.match(bases, /garments\.map/);
  assert.doesNotMatch(bases, /瑜伽服|YOGA WEAR|yoga-set/);
  assert.match(css, /aspect-ratio:16\/9/);
  assert.match(css, /object-position:50% 50%/);
  assert.match(css, /--base-bg:#F5F0F0/);
  assert.match(css, /--base-bg:#0d0d10/);
  assert.match(css, /html\[data-theme="dark"\] \.garment-media img/);
  for (const name of pngs) {
    const file = await readFile(new URL(`../public/models/garment-bases-v1/${name}`, import.meta.url));
    assert.equal(file.readUInt32BE(16), 1672, `${name} width`);
    assert.equal(file.readUInt32BE(20), 941, `${name} height`);
  }
  const response = await render("/bases");
  assert.equal(response.status, 200);
  assert.match(await response.text(), /女装基模库/);
});

test("expands cases from their card into split fixed-detail pages", async () => {
  const [layout, page, css] = await Promise.all([
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);
  assert.match(layout, /Mrs_Saint_Delafield/);
  assert.match(page, /getBoundingClientRect/);
  assert.match(page, /--case-top/);
  assert.match(page, /PROJECT FILE/);
  assert.match(css, /@keyframes case-expand/);
  assert.match(css, /@keyframes specs-in/);
  assert.match(css, /grid-template-columns:minmax\(0,1fr\) minmax\(300px,25vw\)/);
  assert.match(css, /background-size:400% 100%/);
  assert.match(css, /backdrop-filter:blur\(15px\)/);
  assert.match(css, /overflow:hidden; padding:62px 25px 18px/);
  assert.match(css, /border-radius:26px/);
  assert.doesNotMatch(page, /hero-margin-note/);
  assert.match(css, /top:calc\(100svh - 69px\)/);
  assert.match(css, /\.hero-board:before/);
  assert.match(css, /width:min\(1120px,84vw\)/);
  assert.match(css, /\.hero-case-link/);
  await access(new URL("../public/models/hero-3d-garments-v1.png", import.meta.url));
});

test("ships a persistent system-aware night mode", async () => {
  const [layout, page, css] = await Promise.all([
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);
  assert.match(layout, /prefers-color-scheme: dark/);
  assert.match(layout, /portfolio-theme/);
  assert.match(page, /className="theme-toggle"/);
  assert.match(page, /document\.documentElement\.dataset\.theme/);
  assert.match(css, /html\[data-theme="dark"\]/);
  assert.match(css, /color-scheme:dark/);
});
