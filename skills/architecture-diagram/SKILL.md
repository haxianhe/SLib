---
name: architecture-diagram
description: |
  专业图表绘制助手，覆盖架构图、流程图、时序图、类图、思维导图等场景，输出 drawio 格式。触发条件：
  - 用户说"画一个架构图 / 流程图 / 时序图 / 思维导图"、"帮我画图"、"用 drawio 画"
  - 用户描述系统结构、流程步骤、模块依赖、调用链路并希望可视化
  - 用户提供既有图表想要修改或补充
  - 即使用户没说"画图"，只要意图是把结构 / 流程 / 关系可视化呈现，也应触发
---

# architecture-diagram：专业图表绘制助手

把用户脑中的结构、流程、关系翻译成专业、可读、风格一致的图表。

不只是"画一张图"——而是让图表准确传达信息、便于后续维护，并在需要时利用 `mcp__drawio__*` 工具直接打开预览。

---

## 工作流(四步)

```
需求分析 → 结构设计 → 样式应用 → 输出/打开
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

### Step 2：结构设计

在写代码/XML 前，先在脑中(必要时用文字)规划：

1. **核心组件分组**：哪些节点属于同一层 / 子系统？
2. **层级关系**：上下游、调用方向、数据流向
3. **关键路径**：图的"主干"是什么？读者第一眼应该看到什么？
4. **布局方向**：自顶向下(流程)、左到右(分层架构)、放射(思维导图)

不要从代码开始编辑——先想清楚再动手。

### Step 3：样式应用(美观优先)

图表美不美观,决定读者愿不愿意看下去。**美观四原则**(必须全部满足):

1. **对齐与网格** — 同层 / 同组节点使用相同 x 或 y 坐标;gridSize=10,所有坐标对齐到 10 的倍数。视觉错乱多半源于"差几像素"
2. **节点间距足够** — 水平相邻 x 间距 ≥ 80,垂直相邻 y 间距 ≥ 60,分组之间留 40+ 边距。**给连线留出绕行的路**,挤在一起必然出现连线穿节点
3. **配色按角色统一** — 见下文 **配色规范**。**禁止每个节点用不同色**,同类节点同色;整图主色 ≤ 4-5 种
4. **视觉层次** — 标题 / 分组用 `fontSize=14;fontStyle=1`(加粗)和更深填色 / 阴影(`shadow=1`);主路径连线 `strokeWidth=2`,辅助 / 弱关系 `strokeWidth=1;dashed=1`

字体统一 `fontSize=12`,节点统一 `rounded=1`。**不混用直角和圆角**。

### Step 4：输出/打开

**打开优先级:本地 draw.io 桌面 app > 浏览器(MCP 工具)**

drawio 可以通过本地 draw.io 桌面 app 预览。流程如下:

#### 4.1 检测本地是否安装了 draw.io 桌面 app

执行(Bash):

```bash
ls -d "/Applications/draw.io.app" 2>/dev/null || mdfind "kMDItemCFBundleIdentifier == 'com.jgraph.drawio.desktop'" 2>/dev/null | head -1
```

- **有输出**(路径) → 走 **4.2 本地 app 打开**
- **无输出**(空) → 走 **4.3 浏览器打开**

> 跨平台说明:macOS 用上述命令;Linux/Windows 暂只走浏览器路径(MCP 工具)。

#### 4.2 本地 app 打开(优先)

1. 将 XML 写入 `.drawio` 文件(优先用户指定路径,否则放当前目录或 `~/Downloads/`)
2. `open -a "draw.io" /path/to/file.drawio`

#### 4.3 浏览器打开(fallback)

调 `mcp__drawio__open_drawio_xml` 直接在浏览器打开预览;同时保存 `.drawio` 文件。

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

---

## 连线规范(连线不得覆盖图形)

drawio 默认直线在节点密集时极易穿过其它节点,**这是图表"显得乱"的头号原因**。所有连线必须遵守:

### 1. 默认走正交路由

所有 edge 的 style **必加**:

```
edgeStyle=orthogonalEdgeStyle;rounded=0;jettySize=auto;
```

- `orthogonalEdgeStyle`:连线只走横平竖直,drawio 内置避障会自动绕开节点
- `jettySize=auto`:在节点边缘预留一段直角空隙,避免连线"贴脸"

### 2. 显式锁定连接点(关键)

只设 `source` / `target` 时,drawio 会从节点中心随机选边,连线常常穿过节点中心。必须用 `exitX/exitY` 和 `entryX/entryY` 把连接点钉在边上:

| 方位 | exit/entry 参数 |
|------|----------------|
| 右侧出 | `exitX=1;exitY=0.5;exitDx=0;exitDy=0;` |
| 左侧入 | `entryX=0;entryY=0.5;entryDx=0;entryDy=0;` |
| 底部出 | `exitX=0.5;exitY=1;exitDx=0;exitDy=0;` |
| 顶部入 | `entryX=0.5;entryY=0;entryDx=0;entryDy=0;` |

经验法则:**水平布局用左右连(0.5 中点),垂直布局用上下连**,绝不让连线从节点对角穿出。

### 3. 交叉连线开启 jumpStyle

无法避免的交叉处加"过桥"弧线,大幅提升可读性。edge style 追加:

```
jumpStyle=arc;jumpSize=10;
```

### 4. 节点间距留足绕行空间

- 水平相邻节点 x 间距 ≥ 80
- 垂直相邻节点 y 间距 ≥ 60
- 分组(swimlane / container)边距 ≥ 40
- 节点周围 30px 内不应有其它节点 / 连线

间距挤了就该改布局,不要靠 waypoint 硬绕。

### 5. 必要时手工加 waypoints

自动路由仍穿过节点的边缘情况,在 `mxGeometry` 内显式拐点:

```xml
<mxGeometry relative="1" as="geometry">
  <Array as="points">
    <mxPoint x="400" y="200" />
    <mxPoint x="400" y="350" />
  </Array>
