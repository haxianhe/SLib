---
name: architecture-diagram
description: |
  专业图表绘制助手，覆盖架构图、流程图、时序图、类图、思维导图等场景，输出 drawio / mermaid / PlantUML 三种格式。触发条件：
  - 用户说"画一个架构图 / 流程图 / 时序图 / 思维导图"、"帮我画图"、"用 drawio / mermaid / plantuml 画"
  - 用户描述系统结构、流程步骤、模块依赖、调用链路并希望可视化
  - 用户提供既有图表想要修改或补充
  - 即使用户没说"画图"，只要意图是把结构 / 流程 / 关系可视化呈现，也应触发
---

# architecture-diagram：专业图表绘制助手

把用户脑中的结构、流程、关系翻译成专业、可读、风格一致的图表。

不只是"画一张图"——而是让图表准确传达信息、便于后续维护，并在需要时利用 `mcp__drawio__*` 工具直接打开预览。

---

## 工作流(五步)

```
需求分析 → 格式选择 → 结构设计 → 样式应用 → 输出/打开
```

### Step 1：需求分析

先吃透用户描述：

| 维度 | 关注点 |
|------|--------|
| **图表类型** | 流程图 / 架构图 / 时序图 / 类图 / 用例图 / 部署图 / 思维导图 / 网络拓扑 |
| **核心元素** | 节点(组件 / 步骤 / 角色)、连线(调用 / 依赖 / 数据流)、分组(分层 / 子系统) |
| **复杂度** | 节点数、层级深度、是否含决策 / 并行 / 循环 |
| **使用场景** | 演示 / 文档 / 评审 / 头脑风暴 |
| **目标受众** | 技术同事 / 产品 / 高管 / 外部 |

**复杂度判断**：节点 > 10 个、层级 > 3 层、或用户明确说"要画好看"/"要正式"时，进入 **确认门**(见末尾)。

### Step 2：格式选择

按场景匹配，**不要默认 drawio**：

| 场景 | 推荐格式 | 理由 |
|------|---------|------|
| 复杂架构图、需要像素级控制、要交付给非技术受众 | **drawio** | 自定义样式、专业排版、可在 drawio 编辑器直接打开 |
| UML 标准图(类图、时序图、用例图、活动图)、对象关系建模 | **PlantUML** | UML 标准语法、与 IDE 集成、文档/代码同步 |
| 快速原型、概念草图、需要进 git 版本控制、Markdown 文档内嵌 | **mermaid** | 文本即图、轻量、GitHub/GitLab 原生渲染 |

**决策口诀**：
- "要交付演示" → drawio
- "要建模/UML 标准" → PlantUML
- "要进 README/文档" → mermaid

用户明确指定时遵循用户指定，不要替换。

### Step 3：结构设计

在写代码/XML 前，先在脑中(必要时用文字)规划：

1. **核心组件分组**：哪些节点属于同一层 / 子系统？
2. **层级关系**：上下游、调用方向、数据流向
3. **关键路径**：图的"主干"是什么？读者第一眼应该看到什么？
4. **布局方向**：自顶向下(流程)、左到右(分层架构)、放射(思维导图)

不要从代码开始编辑——先想清楚再动手。

### Step 4：样式应用

应用配色方案(见下文 **配色规范** 章节)，统一字体、圆角、边距。**禁止每个节点用不同色**，按角色分类配色。

### Step 5：输出/打开

**打开优先级:本地 draw.io 桌面 app > 浏览器(MCP 工具)**

drawio / mermaid 都可以通过本地 draw.io 桌面 app 预览。流程如下:

#### 5.1 检测本地是否安装了 draw.io 桌面 app

执行(Bash):

```bash
ls -d "/Applications/draw.io.app" 2>/dev/null || mdfind "kMDItemCFBundleIdentifier == 'com.jgraph.drawio.desktop'" 2>/dev/null | head -1
```

- **有输出**(路径) → 走 **5.2 本地 app 打开**
- **无输出**(空) → 走 **5.3 浏览器打开**

> 跨平台说明:macOS 用上述命令;Linux/Windows 暂只走浏览器路径(MCP 工具)。

#### 5.2 本地 app 打开(优先)

