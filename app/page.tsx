"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AdminLink } from "./admin-link";
import {
  categoryLabels,
  defaultManagedProjects,
  defaultSiteSettings,
  modelCropStyle,
  modelLookbooks,
  modelPositions,
  type Category,
  type Lang,
  type ManagedProject,
  type PortfolioContent,
  type Project,
  type SoftwareItem,
} from "./projects";

const copy = {
  zh: {
    nav: ["首页", "关于", "简历", "能力", "案例", "联系"],
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
    profileTitle: "个人简历",
    profileNote: "基本信息、教育背景与工作经历一览",
    personalInfo: "个人信息",
    education: "教育水平",
    workExperience: "工作经历",
    softwareTitle: "软件掌握",
    softwareNote: "12 件常用工具 · 覆盖矢量、三维与 AI 协同全流程 · 悬停暂停并放大查看",
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
    lookbook: "模特展示 / 三视图",
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
    contactTitle: "THANK [YOU]\nWATCHING.",
    contactBody: "如果你正在寻找服装图案、视觉方向或插画合作，欢迎联系。",
    mail: "发起合作",
  },
  en: {
    nav: ["HOME", "ABOUT", "RESUME", "SKILLS", "CASES", "CONTACT"],
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
    profileTitle: "RESUME",
    profileNote: "Personal info, education background and work experience at a glance",
    personalInfo: "PERSONAL INFO",
    education: "EDUCATION",
    workExperience: "EXPERIENCE",
    softwareTitle: "SOFTWARE MASTERY",
    softwareNote: "12 essential tools across vector, 3D and AI workflows · hover to pause and zoom",
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
    lookbook: "LOOKBOOK / THREE VIEW",
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
    contactTitle: "THANK [YOU]\nWATCHING.",
    contactBody: "For fashion print, visual direction or illustration collaborations, get in touch.",
    mail: "START A PROJECT",
  },
};

const contacts = [
  { id: "qq", label: "QQ", value: "3176087576" },
  { id: "wechat", label: "微信", value: "17722850281" },
  { id: "email", label: "邮箱", value: "512338150@qq.com" },
] as const;

const categories: ("all" | Category)[] = ["all", "placement", "allover", "graphic", "illustration", "identity"];

type CaseOrigin = { top: number; right: number; bottom: number; left: number };

const softwareLogos: Record<string, string> = {
  illustrator: "/software-logos/ai-ai.png",
  photoshop: "/software-logos/adobe-photoshop-photo-editor.png",
  coreldraw: "/software-logos/CDR.png",
  clo3d: "/software-logos/CLO-3D.png",
  style3d: "/software-logos/styles 3D.jpg",
  "garment-et": "/software-logos/ET.png",
  workbuddy: "/software-logos/workbuddy-ai.png",
  claudecode: "/software-logos/claude-by-anthropic.png",
  codex: "/software-logos/codex-ai-remote-codex.png",
  gemini: "/software-logos/google-gemini-enterprise.png",
  catpawai: "/software-logos/meituan-catpaw.png",
  trae: "/software-logos/trae.png",
};

function SoftwareCard({ tool, lang }: { tool: SoftwareItem; lang: Lang }) {
  const tag = tool.category === "2d" ? "2D" : tool.category === "3d" ? "3D" : "AI";
  const pct = Math.round(tool.mastery * 100);
  const logo = softwareLogos[tool.id];
  return (
    <div className="sw-card" data-category={tool.category}>
      <div className="sw-card-top">
        <div className="sw-card-logo" data-cat={tool.category} data-sw={tool.id}>
          {logo ? <img src={logo} alt={tool.name} /> : <span>{tool.code}</span>}
        </div>
        <span className="sw-card-tag" data-cat={tool.category}>{tag}</span>
      </div>
      <h4 className="sw-card-name">{tool.name}</h4>
      <p className="sw-card-desc">{tool.description[lang]}</p>
      <div className="sw-card-bar">
        <div className="sw-card-track"><i style={{ width: `${pct}%` }} /></div>
        <span className="sw-card-level">{pct}%</span>
      </div>
    </div>
  );
}

