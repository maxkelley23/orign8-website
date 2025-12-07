/**
 * Analytics Service
 *
 * Pluggable analytics tracking for pageviews and custom events.
 * Supports GA4, Plausible, or custom analytics backends.
 *
 * Setup instructions:
 * 1. For GA4: Set VITE_GA4_MEASUREMENT_ID in your .env.local
 * 2. For Plausible: Set VITE_PLAUSIBLE_DOMAIN in your .env.local
 * 3. Events are automatically logged to console in development
 */

// =============================================================================
// TYPES
// =============================================================================

export interface AnalyticsEvent {
    name: string;
    properties?: Record<string, string | number | boolean>;
}

export interface PageViewEvent {
    path: string;
    title?: string;
    referrer?: string;
}

// =============================================================================
// CONFIGURATION
// =============================================================================

const GA4_MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID;
const PLAUSIBLE_DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN;

const isProduction = import.meta.env.PROD;
const isDevelopment = import.meta.env.DEV;

// Check which analytics provider is configured
const useGA4 = !!GA4_MEASUREMENT_ID;
const usePlausible = !!PLAUSIBLE_DOMAIN;

// Track script loading state
let ga4Ready = false;
let plausibleReady = false;

// =============================================================================
// GA4 INTEGRATION
// =============================================================================

declare global {
    interface Window {
        gtag?: (...args: unknown[]) => void;
        dataLayer?: unknown[];
        plausible?: (event: string, options?: { props?: Record<string, string | number | boolean> }) => void;
    }
}

/**
 * Initialize GA4 tracking (call once on app startup)
 */
export function initGA4(): Promise<void> {
    return new Promise((resolve) => {
        if (!useGA4 || !isProduction) {
            resolve();
            return;
        }

        // Initialize gtag before script loads to queue events
        window.dataLayer = window.dataLayer || [];
        window.gtag = function gtag(...args: unknown[]) {
            window.dataLayer?.push(args);
        };

        // Load GA4 script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;

        script.onload = () => {
            window.gtag?.('js', new Date());
            window.gtag?.('config', GA4_MEASUREMENT_ID, {
                send_page_view: false, // We'll track manually for SPA
            });
            ga4Ready = true;
            resolve();
        };

        script.onerror = () => {
            if (isDevelopment) {
                console.warn('[Analytics] Failed to load GA4 script');
            }
            resolve();
        };

        document.head.appendChild(script);
    });
}

/**
 * Initialize Plausible tracking (call once on app startup)
 */
export function initPlausible(): Promise<void> {
    return new Promise((resolve) => {
        if (!usePlausible || !isProduction) {
            resolve();
            return;
        }

        // Load Plausible script
        const script = document.createElement('script');
        script.defer = true;
        script.dataset.domain = PLAUSIBLE_DOMAIN;
        script.src = 'https://plausible.io/js/script.js';

        script.onload = () => {
            plausibleReady = true;
            resolve();
        };

        script.onerror = () => {
            if (isDevelopment) {
                console.warn('[Analytics] Failed to load Plausible script');
            }
            resolve();
        };

        document.head.appendChild(script);
    });
}

// =============================================================================
// EVENT TRACKING
// =============================================================================

/**
 * Sanitize properties to remove PII before logging
 */
function sanitizeForLog(properties: Record<string, string | number | boolean>): Record<string, string | number | boolean> {
    const piiKeys = ['email', 'phone', 'name', 'firstName', 'lastName', 'address', 'nmls', 'nmlsId'];
    const sanitized: Record<string, string | number | boolean> = {};

    for (const [key, value] of Object.entries(properties)) {
        if (piiKeys.some(pii => key.toLowerCase().includes(pii.toLowerCase()))) {
            sanitized[key] = '[REDACTED]';
        } else {
            sanitized[key] = value;
        }
    }

    return sanitized;
}

/**
 * Track a custom event
 */
