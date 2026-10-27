# SLib

SLib 2.0 是一组同时支持 Codex 与 Claude Code 的知识工作流 skills。核心能力不捆绑 MCP、浏览器扩展或特定知识平台；可选能力不可用时会给出明确降级路径。

## Skills

| Skill | 用途 | 默认副作用 |
|---|---|---|
| `ai-manju` | AI 漫剧与影视短片：剧本、分镜、图片、视频与剪映交接 | 按请求生成本地素材；付费生成按授权范围执行 |
| `writing-review-briefs` | 提纲式技术方案写作，支持脱敏复用 | 默认只在对话中输出 |
| `summary` | 总结 URL 或正文，按确认路径保存 | 写入前确认 |
| `search` | 检索公开资料；受控使用登录态 | 登录态访问前确认 |
| `architecture-diagram` | 生成可编辑 `.drawio` 图表 | 先写文件，再打开在线编辑器 |
| `code-investigation` | 只读梳理代码分布、调用链和配置 | 无代码修改 |
| `knowledge-sync` | 把 Markdown 同步到已连接文档服务 | 仅显式调用，外部写入前确认 |
| `image-prompt-info` | 生成信息图文生图 prompt | 只写 prompt，不出图 |
| `image-prompt-cover` | 生成封面文生图 prompt | 只写 prompt，不出图 |
| `image-prompt-xhs` | 生成 1–10 张社交图卡 prompts | 只写 prompt，不出图 |

## 安装

### Codex

```bash
codex plugin marketplace add haxianhe/SLib
codex plugin add slib@slib
```

安装后开启新会话。除 `knowledge-sync` 外可自然描述任务，也可显式使用 `$slib:summary`、`$slib:search` 等 skill。`knowledge-sync` 仅允许显式调用：`$slib:knowledge-sync`。

升级：

```bash
codex plugin marketplace upgrade slib
codex plugin add slib@slib
```

卸载：

```bash
codex plugin remove slib@slib
codex plugin marketplace remove slib
```

### Claude Code

```bash
claude plugin marketplace add haxianhe/SLib
claude plugin install slib@slib
```

安装后开启新会话。除 `knowledge-sync` 外可自然描述任务，也可显式使用 `/slib:summary`、`/slib:search` 等 skill。`knowledge-sync` 仅允许显式调用：`/slib:knowledge-sync`。

升级或卸载：

```bash
claude plugin update slib@slib
claude plugin uninstall slib@slib
```

## 使用说明

### 提纲式技术方案写作

```text
Codex: $slib:writing-review-briefs 将以下材料改写为技术评审方案，注意脱敏。
Claude Code: /slib:writing-review-briefs 将以下材料改写为技术评审方案，注意脱敏。
```

按领域编号，以加粗短标签组织主体、机制与约束，准确保留已实现、计划中和待确认状态。默认输出 Markdown；脱敏时移除内部专名、链接和唯一标识，同时保留责任关系与技术限制。技能及示例不包含参考原文或内部资料，无外部服务依赖。

### URL 总结

```text
总结这篇文章并保存到知识库：https://example.com/article
```

`summary` 使用当前平台已有的网页读取能力。遇到登录墙、访问控制或网络失败时会请你粘贴正文，不会依据标题编造内容。默认保存到：

```text
~/KnowledgeDB/raw/YYYY-MM-DD-{slug}.md
```

### 安全检索

```text
检索 Kubernetes HPA 当前官方配置，并给出来源。
```

公开查询优先官方与一手来源。内部或登录态查询不会把关键词发送到公开搜索引擎；使用浏览器身份前会确认域名、账号范围和读取内容。`401/403`、付费墙和组织策略不会被当成需要绕过的障碍。

### Draw.io 图表

```text
画一个订单系统分层架构图，输出 Draw.io。
```

`architecture-diagram` 始终先生成并验证 `.drawio`，再优先打开：

<https://app.diagrams.net/?lang=zh&mode=device>

在线编辑器不会自动读取本地文件。选择“从设备打开”，或把 `.drawio` 拖到空白画布。浏览器、Draw.io MCP 或桌面应用均不是硬依赖；预览失败不影响文件交付。