| 格式 | 步骤 |
|------|------|
| drawio | 1) 将 XML 写入 `.drawio` 文件(优先用户指定路径,否则放当前目录或 `~/Downloads/`);2) `open -a "draw.io" /path/to/file.drawio` |
| mermaid | 1) 将 mermaid 源码写入 `.mmd` 文件;2) `open -a "draw.io" /path/to/file.mmd`(draw.io app 支持 mermaid 导入)。若用户更想原生 mermaid 体验,可直接输出代码块跳过 |
| PlantUML | 本地 app 不支持,跳到 5.3 |

#### 5.3 浏览器打开(fallback)

| 格式 | 输出方式 |
|------|---------|
| drawio | 调 `mcp__drawio__open_drawio_xml`(详图) 直接在浏览器打开预览;同时保存 `.drawio` 文件 |
| mermaid | 输出代码块 + 调 `mcp__drawio__open_drawio_mermaid` 让用户在浏览器看效果 |
| PlantUML | 输出 `.puml` 代码块;告知用户可在 PlantUML Online / IDEA 插件中渲染(无 MCP 直渲工具) |

> 无论走哪条路径,**都要把源文件保存到磁盘**,方便用户后续二次编辑。

---

## 配色规范

按图表类型选配色,**整图配色统一**,背景 / 节点 / 强调三层分明。

### 流程图

| 角色 | 颜色 |
|------|------|
| 开始 | `#caddca`(浅绿) |
| 处理 | `#dae9fd`(浅蓝) |
| 决策 | `#e1d6e7`(浅紫) |
| 结束 | `#ecc4c2`(浅红) |
| 背景 | `#f3f9fe`(极浅蓝) |

### 架构图

| 层级 | 颜色 |
|------|------|
| UI 层 / 前端 | `#f6cfaf`(浅橙) |
| 业务 / 应用层 | `#b8b9d2`(浅紫) |
| 数据 / 存储层 | `#b5d4be`(浅绿) |
| 接口 / 网关层 | `#afd4e3`(浅蓝) |
| 背景 | `#f3f9fe` |

### 状态图

| 状态 | 颜色 |
|------|------|
| 正常 | `#c1de9c`(浅绿) |
| 处理中 | `#fdb093`(浅橙) |
| 警告 | `#ffcccc`(浅粉) |
| 错误 | `#ecc4c2`(浅红) |
| 背景 | `#eaf1e1` |

### PlantUML 主题片段

UML 类图、时序图、用例图、活动图分别使用以下 `skinparam`:

```plantuml
' 类图
!theme plain
skinparam class { BackgroundColor #E6F3FF; BorderColor #0066CC; ArrowColor #0066CC }
skinparam interface { BackgroundColor #D9EAD3; BorderColor #4CAF50 }
skinparam abstract { BackgroundColor #FFF2CC; BorderColor #FF9800 }

' 时序图
skinparam sequence {
  ActorBackgroundColor #E6F3FF
  ParticipantBackgroundColor #F5F5F5
  LifeLineBackgroundColor #FFFFFF
  ArrowColor #0066CC
}

' 用例图
skinparam usecase { BackgroundColor #E6F3FF; BorderColor #0066CC }
skinparam actor { BackgroundColor #D9EAD3; BorderColor #4CAF50 }

' 活动图
skinparam activity {
  BackgroundColor #E6F3FF
  BorderColor #0066CC
  DiamondBackgroundColor #FFF2CC
  DiamondBorderColor #FF9800
}
```

---

## drawio 格式要点

drawio MCP 工具(`mcp__drawio__open_drawio_xml`)自带详细语法说明,这里只列易踩坑点:

1. **文件扩展名**:用 `.drawio`,不要用 `.xml`
2. **不加 XML 声明**:文件不要以 `<?xml version="1.0"?>` 开头(MCP 工具会自动处理)
3. **value 用纯文本**:不要在 `value` 属性里写 HTML 标签,长文本用 `&#10;` 换行
4. **尺寸要够**:文字必须放得下,参考下表

| 文字长度 | 推荐 width × height |
|---------|--------------------|
| 短(2-4 字) | 80-120 × 30-40 |
| 中(5-10 字) | 120-200 × 40-60 |
| 长(>10 字) | 200-400 × 60-100 |
| 多行 | 每行额外 +20-30 高度 |

5. **不要手动算 x/y 坐标**:rigid grid 思维容易出错,优先调 `open_drawio_xml` 让其自动处理布局,或调 `open_drawio_mermaid` 用 mermaid 写完直接转
6. **rounded=1**:节点统一加圆角,`fontSize=12`

