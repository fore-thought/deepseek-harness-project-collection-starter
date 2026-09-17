---
name: project-flow
description: 在本工作区开始或继续任何工作时先加载——它给出本项目的角色分工、写权范围与各闸的读档顺序。
whenToUse: 会话开始、接续上一个会话、或在多角色流水线里换角色时。
---

# 本项目的工作流程（project-flow）

## 第一件事：确定你的角色

本项目按角色分工，三个角色是 **制作人 / 实现者 / 验收员**。

- 若你由**角色预设**启动，角色已由 persona 给定，直接采用；
- 否则**先用提问卡片请用户指定角色**，再往下走。角色未定就不要动任何文件。

## 第二件事：按模式读档

**单会话模式**（默认）：
1. `process/docs/HANDOFF.md`
2. 根级 `AGENTS.md` 的 TOP 规则
3. `process/docs/work-log.md` 尾 10 行 + `process/docs/decisions.md` 索引
4. `process/docs/plans/plan.md` 当前段门禁表

**多角色模式**：`process/docs/HANDOFF.md` 会写明处于多角色模式——它是**静态路由**，
真正的接续点在 `process/docs/handoff/<你的角色>/index.md`。读那里指出的最新一份交接文件，
再按上面的第 2–4 步读。

## 第三件事：只写你角色范围内的路径

完整角色表、写权范围、归属与越界规程、并行纪律都在组级只读文件：

`../shared-standards/pipeline-and-roles.md`

**那是唯一真源，本技能不复制它的正文**——照它执行即可。当前项目的具体单元与交接文件，
在各角色索引里。
