# presets（角色预设）

> 本目录下 `bundle/` 是**一个可直接安装的组合包**，装一次三个角色一起到位。
> 角色表、写权与流水线纪律的**唯一真源**是
> `../shared-standards/pipeline-and-roles.md`；本目录只负责让"身份"进入系统提示词层。

## 安装（装这一份，三个角色一起到位）

组合包里是**三条独立声明**（`producer` / `implementer` / `verifier`），装进去之后
选择器里会同时出现三个显示名，各按各的用即可——只用一个也完全可用。

| 方式 | 怎么做 |
|---|---|
| 在会话里装 | 让代理用 `plugin_manager` 工具，`action: install_bundle`，`target` 填 `presets/bundle/` 的**绝对路径** |
| 在命令行装 | `dsh plugin --profile <profile> add <presets/bundle/ 的绝对路径>` |

- 安装需要完整访问权限或一次性批准；装的是本机 profile，**不是**某个项目。
- 装完不用重启：新建会话时，选择器里就会出现三个显示名。
- 验证：`plugin_manager` 的 `list_bundles` 能看到本包，`list_plugins` 里
  `preset-producer` / `preset-implementer` / `preset-verifier` 三行处于已激活态。

`bundle/` 里只有两个文件：

- `cordis.patch.yml`：三条 `@deepseek-ai/dsh-agent-preset` 声明，每条一份完整组合；
- `package.json`：告诉 DSH 这个目录是可安装的 bundle（`dsh.bundle.patch` 指向上面那个文件）。

> **这里的三个文件就是唯一真源**，没有第二份副本。
> 早先每个角色一个文件夹（`<角色>/agent.cordis.yml` + `preset.yml`）的形态已在改组合包时
> 并入本文件并删除；需要回看当时的原文用 `git log`，不要再新建平行副本——
> 两份正文必然漂移。

## 与 DSH 标准模式保持一致，是本仓库的维护责任

> `config.plugins` 的正文是 DSH 源文件的**逐字副本**（注释行未搬，工具行、参数与
> `plan-mode` 的长字符串原样保留）——不要为了行宽去重排，重排会让"与标准模式的
> 差异只有 persona 段"这条判据失效。

三条声明派生自**某个版本**的 standard 预设，而它会随 DSH 升级变化（新增或改名工具行、
改默认值、动配置）。升级后重新取一次，只有一步不同：**把新的标准插件清单覆盖进来，
再把本角色的 persona 段贴回去**——

1. 用当前 DSH 自带的 standard 预设（`@deepseek-ai/dsh-web-app` 组合里的
   `presets/standard.patch.yml`）作为插件清单来源；
2. 把清单整段贴进 `cordis.patch.yml` 三条声明的 `config.plugins`，**只把
   `- id: persona` 那一小段换成各角色的 persona**（`prefix` + `suffix` 两个键）；
3. 校验：`config.plugins` 除 persona 段外与标准模式**逐字相同**；三条声明的插件清单
   彼此**逐字相同**；然后按上面的方式重装一次，确认三个显示名都能选到、都能正常开局。

**三条声明之间的差异只有 persona 段**，这是校验时最好用的判据。

> **校验要机器做，不要靠眼睛。** 做法：把 standard 预设的生效列表导出成一份对照文件，
> 再用脚本把三条声明各抽出插件清单、去掉 persona 段、与对照文件逐行比对
> （两边都去掉注释与空行、统一缩进）。上一批升级就是这样查出**三处**靠肉眼看不出的偏差的
> ——两份 persona 被改写、一条 `description` 被改写。**改 persona 或 `description` 之后，
> 同样要拿它与上一版的原文逐字比对**，别只读一遍觉得对。

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

**想要 PTC 的节省**：照同一份清单自己加一行 `tool-presentation`
（`@deepseek-ai/dsh-agent-tool-presentation`，`config.mode: ptc`），并把 `workflow-ptc` 与
`tool-workflow` 两行都置 `disabled: true`。改完先跑同一个任务，用界面上的上下文计量比一次
占用，数字出来再决定要不要长期用。

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
