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

完整描述见 `references/types.md`(单文件,按 `## <type>` 章节查阅)。

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
| 极客蓝图 | `conceptual` | `cool` | `digital` | `title-only` | `balanced` | `clean` |
| 温暖手绘 | `scene` | `warm` | `hand-drawn` | `title-only` | `subtle` | `handwritten` |
| 高对比海报 | `typography` | `vivid` | `screen-print` | `title-only` | `bold` | `display` |
| 极简文字 | `typography` | `mono` | `flat-vector` | `title-only` | `subtle` | `clean` |
| 暗色氛围 | `conceptual` | `dark` | `digital` | `title-only` | `balanced` | `serif` |
| 油画肖像 | `scene` | `warm` | `painterly` | `title-only` | `bold` | `serif` |

### 2.7 内容 → 预设推荐规则(Claude 自动用)

| 内容信号(关键词) | 默认推预设 |
|---|---|
| 含架构 / 系统 / 工程 / 协议 / 分布式 | 极客蓝图 |
| 个人叙事 / 复盘 / 我们的故事 / 日常 | 温暖手绘 |
| 观点文 / 锐评 / Newsletter 头条 / 行业批评 | 高对比海报 |
| 思考札记 / 一句话洞察 / 宣言式 | 极简文字 |
| AI / Sci-Fi / 深夜推送 / 神秘氛围 | 暗色氛围 |
| 人物访谈 / 传记 / 长篇文学 | 油画肖像 |
| 其他(默认) | 温暖手绘 |

## 3. 工作流

5 步固定流程,默认不弹确认门,需要调整就二次对话。

### Step 1: 接受输入

接受任意一种:
- 一段文章正文(或核心段落 / 摘要)
- 一个文章标题 + 一两句简介
- 一个本地文件路径
- 一句模糊主题(如「给这篇技术债的文章配个封面」)

如果用户给的是 URL,**不主动抓取**,提示用 `slib:summary` 先拉下来再回来。

### Step 2: 内容分析 + 推预设

按第 2.7 节「内容 → 预设推荐规则」秒选一个预设,在对话里说明:

```
我看到你的文章:《分布式系统的 CAP 定理》。
默认匹配预设:极客蓝图(conceptual + cool + digital)
理由:技术深度长文 + 系统/架构语义。

直接出?或者换:
- 暗色氛围(更有 Sci-Fi 感)
- 极简文字(纯文字海报,留白多)
```

未命中规则 → 给前 3 个最常用预设(温暖手绘 / 高对比海报 / 极简文字)让用户选。
不写 analysis.md 中间文件,在对话里直接说。

### Step 3: 拼 prompt 文件

按预设解析为 type + palette + rendering + text + mood + font + aspect,然后:

1. 读 `references/base-prompt.md` 拿模板骨架
2. 读 `references/types.md` 找到对应 type 章节
3. 读 `references/palettes/<palette>.md` 拿调色板
4. 读 `references/renderings/<rendering>.md` 拿渲染描述
5. 读 `references/dimensions/{text,mood,font}.md` 拿对应档位
6. 按 base-prompt.md 的拼装顺序生成 prompt 正文
7. 套用第 4 节「Prompt 文件格式」生成完整 .md

### Step 4: 落盘 + 终端展示

落到 `~/knowledge/image-prompts/{YYYY-MM-DD}-{slug}/prompt.md`。

`{slug}` 规则:从文章标题取 2-4 词 kebab-case;冲突时追加 `-HHMMSS`。

终端**完整展示** prompt 正文(包在代码块里方便复制)+ 输出文件路径。

### Step 5: 提示下一步

附上常见后续操作示例:

```
可贴到:Midjourney / 即梦 / 通义万象 / Nano Banana / Sora

要调整?试试:
- "换成 painterly rendering"
- "改成方图 1:1"
- "再出一版,用暗色氛围"
- "palette 换成 elegant"
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
skill: image-prompt-cover
preset: 极客蓝图              # 第 1 层预设名,自由组合时填 null
type: conceptual              # 第 2 层 type
palette: cool                 # 第 2 层 palette
rendering: digital            # 第 2 层 rendering
text: title-only              # 第 2 层 text
mood: balanced                # 第 2 层 mood
font: clean                   # 第 2 层 font
aspect: 16:9                  # 比例,封面默认 16:9
language: zh                  # 文字部分语言
created: 2026-05-29T10:30:00
source: |
  分布式系统的 CAP 定理:一致性 / 可用性 / 分区容忍性的三选二
---

# 分布式系统的 CAP 定理

## 摘要(给人看)

横版 16:9。深蓝纸底 + 白色细工程线,等距 2.5D 视角下三块刻有 C/A/P 的方碑悬浮交叠,
碑面带标尺刻度与数字坐标。左上角无衬线粗体标题「CAP 定理」,光感冷静,
中等对比,工程蓝图氛围。无人物。

## Prompt(给 AI)

```
{完整拼装后的 prompt 正文,主题段 → Type 段 → Palette 段 → Rendering 段 → Text 段 → Mood 段 → Font 段 → 比例段 → Constraints}
```

## 怎么用

- 推荐平台:Midjourney / 即梦 / 通义万象 / Nano Banana / Sora
- 复制上面 Prompt 块整段贴过去
- 如果平台支持 aspect 参数,单独设 `16:9`(竖版改 `9:16`,方图 `1:1`,电影画幅 `2.35:1`)
- 不满意 → 回到对话说「换 X 风格」或「调单个维度」重新出
````

详细模板与防御段见 `references/base-prompt.md`。

## 5. References 索引

第 3 层细节(完整视觉指令)按需读:

| 类型 | 路径 | 数量 |
|---|---|---|
| 拼装模板 | `references/base-prompt.md` | 1 |
| Type | `references/types.md`(单文件,baoyu 原文较简未拆分子文件) | 1 |
| Palette | `references/palettes/<name>.md` | 11 |
| Rendering | `references/renderings/<name>.md` | 7 |
| 维度 | `references/dimensions/{text,mood,font}.md` | 3 |

工作流 Step 3 拼 prompt 时按预设映射(2.6)挨个读对应文件。

> ⚠️ references/ 目录的 types / palettes / renderings / dimensions markdown 文件
> 从 baoyu-skills 项目 baoyu-cover-image 原文搬运,顶部含 `<!-- source: ... -->` 注释。
> 如需更新,与 https://github.com/JimLiu/baoyu-skills 主分支 diff 同名文件。
