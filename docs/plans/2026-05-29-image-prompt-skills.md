# Image-Prompt Skills Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 SLib 仓库新增 3 个 skill(`image-prompt-info` / `image-prompt-cover` / `image-prompt-xhs`),只产 AI 文生图 prompt 不调后端,完整保留 baoyu-skills 原有视觉模板库,但用"分层暴露 + 具象描述"把入口复杂度压到与 `architecture-diagram` 同档。

**Architecture:** 每个 skill 由 1 份 SKILL.md + 1 个 references/ 目录构成。SKILL.md 三段式:第 1 层精选预设(6-8 个,带"看起来像/用在哪/预览"3 件套)→ 第 2 层完整名单(全量 layout/style/palette 一行一项)→ 工作流。第 3 层细节(从 baoyu 原文搬运)按需读 references/ 文件。产物落到 `~/knowledge/image-prompts/{date}-{slug}/prompt.md`。

**Tech Stack:** 纯 markdown(无 npm / bun / 运行时依赖),YAML frontmatter,Claude Code Skill 协议。

**Spec:** [`docs/specs/2026-05-29-image-prompt-skills-design.md`](../specs/2026-05-29-image-prompt-skills-design.md)

---

## File Structure

新增 / 修改的文件清单。每个 task 对照本节看自己要碰哪些文件。

### 新增目录

```
skills/image-prompt-info/
skills/image-prompt-info/references/
skills/image-prompt-info/references/layouts/
skills/image-prompt-info/references/styles/
skills/image-prompt-info/references/palettes/

skills/image-prompt-cover/
skills/image-prompt-cover/references/
skills/image-prompt-cover/references/types/
skills/image-prompt-cover/references/palettes/
skills/image-prompt-cover/references/renderings/
skills/image-prompt-cover/references/dimensions/

skills/image-prompt-xhs/
skills/image-prompt-xhs/references/
skills/image-prompt-xhs/references/layouts/
skills/image-prompt-xhs/references/styles/
skills/image-prompt-xhs/references/palettes/
```

### 新增文件

| 文件 | 责任 | 行数预估 |
|---|---|---|
| `skills/image-prompt-info/SKILL.md` | info skill 主文件,预设 + 全名单 + 工作流 | 380-420 |
| `skills/image-prompt-info/references/base-prompt.md` | prompt 拼装模板 + 通用防御段 | 40-60 |
| `skills/image-prompt-info/references/layouts/<21 个>.md` | 各 layout 完整视觉指令(从 baoyu 搬) | 每个 30-60 |
| `skills/image-prompt-info/references/styles/<22 个>.md` | 各 style 完整视觉指令(从 baoyu 搬) | 每个 30-60 |
| `skills/image-prompt-info/references/palettes/<3 个>.md` | 各 palette hex 与用法 | 每个 20-30 |
| `skills/image-prompt-cover/SKILL.md` | cover skill 主文件 | 350-400 |
| `skills/image-prompt-cover/references/base-prompt.md` | 同上 | 40-60 |
| `skills/image-prompt-cover/references/types/<6 个>.md` | hero/conceptual/typography/metaphor/scene/minimal | 每个 30-50 |
| `skills/image-prompt-cover/references/palettes/<11 个>.md` | 11 调色板 | 每个 20-30 |
| `skills/image-prompt-cover/references/renderings/<7 个>.md` | 7 种渲染风格 | 每个 30-50 |
| `skills/image-prompt-cover/references/dimensions/text.md` | text 4 档 | 30 |
| `skills/image-prompt-cover/references/dimensions/mood.md` | mood 3 档 | 25 |
| `skills/image-prompt-cover/references/dimensions/font.md` | font 4 档 | 30 |
| `skills/image-prompt-xhs/SKILL.md` | xhs skill 主文件 | 350-400 |
| `skills/image-prompt-xhs/references/base-prompt.md` | 同上 | 40-60 |
| `skills/image-prompt-xhs/references/styles/<12 个>.md` | 12 风格 | 每个 30-60 |
| `skills/image-prompt-xhs/references/layouts/<6 个>.md` | 6 布局(信息密度) | 每个 30-50 |
| `skills/image-prompt-xhs/references/palettes/<3 个>.md` | 3 palette | 每个 20-30 |

### 修改文件

| 文件 | 改动 |
|---|---|
| `skills/using-slib/SKILL.md` | 表追加 3 行 skill 入口 + 「如何调用」追加 3 行 |
| `README.md` | 「包含 Skill」表追加 3 行;新增 3 段 skill 说明;目录结构图追加 3 行 |

### 不动的文件

- `hooks/` — 无需改
- `.claude-plugin/plugin.json` — skill 自动发现,无需注册
- `package.json` — 无依赖变化

---

## Task 1: 创建目录结构 + 3 份 SKILL.md 骨架

**目标**:3 个 skill 目录与最小可加载 SKILL.md 落地,Claude Code 能识别并按 description 触发。

**Files:**
- Create: `skills/image-prompt-info/SKILL.md`
- Create: `skills/image-prompt-cover/SKILL.md`
- Create: `skills/image-prompt-xhs/SKILL.md`
- Create: 上面 File Structure 节列出的所有新增目录

- [ ] **Step 1: 一次性创建所有目录**

Run:
```bash
mkdir -p /Users/haxianhe/github/SLib/skills/image-prompt-info/references/{layouts,styles,palettes}
mkdir -p /Users/haxianhe/github/SLib/skills/image-prompt-cover/references/{types,palettes,renderings,dimensions}
mkdir -p /Users/haxianhe/github/SLib/skills/image-prompt-xhs/references/{layouts,styles,palettes}
```

Expected: 无报错,目录全部建立。

验证:
```bash
ls -d /Users/haxianhe/github/SLib/skills/image-prompt-*/references/*
```
应列出 11 个子目录(info 3 个 + cover 4 个 + xhs 3 个 + dimensions 1 个 = 11)。

- [ ] **Step 2: 写 image-prompt-info/SKILL.md 骨架**

写入 `/Users/haxianhe/github/SLib/skills/image-prompt-info/SKILL.md`:

```markdown
---
name: image-prompt-info
description: |
  信息图(infographic)AI 文生图 prompt 产出助手。把数据/教程/概念组织成视觉密度高的一张图,
  输出可直接贴 Midjourney / 即梦 / 通义万象 / Nano Banana 等任意文生图平台的 prompt 文件。
  不调用任何文生图 API。触发条件:
  - 用户说"画信息图 / 做信息卡 / 可视化数据 / 高密度大图 / 知识卡片 / dataviz / infographic"
  - 用户提供数据或教程内容并希望出一张视觉化图
  - 用户给出多个并列项(>5 个)并希望整合成单图
---

# image-prompt-info:信息图 AI 文生图 prompt 助手

把内容翻译成专业、好看的信息图 prompt,用户拿到任意文生图平台都能出图。

不调任何后端 API,只产 prompt 文件。

---

## 1. 快速选(推荐预设)

<!-- 由 Task 2 填充 -->

## 2. 完整库(自由组合)

<!-- 由 Task 3 填充 -->

## 3. 工作流

<!-- 由 Task 5 填充 -->

## 4. Prompt 文件格式

<!-- 由 Task 5 填充 -->

## 5. References 索引

<!-- 由 Task 5 填充 -->
```

- [ ] **Step 3: 写 image-prompt-cover/SKILL.md 骨架**

写入 `/Users/haxianhe/github/SLib/skills/image-prompt-cover/SKILL.md`:

```markdown
---
name: image-prompt-cover
description: |
  文章封面图 AI 文生图 prompt 产出助手。给文章 / 博客 / Newsletter / 视频缩略图配主视觉,
  输出可直接贴 Midjourney / 即梦 / 通义万象 / Nano Banana 等任意文生图平台的 prompt 文件。
  常用 16:9 / 2.35:1 / 1:1 比例。不调用任何文生图 API。触发条件:
  - 用户说"做文章封面 / 封面图 / banner / cover / 配题图"
  - 用户有文章 / 标题想配主视觉
  - 用户说"给这篇文章配个封面"
---

# image-prompt-cover:文章封面图 AI 文生图 prompt 助手

给文章配主视觉,产出可直接复制的 prompt 文件。

不调任何后端 API,只产 prompt 文件。

---

## 1. 快速选(推荐预设)

<!-- 由 Task 7 填充 -->

## 2. 完整库(自由组合)

<!-- 由 Task 7 填充 -->

## 3. 工作流

<!-- 由 Task 7 填充 -->

## 4. Prompt 文件格式

<!-- 由 Task 7 填充 -->

## 5. References 索引

<!-- 由 Task 7 填充 -->
```

- [ ] **Step 4: 写 image-prompt-xhs/SKILL.md 骨架**

写入 `/Users/haxianhe/github/SLib/skills/image-prompt-xhs/SKILL.md`:

```markdown
---
name: image-prompt-xhs
description: |
  小红书图卡 AI 文生图 prompt 产出助手。把一段内容拆成 1-10 张图卡系列(竖版 3:4),
  适合小红书 / 公众号头条九宫格 / IG 故事系列。输出可直接贴 Midjourney / 即梦 / 通义万象 /
  Nano Banana 等任意文生图平台的 prompt 文件(多张时多份)。不调用任何文生图 API。触发条件:
  - 用户说"做小红书图 / 出图卡 / 社交多图 / 多张图卡 / xhs / 知识小抄"
  - 用户想出分张的图卡系列(3 张 / 6 张 / 9 张等)
---

# image-prompt-xhs:小红书图卡 AI 文生图 prompt 助手

把内容拆成多张竖版图卡,每张产出独立 prompt 文件。

不调任何后端 API,只产 prompt 文件。

---

## 1. 快速选(推荐预设)

<!-- 由 Task 8 填充 -->

## 2. 完整库(自由组合)

<!-- 由 Task 8 填充 -->

## 3. 工作流

<!-- 由 Task 8 填充 -->

## 4. Prompt 文件格式 + 多图模板

<!-- 由 Task 8 填充 -->

## 5. References 索引

<!-- 由 Task 8 填充 -->
```

- [ ] **Step 5: 验证 3 份 SKILL.md 可被识别**

启动一个新的 Claude Code session(或运行 `claude` 重启),输入:

```
/skills
```

Expected:列表中出现 `image-prompt-info`、`image-prompt-cover`、`image-prompt-xhs` 三项,description 正确显示。

如果没显示,检查 frontmatter 是否合法 YAML、name 字段是否与目录名一致。

- [ ] **Step 6: 触发条件烟雾测试**

在新 Claude Code session 输入(分 3 次):

```
帮我画一个信息图,讲 5 个 Git 高频命令
```
Expected:Claude 提示要调用 `image-prompt-info` skill。

```
给我这篇文章做个封面
```
Expected:Claude 提示要调用 `image-prompt-cover` skill。

```
做一组讲早睡早起的 6 张小红书图卡
```
Expected:Claude 提示要调用 `image-prompt-xhs` skill。

如有触发偏差,回到对应 SKILL.md 的 description 补关键词。

- [ ] **Step 7: Commit**

```bash
cd /Users/haxianhe/github/SLib
git add skills/image-prompt-info skills/image-prompt-cover skills/image-prompt-xhs
git commit -m "feat(skills): scaffold image-prompt-{info,cover,xhs} with loadable SKILL.md skeletons

3 个新 skill 骨架,frontmatter 与触发 description 就绪,后续 task 逐节填充。"
```

---

## Task 2: image-prompt-info — 第 1 层 8 预设

**目标**:在 SKILL.md 「1. 快速选」章节落地 8 个精选预设表,每项含「看起来像 / 用在哪 / 预览」3 件套。

**Files:**
- Modify: `skills/image-prompt-info/SKILL.md`(替换 Task 1 Step 2 留的 `<!-- 由 Task 2 填充 -->`)

