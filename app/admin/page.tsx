"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  defaultManagedProjects,
  defaultSiteSettings,
  type Category,
  type Lang,
  type ManagedProject,
  type PortfolioContent,
  type SiteSettings,
} from "../projects";

type Panel = "overview" | "identity" | "typography" | "software" | "projects";
type AdminResponse = PortfolioContent & { actor?: { email?: string } };

const panels: { id: Panel; index: string; label: string; hint: string }[] = [
  { id: "overview", index: "00", label: "控制台", hint: "Overview" },
  { id: "identity", index: "01", label: "站点信息", hint: "Identity & copy" },
  { id: "typography", index: "02", label: "字体与视觉", hint: "Type & color" },
  { id: "software", index: "03", label: "软件能力", hint: "Tools & purpose" },
  { id: "projects", index: "04", label: "作品管理", hint: "Cases & order" },
];

const categoryOptions: { value: Category; label: string }[] = [
  { value: "placement", label: "定位印花 / Placement" },
  { value: "allover", label: "满版纹样 / All-over" },
  { value: "graphic", label: "T恤图形 / Graphic tee" },
  { value: "illustration", label: "插画 / Illustration" },
  { value: "identity", label: "视觉系统 / Visual identity" },
];

const fallbackContent: PortfolioContent = { settings: defaultSiteSettings, projects: defaultManagedProjects };

