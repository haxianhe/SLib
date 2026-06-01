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