**前置阅读**:打开 spec `docs/specs/2026-05-29-image-prompt-skills-design.md` 第 6.2 节作为内容来源。

- [ ] **Step 1: 替换「1. 快速选」章节**

在 `skills/image-prompt-info/SKILL.md` 找到:

```
## 1. 快速选(推荐预设)

<!-- 由 Task 2 填充 -->
```

替换为:

```markdown
## 1. 快速选(推荐预设)

不知道选啥?默认按下表选最近 1 项。Claude 会按你内容里出现的关键词自动推。

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

每个预设内部对应 layout + style + palette 组合见第 2 节(完整库)末尾的「预设映射表」。
```

- [ ] **Step 2: 验证图床 URL 可访问**

抽 2 个 URL 用浏览器或 curl 检查能否访问:

```bash
curl -s -o /dev/null -w "%{http_code}" \
  "https://github.com/JimLiu/baoyu-skills/raw/main/screenshots/infographic-styles/craft-handmade.webp"
```

Expected:`200`。

如果是 `404`,说明 baoyu 文件名变了或路径错;到 `https://github.com/JimLiu/baoyu-skills/tree/main/screenshots/infographic-styles` 看实际文件名调整。

8 个 URL 中至少 6 个可访问才进入下一步(2 个失效可空白)。

- [ ] **Step 3: 人工读一遍,确保描述合规**

按 spec 第 5.2 节自查:

| 检查项 | 通过标准 |
|---|---|
| 「看起来像」无禁用词 | 不含"精致/高端/现代/大气/时尚/简约/设计感/高级感/文艺/治愈" |
| 「看起来像」≥ 2 个具象元素 | 颜色 / 元素 / 质感 / 字体至少占 2 项 |
| 「用在哪」是具体场景 | 含 1 个可脑补的内容主题(不是"教育内容"这种空话) |

任一不通过,回到 Step 1 修改对应行。

- [ ] **Step 4: Commit**

```bash
cd /Users/haxianhe/github/SLib
git add skills/image-prompt-info/SKILL.md
git commit -m "feat(image-prompt-info): add 8 curated presets with vivid descriptions

第 1 层精选预设落地。每项含「看起来像 / 用在哪 / 预览」3 件套,
看一眼就懂,无需理解 layout / style / palette 原子组合。"
```

---

## Task 3: image-prompt-info — 第 2 层完整库 + 推荐规则

**目标**:在 SKILL.md 「2. 完整库」章节落地 21 layout + 22 style + 3 palette 全名单(各一行,带 3 件套),末尾加预设映射表 + 「内容 → 预设」推荐规则。

**Files:**
- Modify: `skills/image-prompt-info/SKILL.md`

**前置阅读**:spec 第 6.3 / 6.4 / 6.5 / 6.6 节。

- [ ] **Step 1: 替换「2. 完整库」章节**

在 `skills/image-prompt-info/SKILL.md` 找到:

```
## 2. 完整库(自由组合)

<!-- 由 Task 3 填充 -->
```

替换为(完整 21 + 22 + 3 表格):

```markdown
## 2. 完整库(自由组合)

第 1 层预设没覆盖的需求,可以从下面自由挑 layout × style × palette。
Claude 会按你的选择去 `references/` 读完整视觉指令,拼到 prompt。

### 2.1 Layout(21)

| Layout | 看起来像 | 用在哪 |
|---|---|---|
| `linear-progression` | 一条横向/纵向时间线 + 节点编号 + 节点小图 | 历史事件、产品演进、操作步骤 |
| `binary-comparison` | 左右两栏对称分隔 | A vs B、前后对比、利弊清单 |
| `comparison-matrix` | 多行多列表格,首行/首列做表头 | 多维度产品对比、选型矩阵 |
| `hierarchical-layers` | 金字塔分层叠放 | 马斯洛需求、优先级、能力金字塔 |
| `tree-branching` | 根节点 + 树状分叉 | 组织架构、目录结构、分类法 |
| `hub-spoke` | 中心圆 + 辐射连接多个外围圆 | 核心概念 + 关联事项、星型架构 |
| `structural-breakdown` | 爆炸视图,组件拆开排列 + 引线标注 | 产品组件拆解、机械剖面 |
| `bento-grid` | 日式便当盒分格,大小不一矩形拼出版面 | 多主题概览、杂志封面(默认) |
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

完整视觉指令见 `references/layouts/<name>.md`。

### 2.2 Style(22)

| Style | 看起来像 | 用在哪 |
|---|---|---|
| `craft-handmade` | 米黄牛皮纸 + 黑色手绘线 + 马卡龙色块 + 简笔画(默认) | 教育、知识入门、亲子科普 |
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

完整视觉指令见 `references/styles/<name>.md`。

### 2.3 Palette(3,可叠加任意 style)

| Palette | 看起来像 | 用在哪 |
|---|---|---|
| `macaron` | 马卡龙粉彩,米奶油底 + 粉/雾蓝/薄荷/桃色块 + 珊瑚红点睛 | 教育、亲子、知识入门 |
| `warm` | 暖陶土,蜜桃底 + 暖橙/红土陶/金黄 + 深棕描线,无任何冷色 | 品牌、生活方式、餐饮 |
| `neon` | 霓虹反差,深紫底 + 粉/青/绿荧光,高对比 | 游戏、复古赛博、潮流文化 |

完整 hex 与用法见 `references/palettes/<name>.md`。

### 2.4 第 1 层预设 → 第 2 层映射

| 预设 | layout | style | palette |
|---|---|---|---|
| 知识卡 | `bento-grid` | `craft-handmade` | `macaron` |
| 复古高密度 | `dense-modules` | `retro-pop-grid` | —(style 自带) |
| 流程教程 | `linear-progression` | `ikea-manual` | —(纯线稿无色) |
| 数据看板 | `dashboard` | `corporate-memphis` | —(style 自带) |
| 赛博朋克 | `bento-grid` | `cyberpunk-neon` | `neon` |
| 黑板手写 | `bento-grid` | `chalkboard` | —(style 自带) |
| A vs B 对比 | `binary-comparison` | `corporate-memphis` | —(style 自带) |
| 冰山揭示 | `iceberg` | `craft-handmade` | `macaron` |

### 2.5 内容 → 预设推荐规则(Claude 自动用)

| 内容信号(关键词) | 默认推预设 |
|---|---|
| 含步骤编号 / "怎么做 X" / 流程关键词("第一步""然后""最后") | 流程教程 |
| 含数字 / 百分比 / KPI / 季度 / 销售 / 增长 | 数据看板 |
| 含 "vs" / "对比" / "好坏" / "选哪个" / "优劣" | A vs B 对比 |
| 含 "本质" / "底层" / "其实是" / "看不见的" / "深层" | 冰山揭示 |
| 含 "Cheat Sheet" / "速查" / "清单" / >10 个并列项 | 复古高密度 |
| 含 AI / 黑客 / 赛博 / 未来 / 暗系审美 | 赛博朋克 |
| 含课堂 / 教学 / 板书 / 课程 / 老师 | 黑板手写 |
| 其他(默认) | 知识卡 |
```

- [ ] **Step 2: 验证 2.4 节预设映射与 spec 一致**

打开 spec `docs/specs/2026-05-29-image-prompt-skills-design.md` 第 6.6 节,逐行对比 2.5 节的「内容信号 → 预设」表。
任一行不一致 → 修 SKILL.md(spec 为准)。

- [ ] **Step 3: 验证 2.4 映射所有 layout / style / palette 名字在 2.1 / 2.2 / 2.3 表里都能找到**

人工读一遍 2.4 节每行的 layout / style / palette 字段,确认在上面表里出现过(防拼错)。

如发现 `craft-handmadee` 之类拼错 → 立即修。

- [ ] **Step 4: Commit**

```bash
cd /Users/haxianhe/github/SLib
git add skills/image-prompt-info/SKILL.md
git commit -m "feat(image-prompt-info): add full library (21 layouts × 22 styles × 3 palettes)

第 2 层完整名单 + 预设映射表 + 内容→预设推荐规则落地。
每项含具象「看起来像」与「用在哪」,详细指令委托 references/。"
```

---

## Task 4: image-prompt-info — references/ 搬运

**目标**:把 baoyu-infographic 的 21 layout + 22 style + 3 palette 完整 markdown 文件搬到本 skill 的 references/。第 3 层细节是 prompt 拼装的"砖块",必须 100% 保留。

**Files:**
- Create: `skills/image-prompt-info/references/layouts/<21 个>.md`
- Create: `skills/image-prompt-info/references/styles/<22 个>.md`
- Create: `skills/image-prompt-info/references/palettes/<3 个>.md`

**前置条件**:本地 `/Users/haxianhe/github/baoyu-skills` 已克隆,且 `skills/baoyu-infographic/references/` 目录存在。如未克隆,先:
```bash
cd /Users/haxianhe/github && git clone https://github.com/JimLiu/baoyu-skills.git
```

- [ ] **Step 1: 列出 baoyu 源文件清单做对照**

Run:
```bash
ls /Users/haxianhe/github/baoyu-skills/skills/baoyu-infographic/references/layouts/
ls /Users/haxianhe/github/baoyu-skills/skills/baoyu-infographic/references/styles/
ls /Users/haxianhe/github/baoyu-skills/skills/baoyu-infographic/references/palettes/
```

Expected:
- layouts/ 21 个 .md(linear-progression / binary-comparison / ... / dense-modules)
- styles/ 22 个 .md(craft-handmade / claymation / ... / retro-popup-pop)
- palettes/ 3 个 .md(macaron / warm / neon)

如果数量不一致,先核对 spec 与 baoyu README 的 22 / 21 数字,以本地实际为准更新 SKILL.md(Task 3 产物)。

- [ ] **Step 2: 批量复制 layouts**

Run:
```bash
cp -v /Users/haxianhe/github/baoyu-skills/skills/baoyu-infographic/references/layouts/*.md \
      /Users/haxianhe/github/SLib/skills/image-prompt-info/references/layouts/
```

Expected:`-v` 列出 21 行 `xxx.md -> xxx.md`。

- [ ] **Step 3: 批量复制 styles**

Run:
```bash
cp -v /Users/haxianhe/github/baoyu-skills/skills/baoyu-infographic/references/styles/*.md \
      /Users/haxianhe/github/SLib/skills/image-prompt-info/references/styles/
```

Expected:`-v` 列出 22 行。

- [ ] **Step 4: 批量复制 palettes**

Run:
```bash
cp -v /Users/haxianhe/github/baoyu-skills/skills/baoyu-infographic/references/palettes/*.md \
      /Users/haxianhe/github/SLib/skills/image-prompt-info/references/palettes/
```

Expected:`-v` 列出 3 行(macaron.md / warm.md / neon.md)。

- [ ] **Step 5: 在每个搬运文件顶部加来源注释**

第 3 层文件需要标记来源,方便后续 diff baoyu 是否更新。

Run(一次性给三类文件批量加 source 标注):

```bash
cd /Users/haxianhe/github/SLib/skills/image-prompt-info/references

for f in layouts/*.md styles/*.md palettes/*.md; do
  # 跳过已加过的(防重跑出错)
  if head -1 "$f" | grep -q '^<!-- source:'; then
    continue
  fi
  # 用 mktemp 拼新内容,避免 sed 的 in-place 跨平台坑
  tmp=$(mktemp)
  {
    echo "<!-- source: baoyu-skills/skills/baoyu-infographic/references/$f"
    echo "     copied: 2026-05-29; diff baoyu 主分支判断是否需要更新 -->"
    echo ""
    cat "$f"
  } > "$tmp"
  mv "$tmp" "$f"
done
```

Expected:无报错,所有文件第 1-2 行变成 source 注释。

抽查:
```bash
head -3 /Users/haxianhe/github/SLib/skills/image-prompt-info/references/styles/craft-handmade.md
```
应看到 `<!-- source: ... -->` 注释 + 空行 + 原文 `# craft-handmade (DEFAULT)`。