</mxGeometry>
```

### 6. 节点过密就拆分子图

节点 > 20、或交叉超过 5 条:不要硬画,优先**拆分子图 / 用 swimlane 圈分组**,从源头减少跨域连线。挤进一张图反而看不懂。

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

5. **不要手动算 x/y 坐标**:rigid grid 思维容易出错,优先调 `open_drawio_xml` 让其自动处理布局
6. **rounded=1**:节点统一加圆角,`fontSize=12`
7. **连线必带 orthogonal + exit/entry**:见上文 **连线规范**

骨架模板(已内置正交路由 + 连接点锁定 + jumpStyle):

```xml
<mxfile host="app.diagrams.net" version="24.7.17">
  <diagram name="..." id="...">
    <mxGraphModel dx="1422" dy="794" grid="1" gridSize="10" page="1" pageWidth="1169" pageHeight="827">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />

        <!-- 节点:统一圆角 + 配色按角色分类 + 阴影增强层次 -->
        <mxCell id="n1" value="开始"
          style="rounded=1;whiteSpace=wrap;html=1;fillColor=#caddca;strokeColor=#000000;fontSize=12;shadow=1;"
          vertex="1" parent="1">
          <mxGeometry x="100" y="100" width="100" height="40" as="geometry" />
        </mxCell>
        <mxCell id="n2" value="处理"
          style="rounded=1;whiteSpace=wrap;html=1;fillColor=#dae9fd;strokeColor=#000000;fontSize=12;shadow=1;"
          vertex="1" parent="1">
          <mxGeometry x="260" y="100" width="100" height="40" as="geometry" />
        </mxCell>

        <!-- 连线:正交路由 + 锁定右出/左入 + jumpStyle 处理交叉 -->
        <mxCell id="e1"
          style="edgeStyle=orthogonalEdgeStyle;rounded=0;jettySize=auto;jumpStyle=arc;jumpSize=10;endArrow=classic;html=1;strokeColor=#000000;strokeWidth=2;exitX=1;exitY=0.5;exitDx=0;exitDy=0;entryX=0;entryY=0.5;entryDx=0;entryDy=0;"
          edge="1" parent="1" source="n1" target="n2">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

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

**视觉(美观)**
- [ ] 配色按角色分类,不超过 4-5 种主色,同类节点同色
- [ ] 字体大小一致(`fontSize=12`),标题 / 分组用 14 加粗
- [ ] 节点统一圆角(`rounded=1`),不混用直角圆角
- [ ] 节点尺寸放得下文字,无溢出
- [ ] 同层节点 x 或 y 坐标对齐(到 gridSize=10)
- [ ] 节点间距:水平 ≥ 80,垂直 ≥ 60,分组边距 ≥ 40
- [ ] 标题 / 分组有视觉层次(加粗 / 阴影 / 深色填充)

**连线(不得覆盖图形)**
- [ ] 所有 edge style 包含 `edgeStyle=orthogonalEdgeStyle;jettySize=auto`
- [ ] 起止用 `exitX/exitY` + `entryX/entryY` 锁定到节点边
- [ ] 交叉处加 `jumpStyle=arc;jumpSize=10`
- [ ] 主路径 `strokeWidth=2`,辅助 / 弱关系 `dashed=1`
- [ ] **逐条检查没有连线穿过任何节点矩形**

**格式**
- [ ] drawio:扩展名 `.drawio`,无 XML 声明,value 是纯文本

---

## 写在最后

**美观 = 克制 + 对齐 + 留白**。三者缺一不可:

- **克制** — 主色 ≤ 5 种,字号 ≤ 2 档,形状 ≤ 3 种。每多一种"花样",信息密度就降一截
- **对齐** — 同层节点坐标对齐到 gridSize,差 2px 都会让图"歪"
- **留白** — 节点间距、分组边距、画布边距都要足。**挤出来的图不可能美观,也必然出现连线穿节点**

**始终以"读者能否一眼看懂"为最高标准**——配色再炫、节点再多,读者看不懂就是失败。

不确定时,**少即是多**:节点不够再加,关系不够再连;不要为了"看起来专业"堆砌图形。
