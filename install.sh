#!/bin/bash

set -euo pipefail

echo "Installing SLib plugin..."
echo ""

# ── 前置依赖检查 ──────────────────────────────────────────────────────────────
if ! command -v claude &>/dev/null; then
    echo "✗ 未检测到 claude CLI，请先安装 Claude Code"
    exit 1
fi

# ── 添加 marketplace 并安装 plugin ────────────────────────────────────────────
if claude plugins list 2>/dev/null | grep -q "slib@slib"; then
    echo "slib 已安装，正在更新..."
    claude plugins update slib
else
    echo "正在添加 SLib marketplace..."
    claude plugins marketplace add haxianhe/SLib

    echo "正在安装 slib plugin..."
    claude plugins install slib
fi

echo ""
echo "✓ 安装完成！重启 Claude Code 后即可使用以下 skill："
echo "  - slib:afeaturemerge  竞品功能分析与实现"
echo "  - slib:learning       技术学习路径规划"
echo "  - slib:summary        链接总结入库"
