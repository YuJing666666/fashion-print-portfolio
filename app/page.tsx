"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Lang = "zh" | "en";
type Text = Record<Lang, string>;
type Project = { id: string; title: string; type: Text; note: Text; image: string; format: "portrait" | "wide" };

const projects: Project[] = [
  { id: "01", title: "CHAOS STREETWEAR", type: { zh: "成衣印花效果", en: "APPAREL PRINT" }, note: { zh: "黑色街头 T 恤的正面印花应用与视觉比例参考。", en: "Front-print placement and scale study on a black streetwear tee." }, image: "/cases/streetwear-male.png", format: "portrait" },
  { id: "02", title: "REBEL TEE", type: { zh: "成衣图形应用", en: "GRAPHIC TEE" }, note: { zh: "白色宽松 T 恤上的高对比图形应用参考。", en: "High-contrast graphic application on an oversized white tee." }, image: "/cases/streetwear-female.png", format: "portrait" },
  { id: "03", title: "CHAOS HOODIE", type: { zh: "卫衣印花效果", en: "HOODIE APPLICATION" }, note: { zh: "从图形元素到连帽卫衣成衣效果的应用展示。", en: "Application study from graphic elements to a finished hoodie visual." }, image: "/cases/hoodie-application.png", format: "wide" },
  { id: "04", title: "PRINT COLLECTION", type: { zh: "系列图案方向", en: "PRINT DIRECTION" }, note: { zh: "围绕街头文化建立的系列图案与色彩方向参考。", en: "A street-culture print collection and color-direction reference." }, image: "/cases/print-collection.png", format: "wide" },
  { id: "05", title: "VOID PORTFOLIO", type: { zh: "案例编排参考", en: "CASE STUDY LAYOUT" }, note: { zh: "深色服装印花案例的完整展示结构参考。", en: "Reference structure for presenting a dark fashion-print case study." }, image: "/cases/dark-portfolio-study.png", format: "wide" },
  { id: "06", title: "PRINT LANGUAGE", type: { zh: "作品集视觉参考", en: "PORTFOLIO DIRECTION" }, note: { zh: "白色背景下的图案、能力与工具信息编排参考。", en: "Reference for combining prints, capabilities and tools on white." }, image: "/cases/light-portfolio-study.png", format: "wide" },
];

const software = [
  { code: "Ps", name: "Adobe Photoshop", use: { zh: "图像处理 / 印花效果", en: "IMAGE / PRINT MOCKUP" }, tag: { zh: "主要工具", en: "PRIMARY" } },
  { code: "Ai", name: "Adobe Illustrator", use: { zh: "矢量图形 / 连续纹样", en: "VECTOR / REPEAT" }, tag: { zh: "主要工具", en: "PRIMARY" } },
  { code: "Pro", name: "Procreate", use: { zh: "手绘插画 / 草图", en: "DRAWING / SKETCH" }, tag: { zh: "常用", en: "DAILY" } },
  { code: "Id", name: "Adobe InDesign", use: { zh: "版式设计 / 作品集", en: "LAYOUT / PORTFOLIO" }, tag: { zh: "排版", en: "LAYOUT" } },
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
    referenceNote: "当前图片为你提供的参考案例，待替换为个人项目",
    concept: "概念作品",
    about: "关于我",
    aboutText: "我是一名专注服装图案的视觉设计师，也从事平面与插画创作。我关注图形如何进入真实的穿着场景：从一张草图、一块纹样，到最终成为衣服上的视觉语言。",
    skills: "能力",
    tools: "工作方式",
    software: "软件工具",
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
    referenceNote: "REFERENCE IMAGERY PROVIDED BY YOU — REPLACE WITH PERSONAL WORK",
    concept: "CONCEPT WORK",
    about: "ABOUT ME",
    aboutText: "I am a visual designer focused on fashion prints, with a parallel practice in graphic design and illustration. I care about how an image enters a real wearing context—from sketch and repeat to a visual language on fabric.",
    skills: "SKILLS",
    tools: "PROCESS",
    software: "SOFTWARE",
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
        {[projects[0], projects[4], projects[1]].map((project, index) => <button key={project.id} className={`poster poster-${index + 1}`} onClick={() => setActive(project)} aria-label={project.title}>
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
      <p className="reference-note">* {t.referenceNote}</p>
      <div className="work-grid">
        {projects.map(project => <article className={`work-card ${project.format}`} key={project.id}>
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
        <div className="software-panel"><h3>{t.software}</h3><div className="software-grid">{software.map(tool => <div className="software-card" key={tool.code}><b>{tool.code}</b><div><strong>{tool.name}</strong><span>{tool.use[lang]}</span></div><i>{tool.tag[lang]}</i></div>)}</div></div>
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
