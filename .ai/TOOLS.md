# AI tool connection and instruction registry

Research date for this page: **2026-11-09**. Only official documentation is cited. If a convention is not explicitly documented, it is marked **unverified**. Every tool must still begin by reading `AGENTS.md` and `.ai/STATE.md`; the repository does not grant tools permission to request credentials or bypass the relay.

## Manus

**Connection:** Manus Website Builder can export a project to a new private GitHub repository with two-way sync; Manus Studio works from a local folder and leaves remotes/history unchanged. Importing this existing repository into Manus is unverified. **Auto-read:** no repository filename convention was found in official docs. **Manual starter:** no fixed starter prompt is documented; the owner still gives the task. Sources: [Manus GitHub Integration](https://manus.im/docs/website-builder/github-integration.md), [Manus Studio](https://manus.im/docs/website-builder/build-locally.md), accessed 2026-11-09.

## Codex

**Connection:** Codex Cloud connects selected GitHub repositories through a cloud environment; the GitHub Action requires checkout and a configured prompt/prompt-file. **Auto-read:** `AGENTS.override.md` or `AGENTS.md` from the project root through the current directory, with configured fallback filenames only when explicitly configured. **Manual starter:** Cloud needs a task description; the Action needs a prompt or prompt-file. Sources: [Codex Cloud](https://developers.openai.com/codex/cloud), [AGENTS.md](https://developers.openai.com/codex/agent-configuration/agents-md), [Codex GitHub Action](https://developers.openai.com/codex/github-action), accessed 2026-11-09.

## Lovable

**Connection:** Lovable links a GitHub account/workspace and syncs a project to a new repository; importing an existing repository is not supported in the cited docs. **Auto-read:** `AGENTS.md` and `CLAUDE.md` at the project root, with nested files applying to descendants. **Manual starter:** no fixed starter prompt is documented. Sources: [Lovable GitHub sync](https://docs.lovable.dev/integrations/github), [Lovable instructions](https://docs.lovable.dev/features/knowledge), accessed 2026-11-09.

## Google AI Studio

**Connection:** Build mode can import or link an existing GitHub repository; Agents playground can add GitHub repositories as environment sources. **Auto-read:** `.agents/AGENTS.md` and `.agents/skills/*/SKILL.md` are documented for managed agents; Build-mode repository auto-read is unverified. **Manual starter:** no post-import starter prompt requirement is documented. Sources: [AI Studio Build mode](https://ai.google.dev/gemini-api/docs/aistudio-build-mode), [AI Studio Agents](https://ai.google.dev/gemini-api/docs/aistudio-agents), accessed 2026-11-09.

## Cursor

**Connection:** Cursor Cloud Agents connect selected GitHub repositories, clone them, work on branches, and push changes back. **Auto-read:** `.cursor/rules/*.mdc`, applicable nested `AGENTS.md`, and documented Cloud Agent configuration such as `.cursor/environment.json`; plain `.md` rules in `.cursor/rules` are ignored. **Manual starter:** an interactive task prompt is needed, but no fixed text is required. Sources: [Cursor Rules](https://cursor.com/docs/rules), [Cursor GitHub](https://cursor.com/docs/integrations/github), accessed 2026-11-09.

## GitHub Copilot

**Connection:** repository context is selected/attached on GitHub.com, cloned in the Copilot app, or opened in an IDE. **Auto-read:** surface-dependent `.github/copilot-instructions.md`, `.github/instructions/**/*.instructions.md`, supported `AGENTS.md`, `CLAUDE.md`, or `GEMINI.md`; there is no single universal set for every surface. **Manual starter:** an initial task/question is needed, but no fixed starter text is required. Sources: [Copilot custom-instruction support](https://docs.github.com/en/copilot/reference/custom-instructions-support), [Copilot repository instructions](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/configure-custom-instructions/add-repository-instructions-in-your-ide), accessed 2026-11-09.

## Gemini CLI/Jules

**Connection:** Jules connects a GitHub account and selected repositories; Gemini CLI's Jules extension uses `/jules` with a prompt. **Auto-read:** Jules officially reads root `AGENTS.md`; Gemini CLI separately reads `GEMINI.md` from documented workspace/parent locations. **Manual starter:** a clear task prompt is required; no separate fixed template is documented. Sources: [Jules](https://jules.google/docs/), [Jules Gemini CLI extension](https://github.com/gemini-cli-extensions/jules), [Gemini CLI GEMINI.md](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/gemini-md.md), accessed 2026-11-09.

## Windsurf

**Connection:** local Windsurf/Devin Desktop can clone a repository; remote indexing supports GitHub repositories. **Auto-read:** `AGENTS.md`, `AGENTS.local.md`, `AGENT.md`, `.windsurf/rules/*.md`, `.windsurf/global_rules.md`, `.windsurfrules`, and `.windsurf/workflows/*.md` where the documented surface applies. **Manual starter:** a task message is needed, but no fixed starter prompt is required. Sources: [Windsurf getting started](https://docs.windsurf.com/windsurf/getting-started), [Windsurf customizations](https://docs.windsurf.com/windsurf/cascade/memories), accessed 2026-11-09.

## Cline

**Connection:** Cline operates in the current workspace; its official GitHub Actions integration checks out the repository and runs the CLI from a workflow. **Auto-read:** `.clinerules/`, `.cline/rules/`, root `AGENTS.md`, and documented compatibility files `.cursorrules` and `.windsurfrules`. **Manual starter:** no fixed owner-pasted prompt is required when the documented issue-trigger workflow supplies the issue prompt. Sources: [Cline rules](https://docs.cline.bot/customization/cline-rules), [Cline GitHub Actions](https://docs.cline.bot/cli/samples/github-integration), accessed 2026-11-09.

## Bolt

**Connection:** Bolt can import a non-empty repository through its GitHub control and sync commits/updates. **Auto-read:** lowercase `agents.md` is officially documented; other names are unverified. **Manual starter:** no post-import starter prompt is documented. Sources: [Bolt GitHub](https://support.bolt.new/integrations/git), [Bolt project context](https://support.bolt.new/prompting/manage-context), accessed 2026-11-09.

## How to add a new AI tool

1. Add a planned row to `.ai/AGENTS_REGISTRY.md` without marking the tool active.
2. Verify the connection and instruction convention using the tool's official documentation only.
3. Add one short section here with source URL and access date; mark unknowns as unverified.
4. Add a pointer file only when the official convention is confirmed, and make it point back to `AGENTS.md` and `.ai/STATE.md`.
5. Ask the owner only if the new tool needs a new account, paid feature, card, domain, or permission; never ask for a key.
