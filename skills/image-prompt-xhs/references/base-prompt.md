<!-- base-prompt: image-prompt-xhs 的 prompt 拼装模板
     Step 3 工作流循环每张图时,读这个文件 + styles/<S>.md + layouts.md(对应 layout 段)+ palettes/<P>.md 后拼出该张图的 prompt 正文。
     与 info 的关键差别:xhs 一次产出 1-10 张系列,Style 与 Palette 全系列锁定,只允许 Layout 在 cover / body / outro 之间切换。 -->

# Base Prompt 模板(xhs 多图)

## 拼装顺序(单张)

按以下 8 段顺序拼接,每段独立,中间用空行分隔:

1. **系列定位段** — 一行说明本张在系列中的角色与序号(模板见下方),不要把序号文字「1/6」画进图里
2. **主题段** — 本张要表达的小标题或要点(从用户内容里抽出来的本张专属内容,1 段)
3. **风格段** — 从 `references/styles/<style>.md` 摘 Color Palette / Visual Elements / Typography 部分(全系列复用同一段)
4. **布局段** — 从 `references/layouts.md` 里对应 layout(`sparse` / `balanced` / `dense` / `list` / `comparison` / `flow`)的段落摘信息密度与排版要点
5. **调色板段** — 仅当用户/预设指定了 palette 时,从 `references/palettes/<palette>.md` 摘 Colors + Background;否则用 style 自带的 Color Palette(全系列复用)
6. **文字策略段** — language / 字号 / 字体感(下方模板,与 info 共享同一张字体感对应表)
7. **比例段** — 一行:`Aspect ratio: 3:4`(xhs 全系列锁 3:4 竖版)
8. **通用防御段** — 下方 Constraints 部分原样拼接(含 xhs 专用约束)

## 系列定位段模板

每张图开头一行:

```
Series context: card {series_index} of {series_total}, role = {series_role}.
Do not render any series number / pagination / "1/6" / page indicator inside the image.
```

`{series_role}` 取值:

| role | 用在 | 对应 layout |
|---|---|---|
| `cover` | 第 1 张 | `sparse` |
| `body` | 中间 N-2 张 | 预设映射的 layout(默认 `balanced`) |
| `outro` | 最后 1 张(2 张以上才有) | `sparse` |

> 1 张时只有 `cover`;2 张时 `cover` + `outro`;3 张及以上 `cover` + N-2 个 `body` + `outro`。

## 文字策略段模板

```
Text rendering:
- Render any text in {language} only; no garbled / mojibake / placeholder text
- Use {font_hint} style; keep labels concise (keywords, not paragraphs)
- Cover (series_role = cover): one oversized hook line + optional small subline; ≤ 12 chars per line for zh
- Body: medium title at top + 3-7 short bullets / cards; never paragraphs
- Outro: one closing line (call to action / takeaway) + optional small subline
- Generous whitespace; do not overlap text with key visual elements
```

`{font_hint}` 按 style 名查(沿用 info 同款对应表,xhs 12 个 style 已覆盖):

| 字体感 | 适用 style 名 |
|---|---|
| `hand-lettered / handwritten` | `cute` / `chalkboard` / `sketch-notes` / `study-notes` |
| `clean sans-serif` | `fresh` / `minimal` / `notion` |
| `warm hand-lettered serif` | `warm` |
| `bold display / posterized` | `bold` / `pop` / `screen-print` |
| `vintage serif` | `retro` |

Style 命中表里第一个匹配行即用对应字体感;未来新增 style 默认 `clean sans-serif`。

## 通用防御段(Constraints,所有 xhs prompt 都加)

```
Constraints:
- Render any text in the language specified above; no garbled / mojibake / placeholder text
- No watermark, no signature, no website URL, no app logo in the image
- Composition is 3:4 vertical; do not crop key elements; safe margin 6% on all sides
- Multi-image series consistency: this card MUST share the exact same visual style, color palette, character design and texture as the rest of the series; only the layout density and the text content may differ
- Cover (role = cover) and outro (role = outro) MUST use sparse layout with 60%+ whitespace; do not overload them with bullets
- Body cards MUST keep the same character / icon style across the series
- Stay within the specified color palette hex values; no out-of-palette hues
- Do not invent numbers / statistics / quotes not present in the topic content
- Do not render any pagination indicator ("1/6", "page 2", "P3") inside the image
```

## 多图循环规则

Step 3 工作流按 SKILL.md § 2.4 模板拿到本次任务的 layout 序列后,**循环每张图**执行下面流程:

1. 锁定 3 个共享值:`style`、`palette`、`aspect=3:4`(全系列同值,不能换)
2. 本张取一个 `(series_index, series_total, series_role, layout)` 四元组:
   - 第 1 张 → `cover` + `sparse`
   - 最后 1 张(总数≥2) → `outro` + `sparse`
   - 其余 → `body` + 预设映射的 layout
3. 按本文件 § 拼装顺序拼出本张的 prompt 正文
4. 套 SKILL.md § 4.2 的单张文件结构,生成 `{NN}-{slug}.md`(NN = `series_index` 左补 0 到 2 位)
5. `style` / `palette` 段的文本对每张图一字不差(保证 AI 生成视觉一致);只有「系列定位段 / 主题段 / 布局段」会随张变化
6. 系列里任何一张如果用户单独要求调整,只改本张的 layout 或主题段,**不要改 style / palette**;若用户要求换风格,整个系列重生

## 输出 prompt 文件结构

参见 SKILL.md § 4.2「单张 prompt 文件结构」。本文件只负责「Prompt(给 AI)」代码块里的拼装内容;文件 frontmatter / 摘要 / 怎么用三段由工作流另行生成。

最小骨架(供工作流参考):

````markdown
---
skill: image-prompt-xhs
preset: {预设名 or null}
style: {style}            # 全系列锁定
layout: {本张 layout}
palette: {palette or null}  # 全系列锁定
aspect: 3:4               # 全系列锁定
language: {zh / en / ...}
series_index: {1..N}
series_total: {N}
series_role: {cover / body / outro}
created: {ISO 时间戳}
source: |
  {用户内容摘要,1-3 行}
---

# 第 {N} 张:{本张小标题}

## 摘要(给人看)

{用「看起来像」模板 1-2 句:本张画出来是什么样}

## Prompt(给 AI)

```
[按本文件 § 拼装顺序拼出的 8 段正文,空行分隔]
```

## 怎么用

- 推荐平台:Midjourney / 即梦 / 通义万象 / Nano Banana / Sora
- 复制上面 Prompt 块整段贴过去
- aspect 设 `3:4`(xhs 竖版)
- N 张图按 01-NN 顺序一张张生成,style/palette 保持一致
- 不满意 → 回到对话说「第 X 张改 Y」
````
