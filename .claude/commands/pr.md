---
description: Create a GitHub pull request with proper formatting
argument-hint: Optional - target branch (defaults to main)
---

Create a pull request for the current branch with a well-formatted description.

## Instructions

1. **Gather context** (run in parallel):
   - `git status` - Check for uncommitted changes
   - `git branch --show-current` - Get current branch name
   - `git log main..HEAD --oneline` - See all commits on this branch
   - `git diff main...HEAD --stat` - See files changed

2. **Check prerequisites**:
   - Ensure all changes are committed
   - Ensure branch is pushed to remote (`git push -u origin <branch>` if needed)

3. **Analyze all commits** on the branch (not just the latest):
   - What features were added?
   - What bugs were fixed?
   - What areas of code were touched?

4. **Create PR** using `gh pr create`:
   ```bash
   gh pr create --title "<title>" --body "$(cat <<'EOF'
   ## Summary
   <1-3 bullet points summarizing the changes>

   ## Changes
   <List of specific changes made>

   ## Test plan
   - [ ] <How to test this PR>
   - [ ] <Additional verification steps>

   ## Related
   - Closes #<issue> (if applicable)
   - Related to #<issue> (if applicable)

   🤖 Generated with [Claude Code](https://claude.com/claude-code)
   EOF
   )"
   ```

5. **Return the PR URL** to the user

## Target Branch

Use the argument if provided ($ARGUMENTS), otherwise default to `main`.

## PR Title Guidelines

- Use conventional commit format: `<type>(<scope>): <description>`
- Be specific about what the PR accomplishes
- Max 72 characters

## PR Body Guidelines

### Summary Section
- 1-3 bullet points
- Focus on the "why" and user-facing impact
- Be concise but informative

### Changes Section
- List specific technical changes
- Group by area if multiple components affected
- Include file names for major changes

### Test Plan Section
- How to manually test the changes
- What tests were added/modified
- Any edge cases to verify

## Examples

**Good PR Title:**
- `feat(queue): implement optimistic locking for concurrent processing`
- `fix(vapi): correct webhook payload normalization for recordings`
- `chore: update dependencies and fix security vulnerabilities`

**Good Summary:**
```
## Summary
- Adds optimistic locking to prevent duplicate queue item processing
- Reduces race conditions under high concurrency
- Improves system reliability during peak load
```

## Safety Rules

- Do NOT create PRs with uncommitted changes
- Do NOT push to main directly
- Always verify the target branch before creating
- Include a test plan even for small changes
