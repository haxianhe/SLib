<!-- base-prompt: image-prompt-cover 的 prompt 拼装模板
     Step 3 工作流读这个文件 + types.md + palettes/<P>.md + renderings/<R>.md + dimensions/{text,mood,font}.md 后拼出 prompt 正文 -->

# Base Prompt 模板(Cover)

## 拼装顺序

按以下顺序拼接,每段独立,中间用空行分隔:

1. **主题段** — 用户提供的文章主题 / 核心观点 / 关键词(1 段,中英文均可)
2. **Type 段** — 从 `references/types.md` 摘对应 type 的 Description + Composition Guidelines
3. **Palette 段** — 从 `references/palettes/<palette>.md` 摘 Colors + Background hex 值
4. **Rendering 段** — 从 `references/renderings/<rendering>.md` 摘 Visual Treatment / Texture / Line / Shading 部分
5. **Text 段** — 从 `references/dimensions/text.md` 选定文字处理策略(title-overlay / minimal / no-text 等)
6. **Mood 段** — 从 `references/dimensions/mood.md` 选定情绪基调(calm / energetic / mysterious / playful 等)
7. **Font 段** — 从 `references/dimensions/font.md` 选字体感(仅当 type 含文字时拼接)
8. **比例段** — 一行:`Aspect ratio: {aspect}` (cinematic 2.35:1 / widescreen 16:9 / square 1:1)
9. **通用防御段** — 下方 Constraints 部分原样拼接

## 通用防御段(Constraints,所有 cover prompt 都加)

```
Constraints:
- Render any text in the language specified above; no garbled / mojibake / placeholder text
- No watermark, no signature, no website URL, no QR code in the image
- Composition must match the described aspect; do not crop key elements; title (if any) must stay within safe area
- Style must stay consistent with the specified rendering; do not mix realistic photography unless explicitly requested
- Stay within the specified color palette hex values; no out-of-palette hues
- If type = scene/metaphor and the composition contains people: use simplified stylized silhouettes or minimal facial features; avoid photorealistic faces, do not depict specific real persons
- Do not invent text content beyond the title/keywords provided in the topic
- Keep visual elements aligned with the cover's mood; avoid clashing tone (e.g., no playful elements in a mysterious mood)
```

## 输出 prompt 文件结构

````
---
skill: image-prompt-cover
preset: {预设名 or null}
type: {hero / conceptual / typography / metaphor / scene / minimal}
palette: {warm / elegant / cool / dark / earth / vivid / pastel / mono / retro / duotone / macaron}
rendering: {flat-vector / hand-drawn / painterly / digital / pixel / chalk / screen-print}
text: {title-overlay / minimal / no-text / ...}
mood: {calm / energetic / mysterious / playful / ...}
font: {hand-lettered / vintage-serif / clean-sans / bold-display / ...}
aspect: {2.35:1 / 16:9 / 1:1}
language: {zh / en / ...}
created: {ISO 时间戳}
source: |
  {文章主题 / 核心观点摘要,1-3 行}
---

# {文章标题}

## 摘要(给人看)

{用「看起来像」模板 1 段:封面画出来是什么样的画面}

## Prompt(给 AI)

```
[完整拼装后的 prompt,主题段→Type→Palette→Rendering→Text→Mood→Font→比例→Constraints,空行分隔]
```

## 怎么用

- 推荐平台:Midjourney / 即梦 / 通义万象 / Nano Banana / Sora
- 复制上面 Prompt 块整段贴过去
- 如果平台支持 aspect 参数,单独设 `{aspect}`
- 封面发布前确认:无水印、文字无乱码、画面在安全区
- 不满意 → 回到对话说「换 X type / palette / rendering」重新出
````
