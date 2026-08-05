"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminLink } from "../admin-link";

type Lang = "zh" | "en";

type PromptEntry = {
  id: string;
  image: string;
  prompt: string;
  model: string;
  params: string;
  size: string;
  colors: string[];
  tags: string[];
};

const copy = {
  zh: {
    title: "提示词库",
    intro: "AI 生成的服装图案视觉，附完整提示词、模型参数与配色方案。点击复制提示词，点击下载图片。",
    portfolio: "作品集",
    gallery: "画廊",
    bases: "基模库",
    prompts: "提示词库",
    colors: "配色库",
    themeLight: "开启黑夜模式",
    themeDark: "切换为白天模式",
    copyPrompt: "复制提示词",
    copied: "已复制 ✓",
    download: "下载图片",
    close: "关闭",
    promptLabel: "提示词",
    modelLabel: "模型",
    paramsLabel: "参数",
    sizeLabel: "尺寸",
    paletteLabel: "配色",
    tagsLabel: "标签",
    hoverHint: "悬停查看提示词 · 点击打开详情",
  },
  en: {
    title: "AI PROMPT LIBRARY",
    intro: "AI-generated fashion print visuals with full prompts, model parameters and color palettes. Click to copy, download and explore.",
    portfolio: "PORTFOLIO",
    gallery: "GALLERY",
    bases: "GARMENT BASES",
    prompts: "PROMPTS",
    colors: "COLORS",
    themeLight: "Enable night mode",
    themeDark: "Switch to day mode",
    copyPrompt: "COPY PROMPT",
    copied: "COPIED ✓",
    download: "DOWNLOAD",
    close: "CLOSE",
    promptLabel: "PROMPT",
    modelLabel: "MODEL",
    paramsLabel: "PARAMS",
    sizeLabel: "SIZE",
    paletteLabel: "PALETTE",
    tagsLabel: "TAGS",
    hoverHint: "Hover for prompt · Click to open",
  },
} as const;

const entries: PromptEntry[] = [
  { id: "01", image: "/works/mutant-bloom.png", prompt: "Fashion print design, mutant botanical bloom, distorted petals merging with circuit patterns, acid lime and deep navy on bone white, placement print for cotton jersey tee, 380×480mm, CLO 3D render, top-down flat lay, high detail, studio lighting --ar 3:2 --v 6", model: "Midjourney V6", params: "--ar 3:2 --v 6 --stylize 280", size: "1536 × 1024", colors: ["#C7FF18", "#10182D", "#EDE8DC"], tags: ["placement", "botanical", "acid"] },
  { id: "02", image: "/works/soft-error.png", prompt: "Abstract fashion graphic, soft error texture, gradient noise bleeding into clean geometric shapes, hot pink and washed grey, full front print, distressed screen print aesthetic, 360×430mm, womenswear SS26 --ar 3:2 --v 6", model: "Midjourney V6", params: "--ar 3:2 --v 6 --chaos 15", size: "1536 × 1024", colors: ["#F13E91", "#777773", "#111111"], tags: ["graphic", "distressed", "pink"] },
  { id: "03", image: "/works/night-parade.png", prompt: "Dark fashion illustration, night parade scene, glowing figures in motion, electric blue trails on deep navy background, all-over print pattern, glow-in-the-dark ink simulation, 760×540mm, hoodie back panel --ar 3:2 --v 6", model: "Midjourney V6", params: "--ar 3:2 --v 6 --stylize 200", size: "1536 × 1024", colors: ["#2358FF", "#10182D", "#0D0D0D"], tags: ["allover", "glow", "blue"] },
  { id: "04", image: "/works/plastic-garden.png", prompt: "Surreal fashion print, plastic garden, synthetic flowers with chrome metallic surface, silver foil print effect, cream and chrome on white, center front placement, 310×380mm, concept portfolio --ar 3:2 --v 6", model: "Midjourney V6", params: "--ar 3:2 --v 6 --stylize 300", size: "1536 × 1024", colors: ["#C9CDD0", "#EDE6D7", "#F7F7F4"], tags: ["placement", "metallic", "chrome"] },
  { id: "05", image: "/works/tiny-panic.png", prompt: "Minimalist fashion graphic, tiny panic, small dense dots forming a screaming face, black on paper white, single color screen print, 300×340mm, white puff print on cobalt blue tee --ar 3:2 --v 6", model: "Midjourney V6", params: "--ar 3:2 --v 6 --stylize 150", size: "1536 × 1024", colors: ["#1648D7", "#F6F5F0", "#111111"], tags: ["graphic", "minimal", "puff"] },
  { id: "06", image: "/works/wear-the-noise.png", prompt: "Avant-garde fashion print, wear the noise, layered TV static and broadcast distortion patterns, reflective silver ink on black, center back print, 360×460mm, streetwear concept --ar 3:2 --v 6", model: "Midjourney V6", params: "--ar 3:2 --v 6 --chaos 25", size: "1536 × 1024", colors: ["#B8BDC1", "#0D0D0D", "#111111"], tags: ["identity", "reflective", "noise"] },
];

