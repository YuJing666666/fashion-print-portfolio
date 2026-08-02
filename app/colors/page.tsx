"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { defaultManagedProjects, defaultSiteSettings, type Lang, type PortfolioContent } from "../projects";

const copy = {
  zh: {
    title: "配色库",
    intro: "24 个概念案例中使用的全部色彩，点击色卡生成推荐配色方案，自动复制到剪贴板。",
    portfolio: "作品集",
    bases: "基模库",
    colors: "配色库",
    themeLight: "开启黑夜模式",
    themeDark: "切换为白天模式",
    used: "用于",
    projects: "个案例",
    ratio: "占比",
    pairs: "常见搭配",
    totalColors: "色彩总数",
    totalEntries: "色彩引用",
    paletteTitle: "推荐配色方案",
    paletteHint: "点击任意色卡刷新方案 · 已自动复制到剪贴板",
    copied: "已复制",
    clickToGen: "点击色卡生成配色方案",
  },
  en: {
    title: "COLOR ARCHIVE",
    intro: "Every color across 24 concept studies. Click a swatch to generate a palette — auto-copied to clipboard.",
    portfolio: "PORTFOLIO",
    bases: "GARMENT BASES",
    colors: "COLORS",
    themeLight: "Enable night mode",
    themeDark: "Switch to day mode",
    used: "USED IN",
    projects: "CASES",
    ratio: "RATIO",
    pairs: "PAIRS WITH",
    totalColors: "UNIQUE COLORS",
    totalEntries: "TOTAL ENTRIES",
    paletteTitle: "RECOMMENDED PALETTE",
    paletteHint: "Click any swatch to refresh · auto-copied to clipboard",
    copied: "COPIED",
    clickToGen: "Click a swatch to generate a palette",
  },
} as const;

type ColorEntry = {
  hex: string;
  zh: string;
  en: string;
  count: number;
  projects: { id: string; title: string }[];
  pairs: { hex: string; zh: string; en: string; count: number }[];
};

type PaletteSlot = { hex: string; zh: string; en: string };

const families = [
  { id: "black", zh: "黑 / 深", en: "BLACK / DARK" },
  { id: "white", zh: "白 / 米", en: "WHITE / CREAM" },
  { id: "grey", zh: "灰 / 银", en: "GREY / SILVER" },
  { id: "blue", zh: "蓝", en: "BLUE" },
  { id: "green", zh: "绿", en: "GREEN" },
  { id: "red", zh: "红 / 粉", en: "RED / PINK" },
  { id: "yellow", zh: "黄 / 荧光", en: "YELLOW / NEON" },
  { id: "brown", zh: "棕 / 大地", en: "BROWN / EARTH" },
] as const;

function classify(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lum = (max + min) / 2;
  const diff = max - min;
  if (lum < 60) return "black";
  if (lum > 230) return "white";
  if (diff < 25) return "grey";
  if (max === r && g < r * 0.8) { if (b < r * 0.6) return "red"; return "brown"; }
  if (max === r && b >= r * 0.7 && g >= r * 0.6) return "yellow";
  if (max === g) return "green";
  if (max === b) return "blue";
  if (max === r && b >= r * 0.7) return "red";
  return "grey";
}

