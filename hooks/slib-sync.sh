#!/bin/bash
# slib-sync.sh
# SLib 通用 PostToolUse hook：检测 .md 文件写入，提示是否同步到云端知识库
#
# 由 hooks/hooks.json 注册，匹配 Write|Edit 工具。
# 仅在写入路径以 .md 结尾时注入提示，由 Claude 自行判断是否需要同步。

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [[ "$FILE_PATH" == *.md ]]; then
    MSG="文件已保存：${FILE_PATH}。请判断该文件是否属于知识沉淀类内容（文档、总结、学习计划、调研报告、竞品分析等），若是且当前 session 配置了知识库 MCP 工具（钉钉、语雀、Confluence 等），则将文件同步到云端知识库并告知用户结果；若文件属于工程文件（README、CLAUDE.md、配置说明、源码注释等）或无可用知识库 MCP 工具，则忽略本提示，无需告知用户。"
    jq -n --arg msg "$MSG" '{"hookSpecificOutput":{"hookEventName":"PostToolUse","additionalContext":$msg}}'
fi

exit 0
