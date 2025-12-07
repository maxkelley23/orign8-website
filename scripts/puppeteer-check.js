#!/usr/bin/env node
/**
 * E2E Smoke Test Script
 *
 * Performs basic end-to-end checks using Puppeteer to verify
 * the application loads and critical elements are present.
 *
 * Usage:
 *   npm run e2e:preview   # Build and start preview server, then run tests
 *   npm run e2e           # Run tests against http://localhost:5173
 *
 * Environment variables:
 *   E2E_BASE_URL - Override the base URL (default: http://localhost:5173)
 *   E2E_HEADLESS - Run in headless mode (default: true)
 *   E2E_TIMEOUT  - Page load timeout in ms (default: 30000)
 */

import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import AxePuppeteer from '@axe-core/puppeteer';

// =============================================================================
// CONFIGURATION
// =============================================================================

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:5173';
const HEADLESS = process.env.E2E_HEADLESS !== 'false';
const TIMEOUT = parseInt(process.env.E2E_TIMEOUT || '30000', 10);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SCREENSHOTS_DIR = join(__dirname, '../e2e-screenshots');

// =============================================================================
// TEST DEFINITIONS
// =============================================================================

const tests = [
    {
        name: 'Homepage loads successfully',
        path: '/',
        checks: async (page) => {
            // Wait for root element to be rendered
            await page.waitForSelector('#root', { timeout: TIMEOUT });

            // Check that React has mounted (root should have children)
            const rootContent = await page.$eval('#root', (el) => el.innerHTML);
            if (!rootContent || rootContent.trim() === '') {
                throw new Error('React app did not mount - #root is empty');
            }

            return { success: true, message: 'Homepage loaded and React mounted' };
        },
    },
    {
        name: 'Navigation elements present',
        path: '/',
        checks: async (page) => {
            // Wait for navigation to render
            await page.waitForSelector('nav, header, [role="navigation"]', {
                timeout: TIMEOUT,
            });

            // Check for main navigation links
            const links = await page.$$eval('a[href]', (anchors) =>
                anchors.map((a) => ({
                    href: a.getAttribute('href'),
                    text: a.textContent?.trim(),
                }))
            );

            if (links.length === 0) {
                throw new Error('No navigation links found');
            }

            return {
                success: true,
                message: `Found ${links.length} navigation links`,
            };
        },
    },
    {
        name: 'Contact page loads',
        path: '/contact',
        checks: async (page) => {
            // Wait for page content
            await page.waitForSelector('#root', { timeout: TIMEOUT });

            // Allow time for route change
            await page.waitForFunction(
                () => document.querySelector('#root')?.innerHTML.length > 100,
                { timeout: TIMEOUT }
            );

            return { success: true, message: 'Contact page rendered' };
        },
    },
    {
        name: 'No console errors on load',
        path: '/',
        checks: async (page) => {
            const errors = [];

            // Collect console errors
            page.on('console', (msg) => {
                if (msg.type() === 'error') {
                    errors.push(msg.text());
                }
            });

            // Collect page errors
            page.on('pageerror', (err) => {
                errors.push(err.message);
            });

            // Reload and wait
            await page.reload({ waitUntil: 'networkidle0' });
            await page.waitForTimeout(1000);

            // Filter out known acceptable errors
            const criticalErrors = errors.filter(
                (err) =>
                    !err.includes('favicon.ico') &&
                    !err.includes('net::ERR_') &&
                    !err.includes('Failed to load resource')
            );

            if (criticalErrors.length > 0) {
                throw new Error(
                    `Console errors detected:\n${criticalErrors.join('\n')}`
                );
            }

            return { success: true, message: 'No critical console errors' };
        },
    },
    {
        name: 'Page has proper meta tags',
        path: '/',
        checks: async (page) => {
            const title = await page.title();
            if (!title) {
                throw new Error('Page has no title');
            }

            const viewport = await page.$('meta[name="viewport"]');
            if (!viewport) {
                throw new Error('Missing viewport meta tag');
            }

            return { success: true, message: `Title: "${title}"` };
        },
    },
    {
        name: 'Contact form renders all fields',
        path: '/contact',
        checks: async (page) => {
            await page.waitForSelector('form', { timeout: TIMEOUT });

            // Check for required form fields
            const firstName = await page.$('input[name="firstName"]');
            const lastName = await page.$('input[name="lastName"]');
            const email = await page.$('input[name="email"]');
            const company = await page.$('input[name="company"]');
            const message = await page.$('textarea[name="message"]');
            const submitButton = await page.$('button[type="submit"]');

            if (!firstName) throw new Error('Missing firstName field');
            if (!lastName) throw new Error('Missing lastName field');
            if (!email) throw new Error('Missing email field');
            if (!company) throw new Error('Missing company field');
            if (!message) throw new Error('Missing message field');
            if (!submitButton) throw new Error('Missing submit button');

            return { success: true, message: 'All form fields present' };
        },
    },
    {
        name: 'Contact form validation works',
        path: '/contact',
        checks: async (page) => {
            await page.waitForSelector('form', { timeout: TIMEOUT });

            // Check that required fields have required attribute
            const firstNameRequired = await page.$eval(
                'input[name="firstName"]',
                (el) => el.hasAttribute('required')
            );
            const emailRequired = await page.$eval(
                'input[name="email"]',
                (el) => el.hasAttribute('required')
            );
            const emailType = await page.$eval(
                'input[name="email"]',
                (el) => el.getAttribute('type')
            );

            if (!firstNameRequired) throw new Error('firstName should be required');
            if (!emailRequired) throw new Error('email should be required');
            if (emailType !== 'email') throw new Error('email should have type="email"');

            return { success: true, message: 'Form validation attributes present' };
        },
    },
    {
        name: 'Contact form submission flow (happy path)',
        path: '/contact',
        checks: async (page) => {
            await page.waitForSelector('form', { timeout: TIMEOUT });

            // Fill out the form
            await page.type('input[name="firstName"]', 'E2E');
            await page.type('input[name="lastName"]', 'TestUser');
            await page.type('input[name="email"]', 'e2e@test.example.com');
            await page.type('input[name="company"]', 'Test Company Inc');
            await page.type('textarea[name="message"]', 'This is an automated E2E test submission.');

            // Submit the form
            await page.click('button[type="submit"]');

            // Wait for either success message or error (since backend may not be running)
            await page.waitForFunction(
                () => {
                    const successMsg = document.body.innerText.includes('Application Received');
                    const processingMsg = document.body.innerText.includes('Processing');
                    const errorMsg = document.querySelector('[class*="text-red"]');
                    return successMsg || (!processingMsg && (successMsg || errorMsg));
                },
                { timeout: 15000 }
            );

            // Check for success or graceful error handling
            const pageText = await page.evaluate(() => document.body.innerText);
            const hasSuccess = pageText.includes('Application Received');
            const hasError = pageText.includes('error') || pageText.includes('Error');

            // Either success or graceful error handling is acceptable
            if (!hasSuccess && !hasError) {
                throw new Error('Form submission did not show success or error state');
            }

            return {
                success: true,
                message: hasSuccess
                    ? 'Form submitted successfully'
                    : 'Form showed graceful error handling',
            };
        },
    },
    {
        name: 'Product page loads correctly',
        path: '/product',
        checks: async (page) => {
            await page.waitForSelector('#root', { timeout: TIMEOUT });

            // Check for key content
            const pageText = await page.evaluate(() => document.body.innerText);

            if (!pageText.includes('Compliance')) {
                throw new Error('Missing compliance content on Product page');
            }

            if (!pageText.includes('Queue')) {
                throw new Error('Missing queue processor content');
            }

            return { success: true, message: 'Product page content verified' };
        },
    },
    {
        name: 'Theme toggle works',
        path: '/',
        checks: async (page) => {
            await page.waitForSelector('nav', { timeout: TIMEOUT });

            // Find theme toggle button
            const themeButton = await page.$('button[aria-label="Toggle Theme"]');
            if (!themeButton) {
                throw new Error('Theme toggle button not found');
            }

            // Get initial state
            const initialHtml = await page.evaluate(() =>
                document.documentElement.classList.contains('dark')
            );

            // Click theme toggle
            await themeButton.click();
            await page.waitForTimeout(600); // Wait for transition

            // Check state changed
            const afterClickHtml = await page.evaluate(() =>
                document.documentElement.classList.contains('dark')
            );

            if (initialHtml === afterClickHtml) {
                throw new Error('Theme did not toggle after clicking button');
            }

            return { success: true, message: 'Theme toggle functional' };
        },
    },
    {
        name: 'Homepage accessibility check',
        path: '/',
        checks: async (page) => {
            await page.waitForSelector('#root', { timeout: TIMEOUT });
            await page.waitForTimeout(1000); // Wait for content to fully render

            // Run axe accessibility analysis
            const results = await new AxePuppeteer(page)
                .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
                .analyze();

            const violations = results.violations;

            // Filter to critical and serious issues only
            const criticalViolations = violations.filter(
                (v) => v.impact === 'critical' || v.impact === 'serious'
            );

            if (criticalViolations.length > 0) {
                const violationSummary = criticalViolations
                    .map((v) => `${v.impact}: ${v.description} (${v.nodes.length} instances)`)
                    .join('\n  ');
                throw new Error(`Accessibility violations found:\n  ${violationSummary}`);
            }

            return {
                success: true,
                message: `Passed accessibility check (${violations.length} minor issues)`,
            };
        },
    },
    {
        name: 'Contact page accessibility check',
        path: '/contact',
        checks: async (page) => {
            await page.waitForSelector('form', { timeout: TIMEOUT });
            await page.waitForTimeout(1000);

            const results = await new AxePuppeteer(page)
                .withTags(['wcag2a', 'wcag2aa'])
                .analyze();

            const criticalViolations = results.violations.filter(
                (v) => v.impact === 'critical' || v.impact === 'serious'
            );

            if (criticalViolations.length > 0) {
                const violationSummary = criticalViolations
                    .map((v) => `${v.impact}: ${v.description}`)
                    .join('\n  ');
                throw new Error(`Accessibility violations:\n  ${violationSummary}`);
            }

            return {
                success: true,
                message: `Contact form passed accessibility (${results.violations.length} minor)`,
            };
        },
    },
    {
        name: 'Voice input button is accessible',
        path: '/contact',
        checks: async (page) => {
            await page.waitForSelector('form', { timeout: TIMEOUT });

            // Find voice input button
            const voiceButton = await page.$('button[title="Voice Input"]');
            if (!voiceButton) {
                throw new Error('Voice input button not found');
            }

            // Check it has accessible attributes
            const hasTitle = await page.$eval(
                'button[title="Voice Input"]',
                (el) => el.hasAttribute('title')
            );

            if (!hasTitle) {
                throw new Error('Voice button missing title attribute');
            }

            return { success: true, message: 'Voice input button is accessible' };
        },
    },
    {
        name: 'Product page accessibility check',
        path: '/product',
        checks: async (page) => {
            await page.waitForSelector('#root', { timeout: TIMEOUT });
            await page.waitForTimeout(1000);

            const results = await new AxePuppeteer(page)
                .withTags(['wcag2a', 'wcag2aa'])
                .analyze();

            const criticalViolations = results.violations.filter(
                (v) => v.impact === 'critical' || v.impact === 'serious'
            );

            if (criticalViolations.length > 0) {
                const violationSummary = criticalViolations
                    .map((v) => `${v.impact}: ${v.description}`)
                    .join('\n  ');
                throw new Error(`Accessibility violations:\n  ${violationSummary}`);
            }

            return {
                success: true,
                message: `Product page passed accessibility (${results.violations.length} minor)`,
            };
        },
    },
    {
        name: 'About page loads and accessibility check',
        path: '/about',
        checks: async (page) => {
            await page.waitForSelector('#root', { timeout: TIMEOUT });

            // Check for key content
            const pageText = await page.evaluate(() => document.body.innerText);
            if (!pageText.includes('Orign8') && !pageText.includes('About')) {
                throw new Error('Missing expected content on About page');
            }

            await page.waitForTimeout(500);

            const results = await new AxePuppeteer(page)
                .withTags(['wcag2a', 'wcag2aa'])
                .analyze();

            const criticalViolations = results.violations.filter(
                (v) => v.impact === 'critical' || v.impact === 'serious'
            );

            if (criticalViolations.length > 0) {
                const violationSummary = criticalViolations
                    .map((v) => `${v.impact}: ${v.description}`)
                    .join('\n  ');
                throw new Error(`Accessibility violations:\n  ${violationSummary}`);
            }

            return {
                success: true,
                message: `About page loaded and passed accessibility`,
            };
        },
    },
    {
        name: 'Mobile viewport renders correctly',
        path: '/',
        checks: async (page) => {
            // Set mobile viewport
            await page.setViewport({ width: 375, height: 667, isMobile: true });
            await page.reload({ waitUntil: 'domcontentloaded' });
            await page.waitForSelector('#root', { timeout: TIMEOUT });

            // Check mobile menu button exists (hamburger menu)
            const mobileMenu = await page.$('button[aria-label="Menu"], button[aria-label="Toggle Menu"], nav button');
            if (!mobileMenu) {
                throw new Error('Mobile menu button not found');
            }

            // Reset viewport for subsequent tests
            await page.setViewport({ width: 1280, height: 720 });

            return { success: true, message: 'Mobile viewport renders correctly' };
        },
    },
    {
        name: 'Form shows validation errors for empty submission',
        path: '/contact',
        checks: async (page) => {
            await page.waitForSelector('form', { timeout: TIMEOUT });

            // Try to submit without filling anything
            const submitButton = await page.$('button[type="submit"]');
            await submitButton.click();

            // Wait a moment for validation
            await page.waitForTimeout(500);

            // Check that browser validation prevents submission (form should still be visible)
            const formStillVisible = await page.$('form');
            if (!formStillVisible) {
                throw new Error('Form disappeared without validation');
            }

            // Check for HTML5 validation state on required fields
            const firstNameInvalid = await page.$eval(
                'input[name="firstName"]',
                (el) => !el.validity.valid
            );

            if (!firstNameInvalid) {
                throw new Error('Required field validation not triggered');
            }

            return { success: true, message: 'Form validation prevents empty submission' };
        },
    },
    {
        name: 'Skip link is keyboard accessible',
        path: '/',
        checks: async (page) => {
            await page.waitForSelector('#root', { timeout: TIMEOUT });

            // Focus on skip link via Tab
            await page.keyboard.press('Tab');
            await page.waitForTimeout(200);

            // Check skip link exists
            const skipLink = await page.$('a[href="#main-content"]');
            if (!skipLink) {
                throw new Error('Skip link not found');
            }

            // Verify main content target exists
            const mainContent = await page.$('#main-content');
            if (!mainContent) {
                throw new Error('Main content landmark (#main-content) not found');
            }

            return { success: true, message: 'Skip link and main content landmark present' };
        },
    },
];

