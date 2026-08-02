"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  categoryLabels,
  defaultManagedProjects,
  defaultSiteSettings,
  type Category,
  type Lang,
  type ManagedProject,
  type PortfolioContent,
  type Project,
} from "./projects";

const copy = {
  zh: {
    nav: ["首页", "关于", "能力", "案例", "联系"],
    eyebrow: "服装图案设计 / 平面 / 插画",
    heroA: "IDEAS INTO",
    heroB: "WEARABLE",
    heroC: "SIGNALS.",
    heroText: "我把观察、情绪与图形实验，转化为可以真正进入服装结构的视觉语言。",
    enter: "进入案例库",
    concept: "概念作品集 / 非商业项目",
    scroll: "向下探索",
    profile: "图案不是贴在衣服上的装饰，而是穿着者与外界交换信号的方式。",
    profileBody: "以服装图案为核心，我同时处理平面系统、插画、配色与印花落地。工作从趋势与素材研究开始，经过草图、图形系统、上身比例测试和工艺建议，最终形成完整而可沟通的视觉方案。",
    serviceTitle: "服务范围",
    processTitle: "工作流程",
    softwareTitle: "软件与执行能力",
    softwareNote: "能力说明以常用工作任务呈现，不使用虚构百分比。",
    casesTitle: "24 个图案实验",
    casesIntro: "8 个深度主案例 + 16 个目录案例。所有图片为统一生成的概念展示，不代表真实客户或量产成果。",
    all: "全部",
    loaded: "已展示",
    open: "打开案例",
    featured: "深度案例",
    catalog: "目录案例",
    drawerLabel: "概念案例 / 建议生产方案",
    original: "图案原稿与过程",
    application: "上身效果与技术视图",
    technical: "服装三视图",
    front: "正面",
    side: "侧面",
    back: "背面",
    garment: "服装类型",
    placement: "印花位置",
    technique: "建议工艺",
    size: "建议尺寸",
    palette: "配色",
    meaning: "图案意义",
    thinking: "创作思路",
    disclaimer: "本页为概念案例。工艺、尺寸与上身效果均为提案，进入生产前需打样验证。",
    close: "关闭案例",
    contactKicker: "自由合作 / 项目委托 / 视觉交流",
    contactTitle: "LET’S MAKE\nSOMETHING\nWEARABLE.",
    contactBody: "如果你正在寻找服装图案、视觉方向或插画合作，欢迎联系。",
    mail: "发起合作",
  },
  en: {
    nav: ["HOME", "ABOUT", "SKILLS", "CASES", "CONTACT"],
    eyebrow: "FASHION PRINT / GRAPHICS / ILLUSTRATION",
    heroA: "IDEAS INTO",
    heroB: "WEARABLE",
    heroC: "SIGNALS.",
    heroText: "I translate observation, emotion and graphic experiments into visual systems designed for real garments.",
    enter: "EXPLORE CASES",
    concept: "CONCEPT PORTFOLIO / NON-COMMERCIAL",
    scroll: "SCROLL TO EXPLORE",
    profile: "A print is not decoration placed on clothing. It is a signal exchanged between the wearer and the world.",
    profileBody: "Fashion print is my core practice, supported by graphic systems, illustration, color and production thinking. Each project moves from research and sketching to graphic systems, on-body scale tests and a proposed technique.",
    serviceTitle: "SERVICES",
    processTitle: "PROCESS",
    softwareTitle: "SOFTWARE & EXECUTION",
    softwareNote: "Capabilities are described through real tasks—not invented proficiency percentages.",
    casesTitle: "24 PRINT EXPERIMENTS",
    casesIntro: "8 in-depth studies + 16 catalog cases. Every image is a unified concept presentation, not a real client or production claim.",
    all: "ALL",
    loaded: "SHOWING",
    open: "OPEN CASE",
    featured: "IN-DEPTH",
    catalog: "CATALOG",
    drawerLabel: "CONCEPT STUDY / PROPOSED PRODUCTION",
    original: "ARTWORK & PROCESS",
    application: "ON-BODY & TECHNICAL",
    technical: "GARMENT THREE-VIEW",
    front: "FRONT",
    side: "SIDE",
    back: "BACK",
    garment: "GARMENT",
    placement: "PLACEMENT",
    technique: "PROPOSED TECHNIQUE",
    size: "PROPOSED SIZE",
    palette: "COLOR PALETTE",
    meaning: "MEANING",
    thinking: "CREATIVE THINKING",
    disclaimer: "This is a concept study. Technique, dimensions and mockups are proposals that require sampling before production.",
    close: "CLOSE CASE",
    contactKicker: "FREELANCE / COMMISSION / COLLABORATION",
    contactTitle: "LET’S MAKE\nSOMETHING\nWEARABLE.",
    contactBody: "For fashion print, visual direction or illustration collaborations, get in touch.",
    mail: "START A PROJECT",
  },
};

