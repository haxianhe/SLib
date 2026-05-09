---
name: using-slib
description: SLib 引导文件，在会话开始时注入。列出所有可用 skill 及触发条件，说明如何通过 Skill 工具按需加载。
---

<SUBAGENT-STOP>
若你是以 subagent 身份被派发执行特定任务，跳过此文件。
</SUBAGENT-STOP>

# SLib 可用 Skill

以下 skill 在触发条件匹配时，**在任何响应或操作之前**通过 `Skill` 工具加载：

| Skill | 触发条件 |
|-------|---------|
| `slib:afeaturemerge` | 用户说"参考 X 的 Y 功能在我们系统实现"、"对标 / 借鉴 / 调研 X"、想在项目中加某功能但不知道参考谁 |
| `slib:learning` | 用户说"我想学 X"、"怎么学 X"、"X 的学习路径"、想了解某技术与已知技术的关系 |
| `slib:summary` | 用户粘贴 URL 要求总结/提炼/保存、说"帮我总结这篇"、"记录到知识库" |
| `slib:search` | 用户说"搜索/查找/检索 X"、需要获取信息时外网可能被防火墙拦截、WebSearch/WebFetch 调用失败后需降级到内网检索 |

---

## 指令优先级

1. **用户明确指令**（CLAUDE.md、直接要求）——最高优先级
2. **SLib skill**——覆盖默认行为
3. **默认系统行为**——最低优先级

用户说"不要用 skill X"时，遵从用户指令。

---

## 如何调用 Skill

**在 Claude Code 中**：使用 `Skill` 工具，skill 内容按需加载后直接遵照执行。不要用 Read 工具读取 skill 文件。

```
Skill({ skill: "slib:afeaturemerge" })
Skill({ skill: "slib:learning" })
Skill({ skill: "slib:summary" })
Skill({ skill: "slib:search" })
```

---

## 调用规则

触发条件匹配时，**在回复之前**调用 `Skill` 工具。若调用后发现 skill 与当前情境不符，可不使用。

**常见误判（遇到这些想法时停下来检查）**：

| 想法 | 现实 |
|------|------|
| "这只是个简单问题" | 先检查是否有匹配的 skill |
| "我先看看代码再说" | Skill 告诉你怎么看。先调用 |
| "我已经知道怎么做了" | 知道概念 ≠ 调用了 skill |
| "这个 skill 太重了" | 简单的事情会变复杂。先加载再判断 |
| "用户没提到 skill" | 用户说 WHAT，skill 说 HOW |
