# Changelog

## Unreleased

### Added

- `writing-review-briefs`：提纲式技术方案写作，支持脱敏复用；包含通用写作规则与虚构示例。

## 2.0.0

### Added

- Codex 原生 `.codex-plugin/plugin.json` 和 repo marketplace。
- 仅显式调用、写入前确认的 `knowledge-sync`。
- 每个 skill 的 Codex UI metadata 和调用策略。
- Node.js 静态契约测试、可审计 forward-test 证据与 CI。

### Changed

- Codex 与 Claude Code 共享平台中立工作流；`knowledge-sync` 使用最小的平台元数据覆盖层确保两端都仅显式调用。
- `summary` 支持安全的 HTTP(S) URL 获取，拒绝私网、元数据地址和不安全重定向，失败时请求粘贴正文。
- `search` 增加登录态披露、确认、SSRF 防护和访问控制停止条件。
- `architecture-diagram` 改为先保存并完整解析、校验 `.drawio`，再优先打开 diagrams.net。
- 图片 prompt 默认目录改为 `~/KnowledgeDB/image-prompts/`。
- `code-investigation` 明确为只读调查。

### Removed

- `afeaturemerge`。
- `learning`。
- `using-slib` 会话引导。
- SessionStart/PostToolUse hooks 和自动同步提示。

### Migration

旧的 `~/knowledge/` 内容不会自动迁移或删除。需要时手动复制到 `~/KnowledgeDB/`。