function isLight(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}

export default function PromptLibraryPage() {
  const [lang, setLang] = useState<Lang>("zh");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [active, setActive] = useState<PromptEntry | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const t = copy[lang];

  useEffect(() => {
    const saved = localStorage.getItem("portfolio-lang") as Lang | null;
    if (saved === "zh" || saved === "en") window.requestAnimationFrame(() => setLang(saved));
    const currentTheme = document.documentElement.dataset.theme;
    window.requestAnimationFrame(() => setTheme(currentTheme === "dark" ? "dark" : "light"));
  }, []);

  useEffect(() => {
    localStorage.setItem("portfolio-lang", lang);
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  }, [lang]);

  useEffect(() => {
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    }), { threshold: 0.1 });
    document.querySelectorAll("[data-reveal]").forEach(node => reveal.observe(node));
    return () => reveal.disconnect();
  }, []);

  useEffect(() => {
    if (!active) { document.body.style.overflow = ""; return; }
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") setActive(null); };
    window.addEventListener("keydown", onKeyDown);
    return () => { window.removeEventListener("keydown", onKeyDown); document.body.style.overflow = ""; };
  }, [active]);

  const switchTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("portfolio-theme", next);
  };

  const copyPrompt = (entry: PromptEntry) => {
    navigator.clipboard?.writeText(entry.prompt).then(() => {
      setCopiedId(entry.id);
      window.setTimeout(() => setCopiedId(null), 2000);
    }).catch(() => undefined);
  };

  const downloadImage = (entry: PromptEntry) => {
    const a = document.createElement("a");
    a.href = entry.image;
    a.download = `prompt-${entry.id}.png`;
    a.click();
  };

  return <main className="bases-page prompts-page">
    <header className="site-header bases-header">
      <Link className="wordmark" href="/#top"><b>YOUR NAME.</b><span>FASHION PRINT DESIGNER</span></Link>
