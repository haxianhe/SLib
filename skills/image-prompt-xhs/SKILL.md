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

| 预设 | 看起来像 | 用在哪 | 预览 |
|---|---|---|---|
| **可爱知识卡** | 米奶油底 + 圆角卡 + 樱花粉/薄荷绿/雾蓝 + Q 版小人 + 圆头手写体 | 萌系科普、健康知识、亲子分享 | ![](https://github.com/JimLiu/baoyu-skills/raw/main/screenshots/xhs-images-styles/cute.webp) |
| **清新生活流** | 莫兰迪绿 + 暖米黄底 + 极细线 + 大面积留白 + 嫩芽/咖啡 icon | 早 c 晚 a、日常 vlog、生活仪式感 | ![](https://github.com/JimLiu/baoyu-skills/raw/main/screenshots/xhs-images-styles/fresh.webp) |
| **暖光叙事** | 暖橙 + 蜜桃 + 暖棕,胶片颗粒感 + 居家光晕 | 妈妈故事、好物长测、暖心案例 | ![](https://github.com/JimLiu/baoyu-skills/raw/main/screenshots/xhs-images-styles/warm.webp) |
| **干货知识小抄** | 粉色背景 + 黑色粗框 + 序号大字 + 密排短句 | "8 个高效率小工具"、读书笔记 | ![](https://github.com/JimLiu/baoyu-skills/raw/main/screenshots/xhs-images-layouts/dense.webp) |
| **故事封面** | 1 个大主图 + 顶部短金句 + 底部小副标,留白 60% | 个人故事开篇、长文 1.0 封面 | ![](https://github.com/JimLiu/baoyu-skills/raw/main/screenshots/xhs-images-layouts/sparse.webp) |
| **前后对比** | 上下/左右两半,左灰/右彩,各 1 张图 + 标签 | 减肥前后、改造对比、产品测评 | ![](https://github.com/JimLiu/baoyu-skills/raw/main/screenshots/xhs-images-layouts/comparison.webp) |

预设映射(用了哪些 style + layout + palette)见第 2.5 节。

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
| `retro` | 70s/80s 色,芥末黄/砖红 + 复古杂志排版 | 怀旧、复古产品、老派书摘 |
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

完整描述见 `references/layouts.md`(单文件,baoyu 原文集中在 canvas.md)。

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
3. 读 `references/layouts.md` 中对应 layout 段落拿密度描述
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

## 5. References 索引

| 类型 | 路径 | 数量 |
|---|---|---|
| 拼装模板 | `references/base-prompt.md` | 1 |
| Style | `references/styles/<name>.md` | 12 |
| Layout | `references/layouts.md`(单文件,baoyu 原文集中在 canvas.md) | 1 |
| Palette | `references/palettes/<name>.md` | 3 |

> ⚠️ references/ 内容从 baoyu-xhs-images 项目搬运,顶部含 source 注释。
> 命名差异:baoyu 把 12 个风格放在 presets/ 目录,我们语义上等同 styles/。
> 更新参照:https://github.com/JimLiu/baoyu-skills/tree/main/skills/baoyu-xhs-images