- [ ] **Step 6: 验证文件总数**

Run:
```bash
echo "layouts: $(ls /Users/haxianhe/github/SLib/skills/image-prompt-info/references/layouts/*.md | wc -l)"
echo "styles:  $(ls /Users/haxianhe/github/SLib/skills/image-prompt-info/references/styles/*.md  | wc -l)"
echo "palettes: $(ls /Users/haxianhe/github/SLib/skills/image-prompt-info/references/palettes/*.md | wc -l)"
```

Expected:`layouts: 21` / `styles: 22` / `palettes: 3`。

如数字不对,回 Step 2-4 查漏。

- [ ] **Step 7: 验证 SKILL.md 引用的 layout / style / palette 名字在 references/ 都有对应文件**

Run:
```bash
cd /Users/haxianhe/github/SLib/skills/image-prompt-info

# 提取 SKILL.md 中所有反引号内的小写名字
grep -oE '`[a-z][a-z0-9-]*`' SKILL.md | tr -d '`' | sort -u > /tmp/skill-names.txt

# 列出 references/ 实际文件名
ls references/layouts references/styles references/palettes | sed 's/\.md$//' | sort -u > /tmp/ref-files.txt

# 找出 SKILL 提到但 reference 文件没有的(误删 / 拼错)
comm -23 /tmp/skill-names.txt /tmp/ref-files.txt | head -20
```

Expected:输出**为空**(或仅含 `image-prompt-info` 等 skill 名字身这类非 ref 名)。

如有不该出现的差异,看哪个名字拼错,改 SKILL.md。

- [ ] **Step 8: Commit**

```bash
cd /Users/haxianhe/github/SLib
git add skills/image-prompt-info/references/
git commit -m "feat(image-prompt-info): copy baoyu's full layout/style/palette library

第 3 层细节搬运:21 layouts + 22 styles + 3 palettes,顶部加 source 注释方便后续 diff。
0 删减,prompt 拼装可读完整 baoyu 视觉指令。"
```

---

## Task 5: image-prompt-info — base-prompt + 工作流补全

**目标**:写 `references/base-prompt.md` 拼装模板 + 通用防御段;在 SKILL.md 补全工作流、prompt 文件格式、references 索引三节。

**Files:**
- Create: `skills/image-prompt-info/references/base-prompt.md`
- Modify: `skills/image-prompt-info/SKILL.md`(替换第 3 / 4 / 5 节占位)

**前置阅读**:spec 第 9 / 10 节。

- [ ] **Step 1: 写 base-prompt.md**

写入 `/Users/haxianhe/github/SLib/skills/image-prompt-info/references/base-prompt.md`:

```markdown
<!-- base-prompt: image-prompt-info 的 prompt 拼装模板
     Step 3 工作流读这个文件 + layouts/<L>.md + styles/<S>.md + palettes/<P>.md 后拼出 prompt 正文 -->

# Base Prompt 模板

## 拼装顺序

按以下顺序拼接,每段独立,中间用空行分隔:

1. **主题段** — 用户提供的主题 / 数据 / 教程内容(1 段,中英文均可)
2. **布局段** — 从 `references/layouts/<layout>.md` 摘 Layout Structure / Visual Elements 部分
3. **风格段** — 从 `references/styles/<style>.md` 摘 Color Palette / Visual Elements / Typography 部分
4. **调色板段** — 仅当用户/预设指定了 palette 时,从 `references/palettes/<palette>.md` 摘 Colors + Background;否则用 style 自带的 Color Palette
5. **文字策略段** — language / 字号 / 字体感(下方模板)
6. **比例段** — 一行:`Aspect ratio: {aspect}`
7. **通用防御段** — 下方 Constraints 部分原样拼接

## 文字策略段模板

```
Text rendering:
- Render any text in {language} only; no garbled / mojibake / placeholder text
- Use {font_hint} style; keep labels concise (keywords, not paragraphs)
- Hierarchy: oversized title → medium section labels → small annotations
- Generous whitespace; do not overlap text with key visual elements
```

`{font_hint}` 默认值:
- style 含 `handmade` / `chalk` / `notes` / `kawaii` / `morandi` → `hand-lettered / handwritten`
- style 含 `corporate` / `technical` / `ui` / `pixel` → `clean geometric sans-serif`
- style 含 `aged-academia` / `morandi-journal` → `vintage serif`
- 其他 → `clean sans-serif`

## 通用防御段(Constraints,所有 prompt 都加)

```
Constraints:
- Render any text in the language specified above; no garbled / mojibake / placeholder text
- No watermark, no signature, no website URL in the image
- Composition must match the described aspect; do not crop key elements
- Style must stay consistent; do not mix realistic photography unless explicitly requested
- Stay within the specified color palette hex values; no out-of-palette hues
- Do not invent numbers / statistics not present in the topic content
```

## 输出 prompt 文件结构

```
---
skill: image-prompt-info
preset: {预设名 or null}
layout: {layout}
style: {style}
palette: {palette or null}
aspect: {aspect}
language: {zh / en / ...}
created: {ISO 时间戳}
source: |
  {用户内容摘要,1-3 行}
---

# {主题}

## 摘要(给人看)

{用「看起来像」模板 1 段:画出来是什么样}

## Prompt(给 AI)

```
[完整拼装后的 prompt,主题段→布局段→风格段→调色板段→文字策略段→比例段→Constraints,空行分隔]
```

## 怎么用

- 推荐平台:Midjourney / 即梦 / 通义万象 / Nano Banana / Sora
- 复制上面 Prompt 块整段贴过去
- 如果平台支持 aspect 参数,单独设 `{aspect}`
- 不满意 → 回到对话说「换 X 风格」重新出
```
```

- [ ] **Step 2: 替换 SKILL.md 「3. 工作流」节**

在 `skills/image-prompt-info/SKILL.md` 找到:

```
## 3. 工作流

<!-- 由 Task 5 填充 -->
```

替换为:

```markdown
## 3. 工作流

5 步固定流程,默认不弹确认门,需要调整就二次对话。

### Step 1: 接受输入

接受任意一种:
- 一段文字内容(主题、段落、文章)
- 一个本地文件路径
- 一句模糊主题(如「帮我做一个 Git 速查图」)

如果用户给的是 URL,**不主动抓取**,提示用 `slib:summary` 先拉下来再回来。

### Step 2: 内容分析 + 推预设

按第 2.5 节「内容 → 预设推荐规则」秒选一个预设,在对话里说明:

```
我看到你的内容:讲 5 个 Git 高频命令。
默认匹配预设:复古高密度(dense-modules + retro-pop-grid)
理由:多个并列项 + "速查"语义。

直接出?或者换:
- 知识卡(更亲和)
- 黑板手写(教学感强)
```

未命中规则 → 给前 3 个最常用预设让用户选。
不写 analysis.md 中间文件,在对话里直接说。

### Step 3: 拼 prompt 文件

按预设解析为 layout + style + palette + aspect,然后:

1. 读 `references/base-prompt.md` 拿模板骨架
2. 读 `references/layouts/<layout>.md` 拿布局描述
3. 读 `references/styles/<style>.md` 拿风格描述
4. 读 `references/palettes/<palette>.md` 拿调色板(如有)
5. 按 base-prompt.md 的拼装顺序生成 prompt 正文
6. 套用第 4 节「Prompt 文件格式」生成完整 .md

### Step 4: 落盘 + 终端展示

落到 `~/knowledge/image-prompts/{YYYY-MM-DD}-{slug}/prompt.md`。

`{slug}` 规则:从主题取 2-4 词 kebab-case;冲突时追加 `-HHMMSS`。

终端**完整展示** prompt 正文(包在代码块里方便复制)+ 输出文件路径。

### Step 5: 提示下一步

附上常见后续操作示例:

```
可贴到:Midjourney / 即梦 / 通义万象 / Nano Banana / Sora

要调整?试试:
- "换成 cyberpunk-neon 风格"
- "改成竖版 9:16"
- "再出一版,用 chalkboard 风格"
```

### 工作流硬约束

- 零 EXTEND.md / 零配置文件
- 零强制确认门
- 零中间文件(不写 analysis.md / structured-content.md)
- 不调任何文生图 API
- 不主动抓取 URL
```

- [ ] **Step 3: 替换 SKILL.md 「4. Prompt 文件格式」节**

找到:

```
## 4. Prompt 文件格式

<!-- 由 Task 5 填充 -->
```

替换为:

```markdown
## 4. Prompt 文件格式

落盘文件 `prompt.md` 结构(由 Step 3 自动生成):

````markdown
---
skill: image-prompt-info
preset: 复古高密度          # 第 1 层预设名,自由组合时填 null
layout: dense-modules       # 第 2 层 layout
style: retro-pop-grid       # 第 2 层 style
palette: null               # 第 2 层 palette(可选,null 表示用 style 自带)
aspect: 9:16                # 比例
language: zh                # 文字部分语言
created: 2026-05-29T10:30:00
source: |
  Git 速查:5 个高频命令(reset / rebase / cherry-pick / stash / reflog)
---

# Git 速查:5 个高频命令

## 摘要(给人看)

竖版长图。1970s 波普风,粗黑描边,番茄红/芥末黄/孔雀蓝大色块按 Swiss 栅格排版。
每个命令一个模块,模块内含命令名 + 一行用法 + 1 个小图示。
顶部巨型手写体「Git 速查」,底部署名色块。

## Prompt(给 AI)

```
{完整拼装后的 prompt 正文,主题段 → 布局段 → 风格段 → palette 段 → 文字策略 → 比例 → Constraints}
```

## 怎么用

- 推荐平台:Midjourney / 即梦 / 通义万象 / Nano Banana / Sora
- 复制上面 Prompt 块整段贴过去
- 如果平台支持 aspect 参数,单独设 `9:16`
- 不满意 → 回到对话说「换 X 风格」重新出
````

详细模板与防御段见 `references/base-prompt.md`。
```

- [ ] **Step 4: 替换 SKILL.md 「5. References 索引」节**

找到:

```
## 5. References 索引

<!-- 由 Task 5 填充 -->
```

替换为:

```markdown
## 5. References 索引

第 3 层细节(完整视觉指令)按需读:

| 类型 | 路径 | 数量 |
|---|---|---|
| 拼装模板 | `references/base-prompt.md` | 1 |
| Layout | `references/layouts/<name>.md` | 21 |
| Style | `references/styles/<name>.md` | 22 |
| Palette | `references/palettes/<name>.md` | 3 |

工作流 Step 3 拼 prompt 时按预设映射(2.4)挨个读对应文件。

> ⚠️ references/ 目录的 layouts / styles / palettes markdown 文件
> 从 baoyu-skills 项目原文搬运,顶部含 `<!-- source: ... -->` 注释。
> 如需更新,与 https://github.com/JimLiu/baoyu-skills 主分支 diff 同名文件。
```

- [ ] **Step 5: 自查 SKILL.md 5 节都填完**

Run:
```bash
grep -n "TODO\|由 Task" /Users/haxianhe/github/SLib/skills/image-prompt-info/SKILL.md
```

Expected:无输出。

如果还有 `<!-- 由 Task X 填充 -->` 残留 → 找对应节点补上。

- [ ] **Step 6: 行数核对**

Run:
```bash
wc -l /Users/haxianhe/github/SLib/skills/image-prompt-info/SKILL.md
```

Expected:380-450 行(在 File Structure 表预估区间内)。

显著超出 → 检查是否把 references 内容误塞进 SKILL.md(应该 delegate)。
显著低于 → 检查 2.1 / 2.2 表是否被截断。

- [ ] **Step 7: Commit**

```bash
cd /Users/haxianhe/github/SLib
git add skills/image-prompt-info/SKILL.md skills/image-prompt-info/references/base-prompt.md
git commit -m "feat(image-prompt-info): complete workflow, prompt file format, references index

