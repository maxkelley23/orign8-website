import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Product } from '@/pages/Product';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Wrapper component for tests
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <BrowserRouter>
        <ThemeProvider>
            {children}
        </ThemeProvider>
    </BrowserRouter>
);

describe('Product Page', () => {
    describe('Hero Section', () => {
        it('renders main headline', () => {
            render(<Product />, { wrapper: TestWrapper });

            expect(screen.getByText(/the core platform for/i)).toBeInTheDocument();
            expect(screen.getByText(/compliance-first growth/i)).toBeInTheDocument();
        });

        it('renders Orign8 Suite badge', () => {
            render(<Product />, { wrapper: TestWrapper });

            expect(screen.getByText(/orign8 suite/i)).toBeInTheDocument();
        });

        it('renders product description', () => {
            render(<Product />, { wrapper: TestWrapper });

            expect(screen.getByText(/enterprise-grade queue processing/i)).toBeInTheDocument();
        });
    });

    describe('Compliance Engine Feature', () => {
        it('renders compliance engine heading', () => {
            render(<Product />, { wrapper: TestWrapper });

            expect(screen.getByText(/the compliance engine/i)).toBeInTheDocument();
        });

        it('renders compliance description', () => {
            render(<Product />, { wrapper: TestWrapper });

            expect(screen.getByText(/calling windows.*8am-9pm local/i)).toBeInTheDocument();
        });

        it('renders compliance features list', () => {
            render(<Product />, { wrapper: TestWrapper });

            expect(screen.getByText(/timezone awareness/i)).toBeInTheDocument();
            expect(screen.getByText(/frequency caps.*max 3 calls\/day/i)).toBeInTheDocument();
            expect(screen.getByText(/state-specific logic.*louisiana laws/i)).toBeInTheDocument();
        });
    });

    describe('Queue Processor Feature', () => {
        it('renders queue processor heading', () => {
            render(<Product />, { wrapper: TestWrapper });

            expect(screen.getByText(/resilient queue processor/i)).toBeInTheDocument();
        });

        it('renders queue processor description', () => {
            render(<Product />, { wrapper: TestWrapper });

            expect(screen.getByText(/circuit breakers/i)).toBeInTheDocument();
        });

        it('renders queue processor tags', () => {
            render(<Product />, { wrapper: TestWrapper });

            expect(screen.getByText(/concurrency control/i)).toBeInTheDocument();
            expect(screen.getByText(/smart retries/i)).toBeInTheDocument();
            expect(screen.getByText(/99\.9% uptime/i)).toBeInTheDocument();
        });
    });

    describe('CRM Integration Feature', () => {
        it('renders CRM sync heading', () => {
            render(<Product />, { wrapper: TestWrapper });

            expect(screen.getByText(/total crm sync/i)).toBeInTheDocument();
        });

        it('renders CRM integration description', () => {
            render(<Product />, { wrapper: TestWrapper });

            // Total Expert appears multiple times on the page (in feature and in badges)
            const totalExpertMatches = screen.getAllByText(/total expert/i);
            expect(totalExpertMatches.length).toBeGreaterThan(0);
            expect(screen.getByText(/bi-directional integration/i)).toBeInTheDocument();
        });
    });

    describe('Live Transcript Demo', () => {
        it('renders live transcript header', () => {
            render(<Product />, { wrapper: TestWrapper });

            expect(screen.getByText(/live transcript/i)).toBeInTheDocument();
        });

        it('renders active status indicator', () => {
            render(<Product />, { wrapper: TestWrapper });

            expect(screen.getByText(/active/i)).toBeInTheDocument();
        });

        it('renders AI conversation messages', () => {
            render(<Product />, { wrapper: TestWrapper });

            // AI greeting message
            expect(screen.getByText(/hi sarah.*orign8 mortgage/i)).toBeInTheDocument();
        });

        it('renders customer response', () => {
            render(<Product />, { wrapper: TestWrapper });

            expect(screen.getByText(/\$450k.*worried about where rates are/i)).toBeInTheDocument();
        });

        it('renders AI follow-up response', () => {
            render(<Product />, { wrapper: TestWrapper });

            expect(screen.getByText(/rate buydowns/i)).toBeInTheDocument();
        });

        it('renders call transfer notification', () => {
            render(<Product />, { wrapper: TestWrapper });

            expect(screen.getByText(/call transferred to senior loan officer/i)).toBeInTheDocument();
        });
    });

    describe('Technology Stack Tags', () => {
        it('renders Total Expert integration badge', () => {
            render(<Product />, { wrapper: TestWrapper });

            // Look for Total Expert text in floating tag
            const totalExpertBadges = screen.getAllByText(/total expert/i);
            expect(totalExpertBadges.length).toBeGreaterThan(0);
        });

        it('renders TCPA Compliant badge', () => {
            render(<Product />, { wrapper: TestWrapper });

            expect(screen.getByText(/tcpa compliant/i)).toBeInTheDocument();
        });
    });

    describe('Bottom CTA Section', () => {
        it('renders CTA heading', () => {
            render(<Product />, { wrapper: TestWrapper });

            expect(screen.getByText(/ready to deploy\?/i)).toBeInTheDocument();
        });

        it('renders CTA description', () => {
            render(<Product />, { wrapper: TestWrapper });

            expect(screen.getByText(/custom demo.*tailored to your specific volume/i)).toBeInTheDocument();
        });

        it('renders Build Your Agent button', () => {
            render(<Product />, { wrapper: TestWrapper });

            expect(screen.getByText(/build your agent/i)).toBeInTheDocument();
        });

        it('CTA button links to contact page', () => {
            render(<Product />, { wrapper: TestWrapper });

            const ctaButton = screen.getByText(/build your agent/i).closest('a');
            expect(ctaButton).toHaveAttribute('href', '/contact');
        });
    });

    describe('Accessibility', () => {
        it('has proper heading hierarchy', () => {
            render(<Product />, { wrapper: TestWrapper });

            // Should have h1 for main headline
            const mainHeadline = screen.getByRole('heading', { level: 1 });
            expect(mainHeadline).toBeInTheDocument();
        });

        it('feature icons have implicit association', () => {
            render(<Product />, { wrapper: TestWrapper });

            // Feature sections should have headings
            const complianceHeading = screen.getByText(/the compliance engine/i);
            const queueHeading = screen.getByText(/resilient queue processor/i);
            const crmHeading = screen.getByText(/total crm sync/i);

            expect(complianceHeading).toBeInTheDocument();
            expect(queueHeading).toBeInTheDocument();
            expect(crmHeading).toBeInTheDocument();
        });

        it('buttons are accessible', () => {
            render(<Product />, { wrapper: TestWrapper });

            const buttons = screen.getAllByRole('button');
            buttons.forEach(button => {
                expect(button).toBeVisible();
            });
        });
    });

    describe('Dark Mode Support', () => {
        it('has dark mode classes', () => {
            render(<Product />, { wrapper: TestWrapper });

            // The main container should have dark mode transition classes
            const mainContainer = document.querySelector('.dark\\:bg-slate-950');
            expect(mainContainer).toBeInTheDocument();
        });
    });

    describe('Responsive Design', () => {
        it('uses responsive grid classes', () => {
            render(<Product />, { wrapper: TestWrapper });

            // Check for responsive grid container
            const gridContainer = document.querySelector('.lg\\:col-span-7');
            expect(gridContainer).toBeInTheDocument();
        });
    });
});
