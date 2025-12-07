/**
 * Error Monitoring Service
 *
 * This module provides error tracking and monitoring capabilities using Sentry.
 *
 * Setup instructions:
 * 1. Add VITE_SENTRY_DSN to your .env.local
 * 2. Optionally set VITE_APP_VERSION for release tracking
 */

import * as Sentry from '@sentry/react';

// =============================================================================
// TYPES
// =============================================================================

interface ErrorContext {
    componentStack?: string;
    tags?: Record<string, string>;
    extra?: Record<string, unknown>;
    user?: {
        id?: string;
        email?: string;
    };
}

interface MonitoringConfig {
    dsn?: string;
    environment: string;
    release?: string;
    enabled: boolean;
}

// =============================================================================
// CONFIGURATION
// =============================================================================

const config: MonitoringConfig = {
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE || 'development',
    release: import.meta.env.VITE_APP_VERSION,
    // Enable in production and staging (when DSN is provided)
    enabled: !!import.meta.env.VITE_SENTRY_DSN && !import.meta.env.DEV,
};

// =============================================================================
// SENTRY INITIALIZATION
// =============================================================================

if (config.enabled && config.dsn) {
    Sentry.init({
        dsn: config.dsn,
        environment: config.environment,
        release: config.release,
        integrations: [
            Sentry.browserTracingIntegration(),
            Sentry.replayIntegration({
                maskAllText: true,
                blockAllMedia: true,
            }),
        ],
        // Performance Monitoring
        tracesSampleRate: config.environment === 'production' ? 0.1 : 1.0,
        // Session Replay
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
        // Filter out common non-errors
        ignoreErrors: [
            'ResizeObserver loop limit exceeded',
            'ResizeObserver loop completed with undelivered notifications',
            'Non-Error promise rejection captured',
        ],
    });
}

// =============================================================================
// ERROR CAPTURE
// =============================================================================

/**
 * Capture an error and send to monitoring service
 */
export function captureError(error: Error, context?: ErrorContext): void {
    // Always log to console in development
    if (import.meta.env.DEV) {
        console.error('[Monitoring] Error captured:', error);
        if (context) {
            // Don't log user context (PII) even in dev
            const { user: _user, ...safeContext } = context;
            console.error('[Monitoring] Context:', safeContext);
        }
    }

    // Send to Sentry if configured
    if (config.enabled) {
        Sentry.withScope((scope) => {
            // Set user context if provided
            if (context?.user) {
                scope.setUser(context.user);
            }
            // Set tags
            if (context?.tags) {
                Object.entries(context.tags).forEach(([key, value]) => {
                    scope.setTag(key, value);
                });
            }
            // Set extra context
            if (context?.extra) {
                scope.setExtras(context.extra);
            }
            Sentry.captureException(error);
        });
    }
}

/**
 * Capture a message/event
 */
export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
    if (import.meta.env.DEV) {
        console.log(`[Monitoring] ${level.toUpperCase()}: ${message}`);
    }

    if (config.enabled) {
        Sentry.captureMessage(message, level);
    }
}

// =============================================================================
// USER CONTEXT
// =============================================================================

/**
 * Set user context for error tracking
 */
export function setUser(user: { id?: string; email?: string } | null): void {
    if (config.enabled) {
        Sentry.setUser(user);
    }
}

/**
 * Clear user context (on logout)
 */
export function clearUser(): void {
    if (config.enabled) {
        Sentry.setUser(null);
    }
}

// =============================================================================
// CUSTOM TAGS & CONTEXT
// =============================================================================

/**
 * Set a custom tag for all subsequent errors
 */
export function setTag(key: string, value: string): void {
    if (config.enabled) {
        Sentry.setTag(key, value);
    }
}

/**
 * Set additional context data
 */
export function setContext(name: string, context: Record<string, unknown>): void {
    if (config.enabled) {
        Sentry.setContext(name, context);
    }
}

// =============================================================================
// PERFORMANCE MONITORING
// =============================================================================

/**
 * Start a performance span (updated for Sentry v8+)
 */
export function startTransaction(name: string, op: string): { finish: () => void } {
    if (config.enabled) {
        const span = Sentry.startInactiveSpan({ name, op });
        return { finish: () => span?.end() };
    }

    // No-op fallback
    return { finish: () => {} };
}

// =============================================================================
// GLOBAL ERROR HANDLERS
// =============================================================================

// Track if handlers have been initialized to prevent duplicates
let globalHandlersInitialized = false;

/**
 * Handle unhandled promise rejections
 */
function handleUnhandledRejection(event: PromiseRejectionEvent): void {
    // Preserve the original error if it's an Error instance
    const error = event.reason instanceof Error
        ? event.reason
        : new Error(String(event.reason));

    captureError(error, {
        tags: { type: 'unhandledrejection' },
        extra: { originalReason: event.reason },
    });
}

/**
 * Handle global errors
 */
function handleGlobalError(event: ErrorEvent): void {
    captureError(event.error || new Error(event.message), {
        tags: { type: 'global-error' },
        extra: {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
        },
    });
}

/**
 * Initialize global error handlers (idempotent - safe to call multiple times)
 */
export function initGlobalErrorHandlers(): void {
    if (globalHandlersInitialized) {
        return;
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleGlobalError);

    globalHandlersInitialized = true;
}

// =============================================================================
// SENTRY ERROR BOUNDARY (for React components)
// =============================================================================

export const SentryErrorBoundary = Sentry.ErrorBoundary;

// =============================================================================
// EXPORTS
// =============================================================================

export const monitoring = {
    captureError,
    captureMessage,
    setUser,
    clearUser,
    setTag,
    setContext,
    startTransaction,
    initGlobalErrorHandlers,
    isEnabled: config.enabled,
    ErrorBoundary: Sentry.ErrorBoundary,
};

export default monitoring;
