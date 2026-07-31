---
description: Commit the current working tree changes, push a feature branch, open a PR, and squash-merge it — this repo's full ship workflow in one step. Use when the user says things like "commit push pr merge", "ship this", "PR 만들고 머지해줘", or asks to commit and merge in one go.
argument-hint: "[optional: PR title or extra context]"
---

# commit → push → PR → merge

Run this repo's full ship sequence end-to-end. The user invoking this skill is explicit authorization to push, open a PR, and merge it — do not stop to re-ask for confirmation on those steps unless something looks wrong (see Safety checks).

This repo merges via **squash** (see `git log --oneline` — merged commits show `(#N)`), so always use `gh pr merge --squash --delete-branch`.

## 0. Figure out current state

Run in parallel:
- `git status`
- `git diff` and `git diff --staged`
- `git branch --show-current`
- `git log --oneline -5`
- `git log --oneline origin/main..HEAD` (or the repo's default branch if not `main`) to see if local is already ahead

Determine which case applies:

- **Case A — uncommitted changes, on default branch (`main`)**: create a feature branch first, then commit on it. Do NOT commit directly on `main`.
- **Case B — uncommitted changes, already on a feature branch**: just commit on the current branch.
- **Case C — no uncommitted changes, but `main` has local commit(s) not on `origin/main`** (e.g. a previous step committed directly to `main` by mistake): create a branch pointing at the current `main` HEAD, then `git reset --hard origin/<default-branch>` to restore `main`, then switch to the new branch. The commit is preserved on the branch — `reset --hard` here only rewinds `main`, it does not lose work already committed elsewhere.
- **Case D — already on a feature branch with commits ready, nothing uncommitted**: skip straight to push/PR/merge.
- **Nothing to do**: no uncommitted changes AND no local-only commits anywhere relevant → tell the user there's nothing to ship and stop.

## 1. Stage and commit (Cases A/B only)

- Review `git status` / `git diff` yourself before staging. Stage specific paths — never blind `git add -A` — and double-check nothing that looks like a secret (`.env`, credentials, keys) is included.
- Look at `git log --oneline -10` for this repo's message convention (e.g. `[phase-N] 짧은 설명`) and follow it.
- Write a commit message focused on *why*, not a mechanical file list.
- Always end the message with:
  ```
  Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
  ```
- Pass the message via a heredoc, not `-m` string concatenation.

For Case A, branch name: derive a short kebab-case slug from the commit's `[phase-N]` tag or subject (e.g. `phase-3/money-tree-widget`). Create the branch with `git checkout -b <name>` **before** committing.

## 2. Recover onto a branch (Case C only)

```
git branch <derived-branch-name>              # points at current main HEAD (keeps the commit)
git reset --hard origin/<default-branch>       # rewinds main only; commit still lives on the new branch
git checkout <derived-branch-name>
```
Verify before moving on: `git log --oneline <derived-branch-name> -3` should still show the commit, and `git diff main <derived-branch-name> --stat` should show the expected files.

## 3. Push

```
git push -u origin <branch-name>
```

## 4. Open the PR

Look at the full commit range for this branch (`git log main..HEAD` and the diff) to write an accurate summary — don't just restate the commit subject if there were multiple commits.

```
gh pr create --title "<title>" --body "$(cat <<'EOF'
## Summary
- ...

## Test plan
- [x] ...

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

If the user passed extra context as this skill's argument, fold it into the title/body.

## 5. Merge

```
gh pr merge <number> --squash --delete-branch
```

## 6. Clean up locally

```
git checkout <default-branch>
git pull --ff-only
git branch -d <branch-name>   # no-op / harmless if gh already deleted it locally
git status                    # confirm clean and up to date
```

## Safety checks (pause and ask instead of proceeding if any of these are true)

- The repo has no `gh` auth (`gh auth status` fails) — tell the user, don't try to work around it.
- The diff contains files that look like secrets or credentials.
- There are unrelated, unfinished changes mixed into the working tree that don't belong in this ship (ask which files to include).
- Tests/build are known to be failing and haven't been run — prefer running the repo's standard checks (`build`/`lint`/`typecheck`/`test`) first if they haven't already been run this session, and mention the result in the PR body.
- Never force-push, never skip hooks (`--no-verify`), never merge with `--admin` to bypass failing checks without telling the user first.
