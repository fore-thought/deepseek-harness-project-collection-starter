# presets（角色预设）· 源料与安装配方

> 本目录**不是**可直接挂载的预设目录——它是三个角色预设的**源料**与**安装配方**。
> 装好之后预设落在 `<DSH_HOME>/.agent-presets/<id>/`，**在仓库之外**，所以只能由你在自己
> 机器上装一次。角色表、写权与流水线纪律的**唯一真源**是
> `../shared-standards/pipeline-and-roles.md`；本目录只负责让"身份"进入系统提示词层。

## 为什么不直接发三份完整的组合文件

因为它会**过期**。预设的组合文件是标准模式的快照，而随 DSH 升级标准模式会变；发一份冻结的
快照，用户装到的就是旧配置。改成"复制你当前的标准模式 + 只改 persona 一段"之后，
装出来的预设永远匹配你手上的 DSH 版本。

## 三步安装（每个角色一次）

1. 在 DSH 的「智能体预设 / 预设」界面里**复制「标准模式」**，id 与显示名按下表填写。
2. 打开复制出来的 `agent.cordis.yml`，把 `- id: persona` 起的那一整段**替换**为同目录
   `persona.yml` 的内容（直接用文本编辑器粘贴，注意保持缩进）。
3. 保存。新建会话时选择器里就会出现这个角色预设。

| 显示名 | 预设 id（= 目录名） | 替换用的文件 |
|---|---|---|
| 制作人 | `producer` | `producer/persona.yml` |
| 实现者 | `implementer` | `implementer/persona.yml` |
| 验收员 | `verifier` | `verifier/persona.yml` |

显示名与描述见各目录的 `preset.yml`（复制时若界面允许填，就照它填）。

## 为什么基于标准模式，不基于 PTC 模式

三条理由，都是机制层面的：

1. **PTC 模式下只有 `run_code` 能直接调用**（工具包文档：`Under ptc alone, a model-direct
   call naming any other visible tool resolves to UNKNOWN_TOOL before policy`）。加载项目技能
   要多绕一步——而"技能一步加载"正是整套设计的地基。
2. **没有 PTC 运行时的部署会拒绝挂载**该预设（`A preset that selects a PTC mode against a
   deployment composing no such runtime refuses to mount`）。模板要发给任意用户，不能把三份
   预设绑死在运行时的有无上。
3. **PTC 的省是"换"不是"减"**。文档原话：`PTC mode trades end-tool schemas for generated SDK
   text plus one transport schema rather than promising a universal reduction`——固定开销是
   换；真正的节省在 `every other intermediate result stays out of the conversation`（历史增长）。

**想要 PTC 的节省**：在你复制出来的组合里做三处改动——加一行
`- id: tool-presentation` / `name: '@deepseek-ai/dsh-agent-tool-presentation'` / `config.mode: ptc`，
再把 `workflow-ptc` 与 `tool-workflow` 两行都置 `disabled: true`。改完先跑同一个任务，
用界面上的上下文计量比一次占用，数字出来再决定要不要长期用。

## 两条纪律

- **persona 不抄规范正文，只放指针。** 三个 `persona.yml` 里只有身份、写权路径与"按项目技能
  执行"三样；流程与纪律的正文只在 `shared-standards/pipeline-and-roles.md`。抄副本必然漂移。
- **写权边界必须写在 persona 里，不能只写进技能。** 技能正文是工具结果，超过 8192 字会被裁成
  头 4096 + 尾 1024；写在**中段**的规矩会在长会话里消失，而 persona 是系统提示词的一部分，
  每个请求重发、永不被裁剪。

## 升级后怎么办

你复制的是**当时**的标准模式。DSH 升级之后，建议重新复制一次标准模式、再替换一次 persona
（或只把 persona 那段贴回去）——这一步很轻，因为 persona 文本就在本目录里，改的只有它。