### 显式知识同步

```text
Codex: $slib:knowledge-sync 把 notes/design.md 同步到我已连接的文档服务。
Claude Code: /slib:knowledge-sync 把 notes/design.md 同步到我已连接的文档服务。
```

`knowledge-sync` 仅在用户显式调用时运行，不会被模型自动触发，也不会擅自选择平台。它会展示连接器、目标位置、创建/更新方式、可见范围和内容预览；得到明确确认并核验连接器返回结果后才报告成功。

### AI 漫剧与影视短片

```text
Codex: $slib:ai-manju 用 Codex、即梦和剪映制作一部 60 秒 2D 漫剧，先交付剧本、角色设定和分镜提示词。
Claude Code: /slib:ai-manju 根据已有角色图制作分镜与即梦视频提示词，整理剪映素材交接包。
```

默认按五步推进：**剧本与分镜 → 角色与分镜画面 → 图生视频 → 配音与音效 → 剪辑成片**，每步检查真实交付物与下一步依赖。人物定妆图不代替逐镜分镜图，提示词不等于图片，只有任务受理也不等于已有视频。音乐／对唱先落实主歌曲，再按实际音频锁定分镜图和动态节奏，仍保留画面制作阶段。

按稳定镜头编号组织已选参考图、分镜图、两类提示词、候选视频和声音。可用图片生成工具且在授权范围内时完成实际出图；未接入工具时交付提示词并标明未生成。视频接入核验尊重用户选定入口，区分即梦界面、同源 API 与方舟服务；会员或密钥不等于生成授权。剪映草稿写入、打开、素材加载及成片导出分别验证。

### 图片 prompt

三个 `image-prompt-*` skill 只生成 Markdown prompt，不调用文生图 API。默认目录：

```text
~/KnowledgeDB/image-prompts/
```

把生成的 Prompt 复制到你选择的文生图平台即可。

## 依赖与降级

| 能力 | 核心是否依赖 | 不可用时 |
|---|---|---|
| MCP server | 否 | 使用平台原生工具或返回手动步骤 |
| 浏览器 | 否 | 返回 URL、文件和导入指引 |
| 文档连接器 | 仅 `knowledge-sync` 需要 | 不写入，提示先连接服务 |
| 图片 / 视频生成工具 | `ai-manju` 实际生成素材时需要 | 交付提示词与镜头清单，标明未生成；`image-prompt-*` 仍只产 prompt |
| Node.js | 仅仓库开发测试需要 | 不影响已安装 skills |

## 从 1.x 升级

2.0 包含破坏性变更：

- 移除 `afeaturemerge`、`learning` 和会话引导 `using-slib`。
- 移除 SessionStart/PostToolUse hooks，不再自动注入或提示同步。
- 云文档同步改为仅显式调用的 `knowledge-sync`。
- 图片 prompt 路径从 `~/knowledge/image-prompts/` 改为 `~/KnowledgeDB/image-prompts/`。

旧目录不会自动迁移或删除。需要保留历史产物时，请自行复制到新目录。

## 开发与验证

```bash
npm test
python3 /path/to/plugin-creator/scripts/validate_plugin.py .
claude plugin validate .
```

最后一条仅在本机已安装 Claude Code CLI 时运行。

## 目录

```text
SLib/
├── .agents/plugins/marketplace.json
├── .codex-plugin/plugin.json
├── .claude-plugin/
├── claude-skills/knowledge-sync/  # Claude 显式调用覆盖层
├── skills/
│   ├── ai-manju/
│   ├── architecture-diagram/
│   ├── code-investigation/
│   ├── image-prompt-cover/
│   ├── image-prompt-info/
│   ├── image-prompt-xhs/
│   ├── knowledge-sync/
│   ├── search/
│   ├── summary/
│   └── writing-review-briefs/
└── tests/
```

`knowledge-sync` 的正文工作流在两个平台保持一致，但显式调用开关属于平台专属元数据：Codex 使用 `agents/openai.yaml`，Claude Code 使用 `claude-skills/` 覆盖层。测试会验证两个平台最终都只暴露 10 个 skill。

## License

MIT
