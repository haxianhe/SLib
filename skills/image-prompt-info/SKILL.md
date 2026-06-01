---
name: image-prompt-info
description: |
  信息图(infographic)AI 文生图 prompt 产出助手。把数据/教程/概念组织成视觉密度高的一张图,
  输出可直接贴 Midjourney / 即梦 / 通义万象 / Nano Banana 等任意文生图平台的 prompt 文件。
  不调用任何文生图 API。触发条件:
  - 用户说"画信息图 / 做信息卡 / 可视化数据 / 高密度大图 / 知识卡片 / dataviz / infographic"
  - 用户提供数据或教程内容并希望出一张视觉化图
  - 用户给出多个并列项(>5 个)并希望整合成单图
---

# image-prompt-info:信息图 AI 文生图 prompt 助手

把内容翻译成专业、好看的信息图 prompt,用户拿到任意文生图平台都能出图。

不调任何后端 API,只产 prompt 文件。

---

## 1. 快速选(推荐预设)

不知道选啥?默认按下表选最近 1 项。Claude 会按你内容里出现的关键词自动推。

| 预设 | 看起来像 | 用在哪 | 预览 |
|---|---|---|---|
| **知识卡** | 米黄牛皮纸底 + 手绘格子分区 + 马卡龙色块(粉/蓝/绿/桃)+ 黑色手写体标题 + 简笔图标 | 给小学生讲分数的概念入门、5 分钟看懂 OAuth | ![](https://github.com/JimLiu/baoyu-skills/raw/main/screenshots/infographic-styles/craft-handmade.webp) |
| **复古高密度** | 1970s 波普海报风,粗黑描边 + 番茄红/芥末黄/孔雀蓝大色块,Swiss 栅格,长图竖版 | 一图讲完"15 个 Git 高频命令"、Vim 速查表 | —(baoyu 无 dense-modules 截图) |
| **流程教程** | 宜家说明书风,纯黑线稿无填色,数字步骤圈 + 极简箭头 + 几何小人 | 手把手装显卡、配置家庭路由器 | ![](https://github.com/JimLiu/baoyu-skills/raw/main/screenshots/infographic-styles/ikea-manual.webp) |
| **数据看板** | 公司年报风,白底网格 + 折线/柱状图 + 大数字 + 扁平 icon + 莫兰迪冷色调 | 季度销售看板、A/B 测试结果汇报 | ![](https://github.com/JimLiu/baoyu-skills/raw/main/screenshots/infographic-styles/corporate-memphis.webp) |
| **赛博朋克** | 紫黑底 + 霓虹粉绿发光线条 + 故障字效 + 电路纹 + 全息感 | AI 工具新品发布封面、黑客松宣传 | ![](https://github.com/JimLiu/baoyu-skills/raw/main/screenshots/infographic-styles/cyberpunk-neon.webp) |
| **黑板手写** | 深绿黑板底 + 白/黄/粉粉笔字 + 简笔画 + 板擦痕迹 + 课程编号圈 | 读书会分享、家长讲数学题 | ![](https://github.com/JimLiu/baoyu-skills/raw/main/screenshots/infographic-styles/chalkboard.webp) |
| **A vs B 对比** | 左右两栏强对比,中间分隔线,左暖红/右冷青,各自图标 + bullet list | iPhone vs 安卓选购、Vue vs React 对比 | ![](https://github.com/JimLiu/baoyu-skills/raw/main/screenshots/infographic-layouts/comparison-table.webp) |
| **冰山揭示** | 横向海平面,上 1/8 露出冰山尖(表象),下 7/8 巨大冰体(本质),冷蓝水彩感 | 揭示成功背后的努力、技术栈底层原理 | ![](https://github.com/JimLiu/baoyu-skills/raw/main/screenshots/infographic-layouts/iceberg.webp) |

每个预设内部对应 layout + style + palette 组合见第 2 节(完整库)末尾的「预设映射表」。

## 2. 完整库(自由组合)

<!-- 由 Task 3 填充 -->

## 3. 工作流

<!-- 由 Task 5 填充 -->

## 4. Prompt 文件格式

<!-- 由 Task 5 填充 -->

## 5. References 索引

<!-- 由 Task 5 填充 -->
