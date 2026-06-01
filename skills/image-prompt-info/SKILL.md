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

不知道选啥?默认按下表选最近 1 项。Claude 会按你内容里出现的关键词自动推。

| 预设 | 看起来像 | 用在哪 | 预览 |
|---|---|---|---|
| **知识卡** | 米黄牛皮纸底 + 手绘格子分区 + 马卡龙色块(粉/蓝/绿/桃)+ 黑色手写体标题 + 简笔图标 | 给小学生讲分数的概念入门、5 分钟看懂 OAuth | ![](https://github.com/JimLiu/baoyu-skills/raw/main/screenshots/infographic-styles/craft-handmade.webp) |
| **复古高密度** | 1970s 波普海报风,粗黑描边 + 番茄红/芥末黄/孔雀蓝大色块,Swiss 栅格,长图竖版 | 一图讲完"15 个 Git 高频命令"、Vim 速查表 | —(baoyu 无 dense-modules 截图) |
| **流程教程** | 宜家说明书风,纯黑线稿无填色,数字步骤圈 + 极简箭头 + 几何小人 | 手把手装显卡、配置家庭路由器 | ![](https://github.com/JimLiu/baoyu-skills/raw/main/screenshots/infographic-styles/ikea-manual.webp) |
| **数据看板** | 公司年报风,白底网格 + 折线/柱状图 + 大数字 + 扁平 icon + 莫兰迪冷色调 | 季度销售看板、A/B 测试结果汇报 | ![](https://github.com/JimLiu/baoyu-skills/raw/main/screenshots/infographic-styles/corporate-memphis.webp) |
| **赛博朋克** | 紫黑底 + 霓虹粉绿发光线条 + 故障字效 + 电路纹 + 全息感 | AI 工具新品发布封面、黑客松宣传 | ![](https://github.com/JimLiu/baoyu-skills/raw/main/screenshots/infographic-styles/cyberpunk-neon.webp) |
| **黑板手写** | 深绿黑板底 + 白/黄/粉粉笔字 + 简笔画 + 板擦痕迹 + 课程编号圈 | 读书会分享、家长讲数学题 | ![](https://github.com/JimLiu/baoyu-skills/raw/main/screenshots/infographic-styles/chalkboard.webp) |
| **A vs B 对比** | 左右两栏强对比,中间分隔线,左暖红/右冷青,各自图标 + bullet list | iPhone vs 安卓选购、Vue vs React 对比 | ![](https://github.com/JimLiu/baoyu-skills/raw/main/screenshots/infographic-layouts/comparison-table.webp) |
| **冰山揭示** | 横向海平面,上 1/8 露出冰山尖(表象),下 7/8 巨大冰体(本质),冷蓝水彩感 | 揭示成功背后的努力、技术栈底层原理 | ![](https://github.com/JimLiu/baoyu-skills/raw/main/screenshots/infographic-layouts/iceberg.webp) |

每个预设内部对应 layout + style + palette 组合见第 2 节(完整库)末尾的「预设映射表」。

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
| `morandi-journal` | 莫兰迪色 + 灰粉/雾蓝/茶绿 + 手账涂鸦 | 生活方式 long-form、书摘配图、读书笔记 |
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
