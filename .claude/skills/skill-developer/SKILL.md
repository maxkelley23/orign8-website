---
name: skill-developer
description: Create and manage Claude Code skills following Anthropic best practices. Use when creating new skills, modifying skill-rules.json, understanding trigger patterns, working with hooks, debugging skill activation, or implementing progressive disclosure. Covers skill structure, YAML frontmatter, trigger types (keywords, intent patterns, file paths), enforcement levels (block, suggest, warn), and the 500-line rule.
---

# Skill Developer Guide

## Purpose

Guide for creating and managing skills in Claude Code with auto-activation, following Anthropic's best practices including the 500-line rule and progressive disclosure.

## When to Use This Skill

- Creating or adding skills
- Modifying skill triggers or rules
- Understanding how skill activation works
- Debugging skill activation issues
- Working with skill-rules.json

---

## System Overview

### Hook Architecture

**UserPromptSubmit Hook** (Proactive Suggestions)
- **File**: `.claude/hooks/skill-activation-prompt.ts`
- **Trigger**: BEFORE Claude sees user's prompt
- **Purpose**: Suggest relevant skills based on keywords + intent patterns
- **Method**: Injects formatted reminder as context

### Configuration

**Location**: `.claude/skills/skill-rules.json`

Defines:
- All skills and their trigger conditions
- Enforcement levels (block, suggest, warn)
- File path patterns (glob)
- Keywords and intent patterns

---

## Creating a New Skill

### Step 1: Create Skill File

**Location:** `.claude/skills/{skill-name}/SKILL.md`

**Template:**
```markdown
---
name: my-new-skill
description: Brief description including keywords that trigger this skill. Mention topics, file types, and use cases.
---

# My New Skill

## Purpose
What this skill helps with

## When to Use
Specific scenarios and conditions

## Key Information
The actual guidance, patterns, examples
```

**Best Practices:**
- ✅ Name: Lowercase with hyphens
- ✅ Description: Include ALL trigger keywords (max 1024 chars)
- ✅ Content: Under 500 lines
- ✅ Examples: Real code examples
- ✅ Structure: Clear headings, lists, code blocks

### Step 2: Add to skill-rules.json

```json
{
  "my-new-skill": {
    "type": "domain",
    "enforcement": "suggest",
    "priority": "medium",
    "description": "Brief description",
    "promptTriggers": {
      "keywords": ["keyword1", "keyword2"],
      "intentPatterns": ["(create|add).*?something"]
    },
    "fileTriggers": {
      "pathPatterns": ["src/**/*.js"]
    }
  }
}
```

### Step 3: Test

Type prompts containing your keywords to verify activation.

---

## Skill Types

### Domain Skills (Most Common)

- Type: `"domain"`
- Enforcement: `"suggest"`
- Purpose: Provide guidance for specific areas
- Examples: backend-dev-guidelines, frontend-dev-guidelines

### Guardrail Skills (Critical)

- Type: `"guardrail"`
- Enforcement: `"block"`
- Purpose: Enforce critical best practices
- Use sparingly for high-risk areas

---

## Trigger Types

### Keywords (Explicit)

```json
"keywords": ["component", "react", "frontend", "UI"]
```

Matches if prompt contains any keyword (case-insensitive).

### Intent Patterns (Implicit)

```json
"intentPatterns": [
    "(create|add|make|build).*?(component|page)",
    "(fix|debug).*?(backend|API)"
]
```

Regex patterns for detecting user intent.

### File Path Patterns

```json
"fileTriggers": {
    "pathPatterns": [
        "src/**/*.js",
        "frontend/**/*.tsx"
    ]
}
```

Glob patterns for file-based activation.

---

## Priority Levels

| Priority | Display | Use For |
|----------|---------|---------|
| critical | ⚠️ CRITICAL | Blocking guardrails |
| high | 📚 RECOMMENDED | Primary domain skills |
| medium | 💡 SUGGESTED | Secondary skills |
| low | 📌 OPTIONAL | Nice-to-have |

---

## Anthropic Best Practices

✅ **500-line rule**: Keep SKILL.md under 500 lines
✅ **Progressive disclosure**: Use reference files for details
✅ **Rich descriptions**: Include all trigger keywords
✅ **Test first**: Verify triggers work before documenting extensively
✅ **One level deep**: Don't nest references deeply

---

## File Structure

```
.claude/
├── settings.json           # Hook configuration
├── hooks/
│   ├── skill-activation-prompt.sh
│   ├── skill-activation-prompt.ts
│   ├── package.json
│   └── tsconfig.json
└── skills/
    ├── skill-rules.json    # Master trigger config
    └── {skill-name}/
        └── SKILL.md        # Skill content
```

---

## Debugging

### Skill Not Triggering

1. Check keywords match (case-insensitive)
2. Verify skill-rules.json syntax
3. Ensure skill folder and SKILL.md exist
4. Restart Claude Code after changes

### Test Hook Manually

```bash
cd .claude/hooks
echo '{"prompt":"test keyword"}' | npx tsx skill-activation-prompt.ts
```

---

**Skill Status**: COMPLETE ✅
