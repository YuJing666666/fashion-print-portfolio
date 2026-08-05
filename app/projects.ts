export type Lang = "zh" | "en";
export type Localized = Record<Lang, string>;
export type Category = "placement" | "allover" | "graphic" | "illustration" | "identity";

export type Project = {
  id: string;
  slug: string;
  title: string;
  year: string;
  category: Category;
  featured: boolean;
  ratio: "portrait" | "landscape" | "square";
  assets: { cover: string; process?: string };
  production: {
    garment: Localized;
    placement: Localized;
    techniques: Localized[];
    size: string;
    colors: { name: Localized; hex: string }[];
  };
  story: { meaning: Localized; concept: Localized };
};

export type SoftwareItem = {
  id: string;
  code: string;
  name: string;
  description: Localized;
  enabled: boolean;
  category: "2d" | "3d" | "ai";
  mastery: number;
};

export type SiteSettings = {
  displayName: string;
  city: string;
  email: string;
  heroIntro: Localized;
  manifesto: Localized;
  about: Localized;
  accentColor: string;
  heroWeight: "800" | "900";
  handwrittenSoftware: boolean;
  heroSlugs: string[];
  software: SoftwareItem[];
};

export type ManagedProject = Project & {
  visible: boolean;
  order: number;
  hero: boolean;
};

export type PortfolioContent = {
  settings: SiteSettings;
  projects: ManagedProject[];
};

const zhEn = (zh: string, en: string): Localized => ({ zh, en });
const color = (zh: string, en: string, hex: string) => ({ name: zhEn(zh, en), hex });

