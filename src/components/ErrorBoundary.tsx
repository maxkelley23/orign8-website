import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { captureError } from '../services/monitoring';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        this.setState({ errorInfo });

        // Log error to console in development
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        // Send error to Sentry monitoring service
        captureError(error, {
            componentStack: errorInfo.componentStack || undefined,
            tags: { source: 'error-boundary' },
            extra: {
                componentStack: errorInfo.componentStack,
                digest: errorInfo.digest,
            },
        });
    }

    handleReset = (): void => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    handleReload = (): void => {
        window.location.reload();
    };

    render(): ReactNode {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
                    <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 text-center border border-slate-200 dark:border-slate-800">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                        </div>

                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                            Something went wrong
                        </h1>

                        <p className="text-slate-500 dark:text-slate-400 mb-6">
                            We're sorry, but something unexpected happened. Please try refreshing the page.
                        </p>

                        {/* Show error details in development */}
                        {import.meta.env.DEV && this.state.error && (
                            <details className="mb-6 text-left">
                                <summary className="cursor-pointer text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300">
                                    Error details
                                </summary>
                                <div className="mt-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-auto max-h-40">
                                    <code className="text-xs text-red-600 dark:text-red-400 whitespace-pre-wrap">
                                        {this.state.error.toString()}
                                        {this.state.errorInfo?.componentStack && (
                                            <>
                                                {'\n\nComponent Stack:'}
                                                {this.state.errorInfo.componentStack}
                                            </>
                                        )}
                                    </code>
                                </div>
                            </details>
                        )}

                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={this.handleReset}
                                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            >
                                Try again
                            </button>
                            <button
                                onClick={this.handleReload}
                                className="px-4 py-2 text-sm font-medium text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors flex items-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Reload page
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Higher-order component for functional component error boundaries
export function withErrorBoundary<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    fallback?: ReactNode
): React.FC<P> {
    return function WithErrorBoundaryWrapper(props: P) {
        return (
            <ErrorBoundary fallback={fallback}>
                <WrappedComponent {...props} />
            </ErrorBoundary>
        );
    };
}
