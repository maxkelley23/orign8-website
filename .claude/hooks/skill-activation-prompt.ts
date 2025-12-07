#!/usr/bin/env node
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface HookInput {
    session_id: string;
    transcript_path: string;
    cwd: string;
    permission_mode: string;
    prompt: string;
}

interface PromptTriggers {
    keywords?: string[];
    intentPatterns?: string[];
}

interface SkillRule {
    type: 'guardrail' | 'domain';
    enforcement: 'block' | 'suggest' | 'warn';
    priority: 'critical' | 'high' | 'medium' | 'low';
    description?: string;
    promptTriggers?: PromptTriggers;
}

interface SkillRules {
    version: string;
    skills: Record<string, SkillRule>;
}

interface MatchedSkill {
    name: string;
    matchType: 'keyword' | 'intent';
    config: SkillRule;
}

/**
 * Extract key content from a SKILL.md file
 * Prioritizes: Quick Reference section > first 60 lines after frontmatter
 */
function extractSkillContent(skillPath: string, maxLines: number = 80): string | null {
    try {
        if (!existsSync(skillPath)) {
            return null;
        }

        const content = readFileSync(skillPath, 'utf-8');
        const lines = content.split('\n');

        // Skip YAML frontmatter
        let startLine = 0;
        if (lines[0] === '---') {
            for (let i = 1; i < lines.length; i++) {
                if (lines[i] === '---') {
                    startLine = i + 1;
                    break;
                }
            }
        }

        // Look for "## Quick Reference" or "## Key Patterns" section
        const quickRefPatterns = [
            /^##\s*(Quick Reference|Key Patterns|Essential Patterns|Critical Patterns)/i,
            /^##\s*(When to Use|Architecture Overview)/i
        ];

        let quickRefStart = -1;
        let quickRefEnd = -1;

        for (let i = startLine; i < lines.length; i++) {
            const line = lines[i];

            // Check for quick reference section start
            if (quickRefStart === -1) {
                for (const pattern of quickRefPatterns) {
                    if (pattern.test(line)) {
                        quickRefStart = i;
                        break;
                    }
                }
            }
            // Find section end (next ## heading)
            else if (line.startsWith('## ') && i > quickRefStart) {
                quickRefEnd = i;
                break;
            }
        }

        // If we found a quick reference section, use it
        if (quickRefStart !== -1) {
            const endLine = quickRefEnd !== -1 ? quickRefEnd : Math.min(quickRefStart + 40, lines.length);
            return lines.slice(quickRefStart, endLine).join('\n').trim();
        }

        // Otherwise, return first section after frontmatter (limited lines)
        const relevantLines = lines.slice(startLine, startLine + maxLines);
        return relevantLines.join('\n').trim();

    } catch (err) {
        return null;
    }
}

async function main() {
    try {
        // Read input from stdin
        const input = readFileSync(0, 'utf-8');
        const data: HookInput = JSON.parse(input);
        const prompt = data.prompt.toLowerCase();

        // Load skill rules
        const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
        const rulesPath = join(projectDir, '.claude', 'skills', 'skill-rules.json');

        if (!existsSync(rulesPath)) {
            process.exit(0);
        }

        const rules: SkillRules = JSON.parse(readFileSync(rulesPath, 'utf-8'));
        const matchedSkills: MatchedSkill[] = [];

        // Check each skill for matches
        for (const [skillName, config] of Object.entries(rules.skills)) {
            const triggers = config.promptTriggers;
            if (!triggers) {
                continue;
            }

            // Keyword matching
            if (triggers.keywords) {
                const keywordMatch = triggers.keywords.some(kw =>
                    prompt.includes(kw.toLowerCase())
                );
                if (keywordMatch) {
                    matchedSkills.push({ name: skillName, matchType: 'keyword', config });
                    continue;
                }
            }

            // Intent pattern matching
            if (triggers.intentPatterns) {
                const intentMatch = triggers.intentPatterns.some(pattern => {
                    const regex = new RegExp(pattern, 'i');
                    return regex.test(prompt);
                });
                if (intentMatch) {
                    matchedSkills.push({ name: skillName, matchType: 'intent', config });
                }
            }
        }

        // Generate output if matches found
        if (matchedSkills.length > 0) {
            // Sort by priority
            const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
            matchedSkills.sort((a, b) =>
                priorityOrder[a.config.priority] - priorityOrder[b.config.priority]
            );

            let output = '';

            // Inject skill content for top 2 most relevant skills
            const topSkills = matchedSkills.slice(0, 2);

            for (const skill of topSkills) {
                const skillPath = join(projectDir, '.claude', 'skills', skill.name, 'SKILL.md');
                const content = extractSkillContent(skillPath);

                if (content) {
                    output += `<skill-context name="${skill.name}" priority="${skill.config.priority}">\n`;
                    output += content;
                    output += '\n</skill-context>\n\n';
                }
            }

            // Show remaining skills as suggestions
            const remainingSkills = matchedSkills.slice(2);
            if (remainingSkills.length > 0) {
                output += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
                output += '📚 ADDITIONAL SKILLS AVAILABLE:\n';
                remainingSkills.forEach(s => {
                    output += `  → ${s.name}: ${s.config.description || 'No description'}\n`;
                });
                output += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
            }

            // Only output if we have content
            if (output.trim()) {
                console.log(output);
            }
        }

        process.exit(0);
    } catch (err) {
        // Fail silently to not block user prompts
        process.exit(0);
    }
}

main().catch(() => {
    process.exit(0);
});