export default function AdminPage() {
  const [panel, setPanel] = useState<Panel>("overview");
  const [content, setContent] = useState<PortfolioContent | null>(null);
  const [selectedSlug, setSelectedSlug] = useState(defaultManagedProjects[0].slug);
  const [actor, setActor] = useState("");
  const [status, setStatus] = useState("正在连接内容数据库…");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/content", { cache: "no-store" })
      .then(async response => {
        const data = await response.json() as AdminResponse & { error?: string };
        if (!response.ok) throw new Error(data.error || "无法读取控制台数据");
        return data;
      })
      .then(data => {
        if (cancelled) return;
        setContent({ settings: data.settings, projects: data.projects });
        setActor(data.actor?.email || "站点所有者");
        setSelectedSlug(data.projects[0]?.slug || "");
        setStatus("所有修改在保存后公开生效");
      })
      .catch(error => {
        if (cancelled) return;
        setStatus(error instanceof Error ? error.message : "内容数据库暂时不可用");
      });
    return () => { cancelled = true; };
  }, []);

  const state = content ?? fallbackContent;
  const orderedProjects = useMemo(
    () => [...state.projects].sort((a, b) => a.order - b.order),
    [state.projects],
  );
  const selected = orderedProjects.find(project => project.slug === selectedSlug) ?? orderedProjects[0];
  const visibleCount = state.projects.filter(project => project.visible).length;
  const heroCount = state.projects.filter(project => project.hero && project.visible).length;
  const softwareCount = state.settings.software.filter(tool => tool.enabled).length;

  const updateSettings = (update: Partial<SiteSettings>) => {
    setContent(current => ({ ...(current ?? fallbackContent), settings: { ...(current ?? fallbackContent).settings, ...update } }));
  };

  const updateLocalizedSetting = (key: "heroIntro" | "manifesto" | "about", lang: Lang, value: string) => {
    const current = state.settings[key];
    updateSettings({ [key]: { ...current, [lang]: value } });
  };

  const updateProject = (slug: string, updater: (project: ManagedProject) => ManagedProject) => {
    setContent(current => {
      const source = current ?? fallbackContent;
      return { ...source, projects: source.projects.map(project => project.slug === slug ? updater(project) : project) };
    });
  };

  const toggleHero = (project: ManagedProject) => {
    if (!project.hero && heroCount >= 3) {
      setStatus("首屏最多选择 3 个作品，请先取消一个精选");
      return;
    }
    updateProject(project.slug, item => ({ ...item, hero: !item.hero, visible: !item.hero ? true : item.visible }));
  };

  const moveProject = (slug: string, direction: -1 | 1) => {
    const list = [...orderedProjects];
    const index = list.findIndex(project => project.slug === slug);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= list.length) return;
    [list[index], list[target]] = [list[target], list[index]];
    const orders = new Map(list.map((project, itemIndex) => [project.slug, itemIndex + 1]));
    setContent(current => {
      const source = current ?? fallbackContent;
      return { ...source, projects: source.projects.map(project => ({ ...project, order: orders.get(project.slug) ?? project.order })) };
    });
  };

  const save = async () => {
    if (!content) return;
    setSaving(true);
    setStatus("正在保存并同步前台…");
    const projects = [...content.projects]
      .sort((a, b) => a.order - b.order)
      .map((project, index) => ({ ...project, order: index + 1, hero: project.visible && project.hero }));
    const heroSlugs = projects.filter(project => project.hero).slice(0, 3).map(project => project.slug);
    const payload: PortfolioContent = {
      projects,
      settings: { ...content.settings, heroSlugs },
    };
    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "保存失败");
      setContent(payload);
      setStatus(`已保存 · ${new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "保存失败，请稍后重试");
    } finally {
      setSaving(false);
    }
  };

  return <main className="admin-shell">
    <header className="admin-topbar">
      <Link className="admin-brand" href="/"><strong>PORTFOLIO / CMS</strong><span>FASHION PRINT ARCHIVE</span></Link>
      <div className="admin-state"><i />D1 PERSISTENCE <span>{actor || "OWNER ACCESS"}</span></div>
      <div className="admin-actions"><Link href="/" target="_blank">查看网站 ↗</Link><button onClick={save} disabled={saving || !content}>{saving ? "保存中…" : "保存并发布"}</button></div>
    </header>

    <div className="admin-layout">
      <aside className="admin-sidebar">
        <nav aria-label="内容控制台">
          {panels.map(item => <button key={item.id} className={panel === item.id ? "active" : ""} onClick={() => setPanel(item.id)}>
            <b>{item.index}</b><span>{item.label}<small>{item.hint}</small></span><i>↗</i>
          </button>)}
        </nav>
        <p className="admin-help">当前站点为私人访问。控制台数据保存到站点数据库，不依赖此浏览器。</p>
      </aside>

      <section className="admin-workspace">
        <div className="admin-heading"><div><span>CONTENT CONTROL / {panels.find(item => item.id === panel)?.index}</span><h1>{panels.find(item => item.id === panel)?.label}</h1></div><p>{status}</p></div>

        {!content && <div className="admin-loading"><span /><p>{status}</p></div>}

        {content && panel === "overview" && <div className="overview-panel">
          <div className="metric-grid">
            <article><span>VISIBLE CASES</span><strong>{String(visibleCount).padStart(2, "0")}</strong><p>当前公开展示的概念案例</p></article>
            <article><span>HERO PICKS</span><strong>{String(heroCount).padStart(2, "0")}</strong><p>进入首屏动态拼贴的作品</p></article>
            <article><span>CORE TOOLS</span><strong>{String(softwareCount).padStart(2, "0")}</strong><p>软件能力区已开启的工具</p></article>
            <article className="acid-metric"><span>CONTENT STATUS</span><strong>LIVE</strong><p>保存后由前台实时读取</p></article>
          </div>
          <div className="overview-grid">
            <article><span>QUICK START</span><h2>先把占位信息<br />换成你自己。</h2><p>姓名、城市、邮箱和双语介绍集中在“站点信息”。作品图片路径与文字可在“作品管理”逐项替换。</p><button onClick={() => setPanel("identity")}>编辑站点信息 ↗</button></article>
            <article className="type-poster"><small>TYPE SYSTEM 01</small><b>HEAVY</b><em>handmade</em><span>THIN / 250</span></article>
          </div>
        </div>}

        {content && panel === "identity" && <div className="editor-panel">
          <div className="panel-intro"><span>01 / IDENTITY</span><h2>站点身份与双语文案</h2><p>这里的内容同步到首屏、关于和联系区域。</p></div>
          <div className="field-grid three">
            <label><span>显示姓名</span><input value={state.settings.displayName} onChange={event => updateSettings({ displayName: event.target.value })} /></label>
            <label><span>城市 / 地区</span><input value={state.settings.city} onChange={event => updateSettings({ city: event.target.value })} /></label>
            <label><span>合作邮箱</span><input type="email" value={state.settings.email} onChange={event => updateSettings({ email: event.target.value })} /></label>
          </div>
          {(["heroIntro", "manifesto", "about"] as const).map((key, index) => <div className="bilingual-block" key={key}>
            <div><b>0{index + 1}</b><span>{key === "heroIntro" ? "首屏短介绍" : key === "manifesto" ? "设计宣言" : "个人简介"}</span></div>
            <label><span>中文</span><textarea value={state.settings[key].zh} onChange={event => updateLocalizedSetting(key, "zh", event.target.value)} /></label>
            <label><span>ENGLISH</span><textarea value={state.settings[key].en} onChange={event => updateLocalizedSetting(key, "en", event.target.value)} /></label>
          </div>)}
        </div>}

        {content && panel === "typography" && <div className="editor-panel">
          <div className="panel-intro"><span>02 / TYPE & COLOR</span><h2>粗体 × 细体 × 手写</h2><p>保留编辑感的秩序，再用手写字体制造个性偏差。</p></div>
          <div className="type-controls">
            <div className="control-stack">
              <label className="color-field"><span>强调色 / ACCENT</span><input type="color" value={state.settings.accentColor} onChange={event => updateSettings({ accentColor: event.target.value })} /><input value={state.settings.accentColor.toUpperCase()} onChange={event => updateSettings({ accentColor: event.target.value })} /></label>
              <fieldset><legend>大标题字重</legend>{(["900", "800"] as const).map(weight => <label key={weight}><input type="radio" name="heroWeight" checked={state.settings.heroWeight === weight} onChange={() => updateSettings({ heroWeight: weight })} /><span>{weight} / {weight === "900" ? "EXTRA HEAVY" : "BOLD"}</span></label>)}</fieldset>
              <label className="switch-row"><span><b>软件名使用手写字体</b><small>Adobe / CLO / Style3D 名称保留手写表现</small></span><input type="checkbox" checked={state.settings.handwrittenSoftware} onChange={event => updateSettings({ handwrittenSoftware: event.target.checked })} /></label>
            </div>
            <div className="type-preview" style={{ "--preview-acid": state.settings.accentColor } as React.CSSProperties}>
              <small>FASHION PRINT / 2026</small><strong style={{ fontWeight: state.settings.heroWeight }}>IDEAS<br /><i>INTO</i><br />PRINTS.</strong><em className={state.settings.handwrittenSoftware ? "hand" : ""}>Adobe Illustrator</em><span>THIN INFORMATION SYSTEM — COLOR / PROCESS / SIZE</span>
            </div>
          </div>
        </div>}

        {content && panel === "software" && <div className="editor-panel">
          <div className="panel-intro"><span>03 / SOFTWARE</span><h2>软件能力与实际作用</h2><p>软件名用手写字体，说明保持简短，让访客快速理解它在你的工作流里做什么。</p></div>
          <div className="software-editor">
            {state.settings.software.map((tool, index) => <article key={tool.id}>
              <div className="software-index"><b>{tool.code}</b><span>TOOL 0{index + 1}</span><label><input type="checkbox" checked={tool.enabled} onChange={event => updateSettings({ software: state.settings.software.map(item => item.id === tool.id ? { ...item, enabled: event.target.checked } : item) })} />展示</label></div>
              <label><span>软件名称</span><input className="hand-input" value={tool.name} onChange={event => updateSettings({ software: state.settings.software.map(item => item.id === tool.id ? { ...item, name: event.target.value } : item) })} /></label>
              <label><span>中文作用</span><input value={tool.description.zh} onChange={event => updateSettings({ software: state.settings.software.map(item => item.id === tool.id ? { ...item, description: { ...item.description, zh: event.target.value } } : item) })} /></label>
              <label><span>ENGLISH PURPOSE</span><input value={tool.description.en} onChange={event => updateSettings({ software: state.settings.software.map(item => item.id === tool.id ? { ...item, description: { ...item.description, en: event.target.value } } : item) })} /></label>
            </article>)}
          </div>
        </div>}

        {content && panel === "projects" && selected && <div className="projects-panel">
          <div className="project-list">
            <div className="project-list-head"><span>24 CASES</span><b>排序 / 展示 / 精选</b></div>
            {orderedProjects.map((project, index) => <article className={selected.slug === project.slug ? "selected" : ""} key={project.slug}>
              <button className="project-select" onClick={() => setSelectedSlug(project.slug)}><span>{String(index + 1).padStart(2, "0")}</span><Image src={project.assets.cover} alt="" width={58} height={46} unoptimized /><b>{project.title}<small>{project.category} / {project.year}</small></b></button>
              <div className="project-controls"><button aria-label="上移" onClick={() => moveProject(project.slug, -1)}>↑</button><button aria-label="下移" onClick={() => moveProject(project.slug, 1)}>↓</button><label title="公开展示"><input type="checkbox" checked={project.visible} onChange={event => updateProject(project.slug, item => ({ ...item, visible: event.target.checked, hero: event.target.checked ? item.hero : false }))} />ON</label><label title="首屏精选"><input type="checkbox" checked={project.hero} onChange={() => toggleHero(project)} />HERO</label></div>
            </article>)}
          </div>
          <div className="project-editor">
            <div className="project-editor-head"><div><span>{selected.id} / CASE DETAIL</span><h2>{selected.title}</h2></div><div className="cover-mini"><Image src={selected.assets.cover} alt={`${selected.title} preview`} fill sizes="180px" unoptimized /></div></div>
            <div className="field-grid two">
              <label><span>项目标题</span><input value={selected.title} onChange={event => updateProject(selected.slug, item => ({ ...item, title: event.target.value }))} /></label>
              <label><span>年份</span><input value={selected.year} onChange={event => updateProject(selected.slug, item => ({ ...item, year: event.target.value }))} /></label>
              <label><span>分类</span><select value={selected.category} onChange={event => updateProject(selected.slug, item => ({ ...item, category: event.target.value as Category }))}>{categoryOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
              <label><span>展示比例</span><select value={selected.ratio} onChange={event => updateProject(selected.slug, item => ({ ...item, ratio: event.target.value as ManagedProject["ratio"] }))}><option value="portrait">竖版 / Portrait</option><option value="landscape">横版 / Landscape</option><option value="square">方形 / Square</option></select></label>
              <label><span>封面图片路径</span><input value={selected.assets.cover} onChange={event => updateProject(selected.slug, item => ({ ...item, assets: { ...item.assets, cover: event.target.value } }))} /></label>
              <label><span>过程图路径（可选）</span><input value={selected.assets.process ?? ""} onChange={event => updateProject(selected.slug, item => ({ ...item, assets: { ...item.assets, process: event.target.value || undefined } }))} /></label>
              <label><span>服装类型（中文）</span><input value={selected.production.garment.zh} onChange={event => updateProject(selected.slug, item => ({ ...item, production: { ...item.production, garment: { ...item.production.garment, zh: event.target.value } } }))} /></label>
              <label><span>GARMENT (EN)</span><input value={selected.production.garment.en} onChange={event => updateProject(selected.slug, item => ({ ...item, production: { ...item.production, garment: { ...item.production.garment, en: event.target.value } } }))} /></label>
              <label><span>印花位置（中文）</span><input value={selected.production.placement.zh} onChange={event => updateProject(selected.slug, item => ({ ...item, production: { ...item.production, placement: { ...item.production.placement, zh: event.target.value } } }))} /></label>
              <label><span>PLACEMENT (EN)</span><input value={selected.production.placement.en} onChange={event => updateProject(selected.slug, item => ({ ...item, production: { ...item.production, placement: { ...item.production.placement, en: event.target.value } } }))} /></label>
              <label><span>建议尺寸</span><input value={selected.production.size} onChange={event => updateProject(selected.slug, item => ({ ...item, production: { ...item.production, size: event.target.value } }))} /></label>
              <label><span>第一建议工艺</span><input value={selected.production.techniques[0]?.zh ?? ""} onChange={event => updateProject(selected.slug, item => ({ ...item, production: { ...item.production, techniques: [{ ...(item.production.techniques[0] ?? { zh: "", en: "" }), zh: event.target.value }, ...item.production.techniques.slice(1)] } }))} /></label>
              <label><span>PROPOSED TECHNIQUE (EN)</span><input value={selected.production.techniques[0]?.en ?? ""} onChange={event => updateProject(selected.slug, item => ({ ...item, production: { ...item.production, techniques: [{ ...(item.production.techniques[0] ?? { zh: "", en: "" }), en: event.target.value }, ...item.production.techniques.slice(1)] } }))} /></label>
              <label className="switch-row compact"><span><b>深度主案例</b><small>用于标记完整创作过程案例</small></span><input type="checkbox" checked={selected.featured} onChange={event => updateProject(selected.slug, item => ({ ...item, featured: event.target.checked }))} /></label>
            </div>
            <div className="palette-editor"><div><span>COLOR PALETTE</span><b>配色名称与色值</b></div>{selected.production.colors.map((color, colorIndex) => <article key={`${selected.slug}-${colorIndex}`}><input aria-label="颜色" type="color" value={/^#[0-9a-fA-F]{6}$/.test(color.hex) ? color.hex : "#111111"} onChange={event => updateProject(selected.slug, item => ({ ...item, production: { ...item.production, colors: item.production.colors.map((entry, index) => index === colorIndex ? { ...entry, hex: event.target.value.toUpperCase() } : entry) } }))} /><label><span>中文名称</span><input value={color.name.zh} onChange={event => updateProject(selected.slug, item => ({ ...item, production: { ...item.production, colors: item.production.colors.map((entry, index) => index === colorIndex ? { ...entry, name: { ...entry.name, zh: event.target.value } } : entry) } }))} /></label><label><span>ENGLISH NAME</span><input value={color.name.en} onChange={event => updateProject(selected.slug, item => ({ ...item, production: { ...item.production, colors: item.production.colors.map((entry, index) => index === colorIndex ? { ...entry, name: { ...entry.name, en: event.target.value } } : entry) } }))} /></label><label><span>HEX</span><input value={color.hex} onChange={event => updateProject(selected.slug, item => ({ ...item, production: { ...item.production, colors: item.production.colors.map((entry, index) => index === colorIndex ? { ...entry, hex: event.target.value } : entry) } }))} /></label></article>)}</div>
            <div className="story-editor"><label><span>中文意义</span><textarea value={selected.story.meaning.zh} onChange={event => updateProject(selected.slug, item => ({ ...item, story: { ...item.story, meaning: { ...item.story.meaning, zh: event.target.value } } }))} /></label><label><span>ENGLISH MEANING</span><textarea value={selected.story.meaning.en} onChange={event => updateProject(selected.slug, item => ({ ...item, story: { ...item.story, meaning: { ...item.story.meaning, en: event.target.value } } }))} /></label><label><span>中文创作思路</span><textarea value={selected.story.concept.zh} onChange={event => updateProject(selected.slug, item => ({ ...item, story: { ...item.story, concept: { ...item.story.concept, zh: event.target.value } } }))} /></label><label><span>CREATIVE THINKING (EN)</span><textarea value={selected.story.concept.en} onChange={event => updateProject(selected.slug, item => ({ ...item, story: { ...item.story, concept: { ...item.story.concept, en: event.target.value } } }))} /></label></div>
          </div>
        </div>}
      </section>
    </div>
  </main>;
}
