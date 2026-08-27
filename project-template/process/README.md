# process（过程工程）· 本区索引

> 二、过程工程：项目进行中产生的工程与文档。本文件 = 本区内部索引，由本区自行维护。

## 子分组

- `tmp/`：临时垃圾文件（调试脚本、中间导出、缓存）——可随时清空；
  归档/打包时整体剔除
- `project/`：本项目正式工程（工程实现）
  - `project/scripts/`：脚本
  - `project/configs/`：配置
- `docs/`：文档**实例区**（只放实例文件）
  - `HANDOFF.md`（会话交接，含用户职责表）/ `work-log.md`（工作日志，全路径）/
    `decisions.md`（决策 ADR）/ `assumptions.md`（假设，含验证时机）/
    `measurements.md`（实测）/ `construction.md`（施工，只记成功步骤）
  - `docs/plans/`：`goal-spec.md`（目标书）/ `plan.md`（计划书）
  - `docs/README.md`：本区索引与初始化说明
- `templates/`：文档**模板区**（`<名>.template.md`，含格式示例，永不改内容；
  实例 = 复制到 docs/ 去掉 `.template` 后缀）

## 规则

- 过程产物能进 `tmp/` 的不进 `project/`
- 有价值的成功工程进 `project/`，并在 `docs/construction.md` 记录成功步骤
