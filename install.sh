#!/bin/bash

FAILED_ITEMS=()

echo "Installing SLib skills..."
echo ""

# ── 前置依赖检查 ──────────────────────────────────────────────────────────────
echo "检查前置依赖..."

MISSING=()
command -v git     &>/dev/null || MISSING+=("git")
command -v python3 &>/dev/null || MISSING+=("python3")
command -v curl    &>/dev/null || MISSING+=("curl")

if [ ${#MISSING[@]} -gt 0 ]; then
    echo "✗ 缺少必要工具：${MISSING[*]}"
    if [[ "$(uname)" == "Darwin" ]]; then
        echo "  建议：brew install ${MISSING[*]}"
    else
        echo "  建议：sudo apt-get install ${MISSING[*]}"
    fi
    exit 1
fi
echo "  ✓ git / python3 / curl"
echo ""

# ── 依赖：superpowers（brainstorming skill）───────────────────────────────────
echo "[1/1] 检查 superpowers（brainstorming skill）..."

if ! command -v claude &>/dev/null; then
    echo "  ✗ 未检测到 claude CLI，请先安装 Claude Code"
    FAILED_ITEMS+=("superpowers（缺少 claude CLI）")
elif claude mcp list 2>/dev/null | grep -q "superpowers"; then
    echo "  ✓ superpowers 已配置，跳过"
else
    echo "  未检测到 superpowers，正在配置..."
    if claude mcp add superpowers -- npx -y @superpower-sh/cli@latest; then
        echo "  ✓ superpowers 配置完成"
    else
        echo "  ✗ superpowers 配置失败，请手动运行："
        echo "      claude mcp add superpowers -- npx -y @superpower-sh/cli@latest"
        FAILED_ITEMS+=("superpowers")
    fi
fi
echo ""

# ── Skill 文件 ────────────────────────────────────────────────────────────────
BASE_URL="https://raw.githubusercontent.com/haxianhe/SLib/main"

echo "Installing afeaturemerge skill..."
mkdir -p ~/.claude/skills/afeaturemerge/hooks

if curl -sSL "$BASE_URL/skills/afeaturemerge/SKILL.md" \
       -o ~/.claude/skills/afeaturemerge/SKILL.md && \
   curl -sSL "$BASE_URL/skills/afeaturemerge/hooks/afeaturemerge-sync.sh" \
       -o ~/.claude/skills/afeaturemerge/hooks/afeaturemerge-sync.sh; then
    chmod +x ~/.claude/skills/afeaturemerge/hooks/afeaturemerge-sync.sh
    echo "  ✓ afeaturemerge skill 下载完成"
else
    echo "  ✗ afeaturemerge skill 下载失败，请检查网络后重试"
    FAILED_ITEMS+=("afeaturemerge skill 下载")
fi

python3 <<'PYEOF'
import json, os, sys

p = os.path.expanduser('~/.claude/settings.json')
try:
    if os.path.exists(p):
        with open(p) as f:
            s = json.load(f)
    else:
        s = {}
except json.JSONDecodeError as e:
    print(f'  ✗ {p} JSON 格式有误：{e}', file=sys.stderr)
    sys.exit(1)

entry = {
    'matcher': 'Write|Edit',
    'hooks': [{
        'type': 'command',
        'command': os.path.expanduser('~/.claude/skills/afeaturemerge/hooks/afeaturemerge-sync.sh'),
        'timeout': 30
    }]
}

hooks = s.setdefault('hooks', {})
ptu = hooks.setdefault('PostToolUse', [])

if not any('afeaturemerge-sync.sh' in str(e) for e in ptu):
    ptu.append(entry)
    try:
        os.makedirs(os.path.dirname(p), exist_ok=True)
        with open(p, 'w') as f:
            json.dump(s, f, indent=2, ensure_ascii=False)
        print('  ✓ Hook 已写入 ~/.claude/settings.json')
    except Exception as e:
        print(f'  ✗ 写入 settings.json 失败：{e}', file=sys.stderr)
        sys.exit(1)
else:
    print('  ✓ Hook 已存在，跳过')
PYEOF

# ── 安装总结 ──────────────────────────────────────────────────────────────────
echo ""
if [ ${#FAILED_ITEMS[@]} -eq 0 ]; then
    echo "✓ 安装完成！重启 Claude Code 后即可使用 afeaturemerge。"
else
    echo "⚠ 安装完成，但以下组件需要手动处理："
    for item in "${FAILED_ITEMS[@]}"; do
        echo "  - $item"
    done
    echo ""
    echo "  修复后重新运行："
    echo "  curl -sSL https://raw.githubusercontent.com/haxianhe/SLib/main/install.sh | bash"
fi