<div className="page-switch" aria-label="Page switch">
<AdminLink href="/">{t.portfolio}</AdminLink>
<Link href="/gallery">{t.gallery}</Link>
<Link className="active" href="/prompts">{t.prompts}</Link>
        <Link href="/bases">{t.bases}</Link>
        <Link href="/colors">{t.colors}</Link>
      </div>
      <div className="header-actions">
        <button className="theme-toggle" onClick={switchTheme} aria-label={theme === "light" ? t.themeLight : t.themeDark} aria-pressed={theme === "dark"}><i /><span>{theme === "light" ? "NIGHT" : "DAY"}</span></button>
        <button className="language" onClick={() => setLang(lang === "zh" ? "en" : "zh")} aria-label="Switch language">{lang === "zh" ? "EN" : "中文"}</button>
      </div>
    </header>

    <section className="garment-library garment-library-route" id="top">
      <div className="garment-library-head" data-reveal>
        <div className="section-tag"><span>01</span>AI PROMPT ARCHIVE</div>
        <h1>{t.title}</h1>
        <p>{t.intro}</p>
      </div>
      <div className="base-route-note" data-reveal>
        <span>{entries.length} PROMPTS</span>
        <p>{t.hoverHint}</p>
        <i>CLICK TO COPY</i>
      </div>

      <div className="masonry prompts-masonry">
        {entries.map((entry, i) => <article className="prompt-card" data-reveal key={entry.id} style={{ "--delay": `${(i % 3) * 55}ms` } as React.CSSProperties}>
          <button onClick={() => setActive(entry)} aria-label={`Open prompt ${entry.id}`}>
            <div className="prompt-media">
              <Image src={entry.image} alt={`AI prompt ${entry.id} result`} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" loading="lazy" unoptimized />
              <div className="prompt-overlay"><p>{entry.prompt}</p></div>
              <span className="prompt-id">{entry.id}</span>
            </div>
            <div className="prompt-meta">
              <div className="prompt-tags">{entry.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
              <div className="prompt-actions">
                <span className="prompt-model">{entry.model}</span>
                <span className={`copy-btn ${copiedId === entry.id ? "copied" : ""}`} onClick={(e) => { e.stopPropagation(); e.preventDefault(); copyPrompt(entry); }}>{copiedId === entry.id ? t.copied : t.copyPrompt}</span>
              </div>
            </div>
          </button>
        </article>)}
      </div>
    </section>

    <footer className="bases-footer">
      <span>© 2026 YOUR NAME</span>
      <span>{entries.length} AI PROMPTS / {new Set(entries.map(e => e.model)).size} MODELS</span>
      <Link href="/">BACK TO PORTFOLIO ↗</Link>
    </footer>

    {active && <div className="drawer-layer" role="presentation">
      <button className="drawer-backdrop" onClick={() => setActive(null)} aria-label={t.close} />
      <aside className="case-drawer prompt-drawer" role="dialog" aria-modal="true" aria-labelledby="prompt-drawer-title">
        <button className="drawer-close" onClick={() => setActive(null)}>{t.close}<span>×</span></button>
        <div className="prompt-drawer-layout">
          <div className="prompt-drawer-visual">
            <Image src={active.image} alt={`AI prompt ${active.id} full view`} fill sizes="(max-width: 800px) 100vw, 50vw" unoptimized />
          </div>
          <div className="prompt-drawer-specs">
            <div className="spec-title"><span>PROMPT / {active.id}</span><h3 id="prompt-drawer-title">{active.tags.join(" · ")}</h3></div>
            <div className="prompt-drawer-section">
              <span className="spec-label">{t.promptLabel}</span>
              <p className="prompt-text">{active.prompt}</p>
              <button className="copy-prompt-btn" onClick={() => copyPrompt(active)}>{copiedId === active.id ? t.copied : t.copyPrompt}</button>
            </div>
            <dl>
              <div><dt>{t.modelLabel}</dt><dd>{active.model}</dd></div>
              <div><dt>{t.paramsLabel}</dt><dd>{active.params}</dd></div>
              <div><dt>{t.sizeLabel}</dt><dd>{active.size}</dd></div>
            </dl>
            <div className="prompt-drawer-section">
              <span className="spec-label">{t.paletteLabel}</span>
              <div className="prompt-palette">{active.colors.map(c => <div className="prompt-palette-chip" key={c} style={{ background: c }}>
                <span className={isLight(c) ? "palette-label-dark" : "palette-label-light"}>{c}</span>
              </div>)}</div>
            </div>
            <div className="prompt-drawer-section">
              <span className="spec-label">{t.tagsLabel}</span>
              <div className="prompt-tag-list">{active.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
            </div>
            <button className="download-btn" onClick={() => downloadImage(active)}>{t.download} ↓</button>
          </div>
        </div>
      </aside>
    </div>}
  </main>;
}
