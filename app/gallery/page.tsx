"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AdminLink } from "../admin-link";
import { defaultSiteSettings, type Lang, type PortfolioContent } from "../projects";

type GalleryItem = {
  size: "sm" | "md" | "lg" | "wide" | "tall" | "xs" | "wx";
  type?: "image" | "text" | "logo";
  title?: string;
  desc?: string;
  fixed?: boolean;
  hue?: number;
};

type FillerSpec = { size: "xs" | "wx" | "sm"; word: string };

const copy = {
  zh: {
    title: "作品画廊",
    intro: "瀑布墙展示精选视觉作品，鼠标悬停聚焦卡片，点击查看大图。",
    portfolio: "作品集",
    gallery: "画廊",
    prompts: "提示词库",
    bases: "基模库",
    colors: "配色库",
    themeLight: "开启黑夜模式",
    themeDark: "切换为白天模式",
    close: "关闭",
  },
  en: {
    title: "VISUAL GALLERY",
    intro: "A masonry wall of selected visual works. Hover to focus, click to view full image.",
    portfolio: "PORTFOLIO",
    gallery: "GALLERY",
    prompts: "PROMPTS",
    bases: "GARMENT BASES",
    colors: "COLORS",
    themeLight: "Enable night mode",
    themeDark: "Switch to day mode",
    close: "CLOSE",
  },
} as const;

const fixedItems: GalleryItem[] = [
  { size: "wide", type: "text", title: "STUDIO ARCHIVE", desc: "Selected visual experiments", fixed: true },
  { size: "tall", type: "text", title: "PRINT\nLAB", fixed: true },
  { size: "sm", type: "text", title: "COLOR / 24", fixed: true },
  { size: "sm", type: "logo", fixed: true },
  { size: "md", type: "text", title: "SS26\nCONCEPT", desc: "Spring/Summer collection", fixed: true },
  { size: "sm", type: "text", title: "NEW", fixed: true },
  { size: "wide", type: "text", title: "VISUAL RESEARCH / 2026", desc: "Mood boards & references", fixed: true },
  { size: "sm", type: "text", title: "↗ MORE", fixed: true },
  { size: "tall", type: "text", title: "ARCHIVE\n2024 — 2026", fixed: true },
  { size: "sm", type: "text", title: "EXP", fixed: true },
  { size: "md", type: "text", title: "PROCESS\nNOTES", desc: "Behind the scenes", fixed: true },
  { size: "sm", type: "text", title: "↗", fixed: true },
  { size: "wide", type: "text", title: "FROM CONCEPT TO PRINT", desc: "Full design pipeline", fixed: true },
  { size: "sm", type: "text", title: "END", fixed: true },
];

// Short English pattern words for gap-filling cards
const fillerWords = [
  "PRINT", "TYPE", "GRID", "FORM", "LINE", "INK", "PATTERN",
  "TEXTURE", "WEAVE", "DYE", "CUT", "SEW", "FOLD", "PRESS",
  "MOOD", "SWATCH", "RATIO", "SCALE", "CROP", "LAYER",
  "WARP", "WEFT", "HEX", "RGB", "CMYK", "DOT", "STRIPE",
  "CHECK", "FLORAL", "GEOMETRY", "ABSTRACT", "MINIMAL", "BOLD",
  "SOFT", "DARK", "LIGHT", "WARM", "COOL", "NEUTRAL", "VIVID",
  "RAW", "REFINED", "BATCH", "SAMPLE", "DRAFT", "FINAL", "ARCHIVE",
];

// Two-word phrases for wider (2×1) filler cards
const fillerWide = [
  "VISUAL LAB", "COLOR STUDY", "PRINT TEST", "FABRIC SWATCH",
  "MOOD BOARD", "DESIGN NOTE", "PATTERN CUT", "SKETCH DRAFT",
  "DYE SAMPLE", "TYPE SPEC", "GRID STUDY", "FORM STUDY",
  "TEXTURE MAP", "COLOR WHEEL", "WEAVE TEST", "INK TRIAL",
];

const fillerSizes: ("sm" | "sm" | "sm" | "md")[] = ["sm", "sm", "sm", "md"];

const GAP = 6;