export function trackEvent(event: AnalyticsEvent): void {
    const { name, properties = {} } = event;

    // Log sanitized version in development
    if (isDevelopment) {
        console.log('[Analytics] Event:', name, sanitizeForLog(properties));
    }

    // GA4 tracking (check ready state)
    if (useGA4 && ga4Ready && window.gtag) {
        window.gtag('event', name, properties);
    }

    // Plausible tracking (check ready state)
    if (usePlausible && plausibleReady && window.plausible) {
        window.plausible(name, { props: properties });
    }
}

/**
 * Track a page view (for SPA routing)
 * Note: Plausible auto-tracks initial pageview, so we only trigger for SPA navigation
 */
let initialPageViewTracked = false;

export function trackPageView(event: PageViewEvent): void {
    const { path, title } = event;

    // Log in development (path is not PII)
    if (isDevelopment) {
        console.log('[Analytics] PageView:', path);
    }

    // GA4 page view (check ready state)
    if (useGA4 && ga4Ready && window.gtag) {
        window.gtag('event', 'page_view', {
            page_path: path,
            page_title: title || document.title,
        });
    }

    // Plausible: Only trigger manual pageview for SPA navigation (not initial load)
    // Plausible script auto-tracks the initial pageview
    if (usePlausible && plausibleReady && window.plausible && initialPageViewTracked) {
        window.plausible('pageview');
    }

    initialPageViewTracked = true;
}

// =============================================================================
// PREDEFINED EVENTS
// =============================================================================

/**
 * Track when a lead form is submitted
 */
export function trackLeadSubmitted(properties?: {
    company?: string;
    hasNmls?: boolean;
    source?: string;
}): void {
    trackEvent({
        name: 'lead_submitted',
        properties: {
            ...properties,
            timestamp: Date.now(),
        },
    });
}

/**
 * Track when voice transcription is started
 */
export function trackVoiceTranscriptionStarted(): void {
    trackEvent({
        name: 'voice_transcription_started',
        properties: {
            timestamp: Date.now(),
        },
    });
}

/**
 * Track when voice transcription completes
 */
export function trackVoiceTranscriptionCompleted(properties?: {
    success: boolean;
    durationMs?: number;
}): void {
    trackEvent({
        name: 'voice_transcription_completed',
        properties: {
            ...properties,
            timestamp: Date.now(),
        },
    });
}

/**
 * Track CTA button clicks
 */
export function trackCtaClick(properties: {
    ctaName: string;
    location: string;
}): void {
    trackEvent({
        name: 'cta_click',
        properties,
    });
}

/**
 * Track theme toggle
 */
export function trackThemeToggle(newTheme: 'light' | 'dark'): void {
    trackEvent({
        name: 'theme_toggle',
        properties: {
            new_theme: newTheme,
        },
    });
}

/**
 * Track demo interaction on home page
 */
export function trackDemoInteraction(action: string): void {
    trackEvent({
        name: 'demo_interaction',
        properties: {
            action,
        },
    });
}

// =============================================================================
// INITIALIZATION
// =============================================================================

/**
 * Initialize analytics (call once on app startup)
 * Returns a promise that resolves when all analytics scripts are loaded
 */
export async function initAnalytics(): Promise<void> {
    if (isDevelopment) {
        console.log('[Analytics] Initializing in development mode');
        console.log('[Analytics] GA4:', useGA4 ? 'configured' : 'not configured');
        console.log('[Analytics] Plausible:', usePlausible ? 'configured' : 'not configured');
    }

    await Promise.all([initGA4(), initPlausible()]);
}

// =============================================================================
// EXPORTS
// =============================================================================

export const analytics = {
    init: initAnalytics,
    trackEvent,
    trackPageView,
    trackLeadSubmitted,
    trackVoiceTranscriptionStarted,
    trackVoiceTranscriptionCompleted,
    trackCtaClick,
    trackThemeToggle,
    trackDemoInteraction,
    isConfigured: useGA4 || usePlausible,
};

export default analytics;
