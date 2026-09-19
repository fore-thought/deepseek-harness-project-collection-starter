## deepseek-harness-project-collection-starter

<div align="center">
  <a href="README.en.md">English</a> | 
  <a href="README.md">简体中文</a>
</div>

> 这是一个关于 *DeepSeek Harness* **项目集合管理** 的 **最佳实践**。你可以直接 **克隆** 整个仓库，将 `project-template` 文件夹 **重命名** 为你自己的工作区名称，然后 **打开** 工作区，开始与 *DeepSeek Harness* 一起 **愉快地玩耍** 吧。

> ⭐ **点个 Star 吧** —— 我们将长期维护并持续更新！

### 目录结构

```markdown
deepseek-harness-project-collection-starter/
├── shared-standards/              # 项目组级公共规范（各项目只读引用，不随项目复制）
│   ├── AGENTS.md
│   ├── README.md
│   ├── standards.md
│   ├── user-config.toml.template
│   └── .gitignore
├── presets/                       # 三个角色预设（整份复制到 DSH 预设目录即装，可选能力）
├── project-template/              # 复制改名后即一个项目工作区
│   ├── .agents/                   # 项目内技能（项目根 = 最近的 .git 祖先）
│   │   └── skills/project-flow/SKILL.md   # 开局触发：角色与各闸读档顺序
│   ├── AGENTS.md                  # 唯一根级文档：项目规范 + 三类目录索引
│   ├── .gitignore
│   ├── .gitattributes             # 换行归一（LF）
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
│   │   ├── README.md              # 产物类型不预置，由项目自行登记
│   │   └── knowledge/
│   │       └── README.md
│   └── process/
│       ├── README.md
│       ├── docs/                  # 实例区
│       │   ├── README.md
│       │   ├── assumptions.md
│       │   ├── construction.md
│       │   ├── decisions.md
│       │   ├── HANDOFF.md
│       │   ├── measurements.md
│       │   ├── progress.md        # 进度看板（多角色模式下制作人独占写）
│       │   ├── work-log.md
│       │   ├── handoff/           # 每角色一份接续索引（多角色模式）
│       │   │   ├── README.md
│       │   │   ├── implementer/index.md
│       │   │   ├── producer/index.md
│       │   │   └── verifier/index.md
│       │   ├── plans/
│       │   │   ├── goal-spec.md
│       │   │   └── plan.md
│       │   └── units/             # 单元文件夹（传送带：brief/build/accept）
│       │       └── README.md
│       │       # spec-proposals/ 为规约修订成文提案，首次使用时创建
│       ├── templates/             # 模板区
│       │   ├── assumptions.template.md
│       │   ├── construction.template.md
│       │   ├── decisions.template.md
│       │   ├── HANDOFF.template.md
│       │   ├── measurements.template.md
│       │   ├── role-handoff.template.md
│       │   ├── work-log.template.md
│       │   ├── plans/
│       │   │   ├── goal-spec.template.md
│       │   │   └── plan.template.md
│       │   └── units/
│       │       ├── accept.template.md
│       │       ├── brief.template.md
│       │       └── build.template.md
│       ├── project/
│       │   ├── README.md
│       │   ├── configs/
│       │   │   ├── README.md
│       │   │   ├── project-config.toml.template
│       │   │   └── .env.template
│       │   └── scripts/
│       │       ├── README.md
│       │       └── ctx.cjs
│       └── tmp/
│           └── README.md
├── .gitattributes                 # 换行归一（LF）
├── .gitignore                     # 排除 .memory/ 等本地专用区
├── LICENSE
├── README.md                      # 本文件（中文）
└── README.en.md                   # 英文版
```

> 命名规则：模板名 = 实例名 + `.template`，去掉后缀即实例名
> （如 `plan.template.md` → `plan.md`、`.env.template` → `.env`）。

### 使用方法

1. 整个项目克隆下来，确保 `shared-standards` 文件夹存在（之后用户不再动它，agent 也应当很少动它，而动它因为是全局项目规范，所以会需要提权修改）。

   > `deepseek-harness-project-collection-starter` 这个名字不喜欢你也可以改，比如： `my-dsh-projects` 。

2. 将 `project-template` 改为你希望的工作区的名字，比如： `big-fat-fish` ，并**让这个文件夹自己成为一个 git 仓库**（在它里面 `git init`，或从你自己的空仓库 clone）。

   > 这一步不能省。项目级配置里的 git 远端、以及项目内技能的发现，都假定**项目文件夹自己就是仓库根**。若把它留在集合仓库里不初始化：`git remote add` 会加到集合仓库上，项目内的 `.agents/skills` 也不会被扫到。

   > 换行归一不用额外做什么：`project-template` 自带 `.gitattributes`，随文件夹复制过去，`git init` 之后即生效。

3. 在已经启动的 *DeepSeek Harness* 界面，打开刚改名的工作区。

   > 比如：打开工作区 `big-fat-fish`

4. 新建会话窗口，正常聊天即可

5. 首次使用：复制 `shared-standards/user-config.toml.template` 为 `user-config.toml` 并填写 git 身份；
   项目级同理（`project-config.toml.template` → `project-config.toml`，密钥模板
   `.env.template` → `.env`）。不填则走默认/本地模式（见 `shared-standards/AGENTS.md` §6）。

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

### 后续规划

- [ ] 将项目 Skill 化，并打包为 dsh 插件。
- [ ] 按项目类型提供起点包（如 code / document / research），从一个基础模板生成，避免多份模板分叉。

### 许可证

本仓库基于 [MIT License](LICENSE) 开源发布。

> 随便 fork、随便改名、随便商用——玩得开心就好！你用本模板创建的项目完全归你自己：放进 `inputs/`、`outputs/` 和你自己 `process/` 文档里的一切内容，都不受本仓库许可证约束。