function isLight(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ColorLibraryPage() {
  const [lang, setLang] = useState<Lang>("zh");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [displayName, setDisplayName] = useState(defaultSiteSettings.displayName);
  const [colors, setColors] = useState<ColorEntry[]>([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [palette, setPalette] = useState<PaletteSlot[]>([]);
  const [copied, setCopied] = useState(false);
  const t = copy[lang];

  const generatePalette = useCallback((entry: ColorEntry) => {
    // 从搭配中随机取 3 个，加上主色，组成 4 色方案
    const shuffled = shuffle(entry.pairs);
    const picks: PaletteSlot[] = [{ hex: entry.hex, zh: entry.zh, en: entry.en }];
    for (const p of shuffled) {
      if (picks.length >= 4) break;
      picks.push({ hex: p.hex, zh: p.zh, en: p.en });
    }
    setPalette(picks);
    setCopied(false);
    // 复制到剪贴板
    const hexStr = picks.map(p => p.hex).join(" · ");
    navigator.clipboard?.writeText(hexStr).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }).catch(() => undefined);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("portfolio-lang") as Lang | null;
    if (saved === "zh" || saved === "en") window.requestAnimationFrame(() => setLang(saved));
    const currentTheme = document.documentElement.dataset.theme;
    window.requestAnimationFrame(() => setTheme(currentTheme === "dark" ? "dark" : "light"));

    const buildColors = (projects: typeof defaultManagedProjects) => {
      const map = new Map<string, ColorEntry>();
      let total = 0;
      for (const p of projects) {
        for (const c of p.production.colors) {
          const key = c.hex.toUpperCase();
          if (!map.has(key)) map.set(key, { hex: c.hex, zh: c.name.zh, en: c.name.en, count: 0, projects: [], pairs: [] });
          const entry = map.get(key)!;
          entry.count++;
          entry.projects.push({ id: p.id, title: p.title });
          total++;
        }
      }
      // 计算搭配
      const pairMap = new Map<string, Map<string, number>>();
      for (const p of projects) {
        const hexes = p.production.colors.map(c => c.hex.toUpperCase());
        for (const h of hexes) {
          if (!pairMap.has(h)) pairMap.set(h, new Map());
          for (const other of hexes) {
            if (other !== h) {
              const pm = pairMap.get(h)!;
              pm.set(other, (pm.get(other) || 0) + 1);
            }
          }
        }
      }
      for (const [hex, entry] of map) {
        const pm = pairMap.get(hex);
        if (pm) {
          entry.pairs = [...pm.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([pairHex, count]) => {
            const pe = map.get(pairHex)!;
            return { hex: pe.hex, zh: pe.zh, en: pe.en, count };
          });
        }
      }
      setColors([...map.values()]);
      setTotalEntries(total);
    };

    fetch("/api/content", { cache: "no-store" })
      .then(r => r.ok ? r.json() : Promise.reject(new Error("unavailable")))
      .then((content: PortfolioContent) => {
        setDisplayName(content.settings.displayName);
        buildColors(content.projects);
      })
      .catch(() => buildColors(defaultManagedProjects));
  }, []);

  useEffect(() => {
    localStorage.setItem("portfolio-lang", lang);
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  }, [lang]);

  useEffect(() => {
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    }), { threshold: 0.08 });
    document.querySelectorAll("[data-reveal]").forEach(node => reveal.observe(node));
    return () => reveal.disconnect();
  }, [colors.length, palette.length]);

  const switchTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("portfolio-theme", next);
  };

  const grouped = families.map(family => ({
    ...family,
    items: colors.filter(c => classify(c.hex) === family.id),
  })).filter(g => g.items.length > 0);

  const maxCount = Math.max(...colors.map(c => c.count), 1);

  return <main className="bases-page colors-page">
    <header className="site-header bases-header">
      <Link className="wordmark" href="/#top"><b>{displayName}.</b><span>FASHION PRINT DESIGNER</span></Link>
      <div className="page-switch" aria-label="Page switch">
        <Link href="/">{t.portfolio}</Link>
        <Link href="/bases">{t.bases}</Link>
        <Link className="active" href="/colors">{t.colors}</Link>
      </div>
      <div className="header-actions">
        <button className="theme-toggle" onClick={switchTheme} aria-label={theme === "light" ? t.themeLight : t.themeDark} aria-pressed={theme === "dark"}><i /><span>{theme === "light" ? "NIGHT" : "DAY"}</span></button>
        <button className="language" onClick={() => setLang(lang === "zh" ? "en" : "zh")} aria-label="Switch language">{lang === "zh" ? "EN" : "中文"}</button>
      </div>
    </header>

    <section className="garment-library garment-library-route" id="top">
      <div className="garment-library-head" data-reveal>
        <div className="section-tag"><span>01</span>COLOR ARCHIVE SYSTEM</div>
        <h1>{t.title}</h1>
        <p>{t.intro}</p>
      </div>
      <div className="base-route-note" data-reveal>
        <span>{colors.length} {t.totalColors}</span>
        <p>{t.intro}</p>
        <i>{totalEntries} {t.totalEntries}</i>
      </div>

      {grouped.map((group, gi) => <div className="color-family" key={group.id} data-reveal style={{ "--delay": `${gi * 60}ms` } as React.CSSProperties}>
        <div className="color-family-head">
          <span className="family-index">{String(gi + 1).padStart(2, "0")}</span>
          <h2>{lang === "zh" ? group.zh : group.en}</h2>
          <b>{group.items.length}</b>
        </div>
        <div className="color-grid">
          {group.items.map(color => {
            const pct = totalEntries ? (color.count / totalEntries) * 100 : 0;
            const barPct = (color.count / maxCount) * 100;
            return <article className="color-card" key={color.hex} onClick={() => generatePalette(color)} role="button" tabIndex={0} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); generatePalette(color); } }}>
            <div className="color-swatch" style={{ background: color.hex }}>
              {!isLight(color.hex) && <span className="swatch-hex-light">{color.hex}</span>}
              {isLight(color.hex) && <span className="swatch-hex-dark">{color.hex}</span>}
            </div>
            <div className="color-info">
              <h3>{lang === "zh" ? color.zh : color.en}</h3>
              <span>{color.hex.toUpperCase()}</span>
              <div className="color-ratio">
                <div className="ratio-bar"><div className="ratio-fill" style={{ width: `${barPct}%`, background: color.hex }} /></div>
                <small>{t.ratio} {pct.toFixed(1)}% · {color.count}/{totalEntries}</small>
              </div>
              <small>{t.used} {color.projects.length} {t.projects}</small>
              {color.pairs.length > 0 && <div className="color-pairs">
                <small className="pairs-label">{t.pairs}</small>
                <div className="pairs-list">
                  {color.pairs.slice(0, 4).map(p => <span className="pair-chip" key={p.hex} title={`${lang === "zh" ? p.zh : p.en} ${p.hex} ×${p.count}`}>
                    <i style={{ background: p.hex }} />
                  </span>)}
                </div>
              </div>}
            </div>
          </article>;
          })}
        </div>
      </div>)}

      {/* 推荐配色方案 */}
      <div className="palette-generator" data-reveal>
        <div className="palette-head">
          <div className="section-tag"><span>02</span>{t.paletteTitle}</div>
          <span className={`palette-copied ${copied ? "show" : ""}`}>{t.copied} ✓</span>
        </div>
        <p className="palette-hint">{palette.length > 0 ? t.paletteHint : t.clickToGen}</p>
        {palette.length > 0 && <div className="palette-display">
          {palette.map((slot, i) => <div className="palette-slot" key={i} style={{ background: slot.hex }}>
            <span className={isLight(slot.hex) ? "palette-label-dark" : "palette-label-light"}>
              <b>{slot.hex}</b>
              <small>{lang === "zh" ? slot.zh : slot.en}</small>
            </span>
          </div>)}
        </div>}
      </div>
    </section>

    <footer className="bases-footer">
      <span>© 2026 {displayName}</span>
      <span>{colors.length} COLORS / {totalEntries} ENTRIES / {grouped.length} FAMILIES</span>
      <Link href="/">BACK TO PORTFOLIO ↗</Link>
    </footer>
  </main>;
}
