# process/docs（实例区）

> 本目录只放**实例文件**（真实内容）；**模板**统一在 `../templates/`
> （`<名>.template.md`，含格式示例与填写说明）。
> 实例骨架已预置；填内容时参考 `../templates/` 对应模板；需要重置可随时从模板复制
> （去掉 `.template` 后缀覆盖实例）。
> `spec-proposals/`（规约修订成文提案）：**首次使用时创建**（见组级 AGENTS.md §9）。
> 新增文档：先登记到根级 AGENTS.md（或对应 README 索引），再建实例。

## 必读文档的读取方式（新增文档先归类）

> 通则见组级 AGENTS.md §5；此处只列实例区各文件的归类。

| 读取类别 | 本区文件 |
|---|---|
| 覆盖写（有界） | `HANDOFF.md`、`plans/goal-spec.md` |
| 尾 N 行 | `work-log.md`（接续闸取尾 10 行） |
| 索引 + 按需展开 | `decisions.md`（接续闸只读索引区） |
| 分段读 | `plans/plan.md`（只读当前段门禁表） |
| 按字段筛读 | `assumptions.md`（先读「近期可实测」与状态未定条目） |
| 按步骤清单执行 | `construction.md`（按前置条件/命令/判据逐条执行） |

> 追加类文档（work-log / decisions / assumptions / measurements）：**只追加、不重写、
> 不重排、不整理格式**，保证多会话合并时按时间戳即可解决冲突。

## 多角色模式新增的三处（可选能力）

> 不用角色时这三处都可以空着；启用判据、角色表与写权范围见组级
> `../shared-standards/pipeline-and-roles.md`。

- `progress.md`：进度看板，多角色模式下由**制作人独占写**；单会话模式可留空。
- `units/`：单元文件夹（传送带）——`brief.md`（制作人）/ `build*.md`（实现者）/
  `accept.md`（验收员）。约定见 `units/README.md`。
- `handoff/`：每角色一份接续索引（`producer/`、`implementer/`、`verifier/`）。
  多角色模式下接续点在这里，`HANDOFF.md` 只做静态路由。约定见 `handoff/README.md`。
