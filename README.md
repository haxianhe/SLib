# SLib

个人 Claude Code Skill 库，提供开箱即用的工作流 skill，安装后自动注入到 Claude Code 会话中。

## 包含 Skill

| Skill | 适用场景 |
|-------|---------|
| [`afeaturemerge`](#afeaturemerge) | 参考竞品 / 开源项目的功能，规划在自己系统中的实现方案 |
| [`learning`](#learning) | 用 5W1H 六维度（What/Why/Who/When/Where/How）解构一个技术或概念 |
| [`summary`](#summary) | 抓取链接内容，提炼总结并写入本地知识库 |
| [`search`](#search) | 多层降级检索，自动应对企业防火墙阻断外网访问的问题 |
| [`architecture-diagram`](#architecture-diagram) | 专业图表绘制，覆盖 drawio / mermaid / PlantUML 三种格式 |

---

## 安装

**前置依赖**：[Claude Code](https://claude.ai/code)

```bash
claude plugins marketplace add haxianhe/SLib
claude plugins install slib
```

安装完成后**重启 Claude Code** 即可生效。

---

## Skill 说明

### afeaturemerge

**触发条件**：

- "参考 X 系统的 Y 功能，在我们系统里实现"
- "调研 X 是怎么做 Y 的，给出实现方案"
- "我想加类似 X 的功能"
- 提到"对标"、"借鉴"、"参考"某个系统并希望落地

**用法示例**：

```
用户：参考 Cursor 的 Rules for AI 功能，在我们的 AI 管理平台里实现类似的 Prompt 模板管理
用户：调研 LangGraph 的 checkpoint 机制，给出我们对话服务的状态持久化方案
```

**执行流程**：收集信息 → 确认理解 → 调用 `search`（多层降级）调研参考系统 → 分析自身现状 → 产出需求文档与技术方案

---

### learning

**定位**：用 **5W1H 六维度**（What / Why / Who / When / Where / How）把一个技术或概念彻底拆开看清楚——不是学习路径规划，而是概念深度解构。

**触发条件**：

- "我想理解 X"、"5W1H 解读 X"、"帮我把 X 讲清楚"
- "X 是什么 / 为什么有 X / X 怎么用" 并希望得到系统性回答
- 粘贴一篇文章/文档 URL，希望用 5W1H 维度提炼
- 想全面把握一个陌生概念的本质、动机、边界与机制

**用法示例**：

```
用户：5W1H 解读 CRDT
用户：帮我把 Raft 协议讲清楚，我了解 Paxos
用户：https://example.com/event-sourcing 用 5W1H 提炼一下
```

**六个维度**：

| 维度 | 回答什么 |
|---|---|
| 🎯 What | 本质、一句话定义、关键术语 |
| 💡 Why | 原本怎么做、为什么不够、它怎么破局 |
| 👥 Who | 起源、采用者、社区与生态、谁不该用 |
| 📅 When | 历史脉络、什么时候该选、什么时候不该选 |
| 🗺️ Where | 部署位置、适用场景、边界、与相邻方案对比 |
| 🔧 How | 核心机制、最短上手路径、常见坑、进阶方向 |

**执行流程**：识别输入（概念名 / URL）→ URL 时先抓取 → 摘要确认 → 6 维解构 → 询问是否落盘 → 选"保存"时调用 `summary` 内联模式写入 `~/knowledge/`

---

### summary

**触发条件**：

- 粘贴 URL 并说"帮我总结"、"提炼一下"、"保存到知识库"
- "帮我总结这篇文章"
- "记录一下这篇"

**用法示例**：

```
用户：https://example.com/article 帮我总结
用户：帮我提炼这篇文章的核心观点，关注架构设计部分：https://example.com/design
```

**执行流程**：抓取内容（chrome-mcp → WebFetch → 用户粘贴）→ 识别文章类型 → 按模板提炼 → 写入 `~/knowledge/YYYY-MM-DD-{标题}.md`

**支持的文章类型**：技术文章、产品/案例、通用

---

### search

**触发条件**：

- "帮我搜索 / 查一下 / 找一下 X"
- 技术问题、工具用法、行业信息等需要检索资料的场景
- "X 是什么"、"怎么做 X"、"有没有 X 相关资料"
- WebSearch / WebFetch 调用失败，需要切换检索方式
- 访问不了外网、被防火墙拦截、网络受限等情形

**用法示例**：

```
用户：帮我搜索 Rust async runtime 的原理
用户：查一下 Kubernetes HPA 的配置参数
用户：WebSearch 访问失败，帮我换个方式搜一下
```

**执行流程**：WebSearch → WebFetch → curl → agent-browser，依次降级直到获得有效内容

---

### architecture-diagram

**触发条件**：

- "画一个架构图 / 流程图 / 时序图 / 思维导图"
- "帮我画图"、"用 drawio / mermaid / plantuml 画"
- 描述系统结构、模块依赖、调用链路并希望可视化
- 提供既有图表想要修改或补充

**用法示例**：

```
用户：画一个电商订单系统的分层架构图
用户：用 mermaid 画一下用户登录的时序图
用户：帮我画一个 RAG 系统的数据流图，要正式一点
```

**执行流程**：需求分析 → 格式选择（drawio / mermaid / PlantUML）→ 结构设计 → 应用配色方案 → 调用 `mcp__drawio__open_drawio_xml` 或 `open_drawio_mermaid` 直接打开预览

**格式选择**：
- **drawio** — 复杂架构图、需要像素级控制、对外演示
- **mermaid** — 快速原型、Markdown 文档内嵌、版本控制友好
- **PlantUML** — UML 标准图（类图 / 时序图 / 用例图 / 活动图）

**配色规范**：内置流程图、架构图、状态图三套配色，以及 PlantUML 主题片段。复杂图（节点 > 10 或层级 > 3）或用户要求"画好看"时，会先确认结构与格式再动手。

---

## 目录结构

```
SLib/
├── .claude-plugin/
│   ├── plugin.json         # plugin 元数据
│   └── marketplace.json    # marketplace 声明
├── hooks/
│   ├── hooks.json          # hook 配置（SessionStart + PostToolUse）
│   ├── session-start       # 会话启动时注入 using-slib
│   ├── slib-sync.sh        # 通用 .md 写入云端同步提示 hook
│   └── run-hook.cmd        # 跨平台 hook 入口
├── skills/
│   ├── using-slib/         # 会话引导文件（自动注入）
│   ├── afeaturemerge/      # 竞品功能分析 skill
│   ├── learning/           # 技术学习 skill
│   ├── summary/            # 文章总结 skill
│   ├── search/             # 多层降级检索 skill
│   └── architecture-diagram/  # 专业图表绘制 skill
└── package.json
```

---

## License

MIT
