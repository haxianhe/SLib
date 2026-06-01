# SLib

个人 Claude Code Skill 库，提供开箱即用的工作流 skill，安装后自动注入到 Claude Code 会话中。

## 包含 Skill

| Skill | 适用场景 |
|-------|---------|
| [`afeaturemerge`](#afeaturemerge) | 参考竞品 / 开源项目的功能，规划在自己系统中的实现方案 |
| [`learning`](#learning) | 用 5W1H 六维度（What/Why/Who/When/Where/How）解构一个技术或概念 |
| [`summary`](#summary) | 抓取链接内容，提炼总结并写入本地知识库 |
| [`search`](#search) | 多层降级检索，自动应对企业防火墙阻断外网访问的问题 |
| [`architecture-diagram`](#architecture-diagram) | 专业图表绘制，输出 drawio 格式 |
| [`image-prompt-info`](#image-prompt-info)   | 信息图 AI 文生图 prompt(产 prompt 文件,自己拿去文生图平台出图) |
| [`image-prompt-cover`](#image-prompt-cover) | 文章封面图 AI 文生图 prompt |
| [`image-prompt-xhs`](#image-prompt-xhs)     | 小红书图卡 AI 文生图 prompt(多张系列,1-10 张) |

---

## 📌 新用户须知

第一次用前,先理清两件事,免得期望对不上:

- **三个 `image-prompt-*` skill 只产 prompt 文本,不直接出图**。产出物是 `prompt.md` 文件,需要你自己复制到 Midjourney / 即梦 / 通义万象 / Nano Banana 等任意文生图平台贴出来才能拿到图。SLib 不调任何文生图 API,也不会消耗任何 token 之外的费用。
- **`architecture-diagram` 是真出图**,通过 drawio MCP 直接打开预览,不要和上面三个混淆。
- **`search` 的 Layer 4 用到 `agent-browser`,这是可选依赖**。前 3 层(WebSearch / WebFetch / curl)都失败时才会降级到它,装了能突破企业防火墙抓更多页面。不装也能用,只是少一层兜底。安装方式见下方[可选依赖](#可选依赖agent-browser)。

---

## 安装

**前置依赖**：[Claude Code](https://claude.ai/code)

```bash
claude plugins marketplace add haxianhe/SLib
claude plugins install slib
```

安装完成后**重启 Claude Code** 即可生效。

### 可选依赖:agent-browser

仅 `search` skill 的 Layer 4 兜底使用。前 3 层都失败、或需要带登录态抓页面时才会调用。不装也能用。

```bash
# macOS
brew install agent-browser
agent-browser install     # 完成 Chromium 等运行时初始化

# 跨平台(任意有 Node.js 的环境)
npm install -g agent-browser
agent-browser install
```

验证安装:

```bash
agent-browser --version
```

更多用法见 [agent-browser.dev](https://agent-browser.dev/)。

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
- "帮我画图"、"用 drawio 画"
- 描述系统结构、模块依赖、调用链路并希望可视化
- 提供既有图表想要修改或补充

**用法示例**：

```
用户：画一个电商订单系统的分层架构图
用户：画一下用户登录的时序图
用户：帮我画一个 RAG 系统的数据流图，要正式一点
```

**执行流程**：需求分析 → 结构设计 → 应用配色方案 → 调用 `mcp__drawio__open_drawio_xml` 直接打开预览

**配色规范**：内置流程图、架构图、状态图三套配色。复杂图（节点 > 10 或层级 > 3）或用户要求"画好看"时，会先确认结构再动手。

---

### image-prompt-info

**定位**:把数据 / 教程 / 概念组织成视觉密度高的一张信息图,产出可直接复制的文生图 prompt 文件。**不调任何后端 API**。

**触发条件**:

- "画信息图 / 做信息卡 / 可视化数据"
- "高密度大图 / 知识卡片 / dataviz / infographic"
- 提供数据或教程内容并希望出一张视觉化图

**用法示例**:

```
用户:帮我做一个信息图,讲 5 个 Git 高频命令
用户:把 Q1 季度数据做成一张可视化图
```

**第 1 层精选预设(8 个)**:

| 预设 | 一句话 |
|---|---|
| 知识卡 | 米黄牛皮纸 + 手绘 + 马卡龙色块,亲和入门 |
| 复古高密度 | 1970s 波普 + Swiss 栅格,长图速查 |
| 流程教程 | 宜家说明书风,纯线稿步骤 |
| 数据看板 | 公司年报风,扁平矢量 + 数字大 |
| 赛博朋克 | 紫黑底 + 霓虹粉绿,AI 风 |
| 黑板手写 | 深绿黑板 + 粉笔字,课堂感 |
| A vs B 对比 | 左右两栏强对比 |
| 冰山揭示 | 上 1/8 表象 + 下 7/8 本质 |

**输出位置**:`~/knowledge/image-prompts/{date}-{slug}/prompt.md`

**完整 22 种 style × 21 种 layout × 3 种 palette** 见 `skills/image-prompt-info/SKILL.md` 第 2 节。

---

### image-prompt-cover

**定位**:给文章 / 博客 / Newsletter / 视频缩略图配主视觉,产出可直接复制的文生图 prompt 文件。**不调任何后端 API**。

**触发条件**:

- "做文章封面 / 封面图 / banner / cover / 配题图"
- 有文章 / 标题想配主视觉

**用法示例**:

```
用户:给这篇讲 CAP 定理的文章配个封面
用户:帮我做一个 Newsletter 头条 banner
```

**第 1 层精选预设(6 个)**:

| 预设 | 一句话 |
|---|---|
| 极客蓝图 | 深蓝纸底 + 白色细工程线,科技严谨 |
| 温暖手绘 | 暖米黄 + 手绘抖动线 + 简笔人物 |
| 高对比海报 | 浓黑/酒红/芒果黄 + 厚描边 + 大字标题 |
| 极简文字 | 白底,巨大无衬线标题居中,留白 70% |
| 暗色氛围 | 深紫黑底 + 渐变光晕 + 玻璃质感卡片 |
| 油画肖像 | 厚涂笔触 + 暖光 + 人物剪影 |

**输出位置**:`~/knowledge/image-prompts/{date}-{slug}/prompt.md`

**完整 6 type × 11 palette × 7 rendering** 见 `skills/image-prompt-cover/SKILL.md` 第 2 节。

> ⚠️ baoyu-cover-image 仓库未提供截图,预览暂空白。

---

### image-prompt-xhs

**定位**:把内容拆成 1-10 张图卡系列(竖版 3:4),适合小红书 / 公众号头条九宫格 / IG 故事。每张产出独立 prompt 文件。**不调任何后端 API**。

**触发条件**:

- "做小红书图 / 出图卡 / 社交多图 / xhs / 知识小抄"
- 想出分张的图卡系列(3 张 / 6 张 / 9 张等)

**用法示例**:

```
用户:做一组讲早睡早起的 6 张小红书图卡
用户:把这篇心得拆成 9 张图,九宫格预览
```

**第 1 层精选预设(6 个)**:

| 预设 | 一句话 |
|---|---|
| 可爱知识卡 | 米奶油底 + 圆角卡 + 樱花粉/薄荷绿 + Q 版小人 |
| 清新生活流 | 莫兰迪绿 + 极细线 + 大面积留白 |
| 暖光叙事 | 暖橙 + 蜜桃,胶片颗粒感 + 居家光晕 |
| 干货知识小抄 | 粉底 + 黑色粗框 + 序号大字 + 密排短句 |
| 故事封面 | 1 大主图 + 顶部短金句,留白 60% |
| 前后对比 | 上下/左右两半,左灰右彩 |

**输出位置**:`~/knowledge/image-prompts/{date}-{slug}/prompts/01-{slug}.md` ... `NN-{slug}.md`(多张)

**默认 6 张**,可调 1/3/6/9。**完整 12 style × 6 layout × 3 palette** 见 `skills/image-prompt-xhs/SKILL.md` 第 2 节。

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
│   ├── architecture-diagram/  # 专业图表绘制 skill
│   ├── image-prompt-info/      # 信息图 AI prompt skill
│   ├── image-prompt-cover/     # 封面图 AI prompt skill
│   └── image-prompt-xhs/       # 小红书图卡 AI prompt skill
└── package.json
```

---

## License

MIT