5 步工作流 + Prompt 文件格式样例 + base-prompt.md 拼装模板 + 通用防御段。
SKILL.md 全部 5 节填满,无 TODO。"
```

---

## Task 6: image-prompt-info — 端到端验证

**目标**:跑 3 种主题(教程 / 数据 / 概念)各 1 次,验证 prompt 文件可读、内容贴合预设、贴文生图平台能出"跟 baoyu 同等水平"的图。

**Files:**
- 不写代码;只产 3 份测试用 prompt 文件到 `~/knowledge/image-prompts/`,作为人工验收材料

**前置条件**:Task 1-5 全部 commit 完成。

- [ ] **Step 1: 在新 Claude Code session 跑教程主题**

启动新 session(或 `/clear`),输入:

```
帮我做一个信息图,讲手把手配置家庭路由器(改 WiFi 名/改密码/开 5G 频段/QoS/访客网络/重启)
```

Expected 行为:
1. Claude 自动触发 `image-prompt-info` skill
2. Step 2 命中「步骤编号 / 怎么做 X」规则 → 推「流程教程」预设
3. 默认走推荐(无强制确认门)
4. Step 3 读 `references/layouts/linear-progression.md` + `references/styles/ikea-manual.md`
5. Step 4 写到 `~/knowledge/image-prompts/2026-05-29-router-setup/prompt.md`
6. Step 5 终端展示完整 prompt + 文件路径

验收:
- [ ] 推预设环节确实是「流程教程」
- [ ] 没有弹强制 4 选 1 的 AskUserQuestion
- [ ] prompt.md 文件存在且 frontmatter 字段全
- [ ] 「摘要(给人看)」段读完能脑补出画面
- [ ] 「Prompt(给 AI)」段含布局描述 + 风格描述 + Constraints 三段

任一不通过 → 回相关 Task 修。

- [ ] **Step 2: 跑数据主题**

新 session,输入:

```
帮我做一个信息图,讲 2026 Q1 跨境业务季度数据:GMV 增 35%、订单量 1200 万、复购率 42%、客单价 89 美元、TOP3 国家是美国/巴西/印尼
```

Expected:命中「数字 / 百分比 / 季度」→ 推「数据看板」预设。

验收:
- [ ] 推的就是「数据看板」(corporate-memphis style)
- [ ] prompt 里数字 / 百分比 / 国家名出现且**没有**被改写或编造其他数字
- [ ] frontmatter 里 `source` 字段不含编造数据

- [ ] **Step 3: 跑概念主题**

新 session,输入:

```
帮我做一个信息图,讲"成功背后看不见的 7 个习惯":晨起冥想/每日复盘/拒绝无效社交/...
```

Expected:命中「本质 / 看不见的」→ 推「冰山揭示」预设。

验收:
- [ ] 推的就是「冰山揭示」
- [ ] layout 是 iceberg
- [ ] prompt 里冰山隐喻清晰(水面以上少 / 以下多)

- [ ] **Step 4: 把 3 份 prompt 各贴一个文生图平台验证出图质量**

任选 1 个文生图平台(推荐手头最熟的,如即梦 / 通义万象 / Midjourney):

```bash
cat ~/knowledge/image-prompts/2026-05-29-router-setup/prompt.md
# 在 ## Prompt(给 AI) 下的代码块整段复制
```

按以下标准验收(不要求完美,但要"基本对路"):

| 主题 | 出图核心特征验收点 |
|---|---|
| 教程 | 是否纯线稿无填色 / 是否数字编号步骤 / 是否几何小人 |
| 数据 | 是否扁平矢量 / 是否含图表与数字 / 是否冷色调商务感 |
| 概念 | 是否横向海平面构图 / 是否冰山隐喻清晰 / 是否冷蓝水彩感 |

任一主题"完全不像"(超过 2/3 验收点没达到)→ 看是哪类问题:
- 出图不像 baoyu 同等预设 → 该 layout / style 的 references/ 文件需检查是否漏抄
- prompt 里布局描述太弱 → 调 `base-prompt.md` 拼装规则
- 文字渲染乱码 → Constraints 段缺 language 锁定;检查 base-prompt.md

修复后重跑该主题。

- [ ] **Step 5: 记录验证结果到 plan 日志**

在 plan 文档底部加一段验证日志:

```bash
cat >> /Users/haxianhe/github/SLib/docs/plans/2026-05-29-image-prompt-skills.md << 'EOF'

---

## Validation Log

### Task 6: image-prompt-info 端到端验证(2026-05-29)

| 主题 | 推荐预设 | 推荐命中 | 文件落盘 | 文生图平台 | 出图质量 |
|---|---|---|---|---|---|
| 路由器配置教程 | 流程教程 | ✓/✗ | ✓/✗ | (平台名) | (1-5 分 + 一句话) |
| Q1 季度数据 | 数据看板 | ✓/✗ | ✓/✗ | (平台名) | (1-5 分 + 一句话) |
| 7 个看不见的习惯 | 冰山揭示 | ✓/✗ | ✓/✗ | (平台名) | (1-5 分 + 一句话) |

> 备注:出图质量 ≥ 3 分视为通过;< 3 分需修复对应 references 文件。
EOF
```

执行该命令把日志框架追加到 plan 末尾,真实跑完后用 `Edit` 工具填入实际结果。

- [ ] **Step 6: Commit 验证日志**

```bash
cd /Users/haxianhe/github/SLib
git add docs/plans/2026-05-29-image-prompt-skills.md
git commit -m "test(image-prompt-info): record end-to-end validation log for 3 themes

3 主题(教程 / 数据 / 概念)端到端验证 → 推荐命中 / 落盘 / 文生图出图质量。"
```

> ⚠️ Task 6 通过之前**不要进入 Task 7**(cover) / Task 8(xhs)。
> 因为这两个 skill 复用同一套架构,info 跑不通它们也跑不通,先 debug 完最简单的 info。

---

## Task 7: image-prompt-cover — 完整实施

**目标**:把 info 验证过的架构套用到 cover。差异:5 维度(type / palette / rendering / text / mood / font)替代 layout × style;无 baoyu 截图所以预览列留空。

**Files:**
- Modify: `skills/image-prompt-cover/SKILL.md`(Task 1 已建骨架)
- Create: `skills/image-prompt-cover/references/base-prompt.md`
- Create: `skills/image-prompt-cover/references/types/<6 个>.md`
- Create: `skills/image-prompt-cover/references/palettes/<11 个>.md`
- Create: `skills/image-prompt-cover/references/renderings/<7 个>.md`
- Create: `skills/image-prompt-cover/references/dimensions/{text,mood,font}.md`

**前置阅读**:spec 第 7 节(7.1 - 7.7)。

- [ ] **Step 1: 替换 SKILL.md 「1. 快速选」节(6 预设)**

替换 `<!-- 由 Task 7 填充 -->`(快速选节)为:

```markdown
## 1. 快速选(推荐预设)

| 预设 | 看起来像 | 用在哪 | 预览 |
|---|---|---|---|
| **极客蓝图** | 深蓝纸底 + 白色细工程线 + 等距 2.5D + 标尺刻度,科技严谨 | 系统架构文、技术深度长文 | — |
| **温暖手绘** | 暖米黄 + 手绘抖动线 + 简笔人物 + 一只猫,亲切叙事 | 个人博客、产品故事、复盘随笔 | — |
| **高对比海报** | 浓黑/酒红/芒果黄 + 厚描边 + 大字标题撑满,海报感 | 观点文、行业评论、Newsletter 头条 | — |
| **极简文字** | 白底 / 黑底,无图,巨大无衬线标题居中,留白 70% | 思考札记、宣言、TED 风短文 | — |
| **暗色氛围** | 深紫黑底 + 渐变光晕 + 玻璃质感卡片 + 微光高光 | AI 周报、午夜推送、Sci-Fi 影评 | — |
| **油画肖像** | 厚涂笔触 + 暖光 + 单一人物剪影或半身 + 戏剧光影 | 人物访谈、传记摘录、长篇小说 | — |

> 预览图列暂空白:baoyu-cover-image 仓库未提供 screenshots。
> 找到对应截图后批量补 raw URL。

预设映射(用了哪些维度组合)见第 2.6 节。
```

- [ ] **Step 2: 替换 SKILL.md 「2. 完整库」节**

替换 `<!-- 由 Task 7 填充 -->`(完整库节)为:

```markdown
## 2. 完整库(自由组合)

封面图按 5 维度自由组合:Type × Palette × Rendering × Text × Mood × Font。
Claude 会按你的选择去 `references/` 读完整描述,拼到 prompt。

### 2.1 Type(6)

| Type | 看起来像 | 用在哪 |
|---|---|---|
| `hero` | 主体居中 + 大留白 + 强视觉锚点 | 产品发布、品牌主页头图 |
| `conceptual` | 抽象隐喻图像,不直接表达内容 | 思辨/哲学文章、观点评论 |
| `typography` | 文字本身就是主视觉,几乎无图 | 宣言、引言、纯思考类文章 |
| `metaphor` | 视觉隐喻,一个具体物代表抽象概念 | "技术债是腐烂的桥"等比喻文 |
| `scene` | 一个有人物/场景的瞬间画面 | 故事、回忆、案例叙述 |
| `minimal` | 极少元素,几何 + 大块色 + 极致克制 | 极简主义、禅意、产品宣言 |

完整描述见 `references/types/<name>.md`。

### 2.2 Palette(11)

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

完整 hex 值见 `references/palettes/<name>.md`。

### 2.3 Rendering(7)

| Rendering | 看起来像 | 用在哪 |
|---|---|---|
| `flat-vector` | 扁平矢量,无阴影/渐变,纯色块 | 现代品牌、SaaS、产品页 |
| `hand-drawn` | 手绘线条,抖动 + 不规则 + 黑铅笔感 | 温暖叙事、个人博客 |
| `painterly` | 厚涂油画,可见笔触 + 戏剧光影 | 人物肖像、文学性内容 |
| `digital` | 数字绘画,光滑渐变 + 数码光感 | Sci-Fi、游戏、Tech |
| `pixel` | 8/16-bit 像素 | 复古游戏、独立开发文化 |
| `chalk` | 粉笔肌理 + 黑板感 | 教学、复古课堂 |
| `screen-print` | 丝网印刷,粗描边 + 半调点纹 + 错版色 | 海报、潮牌、亚文化 |

完整描述见 `references/renderings/<name>.md`。

### 2.4 Text(文字含量,4 档)

| 值 | 看起来像 | 用在哪 |
|---|---|---|
| `none` | 纯视觉,零文字 | 通用占位、纯氛围头图 |
| `title-only` | 一个大标题 + 主图(默认) | 大多数文章 |
| `title-subtitle` | 标题 + 副标题 | 长文、专题报道 |
| `text-rich` | 多标签/引文/数据嵌入 | 数据报告、信息密度高的封面 |

详见 `references/dimensions/text.md`。

### 2.5 Mood / Font

**Mood(对比强度,3 档)**:

| 值 | 看起来像 | 用在哪 |
|---|---|---|
| `subtle` | 低对比,温柔静谧 | 治愈、文艺、reflective |
| `balanced` | 中等对比(默认) | 大多数场景 |
| `bold` | 高对比 + 强张力 | 观点、号召、海报感 |

**Font(字体感觉,4 档)**:

| 值 | 看起来像 | 用在哪 |
|---|---|---|
| `clean` | 现代无衬线,几何感 | 科技、企业 |
| `handwritten` | 手写抖动体 | 个人、温暖、亲子 |
| `serif` | 衬线,书卷气 | 文学、新闻、深度长文 |
| `display` | 粗壮装饰字,海报型 | 头条、潮流、活动宣传 |

详见 `references/dimensions/{mood,font}.md`。