const raw = [
  ["static-garden","STATIC GARDEN","placement","tee","前胸与后背 / Front & back","380 × 480 mm",["拔染丝网印刷","Discharge screen print"],[color("墨黑","Ink Black","#101010"),color("骨白","Bone","#EDE8DC")],"在静止的植物形态里寻找破裂与生长。","Botanical fragments are cut, enlarged and rebuilt into a quiet but forceful placement print."],
  ["soft-riot","SOFT RIOT","illustration","tee","前胸满幅 / Full front","360 × 430 mm",["水性丝网印刷","Water-based screen print"],[color("纸白","Paper","#F4F2ED"),color("热粉","Hot Pink","#F13E91"),color("黑","Black","#111111")],"柔软并不等于安静。","A hand-drawn butterfly is disrupted with urgent brush marks to balance softness and resistance."],
  ["signal-burn","SIGNAL BURN","graphic","hoodie","左胸与后背 / Chest & back","320 × 390 mm",["发泡印花","Raised puff print"],[color("炭灰","Charcoal","#292B2C"),color("酸性绿","Acid Lime","#C7FF18")],"燃烧是一种重新发出信号的方式。","A compact globe-and-flame symbol turns digital overload into a wearable warning signal."],
  ["outer-bloom","OUTER BLOOM","placement","longsleeve","前胸与双袖 / Front & sleeves","340 × 420 mm",["数码直喷","Direct-to-garment"],[color("奶油白","Cream","#EDE6D7"),color("夜黑","Night","#111111")],"一朵来自轨道之外的花。","Cosmic orbit lines wrap a distorted flower, extending the artwork from body to sleeves."],
  ["noise-atlas","NOISE ATLAS","identity","tee","后背中心 / Center back","360 × 460 mm",["反光浆印花","Reflective ink"],[color("黑","Black","#0D0D0D"),color("反光银","Reflective Silver","#B8BDC1")],"把城市噪声绘制成一张看不见的地图。","Field recordings and walking routes become an abstract topographic graphic."],
  ["night-transit","NIGHT TRANSIT","allover","hoodie","后背延伸双袖 / Back to sleeves","760 × 540 mm",["夜光印花","Glow ink"],[color("深海蓝","Deep Navy","#10182D"),color("电光蓝","Electric Blue","#2358FF")],"夜间移动留下短暂的发光路径。","Transit lines stretch across the hoodie as a map that appears differently after dark."],
  ["false-memory","FALSE MEMORY","illustration","tee","前胸 / Front","350 × 440 mm",["做旧丝网印刷","Distressed screen print"],[color("水洗灰","Washed Grey","#777773"),color("黑","Black","#111111")],"记忆会磨损，但不会完全消失。","A found portrait is repeatedly copied and erased until recognition turns into texture."],
  ["electric-folk","ELECTRIC FOLK","allover","longsleeve","前胸、后背与袖口 / Body & cuffs","520 × 610 mm",["水性印花＋刺绣","Water-based print + embroidery"],[color("米白","Off White","#F0ECE0"),color("钴蓝","Cobalt","#1647D9"),color("朱红","Vermilion","#E44632")],"旧符号进入新的电路。","Naive folk symbols are redrawn as modular marks, with one motif translated into embroidery."],
  ["acid-archive","ACID ARCHIVE","graphic","tee","前胸满幅 / Full front","390 × 500 mm",["双色丝网印刷","Two-color screen print"],[color("酸性绿","Acid Lime","#C7FF18"),color("黑","Black","#111111")],"把不存在的档案穿在身上。","Imagined stamps, index marks and damaged records form a dense graphic archive."],
  ["silent-volume","SILENT VOLUME","placement","hoodie","后背 / Back","340 × 420 mm",["植绒印花","Velvet flock"],[color("黑","Black","#111111"),color("深黑","Deep Black","#050505")],"低调的材质也可以拥有体积。","A tonal geometric form relies on touch and changing light instead of loud color."],
  ["plastic-ritual","PLASTIC RITUAL","identity","tee","前胸中心 / Center front","310 × 380 mm",["银色烫箔","Silver foil"],[color("白","White","#F7F7F4"),color("铬银","Chrome","#C9CDD0"),color("黑","Black","#111111")],"人造材质也有自己的仪式感。","A chrome botanical emblem treats synthetic surfaces as precious ceremonial objects."],
  ["data-garden","DATA GARDEN","allover","longsleeve","前胸与双袖 / Front & sleeves","600 × 520 mm",["热转印","Heat transfer"],[color("钴蓝","Cobalt","#214CDB"),color("荧光绿","Neon Lime","#B7F52A")],"自然被压缩成格点后再次生长。","Pixel cells expand into a botanical grid that moves continuously across the garment."],
  ["broken-halo","BROKEN HALO","placement","tee","后背 / Back","355 × 455 mm",["拔染印花","Discharge print"],[color("酒红","Burgundy","#6D1C2D"),color("米白","Warm White","#EEE7DA")],"不完整的光环仍然能够发亮。","A fractured halo frames imperfect hand marks as a symbol of unfinished growth."],
  ["lunar-static","LUNAR STATIC","graphic","longsleeve","前胸与袖子 / Front & sleeve","410 × 520 mm",["反光印花","Reflective print"],[color("黑","Black","#111111"),color("银灰","Silver Grey","#AEB4BA")],"月光像失真的电视信号。","Lunar phases dissolve into broadcast noise and reappear under direct light."],
  ["tender-damage","TENDER DAMAGE","illustration","hoodie","左胸与后背 / Chest & back","300 × 360 mm",["毛巾绣章＋印花","Chenille patch + print"],[color("奶油","Cream","#E8DDC9"),color("暗红","Dark Red","#8B2A2C")],"修补痕迹也是图案的一部分。","A soft chenille emblem sits over printed repair marks, celebrating visible mending."],
  ["digital-moss","DIGITAL MOSS","allover","tee","满版 / All-over","全幅循环 / Full repeat",["水性满版印花","All-over water-based print"],[color("橄榄绿","Olive","#53613A"),color("苔绿","Moss","#99A96C")],"像素表面慢慢长出苔藓。","Organic clusters interrupt a strict pixel grid until the repeat feels alive."],
  ["velvet-warning","VELVET WARNING","placement","hoodie","后背 / Back","370 × 450 mm",["植绒印花","Velvet flock"],[color("黑","Black","#0D0D0D"),color("紫黑","Black Violet","#251B2C")],"警告不一定需要高声表达。","A nearly invisible warning symbol appears through the contrast of matte and velvet."],
  ["paper-tiger","PAPER TIGER","illustration","tee","前胸 / Front","340 × 430 mm",["仿旧胶浆","Vintage plastisol"],[color("旧纸白","Paper White","#E8E0CE"),color("炭黑","Charcoal","#262523")],"看似凶猛的形象也可能非常脆弱。","A roughly cut tiger is printed like a weathered gig poster, bold from afar and fragile up close."],
  ["future-fossil","FUTURE FOSSIL","graphic","longsleeve","前胸与后背 / Front & back","380 × 470 mm",["金属墨印花","Metallic ink"],[color("石灰","Stone Grey","#AAA9A1"),color("金属黑","Metal Black","#3A3C3D")],"今天的接口会成为未来的化石。","Interface fragments are compressed into an archaeological plate for a machine age."],
  ["blue-noise","BLUE NOISE","identity","tee","前胸中心 / Center front","300 × 340 mm",["白色发泡印花","White puff print"],[color("钴蓝","Cobalt","#1648D7"),color("白","White","#F6F5F0")],"噪声也可以形成清晰的节奏。","A compact rhythm of waves and gaps becomes tactile through a raised white surface."],
  ["afterimage-club","AFTERIMAGE CLUB","illustration","hoodie","前胸与后背 / Front & back","320 × 390 mm",["荧光水浆","Fluorescent water-based ink"],[color("白","White","#F4F3EF"),color("荧光粉","Fluoro Pink","#FF3E9B")],"看过之后仍停留在视线里的俱乐部。","High-energy character marks are reduced to the colors that remain after looking away."],
  ["organic-error","ORGANIC ERROR","allover","tee","满版 / All-over","全幅循环 / Full repeat",["环保涂料印花","Pigment print"],[color("沙色","Sand","#C7B99E"),color("泥黑","Mud Black","#2D2A25")],"自然的错误才形成真正的纹理。","Irregular hand-cut shapes refuse perfect repetition, producing a deliberately unstable repeat."],
  ["midnight-bloom","MIDNIGHT BLOOM","placement","tee","后背 / Back","360 × 460 mm",["透明啫喱印花","Clear gel print"],[color("黑","Black","#090909"),color("透明亮面","Clear Gloss","#4A4A4A")],"只有在光线移动时才出现的夜花。","A dark bloom is revealed by gloss and reflection rather than additional pigment."],
  ["local-weather","LOCAL WEATHER","identity","longsleeve","左胸与双袖 / Chest & sleeves","520 × 120 mm",["链式刺绣","Chain-stitch embroidery"],[color("板岩蓝","Slate Blue","#596778"),color("云白","Cloud","#E5E5DF")],"天气是每天最接近身体的公共信息。","Small weather symbols travel from chest to cuffs like a personal local forecast."],
] as const;

