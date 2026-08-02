"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Lang = "zh" | "en";
type Text = Record<Lang, string>;
type Project = { id: string; title: string; type: Text; note: Text; image: string };

const projects: Project[] = [
  { id: "01", title: "NIGHT PARADE", type: { zh: "服装印花", en: "FASHION PRINT" }, note: { zh: "夜行生物、星芒与墨迹构成的黑白印花实验。", en: "A monochrome print study built from nocturnal figures, stars and raw ink." }, image: "/works/night-parade.png" },
  { id: "02", title: "WEAR THE NOISE", type: { zh: "视觉系统", en: "VISUAL SYSTEM" }, note: { zh: "为街头服装构建的模块化图形语言。", en: "A modular graphic language developed for streetwear." }, image: "/works/wear-the-noise.png" },
  { id: "03", title: "MUTANT BLOOM", type: { zh: "连续纹样", en: "REPEAT PATTERN" }, note: { zh: "花朵、眼睛与液态形状的重复结构。", en: "A repeating structure of flowers, eyes and liquid forms." }, image: "/works/mutant-bloom.png" },
  { id: "04", title: "PLASTIC GARDEN", type: { zh: "图形实验", en: "GRAPHIC STUDY" }, note: { zh: "金属、塑料与花卉素材的拼贴研究。", en: "A collage study in chrome, plastic and botanical material." }, image: "/works/plastic-garden.png" },
  { id: "05", title: "SOFT ERROR", type: { zh: "图案设计", en: "PATTERN DESIGN" }, note: { zh: "把数字故障转化为可穿着的图形节奏。", en: "Digital glitches translated into a wearable graphic rhythm." }, image: "/works/soft-error.png" },
  { id: "06", title: "TINY PANIC", type: { zh: "插画", en: "ILLUSTRATION" }, note: { zh: "关于日常情绪的一组角色插画。", en: "A character study about everyday states of mind." }, image: "/works/tiny-panic.png" },
];

const content = {
  zh: {
    nav: ["作品", "关于", "能力", "联系"],
    label: "服装图案 / 平面设计 / 插画",
    hero: ["我把想法", "变成图案。"],
    intro: "从概念、构图到印花落地，我为服装与文化项目创造具有态度和细节的视觉。",
    view: "查看作品",
    selected: "精选作品",
    selectedNote: "概念项目 / 2026",
    concept: "概念作品",
    about: "关于我",
    aboutText: "我是一名专注服装图案的视觉设计师，也从事平面与插画创作。我关注图形如何进入真实的穿着场景：从一张草图、一块纹样，到最终成为衣服上的视觉语言。",
    skills: "能力",
    tools: "工作方式",
    services: ["服装图案设计", "连续纹样开发", "平面视觉设计", "插画与角色", "色彩与印花方向"],
    process: ["趋势与素材研究", "概念与草图", "图案系统", "印花应用"],
    contactTitle: "一起做些有态度的图案。",
    contactText: "项目合作、自由委托或只是想聊聊，都欢迎来信。",
    mail: "联系合作",
    close: "关闭",
  },
  en: {
    nav: ["WORKS", "ABOUT", "SKILLS", "CONTACT"],
    label: "FASHION PRINT / GRAPHICS / ILLUSTRATION",
    hero: ["I TURN IDEAS", "INTO PRINTS."],
    intro: "From concept and composition to print application, I create visuals with attitude and detail for fashion and culture.",
    view: "VIEW WORKS",
    selected: "SELECTED WORKS",
    selectedNote: "CONCEPT PROJECTS / 2026",
    concept: "CONCEPT WORK",
    about: "ABOUT ME",
    aboutText: "I am a visual designer focused on fashion prints, with a parallel practice in graphic design and illustration. I care about how an image enters a real wearing context—from sketch and repeat to a visual language on fabric.",
    skills: "SKILLS",
    tools: "PROCESS",
    services: ["FASHION PRINT DESIGN", "REPEAT DEVELOPMENT", "GRAPHIC DESIGN", "ILLUSTRATION", "COLOR & PRINT DIRECTION"],
    process: ["RESEARCH", "CONCEPT & SKETCH", "PATTERN SYSTEM", "APPLICATION"],
    contactTitle: "LET'S MAKE PRINTS WITH A POINT OF VIEW.",
    contactText: "Available for collaborations, commissions and conversations.",
    mail: "START A PROJECT",
    close: "CLOSE",
  },
};

