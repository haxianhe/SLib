# SLib

SLib 2.0 是一组同时支持 Codex 与 Claude Code 的知识工作流 skills。核心能力不捆绑 MCP、浏览器扩展或特定知识平台；可选能力不可用时会给出明确降级路径。

## Skills

| Skill | 用途 | 默认副作用 |
|---|---|---|
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
| 文生图 API | 否 | 始终只输出 prompt |
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
│   ├── architecture-diagram/
│   ├── code-investigation/
│   ├── image-prompt-cover/
│   ├── image-prompt-info/
│   ├── image-prompt-xhs/
│   ├── knowledge-sync/
│   ├── search/
│   └── summary/
└── tests/
```

`knowledge-sync` 的正文工作流在两个平台保持一致，但显式调用开关属于平台专属元数据：Codex 使用 `agents/openai.yaml`，Claude Code 使用 `claude-skills/` 覆盖层。测试会验证两个平台最终都只暴露 8 个 skill。

## License

MIT