const garments: Record<string, Localized> = {
  tee: zhEn("宽松短袖 T 恤", "Oversized T-shirt"),
  hoodie: zhEn("宽松连帽卫衣", "Oversized hoodie"),
  longsleeve: zhEn("宽松长袖上衣", "Oversized long-sleeve"),
};

const categories: Category[] = ["placement", "allover", "graphic", "illustration", "identity"];

export const projects: Project[] = raw.map((item, index) => {
  const [slug,title,category,garment,placement,size,techniques,colors,meaning,concept] = item;
  return {
    id: String(index + 1).padStart(2, "0"), slug, title, year: "2026",
    category: (categories.includes(category as Category) ? category : "graphic") as Category,
    featured: index < 8,
    ratio: index % 5 === 0 ? "landscape" : index % 3 === 0 ? "square" : "portrait",
    assets: { cover: `/projects/${slug}.jpg` },
    production: { garment: garments[garment], placement: zhEn(placement.split(" / ")[0], placement.split(" / ")[1]), techniques: [zhEn(techniques[0], techniques[1])], size, colors: [...colors] },
    story: { meaning: zhEn(meaning, concept.split(".")[0] + "."), concept: zhEn(meaning, concept) },
  };
});

export const categoryLabels: Record<"all" | Category, Localized> = {
  all: zhEn("全部", "ALL"), placement: zhEn("定位印花", "PLACEMENT"), allover: zhEn("满版纹样", "ALL-OVER"), graphic: zhEn("T恤图形", "GRAPHIC TEE"), illustration: zhEn("插画", "ILLUSTRATION"), identity: zhEn("视觉系统", "VISUAL IDENTITY"),
};

