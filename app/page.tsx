"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";

type Lang = "zh" | "en";
type Localized = Record<Lang, string>;
type Project = {
  id: string;
  title: string;
  category: Localized;
  description: Localized;
  image: string;
  accent: string;
  size: "wide" | "tall" | "square";
};

const projects: Project[] = [
  { id: "01", title: "MUTANT BLOOM", category: { zh: "服装印花", en: "FASHION PRINT" }, description: { zh: "眼睛、花瓣与液态形状组成的变异花园。", en: "A mutant garden of eyes, petals and liquid forms." }, image: "/works/mutant-bloom.png", accent: "#ff3ba7", size: "wide" },
  { id: "02", title: "SOFT ERROR", category: { zh: "连续纹样", en: "REPEAT PATTERN" }, description: { zh: "把像素故障变成柔软、古怪的可穿着纹样。", en: "Pixel glitches made soft, strange and wearable." }, image: "/works/soft-error.png", accent: "#b9ff00", size: "tall" },
  { id: "03", title: "NIGHT PARADE", category: { zh: "服装印花", en: "FASHION PRINT" }, description: { zh: "午夜生物、牙齿与星芒的黑色游行。", en: "A black parade of midnight creatures, teeth and stars." }, image: "/works/night-parade.png", accent: "#2248ff", size: "square" },
  { id: "04", title: "PLASTIC GARDEN", category: { zh: "图形实验", en: "GRAPHIC EXPERIMENT" }, description: { zh: "铬色花朵与充气管道构成的人造生态。", en: "An artificial ecology of chrome blooms and inflatable tubes." }, image: "/works/plastic-garden.png", accent: "#d9d9d9", size: "tall" },
  { id: "05", title: "TINY PANIC CLUB", category: { zh: "插画", en: "ILLUSTRATION" }, description: { zh: "一群小怪物用跳舞消化日常焦虑。", en: "Little oddballs dancing their everyday panic away." }, image: "/works/tiny-panic.png", accent: "#ff3ba7", size: "wide" },
  { id: "06", title: "WEAR THE NOISE", category: { zh: "视觉系统", en: "VISUAL SYSTEM" }, description: { zh: "为街头服装构建的模块化噪点图形语言。", en: "A modular language of graphic noise for streetwear." }, image: "/works/wear-the-noise.png", accent: "#b9ff00", size: "square" },
];

const copy = {
  zh: {
    nav: ["作品", "能力", "关于", "联系"],
    eyebrow: "独立图案设计师 · 平面设计 · 插画",
    heroA: "穿上",
    heroB: "我的怪念头",
    intro: "我把颜色、怪角色和偶然错误变成可以穿在身上的图案。这里是一间持续变异的视觉实验室。",
    scroll: "向下探索",
    workTitle: "精选实验",
    workSub: "CONCEPT WORKS · 2026",
    concept: "概念作品",
    open: "展开作品",
    skillTitle: "能力不是清单，\n是我的玩具箱。",
    skills: ["服装图案", "平面设计", "插画设计", "色彩与印花", "视觉方向"],
    skillNote: "拖动它们，看看技能之间如何碰撞。",
    aboutTitle: "设计宣言",
    about: "我喜欢不那么正确的图形：太亮的颜色、笨拙的线条、可爱的怪东西。我的工作游走在服装图案、平面设计和插画之间，让每一块布料都像一张会走路的海报。",
    contactTitle: "有一个怪项目？",
    contactSub: "欢迎来信。一起把它做得更响、更怪、更好玩。",
    cta: "发邮件给我",
    close: "关闭",
    footer: "为好奇的人制造视觉噪音。",
  },
  en: {
    nav: ["WORK", "SKILLS", "ABOUT", "CONTACT"],
    eyebrow: "INDEPENDENT PATTERN DESIGNER · GRAPHICS · ILLUSTRATION",
    heroA: "WEAR",
    heroB: "THE WEIRD",
    intro: "I turn color, odd characters and happy accidents into things you can wear. Welcome to my ever-mutating visual lab.",
    scroll: "SCROLL TO EXPLORE",
    workTitle: "SELECTED EXPERIMENTS",
    workSub: "CONCEPT WORKS · 2026",
    concept: "CONCEPT WORK",
    open: "OPEN PROJECT",
    skillTitle: "SKILLS AREN'T A LIST.\nTHEY'RE MY TOY BOX.",
    skills: ["FASHION PATTERN", "GRAPHIC DESIGN", "ILLUSTRATION", "COLOR & PRINT", "VISUAL DIRECTION"],
    skillNote: "Drag them around and see how the skills collide.",
    aboutTitle: "DESIGN MANIFESTO",
    about: "I like graphics that feel a little wrong: colors too loud, lines too clumsy, creatures too cute to be normal. My practice moves between fashion pattern, graphic design and illustration—turning every piece of fabric into a walking poster.",
    contactTitle: "GOT A WEIRD PROJECT?",
    contactSub: "Say hello. Let's make it louder, stranger and more fun.",
    cta: "EMAIL ME",
    close: "CLOSE",
    footer: "MAKING VISUAL NOISE FOR CURIOUS PEOPLE.",
  },
};

function MagneticLink({ children, href, className = "" }: { children: React.ReactNode; href: string; className?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const move = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * 0.14;
    const y = (event.clientY - rect.top - rect.height / 2) * 0.14;
    event.currentTarget.style.transform = `translate(${x}px, ${y}px)`;
  };
  return <a ref={ref} href={href} className={`magnetic ${className}`} onMouseMove={move} onMouseLeave={(e) => (e.currentTarget.style.transform = "")}>{children}</a>;
}