function ContactIcon({ id }: { id: string }) {
  if (id === "qq") return (
    <svg viewBox="0 0 1024 1024" fill="currentColor" aria-hidden="true">
      <path d="M824.8 613.2c-16-51.4-34.4-94.6-62.7-165.3C766.5 262.2 689.3 112 511.5 112 331.7 112 256.2 265.2 261 447.9c-28.4 70.8-46.7 113.7-62.7 165.3-34 109.5-23 154.8-14.6 155.8 18 2.2 70.1-82.4 70.1-82.4 0 49 25.2 112.9 79.8 159-26.4 8.1-85.7 29.9-71.6 53.8 11.4 19.3 196.2 12.3 249.5 6.3 53.3 6 238.1 13 249.5-6.3 14.1-23.8-45.3-45.7-71.6-53.8 54.6-46.2 79.8-110.1 79.8-159 0 0 52.1 84.6 70.1 82.4 8.4-1.1 19.4-46.3-14.6-155.8z" />
    </svg>
  );
  if (id === "wechat") return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M9 3C5.1 3 2 5.7 2 9c0 1.7.9 3.2 2.2 4.2L3.5 16 6 14.8c.6.2 1.2.3 1.9.3-.1-.4-.2-.9-.2-1.3 0-3 2.7-5.5 6-5.5h.5C13.6 5 11.5 3 9 3zm-2.5 4a1 1 0 110 2 1 1 0 010-2zm5 0a1 1 0 110 2 1 1 0 010-2z" />
      <path d="M22 13.5c0-2.5-2.5-4.5-5.5-4.5S11 11 11 13.5s2.5 4.5 5.5 4.5c.5 0 1-.1 1.5-.2L20.5 19l-.5-2c1.2-.7 2-2 2-3.5zm-7 .5a.7.7 0 110-1.4.7.7 0 010 1.4zm3 0a.7.7 0 110-1.4.7.7 0 010 1.4z" />
    </svg>
  );
  if (id === "phone") return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 7l10 6.5L22 7" />
    </svg>
  );
}

