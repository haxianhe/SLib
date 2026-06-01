---
title: SLib 新增 image-prompt 系列 skill 设计
date: 2026-05-29
author: haxianhe
status: draft
---

# SLib 新增 image-prompt 系列 skill 设计

> 一组只产文生图 prompt(不调后端)的 SLib skill,参考 baoyu-skills 的 infographic / cover-image / xhs-images,以"分层暴露 + 具象描述"重新组织,把好看的能力完整保留下来同时大幅降低使用复杂度。

## 1. 背景与目标

### 1.1 诉求来源

`baoyu-skills`(https://github.com/JimLiu/baoyu-skills)生态里 `baoyu-infographic` / `baoyu-cover-image` / `baoyu-xhs-images` 三个 skill 在"出好看的图"这件事上做得很扎实——它们把 21 layout × 22 style 这样的庞大模板库精心组织,为不同内容场景沉淀了大量调好的视觉组合。

但它们使用起来太重:

| 复杂度来源 | 具体表现 |
|---|---|
| **维度爆炸** | infographic 21×22=462 组合;cover-image 6×11×7×4×3×4=约 2 万种组合;xhs 12×6=72。用户记不住,推荐表反而成了"必读" |
| **强制 EXTEND.md** | 每个 skill 第一次运行 BLOCKING first-time setup,3 个 skill 3 份配置文件 |
| **Backend 解析重复粘贴** | 每个 SKILL.md 顶部 40 行 "Image Generation Tools" 规则(Codex / baoyu-image-gen / 10 个 provider 优先级),三份基本一样 |
| **强制确认门** | 每次走 AskUserQuestion 选 layout / style / aspect / language / backend,需要 `--quick` 才能跳 |
| **强制 5-7 步工作流** | source.md → analysis.md → structured-content.md → prompts/xxx.md → image.png,简单需求被强制走全套 |
| **防御性规则混入前台** | "never paint over bitmap"、"never substitute SVG"、prompt file hard requirement 等后端 contract 渗入 SKILL.md 顶层 |

### 1.2 目标

在 SLib 中新增 3 个 skill,**保留 baoyu 全部好看的能力,但把使用复杂度压到与现有 `architecture-diagram` 相当**:

- **能力不丢**:22 style / 21 layout / 11 palette / 7 rendering / 6 type 等模板库完整搬运到 references/
- **入口清爽**:第一眼只看到 6-8 个具象命名的"预设",看图选,不需要懂术语
- **零仪式感**:不强制配置文件、不强制确认门、不强制中间产物
- **跨平台**:只产 prompt `.md` 文件,用户拿到任意文生图平台(Midjourney / 即梦 / 通义 / Nano Banana / Sora)都能用

### 1.3 在 SLib 中的定位

SLib 现有 `slib:architecture-diagram` 负责"结构化、向量化"的图(drawio / mermaid / PlantUML)。本系列 3 个 skill 负责"光栅、AI 生图"路线的 prompt 产出,与 `architecture-diagram` 形成完整互补:

```
slib:architecture-diagram      ← 结构图(drawio / mermaid / PlantUML),自己出最终图
slib:image-prompt-info         ← 信息图 AI prompt,用户拿去文生图平台出图
slib:image-prompt-cover        ← 文章封面 AI prompt
slib:image-prompt-xhs          ← 小红书图卡 AI prompt
```

## 2. 设计原则

3 条原则一票否决,所有设计决策必须满足这 3 条。

### 原则 1:只产 prompt,不调后端

**做什么**:输出一份完整、可直接复制的 prompt `.md` 文件,落到 `~/knowledge/image-prompts/{date}-{slug}/prompt.md` + 终端展示。

**不做什么**:不调用任何文生图 API、不内嵌 backend 解析、不维护 provider 配置、不处理 --ref 后端能力差异。

**为什么**:
- 用户原话:"产出画图 prompt 相关能力" — 边界清晰
- 跨平台:同一份 prompt 在 Midjourney / 即梦 / 通义万象 / Nano Banana / Sora 都能用
- 砍掉 baoyu 三个 SKILL.md 顶部各 40 行的 backend 规则,以及 EXTEND.md / first-time setup / quick_mode 等所有派生复杂度

### 原则 2:分层暴露(预设 → 全名单 → 细节)

把"庞大的模板库"按访问频率分 3 层暴露,用户感知到的复杂度只看第 1 层:

```
第 1 层  推荐预设(SKILL.md 直接列,6-8 个)
         ↓ 80% 场景秒选,看图就懂
         ↓
第 2 层  完整名单(SKILL.md 列名字 + 一句话适用场景,~20+ 项)
         ↓ 用户点名"我要 cyberpunk-neon / origami"才用到
         ↓
第 3 层  风格细节(references/styles/<name>.md,完整搬运 baoyu 的几百字视觉指令)
         ↓ skill 按需读对应文件,拼到 prompt 里
```

**保证**:
- 第 1 层精选预设 = baoyu "Recommended Combinations" 表的精选,没有重新调
- 第 2 层完整列出全部 layout / style / palette / type / rendering,**0 删减**
- 第 3 层从 baoyu references/ 完整搬运(原文级别)

**收益**:
- 入口认知:6-8 个 vs 462 / 22000 / 72
- 能力完整度:100% 保留
- SKILL.md 体积:不超过 400 行,符合 SLib 现有 skill 体量

### 原则 3:看了就懂(描述规范硬约束)

预设、layout、style、palette 等每个条目必须有具象描述,让没接触过设计的人也能直接选。

**3 件套**:
1. **看起来像** — 1 句具体视觉:颜色 + 元素 + 质感(禁止用"精致 / 高端 / 现代"这类抽象词)
2. **用在哪** — 1 个具体场景例子(禁止"适合任何内容"这种空话)
3. **预览图** — 链 baoyu 官方 raw URL,Claude Code IDE / web 端可直接渲染

**反例**:
```
| morandi-journal | 莫兰迪风格,适合温暖内容 | ❌ 抽象 + 空话 |
```

**正例**:
```
| morandi-journal | 米黄牛皮纸 + 灰粉/雾蓝/茶绿色块 + 手绘涂鸦笔触 | 治愈系书摘、生活方式 long-form 配图 | ✅ |
```

详细规范见第 5 节。

## 3. Skill 命名与对应关系

### 3.1 三个 skill

| Skill 名 | 对标 baoyu | 一句话定位 |
|---|---|---|
| `slib:image-prompt-info` | `baoyu-infographic` | 信息图(infographic)AI 生图 prompt |
| `slib:image-prompt-cover` | `baoyu-cover-image` | 文章封面图 AI 生图 prompt |
| `slib:image-prompt-xhs` | `baoyu-xhs-images` | 小红书图卡 AI 生图 prompt |

### 3.2 命名取舍

- **前缀 `image-prompt-`** — 明确告诉用户"产 prompt 不产图",避免预期偏差
- **后缀 `info` / `cover` / `xhs`** — 跟现有 SLib skill 命名风格(短词或形容词-名词)一致;长度齐(3-5 字符)
- **不带 `gen`** — 名词短语作 skill 名隐含"生成",参考 `architecture-diagram` 套路
- **不合并为单一 skill** — 三种场景产出形态差异大(信息图 1 张 / 封面 1 张 / 小红书多张),分开维护各自的预设表更清晰

### 3.3 触发条件(注入 using-slib)

| Skill | 触发条件 |
|---|---|
| `slib:image-prompt-info` | 用户说"画信息图 / 做信息卡 / 可视化数据 / 高密度大图 / 知识卡片 / dataviz / infographic"、提供数据/教程内容并希望出一张视觉化图 |
| `slib:image-prompt-cover` | 用户说"做文章封面 / 封面图 / banner / cover / 配个题图"、有文章/标题想要配主视觉 |
| `slib:image-prompt-xhs` | 用户说"做小红书图 / 出图卡 / 社交多图 / 多张图卡 / xhs / 知识小抄"、想要分成多张的图卡系列 |

### 3.4 不重叠原则

| 用户意图 | 应触发 |
|---|---|
| "画一个架构图" | `slib:architecture-diagram`(向量结构图) |
| "画一张信息图把这些数据可视化" | `slib:image-prompt-info`(AI 生图) |
| "给这篇文章配个封面" | `slib:image-prompt-cover` |
| "做一组小红书图卡" | `slib:image-prompt-xhs` |

边界判断口诀:**结构清晰的走 architecture-diagram(出最终图);要好看 / AI 风格的走 image-prompt-***(出 prompt)。

## 4. 目录结构

### 4.1 SLib 仓库内布局

```
SLib/
├── skills/
│   ├── using-slib/
│   ├── afeaturemerge/
│   ├── learning/
│   ├── summary/
│   ├── search/
│   ├── architecture-diagram/
│   ├── image-prompt-info/          ← 新增
│   │   ├── SKILL.md
│   │   └── references/
│   │       ├── layouts/            # 21 个 layout 描述,每个一份 .md
│   │       ├── styles/             # 22 个 style 描述
│   │       ├── palettes/           # 3 个 palette(macaron / warm / neon)
│   │       └── base-prompt.md      # prompt 拼装模板
│   ├── image-prompt-cover/         ← 新增
│   │   ├── SKILL.md
│   │   └── references/
│   │       ├── types/              # 6 个 type(hero / conceptual / typography / metaphor / scene / minimal)
│   │       ├── palettes/           # 11 个 palette
│   │       ├── renderings/         # 7 个 rendering 风格
│   │       ├── dimensions/         # text / mood / font 三档定义
│   │       └── base-prompt.md
│   └── image-prompt-xhs/           ← 新增
│       ├── SKILL.md
│       └── references/
│           ├── styles/             # 12 个 style
│           ├── layouts/            # 6 个 layout
│           ├── palettes/           # 3 个 palette
│           └── base-prompt.md
└── docs/specs/
    └── 2026-05-29-image-prompt-skills-design.md   ← 本设计文档
```

### 4.2 单个 skill 的 SKILL.md 结构(三者通用)

每个 SKILL.md 内部章节固定按如下顺序,保证横向一致:

```markdown
---
name: image-prompt-{info|cover|xhs}
description: |
  ...触发条件...
---

# image-prompt-{...}: {一句话定位}

## 1. 快速选(推荐预设)         ← 第 1 层,SKILL.md 主屏
表:预设名 / 看起来像 / 用在哪 / 预览图

## 2. 完整库(自由组合)         ← 第 2 层,SKILL.md 主屏
表:layout 全量 / style 全量 / palette 全量(每项一行)

## 3. 工作流                    ← 5 步固定流程
1. 接受输入  2. 内容分析 → 推预设  3. 用户确认/调整  4. 拼 prompt 文件  5. 落盘 + 展示

## 4. Prompt 文件格式            ← 引用第 10 节模板
YAML frontmatter + 正文

## 5. References 索引            ← 第 3 层入口
按需读 references/{layouts|styles|palettes}/<name>.md
```

预估每个 SKILL.md 体量 ~350-450 行,跟现有 `architecture-diagram`(312 行)同档。

### 4.3 产物落地路径

```
~/knowledge/image-prompts/
└── 2026-05-29-{slug}/
    ├── prompt.md                # 最终 prompt(YAML frontmatter + 正文)
    └── source.md                # (输入备份,仅当用户给的是文件路径或长内容时存)
```

- 命名:`{YYYY-MM-DD}-{slug}`,slug 从主题取 2-4 词 kebab-case
- 冲突:追加 `-HHMMSS`
- xhs 多图场景:`prompt.md` 改成 `prompts/01-{slug}.md` ... `prompts/NN-{slug}.md`
- 不产中间文件:**没有** analysis.md / structured-content.md / source-backup-* 等 baoyu 的产物

## 5. 描述规范(3 件套硬约束)

### 5.1 规范本身

第 1 层预设、第 2 层完整库的每一项,必须按这套规范写,无一例外:

| 字段 | 必填 | 内容要求 |
|---|---|---|
| **名字** | ✅ | 英文 slug,小写 + 连字符 |
| **看起来像** | ✅ | 1 句具象视觉描述:颜色 / 元素 / 质感 / 字体 |
| **用在哪** | ✅ | 1 个具体场景例子(指名 1 个内容主题) |
| **预览图** | 推荐 | baoyu 官方 raw URL,缺失时空白 |

### 5.2 "看起来像"写作要求

**必须包含**(至少 2 项):
- 颜色具象:不说"暖色"说"砖红 + 芥末黄"
- 元素具象:不说"插画感"说"简笔人物 + 圆角方块"
- 质感具象:不说"复古"说"褪色印刷 + 半调点纹"
- 字体具象:不说"手绘字"说"歪斜手写体 + 黑色描边"

**禁用词清单**:精致 / 高端 / 现代 / 大气 / 时尚 / 简约 / 设计感 / 高级感 / 文艺 / 治愈(单独出现不算具象)

### 5.3 "用在哪"写作要求

**必须包含**:1 个能脑补出画面的内容主题

| 反例 | 正例 |
|---|---|
| 适合教育内容 | 给小学生讲分数的概念入门 |
| 适合科技文章 | AI 工具新品发布封面、黑客松宣传 |
| 适合温暖叙事 | 母亲节给妈妈的话、童年回忆故事 |
| 适合数据展示 | 季度销售看板、A/B 测试结果汇报 |

### 5.4 预览图 URL 规范

baoyu 截图统一在 `https://github.com/JimLiu/baoyu-skills/raw/main/screenshots/{分类}/{name}.webp`:

| skill | 截图目录 |
|---|---|
| info | `infographic-styles/`、`infographic-layouts/` |
| cover | (baoyu-cover-image 无截图,留空) |
| xhs | `xhs-images-styles/`、`xhs-images-layouts/` |

**约束**:
- 第 1 层精选预设:截图必须存在,否则不进入精选(体验承诺)
- 第 2 层完整库:截图缺失时仅文字也可(不阻塞)
- 一律用 raw URL,**不要**用 GitHub blob 页地址

### 5.5 模板代码块

```markdown
| 预设名 | 看起来像 | 用在哪 | 预览 |
|---|---|---|---|
| 知识卡 | 米黄牛皮纸 + 手绘格子 + 马卡龙色块(粉/蓝/绿)+ 黑色手写体 | 给小学生讲分数的概念入门 | ![](https://github.com/JimLiu/baoyu-skills/raw/main/screenshots/infographic-styles/craft-handmade.webp) |
```

写每个 skill 时复制这个模板,逐行填。

## 6. image-prompt-info 详细设计

### 6.1 定位

把数据 / 教程 / 概念组织成一张信息密度高、视觉有冲击力的图,产出 AI 生图 prompt。

### 6.2 第 1 层:推荐预设(8 个)

| 预设 | 看起来像 | 用在哪 | 预览 |
|---|---|---|---|
| **知识卡** | 米黄牛皮纸底 + 手绘格子分区 + 马卡龙色块(粉/蓝/绿/桃)+ 黑色手写体标题 + 简笔图标 | 给小学生讲分数的概念入门、5 分钟看懂 OAuth | ![](https://github.com/JimLiu/baoyu-skills/raw/main/screenshots/infographic-styles/craft-handmade.webp) |
| **复古高密度** | 1970s 波普海报风,粗黑描边 + 番茄红/芥末黄/孔雀蓝大色块,Swiss 栅格,长图竖版 | 一图讲完"15 个 Git 高频命令"、Vim 速查表 | ![](https://github.com/JimLiu/baoyu-skills/raw/main/screenshots/infographic-layouts/dense-modules.webp) |
| **流程教程** | 宜家说明书风,纯黑线稿无填色,数字步骤圈 + 极简箭头 + 几何小人 | 手把手装显卡、配置家庭路由器 | ![](https://github.com/JimLiu/baoyu-skills/raw/main/screenshots/infographic-styles/ikea-manual.webp) |
| **数据看板** | 公司年报风,白底网格 + 折线/柱状图 + 大数字 + 扁平 icon + 莫兰迪冷色调 | 季度销售看板、A/B 测试结果汇报 | ![](https://github.com/JimLiu/baoyu-skills/raw/main/screenshots/infographic-styles/corporate-memphis.webp) |
| **赛博朋克** | 紫黑底 + 霓虹粉绿发光线条 + 故障字效 + 电路纹 + 全息感 | AI 工具新品发布封面、黑客松宣传 | ![](https://github.com/JimLiu/baoyu-skills/raw/main/screenshots/infographic-styles/cyberpunk-neon.webp) |
| **黑板手写** | 深绿黑板底 + 白/黄/粉粉笔字 + 简笔画 + 板擦痕迹 + 课程编号圈 | 读书会分享、家长讲数学题 | ![](https://github.com/JimLiu/baoyu-skills/raw/main/screenshots/infographic-styles/chalkboard.webp) |
| **A vs B 对比** | 左右两栏强对比,中间分隔线,左暖红/右冷青,各自图标 + bullet list | iPhone vs 安卓选购、Vue vs React 对比 | ![](https://github.com/JimLiu/baoyu-skills/raw/main/screenshots/infographic-layouts/comparison-table.webp) |
| **冰山揭示** | 横向海平面,上 1/8 露出冰山尖(表象),下 7/8 巨大冰体(本质),冷蓝水彩感 | 揭示成功背后的努力、技术栈底层原理 | ![](https://github.com/JimLiu/baoyu-skills/raw/main/screenshots/infographic-layouts/iceberg.webp) |

### 6.3 第 2 层:完整 Layout 库(21 个)

| Layout | 看起来像 | 用在哪 |
|---|---|---|
| `linear-progression` | 一条横向/纵向时间线 + 节点编号 + 节点小图 | 历史事件、产品演进、操作步骤 |
| `binary-comparison` | 左右两栏对称分隔 | A vs B、前后对比、利弊清单 |
| `comparison-matrix` | 多行多列表格,首行/首列做表头 | 多维度产品对比、选型矩阵 |
| `hierarchical-layers` | 金字塔分层叠放 | 马斯洛需求、优先级、能力金字塔 |
| `tree-branching` | 根节点 + 树状分叉 | 组织架构、目录结构、分类法 |
| `hub-spoke` | 中心圆 + 辐射连接多个外围圆 | 核心概念 + 关联事项、星型架构 |
| `structural-breakdown` | 爆炸视图,组件拆开排列 + 引线标注 | 产品组件拆解、机械剖面 |
| `bento-grid` | 日式便当盒分格,大小不一矩形拼出版面 | 多主题概览、杂志封面 |
| `iceberg` | 冰山,水面上 1/8 + 水下 7/8 | 揭示隐藏成因、表象 vs 本质 |
| `bridge` | 左岸"问题"+ 右岸"方案"+ 中间桥连接 | 问题→解决方案、痛点→产品价值 |
| `funnel` | 倒漏斗,从粗到细分层 | 转化率拆解、筛选流程 |
| `isometric-map` | 2.5D 等距视角的城市/建筑物 | 空间关系、虚拟世界俯瞰 |
| `dashboard` | 仪表盘多卡片,折线/柱状/环形图混合 | KPI、监控大屏、季度复盘 |
| `periodic-table` | 元素周期表式方格阵列,带分类色 | 工具集合、知识图鉴、能力图谱 |
| `comic-strip` | 4-6 格漫画,叙事性画框 | 用户故事、产品 demo、教学情景剧 |
| `story-mountain` | 山形曲线,标记起承转合 | 剧情结构、张力弧线、用户旅程 |
| `jigsaw` | 拼图块互相咬合 | 团队协作、互相依赖的模块 |
| `venn-diagram` | 2-3 个圆交叠 | 概念交集、产品共性、定位差异 |
| `winding-roadmap` | 弯曲山路 + 沿途里程碑标 | 学习路径、产品演进、目标分解 |
| `circular-flow` | 闭环箭头,循环过程 | OODA 循环、PDCA、生命周期 |
| `dense-modules` | 高密度模块墙,小卡片密排,长图竖版 | 干货速查、Cheat Sheet、命令清单 |

### 6.4 第 2 层:完整 Style 库(22 个)

| Style | 看起来像 | 用在哪 |
|---|---|---|
| `craft-handmade` | 米黄牛皮纸 + 黑色手绘线 + 马卡龙色块 + 简笔画 | 教育、知识入门、亲子科普 |
| `claymation` | 3D 粘土小人 + 圆滚滚物体 + 暖色棚拍光 | 育儿、宠物、儿童 App |
| `kawaii` | 日系卡通,大眼睛 + 樱花粉/天空蓝/薄荷绿淡彩 | 萌系科普、表情包、IP 形象 |
| `storybook-watercolor` | 童话绘本水彩,柔边晕染 + 童趣场景 | 童话故事、温暖回忆、儿童读物 |
| `chalkboard` | 深绿黑板 + 白/黄粉笔字 + 板擦痕 | 课堂笔记、读书会、家庭教学 |
| `cyberpunk-neon` | 紫黑底 + 霓虹粉绿发光 + 故障字 + 电路纹 | AI 发布会、黑客松、夜店海报 |
| `bold-graphic` | 美漫风,粗黑描边 + 半调点纹 + 高对比拼色 | 漫画封面、影评海报、潮流文化 |
| `aged-academia` | 复古博物志,棕黄做旧纸 + 钢笔素描 + 拉丁标签 | 科学史、博物志、复古工具书 |
| `corporate-memphis` | 扁平矢量,小人无脸 + 高饱和填色 | 企业宣传、SaaS 产品页、社招海报 |
| `technical-schematic` | 蓝图,深蓝底 + 白色细线工程图 + 尺寸标注 | 架构图、机械工程、严肃科普 |
| `origami` | 折纸几何感,纸张折痕 + 扁平棱角 | 极简品牌、东方美学、几何抽象 |
| `pixel-art` | 8-bit 像素 + 复古游戏 + FC 红黄绿 | 复古游戏、独立开发、技术怀旧 |
| `ui-wireframe` | 灰阶线框 + 占位灰块 + 标注尺寸 | 设计稿、产品原型、交互说明 |
| `subway-map` | 地铁线路图,多色直线 + 圆形站点 + 90 度拐角 | 知识图谱、能力路线、技能树 |
| `ikea-manual` | 宜家说明书,纯黑线稿 + 几何小人 + 步骤编号 | 装配教程、配置流程、操作指南 |
| `knolling` | 物品俯拍 + 整齐排列 + 留白 | 装备评测、工具清单、收纳分享 |
| `lego-brick` | 乐高积木拼出图形,鲜艳块状 | 编程教学、儿童创客、玩具评测 |
| `pop-laboratory` | 实验室蓝图 + 坐标网格 + 数据标记 + 严谨感 | 科学解读、技术调研报告、白皮书 |
| `morandi-journal` | 莫兰迪色 + 灰粉/雾蓝/茶绿 + 手账涂鸦 | 治愈系书摘、生活方式 long-form |
| `retro-pop-grid` | 1970s 波普 + 番茄红/芥末黄/孔雀蓝 + Swiss 栅格 | 干货长图、复古杂志、潮流海报 |
| `hand-drawn-edu` | 马卡龙粉彩 + 手绘抖动线 + 简笔小人 | 课件、亲子讲解、轻松科普 |
| `retro-popup-pop` | 复古立体书拼贴,vintage UI + 厚描边 + 拟物按钮 | 怀旧科技、复古产品、Z 世代 vintage |

### 6.5 第 2 层:Palette 库(3 个,可叠加到任意 style)

| Palette | 看起来像 | 用在哪 |
|---|---|---|
| `macaron` | 马卡龙粉彩,米奶油底 + 粉/雾蓝/薄荷/桃色块 + 珊瑚红点睛 | 教育、亲子、知识入门 |
| `warm` | 暖陶土,蜜桃底 + 暖橙/红土陶/金黄 + 深棕描线,无任何冷色 | 品牌、生活方式、餐饮 |
| `neon` | 霓虹反差,深紫底 + 粉/青/绿荧光,高对比 | 游戏、复古赛博、潮流文化 |

### 6.6 内容 → 预设推荐规则(skill 自动用)

| 内容信号 | 默认推预设 |
|---|---|
| 包含步骤编号 / "怎么做 X" / 流程关键词 | 流程教程 |
| 包含数字 / 百分比 / KPI / 季度 / 销售 | 数据看板 |
| 包含 "vs" / "对比" / "好坏" / "选哪个" | A vs B 对比 |
| 包含 "本质" / "底层" / "其实是" / "看不见的" | 冰山揭示 |
| 包含 "Cheat Sheet" / "速查" / 命令清单 / >10 个并列项 | 复古高密度 |
| 包含 AI / 黑客 / 赛博 / 未来 / 暗系审美 | 赛博朋克 |
| 包含课堂 / 教学 / 板书 / 课程 | 黑板手写 |
| 其他(默认) | 知识卡 |

未命中或用户不接受默认,展示全部 8 预设供选。

## 7. image-prompt-cover 详细设计

### 7.1 定位

给文章 / 博客 / Newsletter / 视频缩略图配主视觉,产出 AI 生图 prompt。单张图,常用 16:9 / 2.35:1 / 1:1。

### 7.2 第 1 层:推荐预设(6 个)

| 预设 | 看起来像 | 用在哪 | 预览 |
|---|---|---|---|
| **极客蓝图** | 深蓝纸底 + 白色细工程线 + 等距 2.5D + 标尺刻度,科技严谨 | 系统架构文、技术深度长文 | — |
| **温暖手绘** | 暖米黄 + 手绘抖动线 + 简笔人物 + 一只猫,亲切叙事 | 个人博客、产品故事、复盘随笔 | — |
| **高对比海报** | 浓黑/酒红/芒果黄 + 厚描边 + 大字标题撑满,海报感 | 观点文、行业评论、Newsletter 头条 | — |
| **极简文字** | 白底 / 黑底,无图,巨大无衬线标题居中,留白 70% | 思考札记、宣言、TED 风短文 | — |
| **暗色氛围** | 深紫黑底 + 渐变光晕 + 玻璃质感卡片 + 微光高光 | AI 周报、午夜推送、Sci-Fi 影评 | — |
| **油画肖像** | 厚涂笔触 + 暖光 + 单一人物剪影或半身 + 戏剧光影 | 人物访谈、传记摘录、长篇小说 | — |

> ⚠️ baoyu-cover-image 仓库未提供 screenshots,预览图列暂留空白。skill 实施时若 baoyu 之后补图,可批量补 raw URL。

### 7.3 第 2 层:完整 Type 库(6 个)

封面图 5 维度的最关键维度——决定**这张图本质是什么**。

| Type | 看起来像 | 用在哪 |
|---|---|---|
| `hero` | 主体居中 + 大留白 + 强视觉锚点 | 产品发布、品牌主页头图 |
| `conceptual` | 抽象隐喻图像,不直接表达内容 | 思辨/哲学文章、观点评论 |
| `typography` | 文字本身就是主视觉,几乎无图 | 宣言、引言、纯思考类文章 |
| `metaphor` | 视觉隐喻,一个具体物代表抽象概念 | "技术债是腐烂的桥"等比喻文 |
| `scene` | 一个有人物/场景的瞬间画面 | 故事、回忆、案例叙述 |
| `minimal` | 极少元素,几何 + 大块色 + 极致克制 | 极简主义、禅意、产品宣言 |

### 7.4 第 2 层:完整 Palette 库(11 个)

| Palette | 看起来像 | 用在哪 |
|---|---|---|
| `warm` | 暖橙/暖黄/红土陶 | 个人叙事、品牌温度 |
| `elegant` | 米白 + 香槟金 + 深咖,低饱和高级感 | 高端商业、奢侈品类 |
| `cool` | 冰蓝/雾灰/银 | 科技理性、金融分析 |
| `dark` | 深黑底 + 局部冷光,沉浸氛围 | Sci-Fi、深度技术、夜间阅读 |
| `earth` | 大地色,陶土/橄榄绿/燕麦 | 自然主题、可持续、户外 |
| `vivid` | 高饱和撞色,番茄红 + 电光蓝 + 柠檬黄 | 潮流、年轻文化、广告 |
| `pastel` | 樱花粉/天蓝/薄荷 | 治愈、亲子、轻量教育 |
| `mono` | 单色调,纯黑白灰 | 极简、严肃、新闻报道 |
| `retro` | 70s/80s 色,芥末黄/砖红/孔雀蓝 | 怀旧、复古杂志风 |
| `duotone` | 双色调,只用 2 种主色 + 1 中性 | 海报、设计感强、品牌头图 |
| `macaron` | 米奶油底 + 马卡龙粉彩点缀 | 知识入门、亲子科普 |

### 7.5 第 2 层:完整 Rendering 库(7 个)

| Rendering | 看起来像 | 用在哪 |
|---|---|---|
| `flat-vector` | 扁平矢量,无阴影/渐变,纯色块 | 现代品牌、SaaS、产品页 |
| `hand-drawn` | 手绘线条,抖动 + 不规则 + 黑铅笔感 | 温暖叙事、个人博客 |
| `painterly` | 厚涂油画,可见笔触 + 戏剧光影 | 人物肖像、文学性内容 |
| `digital` | 数字绘画,光滑渐变 + 数码光感 | Sci-Fi、游戏、Tech |
| `pixel` | 8/16-bit 像素 | 复古游戏、独立开发文化 |
| `chalk` | 粉笔肌理 + 黑板感 | 教学、复古课堂 |
| `screen-print` | 丝网印刷,粗描边 + 半调点纹 + 错版色 | 海报、潮牌、亚文化 |

### 7.6 第 2 层:Text / Mood / Font 维度

**Text(文字含量)**:
| 值 | 看起来像 | 用在哪 |
|---|---|---|
| `none` | 纯视觉,零文字 | 通用占位、纯氛围头图 |
| `title-only` | 一个大标题 + 主图(默认) | 大多数文章 |
| `title-subtitle` | 标题 + 副标题 | 长文、专题报道 |
| `text-rich` | 多标签/引文/数据嵌入 | 数据报告、信息密度高的封面 |

**Mood(对比强度)**:
| 值 | 看起来像 | 用在哪 |
|---|---|---|
| `subtle` | 低对比,温柔静谧 | 治愈、文艺、reflective |
| `balanced` | 中等对比(默认) | 大多数场景 |
| `bold` | 高对比 + 强张力 | 观点、号召、海报感 |

**Font(字体感觉)**:
| 值 | 看起来像 | 用在哪 |
|---|---|---|
| `clean` | 现代无衬线,几何感 | 科技、企业 |
| `handwritten` | 手写抖动体 | 个人、温暖、亲子 |
| `serif` | 衬线,书卷气 | 文学、新闻、深度长文 |
| `display` | 粗壮装饰字,海报型 | 头条、潮流、活动宣传 |

### 7.7 内容 → 预设推荐规则

| 内容信号 | 默认推预设 |
|---|---|
| 包含架构 / 系统 / 工程 / 协议 | 极客蓝图 |
| 个人叙事 / 复盘 / 我们的故事 | 温暖手绘 |
| 观点文 / 锐评 / Newsletter 头条 / 行业批评 | 高对比海报 |
| 思考札记 / 一句话洞察 / 宣言式 | 极简文字 |
| AI / Sci-Fi / 深夜推送 / 神秘氛围 | 暗色氛围 |
| 人物访谈 / 传记 / 长篇文学 | 油画肖像 |

未命中默认 → 温暖手绘(中立场景)。

## 8. image-prompt-xhs 详细设计

### 8.1 定位

把一段内容拆成 1-10 张图卡的系列(竖版 3:4),适合小红书 / 公众号头条九宫格 / IG 故事系列。产出多份 prompt 文件,每张一份。

### 8.2 第 1 层:推荐预设(6 个)

| 预设 | 看起来像 | 用在哪 | 预览 |
|---|---|---|---|
| **可爱知识卡** | 米奶油底 + 圆角卡 + 樱花粉/薄荷绿/雾蓝 + Q 版小人 + 圆头手写体 | 萌系科普、健康知识、亲子分享 | ![](https://github.com/JimLiu/baoyu-skills/raw/main/screenshots/xhs-images-styles/cute.webp) |
| **清新生活流** | 莫兰迪绿 + 暖米黄底 + 极细线 + 大面积留白 + 嫩芽/咖啡 icon | 早 c 晚 a、日常 vlog、生活仪式感 | ![](https://github.com/JimLiu/baoyu-skills/raw/main/screenshots/xhs-images-styles/fresh.webp) |
| **暖光叙事** | 暖橙 + 蜜桃 + 暖棕,胶片颗粒感 + 居家光晕 | 妈妈故事、好物长测、暖心案例 | ![](https://github.com/JimLiu/baoyu-skills/raw/main/screenshots/xhs-images-styles/warm.webp) |
| **干货知识小抄** | 粉色背景 + 黑色粗框 + 序号大字 + 密排短句 | "8 个高效率小工具"、读书笔记 | ![](https://github.com/JimLiu/baoyu-skills/raw/main/screenshots/xhs-images-layouts/dense.webp) |
| **故事封面** | 1 个大主图 + 顶部短金句 + 底部小副标,留白 60% | 个人故事开篇、长文 1.0 封面 | ![](https://github.com/JimLiu/baoyu-skills/raw/main/screenshots/xhs-images-layouts/sparse.webp) |
| **前后对比** | 上下/左右两半,左灰/右彩,各 1 张图 + 标签 | 减肥前后、改造对比、产品测评 | ![](https://github.com/JimLiu/baoyu-skills/raw/main/screenshots/xhs-images-layouts/comparison.webp) |

### 8.3 第 2 层:完整 Style 库(12 个)

| Style | 看起来像 | 用在哪 |
|---|---|---|
| `cute` | 米奶油底 + 圆角 + 粉彩色 + Q 版小人 + 圆头字 | 萌系、亲子、健康 |
| `fresh` | 莫兰迪绿/米黄 + 极细线 + 嫩芽感 + 大留白 | 早 c 晚 a、植物、日常仪式 |
| `warm` | 暖橙/蜜桃 + 胶片颗粒 + 居家暖光 | 家庭故事、好物长测 |
| `bold` | 浓黑/正红/明黄 + 粗描边 + 大字标题撑满 | 观点文、爆款标题、行业评论 |
| `minimal` | 纯白/浅灰底 + 一行字 + 一个小图,极致克制 | 思考札记、宣言、品牌 |
| `retro` | 70s/80s 色,芥末黄/砖红 + 复古杂志排版 | 怀旧、复古产品、文艺青年 |
| `pop` | 高饱和撞色 + 流行明星感 + 流体图形 | 潮流、追星、年轻文化 |
| `notion` | Notion 风,白底 + 灰边框 + 简笔线稿 + 极简 | 知识分享、SaaS、生产力 |
| `chalkboard` | 深绿黑板 + 白黄粉笔字 + 板擦痕 | 课堂、家长辅导、读书会 |
| `study-notes` | 横线本 + 多色荧光笔 + 手写圈点 | 学习笔记、考试复习、知识整理 |
| `screen-print` | 厚描边 + 半调点纹 + 错版色 + 海报感 | 潮牌、亚文化、设计 |
| `sketch-notes` | 手绘 sketchnote + 抖动线 + 简笔小人 + 箭头 | 会议笔记、知识可视化 |

### 8.4 第 2 层:完整 Layout 库(6 个,= 信息密度)

| Layout | 看起来像 | 用在哪 |
|---|---|---|
| `sparse` | 1-2 个要点,大留白 60%+,大字标题 | 封面图、金句卡、引言 |
| `balanced` | 3-4 个要点,中等密度(默认) | 普通分享、3-step 方法 |
| `dense` | 5-8 个要点,密排 + 紧凑卡 | 知识小抄、Cheat Sheet |
| `list` | 4-7 项编号列表,垂直顺序 | 清单、排行、Top N |
| `comparison` | 上下/左右两栏,各自图标 + bullet | 前后对比、A vs B、利弊 |
| `flow` | 3-6 步流程,横向/纵向带箭头 | 操作步骤、时间线、过程 |

### 8.5 第 2 层:Palette 库(3 个,可叠加任意 style)

| Palette | 看起来像 | 用在哪 |
|---|---|---|
| `macaron` | 米奶油 + 粉/雾蓝/薄荷/桃,马卡龙感 | 萌系、亲子、知识 |
| `warm` | 蜜桃 + 暖橙/红土陶/金黄,无冷色 | 品牌、生活方式 |
| `neon` | 深紫黑 + 粉/青/绿荧光,高对比 | 潮流、复古赛博 |

### 8.6 多图系列规划

xhs 跟前两个 skill 的关键差别:**一次产出多张 prompt**。

| 张数 | 用什么 layout 组合 |
|---|---|
| 1 张 | sparse(纯封面) |
| 3 张 | sparse(封面)+ balanced(主体)+ sparse(总结) |
| 6 张 | sparse(封面)+ 4 张 balanced/dense + sparse(行动号召) |
| 9 张 | sparse + 7 张主体 + sparse(适合九宫格预览) |

skill 内置上面 4 种张数模板,用户可改。每张产物为 `prompts/01-{slug}.md`、`02-{slug}.md` ...

### 8.7 内容 → 预设推荐规则

| 内容信号 | 默认推预设 |
|---|---|
| 健康 / 育儿 / 萌宠 / 入门科普 | 可爱知识卡 |
| 日常分享 / vlog / 生活仪式感 | 清新生活流 |
| 故事 / 复盘 / 案例 / 个人经历 | 暖光叙事 |
| 速查 / 工具集 / Top N / 干货 | 干货知识小抄 |
| 单图金句 / 引言 / 短观点 | 故事封面 |
| 减肥/改造/产品测评/before-after | 前后对比 |

未命中默认 → 可爱知识卡(小红书最通用)。

## 9. 工作流(三个 skill 共享)

5 步流程,**全程默认不弹确认门**,有需要调整再二次交互。

```
[用户给主题/内容]
   ↓
Step 1: 接受输入
   ↓
Step 2: 内容分析 → 推预设 (按 6.6 / 7.7 / 8.7 规则秒选)
   ↓
Step 3: 拼 prompt 文件 (读对应 layout/style/palette references)
   ↓
Step 4: 落盘 + 终端展示 (~/knowledge/image-prompts/{date}-{slug}/prompt.md)
   ↓
Step 5: 提示下一步 (用户可"换风格 X" / "改成 dense 版" / "出 6 张")
```

### Step 1: 接受输入

接受任意一种:
- 一段文字内容(主题、段落、文章)
- 一个 URL(skill **不主动抓取**,会提示用户先用 `slib:summary` 拉下来)
- 一个本地文件路径
- 一句模糊主题("帮我做一个 Git 速查图")

### Step 2: 内容分析 + 推预设

skill **不写 analysis.md 中间文件**,在对话内直接说明:

```
我看到你的内容:讲 5 个 Git 高频命令。
默认匹配预设:复古高密度(dense-modules + retro-pop-grid)
理由:多个并列项 + "速查"语义。

直接出?或者换:
- 知识卡(更亲和)
- 黑板手写(教学感强)
- ...
```

未命中触发规则 → 直接给前 3 个最常用预设让用户选。

### Step 3: 拼 prompt 文件

按预设解析为「layout + style + palette + aspect」,读对应 reference 文件,拼成完整 prompt:

1. 读 `references/base-prompt.md` 拿模板骨架
2. 读 `references/layouts/<layout>.md` 拿布局描述段落
3. 读 `references/styles/<style>.md` 拿风格描述段落
4. 读 `references/palettes/<palette>.md` 拿调色板段落(可选)
5. 拼接 → 加上用户内容 → 写入 prompt 文件

### Step 4: 落盘 + 展示

落到 `~/knowledge/image-prompts/{YYYY-MM-DD}-{slug}/prompt.md`,**同时在终端完整展示 prompt 文本**(包在代码块里方便用户一键复制)。

xhs 多图场景:多份文件 `prompts/01-{slug}.md`、`02-{slug}.md` ...,终端只展示第 1 张完整 prompt + 其他张的标题列表。

### Step 5: 提示下一步

附上常见后续操作命令:

```
prompt 已生成:~/knowledge/image-prompts/2026-05-29-git-cheatsheet/prompt.md

可以贴到:Midjourney / 即梦 / 通义万象 / Nano Banana / Sora 等任意文生图

要调整?试试:
- "换成 cyberpunk-neon 风格"
- "改成竖版 9:16"
- "出 6 张系列"
```

### 工作流硬约束

| 约束 | 说明 |
|---|---|
| **零 EXTEND.md** | 不引入任何配置文件,所有选择实时决定 |
| **零强制确认门** | 默认走第 2 步推荐;用户对结果不满意,二次说话调整即可 |
| **零中间文件** | 不写 analysis.md / structured-content.md;skill 在对话内分析,不落盘 |
| **不调后端** | 步骤里不出现"调 API / 生图",只到 prompt 文件为止 |
| **不抓取 URL** | 给 URL 时 skill 提示用户先 `slib:summary` 拉,不自己抓 |
| **prompt 文件可读** | 文件第一段必须是用户可以一眼看懂的"摘要",再是 prompt 正文 |

## 10. Prompt 文件格式

### 10.1 文件命名

```
~/knowledge/image-prompts/{YYYY-MM-DD}-{slug}/
├── prompt.md                # 单张:info / cover
└── prompts/                 # 多张:xhs
    ├── 01-{slug}.md
    ├── 02-{slug}.md
    └── ...
```

### 10.2 文件结构

```markdown
---
skill: image-prompt-info        # 哪个 skill 产的
preset: 知识卡                  # 用了哪个第 1 层预设(自由组合时为 null)
layout: bento-grid              # 第 2 层 layout
style: craft-handmade           # 第 2 层 style
palette: macaron                # 第 2 层 palette(可选)
aspect: 16:9                    # 16:9 / 9:16 / 1:1 / 3:4 / 2.35:1 / 自定义 W:H
language: zh                    # 文字部分用什么语言
created: 2026-05-29T10:30:00
source: |
  (用户原始内容摘要,1-3 行)
---

# {主题}

## 摘要(给人看)
1 段话:这个 prompt 会出什么样的图(可以用 5.2 节"看起来像"模板)。

## Prompt(给 AI)

```
[完整 prompt 正文,可一键复制]

[包含:]
- 主题与内容
- 布局描述(从 references/layouts/<layout>.md 摘)
- 风格描述(从 references/styles/<style>.md 摘)
- 调色板(从 references/palettes/<palette>.md 摘)
- 文字策略(语言、字号、字体感)
- 比例(aspect)
- 通用 prompt 防御段(避免幻觉、避免乱字、避免水印等)
```

## 怎么用
- 推荐平台:Midjourney / 即梦 / 通义万象 / Nano Banana / Sora
- 复制上面 Prompt 块整段贴过去
- 如果平台支持 aspect 参数,单独设 {aspect}
- 不满意 → 回到对话说"换 X 风格"重新出
```

### 10.3 正文写作要求

| 部分 | 要求 |
|---|---|
| **frontmatter** | 字段固定,不增不减;`source` 用 YAML 多行,避免泄露敏感信息 |
| **摘要(给人看)** | 用"看起来像"模板;让用户不读 prompt 也知道画出来是什么 |
| **Prompt(给 AI)** | 单段连续英文 / 中文皆可;按"主题→布局→风格→色→文字→比例→防御"顺序拼;长度 200-500 词 |
| **怎么用** | 固定模板,几句话给后续指引 |

### 10.4 通用 Prompt 防御段(每份都加)

```
Constraints:
- Render any text in {language} only; no garbled / mojibake / placeholder text.
- No watermark, no signature, no website URL in image.
- Composition must match described aspect {aspect}; do not crop key elements.
- Style must be consistent; do not mix realistic photography unless explicitly requested.
- Color palette: stay within {palette} hex values; no out-of-palette hues.
```

(skill 在 Step 3 拼装时自动加,用户不用手写)

## 11. 砍掉的复杂度对照表

明确列出 baoyu 有但我们**不要**的东西,以及理由——避免实施时被惯性带回去。

| baoyu 的复杂度 | 我们的处理 | 理由 |
|---|---|---|
| **强制 EXTEND.md + first-time setup** | ❌ 完全砍掉 | SLib 是个人工具,配置实时决定即可;3 份配置文件管理负担太大 |
| **`preferred_image_backend` 配置** | ❌ 砍掉 | 我们不调后端,这个字段失去意义 |
| **`quick_mode` / `--quick` / `--no-confirm` 等跳过标记** | ❌ 砍掉 | 默认就是不弹确认门;调整靠对话二次说话 |
| **每个 SKILL.md 顶部 40 行 "Image Generation Tools" 规则** | ❌ 砍掉 | 不调后端 |
| **`codex-imagegen` / `imagegen` / `baoyu-image-gen` 优先级链** | ❌ 砍掉 | 同上 |
| **10 个 provider 的 EXTEND.md 选项**(OpenAI / Azure / Google / OpenRouter / DashScope / Z.AI / MiniMax / Jimeng / Seedream / Replicate) | ❌ 砍掉 | 同上 |
| **`--ref` 兼容性矩阵**(哪些后端支持 reference image) | ❌ 砍掉 | prompt 里可以引用参考图,但不调后端就无所谓后端兼容 |
| **`source.md` / `analysis.md` / `structured-content.md` 中间产物** | ❌ 砍掉 | skill 在对话里直接分析,不落盘;只留最终 prompt 文件 |
| **backup-YYYYMMDD-HHMMSS 备份机制** | ❌ 砍掉 | 不重写已有文件;同 slug 冲突时新建带时间戳目录 |
| **`AskUserQuestion` 强制 4 个问题确认门** | ❌ 砍掉 | Step 2 直接给推荐,用户不接受才二次交互 |
| **`--quick` / `--no-confirm` 防御性提示行** | ❌ 砍掉 | 默认不弹门就不需要 |
| **"never paint over bitmap" 等后端 contract** | ❌ 砍掉 | 不调后端,这些规则没意义 |
| **"never substitute SVG/HTML/canvas" 防御段** | ❌ 砍掉 | 同上 |
| **`prompt file requirement (hard)` 等内部 SOP** | ✅ 保留 | 这条是我们的核心(原则 1) |
| **每个 skill 的 `## Changing Preferences` 章节** | ❌ 砍掉 | 没有 preferences 就不用改 |
| **`Watermark Integration` 配置** | ❌ 砍掉 | 个人工具不需要;通用 prompt 防御段里禁了水印 |
| **`Keyword Shortcuts` 表** | ✅ 简化保留 | 收敛到 6.6 / 7.7 / 8.7 节"内容 → 预设推荐规则",规则更直白 |
| **`Recommended Combinations` 表** | ✅ 精华化保留 | 直接成为第 1 层 6-8 预设的依据 |
| **22 / 21 / 11 / 7 等完整模板库** | ✅ 完整保留 | 第 2 层全名单 + 第 3 层 references/ 原文搬运 |

### 11.1 体量对比预估

| 维度 | baoyu 三个 skill 合计 | SLib 三个 skill 合计 |
|---|---|---|
| SKILL.md 总行数 | ~1100 行 | ~1000-1200 行 |
| references/ 文件数 | ~120+ | ~90+(去掉 backend / config / workflow 子目录) |
| 用户首次面对的"必读"信息 | EXTEND setup + Backend 解析 + 4 维度选择 + 工作流 | 第 1 层 6-8 预设表 + 工作流 5 步 |
| 单次出图最少交互轮次 | 1 + 4(AskUserQuestion)+ 0 = 5 | 1 + 0(默认推)+ 0 = 1 |
| 出图前必有的中间文件数 | 3-4(source / analysis / structured-content / prompt) | 1(prompt) |

核心: **能力不缩水,但"做一次"的成本从 5 轮交互 + 4 个文件降到 1 轮 + 1 个文件**。

## 12. using-slib 入口与 README 更新

### 12.1 `skills/using-slib/SKILL.md` 改动

在「可用 Skill」表格末尾追加 3 行:

```markdown
| `slib:image-prompt-info` | 用户说"画信息图/做信息卡/可视化数据/高密度大图/知识卡片/dataviz/infographic"、提供数据或教程内容并希望出一张视觉化图 |
| `slib:image-prompt-cover` | 用户说"做文章封面/封面图/banner/cover/配题图"、有文章/标题想配主视觉 |
| `slib:image-prompt-xhs` | 用户说"做小红书图/出图卡/社交多图/知识小抄/xhs"、想出分张的图卡系列 |
```

在「如何调用 Skill」代码块追加:

```
Skill({ skill: "slib:image-prompt-info" })
Skill({ skill: "slib:image-prompt-cover" })
Skill({ skill: "slib:image-prompt-xhs" })
```

### 12.2 `README.md` 改动

在「包含 Skill」表追加:

```markdown
| [`image-prompt-info`](#image-prompt-info)   | 信息图 AI 生图 prompt(出 prompt 文件,自己拿去文生图平台出图) |
| [`image-prompt-cover`](#image-prompt-cover) | 文章封面图 AI 生图 prompt |
| [`image-prompt-xhs`](#image-prompt-xhs)     | 小红书图卡 AI 生图 prompt(多张系列) |
```

新增三段 Skill 说明,每段包含:
- 触发条件(同 using-slib)
- 用法示例(2-3 个真实问句)
- 第 1 层 6-8 预设缩略表(从 SKILL.md 复制)
- 输出位置(`~/knowledge/image-prompts/`)

### 12.3 「目录结构」段更新

在 README.md 目录结构追加:

```
├── image-prompt-info/      # 信息图 AI prompt skill
├── image-prompt-cover/     # 封面图 AI prompt skill
└── image-prompt-xhs/       # 小红书图卡 AI prompt skill
```

### 12.4 不动的部分

- `hooks/` — 现有 hook 无需改
- `.claude-plugin/plugin.json` — skill 自动发现,不需要显式注册
- `package.json` — 无 npm 依赖

## 13. 实施分步

按"先一个跑通,再批量化"的节奏推进,降低返工风险。

### Phase 1:落 `image-prompt-info`(端到端跑通)

| 步骤 | 产物 |
|---|---|
| 1.1 | 创建 `skills/image-prompt-info/SKILL.md` 骨架(同第 4.2 节 5 章节模板) |
| 1.2 | 填第 1 层 8 预设表(同 6.2 节) |
| 1.3 | 填第 2 层完整库(同 6.3 / 6.4 / 6.5) |
| 1.4 | 创建 `references/layouts/`,从 baoyu 原文搬 21 个 layout 文件 |
| 1.5 | 创建 `references/styles/`,从 baoyu 原文搬 22 个 style 文件 |
| 1.6 | 创建 `references/palettes/`,搬 3 个 palette 文件 |
| 1.7 | 创建 `references/base-prompt.md`(prompt 拼装模板 + 10.4 防御段) |
| 1.8 | 端到端测试:3 种主题(教程 / 数据 / 概念)各跑 1 次,看 prompt 文件质量 |

**验收**:在 Midjourney 或即梦上贴生成的 prompt,出图效果跟 baoyu 同等预设可比。

### Phase 2:批量化 cover + xhs

跑通 info 后,这两个按相同模式批量复制 + 替换:

| 步骤 | 产物 |
|---|---|
| 2.1 | 同样方式做 `image-prompt-cover`(预设 6 个 + 6 type + 11 palette + 7 rendering + 3 维度) |
| 2.2 | 同样方式做 `image-prompt-xhs`(预设 6 个 + 12 style + 6 layout + 3 palette + 多图模板) |
| 2.3 | 测试 cover:3 篇文章封面 |
| 2.4 | 测试 xhs:1 篇内容拆 1/3/6/9 张系列 |

### Phase 3:接入 SLib

| 步骤 | 产物 |
|---|---|
| 3.1 | 更新 `skills/using-slib/SKILL.md`(同 12.1) |
| 3.2 | 更新 `README.md`(同 12.2 + 12.3) |
| 3.3 | 在另一个 Claude Code session 试触发:看 skill 是否按 description 自动加载 |

### Phase 4:打磨

| 步骤 | 产物 |
|---|---|
| 4.1 | 收集 baoyu 缺截图的项,看后续是否要补 |
| 4.2 | 跑 5-10 次真实任务,记录推荐规则的命中率,调整 6.6 / 7.7 / 8.7 |
| 4.3 | 如发现 SKILL.md 太长,把"完整 Layout/Style/Palette 库"挪到 `references/index.md`,SKILL.md 只留入口 |

### 风险点 & 缓解

| 风险 | 缓解 |
|---|---|
| baoyu 之后改库,我们的搬运过期 | 第 3 层 references 加 `source-version` 字段记录搬运时间;每 3 个月人工 diff 一次 |
| 第 1 层 6-8 预设有覆盖盲区 | Phase 4 跑真实任务时,记录"未命中→走自定义"的频率;>30% 就要增加预设 |
| AI 生图模型升级,prompt 防御段过期 | 10.4 防御段每年 review 一次;按主流模型行为调整 |
| 内容含敏感信息被写入 prompt 文件 | 10.2 frontmatter `source` 字段 strip 关键字(API key / token / 密码);拼装时仅保留主题与结构 |

### 不做的事(显式排除)

- ❌ 不引入 npm / bun / npx 依赖(SLib 保持纯 markdown 体量)
- ❌ 不写 `scripts/main.ts` 等运行时(我们不调后端,没必要)
- ❌ 不实现"重新出图"的状态机(用户每次重出靠对话二次说话,简单粗暴)
- ❌ 不内置截图预览(依赖 baoyu raw URL,失效就失效,文字描述已足够)
- ❌ 不做多语言切换(根据用户对话语种自动来,默认中文)