export default function Home() {
  const [lang, setLang] = useState<Lang>("zh");
  const [active, setActive] = useState<Project | null>(null);
  const [cursor, setCursor] = useState({ x: -100, y: -100 });
  const [skillOrder, setSkillOrder] = useState([0, 1, 2, 3, 4]);
  const t = copy[lang];

  useEffect(() => {
    const saved = localStorage.getItem("acid-lab-language") as Lang | null;
    if (saved === "zh" || saved === "en") setLang(saved);
    const onMove = (e: PointerEvent) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    localStorage.setItem("acid-lab-language", lang);
  }, [lang]);

  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "";
    const close = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [active]);

  const shuffleSkill = (index: number) => setSkillOrder((order) => {
    const next = [...order];
    const current = next.indexOf(index);
    const target = (current + 2) % next.length;
    next.splice(current, 1);
    next.splice(target, 0, index);
    return next;
  });

  return (
    <main>
      <div className="cursor" style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)` }} aria-hidden="true" />
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Acid Lab home"><span>Y/N</span><small>VISUAL LAB</small></a>
        <nav aria-label="Primary navigation">
          {["work", "skills", "about", "contact"].map((id, i) => <a key={id} href={`#${id}`}>{t.nav[i]}</a>)}
        </nav>
        <button className="lang" onClick={() => setLang(lang === "zh" ? "en" : "zh")} aria-label={lang === "zh" ? "Switch to English" : "切换到中文"}>{lang === "zh" ? "EN" : "中"}<span>↗</span></button>
      </header>

      <section className="hero" id="top">
        <div className="grain" aria-hidden="true" />
        <p className="eyebrow">{t.eyebrow}</p>
        <h1><span>{t.heroA}</span><span className="outline">{t.heroB}</span></h1>
        <p className="hero-intro">{t.intro}</p>
        <div className="hero-orbit orbit-one">✺</div><div className="hero-orbit orbit-two">NOT<br />NORMAL</div>
        <div className="sticker sticker-a">100%<br />ORIGINAL<br />NOISE</div>
        <div className="sticker sticker-b">ODD<br />IS GOOD</div>
        <a className="scroll" href="#work"><span>↓</span>{t.scroll}</a>
        <div className="ticker" aria-hidden="true"><div>FASHION PATTERN ✦ GRAPHIC DESIGN ✦ ILLUSTRATION ✦ COLOR & PRINT ✦ FASHION PATTERN ✦ GRAPHIC DESIGN ✦ ILLUSTRATION ✦ COLOR & PRINT ✦ </div></div>
      </section>

      <section className="works section-pad" id="work">
        <div className="section-head"><div><p className="kicker">01 / WORK</p><h2>{t.workTitle}</h2></div><p>{t.workSub}</p></div>
        <div className="project-grid">
          {projects.map((project) => (
            <article key={project.id} className={`project ${project.size}`} style={{ "--accent": project.accent } as React.CSSProperties}>
              <button onClick={() => setActive(project)} aria-label={`${t.open}: ${project.title}`}>
                <div className="image-wrap"><Image src={project.image} alt={`${project.title}, ${project.category[lang]} — ${t.concept}`} fill sizes="(max-width: 760px) 92vw, 50vw" /></div>
                <div className="project-meta"><span>{project.id}</span><div><h3>{project.title}</h3><p>{project.category[lang]}</p></div><i>↗</i></div>
                <div className="project-hover"><b>{t.concept}</b><p>{project.description[lang]}</p></div>
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="skills section-pad" id="skills">
        <p className="kicker">02 / SKILLS</p>
        <div className="skills-layout">
          <h2>{t.skillTitle.split("\n").map((line) => <span key={line}>{line}</span>)}</h2>
          <p>{t.skillNote}</p>
        </div>
        <div className="skill-playground" aria-label="Interactive skill tags">
          {skillOrder.map((index, position) => <button key={index} className={`skill-pill skill-${index}`} style={{ zIndex: position + 1 }} onPointerDown={() => shuffleSkill(index)}>{t.skills[index]}<span>{String(index + 1).padStart(2, "0")}</span></button>)}
          <div className="bounce-star">✦</div>
        </div>
      </section>

      <section className="about section-pad" id="about">
        <div className="about-label"><p className="kicker">03 / ABOUT</p><span>YOUR NAME®<br />PATTERN DESIGNER</span></div>
        <div className="manifesto"><h2>{t.aboutTitle}</h2><p>{t.about}</p><div className="signature">Stay weird. Make it wearable.</div></div>
      </section>

      <section className="contact section-pad" id="contact">
        <p className="kicker">04 / CONTACT</p>
        <h2>{t.contactTitle}</h2><p>{t.contactSub}</p>
        <MagneticLink href="mailto:hello@yourname.design" className="contact-button"><span>{t.cta}</span><b>↗</b></MagneticLink>
        <footer><span>© 2026 YOUR NAME</span><span>{t.footer}</span><a href="#top">BACK TO TOP ↑</a></footer>
      </section>

      {active && <div className="modal" role="dialog" aria-modal="true" aria-label={active.title} onClick={() => setActive(null)}>
        <button className="modal-close" onClick={() => setActive(null)}>{t.close} ×</button>
        <div className="modal-card" onClick={(e) => e.stopPropagation()}>
          <div className="modal-image"><Image src={active.image} alt={`${active.title} full artwork`} fill sizes="90vw" priority /></div>
          <div className="modal-copy"><span>{active.id} / {t.concept}</span><h2>{active.title}</h2><p>{active.description[lang]}</p><b>{active.category[lang]} · 2026</b></div>
        </div>
      </div>}
    </main>
  );
}
