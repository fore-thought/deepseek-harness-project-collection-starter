# presets（角色预设）

> 本目录下**每个角色一个文件夹，文件夹本身就是可直接安装的预设**：整份复制到
> `<DSH_HOME>/.agent-presets/` 即可，不需要自己拼装任何文件。三个角色按需装，只装一个
> 也完全可用。角色表、写权与流水线纪律的**唯一真源**是
> `../shared-standards/pipeline-and-roles.md`；本目录只负责让"身份"进入系统提示词层。

## 安装（每个角色一次）

把角色文件夹整个复制过去：

| 角色 | 复制这个文件夹 | 装到这里 |
|---|---|---|
| 制作人 | `presets/producer/` | `<DSH_HOME>/.agent-presets/producer/` |
| 实现者 | `presets/implementer/` | `<DSH_HOME>/.agent-presets/implementer/` |
| 验收员 | `presets/verifier/` | `<DSH_HOME>/.agent-presets/verifier/` |

- `<DSH_HOME>` 默认是 `~/.dsh`（Windows 通常是 `C:\Users\<你>\.dsh`）；DSH 界面上
  「打开预设目录」一类的入口指向的就是它。
- 复制完不用重启：新建会话时，选择器里就会出现对应的显示名。

每个文件夹里只有两个文件：

- `agent.cordis.yml`：完整组合（由某个版本的 DSH 标准模式 + 本角色 persona 生成）；
- `preset.yml`：显示名与描述。

## 与 DSH 标准模式保持一致，是本仓库的维护责任

> `agent.cordis.yml` 的正文是 DSH 源文件的**逐字副本**，含它自带的长注释行（有几行超过
> 本仓库 §4 的 100 字符行宽约定）——不要为了行宽去重排，重排会让"与标准模式的差异只有
> persona 段"这条判据失效。

`agent.cordis.yml` 派生自**某个版本**的标准模式，而标准模式会随 DSH 升级变化（新增或改名
工具行、改默认值、动配置）。升级后重新生成这三份，只有一步不同：**把新的标准模式组合覆盖
进来，再把本角色的 `- id: persona` 段贴回去**——

1. 用当前 DSH 自带的标准模式组合（预设目录里的 `standard/agent.cordis.yml`）替换
   `agent.cordis.yml` 的正文；
2. 从 `git show HEAD~1:presets/<角色>/agent.cordis.yml` 取出该角色的 `- id: persona` 段
   （从 `- id: persona` 到 `- id: agent-instructions` 之前），覆盖回同样的位置；
3. 三个角色都做完后校验一次：装到 `<DSH_HOME>/.agent-presets/` 下，新建会话能选到该显示名、
   且能正常开局。

三份组合与标准模式的差异**只有 persona 这一段**，这是校验时最好用的判据。

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

**想要 PTC 的节省**：复制装好之后，直接在 `<DSH_HOME>/.agent-presets/<角色>/agent.cordis.yml`
里做三处改动——加一行 `- id: tool-presentation` / `name: '@deepseek-ai/dsh-agent-tool-presentation'` /
`config.mode: ptc`，再把 `workflow-ptc` 与 `tool-workflow` 两行都置 `disabled: true`。改完先跑
同一个任务，用界面上的上下文计量比一次占用，数字出来再决定要不要长期用。

## 三条纪律

- **persona 不抄规范正文，只放指针。** 三份 persona 里只有身份、写权路径与"按项目技能执行"
  三样；流程与纪律的正文只在 `../shared-standards/pipeline-and-roles.md`。抄副本必然漂移。
- **但写权边界必须连它的反面一起写进 persona。** 只有正面清单的 persona 挡不住三条路：
  "我只是跑了个命令"（命令在别人命名空间生成文件 = 你写了那里）、
  "我只是顺手修一下"（制作人唯一能修的是一份自己有权写的文档）、
  "我只是替他决定怎么做"（那是实现者的那一层）。
  这三句是**边界本身**，不是流程正文，所以允许进 persona；流程与判据的解释仍在组级文件。
- **写权边界必须写在 persona 里，不能只写进技能。** 技能正文是工具结果，超过 8192 字会被裁成
  头 4096 + 尾 1024；写在**中段**的规矩会在长会话里消失，而 persona 是系统提示词的一部分，
  每个请求重发、永不被裁剪。
