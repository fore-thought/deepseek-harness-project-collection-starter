# process（过程工程）· 本区索引

> 二、过程工程：项目进行中产生的工程与文档。本文件 = 本区内部索引，由本区自行维护。

## 子分组

- `tmp/`：临时垃圾文件（调试脚本、中间导出、缓存）——可随时清空；
  归档/打包时整体剔除
- `project/`：本项目正式工程（工程实现）
  - `project/scripts/`：脚本
  - `project/configs/`：配置
- `docs/`：AI 工作进展相关文档
  - `HANDOFF.md`（会话交接）/ `work-log.md`（工作日志，含失败过程）/
    `decisions.md`（决策）/ `assumptions.md`（假设）/
    `measurements.md`（实测）/ `construction.md`（施工，只记成功步骤）
  - `docs/plans/`：`goal-spec.md`（目标书）/ `plan.md`（计划书）；
    `*-template.md` 永为模板，实例另存不带 `-template`

## 规则

- 过程产物能进 `tmp/` 的不进 `project/`
- 有价值的成功工程进 `project/`，并在 `docs/construction.md` 记录成功步骤