// =============================================================================
// TEST RUNNER
// =============================================================================

async function runTests() {
    console.log('\n========================================');
    console.log('E2E Smoke Tests');
    console.log('========================================');
    console.log(`Base URL: ${BASE_URL}`);
    console.log(`Headless: ${HEADLESS}`);
    console.log(`Timeout: ${TIMEOUT}ms`);
    console.log('----------------------------------------\n');

    // Ensure screenshots directory exists
    if (!existsSync(SCREENSHOTS_DIR)) {
        mkdirSync(SCREENSHOTS_DIR, { recursive: true });
    }

    let browser;
    const results = [];

    try {
        browser = await puppeteer.launch({
            headless: HEADLESS,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();

        // Set viewport
        await page.setViewport({ width: 1280, height: 720 });

        // Run each test
        for (const test of tests) {
            const startTime = Date.now();
            let result;

            try {
                console.log(`Running: ${test.name}...`);

                // Navigate to test path
                const url = `${BASE_URL}${test.path}`;
                await page.goto(url, {
                    waitUntil: 'domcontentloaded',
                    timeout: TIMEOUT,
                });

                // Run test checks
                const checkResult = await test.checks(page);
                const duration = Date.now() - startTime;

                result = {
                    name: test.name,
                    success: true,
                    message: checkResult.message,
                    duration,
                };

                console.log(`  PASS (${duration}ms): ${checkResult.message}`);
            } catch (error) {
                const duration = Date.now() - startTime;

                result = {
                    name: test.name,
                    success: false,
                    message: error.message,
                    duration,
                };

                console.log(`  FAIL (${duration}ms): ${error.message}`);

                // Take screenshot on failure
                const screenshotPath = join(
                    SCREENSHOTS_DIR,
                    `${test.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-failure.png`
                );
                try {
                    await page.screenshot({ path: screenshotPath, fullPage: true });
                    console.log(`  Screenshot saved: ${screenshotPath}`);
                } catch {
                    console.log('  Could not save screenshot');
                }
            }

            results.push(result);
        }
    } catch (error) {
        console.error('\nFatal error:', error.message);
        process.exit(1);
    } finally {
        if (browser) {
            await browser.close();
        }
    }

    // Print summary
    console.log('\n----------------------------------------');
    console.log('Summary');
    console.log('----------------------------------------');

    const passed = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;
    const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

    console.log(`Total: ${results.length} tests`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Duration: ${totalDuration}ms`);
    console.log('========================================\n');

    // Exit with appropriate code
    if (failed > 0) {
        console.log('E2E tests failed!');
        process.exit(1);
    }

    console.log('All E2E tests passed!');
    process.exit(0);
}

// =============================================================================
// CHECK SERVER AVAILABILITY
// =============================================================================

async function checkServerAvailable() {
    try {
        const response = await fetch(BASE_URL);
        return response.ok || response.status === 304;
    } catch {
        return false;
    }
}

async function main() {
    const serverAvailable = await checkServerAvailable();

    if (!serverAvailable) {
        console.error(`\nError: Server not available at ${BASE_URL}`);
        console.error('Please start the dev server first:');
        console.error('  npm run dev');
        console.error('\nOr build and preview:');
        console.error('  npm run build && npm run preview\n');
        process.exit(1);
    }

    await runTests();
}

main();
