"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminLink } from "../admin-link";
import { defaultSiteSettings, type Lang, type PortfolioContent } from "../projects";

const garments = [
  { slug: "outerwear", zh: "外套", en: "OUTERWEAR", src: "/models/garment-bases-v1/outerwear.png" },
  { slug: "top", zh: "上衣", en: "TOP", src: "/models/garment-bases-v1/top.png" },
  { slug: "tshirt", zh: "T 恤", en: "T-SHIRT", src: "/models/garment-bases-v1/tshirt.png" },
  { slug: "knit-top", zh: "针织上衣", en: "KNIT TOP", src: "/models/garment-bases-v1/knit-top.png" },
  { slug: "camisole", zh: "吊带 / 背心", en: "CAMISOLE / VEST", src: "/models/garment-bases-v1/camisole.png" },
  { slug: "hoodie", zh: "卫衣", en: "HOODIE", src: "/models/garment-bases-v1/hoodie.png" },
  { slug: "dress", zh: "连衣裙", en: "DRESS", src: "/models/garment-bases-v1/dress.png" },
  { slug: "skirt", zh: "半身裙", en: "SKIRT", src: "/models/garment-bases-v1/skirt.png" },
  { slug: "trousers", zh: "裤子", en: "TROUSERS", src: "/models/garment-bases-v1/trousers.png" },
  { slug: "shorts", zh: "短裤", en: "SHORTS", src: "/models/garment-bases-v1/shorts.png" },
  { slug: "jumpsuit", zh: "连体装", en: "JUMPSUIT", src: "/models/garment-bases-v1/jumpsuit.png" },
  { slug: "lingerie", zh: "内衣", en: "UNDERWEAR", src: "/models/garment-bases-v1/lingerie.png" },
] as const;

const copy = {
  zh: {
    title: "女装基模库",
    intro: "12 个无图案女装基模，统一采用 16:9 横幅与居中构图，为印花定位、配色和上身比例测试提供一致基础。",
    portfolio: "作品集",
    bases: "基模库",
    themeLight: "开启黑夜模式",
    themeDark: "切换为白天模式",
    note: "基模为概念 3D 服装，可在后续案例中替换面料、配色和印花。",
  },
  en: {
    title: "WOMENSWEAR BASES",
    intro: "12 unprinted womenswear bases in a consistent centered 16:9 format, ready for print placement, color and application studies.",
    portfolio: "PORTFOLIO",
    bases: "GARMENT BASES",
    themeLight: "Enable night mode",
    themeDark: "Switch to day mode",
    note: "Conceptual 3D garments ready for future fabric, color and print applications.",
  },
} as const;

export default function GarmentBasesPage() {
  const [lang, setLang] = useState<Lang>("zh");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [displayName, setDisplayName] = useState(defaultSiteSettings.displayName);
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

  const switchTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("portfolio-theme", next);
  };

  return <main className="bases-page">
    <header className="site-header bases-header">
      <Link className="wordmark" href="/#top"><b>{displayName}.</b><span>FASHION PRINT DESIGNER</span></Link>
      <div className="page-switch" aria-label="Page switch"><AdminLink href="/">{t.portfolio}</AdminLink><Link className="active" href="/bases">{t.bases}</Link><Link href="/prompts">{lang === "zh" ? "提示词库" : "PROMPTS"}</Link><Link href="/colors">{lang === "zh" ? "配色库" : "COLORS"}</Link></div>
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
          <div className="garment-media"><Image src={garment.src} alt={`${garment.zh} / ${garment.en} unprinted 3D garment base`} fill sizes="(max-width: 720px) 100vw, (max-width: 1080px) 50vw, 33vw" loading="lazy" unoptimized /></div>
          <figcaption><span>BASE {String(index + 1).padStart(2, "0")}</span><h2>{lang === "zh" ? garment.zh : garment.en}</h2><b>16:9 / CENTER</b></figcaption>
        </figure>)}
      </div>
    </section>

    <footer className="bases-footer"><span>© 2026 {displayName}</span><span>12 CONCEPT GARMENT BASES</span><Link href="/">BACK TO PORTFOLIO ↗</Link></footer>
  </main>;
}
