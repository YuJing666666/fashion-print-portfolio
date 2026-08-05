"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminLink } from "../admin-link";
import { defaultSiteSettings, type Lang, type PortfolioContent } from "../projects";

type GarmentBase = {
  slug: string;
  zh: string;
  en: string;
  src: string;
  category: { zh: string; en: string };
  season: { zh: string; en: string };
  feature: { zh: string; en: string };
  mesh: string;
  polygons: string;
  texture: string;
  format: string;
  render: string;
  rigging: string;
};

const garments: GarmentBase[] = [
  { slug: "outerwear", zh: "外套", en: "OUTERWEAR", src: "/models/garment-bases-v1/outerwear.png", category: { zh: "外套 / 夹克", en: "Outerwear / Jacket" }, season: { zh: "秋冬 AW", en: "AW" }, feature: { zh: "宽肩廓形，落袖剪裁，可替换面料为羊毛混纺或防水尼龙", en: "Oversized shoulder, dropped sleeve, swappable wool blend or nylon shell" }, mesh: "Quad Topology", polygons: "42.8K tris", texture: "4K PBR", format: "FBX / GLB", render: "CLO 3D + Marvelous", rigging: "A-pose" },
  { slug: "top", zh: "上衣", en: "TOP", src: "/models/garment-bases-v1/top.png", category: { zh: "上衣 / 衬衫", en: "Top / Shirt" }, season: { zh: "四季 ALL", en: "All Season" }, feature: { zh: "修身版型，前中开扣，适合印花前胸满幅或局部贴布", en: "Slim fit, button front, ideal for full-chest or placement print" }, mesh: "Quad Topology", polygons: "28.4K tris", texture: "4K PBR", format: "FBX / GLB", render: "CLO 3D + Marvelous", rigging: "A-pose" },
  { slug: "tshirt", zh: "T 恤", en: "T-SHIRT", src: "/models/garment-bases-v1/tshirt.png", category: { zh: "T 恤 / 基础款", en: "T-Shirt / Basic" }, season: { zh: "春夏 SS", en: "SS" }, feature: { zh: "标准圆领，180g 纯棉手感，印花面积 380×480mm 预留", en: "Standard crew neck, 180g cotton feel, 380×480mm print area" }, mesh: "Quad Topology", polygons: "18.2K tris", texture: "4K PBR", format: "FBX / GLB", render: "CLO 3D + Marvelous", rigging: "A-pose" },
  { slug: "knit-top", zh: "针织上衣", en: "KNIT TOP", src: "/models/garment-bases-v1/knit-top.png", category: { zh: "针织 / 毛衣", en: "Knitwear / Sweater" }, season: { zh: "秋冬 AW", en: "AW" }, feature: { zh: "粗针提花结构，可模拟绞花与嵌花效果，支持多层印花叠加", en: "Chunky cable knit, supports intarsia and jacquard, multi-layer print" }, mesh: "Quad Topology", polygons: "56.7K tris", texture: "4K PBR", format: "FBX / GLB", render: "CLO 3D + Marvelous", rigging: "A-pose" },
  { slug: "camisole", zh: "吊带 / 背心", en: "CAMISOLE / VEST", src: "/models/garment-bases-v1/camisole.png", category: { zh: "吊带 / 背心", en: "Camisole / Vest" }, season: { zh: "春夏 SS", en: "SS" }, feature: { zh: "细吊带，修身剪裁，适合小面积印花与撞色拼接", en: "Spaghetti strap, slim cut, suited for small placement and color blocking" }, mesh: "Quad Topology", polygons: "16.3K tris", texture: "4K PBR", format: "FBX / GLB", render: "CLO 3D + Marvelous", rigging: "A-pose" },
  { slug: "hoodie", zh: "卫衣", en: "HOODIE", src: "/models/garment-bases-v1/hoodie.png", category: { zh: "卫衣 / 连帽", en: "Hoodie" }, season: { zh: "秋冬 AW", en: "AW" }, feature: { zh: "连帽落肩，重磅抓绒 400g，背部印花区 460×360mm", en: "Dropped shoulder hood, 400g fleece, 460×360mm back print zone" }, mesh: "Quad Topology", polygons: "38.1K tris", texture: "4K PBR", format: "FBX / GLB", render: "CLO 3D + Marvelous", rigging: "A-pose" },
  { slug: "dress", zh: "连衣裙", en: "DRESS", src: "/models/garment-bases-v1/dress.png", category: { zh: "连衣裙", en: "Dress" }, season: { zh: "春夏 SS", en: "SS" }, feature: { zh: "A 字廓形，及膝长度，全身可做满幅印花或下摆渐变", en: "A-line silhouette, knee length, full-body all-over or hem gradient print" }, mesh: "Quad Topology", polygons: "32.6K tris", texture: "4K PBR", format: "FBX / GLB", render: "CLO 3D + Marvelous", rigging: "A-pose" },
  { slug: "skirt", zh: "半身裙", en: "SKIRT", src: "/models/garment-bases-v1/skirt.png", category: { zh: "半身裙", en: "Skirt" }, season: { zh: "四季 ALL", en: "All Season" }, feature: { zh: "高腰百褶结构，动态褶皱模拟，支持印花条纹定向排列", en: "High-waist pleated, dynamic fold sim, directional stripe print ready" }, mesh: "Quad Topology", polygons: "34.9K tris", texture: "4K PBR", format: "FBX / GLB", render: "CLO 3D + Marvelous", rigging: "A-pose" },
  { slug: "trousers", zh: "裤子", en: "TROUSERS", src: "/models/garment-bases-v1/trousers.png", category: { zh: "长裤 / 西裤", en: "Trousers" }, season: { zh: "四季 ALL", en: "All Season" }, feature: { zh: "直筒微锥版型，侧缝印花预留区 200×400mm", en: "Straight tapered fit, 200×400mm side seam print zone" }, mesh: "Quad Topology", polygons: "26.8K tris", texture: "4K PBR", format: "FBX / GLB", render: "CLO 3D + Marvelous", rigging: "A-pose" },
  { slug: "shorts", zh: "短裤", en: "SHORTS", src: "/models/garment-bases-v1/shorts.png", category: { zh: "短裤", en: "Shorts" }, season: { zh: "春夏 SS", en: "SS" }, feature: { zh: "高腰宽松版型，裤腿印花面积 150×200mm，适合图形排版", en: "High-waist loose fit, 150×200mm leg print area, graphic layout ready" }, mesh: "Quad Topology", polygons: "19.5K tris", texture: "4K PBR", format: "FBX / GLB", render: "CLO 3D + Marvelous", rigging: "A-pose" },
  { slug: "jumpsuit", zh: "连体装", en: "JUMPSUIT", src: "/models/garment-bases-v1/jumpsuit.png", category: { zh: "连体装 / 工装", en: "Jumpsuit" }, season: { zh: "四季 ALL", en: "All Season" }, feature: { zh: "收腰连体结构，多口袋细节，全身印花连续性测试理想基模", en: "Waist-cinched one-piece, multi-pocket, ideal for continuous all-over print" }, mesh: "Quad Topology", polygons: "44.2K tris", texture: "4K PBR", format: "FBX / GLB", render: "CLO 3D + Marvelous", rigging: "A-pose" },
  { slug: "lingerie", zh: "内衣", en: "UNDERWEAR", src: "/models/garment-bases-v1/lingerie.png", category: { zh: "内衣 / 贴身", en: "Underwear" }, season: { zh: "四季 ALL", en: "All Season" }, feature: { zh: "无钢圈三角杯，超薄面料模拟，适合精致小图案与烫金工艺", en: "Wireless triangle cup, sheer fabric sim, suited for fine motifs and foil print" }, mesh: "Quad Topology", polygons: "14.7K tris", texture: "4K PBR", format: "FBX / GLB", render: "CLO 3D + Marvelous", rigging: "A-pose" },
];