const services = [
  ["服装图案设计", "FASHION PRINT DESIGN"], ["定位印花与满版纹样", "PLACEMENT & REPEAT"],
  ["平面视觉系统", "GRAPHIC SYSTEMS"], ["插画与角色", "ILLUSTRATION"], ["配色与印花方向", "COLOR & PRINT DIRECTION"],
] as const;

const workflow = [
  ["01", "研究与采样", "RESEARCH & SAMPLING"], ["02", "概念与草图", "CONCEPT & SKETCH"],
  ["03", "图形系统", "GRAPHIC SYSTEM"], ["04", "上身与三视图", "APPLICATION & FLATS"],
  ["05", "工艺建议", "PRODUCTION PROPOSAL"],
] as const;

const categories: ("all" | Category)[] = ["all", "placement", "allover", "graphic", "illustration", "identity"];
const modelLookbooks = [
  "/models/female-lookbook-01.png",
  "/models/female-lookbook-02.png",
  "/models/female-lookbook-03.png",
] as const;
const modelPositions = ["0%", "33.333%", "66.667%", "100%"] as const;

function modelVisual(project: Project) {
  const index = Math.max(0, Number(project.id) - 1);
  return {
    src: modelLookbooks[Math.floor(index / 4) % modelLookbooks.length],
    position: modelPositions[index % modelPositions.length],
  };
}

function modelCropStyle(project: Project) {
  const visual = modelVisual(project);
  return {
    "--model-image": `url("${visual.src}")`,
    "--model-x": visual.position,
  } as React.CSSProperties;
}

type CaseOrigin = { top: number; right: number; bottom: number; left: number };