### 2.6 第 1 层预设 → 第 2 层映射

| 预设 | type | palette | rendering | text | mood | font |
|---|---|---|---|---|---|---|
| 极客蓝图 | conceptual | cool | digital | title-only | balanced | clean |
| 温暖手绘 | scene | warm | hand-drawn | title-only | subtle | handwritten |
| 高对比海报 | typography | vivid | screen-print | title-only | bold | display |
| 极简文字 | typography | mono | flat-vector | title-only | subtle | clean |
| 暗色氛围 | conceptual | dark | digital | title-only | balanced | serif |
| 油画肖像 | scene | warm | painterly | title-only | bold | serif |

### 2.7 内容 → 预设推荐规则

| 内容信号 | 默认推预设 |
|---|---|
| 含架构 / 系统 / 工程 / 协议 | 极客蓝图 |
| 个人叙事 / 复盘 / 我们的故事 | 温暖手绘 |
| 观点文 / 锐评 / Newsletter 头条 / 行业批评 | 高对比海报 |
| 思考札记 / 一句话洞察 / 宣言式 | 极简文字 |
| AI / Sci-Fi / 深夜推送 / 神秘氛围 | 暗色氛围 |
| 人物访谈 / 传记 / 长篇文学 | 油画肖像 |
| 其他(默认) | 温暖手绘 |
```

- [ ] **Step 3: 替换 SKILL.md 「3. 工作流」 / 「4. Prompt 文件格式」 / 「5. References 索引」**

复用 Task 5 的内容,把 info 改成 cover 即可。具体替换内容:

- 第 3 节工作流:复制 `skills/image-prompt-info/SKILL.md` 的 `## 3. 工作流` 整节(含「Step 1: 接受输入」到「工作流硬约束」),改"信息图"→"封面图",改示例对话(用户输入"给这篇文章配封面"那种)
- 第 4 节 Prompt 文件格式:复制 info 的 `## 4. Prompt 文件格式`,frontmatter 的 `skill` 字段改 `image-prompt-cover`;layout/style/palette 三字段替换成 `type/palette/rendering/text/mood/font` 六字段;摘要示例改成一个封面图描述(单张图,16:9)
- 第 5 节 References 索引:表格改为:

| 类型 | 路径 | 数量 |
|---|---|---|
| 拼装模板 | `references/base-prompt.md` | 1 |
| Type | `references/types/<name>.md` | 6 |
| Palette | `references/palettes/<name>.md` | 11 |
| Rendering | `references/renderings/<name>.md` | 7 |
| 维度 | `references/dimensions/{text,mood,font}.md` | 3 |

- [ ] **Step 4: 写 base-prompt.md(cover 专用)**

写入 `/Users/haxianhe/github/SLib/skills/image-prompt-cover/references/base-prompt.md`:

```markdown
<!-- base-prompt: image-prompt-cover 的 prompt 拼装模板 -->

# Base Prompt 模板(Cover)

## 拼装顺序

1. **主题段** — 文章主题或标题
2. **Type 段** — 从 `references/types/<type>.md` 摘 Composition / Visual Approach
3. **Palette 段** — 从 `references/palettes/<palette>.md` 摘 Hex + 用法
4. **Rendering 段** — 从 `references/renderings/<rendering>.md` 摘 Technique / Line Treatment
5. **Text 段** — 从 `references/dimensions/text.md` 取对应档位描述
6. **Mood 段** — 从 `references/dimensions/mood.md` 取对应档位
7. **Font 段** — 从 `references/dimensions/font.md` 取对应档位
8. **比例段** — 一行:`Aspect ratio: {aspect}`(封面默认 16:9)
9. **通用防御段** — 同 info,Constraints 原样拼接

## 通用防御段(Constraints)

```
Constraints:
- Render any text in the language specified above; no garbled / mojibake / placeholder text
- No watermark, no signature, no website URL in the image
- Composition must match the described aspect; do not crop key elements
- Style must stay consistent; do not mix realistic photography unless explicitly requested
- Stay within the specified color palette hex values; no out-of-palette hues
- If type = scene/metaphor and contains people: simplified stylized silhouettes,
  not photorealistic faces
```

## 输出 prompt 文件结构

同 image-prompt-info,但 frontmatter 字段替换:

```yaml
---
skill: image-prompt-cover
preset: 极客蓝图
type: conceptual
palette: cool
rendering: digital
text: title-only
mood: balanced
font: clean
aspect: 16:9
language: zh
created: 2026-05-29T...
source: |
  {文章标题 / 主题摘要}
---
```
```

- [ ] **Step 5: 写 references/types/ 6 个文件**

每个 type 一份独立 .md。基础内容参考 baoyu-cover-image 的 `references/types.md`(单文件多 type)拆分,或按下面模板从零写:

```bash
# 看看 baoyu 原文怎么写的
cat /Users/haxianhe/github/baoyu-skills/skills/baoyu-cover-image/references/types.md | head -100
```

baoyu 的 types.md 是单文件多 type,需要按 `## <type>` 拆分成 6 个独立 .md:

Run:
```bash
ls /Users/haxianhe/github/baoyu-skills/skills/baoyu-cover-image/references/
```
Expected:`types.md`(单文件)。

为了减少手工拆分,允许两种方案二选一:

**方案 A(简单)**:把 baoyu 整个 `types.md` 复制 6 份,各自留对应章节并删掉其他:
```bash
SRC=/Users/haxianhe/github/baoyu-skills/skills/baoyu-cover-image/references/types.md
DST=/Users/haxianhe/github/SLib/skills/image-prompt-cover/references/types
for t in hero conceptual typography metaphor scene minimal; do
  # 把整段原文 + source 注释存进每个 file,实施时手工删除其他 type 章节即可
  {
    echo "<!-- source: baoyu-skills/skills/baoyu-cover-image/references/types.md"
    echo "     copied: 2026-05-29; only ## $t section kept (manual trim required) -->"
    echo ""
    cat "$SRC"
  } > "$DST/$t.md"
done
```
然后手工 Edit 6 个文件,各自只留对应章节。

**方案 B(写一遍)**:不复制,直接按下面模板手工写 6 份(每份 30-50 行):

```markdown
<!-- source: hand-written based on baoyu-cover-image references/types.md -->
# {type-name}

## Composition
[main subject placement / focal point / white space ratio / visual anchor]

## Visual Approach
[is it literal / metaphorical / abstract / scene / typography-driven]

## Best For
[3-5 类内容场景]

## Pitfalls
[避免哪些常见错误,如"避免直接画文章主体的具象物"等]
```

**推荐方案 A**(保真度高,手工 trim 5 分钟)。

完成后验证:
```bash
ls /Users/haxianhe/github/SLib/skills/image-prompt-cover/references/types/
```
Expected:`hero.md  conceptual.md  typography.md  metaphor.md  scene.md  minimal.md`(6 个)。

- [ ] **Step 6: 写 references/palettes/ 11 个文件**

Run:
```bash
ls /Users/haxianhe/github/baoyu-skills/skills/baoyu-cover-image/references/palettes/
```

如 baoyu 已有独立 .md → 直接 cp(同 Task 4 Step 4):
```bash
cp -v /Users/haxianhe/github/baoyu-skills/skills/baoyu-cover-image/references/palettes/*.md \
      /Users/haxianhe/github/SLib/skills/image-prompt-cover/references/palettes/
```

若是单文件多 palette → 按方案 A 复制 + 手工 trim。

每个文件最少含:
```markdown
# {palette-name}

## Colors
- Primary: #XXXXXX (name)
- Secondary: #XXXXXX (name)
- Accent: #XXXXXX (name)
- Background: #XXXXXX (name)

## Mood
[低饱和 / 高饱和 / 暖 / 冷 / 一句话定调]

## Best For
[2-3 类适用内容]
```

完成验证:
```bash
ls /Users/haxianhe/github/SLib/skills/image-prompt-cover/references/palettes/ | wc -l
```
Expected:`11`。

- [ ] **Step 7: 写 references/renderings/ 7 个文件**

同 Step 6 流程,源是 baoyu `renderings/`(或 `renderings.md`)。

完成验证:
```bash
ls /Users/haxianhe/github/SLib/skills/image-prompt-cover/references/renderings/ | wc -l
```
Expected:`7`。

- [ ] **Step 8: 写 references/dimensions/ 3 个文件**

源是 baoyu `dimensions/text.md` / `mood.md` / `font.md`(已经是独立文件)。

```bash
cp -v /Users/haxianhe/github/baoyu-skills/skills/baoyu-cover-image/references/dimensions/*.md \
      /Users/haxianhe/github/SLib/skills/image-prompt-cover/references/dimensions/
```

完成验证:
```bash
ls /Users/haxianhe/github/SLib/skills/image-prompt-cover/references/dimensions/
```
Expected:`text.md  mood.md  font.md`。

- [ ] **Step 9: 在所有 references/ 文件加 source 注释**

复用 Task 4 Step 5 的脚本(改路径):

```bash
cd /Users/haxianhe/github/SLib/skills/image-prompt-cover/references

for f in types/*.md palettes/*.md renderings/*.md dimensions/*.md base-prompt.md; do
  if head -1 "$f" | grep -q '^<!-- source:'; then
    continue
  fi
  tmp=$(mktemp)
  {
    echo "<!-- source: baoyu-skills/skills/baoyu-cover-image/references/$f"
    echo "     copied: 2026-05-29 -->"
    echo ""
    cat "$f"
  } > "$tmp"
  mv "$tmp" "$f"
done
```

- [ ] **Step 10: 名字一致性核对**

复用 Task 4 Step 7 的脚本:
```bash
cd /Users/haxianhe/github/SLib/skills/image-prompt-cover
grep -oE '`[a-z][a-z0-9-]*`' SKILL.md | tr -d '`' | sort -u > /tmp/skill-names.txt
ls references/types references/palettes references/renderings references/dimensions \
  | sed 's/\.md$//' | sort -u > /tmp/ref-files.txt
comm -23 /tmp/skill-names.txt /tmp/ref-files.txt | head -20
```

Expected:输出为空(或仅含 skill 自己的名字)。

- [ ] **Step 11: 端到端验证(3 主题)**

按 Task 6 流程跑 3 个文章主题:

```
session 1: 帮我做一个文章封面,文章讲"分布式系统的 CAP 定理"
→ Expected:推「极客蓝图」预设
```

```
session 2: 帮我做一个文章封面,文章是"我给妈妈打的第一通视频电话"
→ Expected:推「温暖手绘」预设
```

```
session 3: 帮我做一个文章封面,文章是"AI 不会替代你,但会用 AI 的人会"
→ Expected:推「高对比海报」预设
```

各贴一份 prompt 到文生图平台,验证出图是否符合预设描述的视觉特征。

任一不通过 → 修对应 references。

- [ ] **Step 12: Commit**

```bash
cd /Users/haxianhe/github/SLib
git add skills/image-prompt-cover/
git commit -m "feat(image-prompt-cover): complete skill with 6 presets + full 5-dim library

SKILL.md 5 节填满;references 覆盖 6 type + 11 palette + 7 rendering + 3 维度。
端到端 3 主题验证通过。"
```

---

## Task 8: image-prompt-xhs — 完整实施

**目标**:把架构套用到 xhs。差异:**多张产物**(1-10 张系列),多个 prompt 文件;layout = 信息密度(sparse/balanced/dense/list/comparison/flow)。

**Files:**
- Modify: `skills/image-prompt-xhs/SKILL.md`
- Create: `skills/image-prompt-xhs/references/base-prompt.md`
- Create: `skills/image-prompt-xhs/references/styles/<12 个>.md`
- Create: `skills/image-prompt-xhs/references/layouts/<6 个>.md`
- Create: `skills/image-prompt-xhs/references/palettes/<3 个>.md`

**前置阅读**:spec 第 8 节(8.1 - 8.7)。

- [ ] **Step 1: 替换 SKILL.md 「1. 快速选」节(6 预设)**

替换 `<!-- 由 Task 8 填充 -->`(快速选节)为:

```markdown
## 1. 快速选(推荐预设)