export const defaultSiteSettings: SiteSettings = {
  displayName: "YOUR NAME",
  city: "SHANGHAI, CHINA",
  email: "hello@yourname.design",
  heroIntro: zhEn(
    "我把观察、情绪与图形实验，转化为可以真正进入服装结构的视觉语言。",
    "I translate observation, emotion and graphic experiments into visual systems designed for real garments.",
  ),
  manifesto: zhEn(
    "图案不是贴在衣服上的装饰，而是穿着者与外界交换信号的方式。",
    "A print is not decoration placed on clothing. It is a signal exchanged between the wearer and the world.",
  ),
  about: zhEn(
    "以服装图案为核心，我同时处理平面系统、插画、配色与印花落地。工作从研究与草图开始，经过上身比例测试和工艺建议，形成完整、可沟通的视觉方案。",
    "Fashion print is my core practice, supported by graphic systems, illustration, color and production thinking—from research and sketching to on-body scale tests and a proposed technique.",
  ),
  accentColor: "#c8ff19",
  heroWeight: "900",
  handwrittenSoftware: false,
  heroSlugs: ["static-garden", "signal-burn", "electric-folk"],
  software: [
    // 2D 矢量与图像
    { id: "illustrator", code: "Ai", name: "Adobe Illustrator", description: zhEn("矢量图形、技术三视图与连续纹样", "VECTOR GRAPHICS, TECH FLATS & REPEATS"), enabled: true, category: "2d", mastery: 0.95 },
    { id: "photoshop", code: "Ps", name: "Adobe Photoshop", description: zhEn("图像合成、上身效果与色彩分离", "COMPOSITING, MOCKUPS & COLOR SEPARATION"), enabled: true, category: "2d", mastery: 0.82 },
    { id: "coreldraw", code: "CDR", name: "CorelDRAW", description: zhEn("矢量排版、印花分色与制版输出", "VECTOR LAYOUT, COLOR SEPARATION & PRODUCTION"), enabled: true, category: "2d", mastery: 0.62 },
    // 3D 服装建模
    { id: "clo3d", code: "CLO", name: "CLO 3D", description: zhEn("服装版型、面料垂感与三维试衣", "PATTERN, FABRIC DRAPE & 3D FITTING"), enabled: true, category: "3d", mastery: 0.78 },
    { id: "style3d", code: "S3D", name: "Style3D", description: zhEn("数字样衣、材质预览与动态展示", "DIGITAL SAMPLES, MATERIALS & MOTION"), enabled: true, category: "3d", mastery: 0.66 },
    { id: "garment-et", code: "ET", name: "服装 ET", description: zhEn("数字化样板、推档放码与排料", "DIGITAL PATTERN, GRADING & MARKER"), enabled: true, category: "3d", mastery: 0.56 },
    // AI 主工具（高熟练度，整块展示）
    { id: "workbuddy", code: "WB", name: "WorkBuddy", description: zhEn("AI 智能体 — 协同设计与内容生产", "AI AGENT — COLLABORATIVE DESIGN & CONTENT"), enabled: true, category: "ai", mastery: 0.85 },
    { id: "claudecode", code: "CC", name: "Claude Code", description: zhEn("AI 代码助手 — 工具链与工作流", "AI CODE ASSISTANT — TOOLING & WORKFLOW"), enabled: true, category: "ai", mastery: 0.80 },
    // AI 辅助（低熟练度，小方块展示）
    { id: "codex", code: "CDX", name: "Codex", description: zhEn("AI 编程辅助 — 自动化与脚本生成", "AI PAIR PROGRAMMING & SCRIPTING"), enabled: true, category: "ai", mastery: 0.32 },
    { id: "gemini", code: "GEM", name: "Gemini", description: zhEn("AI 图像理解与多模态研究", "AI IMAGE UNDERSTANDING & RESEARCH"), enabled: true, category: "ai", mastery: 0.28 },
    { id: "catpawai", code: "CPW", name: "CatPawAI", description: zhEn("AI 视觉生成 — 概念图与素材探索", "AI VISUAL GENERATION — CONCEPT & ASSETS"), enabled: true, category: "ai", mastery: 0.25 },
    { id: "trae", code: "TRE", name: "TRAE", description: zhEn("AI 原型与界面快速搭建", "AI PROTOTYPING & UI"), enabled: true, category: "ai", mastery: 0.22 },
  ],
};

export const defaultManagedProjects: ManagedProject[] = projects.map((project, index) => ({
  ...project,
  visible: true,
  order: index + 1,
  hero: defaultSiteSettings.heroSlugs.includes(project.slug),
}));

