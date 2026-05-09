---
name: search
description: |
  多层检索助手，自动应对企业防火墙阻断外网访问的问题。当某一层检索失败时，自动降级到下一层，确保总能返回有价值的结果。触发条件：
  - 用户说"帮我搜索/查一下/找一下 X"
  - 用户询问技术问题、工具用法、行业信息等需要检索资料的场景
  - 用户说"X 是什么"、"怎么做 X"、"有没有 X 相关资料"
  - 用户说"搜索一下"、"查询一下"、"检索一下"
  - WebSearch 或 WebFetch 调用失败后，需要切换到其他检索方式
  - 用户提到访问不了外网、被防火墙拦截、网络受限等情形
---

# search：多层检索助手

企业防火墙场景下，WebSearch/WebFetch 可能被静默拦截或返回空结果。本 skill 定义**四层降级**策略，依次尝试直到获得有效内容。

---

## 四层检索策略

### Layer 1：WebSearch（首选）

```
WebSearch({ query: "<查询词>" })
```

**失败判断**（满足任一则跳至 Layer 2）：
- 工具报错：connection refused / timeout / tool not available / 403
- 返回结果为空
- 返回内容疑似防火墙拦截页（含"访问受限""认证""sign in"等字样）

成功时：摘取 top 3 结果的标题、摘要和链接。若需要完整内容，进入 Layer 2 抓取。

---

### Layer 2：WebFetch

适用于：Layer 1 返回了可信 URL 需要完整内容，或用户直接提供了 URL。

```
WebFetch({ url: "<URL>", prompt: "提取与「<查询词>」相关的核心信息，保留文章结构" })
```

**失败判断**（满足任一则跳至 Layer 3）：
- 返回 403 / 连接拒绝 / 超时
- 返回内容少于 200 字，或疑似登录页

不要重试同一 URL 超过一次。

---

### Layer 3：curl

通过 Bash 调用 curl，绕过部分 WebFetch 的代理限制：

```
Bash({
  command: "curl -sL --max-time 15 -A 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' '<URL>' | sed 's/<[^>]*>//g' | grep -v '^$' | head -200"
})
```

若 Layer 1 返回了 URL，用那些 URL；否则用搜索引擎直接 URL（如 `https://www.google.com/search?q=<编码后的查询词>`）。

**失败判断**（满足任一则跳至 Layer 4）：
- 返回空或内容少于 100 字
- 返回 HTML 错误页（含"403""404""blocked"）
- curl 命令本身报错（exit code 非 0）

---

### Layer 4：chrome-mcp

利用浏览器已有登录态和 JS 渲染能力获取内容：

```
mcp__chrome-mcp__get_page_content(url="<URL>")
```

若 chrome-mcp 连接失败（ECONNREFUSED / tool not found）：
1. `Bash("pkill -f mcp-chrome-bridge && sleep 2")`
2. 重试一次
3. 仍失败则告知用户所有层级均已尝试

---

## 结果展示格式

```
## 检索结果：<查询词>

### 来源
- ✓ Layer N（工具名）：成功
- ✗ Layer N（工具名）：失败原因

### 核心内容
<提炼 3-5 个要点>

### 详细信息
<按来源分块展示>
```

---

## 全部失败时的处理

如实告知用户所有层级均失败，并建议：
- 手动搜索后将内容粘贴给我分析
- 提供更精确的关键词或 URL

不要伪造结果或用笼统语言绕过失败。
