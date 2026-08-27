## deepseek-harness-project-collection-starter

<div align="center">
  <a href="README.md">English</a> | 
  <a href="README.zh.md">简体中文</a>
</div>

> This is a **best practice** for **managing** the *DeepSeek Harness* **project collection**. You can directly **fork** the entire repository, **rename** the `project-template` folder to your own workspace name, **open** the workspace, and start having **fun** with DeepSeek Harness.

> ⭐ **Star this repo** — we're committed to long-term maintenance and regular updates!

### Directory structure

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
│       ├── docs/                     # instance area
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
│       ├── templates/                # template area
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

### How to Use

1. Clone the entire project and make sure the shared-standards folder exists. (After that, users won't need to touch it, and agents should rarely modify it either. Since it contains global project standards, any changes to it would require elevated privileges.)

   > You can also rename `deepseek-harness-project-collection-starter` to something you prefer, e.g., `my-dsh-projects`.

2. Rename `project-template` to the name of the workspace you want, e.g., `big-fat-fish`.

3. In the already launched *DeepSeek Harness* interface, open the workspace you just renamed.

   > For example: open workspace `big-fat-fish`

4. Create a new session window and chat as usual.

5. First-time setup: copy `shared-standards/user-config.template.toml` to `user-config.toml` and fill in your git identity; do the same at project level (`project-config.template.toml` → `project-config.toml`). If left unfilled, defaults/local mode apply (see `shared-standards/AGENTS.md` §6).

### How to Better Manage Your Project? Don't!

- The template project comes with a built-in `AGENTS.md` file, which will be automatically loaded in the project session window.

  > Thanks to this very feature of DeepSeek Harness — document-to-document referencing — all project-organizing work is arranged right at the start of the session, achieving automation without any code plugins needed.

- `AGENTS.md` automatically indexes the directory structure, so you don't need to maintain it manually.

  > *Let the BIG FAT FISH prove that she is not just a freeloader !*

- Suggestion: When the session **context** usage approaches or exceeds **60%**, generate a **handoff document** for a new session and continue your work in a **new session**. How to generate a handoff document for a new session? You can say this to `DeepSeek Harness` in the current session:

  > Let's pause here for now. Organize all the milestone achievements of this session, summarize the experience and knowledge gained, update relevant documents, and prepare a handoff document. Then commit the changes via git, and finally, prepare the first message I need to send in the next new session. We will continue the current work in that next new session.

  You can **copy and use** this message directly. (Feel free to use your own wording; the template's markdown already includes behavioral constraints for this message, but this serves as an extra reinforcement. The **key term** is simply **handoff document** and **new session**.)

- To review or improve the project rules (the "reflection" workflow), open a **dedicated session**: read the rules first → analyze completeness → discuss & confirm → land changes per `shared-standards/AGENTS.md` §9. Don't mix rule changes into regular work sessions.
- For anything else you're unsure about or curious about the underlying principles, just take a look at the directory structure and the markdown documents under it.