const copy = {
  zh: {
    title: "女装基模库",
    intro: "12 个无图案女装基模，统一采用 16:9 横幅与居中构图，为印花定位、配色和上身比例测试提供一致基础。",
    portfolio: "作品集",
    gallery: "画廊",
    bases: "基模库",
    themeLight: "开启黑夜模式",
    themeDark: "切换为白天模式",
    note: "基模为概念 3D 服装，可在后续案例中替换面料、配色和印花。",
    close: "关闭",
    categoryLabel: "分类",
    seasonLabel: "季节",
    featureLabel: "特色描述",
    meshLabel: "拓扑结构",
    polygonsLabel: "面数",
    textureLabel: "贴图精度",
    formatLabel: "导出格式",
    renderLabel: "渲染引擎",
    riggingLabel: "绑骨姿态",
    hoverHint: "点击查看 3D 建模详情数据",
  },
  en: {
    title: "WOMENSWEAR BASES",
    intro: "12 unprinted womenswear bases in a consistent centered 16:9 format, ready for print placement, color and application studies.",
    portfolio: "PORTFOLIO",
    gallery: "GALLERY",
    bases: "GARMENT BASES",
    themeLight: "Enable night mode",
    themeDark: "Switch to day mode",
    note: "Conceptual 3D garments ready for future fabric, color and print applications.",
    close: "CLOSE",
    categoryLabel: "CATEGORY",
    seasonLabel: "SEASON",
    featureLabel: "FEATURE",
    meshLabel: "MESH",
    polygonsLabel: "POLYGONS",
    textureLabel: "TEXTURE",
    formatLabel: "FORMAT",
    renderLabel: "RENDER ENGINE",
    riggingLabel: "RIGGING",
    hoverHint: "Click to view 3D modeling spec data",
  },
} as const;

