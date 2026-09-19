## deepseek-harness-project-collection-starter

<div align="center">
  <a href="README.en.md">English</a> | 
  <a href="README.md">简体中文</a>
</div>

> This is a **best practice** for **managing** the *DeepSeek Harness* **project collection**. You can directly **fork** the entire repository, **rename** the `project-template` folder to your own workspace name, **open** the workspace, and start having **fun** with DeepSeek Harness.

> ⭐ **Star this repo** — we're committed to long-term maintenance and regular updates!

### Directory structure

```markdown
deepseek-harness-project-collection-starter/
├── shared-standards/              # project-group standards (read-only reference, not copied per project)
│   ├── AGENTS.md
│   ├── README.md
│   ├── standards.md
│   ├── user-config.toml.template
│   └── .gitignore
├── presets/                       # the three role presets — copy a folder into the DSH preset directory (optional)
├── project-template/              # rename this to create one project workspace
│   ├── .agents/                   # project-local skills (project root = nearest .git ancestor)
│   │   └── skills/project-flow/SKILL.md   # session-start trigger: role and gate read order
│   ├── AGENTS.md                  # the only root document: project rules + three-category index
│   ├── .gitignore
│   ├── .gitattributes             # line-ending normalization (LF)
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
│   │   ├── README.md              # artifact types are not preset; each project registers its own
│   │   └── knowledge/
│   │       └── README.md
│   └── process/
│       ├── README.md
│       ├── docs/                  # instance area
│       │   ├── README.md
│       │   ├── assumptions.md
│       │   ├── construction.md
│       │   ├── decisions.md
│       │   ├── HANDOFF.md
│       │   ├── measurements.md
│       │   ├── progress.md        # progress board (producer-only in multi-role mode)
│       │   ├── work-log.md
│       │   ├── handoff/           # one handoff index per role (multi-role mode)
│       │   │   ├── README.md
│       │   │   ├── implementer/index.md
│       │   │   ├── producer/index.md
│       │   │   └── verifier/index.md
│       │   ├── plans/
│       │   │   ├── goal-spec.md
│       │   │   └── plan.md
│       │   └── units/             # unit folders (conveyor: brief/build/accept)
│       │       └── README.md
│       │       # spec-proposals/ holds written spec proposals; created on first use
│       ├── templates/             # template area
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
├── .gitattributes                 # line-ending normalization (LF)
├── .gitignore                     # excludes .memory/ and other local-only areas
├── LICENSE
├── README.md                      # this file's Chinese counterpart (primary)
└── README.en.md                   # English
```

> Naming rule: a template is `<instance name>.template`; dropping the suffix yields the
> instance (`plan.template.md` → `plan.md`, `.env.template` → `.env`).

### How to Use

1. Clone the entire project and make sure the shared-standards folder exists. (After that, users won't need to touch it, and agents should rarely modify it either. Since it contains global project standards, any changes to it would require elevated privileges.)

   > You can also rename `deepseek-harness-project-collection-starter` to something you prefer, e.g., `my-dsh-projects`.

2. Rename `project-template` to the name of the workspace you want, e.g., `big-fat-fish`, and **make that folder its own git repository** (`git init` inside it, or clone it from an empty repository of your own).

   > Do not skip this. The project-level git remote and project-local skill discovery both assume the **project folder itself is the repository root**. If you leave it inside the collection repository without initializing it, `git remote add` targets the collection repository and the project's `.agents/skills` is never scanned.

   > Line endings need no extra work: `project-template` ships its own `.gitattributes`,
   > so it comes along with the folder and takes effect right after `git init`.

3. In the already launched *DeepSeek Harness* interface, open the workspace you just renamed.

   > For example: open workspace `big-fat-fish`

4. Create a new session window and chat as usual.

5. First-time setup: copy `shared-standards/user-config.toml.template` to `user-config.toml` and fill in your git identity; do the same at project level (`project-config.toml.template` → `project-config.toml`, and the secret template `.env.template` → `.env`). If left unfilled, defaults/local mode apply (see `shared-standards/AGENTS.md` §6).

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

### Roadmap

- [ ] Skillize the project and package it as a dsh plugin.
- [ ] Ship per-type starter packs (e.g. code / document / research) generated from one base template, so multiple templates cannot drift.

### License

This repository is released under the [MIT License](LICENSE).

> Fork it, rename it, use it commercially — go have fun! Projects you create from this template are entirely yours; nothing you put in `inputs/`, `outputs/`, or your own `process/` documents is bound by this license.
