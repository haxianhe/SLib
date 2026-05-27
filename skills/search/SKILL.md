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

### Layer 4：agent-browser

利用真实浏览器的 JS 渲染、Cookie 与已有登录态拿到完整页面。通过 Bash 调用 `agent-browser` CLI。

#### 公开页面（默认路径）

```bash
agent-browser open <URL>
agent-browser get text body          # 或 agent-browser snapshot
agent-browser close
```

返回内容过短或拿不到正文 → 试一次 `snapshot`；仍失败则视为 Layer 4 失败。

#### 登录页判断

满足任一即视为需要登录：
- URL 跳转到 `/login`、`/signin`、`/sso/`、`login.*.com` 等
- `snapshot` 看到"登录"、"Sign in"、"Log in"、密码输入框
- `get text body` 抓到的内容只剩登录提示

#### 登录页：复用本地 Chrome 登录态（优先级 1，强烈推荐）

```bash
agent-browser open <URL> --headed --profile Default
agent-browser snapshot -i             # 确认已经登录到正常页面
agent-browser state save ~/.agent-browser/<domain>.json
agent-browser get text body
agent-browser close
```

`<domain>` 取主域名（如 `example.com`）。SSO 类站点 90% 直通。

#### 登录页：Chrome 也没登录（优先级 2）

弹窗已开 → 告诉用户「请在弹出的浏览器里完成登录，登录后回复我」→ 等用户确认后：

```bash
agent-browser snapshot -i             # 确认登录成功
agent-browser state save ~/.agent-browser/<domain>.json
agent-browser get text body
agent-browser close
```

#### 后续访问同域名（headless 复用 state）

```bash
agent-browser --state ~/.agent-browser/<domain>.json open <URL>
agent-browser --state ~/.agent-browser/<domain>.json get text body
agent-browser --state ~/.agent-browser/<domain>.json close
```

#### 失败判断

- `agent-browser` 命令本身不存在或报错（exit code 非 0）
- 三种姿势（公开 / 复用 Chrome / state 复用）都拿不到 ≥200 字正文
- 用户拒绝在弹窗中完成登录

满足以上任一 → 告知用户所有层级均已尝试，进入「全部失败处理」。

#### 注意事项

- **不要反复尝试 cookies/skills/snapshot 自己摸索登录态**，按上面优先级走
- 同一 URL 不重试超过一次（除了「无 state → 弹窗登录 → 存 state → 再抓一次」这一连贯流程）
- GitHub README 优先 `curl -sL https://raw.githubusercontent.com/<owner>/<repo>/main/README.md` 直接拿原文，比浏览器快

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