骨架模板:

```xml
<mxfile host="app.diagrams.net" version="24.7.17">
  <diagram name="..." id="...">
    <mxGraphModel dx="1422" dy="794" grid="1" gridSize="10" page="1" pageWidth="1169" pageHeight="827">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <!-- 节点 -->
        <mxCell id="n1" value="开始" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#caddca;strokeColor=#000000;fontSize=12;" vertex="1" parent="1">
          <mxGeometry x="100" y="100" width="100" height="40" as="geometry" />
        </mxCell>
        <!-- 连线 -->
        <mxCell id="e1" style="endArrow=classic;html=1;strokeColor=#000000;strokeWidth=2;" edge="1" parent="1" source="n1" target="n2">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

---

## mermaid 格式要点

调 `mcp__drawio__open_drawio_mermaid` 时已有详尽语法指导,这里只强调几条:

- **第一行就定类型**:`flowchart TD` / `sequenceDiagram` / `classDiagram` / `mindmap`
- **节点 ID 不能含空格、连字符、保留字**(`end`/`class` 不能做 ID),显示文字放 `["..."]` 里
- **方向**:`TD`/`TB` 自顶向下,`LR` 左到右
- **节点形状**:`A[方框]`、`B(圆角)`、`C{菱形决策}`、`D((圆形))`、`E[/平行四边形/]`
- **样式 class**:`classDef ok fill:#caddca,stroke:#333` + `class A,B,C ok` 给节点上色,不要每个节点单独写 style

---

## PlantUML 格式要点

- 用标准 `@startuml ... @enduml` 包裹
- 类图、时序图、用例图遵循 UML 规范,关系符号用对
- `!theme plain` + 上面的 `skinparam` 片段做配色
- 输出后明确告诉用户:**没有 MCP 直接渲染工具**,需要在 PlantUML Online / VSCode 插件 / IDEA 插件中查看

---

## 确认门(复杂图 / 要求美观时)

只在以下情况触发,简单图直接动手:

- 节点 > 10 个
- 层级 > 3 层
- 用户说"要正式 / 演示 / 对外 / 画好看"
- 用户给的需求模糊不清(只说"画个架构图")

**模板**:

> 我的理解:
> - **类型**:{流程图 / 架构图 / 时序图 / ...}
> - **格式**:{drawio / mermaid / plantuml},理由:{...}
> - **核心元素**:节点 X 个、分 Y 层 / 子系统、关键流程是 Z
> - **配色方案**:{流程图 / 架构图 / 状态图}配色

紧跟 `AskUserQuestion`:

```
AskUserQuestion({
  questions: [{
    header: "确认设计",
    question: "以上设计是否对齐?",
    multiSelect: false,
    options: [
      { label: "确认,开始绘制", description: "理解无误" },
      { label: "调整结构", description: "节点/连线需要修改" },
      { label: "换格式", description: "格式选错了" },
      { label: "换配色", description: "颜色不合适" }
    ]
  }]
})
```

<HARD-GATE>
触发确认门时,未收到用户确认前不得动手画图。
简单图(节点 ≤ 10 且用户描述清晰)跳过确认门。
</HARD-GATE>

---

## 质量检查清单

输出前过一遍:

**内容**
- [ ] 节点和连线关系正确,无遗漏关键步骤 / 组件
- [ ] 层级清晰,主干一眼看出
- [ ] 术语统一(同一概念别一会儿叫"用户"一会儿叫"客户")

**视觉**
- [ ] 配色按角色分类,不超过 4-5 种主色
- [ ] 字体大小一致(drawio 用 `fontSize=12`)
- [ ] 节点尺寸放得下文字,无溢出
- [ ] 元素间距合理,不挤不空

**格式**
- [ ] drawio:扩展名 `.drawio`,无 XML 声明,value 是纯文本
- [ ] mermaid:第一行类型声明,ID 无非法字符
- [ ] PlantUML:`@startuml`/`@enduml` 配对,主题统一

---

## 写在最后

**始终以"读者能否一眼看懂"为最高标准**——配色再炫、节点再多,读者看不懂就是失败。

不确定时,**少即是多**:节点不够再加,关系不够再连;不要为了"看起来专业"堆砌图形。