export default function Home() {
  const [lang, setLang] = useState<Lang>("zh");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [category, setCategory] = useState<"all" | Category>("all");
  const [visible, setVisible] = useState(12);
  const [active, setActive] = useState<Project | null>(null);
  const [caseOrigin, setCaseOrigin] = useState<CaseOrigin | null>(null);
  const [settings, setSettings] = useState(defaultSiteSettings);
  const [portfolioProjects, setPortfolioProjects] = useState<ManagedProject[]>(defaultManagedProjects);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const t = copy[lang];

  const filtered = useMemo(() => category === "all" ? portfolioProjects : portfolioProjects.filter(project => project.category === category), [category, portfolioProjects]);
  const shown = filtered.slice(0, visible);
  const heroProjects = useMemo(() => {
    const selected = settings.heroSlugs
      .map(slug => portfolioProjects.find(project => project.slug === slug))
      .filter((project): project is ManagedProject => Boolean(project));
    return [...selected, ...portfolioProjects.filter(project => !selected.includes(project))].slice(0, 3);
  }, [portfolioProjects, settings.heroSlugs]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/content", { cache: "no-store" })
      .then(response => response.ok ? response.json() : Promise.reject(new Error("content unavailable")))
      .then((content: PortfolioContent) => {
        if (!cancelled) {
          setSettings(content.settings);
          setPortfolioProjects(content.projects);
        }
      })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("portfolio-lang") as Lang | null;
    if (saved === "zh" || saved === "en") window.requestAnimationFrame(() => setLang(saved));
    const currentTheme = document.documentElement.dataset.theme;
    window.requestAnimationFrame(() => setTheme(currentTheme === "dark" ? "dark" : "light"));
  }, []);

  const closeProject = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete("case");
    history.pushState({}, "", url);
    setActive(null);
    setCaseOrigin(null);
    window.setTimeout(() => openerRef.current?.focus(), 20);
  }, []);

  useEffect(() => {
    localStorage.setItem("portfolio-lang", lang);
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  }, [lang]);

  // 半调揭示效果：鼠标划过淡淡照出底下的荧光色半调涂鸦图案
  useEffect(() => {
    let raf = 0;
    let lastX = 0, lastY = 0;
    const update = () => {
      document.documentElement.style.setProperty("--fx", `${lastX}px`);
      document.documentElement.style.setProperty("--fy", `${lastY}px`);
      raf = 0;
    };
    const onMove = (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    window.addEventListener("mousemove", onMove);
    return () => { window.removeEventListener("mousemove", onMove); if (raf) window.cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    }), { threshold: 0.12 });
    document.querySelectorAll("[data-reveal]").forEach(node => reveal.observe(node));
    return () => reveal.disconnect();
  }, [shown.length]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) setVisible(count => Math.min(count + 12, filtered.length));
    }, { rootMargin: "600px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, [filtered.length]);

  useEffect(() => {
    const syncCase = () => {
      const slug = new URLSearchParams(window.location.search).get("case");
      setCaseOrigin(null);
      setActive(slug ? portfolioProjects.find(project => project.slug === slug) ?? null : null);
    };
    const frame = window.requestAnimationFrame(syncCase);
    window.addEventListener("popstate", syncCase);
    return () => { window.cancelAnimationFrame(frame); window.removeEventListener("popstate", syncCase); };
  }, [portfolioProjects]);

  useEffect(() => {
    if (!active) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    window.setTimeout(() => closeRef.current?.focus(), 30);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeProject();
      if (event.key === "Tab") {
        const drawer = document.querySelector<HTMLElement>(".case-drawer");
        const focusable = drawer?.querySelectorAll<HTMLElement>('button, a, [tabindex]:not([tabindex="-1"])');
        if (!focusable?.length) return;
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => { window.removeEventListener("keydown", onKeyDown); document.body.style.overflow = ""; };
  }, [active, closeProject]);

  const openProject = (project: Project, trigger: HTMLElement) => {
    openerRef.current = trigger;
    const source = trigger.closest(".project-card") ?? trigger;
    const rect = source.getBoundingClientRect();
    setCaseOrigin({ top: rect.top, right: window.innerWidth - rect.right, bottom: window.innerHeight - rect.bottom, left: rect.left });
    const url = new URL(window.location.href);
    url.searchParams.set("case", project.slug);
    history.pushState({ case: project.slug }, "", url);
    setActive(project);
  };

  const switchCategory = (next: "all" | Category) => { setCategory(next); setVisible(12); };
  const switchTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("portfolio-theme", next);
  };

  return <main
    className={settings.handwrittenSoftware ? "handwritten-on" : ""}
    style={{ "--acid": settings.accentColor, "--hero-weight": settings.heroWeight } as React.CSSProperties}
  >
    <header className="site-header">
      <a className="wordmark" href="#top"><b>{settings.displayName}.</b><span>FASHION PRINT DESIGNER</span></a>
      <div className="page-switch" aria-label="Page switch"><Link className="active" href="/">{lang === "zh" ? "作品集" : "PORTFOLIO"}</Link><Link href="/bases">{lang === "zh" ? "基模库" : "GARMENT BASES"}</Link><Link href="/prompts">{lang === "zh" ? "提示词库" : "PROMPTS"}</Link><Link href="/colors">{lang === "zh" ? "配色库" : "COLORS"}</Link></div>
      <nav aria-label="Primary navigation">
        {["top", "about", "skills", "cases", "contact"].map((id, index) => <a href={`#${id}`} key={id}>{t.nav[index]}</a>)}
      </nav>
      <div className="header-actions">
        <button className="theme-toggle" onClick={switchTheme} aria-label={theme === "light" ? "开启黑夜模式" : "切换为白天模式"} aria-pressed={theme === "dark"}><i /><span>{theme === "light" ? "NIGHT" : "DAY"}</span></button>
        <button className="language" onClick={() => setLang(lang === "zh" ? "en" : "zh")} aria-label="Switch language">{lang === "zh" ? "EN" : "中文"}</button>
      </div>
    </header>

    <section className="hero" id="top" onPointerMove={event => {
      const rect = event.currentTarget.getBoundingClientRect();
      event.currentTarget.style.setProperty("--mx", `${(event.clientX - rect.left) / rect.width - .5}`);
      event.currentTarget.style.setProperty("--my", `${(event.clientY - rect.top) / rect.height - .5}`);
    }}>
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-copy">
        <p className="eyebrow"><i />{t.eyebrow}</p>
        <h1 aria-label={`${t.heroA} ${t.heroB} ${t.heroC}`}><span>{t.heroA}</span><span className="outline">{t.heroB}</span><span>{t.heroC}</span></h1>
        <span className="hero-script" aria-hidden="true">made by hand — Y.N.</span>
        <div className="hero-bottom"><p>{settings.heroIntro[lang]}</p></div>
      </div>
      <div className="hero-visual" aria-label="Selected concept fashion cases">
        {heroProjects.map((project, index) => <button className={`hero-board board-${index + 1}`} key={project.slug} onClick={event => openProject(project, event.currentTarget)} aria-label={`${t.open}: ${project.title}`}>
          <div className="single-model" role="img" aria-label={`${project.title} single female model garment effect`} style={modelCropStyle(project)} />
          <span>{project.id} / {project.title}</span>
        </button>)}
        <figure className="hero-3d-card">
          <Image src="/models/hero-3d-garments-v1.png" alt="Three conceptual 3D womenswear garments for print visualization" fill sizes="(max-width: 760px) 38vw, 16vw" unoptimized />
          <figcaption>3D GARMENT STUDY / CLO</figcaption>
        </figure>
        <div className="hero-color-card" aria-hidden="true"><small>COLOR SYSTEM / 01</small><div><i /><i /><i /><i /></div><b>#C8FF19<br />#1746D3<br />#F83F99</b></div>
        <div className="hero-type-card" aria-hidden="true"><span>TYPE STUDY</span><b>PRINT<br />SIGNAL</b><em>03 / 24</em></div>
        <div className="hero-label-stack" aria-hidden="true"><span>WOMENSWEAR</span><span>PLACEMENT PRINT</span><span>2026 / CONCEPT</span></div>
        <div className="hero-orbit"><span>{portfolioProjects.length}</span><small>CONCEPT<br />STUDIES</small></div>
      </div>

      {/* 服装设计标注：蚂蚁线 + 尺寸标识 */}
      <div className="crosshair tl" aria-hidden="true" />
      <div className="crosshair tr" aria-hidden="true" />
      <div className="crosshair bl" aria-hidden="true" />
      <div className="crosshair br" aria-hidden="true" />
      <div className="dimension horiz" style={{ position:"absolute", top:"18vh", right:"2.8vw" }} aria-hidden="true"><span>380 × 480 MM</span></div>
      <div className="dimension vert" style={{ position:"absolute", top:"calc(18vh + 60px)", right:"calc(2.8vw - 16px)" }} aria-hidden="true"><i /><i /></div>
      <div className="grain-line" style={{ position:"absolute", bottom:"120px", right:"48vw" }} aria-hidden="true">GRAIN LINE</div>
      <span className="tech-tag" style={{ position:"absolute", top:"78px", right:"2.8vw" }} aria-hidden="true">SS26 / CONCEPT</span>
      <a href="#cases" className="arrow-link hero-case-link">{t.enter}<b>↘</b></a>
      <div className="hero-foot"><span>{t.concept}</span><span>{t.scroll} ↓</span></div>
    </section>

    <div className="ticker" aria-hidden="true"><div>{Array(2).fill("FASHION PRINT — GRAPHIC SYSTEM — ILLUSTRATION — COLOR & PRODUCTION — ").join("")}</div></div>

    <section className="about" id="about">
      <div className="section-tag" data-reveal><span>01</span>POINT OF VIEW</div>
      <div className="manifesto" data-reveal><p>{settings.manifesto[lang]}</p><i>↳</i></div>
      <div className="about-detail" data-reveal><div className="about-label">{settings.displayName}<br />PATTERN DESIGNER<br />{settings.city}</div><p>{settings.about[lang]}</p></div>
      <div className="fashion-tags about-fashion-tags" data-reveal aria-hidden="true"><span>FABRIC / COTTON JERSEY</span><span>PRINT SCALE / 380 × 480 MM</span><span>WOMENSWEAR / SS26</span></div>
    </section>

    <div className="ticker" aria-hidden="true"><div>{Array(2).fill("FASHION PRINT — GRAPHIC SYSTEM — ILLUSTRATION — COLOR & PRODUCTION — ").join("")}</div></div>

    <section className="skills" id="skills">
      <div className="skills-head" data-reveal><div className="section-tag"><span>02</span>CAPABILITY SYSTEM</div><h2>{t.softwareTitle}</h2><p>{t.softwareNote}</p><em className="hand-note">tools become visual language ↗</em></div>
      <div className="fashion-tags skill-fashion-tags" data-reveal aria-hidden="true"><span>COLOR SEPARATION / 04</span><span>REPEAT / 64 CM</span><span>CLO 3D FIT</span></div>
      <div className="skills-body">
        <div className="software-column" data-reveal>
          <h3 className="column-title">{lang === "zh" ? "掌握软件" : "SOFTWARE"}</h3>
          <div className="software-grid">
            {settings.software.filter(tool => tool.enabled).map((tool, index) => <article className="software-card" data-reveal key={tool.id} style={{ "--delay": `${index * 45}ms` } as React.CSSProperties}>
              <div className="tool-code">{tool.code}</div><div><span>CORE TOOL 0{index + 1}</span><h3>{tool.name}</h3><p>{tool.description[lang]}</p></div><i>↗</i>
            </article>)}
          </div>
        </div>
        <div className="services-column" data-reveal>
          <div className="service-block"><h3 className="column-title">{t.serviceTitle}</h3>{services.map((service, index) => <div className="service-row" key={service[1]}><b>0{index + 1}</b><span>{lang === "zh" ? service[0] : service[1]}</span><i /></div>)}</div>
          <div className="process-block"><h3 className="column-title">{t.processTitle}</h3>{workflow.map(item => <div className="process-row" key={item[0]}><b>{item[0]}</b><span>{lang === "zh" ? item[1] : item[2]}</span><em>→</em></div>)}</div>
        </div>
      </div>
    </section>

    <div className="ticker" aria-hidden="true"><div>{Array(2).fill("FASHION PRINT — GRAPHIC SYSTEM — ILLUSTRATION — COLOR & PRODUCTION — ").join("")}</div></div>

    <section className="cases" id="cases">
      <div className="cases-head" data-reveal><div className="section-tag"><span>03</span>CASE ARCHIVE</div><h2>{t.casesTitle}</h2><p>{t.casesIntro}</p></div>
      <div className="archive-stickers" data-reveal aria-hidden="true"><span>PRINT ARCHIVE</span><span>24 / CONCEPT FILES</span><span>PROPOSED TECHNIQUE</span></div>
      <div className="filter-bar" role="toolbar" aria-label="Project categories">
        <div>{categories.map(item => <button aria-pressed={category === item} className={category === item ? "active" : ""} key={item} onClick={() => switchCategory(item)}>{item === "all" ? t.all : categoryLabels[item][lang]}</button>)}</div>
        <span>{t.loaded} {String(shown.length).padStart(2, "0")} / {String(filtered.length).padStart(2, "0")}</span>
      </div>
      <div className="masonry">
        {shown.map(project => <article className="project-card" data-reveal key={project.slug}>
          <button onClick={event => openProject(project, event.currentTarget)} aria-label={`${t.open}: ${project.title}`}>
            <div className="project-media">
              <div className="model-layer single-model" role="img" aria-label={`${project.title} single female model garment effect`} style={modelCropStyle(project)} />
              <span className="case-kind">{project.featured ? t.featured : t.catalog}</span><i className="open-mark">↗</i>
            </div>
            <div className="project-meta"><span>{project.id}</span><div><h3>{project.title}</h3><p>{categoryLabels[project.category][lang]} · {project.year}</p></div><b>{t.open}</b></div>
          </button>
        </article>)}
      </div>
      <div className="load-sentinel" ref={sentinelRef} aria-hidden="true"><span /></div>
    </section>

    <div className="ticker" aria-hidden="true"><div>{Array(2).fill("FASHION PRINT — GRAPHIC SYSTEM — ILLUSTRATION — COLOR & PRODUCTION — ").join("")}</div></div>

    <section className="contact" id="contact">
      <p>{t.contactKicker}</p><h2>{t.contactTitle.split("\n").map(line => <span key={line}>{line}</span>)}</h2>
      <div className="contact-row"><p>{t.contactBody}</p><a href={`mailto:${settings.email}`}>{t.mail}<i>↗</i></a></div>
      <footer><span>© 2026 {settings.displayName}</span><span>CONCEPT PORTFOLIO / {settings.city}</span><a href="/admin">CONTENT ADMIN ↗</a><a href="#top">BACK TO TOP ↑</a></footer>
    </section>

    {active && <div className="drawer-layer" role="presentation">
      <button className="drawer-backdrop" onClick={closeProject} aria-label={t.close} />
      <aside className="case-drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title" style={caseOrigin ? {
        "--case-top": `${Math.max(0, caseOrigin.top)}px`,
        "--case-right": `${Math.max(0, caseOrigin.right)}px`,
        "--case-bottom": `${Math.max(0, caseOrigin.bottom)}px`,
        "--case-left": `${Math.max(0, caseOrigin.left)}px`,
      } as React.CSSProperties : undefined}>
        <button className="drawer-close" ref={closeRef} onClick={closeProject}>{t.close}<span>×</span></button>
        <div className="drawer-layout">
          <div className="drawer-visuals">
            <div className="drawer-intro"><span>{active.id} / {active.year}</span><p>{t.drawerLabel}</p><h2 id="drawer-title">{active.title}</h2></div>
            <figure className="case-hero model-case-hero"><div className="single-model" role="img" aria-label={`${active.title} single female model garment effect`} style={modelCropStyle(active)} /><figcaption>{t.application} / 01</figcaption></figure>
            <div className="drawer-end"><span>END OF CASE {active.id}</span><i>✦</i></div>
          </div>
          <div className="drawer-specs">
            <div className="spec-title"><span>PROJECT FILE / {active.id}</span><h3>{active.title}</h3><p>{active.story.meaning[lang]}</p></div>
            <div className="spec-top"><span>{active.featured ? t.featured : t.catalog}</span><b>{categoryLabels[active.category][lang]}</b></div>
            <dl>
              <div><dt>{t.garment}</dt><dd>{active.production.garment[lang]}</dd></div>
              <div><dt>{t.placement}</dt><dd>{active.production.placement[lang]}</dd></div>
              <div><dt>{t.technique}</dt><dd>{active.production.techniques.map(technique => technique[lang]).join(" + ")}</dd></div>
              <div><dt>{t.size}</dt><dd>{active.production.size}</dd></div>
            </dl>
            <div className="palette"><h3>{t.palette}</h3>{active.production.colors.map(color => <div key={color.hex}><i style={{ background: color.hex }} /><span>{color.name[lang]}</span><b>{color.hex}</b></div>)}</div>
            <div className="story"><span>{t.meaning}</span><p>{active.story.meaning[lang]}</p><span>{t.thinking}</span><p>{active.story.concept[lang]}</p></div>
            <p className="case-disclaimer">* {t.disclaimer}</p>
          </div>
        </div>
      </aside>
    </div>}

    {/* 半调揭示层 */}
    <div className="halftone-reveal" aria-hidden="true" />
  </main>;
}
