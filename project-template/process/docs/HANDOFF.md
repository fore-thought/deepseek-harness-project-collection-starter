# 会话交接（HANDOFF）

> 新会话第一步：①读本文件 ②读根级 AGENTS.md TOP 规则 ③读 process/docs/work-log.md
> ④读 process/docs/decisions.md ⑤按"下一步"执行（先过四道闸，见项目组级规范 §7）。
> 格式参考 `process/templates/HANDOFF.template.md`。

## 1. 项目定位（一句话）

（待填写）

## 2. 最近完成

- （暂无）

## 3. 关键文件/工具

- （暂无）

## 4. 遗留 / 待办

- [ ] （暂无）

## 5. 下一步（建议，待用户拍板）

1. （暂无）

## 6. 规则提醒

- 四道闸门禁（立项/规划/执行/接续）+ 调研阶段（可选）见项目组级规范
  ../../../shared-standards/AGENTS.md（TOP 规则 + §7）：过闸缺凭证即停
- 大文件下载一律用户在主机执行（代理给下载表：网址+存储位置）
- 请示用户优先提问卡片；数字/阈值必标 [MEASURED]/[ESTIMATED]/[UNKNOWN]
- 里程碑 → ①决策回写 ②复盘 ③总结 → 推送远端
- 每次 git 操作三问：①已设远端？②仅本地？③已推送？（模式见用户职责表）

## 7. 用户职责表

> 通用行如下；项目可增行（如内容类项目的"发布动作"）。

| 职责 | 说明 | 状态 |
|---|---|---|
| 账号注册 | 由用户负责 | 待办 |
| git 远端/身份 | 在 process/project/configs/project-config.toml（项目）与
  ../shared-standards/user-config.toml（组）填写；优先级=项目→组→卡片；会话中不留痕 | 待填写 |
| 平台密钥 | 填 process/project/configs/.env（键名见 env.template）；toml 不列密钥（见组级 standards §2） | 待填写 |
| 大文件下载 | 按代理下载表（网址+存储位置）在主机执行 | — |
| 决策批准 | 提问卡片拍板（含回填清单、计划书批准） | 常态 |