export default function Home() {
  const [lang, setLang] = useState<Lang>("zh");
  const [active, setActive] = useState<Project | null>(null);
  const t = content[lang];

  useEffect(() => {
    const saved = localStorage.getItem("portfolio-lang") as Lang | null;
    if (saved === "zh" || saved === "en") setLang(saved);
  }, []);
  useEffect(() => {
    localStorage.setItem("portfolio-lang", lang);
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  }, [lang]);
  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "";
    const escape = (event: KeyboardEvent) => event.key === "Escape" && setActive(null);
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [active]);

  return <main>
    <header className="site-header">
      <a className="wordmark" href="#top"><b>YOUR NAME.</b><span>PRINT / VISUAL DESIGN</span></a>
      <nav>{["works", "about", "skills", "contact"].map((id, i) => <a href={`#${id}`} key={id}>{t.nav[i]}</a>)}</nav>
      <button className="language" onClick={() => setLang(lang === "zh" ? "en" : "zh")}>{lang === "zh" ? "EN" : "中文"}</button>
    </header>

    <section className="clean-hero" id="top">
      <div className="hero-copy">
        <span className="acid-label">{t.label}</span>
        <h1>{t.hero.map(line => <span key={line}>{line}</span>)}</h1>
        <p>{t.intro}</p>
        <a className="line-button" href="#works">{t.view}<span>→</span></a>
        <div className="hero-index">PORTFOLIO — 01</div>
      </div>
      <div className="poster-stage" aria-label="Selected fashion print posters">
        {projects.slice(0, 3).map((project, index) => <button key={project.id} className={`poster poster-${index + 1}`} onClick={() => setActive(project)} aria-label={project.title}>
          <Image src={project.image} alt={`${project.title} ${project.type[lang]}`} fill sizes="(max-width: 760px) 45vw, 24vw" priority={index === 0} />
          <span>{project.title}</span>
        </button>)}
        <i className="tape tape-a"/><i className="tape tape-b"/>
        <span className="stage-mark">PRINT<br/>STUDIES<br/>2026</span>
      </div>
    </section>

    <div className="discipline-strip">
      {["FASHION PRINT", "REPEAT PATTERN", "GRAPHIC DESIGN", "ILLUSTRATION"].map((item, i) => <span key={item}><b>0{i + 1}</b>{item}<i>→</i></span>)}
    </div>

    <section className="work-section" id="works">
      <div className="section-title"><div><span>01</span><h2>{t.selected}</h2></div><p>{t.selectedNote}</p></div>
      <div className="work-grid">
        {projects.map(project => <article className="work-card" key={project.id}>
          <button onClick={() => setActive(project)}>
            <div className="work-image"><Image src={project.image} alt={`${project.title} — ${project.type[lang]}`} fill sizes="(max-width: 720px) 90vw, 33vw" /></div>
            <div className="work-meta"><span>{project.id}</span><div><h3>{project.title}</h3><p>{project.type[lang]}</p></div><i>↗</i></div>
          </button>
        </article>)}
      </div>
    </section>

    <section className="profile-section" id="about">
      <div className="profile-copy"><div className="section-number">02 / PROFILE</div><h2>{t.about}</h2><p>{t.aboutText}</p><div className="signature-line">YOUR NAME — SHANGHAI, CHINA</div></div>
      <div className="capability" id="skills">
        <div><h3>{t.skills}</h3>{t.services.map((item, i) => <p key={item}><span>{item}</span><i style={{ width: `${92 - i * 9}%` }} /></p>)}</div>
        <div><h3>{t.tools}</h3>{t.process.map((item, i) => <p className="process" key={item}><b>0{i + 1}</b><span>{item}</span></p>)}</div>
      </div>
    </section>

    <section className="contact-section" id="contact">
      <div className="section-number">03 / CONTACT</div><h2>{t.contactTitle}</h2><p>{t.contactText}</p>
      <a className="contact-link" href="mailto:hello@yourname.design">{t.mail}<span>↗</span></a>
      <footer><span>© 2026 YOUR NAME</span><span>FASHION PRINT / GRAPHIC / ILLUSTRATION</span><a href="#top">TOP ↑</a></footer>
    </section>

    {active && <div className="viewer" role="dialog" aria-modal="true" aria-label={active.title} onClick={() => setActive(null)}>
      <button className="viewer-close" onClick={() => setActive(null)}>{t.close} ×</button>
      <div className="viewer-inner" onClick={event => event.stopPropagation()}>
        <div className="viewer-image"><Image src={active.image} alt={active.title} fill sizes="80vw" priority /></div>
        <aside><span>{active.id} / {t.concept}</span><h2>{active.title}</h2><p>{active.note[lang]}</p><b>{active.type[lang]} — 2026</b></aside>
      </div>
    </div>}
  </main>;
}