export default function GalleryPage() {
  const [lang, setLang] = useState<Lang>("zh");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [displayName, setDisplayName] = useState(defaultSiteSettings.displayName);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [fillers, setFillers] = useState<FillerSpec[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);
  const t = copy[lang];

  useEffect(() => {
    const saved = localStorage.getItem("portfolio-lang") as Lang | null;
    if (saved === "zh" || saved === "en") window.requestAnimationFrame(() => setLang(saved));
    const currentTheme = document.documentElement.dataset.theme;
    window.requestAnimationFrame(() => setTheme(currentTheme === "dark" ? "dark" : "light"));
    fetch("/api/content", { cache: "no-store" })
      .then(response => response.ok ? response.json() : Promise.reject(new Error("content unavailable")))
      .then((content: PortfolioContent) => setDisplayName(content.settings.displayName))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    localStorage.setItem("portfolio-lang", lang);
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  }, [lang]);

  useEffect(() => {
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    }), { threshold: 0.05 });
    document.querySelectorAll("[data-reveal]").forEach(node => reveal.observe(node));
    return () => reveal.disconnect();
  }, []);

  useEffect(() => {
    if (lightbox === null) { document.body.style.overflow = ""; return; }
    document.body.style.overflow = "hidden";
    setZoom(1);
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(null); };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoom(z => Math.min(6, Math.max(0.3, z + e.deltaY * -0.0015)));
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("wheel", onWheel);
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  // ── Setup grid rows + scan for empty cells, merge into varied fillers ──
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const init = () => {
      const isMobile = window.matchMedia("(max-width:720px)").matches;
      const numCols = isMobile ? 3 : 6;
      const rowH = parseInt(getComputedStyle(grid).gridAutoRows) || (isMobile ? 70 : 90);

      // 1. Setup grid-template-rows
      const totalRows = Math.max(1, Math.ceil((grid.scrollHeight + GAP) / (rowH + GAP)));
      const rows = Array.from({ length: totalRows }, (_, i) => `var(--r${i + 1}, ${rowH}px)`).join(" ");
      grid.style.gridTemplateRows = rows;

      // 2. After layout settles, scan for empty cells
      requestAnimationFrame(() => {
        const gridRect = grid.getBoundingClientRect();
        if (gridRect.width === 0) return;

        const colWidth = (gridRect.width - (numCols - 1) * GAP) / numCols;
        const cellW = colWidth + GAP;
        const cellH = rowH + GAP;

        const occupied = new Set<string>();
        let maxRow = 0;

        grid.querySelectorAll<HTMLElement>(".gw-card:not(.gw-filler)").forEach(card => {
          const rect = card.getBoundingClientRect();
          const cStart = Math.max(1, Math.floor((rect.left - gridRect.left + 1) / cellW) + 1);
          const cEnd = Math.min(numCols, Math.ceil((rect.right - gridRect.left - 1) / cellW));
          const rStart = Math.max(1, Math.floor((rect.top - gridRect.top + 1) / cellH) + 1);
          const rEnd = Math.ceil((rect.bottom - gridRect.top - 1) / cellH);

          for (let r = rStart; r <= rEnd; r++) {
            for (let c = cStart; c <= cEnd; c++) {
              occupied.add(`${r},${c}`);
            }
          }
          if (rEnd > maxRow) maxRow = rEnd;
        });

        // Build set of empty cells
        const emptySet = new Set<string>();
        for (let r = 1; r <= maxRow; r++) {
          for (let c = 1; c <= numCols; c++) {
            if (!occupied.has(`${r},${c}`)) emptySet.add(`${r},${c}`);
          }
        }

        // ── Merge adjacent empty cells into varied-size fillers ──
        const used = new Set<string>();
        const result: FillerSpec[] = [];
        let wIdx = 0; // index for wide phrases
        let sIdx = 0; // index for short words

        // Pass 1: horizontal pairs → wx (2×1)
        for (let r = 1; r <= maxRow; r++) {
          for (let c = 1; c < numCols; c++) {
            const k1 = `${r},${c}`;
            const k2 = `${r},${c + 1}`;
            if (emptySet.has(k1) && emptySet.has(k2) && !used.has(k1) && !used.has(k2)) {
              result.push({ size: "wx", word: fillerWide[wIdx % fillerWide.length] });
              wIdx++;
              used.add(k1); used.add(k2);
            }
          }
        }

        // Pass 2: vertical pairs → sm (1×2)
        for (let r = 1; r < maxRow; r++) {
          for (let c = 1; c <= numCols; c++) {
            const k1 = `${r},${c}`;
            const k2 = `${r + 1},${c}`;
            if (emptySet.has(k1) && emptySet.has(k2) && !used.has(k1) && !used.has(k2)) {
              result.push({ size: "sm", word: fillerWords[(sIdx + 50) % fillerWords.length] });
              sIdx++;
              used.add(k1); used.add(k2);
            }
          }
        }

        // Pass 3: remaining singles → xs (1×1)
        for (let r = 1; r <= maxRow; r++) {
          for (let c = 1; c <= numCols; c++) {
            const k = `${r},${c}`;
            if (emptySet.has(k) && !used.has(k)) {
              result.push({ size: "xs", word: fillerWords[(sIdx + 80) % fillerWords.length] });
              sIdx++;
              used.add(k);
            }
          }
        }

        // Shuffle fillers slightly so they don't look sequential
        for (let i = result.length - 1; i > 0; i--) {
          if (Math.random() > 0.5) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
          }
        }

        const key = result.map(f => `${f.size}:${f.word}`).join("|");
        const prevKey = fillers.map(f => `${f.size}:${f.word}`).join("|");
        if (key !== prevKey) setFillers(result);
      });
    };

    requestAnimationFrame(() => requestAnimationFrame(init));

    let timer: ReturnType<typeof setTimeout>;
    const onResize = () => { clearTimeout(timer); timer = setTimeout(init, 200); };
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("resize", onResize); clearTimeout(timer); };
  }, [fillers]);

  const switchTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("portfolio-theme", next);
  };

  // ── Hover: expand hovered card's grid tracks, squeeze everything else ──
  const handleCardHover = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const grid = gridRef.current;
    if (!grid) return;

    const cardRect = card.getBoundingClientRect();
    const gridRect = grid.getBoundingClientRect();
    if (gridRect.width === 0) return;

    const rowH = parseInt(getComputedStyle(grid).gridAutoRows) || 90;
    const isMobile = window.matchMedia("(max-width:720px)").matches;
    const numCols = isMobile ? 3 : 6;

    const colUnit = (gridRect.width - (numCols - 1) * GAP) / numCols + GAP;
    const colStart = Math.max(0, Math.min(numCols - 1, Math.floor((cardRect.left - gridRect.left) / colUnit)));
    const colEnd = Math.max(colStart + 1, Math.min(numCols, Math.ceil((cardRect.right - gridRect.left) / colUnit)));

    for (let c = 0; c < numCols; c++) {
      grid.style.setProperty(`--c${c + 1}`, c >= colStart && c < colEnd ? "1.3fr" : "0.93fr");
    }

    const rowUnit = rowH + GAP;
    const rowStart = Math.max(0, Math.floor((cardRect.top - gridRect.top) / rowUnit));
    const rowEnd = Math.max(rowStart + 1, Math.ceil((cardRect.bottom - gridRect.top) / rowUnit));
    const totalRows = Math.max(1, Math.ceil((grid.scrollHeight + GAP) / (rowH + GAP)));

    const expandH = Math.round(rowH * 1.18);
    const shrinkH = Math.round(rowH * 0.94);
    for (let r = 0; r < totalRows; r++) {
      grid.style.setProperty(`--r${r + 1}`, r >= rowStart && r < rowEnd ? `${expandH}px` : `${shrinkH}px`);
    }
  }, []);

  const handleGridLeave = useCallback(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const isMobile = window.matchMedia("(max-width:720px)").matches;
    const numCols = isMobile ? 3 : 6;
    const rowH = parseInt(getComputedStyle(grid).gridAutoRows) || 90;
    const totalRows = Math.max(1, Math.ceil((grid.scrollHeight + GAP) / (rowH + GAP)));

    for (let c = 0; c < numCols; c++) {
      grid.style.setProperty(`--c${c + 1}`, "1fr");
    }
    for (let r = 0; r < totalRows; r++) {
      grid.style.setProperty(`--r${r + 1}`, `${rowH}px`);
    }
  }, []);

  // ── Build items list (without dynamic fillers) ──
  const items = useMemo(() => {
    const result: GalleryItem[] = [];
    const sizes: ("sm" | "md" | "lg" | "wide" | "tall")[] = [
      "md", "sm", "lg", "tall", "md", "sm", "wide", "md",
      "sm", "lg", "tall", "md", "sm", "wide", "md", "lg",
      "sm", "tall", "md", "sm", "wide", "lg", "md", "sm",
      "tall", "md", "sm", "lg", "wide", "md", "sm", "tall",
      "md", "lg", "sm", "wide", "md", "tall", "sm", "lg",
      "md", "sm", "wide", "tall", "md", "sm", "lg", "md",
      "sm", "wide", "tall", "md", "lg", "sm",
    ];
    const insertPositions = [0, 4, 7, 11, 15, 19, 23, 27, 33, 39, 43, 47, 51, 55];
    const fillerPositions = [2, 5, 9, 13, 17, 21, 25, 29, 31, 35, 37, 41, 45, 49, 53, 57, 59, 61];
    let fixedIdx = 0;
    let imgIdx = 0;
    let fillerIdx = 0;
    for (let i = 0; i < 64; i++) {
      if (insertPositions.includes(i) && fixedIdx < fixedItems.length) {
        result.push(fixedItems[fixedIdx++]);
      } else if (fillerPositions.includes(i)) {
        result.push({
          size: fillerSizes[fillerIdx % fillerSizes.length],
          type: "text",
          title: fillerWords[fillerIdx % fillerWords.length],
        });
        fillerIdx++;
      } else {
        result.push({ size: sizes[imgIdx % sizes.length], type: "image", hue: (imgIdx * 37) % 360 });
        imgIdx++;
      }
    }
    return result;
  }, []);

  const imageCount = items.filter(i => i.type === "image").length;

  return <main className="bases-page gallery-page">
    <header className="site-header bases-header">
      <Link className="wordmark" href="/#top"><b>{displayName}.</b><span>FASHION PRINT DESIGNER</span></Link>
      <div className="page-switch" aria-label="Page switch">
        <AdminLink href="/">{t.portfolio}</AdminLink>
        <Link className="active" href="/gallery">{t.gallery}</Link>
        <Link href="/prompts">{t.prompts}</Link>
        <Link href="/bases">{t.bases}</Link>
        <Link href="/colors">{t.colors}</Link>
      </div>
      <div className="header-actions">
        <button className="theme-toggle" onClick={switchTheme} aria-label={theme === "light" ? t.themeLight : t.themeDark} aria-pressed={theme === "dark"}><i /><span>{theme === "light" ? "NIGHT" : "DAY"}</span></button>
        <button className="language" onClick={() => setLang(lang === "zh" ? "en" : "zh")} aria-label="Switch language">{lang === "zh" ? "EN" : "中文"}</button>
      </div>
    </header>

    <section className="garment-library garment-library-route gallery-section" id="top">
      <div className="garment-library-head" data-reveal>
        <div className="section-tag"><span>01</span>VISUAL GALLERY WALL</div>
        <h1>{t.title}</h1>
        <p>{t.intro}</p>
      </div>
      <div className="base-route-note" data-reveal>
        <span>{imageCount} IMAGES</span>
        <p>{t.intro}</p>
        <i>HOVER TO SQUEEZE · CLICK TO ZOOM</i>
      </div>

      <div className="gallery-grid" data-reveal ref={gridRef} onMouseLeave={handleGridLeave}>
        {items.map((item, i) => {
          const isImage = item.type === "image";
          return (
            <div
              className={`gw-card gw-${item.size}${item.fixed ? " gw-fixed" : ""}${item.type ? ` gw-${item.type}` : ""}`}
              key={i}
              onClick={() => isImage && setLightbox(i)}
              onMouseEnter={handleCardHover}
            >
              {item.type === "text" && <div className="gw-text-inner"><b>{item.title}</b>{item.desc && <span>{item.desc}</span>}</div>}
              {item.type === "logo" && <div className="gw-logo-inner"><span>LOGO</span></div>}
              {isImage && <div className="gw-img-inner" style={{ background: `hsl(${item.hue ?? (i * 37) % 360},45%,70%)` }} />}
            </div>
          );
        })}
        {fillers.map((f, i) => (
          <div
            className={`gw-card gw-${f.size} gw-text gw-filler`}
            key={`filler-${i}`}
            onMouseEnter={handleCardHover}
          >
            <div className="gw-text-inner"><b>{f.word}</b></div>
          </div>
        ))}
      </div>
    </section>

    <footer className="bases-footer">
      <span>© 2026 {displayName}</span>
      <span>{imageCount} VISUAL WORKS / GALLERY WALL</span>
      <Link href="/">BACK TO PORTFOLIO ↗</Link>
    </footer>

    {lightbox !== null && (
      <div className="gallery-lightbox" onClick={() => setLightbox(null)}>
        <div
          className="gallery-lightbox-inner"
          style={{
            background: `hsl(${(items[lightbox]?.hue ?? (lightbox * 37) % 360)},45%,70%)`,
            transform: `scale(${zoom})`,
          }}
        />
      </div>
    )}
  </main>;
}