// === 模特 lookbook 系统：首页与后台共享 ===
export const modelLookbooks = [
  "/models/female-lookbook-01.png",
  "/models/female-lookbook-02.png",
  "/models/female-lookbook-03.png",
] as const;

export const modelPositions = ["0%", "33.333%", "66.667%", "100%"] as const;

export function modelVisual(project: { id: string }) {
  const index = Math.max(0, Number(project.id) - 1);
  return {
    src: modelLookbooks[Math.floor(index / 4) % modelLookbooks.length],
    position: modelPositions[index % modelPositions.length],
  };
}

export function modelCropStyle(project: { id: string }): Record<string, string> {
  const visual = modelVisual(project);
  return {
    "--model-image": `url("${visual.src}")`,
    "--model-x": visual.position,
  };
}

// === 软件工作流数据：右侧工作流程面板使用 ===
export type WorkflowStep = { title: Localized; detail: Localized };
export type WorkflowGroup = {
  title: Localized;
  steps: WorkflowStep[];
};

const wf = (tZh: string, tEn: string, dZh: string, dEn: string): WorkflowStep => ({
  title: zhEn(tZh, tEn),
  detail: zhEn(dZh, dEn),
});

export const softwareWorkflows: Record<string, WorkflowGroup> = {
  default: {
    title: zhEn("工作流程", "PROCESS"),
    steps: [
      wf("研究与调研", "RESEARCH", "趋势、面料、廓形与色彩方向调研", "TREND, FABRIC, SILHOUETTE & COLOR RESEARCH"),
      wf("概念与草图", "CONCEPT", "快速手稿、构图与图形方向实验", "RAPID SKETCHES, COMPOSITION & GRAPHIC EXPLORATION"),
      wf("图形系统", "GRAPHIC SYSTEM", "主图案、连续纹样与配色规范", "MAIN MOTIF, REPEAT PATTERN & COLOR SYSTEM"),
      wf("上身与三视图", "MOCK-UP & FLATS", "上身效果、技术三视图与版型示意", "MOCK-UPS, TECH FLATS & CONSTRUCTION NOTES"),
      wf("工艺建议", "PRODUCTION", "印花工艺、分色文件与生产规格", "PRINT TECHNIQUE, SEPARATION & SPEC SHEETS"),
    ],
  },
  illustrator: {
    title: zhEn("Illustrator · 工作流", "ILLUSTRATOR · WORKFLOW"),
    steps: [
      wf("矢量线稿", "VECTOR SKETCH", "钢笔工具绘制精确路径，锚点控制曲线", "PEN TOOL PRECISE PATHS, ANCHOR CONTROL"),
      wf("路径编辑", "PATH EDIT", "锚点增删、布尔运算与图形组合", "ANCHOR OPS, BOOLEAN & COMPOUND SHAPES"),
      wf("色块分色", "COLOR SEPARATION", "专色分版、色值规范与色板系统", "SPOT COLOR SEPARATION & SWATCH SYSTEM"),
      wf("连续纹样", "REPEAT PATTERN", "四方连续、定位印花与满版排列", "TILE, PLACEMENT & ALL-OVER LAYOUT"),
      wf("文件输出", "EXPORT", "制版 PDF、AI 分色文件与字体打包", "PRINT PDF, AI SEPARATION & FONT OUTLINE"),
    ],
  },
  photoshop: {
    title: zhEn("Photoshop · 工作流", "PHOTOSHOP · WORKFLOW"),
    steps: [
      wf("图像合成", "COMPOSITING", "图层混合、蒙版与智能对象", "LAYER BLEND, MASKS & SMART OBJECTS"),
      wf("上身效果", "MOCK-UP", "模特上身、印花贴合与场景合成", "MODEL MOCK-UP, PRINT MAPPING & SCENE"),
      wf("色彩调整", "COLOR ADJUST", "曲线、色阶与色调分离", "CURVES, LEVELS & TONE SEPARATION"),
      wf("滤镜渲染", "FILTER & RENDER", "Camera Raw 滤镜与质感叠加", "CAMERA RAW FILTERS & TEXTURE OVERLAY"),
      wf("分层输出", "EXPORT", "分图层 PSD、JPG 套图与色彩管理", "LAYERED PSD, JPG SUITE & COLOR MANAGEMENT"),
    ],
  },
  coreldraw: {
    title: zhEn("CorelDRAW · 工作流", "CORELDRAW · WORKFLOW"),
    steps: [
      wf("矢量排版", "VECTOR LAYOUT", "精确排版、版式与拼版", "PRECISE LAYOUT, COMPOSITION & IMPOSITION"),
      wf("印花分色", "SEPARATION", "专色分版与色值管理", "SPOT COLOR SEPARATION & MANAGEMENT"),
      wf("连续纹样", "REPEAT PATTERN", "四方连续、定位印花与满版排列", "TILE, PLACEMENT & ALL-OVER LAYOUT"),
      wf("制版输出", "PREPRESS", "印前检查、陷印与出血", "PREFLIGHT, TRAPPING & BLEED"),
      wf("工艺文件", "PRODUCTION FILE", "工艺单、刀模与拼版图", "SPEC SHEETS, DIES & IMPOSITION"),
    ],
  },
  clo3d: {
    title: zhEn("CLO 3D · 工作流", "CLO 3D · WORKFLOW"),
    steps: [
      wf("版型搭建", "PATTERN DRAFT", "2D 版片绘制、缝份与放码", "2D PATTERNS, SEAM & GRADING"),
      wf("面料仿真", "FABRIC SIM", "物理面料参数与垂感测试", "PHYSICAL FABRIC PARAMS & DRAPE TEST"),
      wf("虚拟试衣", "VIRTUAL FITTING", "缝合、穿着与动态测试", "SEWING, FITTING & DYNAMIC TEST"),
      wf("渲染输出", "RENDER", "材质、光照与最终渲染图", "MATERIAL, LIGHTING & FINAL RENDER"),
      wf("工艺同步", "PRODUCTION SYNC", "2D 版片导出与生产对接", "2D PATTERN EXPORT & HANDOFF"),
    ],
  },
  style3d: {
    title: zhEn("Style3D · 工作流", "STYLE3D · WORKFLOW"),
    steps: [
      wf("数字样衣", "DIGITAL SAMPLE", "快速建模与样衣生成", "RAPID MODELING & SAMPLE GENERATION"),
      wf("材质预览", "MATERIAL PREVIEW", "面料、印花与质感渲染", "FABRIC, PRINT & TEXTURE RENDER"),
      wf("动态展示", "MOTION", "走秀、动态与互动展示", "CATWALK, MOTION & INTERACTIVE DISPLAY"),
      wf("渲染输出", "RENDER", "多角度高清渲染图", "MULTI-ANGLE HIGH-RES RENDER"),
    ],
  },
  "garment-et": {
    title: zhEn("服装 ET · 工作流", "GARMENT ET · WORKFLOW"),
    steps: [
      wf("样板设计", "PATTERN DESIGN", "数字化样板与放码", "DIGITAL PATTERNS & GRADING"),
      wf("号型系列", "SIZE SET", "号型建立与系列化", "SIZE SETUP & SERIALIZATION"),
      wf("推档放码", "GRADING", "号型推档与规格表", "SIZE GRADING & SPEC TABLES"),
      wf("排料", "MARKER", "用料排料与成本计算", "MARKER LAYOUT & COST CALCULATION"),
      wf("工艺文件", "PRODUCTION FILE", "工艺单与生产对接", "TECH SHEETS & PRODUCTION HANDOFF"),
    ],
  },
  workbuddy: {
    title: zhEn("WorkBuddy · 工作流", "WORKBUDDY · WORKFLOW"),
    steps: [
      wf("协同设计", "CO-DESIGN", "AI 智能体辅助设计与迭代", "AI AGENT FOR CO-DESIGN & ITERATION"),
      wf("内容生成", "CONTENT", "自动生成文案、图稿与方案", "AUTO-GENERATED COPY, ART & PROPOSALS"),
      wf("工具链", "TOOLING", "设计脚本与自动化工作流", "DESIGN SCRIPTS & AUTOMATION"),
      wf("多智能体", "MULTI-AGENT", "多智能体协作完成复杂任务", "MULTI-AGENT COLLABORATION"),
      wf("项目交付", "DELIVERY", "方案整理、文件归档与交付确认", "ASSET ORGANIZATION & DELIVERY CONFIRMATION"),
    ],
  },
  claudecode: {
    title: zhEn("Claude Code · 工作流", "CLAUDE CODE · WORKFLOW"),
    steps: [
      wf("需求分析", "ANALYSIS", "理解设计需求，拆解任务与技术方案", "PARSE DESIGN BRIEF, DECOMPOSE TASKS & TECH PLAN"),
      wf("代码生成", "CODE GEN", "AI 代码生成与脚手架", "AI CODE GEN & SCAFFOLDING"),
      wf("重构调试", "REFACTOR", "代码重构、Bug 排查与优化", "REFACTOR, DEBUG & OPTIMIZE"),
      wf("工具链", "TOOLING", "设计工具集成与自动化", "DESIGN TOOLING & AUTOMATION"),
      wf("部署交付", "DEPLOY", "构建发布与线上验证", "BUILD, RELEASE & VERIFY"),
    ],
  },
  codex: {
    title: zhEn("Codex · 工作流", "CODEX · WORKFLOW"),
    steps: [
      wf("代码生成", "CODE GEN", "AI 代码生成与脚本编写", "AI CODE GENERATION & SCRIPTING"),
      wf("自动化", "AUTOMATION", "批量处理与自动化辅助任务", "BATCH PROCESSING & AUTOMATION ASSIST"),
      wf("测试验证", "TESTING", "生成测试用例与验证逻辑", "TEST CASE GENERATION & LOGIC VERIFICATION"),
      wf("文档生成", "DOCS", "自动生成注释与技术文档", "AUTO-GENERATED COMMENTS & TECH DOCS"),
    ],
  },
  gemini: {
    title: zhEn("Gemini · 工作流", "GEMINI · WORKFLOW"),
    steps: [
      wf("图像理解", "IMAGE UNDERSTANDING", "图像理解与视觉分析", "IMAGE UNDERSTANDING & VISUAL ANALYSIS"),
      wf("多模态研究", "MULTIMODAL RESEARCH", "图文交叉检索与趋势调研", "CROSS-MODAL SEARCH & TREND RESEARCH"),
      wf("文案生成", "COPY GEN", "生成产品文案与双语描述", "PRODUCT COPY & BILINGUAL DESCRIPTION"),
      wf("知识问答", "KNOWLEDGE Q&A", "面料工艺与行业知识查询", "FABRIC, CRAFT & INDUSTRY KNOWLEDGE"),
    ],
  },
  trae: {
    title: zhEn("TRAE · 工作流", "TRAE · WORKFLOW"),
    steps: [
      wf("原型搭建", "PROTOTYPE", "AI 驱动快速原型与界面生成", "AI-DRIVEN RAPID PROTOTYPING & UI GEN"),
      wf("组件生成", "COMPONENT GEN", "自动生成页面组件与布局", "AUTO-GENERATED PAGES, COMPONENTS & LAYOUT"),
      wf("交互设计", "INTERACTION", "交互逻辑与动效辅助定义", "INTERACTION LOGIC & MOTION ASSIST"),
      wf("快速迭代", "ITERATION", "实时预览与快速调整发布", "LIVE PREVIEW & FAST ITERATE-DEPLOY"),
    ],
  },
  catpawai: {
    title: zhEn("CatPawAI · 工作流", "CATPAWAI · WORKFLOW"),
    steps: [
      wf("概念生成", "CONCEPT GEN", "AI 视觉生成服装图案概念图", "AI VISUAL GEN FOR PRINT CONCEPT ART"),
      wf("素材探索", "ASSET EXPLORATION", "快速迭代图案方向与风格变体", "RAPID ITERATION ON MOTIF & STYLE VARIANTS"),
      wf("风格迁移", "STYLE TRANSFER", "将参考风格应用到图案设计", "APPLY REFERENCE STYLE TO PRINT DESIGN"),
      wf("配色方案", "COLOR SCHEME", "自动生成配色组合与变体", "AUTO-GENERATED COLOR COMBOS & VARIANTS"),
    ],
  },
};

export const defaultServiceScope: Localized[] = [
  zhEn("服装图案设计", "GARMENT PATTERN"),
  zhEn("定位印花与满版纹样", "PLACEMENT & ALL-OVER PRINT"),
  zhEn("平面视觉系统", "GRAPHIC SYSTEM"),
  zhEn("插画与角色", "ILLUSTRATION & CHARACTER"),
  zhEn("配色与印花方向", "COLOR & DIRECTION"),
];
