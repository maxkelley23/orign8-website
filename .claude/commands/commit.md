---
description: Create a well-formatted git commit with conventional commit style
argument-hint: Optional - commit type override (feat/fix/chore/docs/refactor/test)
---

Create a git commit for the current staged changes following project conventions.

## Instructions

1. **Check staged changes**:
   - Run `git status` to see what's staged
   - Run `git diff --cached` to review the actual changes
   - Run `git log --oneline -5` to see recent commit message style

2. **Analyze the changes** and determine:
   - What type of change (feat, fix, chore, docs, refactor, test, perf)
   - What area/scope is affected (queue, vapi, auth, frontend, etc.)
   - A concise summary of what changed and why

3. **Select commit type** (use argument if provided: $ARGUMENTS):
   - `feat`: New feature or capability
   - `fix`: Bug fix
   - `chore`: Maintenance, dependencies, config
   - `docs`: Documentation only
   - `refactor`: Code restructuring without behavior change
   - `test`: Adding or modifying tests
   - `perf`: Performance improvement

4. **Format the commit message**:
   ```
   <type>(<scope>): <short summary>

   <body - explain what and why, not how>

   🤖 Generated with [Claude Code](https://claude.com/claude-code)

   Co-Authored-By: Claude <noreply@anthropic.com>
   ```

5. **Create the commit** using a HEREDOC for proper formatting:
   ```bash
   git commit -m "$(cat <<'EOF'
   <type>(<scope>): <summary>

   <body>

   🤖 Generated with [Claude Code](https://claude.com/claude-code)

   Co-Authored-By: Claude <noreply@anthropic.com>
   EOF
   )"
   ```

6. **Verify** by running `git status` after commit

## Commit Message Guidelines

- **Summary line**: Max 72 characters, imperative mood ("Add feature" not "Added feature")
- **Body**: Explain the "what" and "why", wrap at 80 characters
- **Scope examples**: queue, vapi, auth, compliance, frontend, tests, db, api

## Examples

Good commit messages:
- `feat(queue): add optimistic locking for concurrent processing`
- `fix(vapi): correct recording URL extraction from webhook payload`
- `chore(deps): update axios to 1.6.0`
- `test(compliance): add business hours enforcement tests`
- `refactor(auth): extract JWT validation to middleware`

## Safety Rules

- Do NOT commit files that look like secrets (.env, credentials.json, *.pem)
- Do NOT use `--amend` unless explicitly asked
- Do NOT force push
- Verify staged changes before committing