export default function Home() {
  const [lang, setLang] = useState<Lang>("zh");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [category, setCategory] = useState<"all" | Category>("all");
  const [visible, setVisible] = useState(12);
  const [active, setActive] = useState<Project | null>(null);
  const [caseOrigin, setCaseOrigin] = useState<CaseOrigin | null>(null);
  const [settings, setSettings] = useState(defaultSiteSettings);
  const [portfolioProjects, setPortfolioProjects] = useState<ManagedProject[]>(defaultManagedProjects);
  const [activeSection, setActiveSection] = useState("top");
  const [copiedId, setCopiedId] = useState<string | null>(null);
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
    return [...selected, ...portfolioProjects.filter(project => !selected.includes(project))].slice(0, 6);
  }, [portfolioProjects, settings.heroSlugs]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/content", { cache: "no-store" })
      .then(response => response.ok ? response.json() : Promise.reject(new Error("content unavailable")))
      .then((content: PortfolioContent) => {
        if (!cancelled) {
          // 合并缺失的软件项：D1 可能用旧版 defaults 播种，缺少后新增的软件
          const defaultMap = new Map(defaultSiteSettings.software.map(s => [s.id, s]));
          const existingIds = new Set(content.settings.software.map(s => s.id));
          const mergedSoftware = [
            ...content.settings.software,
            ...defaultSiteSettings.software.filter(s => !existingIds.has(s.id)),
          ];
          setSettings({ ...content.settings, software: mergedSoftware, resume: content.settings.resume ?? defaultSiteSettings.resume });
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

  const [showTopBtn, setShowTopBtn] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTopBtn(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  // 左侧刻度尺导航：scrollspy 记录当前所在 section
  useEffect(() => {
    const ids = ["top", "about", "profile", "skills", "cases", "contact"];
    const sections = ids.map(id => document.getElementById(id)).filter((n): n is HTMLElement => Boolean(n));
    if (!sections.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(s => obs.observe(s));
    return () => obs.disconnect();
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
  const goToSection = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }); };
  const copyContact = (contact: { id: string; value: string }) => {
    navigator.clipboard.writeText(contact.value).then(() => {
      setCopiedId(contact.id);
      window.setTimeout(() => setCopiedId(null), 2000);
    }).catch(() => undefined);
  };
  const switchTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("portfolio-theme", next);
  };

  const sectionIds = ["top", "about", "profile", "skills", "cases", "contact"];
  const activeIndex = sectionIds.indexOf(activeSection);
  const tickerRows = useMemo(() => {
    const map = new Map(defaultSiteSettings.software.map(t => [t.id, t]));
    const enabled = settings.software.filter(t => t.enabled).map(t => {
      const d = map.get(t.id);
      return {
        ...t,
        category: (t.category ?? d?.category ?? "ai") as SoftwareItem["category"],
        mastery: typeof t.mastery === "number" ? t.mastery : (d?.mastery ?? 0.5),
      };
    });
    const perRow = Math.max(1, Math.ceil(enabled.length / 3));
    return [enabled.slice(0, perRow), enabled.slice(perRow, perRow * 2), enabled.slice(perRow * 2)];
  }, [settings.software]);

  return <main
    className={settings.handwrittenSoftware ? "handwritten-on" : ""}
    style={{ "--acid": settings.accentColor, "--hero-weight": settings.heroWeight } as React.CSSProperties}
  >
    <header className="site-header">
      <a className="wordmark" href="#top"><b>{settings.displayName}.</b><span>FASHION PRINT DESIGNER</span></a>
      <div className="page-switch" aria-label="Page switch"><AdminLink className="active" href="/">{lang === "zh" ? "作品集" : "PORTFOLIO"}</AdminLink><Link href="/gallery">{lang === "zh" ? "画廊" : "GALLERY"}</Link><Link href="/prompts">{lang === "zh" ? "提示词库" : "PROMPTS"}</Link><Link href="/bases">{lang === "zh" ? "基模库" : "GARMENT BASES"}</Link><Link href="/colors">{lang === "zh" ? "配色库" : "COLORS"}</Link></div>
      <nav aria-label="Primary navigation" style={{display:'none'}}>
        {["top", "about", "profile", "skills", "cases", "contact"].map((id, index) => <a href={`#${id}`} key={id} className={index === 5 ? "nav-crossed" : undefined}>{t.nav[index]}</a>)}
      </nav>
      <div className="header-actions">
        <button className="theme-toggle" onClick={switchTheme} aria-label={theme === "light" ? "开启黑夜模式" : "切换为白天模式"} aria-pressed={theme === "dark"}><i /><span>{theme === "light" ? "NIGHT" : "DAY"}</span></button>
        <button className="language" onClick={() => setLang(lang === "zh" ? "en" : "zh")} aria-label="Switch language">{lang === "zh" ? "EN" : "中文"}</button>
      </div>
    </header>

    <nav className="side-nav" aria-label={lang === "zh" ? "区块导航" : "Section navigation"}>
      <div className="side-nav-list">
        {sectionIds.map((id, i) => {
          const distance = Math.abs(i - activeIndex);
          const weight = Math.max(0.1, 1 - distance * 0.28);
          return (
            <button key={id} type="button"
              className={`side-nav-item${activeSection === id ? " active" : ""}`}
              style={{ "--weight": weight } as React.CSSProperties}
              onClick={() => goToSection(id)}
              aria-label={t.nav[i]}
              aria-current={activeSection === id ? "true" : undefined}>
              <span className="nav-line" />
              <span className="nav-title">{t.nav[i]}</span>
            </button>
          );
        })}
      </div>
    </nav>

    <section className="hero" id="top" onPointerMove={event => {
      const rect = event.currentTarget.getBoundingClientRect();
      event.currentTarget.style.setProperty("--mx", `${(event.clientX - rect.left) / rect.width - .5}`);
      event.currentTarget.style.setProperty("--my", `${(event.clientY - rect.top) / rect.height - .5}`);
    }}>
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-deco" aria-hidden="true">
        {/* ✦ 2大1小 实心/空心 */}
        <span className="hd-spark hd-solid" style={{top:"7%",left:"13%",fontSize:"4.5rem"}}>✦</span>
        <span className="hd-spark hd-hollow" style={{top:"54%",right:"8%",fontSize:"4rem"}}>✦</span>
        {/* 曲线蚂蚁线 SVG 粗细不一 */}
        <svg className="hd-curve hd-curve-1" viewBox="0 0 300 100" preserveAspectRatio="none"><path d="M0,80 Q75,10 150,50 T300,30" fill="none" /></svg>
        <svg className="hd-curve hd-curve-2" viewBox="0 0 300 100" preserveAspectRatio="none"><path d="M0,20 Q100,90 200,40 T300,70" fill="none" /></svg>
        <svg className="hd-curve hd-curve-3" viewBox="0 0 300 100" preserveAspectRatio="none"><path d="M10,50 Q80,5 160,60 Q220,90 290,20" fill="none" /></svg>
        <svg className="hd-curve hd-curve-4" viewBox="0 0 300 120" preserveAspectRatio="none"><path d="M0,60 C50,10 100,110 150,50 S250,10 300,60" fill="none" /></svg>
        <svg className="hd-curve hd-curve-5" viewBox="0 0 300 80" preserveAspectRatio="none"><path d="M0,40 Q60,0 120,40 T240,40 T300,40" fill="none" /></svg>
        <svg className="hd-curve hd-curve-6" viewBox="0 0 300 100" preserveAspectRatio="none"><path d="M0,90 C60,20 120,80 180,30 S280,70 300,10" fill="none" /></svg>
        <svg className="hd-curve hd-curve-7" viewBox="0 0 300 90" preserveAspectRatio="none"><path d="M0,30 Q70,80 140,20 T300,50" fill="none" /></svg>
      </div>
      <div className="hero-copy">
        <p className="eyebrow"><i />{t.eyebrow}</p>
        <h1 aria-label={`${t.heroA} ${t.heroB} ${t.heroC}`}><span>{t.heroA}</span><span>{t.heroB}</span><span>{t.heroC}</span></h1>
        <span className="hero-script" aria-hidden="true">Designed by me</span>
        <p className="hero-intro">{settings.heroIntro[lang]}</p>
        <div className="hero-orbit">
          <svg className="orbit-ring" viewBox="0 0 160 160" aria-hidden="true">
            <defs><path id="orbit-path" d="M80,80 m-66,0 a66,66 0 1,1 132,0 a66,66 0 1,1 -132,0" /></defs>
            <text><textPath href="#orbit-path" startOffset="0">CONCEPT STUDIES · PRINT ARCHIVE · 2026 · CONCEPT STUDIES · PRINT ARCHIVE · 2026 · </textPath></text>
          </svg>
          <span className="orbit-num">{portfolioProjects.length}</span>
          <small>CONCEPT<br />STUDIES</small>
        </div>
      </div>
      <div className="hero-visual" aria-label="Selected concept fashion cases">
        <div className="hero-boards">
          {heroProjects.map((project, index) => <div className={`hero-board board-${index + 1}`} key={project.slug}>
            <div className="single-model" role="img" aria-label={`${project.title} single female model garment effect`} style={modelCropStyle(project)} />
            <span>{project.id} / {project.title}</span>
          </div>)}
        </div>
        <div className="hero-tape" aria-hidden="true" />
        <div className="hero-tape hero-tape-2" aria-hidden="true" />
      </div>

      <div className="hero-contacts" data-copied={copiedId ?? ""}>
        {contacts.map((contact, i) => (
          <button key={contact.id} type="button"
            className={`hero-contact${copiedId === contact.id ? " copied" : ""}`}
            data-app={contact.id}
            style={{ "--idx": i } as React.CSSProperties}
            onClick={() => copyContact(contact)}
            aria-label={`复制${contact.label}: ${contact.value}`}>
            <span className="hero-contact-icon"><ContactIcon id={contact.id} /></span>
<span className="hero-contact-text">
<b>{copiedId === contact.id ? "已复制 ✓" : contact.value}</b>
</span>
          </button>
        ))}
      </div>
      <button type="button" className={`hero-phone-bar${copiedId === "phone" ? " copied" : ""}`}
        onClick={() => copyContact({ id: "phone", value: "17722850281" })}
        aria-label="复制手机号: 17722850281">
        <span className="hero-phone-icon"><ContactIcon id="phone" /></span>
        <span className="hero-phone-text"><b>{copiedId === "phone" ? "已复制 ✓" : "17722850281"}</b></span>
      </button>
      <div className="hero-mantra" aria-hidden="true">DESIGN FREELY / MAKE IT HAPPEN</div>
      <div className="hero-foot"><span>{t.concept}</span><span>{t.scroll} ↓</span></div>
    </section>

    <div className="ticker" aria-hidden="true"><div>{Array(2).fill("FASHION PRINT — GRAPHIC SYSTEM — ILLUSTRATION — COLOR & PRODUCTION — ").join("")}</div></div>

    <section className="about" id="about">
      <div className="about-deco-bl" aria-hidden="true"><div className="hero-cal-mini"><small>{new Date().toLocaleDateString(lang === "zh" ? "zh-CN" : "en-US", { month: "short" }).toUpperCase()} · {new Date().getFullYear()}</small><div className="cal-grid">{Array.from({ length: 31 }, (_, i) => i + 1).map(d => <span key={d} className={d === new Date().getDate() ? "today" : ""}>{d}</span>)}</div></div></div>
      <div className="section-tag" data-reveal><span>01</span>POINT OF VIEW</div>
      <div className="manifesto" data-reveal><p>{settings.manifesto[lang]}</p><i>↳</i></div>
      <div className="about-detail" data-reveal><div className="about-label">{settings.displayName}<br />PATTERN DESIGNER<br />{settings.city}</div><p>{settings.about[lang]}</p></div>
      <div className="fashion-tags about-fashion-tags" data-reveal aria-hidden="true"><span>FABRIC / COTTON JERSEY</span><span>PRINT SCALE / 380 × 480 MM</span><span>WOMENSWEAR / SS26</span></div>
    </section>

    <div className="ticker" aria-hidden="true"><div>{Array(2).fill("FASHION PRINT — GRAPHIC SYSTEM — ILLUSTRATION — COLOR & PRODUCTION — ").join("")}</div></div>

    <section className="profile" id="profile">
      <div className="profile-head" data-reveal>
        <div className="section-tag"><span>02</span>PERSONAL PROFILE</div>
        <h2>{t.profileTitle}</h2>
        <p>{t.profileNote}</p>
      </div>
      <div className="profile-grid" data-reveal>
        {/* 点缀图案 */}
        <div className="profile-deco profile-deco-1" aria-hidden="true" />
        <div className="profile-deco profile-deco-2" aria-hidden="true" />

        {/* 个人信息 */}
        <div className="profile-column">
          <h3 className="profile-column-title">{t.personalInfo}</h3>
          <dl className="profile-list">
            <div><dt>{lang === "zh" ? "姓名" : "NAME"}</dt><dd className="hl-name">{settings.displayName}</dd></div>
            <div><dt>{lang === "zh" ? "年龄" : "AGE"}</dt><dd className="hl-age">{settings.resume.age}</dd></div>
            <div><dt>{lang === "zh" ? "工龄" : "EXP"}</dt><dd className="hl-exp">{settings.resume.workYears}</dd></div>
            <div><dt>{lang === "zh" ? "职位" : "TITLE"}</dt><dd>PATTERN DESIGNER</dd></div>
            <div><dt>{lang === "zh" ? "所在地" : "CITY"}</dt><dd>{settings.city}</dd></div>
            <div><dt>{lang === "zh" ? "邮箱" : "EMAIL"}</dt><dd>{settings.email}</dd></div>
            <div><dt>QQ</dt><dd>3176087576</dd></div>
            <div><dt>{lang === "zh" ? "微信" : "WECHAT"}</dt><dd>17722850281</dd></div>
          </dl>
          <div className="profile-tags">
            <span className="profile-tags-label">{lang === "zh" ? "专业" : "MAJORS"}</span>
            <div className="profile-tags-items">{settings.resume.majors.map((m, i) => <span key={i} className="profile-tag hl-major">{m[lang]}</span>)}</div>
          </div>
          <div className="profile-tags">
            <span className="profile-tags-label">{lang === "zh" ? "爱好" : "HOBBIES"}</span>
            <div className="profile-tags-items">{settings.resume.hobbies.map((h, i) => <span key={i} className="profile-tag profile-tag-hobby">{h[lang]}</span>)}</div>
          </div>
        </div>
        {/* 教育水平 */}
        <div className="profile-column">
          <h3 className="profile-column-title">{t.education}</h3>
          <div className="profile-timeline">
            {settings.resume.education.map((edu, i) => (
              <div className="profile-entry" key={i}>
                <span className="profile-period">{edu.period[lang]}</span>
                <b className="profile-name hl-school">{edu.title[lang]}</b>
                <span className="profile-role">{edu.subtitle[lang]}</span>
                <p className="profile-note">{edu.note[lang]}</p>
              </div>
            ))}
          </div>
        </div>
        {/* 工作经历 */}
        <div className="profile-column">
          <h3 className="profile-column-title">{t.workExperience}</h3>
          <div className="profile-timeline">
            {settings.resume.work.map((work, i) => (
              <div className="profile-entry" key={i}>
                <span className="profile-period">{work.period[lang]}</span>
                <b className="profile-name hl-company">{work.title[lang]}</b>
                <span className="profile-role hl-role">{work.subtitle[lang]}</span>
                <p className="profile-note">{work.note[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <div className="ticker" aria-hidden="true"><div>{Array(2).fill("FASHION PRINT — GRAPHIC SYSTEM — ILLUSTRATION — COLOR & PRODUCTION — ").join("")}</div></div>

    <section className="skills" id="skills">
      <div className="skills-head" data-reveal><div className="section-tag"><span>03</span>CAPABILITY SYSTEM</div><h2><em className="hand-note">tools become visual language ↗</em>{t.softwareTitle}</h2><p>{t.softwareNote}</p></div>
      <div className="fashion-tags skill-fashion-tags" data-reveal aria-hidden="true"><span>COLOR SEPARATION / 04</span><span>REPEAT / 64 CM</span><span>CLO 3D FIT</span></div>
      <div className="software-ticker" data-reveal>
        {tickerRows.map((row, i) => (
          <div className="ticker-row" key={i} data-direction={i % 2 === 0 ? "left" : "right"}>
            <div className="ticker-track">
              {Array.from({ length: 6 }, () => row).flat().map((tool, j) => (
                <SoftwareCard key={`${tool.id}-${j}`} tool={tool} lang={lang} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>

    <div className="ticker" aria-hidden="true"><div>{Array(2).fill("FASHION PRINT — GRAPHIC SYSTEM — ILLUSTRATION — COLOR & PRODUCTION — ").join("")}</div></div>

    <section className="cases" id="cases">
      <div className="cases-head" data-reveal><div className="section-tag"><span>04</span>CASE ARCHIVE</div><h2>{t.casesTitle.replace(/^\d+/, String(portfolioProjects.length))}</h2><p>{t.casesIntro}</p></div>
      <div className="archive-stickers" data-reveal aria-hidden="true"><span>PRINT ARCHIVE</span><span>{portfolioProjects.length} / CONCEPT FILES</span><span>PROPOSED TECHNIQUE</span></div>
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
      <div className="contact-deco" aria-hidden="true"><span>✦</span><span>＋</span><span>◆</span><span>✕</span></div>
      <p>{t.contactKicker}</p><h2>{t.contactTitle.split("\n").map((line, i) => <span key={i}>{line.split(/(\[.*?\])/).map((part, j) => part.startsWith("[") ? <i key={j} className="rev">{part.slice(1, -1)}</i> : part)}</span>)}</h2>
      <div className="contact-row"><p>{t.contactBody}</p>
        <div className="contact-qr">
          <div className="qr-card"><div className="qr-img"><svg viewBox="0 0 25 25" aria-label="WeChat QR Code"><rect width="25" height="25" fill="#fff" /><g fill="#111"><rect x="0" y="0" width="7" height="7" /><rect x="1" y="1" width="5" height="5" fill="#fff" /><rect x="2" y="2" width="3" height="3" /><rect x="18" y="0" width="7" height="7" /><rect x="19" y="1" width="5" height="5" fill="#fff" /><rect x="20" y="2" width="3" height="3" /><rect x="0" y="18" width="7" height="7" /><rect x="1" y="19" width="5" height="5" fill="#fff" /><rect x="2" y="20" width="3" height="3" /><rect x="8" y="0" width="1" height="1" /><rect x="10" y="0" width="2" height="1" /><rect x="13" y="0" width="1" height="2" /><rect x="15" y="0" width="1" height="1" /><rect x="8" y="2" width="2" height="1" /><rect x="11" y="2" width="1" height="2" /><rect x="14" y="2" width="1" height="1" /><rect x="16" y="2" width="1" height="2" /><rect x="9" y="4" width="1" height="2" /><rect x="12" y="4" width="2" height="1" /><rect x="15" y="4" width="1" height="2" /><rect x="8" y="6" width="1" height="1" /><rect x="10" y="6" width="1" height="1" /><rect x="13" y="6" width="2" height="1" /><rect x="16" y="6" width="1" height="1" /><rect x="0" y="8" width="1" height="2" /><rect x="2" y="8" width="2" height="1" /><rect x="5" y="8" width="1" height="1" /><rect x="7" y="8" width="1" height="2" /><rect x="9" y="8" width="2" height="1" /><rect x="12" y="8" width="1" height="2" /><rect x="14" y="8" width="2" height="1" /><rect x="17" y="8" width="1" height="2" /><rect x="19" y="8" width="2" height="1" /><rect x="22" y="8" width="1" height="2" /><rect x="24" y="8" width="1" height="1" /><rect x="1" y="10" width="1" height="2" /><rect x="3" y="10" width="1" height="1" /><rect x="5" y="10" width="2" height="1" /><rect x="8" y="10" width="1" height="2" /><rect x="10" y="10" width="2" height="2" /><rect x="13" y="10" width="1" height="1" /><rect x="15" y="10" width="2" height="2" /><rect x="18" y="10" width="1" height="1" /><rect x="20" y="10" width="2" height="1" /><rect x="23" y="10" width="1" height="2" /><rect x="0" y="12" width="2" height="1" /><rect x="3" y="12" width="1" height="2" /><rect x="6" y="12" width="1" height="1" /><rect x="8" y="12" width="2" height="1" /><rect x="11" y="12" width="1" height="2" /><rect x="13" y="12" width="2" height="1" /><rect x="16" y="12" width="1" height="2" /><rect x="18" y="12" width="2" height="1" /><rect x="21" y="12" width="1" height="2" /><rect x="23" y="12" width="1" height="1" /><rect x="2" y="14" width="1" height="1" /><rect x="4" y="14" width="2" height="1" /><rect x="7" y="14" width="1" height="2" /><rect x="9" y="14" width="1" height="1" /><rect x="12" y="14" width="2" height="2" /><rect x="15" y="14" width="1" height="1" /><rect x="17" y="14" width="2" height="1" /><rect x="20" y="14" width="1" height="2" /><rect x="22" y="14" width="1" height="1" /><rect x="24" y="14" width="1" height="1" /><rect x="8" y="16" width="1" height="1" /><rect x="10" y="16" width="2" height="1" /><rect x="13" y="16" width="1" height="2" /><rect x="15" y="16" width="2" height="1" /><rect x="18" y="16" width="1" height="1" /><rect x="20" y="16" width="2" height="1" /><rect x="23" y="16" width="1" height="2" /><rect x="9" y="18" width="1" height="2" /><rect x="11" y="18" width="2" height="1" /><rect x="14" y="18" width="1" height="2" /><rect x="16" y="18" width="2" height="1" /><rect x="19" y="18" width="1" height="2" /><rect x="22" y="18" width="2" height="1" /><rect x="8" y="20" width="2" height="1" /><rect x="11" y="20" width="1" height="2" /><rect x="13" y="20" width="2" height="1" /><rect x="16" y="20" width="1" height="2" /><rect x="18" y="20" width="2" height="1" /><rect x="21" y="20" width="1" height="2" /><rect x="23" y="20" width="1" height="1" /><rect x="9" y="22" width="1" height="2" /><rect x="12" y="22" width="2" height="1" /><rect x="15" y="22" width="1" height="2" /><rect x="17" y="22" width="2" height="1" /><rect x="20" y="22" width="1" height="2" /><rect x="22" y="22" width="2" height="1" /><rect x="8" y="24" width="2" height="1" /><rect x="11" y="24" width="1" height="1" /><rect x="13" y="24" width="2" height="1" /><rect x="16" y="24" width="1" height="1" /><rect x="18" y="24" width="2" height="1" /><rect x="21" y="24" width="1" height="1" /><rect x="23" y="24" width="2" height="1" /></g></svg></div><span>WeChat</span></div>
          <div className="qr-card"><div className="qr-img"><svg viewBox="0 0 25 25" aria-label="QQ QR Code"><rect width="25" height="25" fill="#fff" /><g fill="#111"><rect x="0" y="0" width="7" height="7" /><rect x="1" y="1" width="5" height="5" fill="#fff" /><rect x="2" y="2" width="3" height="3" /><rect x="18" y="0" width="7" height="7" /><rect x="19" y="1" width="5" height="5" fill="#fff" /><rect x="20" y="2" width="3" height="3" /><rect x="0" y="18" width="7" height="7" /><rect x="1" y="19" width="5" height="5" fill="#fff" /><rect x="2" y="20" width="3" height="3" /><rect x="9" y="0" width="2" height="1" /><rect x="12" y="0" width="1" height="2" /><rect x="14" y="0" width="2" height="1" /><rect x="16" y="0" width="1" height="1" /><rect x="8" y="2" width="1" height="2" /><rect x="10" y="2" width="2" height="1" /><rect x="13" y="2" width="1" height="1" /><rect x="15" y="2" width="2" height="1" /><rect x="9" y="4" width="1" height="2" /><rect x="11" y="4" width="2" height="1" /><rect x="14" y="4" width="1" height="2" /><rect x="16" y="4" width="1" height="1" /><rect x="8" y="6" width="2" height="1" /><rect x="11" y="6" width="1" height="1" /><rect x="13" y="6" width="2" height="1" /><rect x="16" y="6" width="1" height="1" /><rect x="1" y="8" width="2" height="1" /><rect x="4" y="8" width="1" height="2" /><rect x="6" y="8" width="2" height="1" /><rect x="8" y="8" width="1" height="1" /><rect x="10" y="8" width="2" height="1" /><rect x="13" y="8" width="1" height="2" /><rect x="15" y="8" width="2" height="1" /><rect x="18" y="8" width="1" height="2" /><rect x="20" y="8" width="2" height="1" /><rect x="23" y="8" width="1" height="2" /><rect x="0" y="10" width="1" height="1" /><rect x="3" y="10" width="2" height="1" /><rect x="5" y="10" width="1" height="2" /><rect x="8" y="10" width="2" height="2" /><rect x="11" y="10" width="1" height="1" /><rect x="13" y="10" width="2" height="2" /><rect x="16" y="10" width="1" height="1" /><rect x="18" y="10" width="2" height="1" /><rect x="21" y="10" width="1" height="2" /><rect x="23" y="10" width="1" height="1" /><rect x="2" y="12" width="1" height="2" /><rect x="4" y="12" width="2" height="1" /><rect x="7" y="12" width="1" height="2" /><rect x="10" y="12" width="1" height="1" /><rect x="12" y="12" width="2" height="1" /><rect x="15" y="12" width="1" height="2" /><rect x="17" y="12" width="2" height="1" /><rect x="20" y="12" width="1" height="2" /><rect x="22" y="12" width="2" height="1" /><rect x="0" y="14" width="2" height="1" /><rect x="3" y="14" width="1" height="1" /><rect x="5" y="14" width="2" height="1" /><rect x="8" y="14" width="2" height="1" /><rect x="11" y="14" width="1" height="2" /><rect x="14" y="14" width="2" height="1" /><rect x="16" y="14" width="1" height="2" /><rect x="19" y="14" width="1" height="1" /><rect x="21" y="14" width="2" height="1" /><rect x="24" y="14" width="1" height="1" /><rect x="1" y="16" width="1" height="2" /><rect x="4" y="16" width="2" height="1" /><rect x="6" y="16" width="1" height="1" /><rect x="9" y="16" width="2" height="1" /><rect x="12" y="16" width="1" height="2" /><rect x="14" y="16" width="2" height="1" /><rect x="17" y="16" width="1" height="1" /><rect x="19" y="16" width="2" height="1" /><rect x="22" y="16" width="1" height="2" /><rect x="8" y="18" width="1" height="1" /><rect x="10" y="18" width="2" height="1" /><rect x="13" y="18" width="1" height="2" /><rect x="15" y="18" width="2" height="1" /><rect x="18" y="18" width="1" height="2" /><rect x="20" y="18" width="2" height="1" /><rect x="23" y="18" width="1" height="2" /><rect x="9" y="20" width="2" height="1" /><rect x="12" y="20" width="1" height="2" /><rect x="14" y="20" width="2" height="1" /><rect x="17" y="20" width="1" height="2" /><rect x="19" y="20" width="2" height="1" /><rect x="22" y="20" width="1" height="1" /><rect x="24" y="20" width="1" height="1" /><rect x="8" y="22" width="1" height="2" /><rect x="11" y="22" width="2" height="1" /><rect x="13" y="22" width="1" height="2" /><rect x="16" y="22" width="2" height="1" /><rect x="18" y="22" width="1" height="2" /><rect x="21" y="22" width="2" height="1" /><rect x="23" y="22" width="1" height="1" /><rect x="9" y="24" width="2" height="1" /><rect x="12" y="24" width="1" height="1" /><rect x="14" y="24" width="2" height="1" /><rect x="17" y="24" width="1" height="1" /><rect x="19" y="24" width="2" height="1" /><rect x="22" y="24" width="1" height="1" /><rect x="24" y="24" width="1" height="1" /></g></svg></div><span>QQ</span></div>
        </div>
      </div>
      <div className="contact-credits" data-copied={copiedId ?? ""}>
        <div className="contact-credits-row">
          <button type="button"
            className={`hero-contact contact-btn${copiedId === "qq" ? " copied" : ""}`}
            data-app="qq"
            onClick={() => copyContact(contacts[0])}
            aria-label={`复制${contacts[0].label}: ${contacts[0].value}`}>
            <span className="hero-contact-icon"><ContactIcon id="qq" /></span>
            <span className="hero-contact-text"><b>{copiedId === "qq" ? "已复制 ✓" : contacts[0].value}</b></span>
          </button>
          <button type="button"
            className={`hero-contact contact-btn${copiedId === "wechat" ? " copied" : ""}`}
            data-app="wechat"
            onClick={() => copyContact(contacts[1])}
            aria-label={`复制${contacts[1].label}: ${contacts[1].value}`}>
            <span className="hero-contact-icon"><ContactIcon id="wechat" /></span>
            <span className="hero-contact-text"><b>{copiedId === "wechat" ? "已复制 ✓" : contacts[1].value}</b></span>
          </button>
        </div>
        <div className="contact-credits-row">
          <button type="button"
            className={`hero-contact contact-btn${copiedId === "phone" ? " copied" : ""}`}
            data-app="phone"
            onClick={() => copyContact({ id: "phone", value: "17722850281" })}
            aria-label="复制手机号: 17722850281">
            <span className="hero-contact-icon"><ContactIcon id="phone" /></span>
            <span className="hero-contact-text"><b>{copiedId === "phone" ? "已复制 ✓" : "17722850281"}</b></span>
          </button>
          <button type="button"
            className={`hero-contact contact-btn${copiedId === "email" ? " copied" : ""}`}
            data-app="email"
            onClick={() => copyContact(contacts[2])}
            aria-label={`复制${contacts[2].label}: ${contacts[2].value}`}>
            <span className="hero-contact-icon"><ContactIcon id="email" /></span>
            <span className="hero-contact-text"><b>{copiedId === "email" ? "已复制 ✓" : contacts[2].value}</b></span>
          </button>
        </div>
      </div>
      <footer><span>© 2026 {settings.displayName}</span><span>CONCEPT PORTFOLIO / {settings.city}</span><a href="/admin">CONTENT ADMIN ↗</a><a href="#top">BACK TO TOP ↑</a></footer>
      <button className={`back-to-top-btn${showTopBtn ? " is-visible" : ""}`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="回到顶部"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg></button>
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
            <div className="visual-section">
              <div className="visual-heading"><span>02</span><h3>{t.lookbook}</h3></div>
              <div className="three-view">
                {modelLookbooks.map((src, i) => <figure key={src}><div><div className="single-model" role="img" aria-label={`${active.title} model look ${i + 1}`} style={{ "--model-image": `url("${src}")`, "--model-x": modelPositions[i] } as React.CSSProperties} /></div><figcaption>LOOK 0{i + 1}</figcaption></figure>)}
              </div>
            </div>
            <div className="visual-section">
              <div className="visual-heading"><span>03</span><h3>{t.original}</h3></div>
              <div className="artwork-grid">
                <figure className="process-art"><div className="single-model" role="img" aria-label={`${active.title} detail view`} style={{ "--model-image": `url("${modelLookbooks[0]}")`, "--model-x": modelPositions[3] } as React.CSSProperties} /><figcaption>{t.application} / 02</figcaption></figure>
                <div className="color-art" style={{ background: active.production.colors[0]?.hex ?? "#111" }}><span style={{ color: active.production.colors[1]?.hex ?? "#fff" }}>{active.title}</span>{active.production.colors.map(color => <b key={color.hex}>{color.hex}</b>)}</div>
              </div>
            </div>
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
