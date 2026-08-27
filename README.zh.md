## deepseek-harness-project-collection-starter

<div align="center">
  <a href="README.md">English</a> | 
  <a href="README.zh.md">简体中文</a>
</div>

> 这是一个关于 *DeepSeek Harness* **项目集合管理** 的 **最佳实践**。你可以直接 **克隆** 整个仓库，将 `project-template` 文件夹 **重命名** 为你自己的工作区名称，然后 **打开** 工作区，开始与 *DeepSeek Harness* 一起 **愉快地玩耍** 吧。

> ⭐ **点个 Star 吧** —— 我们将长期维护并持续更新！

### 目录结构

```markdown
deepseek-harness-project-collection-starter/
├── shared-standards/
│   ├── AGENTS.md
│   ├── README.md
│   ├── standards.md
│   ├── user-config.template.toml
│   └── .gitignore
├── project-template/
│   ├── AGENTS.md
│   ├── .gitignore
│   ├── inputs/
│   │   ├── README.md
│   │   ├── ai/
│   │   │   ├── data/
│   │   │   │   └── README.md
│   │   │   └── reports/
│   │   │       └── README.md
│   │   └── user/
│   │       ├── materials/
│   │       │   └── README.md
│   │       └── tools/
│   │           └── README.md
│   ├── outputs/
│   │   ├── README.md
│   │   ├── keyframes/
│   │   │   └── README.md
│   │   ├── knowledge/
│   │   │   └── README.md
│   │   ├── models/
│   │   │   └── README.md
│   │   └── video/
│   │       └── README.md
│   └── process/
│       ├── README.md
│       ├── docs/                     # 实例区
│       │   ├── README.md
│       │   ├── assumptions.md
│       │   ├── construction.md
│       │   ├── decisions.md
│       │   ├── HANDOFF.md
│       │   ├── measurements.md
│       │   ├── work-log.md
│       │   └── plans/
│       │       ├── goal-spec.md
│       │       └── plan.md
│       ├── templates/                # 模板区
│       │   ├── assumptions.template.md
│       │   ├── construction.template.md
│       │   ├── decisions.template.md
│       │   ├── HANDOFF.template.md
│       │   ├── measurements.template.md
│       │   ├── work-log.template.md
│       │   └── plans/
│       │       ├── goal-spec.template.md
│       │       └── plan.template.md
│       ├── project/
│       │   ├── README.md
│       │   ├── configs/
│       │   │   ├── README.md
│       │   │   └── project-config.template.toml
│       │   └── scripts/
│       │       ├── README.md
│       │       └── ctx.cjs
│       └── tmp/
│           └── README.md
└── README.md
```

### 使用方法

1. 整个项目克隆下来，确保 `shared-standards` 文件夹存在（之后用户不在动它，agent 也应当很少动它，而动它因为是全局项目规范，所以会需要提权修改）。

   > `deepseek-harness-project-collection-starter` 这个名字不喜欢你也可以改，比如： `my-dsh-projects` 。

2. 将 `project-template` 改为你希望的工作区的名字，比如： `big-fat-fish` 。

3. 在已经启动的 *DeepSeek Harness* 界面，打开刚改名的工作区。

   > 比如：打开工作区 `big-fat-fish`

4. 新建会话窗口，正常聊天即可

5. 首次使用：复制 `shared-standards/user-config.template.toml` 为 `user-config.toml` 并填写 git 身份；
   项目级同理（`project-config.template.toml` → `project-config.toml`）。不填则走默认/本地模式
   （见 `shared-standards/AGENTS.md` §6）。

### 如何更好的管理项目？不管理！

- 模板项目自带 `AGENTS.md` ，项目会话窗口会自动加载。

  > 正是凭借 deepseek harness 这一特性，文档引用文档，从而通过文档在会话的一开始就安排好整理项目的种种工作，从而在不装代码插件的情况下，实现自动化。

- `AGENTS.md` 里会自动索引目录结构，目录结构不用用户自己维护。

  > *让大肥鱼证明一下她自己不是吃白饭的！*

- 建议：在会话**上下文**提示接近或超过 **60%** 后，生成用于新会话的**交接文档**，并在**新会话**中继续工作。如何生成新会话交接文档？可以在当前会话和 `DeepSeek Harness` 说：

  > 本次会话暂时先到这里，整理一下本次会话的所有里程碑性成果，梳理会话中得到的经验和知识，更新相关文档，我们将在下一次新的会话中继续当前工作，准备好交接文档，并进行 git 提交，最后把我需要在下一次新的会话中发的第一句话整理好。

  这段话**可直接复制**使用。(你愿意的话，用自己的话说也没事，模板 markdown 其实已经做了这段话的行为约束了，这里只是二次增强。**关键词** 仅仅是 **交接文档** 与 **新会话** 。)

- 想分析/完善项目规约？开一个**专用会话**：先读规约 → 分析完整性 → 讨论确认 → 按 `shared-standards/AGENTS.md` §9 流程落地；日常干活会话不混入规约修改。
- 剩下的不明白的，或者好奇原理的，就看看目录结构及目录下 markdown 文档吧。