export default function GarmentBasesPage() {
  const [lang, setLang] = useState<Lang>("zh");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [displayName, setDisplayName] = useState(defaultSiteSettings.displayName);
  const [active, setActive] = useState<GarmentBase | null>(null);
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

  return <main className="bases-page">
    <header className="site-header bases-header">
      <Link className="wordmark" href="/#top"><b>{displayName}.</b><span>FASHION PRINT DESIGNER</span></Link>
      <div className="page-switch" aria-label="Page switch"><AdminLink href="/">{t.portfolio}</AdminLink><Link href="/gallery">{t.gallery}</Link><Link href="/prompts">{lang === "zh" ? "提示词库" : "PROMPTS"}</Link><Link className="active" href="/bases">{t.bases}</Link><Link href="/colors">{lang === "zh" ? "配色库" : "COLORS"}</Link></div>
      <div className="header-actions">
        <button className="theme-toggle" onClick={switchTheme} aria-label={theme === "light" ? t.themeLight : t.themeDark} aria-pressed={theme === "dark"}><i /><span>{theme === "light" ? "NIGHT" : "DAY"}</span></button>
        <button className="language" onClick={() => setLang(lang === "zh" ? "en" : "zh")} aria-label="Switch language">{lang === "zh" ? "EN" : "中文"}</button>
      </div>
    </header>

    <section className="garment-library garment-library-route" id="top">
      <div className="garment-library-head" data-reveal><div className="section-tag"><span>01</span>GARMENT BASE SYSTEM</div><h1>{t.title}</h1><p>{t.intro}</p></div>
      <div className="base-route-note" data-reveal><span>12 BASE MODELS</span><p>{t.note}</p><i>16:9 / CENTERED</i></div>
      <div className="garment-grid">
        {garments.map((garment, index) => <figure className="garment-card" data-reveal key={garment.slug} style={{ "--delay": `${(index % 3) * 65}ms` } as React.CSSProperties}>
          <button className="garment-card-btn" onClick={() => setActive(garment)} aria-label={`${t.close}: ${lang === "zh" ? garment.zh : garment.en}`}>
            <div className="garment-media"><Image src={garment.src} alt={`${garment.zh} / ${garment.en} unprinted 3D garment base`} fill sizes="(max-width: 720px) 100vw, (max-width: 1080px) 50vw, 33vw" loading="lazy" unoptimized /></div>
          </button>
          <figcaption>
            <div className="garment-info">
              <h2>{lang === "zh" ? garment.zh : garment.en}</h2>
              <div className="garment-tags">
                <span className="gtag">{lang === "zh" ? garment.category.zh : garment.category.en}</span>
                <span className="gtag">{lang === "zh" ? garment.season.zh : garment.season.en}</span>
              </div>
              <p className="garment-feature">{lang === "zh" ? garment.feature.zh : garment.feature.en}</p>
            </div>
            <div className="garment-side-labels"><span>BASE {String(index + 1).padStart(2, "0")}</span><b>16:9</b><b>CENTER</b></div>
          </figcaption>
        </figure>)}
      </div>
    </section>

    <footer className="bases-footer"><span>© 2026 {displayName}</span><span>12 CONCEPT GARMENT BASES</span><Link href="/">BACK TO PORTFOLIO ↗</Link></footer>

    {active && <div className="drawer-layer" role="presentation">
      <button className="drawer-backdrop" onClick={() => setActive(null)} aria-label={t.close} />
      <aside className="case-drawer base-drawer" role="dialog" aria-modal="true" aria-labelledby="base-drawer-title">
        <button className="drawer-close" onClick={() => setActive(null)}>{t.close}<span>×</span></button>
        <div className="base-drawer-layout">
          <div className="base-drawer-visual">
            <Image src={active.src} alt={`${active.zh} / ${active.en} 3D garment base full view`} fill sizes="(max-width: 800px) 100vw, 50vw" unoptimized />
          </div>
          <div className="base-drawer-specs">
            <div className="spec-title"><span>BASE / {active.slug.toUpperCase()}</span><h3 id="base-drawer-title">{lang === "zh" ? active.zh : active.en}</h3></div>
            <dl>
              <div><dt>{t.categoryLabel}</dt><dd>{lang === "zh" ? active.category.zh : active.category.en}</dd></div>
              <div><dt>{t.seasonLabel}</dt><dd>{lang === "zh" ? active.season.zh : active.season.en}</dd></div>
            </dl>
            <div className="base-drawer-section">
              <span className="spec-label">{t.featureLabel}</span>
              <p className="prompt-text">{lang === "zh" ? active.feature.zh : active.feature.en}</p>
            </div>
            <div className="base-drawer-section">
              <span className="spec-label">3D MODELING DATA</span>
              <dl className="base-tech-dl">
                <div><dt>{t.meshLabel}</dt><dd>{active.mesh}</dd></div>
                <div><dt>{t.polygonsLabel}</dt><dd>{active.polygons}</dd></div>
                <div><dt>{t.textureLabel}</dt><dd>{active.texture}</dd></div>
                <div><dt>{t.formatLabel}</dt><dd>{active.format}</dd></div>
                <div><dt>{t.renderLabel}</dt><dd>{active.render}</dd></div>
                <div><dt>{t.riggingLabel}</dt><dd>{active.rigging}</dd></div>
              </dl>
            </div>
          </div>
        </div>
      </aside>
    </div>}
  </main>;
}
