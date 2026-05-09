# SLib

个人 Claude Code Skill 库，提供开箱即用的工作流 skill，安装后自动注入到 Claude Code 会话中。

## 包含 Skill

| Skill | 适用场景 |
|-------|---------|
| [`afeaturemerge`](#afeaturemerge) | 参考竞品 / 开源项目的功能，规划在自己系统中的实现方案 |
| [`learning`](#learning) | 系统学习一门新技术，生成学习路径与实践项目 |
| [`summary`](#summary) | 抓取链接内容，提炼总结并写入本地知识库 |
| [`search`](#search) | 多层降级检索，自动应对企业防火墙阻断外网访问的问题 |

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

**触发条件**：

- "我想学 X"、"帮我学 X"、"怎么学 X"
- "X 的学习路径是什么"
- "X 和我已经会的 Y 有什么关系"

**用法示例**：

```
用户：我想学 Rust，我有 Java 背景
用户：帮我系统学习 RAG，我了解基础的 LLM 调用
用户：我想学 Kubernetes，从运维角度切入
```

**执行流程**：收集信息 → 技术定位分析 → 知识树 → 调用 `search` 搜索最新资源 → 实践项目设计 → 调用 `summary` 保存学习计划到 `~/knowledge/`

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

**执行流程**：WebSearch → WebFetch → curl → chrome-mcp，依次降级直到获得有效内容

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
│   └── run-hook.cmd        # 跨平台 hook 入口
├── skills/
│   ├── using-slib/         # 会话引导文件（自动注入）
│   ├── afeaturemerge/      # 竞品功能分析 skill
│   │   └── hooks/          # PostToolUse hook
│   ├── learning/           # 技术学习 skill
│   ├── summary/            # 文章总结 skill
│   └── search/             # 多层降级检索 skill
└── package.json
```

---

## License

MIT
