# 镜头交接约定

制作可交接素材包时使用。可以适配已有项目目录，但保留稳定镜头 ID、候选版本和最终选用记录。

## 项目目录

```text
productions/<作品名>/
├── brief.md                    # 风格、比例、时长、工具、预算与假设
├── script.md                   # 分场剧本、对白
├── bible.md                    # 角色/场景/道具 ID、外观约束与参考路径
├── references/                 # 定稿参考图
├── shots.json                  # 镜头清单与任务状态
├── shots/
│   └── shot_001/
│       ├── image-prompt.md
│       ├── video-prompt.md
│       ├── frame_v01.png
│       ├── video_v01.mp4
│       └── voice_v01.wav
├── audio/                      # 配乐、音效及配音
├── subtitles/final.srt
├── edit/                       # 时间线说明、草稿与导入指引
└── exports/                    # 最终输出
```

目录中的媒体仅在实际生成后创建；不要用空文件占位成“已生成”。如果当前只要求剧本，不创建无关目录。

## 镜头记录示例

以下 JSON 是可解析的规划记录，示例路径指预期产物，不表示文件已存在。任务 ID、选中视频与音频路径在实际就绪后填写。

```json
{
  "project": {
    "title": "雨夜来信",
    "style": "2D 手绘动画",
    "aspect_ratio": "9:16",
    "target_duration_s": 60,
    "fps": 24
  },
  "shots": [
    {
      "id": "shot_001",
      "duration_s": 5,
      "scene_id": "scene_alley",
      "character_ids": ["char_lin"],
      "framing": "中景",
      "composition": "林站在画面右侧，门在左侧，视线朝左",
      "action": "林抬头看向门口，握紧信封",
      "camera": "缓慢推进，保持轴线",
      "dialogue": {"speaker": "char_lin", "text": "你终于来了。"},
      "sound": "持续雨声，台词前保留短暂停顿",
      "reference_paths": ["references/char_lin_front.png"],
      "image_prompt_path": "shots/shot_001/image-prompt.md",
      "video_prompt_path": "shots/shot_001/video-prompt.md",
      "frame_path": "shots/shot_001/frame_v01.png",
      "status": "planned",
      "attempts": [],
      "selected_video_path": null,
      "voice_path": null,
      "continuity": "深蓝外套不变；右手持信；门始终位于画面左侧"
    }
  ]
}
```

这里只展示一镜，不能将示例误报为完整 60 秒分镜。完整交付需补足所有镜头，并检查总时长及对白可读时长。

每次实际提交在 `attempts` 中记录：候选版本、服务与模型、任务 ID（若有）、提交时间、提示词及参考素材版本、状态、结果路径、错误、已知费用。不要保存密钥、Cookie 或带凭据的请求头；临时签名下载链接无需写入可分享清单。

建议状态：`planned` → `submitted` → `running` → `succeeded` → `reviewed`。失败为 `failed`；提交结果不明为 `unknown`。已有 task ID 即使下载失败也优先查询原任务、重新下载，不重新生成。候选选用写入 `selected_video_path`，不通过覆盖文件隐藏历史。

## 一镜两种提示词

**图片提示词**：2D 手绘动画，竖屏 9:16。使用角色 `char_lin` 的定稿图，保持短黑发、深蓝外套和人物比例。雨夜小巷中景，人物在右，门在左，右手持信封、视线朝门，暖色门灯映在湿地面。无字幕、水印或拼图边框。

**视频提示词**：以已选分镜图作为首帧，保持人物外观、服装、门的位置和手中信封不变。约 5 秒：前 1 秒静候，随后缓慢抬头朝左侧门口看，右手轻握信封，最后停住。镜头缓慢推进，无切镜，不增加其他人物。雨持续落下。对白和口型按实际生成接口能力单独配置，不能仅靠此文本保证实现。

## 剪映交接

交付选中视频的顺序、入出点和时间线位置、配音/音乐路径及音量建议、字幕文件、画幅与帧率。说明草稿创建工具、目标系统与剪映版本，以及是否实测打开和导出。只能交付素材时明确导入顺序，不把自定义 JSON 清单称为剪映原生草稿。