| 预设 | 看起来像 | 用在哪 | 预览 |
|---|---|---|---|
| **可爱知识卡** | 米奶油底 + 圆角卡 + 樱花粉/薄荷绿/雾蓝 + Q 版小人 + 圆头手写体 | 萌系科普、健康知识、亲子分享 | ![](https://github.com/JimLiu/baoyu-skills/raw/main/screenshots/xhs-images-styles/cute.webp) |
| **清新生活流** | 莫兰迪绿 + 暖米黄底 + 极细线 + 大面积留白 + 嫩芽/咖啡 icon | 早 c 晚 a、日常 vlog、生活仪式感 | ![](https://github.com/JimLiu/baoyu-skills/raw/main/screenshots/xhs-images-styles/fresh.webp) |
| **暖光叙事** | 暖橙 + 蜜桃 + 暖棕,胶片颗粒感 + 居家光晕 | 妈妈故事、好物长测、暖心案例 | ![](https://github.com/JimLiu/baoyu-skills/raw/main/screenshots/xhs-images-styles/warm.webp) |
| **干货知识小抄** | 粉色背景 + 黑色粗框 + 序号大字 + 密排短句 | "8 个高效率小工具"、读书笔记 | ![](https://github.com/JimLiu/baoyu-skills/raw/main/screenshots/xhs-images-layouts/dense.webp) |
| **故事封面** | 1 个大主图 + 顶部短金句 + 底部小副标,留白 60% | 个人故事开篇、长文 1.0 封面 | ![](https://github.com/JimLiu/baoyu-skills/raw/main/screenshots/xhs-images-layouts/sparse.webp) |
| **前后对比** | 上下/左右两半,左灰/右彩,各 1 张图 + 标签 | 减肥前后、改造对比、产品测评 | ![](https://github.com/JimLiu/baoyu-skills/raw/main/screenshots/xhs-images-layouts/comparison.webp) |

预设映射(用了哪些 style + layout + palette)见第 2.5 节。
```

- [ ] **Step 2: 替换 SKILL.md 「2. 完整库」节**

替换为:

```markdown
## 2. 完整库(自由组合)

xhs 按 Style × Layout × Palette 自由组合,跟 info 类似,但 layout 含义是"信息密度",不是"信息结构"。

### 2.1 Style(12)

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

完整描述见 `references/styles/<name>.md`。

### 2.2 Layout(6,= 信息密度)

| Layout | 看起来像 | 用在哪 |
|---|---|---|
| `sparse` | 1-2 个要点,大留白 60%+,大字标题 | 封面图、金句卡、引言 |
| `balanced` | 3-4 个要点,中等密度(默认) | 普通分享、3-step 方法 |
| `dense` | 5-8 个要点,密排 + 紧凑卡 | 知识小抄、Cheat Sheet |
| `list` | 4-7 项编号列表,垂直顺序 | 清单、排行、Top N |
| `comparison` | 上下/左右两栏,各自图标 + bullet | 前后对比、A vs B、利弊 |
| `flow` | 3-6 步流程,横向/纵向带箭头 | 操作步骤、时间线、过程 |

完整描述见 `references/layouts/<name>.md`。

### 2.3 Palette(3)

| Palette | 看起来像 | 用在哪 |
|---|---|---|
| `macaron` | 米奶油 + 粉/雾蓝/薄荷/桃,马卡龙感 | 萌系、亲子、知识 |
| `warm` | 蜜桃 + 暖橙/红土陶/金黄,无冷色 | 品牌、生活方式 |
| `neon` | 深紫黑 + 粉/青/绿荧光,高对比 | 潮流、复古赛博 |

完整 hex 见 `references/palettes/<name>.md`。

### 2.4 多图系列模板(xhs 关键差异)

xhs 跟 info / cover 的关键差别:**一次产出多张 prompt 文件**。

| 张数 | layout 组合 |
|---|---|
| 1 张 | sparse(纯封面) |
| 3 张 | sparse(封面)+ balanced(主体)+ sparse(总结) |
| 6 张 | sparse(封面)+ 4 张 balanced/dense + sparse(行动号召) |
| 9 张 | sparse + 7 张主体 + sparse(适合九宫格预览) |

工作流 Step 3 拼 prompt 时,按用户指定张数(默认 6)循环生成对应数量的 prompt 文件。

### 2.5 第 1 层预设 → 第 2 层映射

| 预设 | style | layout(主体) | palette |
|---|---|---|---|
| 可爱知识卡 | `cute` | `balanced` | `macaron` |
| 清新生活流 | `fresh` | `balanced` | —(style 自带) |
| 暖光叙事 | `warm` | `balanced` | `warm` |
| 干货知识小抄 | `study-notes` | `dense` | —(style 自带) |
| 故事封面 | `minimal` | `sparse` | —(style 自带) |
| 前后对比 | `bold` | `comparison` | —(style 自带) |

> 多图系列的封面与总结统一用 `sparse` layout,其余主体用预设映射的 layout。

### 2.6 内容 → 预设推荐规则

| 内容信号 | 默认推预设 |
|---|---|
| 健康 / 育儿 / 萌宠 / 入门科普 | 可爱知识卡 |
| 日常分享 / vlog / 生活仪式感 | 清新生活流 |
| 故事 / 复盘 / 案例 / 个人经历 | 暖光叙事 |
| 速查 / 工具集 / Top N / 干货 | 干货知识小抄 |
| 单图金句 / 引言 / 短观点 | 故事封面 |
| 减肥 / 改造 / 产品测评 / before-after | 前后对比 |
| 其他(默认) | 可爱知识卡 |
```

- [ ] **Step 3: 替换 SKILL.md 「3. 工作流」节**

复用 Task 5 的工作流模板,**关键修改**:

- Step 1 多问一个:"想出几张图?(默认 6 张)"
- Step 3 拼 prompt 时按 2.4 模板循环生成 N 份 prompt 文件
- Step 4 落盘改成多份:`prompts/01-{slug}.md` 到 `prompts/NN-{slug}.md`;终端只展示**第 1 张完整 prompt** + 其他张的标题列表
- 工作流硬约束加一条:**多图保持视觉风格一致**(style / palette 全系列锁定,只 layout 按封面/主体/总结切换)

具体替换内容:

```markdown
## 3. 工作流

5 步固定流程,产物是 1-10 张 prompt 文件系列。

### Step 1: 接受输入 + 问张数

接受:
- 一段文字内容(主题、段落、文章)
- 一句模糊主题(如「做一组讲早睡早起的小红书图卡」)
- (URL 类同 info,提示先 `slib:summary` 拉)

如果用户没指定张数,默认 6 张。可在对话里说"3 张/9 张/...",或追问一次。

### Step 2: 内容分析 + 推预设

按第 2.6 节规则推一个预设。在对话里说明:

```
我看到你的内容:讲早睡早起的 7 个好处。
默认推预设:可爱知识卡(cute + balanced + macaron)
张数:6 张(1 封面 + 4 主体 + 1 总结)
理由:健康类 / 入门科普 → 萌系亲切感最适配。

直接出?或者换:
- 清新生活流(干净安静)
- 干货知识小抄(信息密度高)
```

### Step 3: 拼 prompt 文件(多图)

按预设解析 style + layout(主体)+ palette + aspect(默认 3:4)。
按张数选 2.4 节模板,得到每张图的 layout 序列(如 6 张 = sparse + balanced × 4 + sparse)。

循环每张图:
1. 读 `references/base-prompt.md` 拿模板骨架
2. 读 `references/styles/<style>.md` 拿风格描述(全系列复用)
3. 读 `references/layouts/<该张的 layout>.md` 拿对应密度描述
4. 读 `references/palettes/<palette>.md`(如有)
5. 拼出 prompt 正文
6. 套 prompt 文件格式生成 `01-{slug}.md` / `02-{slug}.md` / ...

### Step 4: 落盘 + 终端展示

落到 `~/knowledge/image-prompts/{YYYY-MM-DD}-{slug}/prompts/01-{slug}.md`(及 02..NN)。
封面图独立编号 01,总结独立编号 NN,中间是主体。

终端展示:
- 第 1 张(封面)完整 prompt 块
- 其他张:仅打印「02 - 主体: {小标题}」「03 - 主体: ...」等条目
- 所有文件路径

### Step 5: 提示下一步

```
6 张 prompt 已生成:~/knowledge/image-prompts/2026-05-29-{slug}/prompts/

要调整?试试:
- "改成 3 张"(重新规划张数)
- "换成 fresh 风格"(全系列切风格,保持视觉一致)
- "第 3 张密度太低,改成 dense"(单张调整)
```

### 工作流硬约束

- 零 EXTEND.md / 零配置文件
- 零强制确认门(张数有默认 6,可调)
- 零中间文件
- 不调任何文生图 API
- 不主动抓取 URL
- **多图视觉风格一致**:同一次任务的所有 prompt,style 与 palette 必须相同,只允许 layout 在「封面/主体/总结」之间切换
```

- [ ] **Step 4: 替换 SKILL.md 「4. Prompt 文件格式 + 多图模板」节**

替换为(与 info 不同点:frontmatter 加 `series_index` / `series_total` / `series_role`,目录结构改 `prompts/`):

```markdown
## 4. Prompt 文件格式 + 多图模板

### 4.1 多图目录结构

```
~/knowledge/image-prompts/2026-05-29-{slug}/
└── prompts/
    ├── 01-{slug}.md   # 封面(role: cover)
    ├── 02-{slug}.md   # 主体 1
    ├── 03-{slug}.md   # 主体 2
    ├── ...
    └── 06-{slug}.md   # 总结(role: outro)
```

### 4.2 单张 prompt 文件结构

````markdown
---
skill: image-prompt-xhs
preset: 可爱知识卡
style: cute               # 全系列锁定
layout: balanced          # 本张的 layout
palette: macaron          # 全系列锁定
aspect: 3:4               # 全系列锁定
language: zh
series_index: 2           # 本张是第几张
series_total: 6           # 总共几张
series_role: body         # cover / body / outro
created: 2026-05-29T...
source: |
  早睡早起的 7 个好处
---

# 第 2 张:为什么早睡这么重要

## 摘要(给人看)

竖版 3:4。米奶油底 + 圆角卡 + 樱花粉/薄荷绿/雾蓝 + Q 版小人。
中央 3 个圆角卡分别画激素分泌时钟、皮肤修复、记忆巩固;
顶部圆头手写体小标题「为什么早睡这么重要」。

## Prompt(给 AI)

```
[完整拼装后的 prompt]
```

## 怎么用

- 推荐平台:Midjourney / 即梦 / 通义万象 / Nano Banana / Sora
- 复制上面 Prompt 块整段贴过去
- aspect 设 `3:4`(适合 xhs 竖版)
- 6 张图按 01-06 顺序一张张生成,style/palette 保持一致
- 不满意 → 回到对话说「第 X 张改 Y」
````

详细模板见 `references/base-prompt.md`。
```

- [ ] **Step 5: 替换 SKILL.md 「5. References 索引」节**

替换为:

```markdown
## 5. References 索引

| 类型 | 路径 | 数量 |
|---|---|---|
| 拼装模板 | `references/base-prompt.md` | 1 |
| Style | `references/styles/<name>.md` | 12 |
| Layout | `references/layouts/<name>.md` | 6 |
| Palette | `references/palettes/<name>.md` | 3 |

> ⚠️ references/ 内容从 baoyu-xhs-images 项目搬运,顶部含 source 注释。
> 更新参照:https://github.com/JimLiu/baoyu-skills/tree/main/skills/baoyu-xhs-images
```

- [ ] **Step 6: 写 base-prompt.md(xhs 专用)**

写入 `/Users/haxianhe/github/SLib/skills/image-prompt-xhs/references/base-prompt.md`:

```markdown
<!-- base-prompt: image-prompt-xhs 的 prompt 拼装模板 -->

# Base Prompt 模板(xhs 多图)

## 拼装顺序(单张)

1. **系列定位段** — 一行:`This is image {series_index}/{series_total} in a series. Role: {cover|body|outro}. Maintain visual consistency with the series style/palette across all images.`
2. **主题段** — 文章主题 + 本张的具体内容(从用户内容里取对应段落)
3. **Style 段** — 从 `references/styles/<style>.md` 摘 Color Palette / Visual Elements / Typography(全系列一致)
4. **Layout 段** — 从 `references/layouts/<本张 layout>.md` 摘信息密度描述
5. **Palette 段** — 从 `references/palettes/<palette>.md`(如有,全系列一致)
6. **文字策略段** — 同 info(`hand-lettered` 字体感为 xhs 默认)
7. **比例段** — `Aspect ratio: 3:4`(xhs 默认竖版)
8. **通用防御段** — 同 info Constraints + xhs 专属:

```
xhs-specific Constraints:
- All images in this series MUST share identical style and palette;
  only layout density varies between cover / body / outro
- Cover image (01) uses sparse layout, one large title or hero element
- Outro image (NN) uses sparse layout, one takeaway sentence or CTA
- Body images use the preset's main layout (balanced / dense / etc)
- Do not number images visibly in the artwork ("1/6" tags etc) unless requested
```

## 多图循环规则

- 同一次任务:style / palette / aspect / language 全系列锁定,只 layout 切换
- 封面(`role: cover`)→ 强制 `sparse`,标题撑满
- 主体(`role: body`)→ 用预设映射的主 layout
- 总结(`role: outro`)→ 强制 `sparse`,1 句金句或 CTA
- 多图全部 prompt 文件写完后才退出 Step 3
```

- [ ] **Step 7: 复制 styles / layouts / palettes references**

按 Task 4 / Task 7 同样流程:

```bash
# styles
cp -v /Users/haxianhe/github/baoyu-skills/skills/baoyu-xhs-images/references/styles/*.md \
      /Users/haxianhe/github/SLib/skills/image-prompt-xhs/references/styles/

# layouts
cp -v /Users/haxianhe/github/baoyu-skills/skills/baoyu-xhs-images/references/layouts/*.md \
      /Users/haxianhe/github/SLib/skills/image-prompt-xhs/references/layouts/

# palettes
cp -v /Users/haxianhe/github/baoyu-skills/skills/baoyu-xhs-images/references/palettes/*.md \
      /Users/haxianhe/github/SLib/skills/image-prompt-xhs/references/palettes/
```

如果 baoyu 是单文件多 entry,改用 Task 7 Step 5 方案 A(批量复制 + 手工 trim)。

验证:
```bash
echo "styles: $(ls /Users/haxianhe/github/SLib/skills/image-prompt-xhs/references/styles/*.md | wc -l)"
echo "layouts: $(ls /Users/haxianhe/github/SLib/skills/image-prompt-xhs/references/layouts/*.md | wc -l)"
echo "palettes: $(ls /Users/haxianhe/github/SLib/skills/image-prompt-xhs/references/palettes/*.md | wc -l)"
```
Expected:`styles: 12` / `layouts: 6` / `palettes: 3`。

- [ ] **Step 8: 加 source 注释**

复用 Task 4 Step 5 脚本,改路径:

```bash
cd /Users/haxianhe/github/SLib/skills/image-prompt-xhs/references

for f in styles/*.md layouts/*.md palettes/*.md base-prompt.md; do
  if head -1 "$f" | grep -q '^<!-- source:'; then
    continue
  fi
  tmp=$(mktemp)
  {
    echo "<!-- source: baoyu-skills/skills/baoyu-xhs-images/references/$f"
    echo "     copied: 2026-05-29 -->"
    echo ""
    cat "$f"
  } > "$tmp"
  mv "$tmp" "$f"
done
```

- [ ] **Step 9: 名字一致性核对**

```bash
cd /Users/haxianhe/github/SLib/skills/image-prompt-xhs
grep -oE '`[a-z][a-z0-9-]*`' SKILL.md | tr -d '`' | sort -u > /tmp/skill-names.txt
ls references/styles references/layouts references/palettes \
  | sed 's/\.md$//' | sort -u > /tmp/ref-files.txt
comm -23 /tmp/skill-names.txt /tmp/ref-files.txt | head -20
```

Expected:输出为空。

- [ ] **Step 10: 端到端验证(2 个多图主题)**

跑 2 个不同张数的主题。

**主题 1(3 张)**:
```
做一组讲早睡早起的小红书图卡,3 张就够了
```
Expected:
- 推「可爱知识卡」预设
- 张数 3 张:01 封面 sparse / 02 主体 balanced / 03 总结 sparse
- 落到 `~/knowledge/image-prompts/{date}-early-sleep/prompts/01-03-{slug}.md`
- 3 张的 frontmatter `style: cute` / `palette: macaron` 一致;只 layout 不同

**主题 2(9 张)**:
```
做一组 9 张图讲"AI 编程的 9 个高频陷阱",干货知识小抄风
```
Expected:
- 推「干货知识小抄」预设(study-notes style)
- 张数 9 张:01 sparse + 02-08 dense × 7 + 09 sparse
- 9 张 style/palette 完全一致
- 每张 frontmatter `series_index` / `series_total` / `series_role` 正确

挑前 3 张贴文生图平台,验证:
- 风格连贯(都像同一套图)
- 封面/主体/总结密度对路

- [ ] **Step 11: Commit**

```bash
cd /Users/haxianhe/github/SLib
git add skills/image-prompt-xhs/
git commit -m "feat(image-prompt-xhs): complete skill with 6 presets + 12 styles × 6 layouts + multi-image series

SKILL.md 5 节填满;references 覆盖 12 style + 6 layout + 3 palette。
多图模板(1/3/6/9 张)与系列视觉一致性约束就位。
端到端 3 张 + 9 张主题验证通过。"
```

---

## Task 9: 接入 SLib(using-slib + README)

**目标**:把 3 个 skill 注入 SLib 引导文件(using-slib)与 README,让会话开始时自动可见。

**Files:**
- Modify: `skills/using-slib/SKILL.md`
- Modify: `README.md`

- [ ] **Step 1: 更新 `skills/using-slib/SKILL.md` 表格**

打开 `/Users/haxianhe/github/SLib/skills/using-slib/SKILL.md`,找到这段表格:

```markdown
| Skill | 触发条件 |
|-------|---------|
| `slib:afeaturemerge` | 用户说...
| `slib:learning` | 用户说...
| `slib:summary` | 用户粘贴 URL...
| `slib:search` | 用户说"搜索/查找/检索 X"...
| `slib:architecture-diagram` | 用户说"画一个架构图..."...
```

在最后一行后追加 3 行(注意 `architecture-diagram` 那行末尾的换行不要丢):

```markdown
| `slib:image-prompt-info` | 用户说"画信息图/做信息卡/可视化数据/高密度大图/知识卡片/dataviz/infographic"、提供数据或教程内容并希望出一张视觉化图 |
| `slib:image-prompt-cover` | 用户说"做文章封面/封面图/banner/cover/配题图"、有文章/标题想配主视觉 |
| `slib:image-prompt-xhs` | 用户说"做小红书图/出图卡/社交多图/知识小抄/xhs"、想出分张的图卡系列(3 张 / 6 张 / 9 张等) |
```

- [ ] **Step 2: 更新 `skills/using-slib/SKILL.md` 调用代码块**

找到这段代码块:

```
Skill({ skill: "slib:afeaturemerge" })
Skill({ skill: "slib:learning" })
Skill({ skill: "slib:summary" })
Skill({ skill: "slib:search" })
Skill({ skill: "slib:architecture-diagram" })
```

在最后一行追加:

```
Skill({ skill: "slib:image-prompt-info" })
Skill({ skill: "slib:image-prompt-cover" })
Skill({ skill: "slib:image-prompt-xhs" })
```

- [ ] **Step 3: 验证 using-slib 改动**

Run:
```bash
grep -c "image-prompt-" /Users/haxianhe/github/SLib/skills/using-slib/SKILL.md
```
Expected:`6`(3 行表格 + 3 行调用块)。

不是 6 → 看是漏写还是多写,调整。

- [ ] **Step 4: 更新 `README.md` 「包含 Skill」表格**

打开 `/Users/haxianhe/github/SLib/README.md`,找到这段表格:

```markdown
| Skill | 适用场景 |
|-------|---------|
| [`afeaturemerge`](#afeaturemerge) | ...
| [`learning`](#learning) | ...
| [`summary`](#summary) | ...
| [`search`](#search) | ...
| [`architecture-diagram`](#architecture-diagram) | ...
```

在最后一行后追加 3 行:

```markdown
| [`image-prompt-info`](#image-prompt-info)   | 信息图 AI 文生图 prompt(产 prompt 文件,自己拿去文生图平台出图) |
| [`image-prompt-cover`](#image-prompt-cover) | 文章封面图 AI 文生图 prompt |
| [`image-prompt-xhs`](#image-prompt-xhs)     | 小红书图卡 AI 文生图 prompt(多张系列,1-10 张) |
```

- [ ] **Step 5: 更新 `README.md` 各 skill 说明段**

在 `README.md` 中 `### architecture-diagram` 整段(到下一个 `---` 之前)后面,追加 3 段新 skill 说明。

模板(填一次复制 3 份,替换名字):

```markdown
### image-prompt-info

**定位**:把数据 / 教程 / 概念组织成视觉密度高的一张信息图,产出可直接复制的文生图 prompt 文件。**不调任何后端 API**。

**触发条件**:

- "画信息图 / 做信息卡 / 可视化数据"
- "高密度大图 / 知识卡片 / dataviz / infographic"
- 提供数据或教程内容并希望出一张视觉化图

**用法示例**:

```
用户:帮我做一个信息图,讲 5 个 Git 高频命令
用户:把 Q1 季度数据做成一张可视化图
```

**第 1 层精选预设(8 个)**:

| 预设 | 一句话 |
|---|---|
| 知识卡 | 米黄牛皮纸 + 手绘 + 马卡龙色块,亲和入门 |
| 复古高密度 | 1970s 波普 + Swiss 栅格,长图速查 |
| 流程教程 | 宜家说明书风,纯线稿步骤 |
| 数据看板 | 公司年报风,扁平矢量 + 数字大 |
| 赛博朋克 | 紫黑底 + 霓虹粉绿,AI 风 |
| 黑板手写 | 深绿黑板 + 粉笔字,课堂感 |
| A vs B 对比 | 左右两栏强对比 |
| 冰山揭示 | 上 1/8 表象 + 下 7/8 本质 |

**输出位置**:`~/knowledge/image-prompts/{date}-{slug}/prompt.md`

**完整 22 种 style × 21 种 layout × 3 种 palette** 见 `skills/image-prompt-info/SKILL.md` 第 2 节。

---
```

写完 info,再如法炮制 cover 与 xhs。cover 的预设表用 spec 第 7.2 节内容(6 个);xhs 的预设表用 spec 第 8.2 节内容(6 个) + 多图说明。

> ⚠️ 写 cover 段时要标注「baoyu-cover-image 仓库未提供截图,预览暂空白」。
> 写 xhs 段时要标注「输出多份 prompt 文件,默认 6 张可调」。

- [ ] **Step 6: 更新 `README.md` 目录结构图**

找到这段(在文件较底部):

```
SLib/
├── .claude-plugin/
│   ├── plugin.json
│   └── marketplace.json
├── hooks/
│   ├── hooks.json
│   ├── session-start
│   ├── slib-sync.sh
│   └── run-hook.cmd
├── skills/
│   ├── using-slib/
│   ├── afeaturemerge/
│   ├── learning/
│   ├── summary/
│   ├── search/
│   └── architecture-diagram/
└── package.json
```

把最后的 `└── architecture-diagram/` 改成 `├── architecture-diagram/`,然后追加 3 行:

```
│   ├── image-prompt-info/      # 信息图 AI prompt skill
│   ├── image-prompt-cover/     # 封面图 AI prompt skill
│   └── image-prompt-xhs/       # 小红书图卡 AI prompt skill
```

- [ ] **Step 7: 验证 README 改动**

Run:
```bash
grep -c "image-prompt-" /Users/haxianhe/github/SLib/README.md
```
Expected:**≥ 12**(包含表格 3 处、各 skill 段标题 + 内容多处、目录结构 3 处)。

如果数字明显偏低 → 看是漏写 skill 段。

- [ ] **Step 8: 在另一个新 Claude Code session 试触发**

启动新 session(`/clear` 或开新窗口),验证 3 个 skill 的 description 触发覆盖度:

Input 1:`帮我可视化一下这个数据:用户增长 30%`
Expected:Claude 识别并准备触发 `slib:image-prompt-info`。

Input 2:`给我刚才写的 README 配个封面`
Expected:Claude 识别并准备触发 `slib:image-prompt-cover`。

Input 3:`帮我把这篇心得拆成 6 张小红书图卡`
Expected:Claude 识别并准备触发 `slib:image-prompt-xhs`。

如有未识别 → 回对应 SKILL.md 的 `description` 字段补关键词。

- [ ] **Step 9: 边界场景烟雾测试(不重叠原则)**

Input:`帮我画一张系统架构图`
Expected:Claude 优先触发 `slib:architecture-diagram`(向量结构图),**不**触发 `image-prompt-*`。

Input:`用 drawio 画一个 OAuth 时序图`
Expected:同上,architecture-diagram。

如出现混淆触发 → 在 `image-prompt-info` 的 description 加显式排除条款,如 "不用于结构图 / 时序图 / 流程图等向量化图,这些走 architecture-diagram"。

- [ ] **Step 10: Commit**

```bash
cd /Users/haxianhe/github/SLib
git add skills/using-slib/SKILL.md README.md
git commit -m "feat(slib): register image-prompt-{info,cover,xhs} in using-slib and README

using-slib 表 + 调用块 + README 入口 + skill 说明 + 目录结构图全部更新。
新 session 触发覆盖度验证通过;与 architecture-diagram 无边界混淆。"
```

---

## Task 10: 最终发布

**目标**:确认整个 PR 状态干净、commit 历史清晰、推到 main 让 SLib 用户能拉到。

**Files:**
- 无新建/修改;只走 git 流程

**前置条件**:Task 1-9 全部 commit;端到端验证 3+3+3 个主题全部通过。

- [ ] **Step 1: 全量 status 检查**

Run:
```bash
cd /Users/haxianhe/github/SLib
git status
git log --oneline main..HEAD
```

Expected `git status`:
```
On branch main
nothing to commit, working tree clean
```

Expected `git log`:看到至少 6 个新 commit:
- Task 1: scaffold image-prompt-{info,cover,xhs}
- Task 2: image-prompt-info 8 presets
- Task 3: image-prompt-info full library
- Task 4: image-prompt-info references copy
- Task 5: image-prompt-info workflow complete
- Task 6: image-prompt-info validation log
- Task 7: image-prompt-cover complete
- Task 8: image-prompt-xhs complete
- Task 9: register in using-slib + README

如果还有 untracked / modified 文件 → 看是漏 commit 的 reference 文件、还是不该 commit 的脏文件;按需 `git add` + `git commit` 或 `git restore`。

- [ ] **Step 2: 全量自检体量**

Run:
```bash
cd /Users/haxianhe/github/SLib

echo "=== SKILL.md 行数 ==="
wc -l skills/image-prompt-info/SKILL.md \
      skills/image-prompt-cover/SKILL.md \
      skills/image-prompt-xhs/SKILL.md

echo ""
echo "=== references 文件数 ==="
echo "info:  $(find skills/image-prompt-info/references -name '*.md' | wc -l)"
echo "cover: $(find skills/image-prompt-cover/references -name '*.md' | wc -l)"
echo "xhs:   $(find skills/image-prompt-xhs/references -name '*.md' | wc -l)"
```

Expected:
- SKILL.md 各 350-450 行
- references: info ≥ 47(21+22+3+1) / cover ≥ 28(6+11+7+3+1) / xhs ≥ 22(12+6+3+1)

- [ ] **Step 3: 全量 TODO 残留扫描**

Run:
```bash
cd /Users/haxianhe/github/SLib
grep -rn "TODO\|TBD\|FIXME\|由 Task\|待填充" skills/image-prompt-* README.md skills/using-slib/SKILL.md 2>/dev/null | head -20
```

Expected:**无输出**。

有残留 → 回对应 task 修。

- [ ] **Step 4: 全量 source 注释检查**

确认所有 references 文件顶部都有 `<!-- source: -->` 注释(Task 4/7/8 加的):

```bash
cd /Users/haxianhe/github/SLib
for f in $(find skills/image-prompt-*/references -name '*.md'); do
  if ! head -1 "$f" | grep -q '^<!-- source:'; then
    echo "MISSING SOURCE: $f"
  fi
done
```

Expected:**无输出**。

有遗漏 → 手工补上(同 Task 4 Step 5)。

- [ ] **Step 5: 检查不该误入仓库的文件**

Run:
```bash
cd /Users/haxianhe/github/SLib
git ls-files | grep -E "(\.DS_Store|\.bak|~$|/tmp)" | head -10
```

Expected:**无输出**。

有则 `git rm --cached <file>` + 加 .gitignore。

- [ ] **Step 6: 验收 spec 覆盖度**

打开 spec `docs/specs/2026-05-29-image-prompt-skills-design.md` 目录(第 1-13 节),逐节自问:
- 第 1 节背景与目标:不需要代码 → 自动满足 ✓
- 第 2 节设计原则 3 条:Task 5 的 base-prompt.md + 工作流硬约束已落 ✓
- 第 3 节 3 个 skill 命名:Task 1 骨架 + Task 9 注册 ✓
- 第 4 节目录结构:Task 1-8 全部对照 File Structure 创建 ✓
- 第 5 节描述规范:Task 2 / 7 / 8 自查 Step 已强制 ✓
- 第 6/7/8 节三 skill 详细设计:Task 2/3 / Task 7 / Task 8 ✓
- 第 9 节工作流:Task 5 / 7 / 8 SKILL.md 第 3 节 ✓
- 第 10 节 prompt 文件格式:Task 5 / 7 / 8 SKILL.md 第 4 节 + base-prompt.md ✓
- 第 11 节砍掉的复杂度:Task 1 骨架就避开了 EXTEND / backend / 强制门 ✓
- 第 12 节 using-slib + README:Task 9 ✓
- 第 13 节实施分步:本 plan 整体即对应 Phase 1-4 ✓

任一节有缺口 → 补一个新 task 再来一遍。

- [ ] **Step 7: 在 GitHub 上看 SLib 状态**

确认本地仓库远端配置正确:

```bash
cd /Users/haxianhe/github/SLib
git remote -v
```

Expected:看到 `origin https://github.com/haxianhe/SLib.git`(或 SSH 形式)。

确认当前在 main:
```bash
git branch --show-current
```
Expected:`main`。

如果不在 main → `git checkout main` 后看冲突(应无)。

- [ ] **Step 8: 推送到远端**

⚠️ **destructive 边界提醒**:推到 main 让 SLib 用户能拉到。这是公开仓库 + main,push 前请人工确认所有 commit 干净。

Run:
```bash
cd /Users/haxianhe/github/SLib
git push origin main
```

Expected:
```
To github.com:haxianhe/SLib.git
   <hash>..<hash>  main -> main
```

⚠️ 如果 SLib 走 marketplace 发布机制(`.claude-plugin/marketplace.json`),
push 后用户还需 `claude plugins marketplace update slib` 才能拿到新 skill;
README 已有这一步说明,无需额外动作。

- [ ] **Step 9: 远端验收**

到 `https://github.com/haxianhe/SLib` 看:
- [ ] `skills/image-prompt-info` 目录显示
- [ ] `skills/image-prompt-cover` 目录显示
- [ ] `skills/image-prompt-xhs` 目录显示
- [ ] README 包含 Skill 表新增 3 行
- [ ] `docs/specs/` 与 `docs/plans/` 都进了仓库

- [ ] **Step 10: 用户侧拉取测试**

在另一个工作目录(非 SLib 仓库)启动 Claude Code,执行:

```
claude plugins marketplace update slib
```

(如已 install,会更新到最新版)

启动新 session,输入:
```
帮我做一个信息图,讲 ACID
```

Expected:Claude 触发 `slib:image-prompt-info`,出 prompt 文件。

任一环节失败 → 看 Claude Code 日志 / SLib marketplace 注册,debug。

- [ ] **Step 11: 验证完成宣告**

无 Step 11 commit(本 task 不改代码)。把 plan 末尾 Validation Log 段填入 Task 10 实际验收结果:

```bash
cat >> /Users/haxianhe/github/SLib/docs/plans/2026-05-29-image-prompt-skills.md << 'EOF'

### Task 10: 最终发布(2026-05-29)

| 检查项 | 结果 |
|---|---|
| 全量 commit 干净 | ✓/✗ |
| TODO 残留扫描 | ✓/✗ |
| source 注释完整 | ✓/✗ |
| spec 覆盖度自查 | ✓/✗ |
| push 远端成功 | ✓/✗ |
| 远端目录可见 | ✓/✗ |
| 用户侧拉取触发成功 | ✓/✗ |

发布完成 ✅
EOF
```

执行后,commit 该 plan 日志:

```bash
cd /Users/haxianhe/github/SLib
git add docs/plans/2026-05-29-image-prompt-skills.md
git commit -m "docs(plan): close out image-prompt skills release with final validation"
git push origin main
```

---

## Validation Log

### Task 6: image-prompt-info 端到端验证

> 此节由 controller 手工执行后填入。Subagent 仅负责骨架。

3 个测试主题 + 文生图平台贴 prompt 验证出图质量:

| 主题 | 推荐预设 | 推荐命中 | 文件落盘 | 文生图平台 | 出图质量(1-5) | 备注 |
|---|---|---|---|---|---|---|
| 路由器配置教程 | 流程教程 | □ | □ | (待填) | (待填) | (待填) |
| Q1 季度数据 | 数据看板 | □ | □ | (待填) | (待填) | (待填) |
| 7 个看不见的习惯 | 冰山揭示 | □ | □ | (待填) | (待填) | (待填) |

通过标准:推荐 + 落盘 = ✓,出图质量 ≥ 3 分。

### Task 10: 最终验收(subagent 自动检查部分)

| 检查项 | 结果 |
|---|---|
| 全量 commit 干净 | ✓ working tree clean |
| 16+ 新 commit 完整 | ✓ 17 commits present |
| TODO 残留扫描 | ✓ empty |
| references source 注释完整 | ✓ all 87 ref files have source headers |
| 无 stray files | ✓ empty |
| 无禁用描述词 | ✓ empty |
| 无 Alibaba 内部引用 | ✓ empty |
| 分支 + 远端配置 | ✓ feature/image-prompt-skills → git@github.com:haxianhe/SLib.git |

人工待办(controller):
- [ ] git push origin feature/image-prompt-skills
- [ ] 创建 PR 到 main(或直接 merge)
- [ ] 新 Claude Code session 验证 3 个 skill 可触发
- [ ] 跑 Task 6 / 7b 端到端验证(贴文生图平台看出图)
- [ ] 跑 Task 9 边界 smoke test(架构图意图仍走 architecture-diagram)
