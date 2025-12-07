import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Home } from '@/pages/Home';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Mock fetch for image generation API
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Wrapper component for tests
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <BrowserRouter>
        <ThemeProvider>
            {children}
        </ThemeProvider>
    </BrowserRouter>
);

describe('Home Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers({ shouldAdvanceTime: true });

        // Default mock for image generation - return success with placeholder
        mockFetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({
                candidates: [{
                    content: {
                        parts: [{
                            inlineData: {
                                data: 'base64imagedata'
                            }
                        }]
                    }
                }]
            })
        });
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    describe('Hero Section', () => {
        it('renders main headline', () => {
            render(<Home />, { wrapper: TestWrapper });

            // May have multiple matches for partial text
            expect(screen.getAllByText(/built by lenders/i).length).toBeGreaterThan(0);
            expect(screen.getAllByText(/for lenders/i).length).toBeGreaterThan(0);
        });

        it('renders hero description', () => {
            render(<Home />, { wrapper: TestWrapper });

            expect(screen.getByText(/orign8 deploys hyper-realistic voice ai agents/i)).toBeInTheDocument();
        });

        it('renders CTA buttons', () => {
            render(<Home />, { wrapper: TestWrapper });

            // CTA buttons may appear multiple times on page
            expect(screen.getAllByText(/start growing/i).length).toBeGreaterThan(0);
            expect(screen.getAllByText(/platform tour/i).length).toBeGreaterThan(0);
        });

        it('renders Q4 cohort badge', () => {
            render(<Home />, { wrapper: TestWrapper });

            expect(screen.getByText(/now enrolling for q4 cohort/i)).toBeInTheDocument();
        });

        it('CTA links navigate to correct pages', () => {
            render(<Home />, { wrapper: TestWrapper });

            // Get first match for each CTA
            const startGrowingLinks = screen.getAllByText(/start growing/i);
            const platformTourLinks = screen.getAllByText(/platform tour/i);

            const startGrowingLink = startGrowingLinks[0].closest('a');
            const platformTourLink = platformTourLinks[0].closest('a');

            expect(startGrowingLink).toHaveAttribute('href', '/contact');
            expect(platformTourLink).toHaveAttribute('href', '/product');
        });
    });

    describe('Dashboard Preview', () => {
        it('renders mock browser window', () => {
            render(<Home />, { wrapper: TestWrapper });

            expect(screen.getByText('orign8.app')).toBeInTheDocument();
        });

        it('renders Active Queue card', () => {
            render(<Home />, { wrapper: TestWrapper });

            // May appear multiple times
            expect(screen.getAllByText(/active queue/i).length).toBeGreaterThan(0);
        });

        it('renders Appointments Set card', () => {
            render(<Home />, { wrapper: TestWrapper });

            // May appear multiple times
            expect(screen.getAllByText(/appointments set/i).length).toBeGreaterThan(0);
        });

        it('renders Recent Activity section', () => {
            render(<Home />, { wrapper: TestWrapper });

            // May appear multiple times
            expect(screen.getAllByText(/recent activity/i).length).toBeGreaterThan(0);
        });

        it('renders AI agent chat interface', () => {
            render(<Home />, { wrapper: TestWrapper });

            // May appear multiple times
            expect(screen.getAllByText(/orign8 agent/i).length).toBeGreaterThan(0);
            expect(screen.getAllByText(/active call/i).length).toBeGreaterThan(0);
        });
    });

    describe('Features Section', () => {
        it('renders section heading', () => {
            render(<Home />, { wrapper: TestWrapper });

            expect(screen.getByText(/the complete origination engine/i)).toBeInTheDocument();
        });

        it('renders Smart Queue Processor feature', () => {
            render(<Home />, { wrapper: TestWrapper });

            expect(screen.getByText(/smart queue processor/i)).toBeInTheDocument();
        });

        it('renders Infinite Scalability feature', () => {
            render(<Home />, { wrapper: TestWrapper });

            expect(screen.getByText(/infinite scalability/i)).toBeInTheDocument();
        });

        it('renders Compliance feature', () => {
            render(<Home />, { wrapper: TestWrapper });

            expect(screen.getByText(/"sleep well" compliance/i)).toBeInTheDocument();
        });

        it('renders Analytics feature', () => {
            render(<Home />, { wrapper: TestWrapper });

            expect(screen.getByText(/intelligent orchestration/i)).toBeInTheDocument();
        });

        it('shows loading spinners while images are generating', () => {
            render(<Home />, { wrapper: TestWrapper });

            // Loading spinners should be visible initially
            // The images start with loadingImages state as true
            const loadingSpinners = document.querySelectorAll('.animate-spin');
            expect(loadingSpinners.length).toBeGreaterThan(0);
        });
    });

    describe('Conversion Section', () => {
        it('renders conversion headline', () => {
            render(<Home />, { wrapper: TestWrapper });

            expect(screen.getByText(/conversations that/i)).toBeInTheDocument();
            expect(screen.getByText(/actually convert/i)).toBeInTheDocument();
        });

        it('renders Contextual Awareness feature', () => {
            render(<Home />, { wrapper: TestWrapper });

            expect(screen.getByText(/contextual awareness/i)).toBeInTheDocument();
        });

        it('renders 24/7 Availability feature', () => {
            render(<Home />, { wrapper: TestWrapper });

            expect(screen.getByText(/24\/7 availability/i)).toBeInTheDocument();
        });

        it('renders Technical Deep Dive link', () => {
            render(<Home />, { wrapper: TestWrapper });

            const deepDiveLink = screen.getByText(/technical deep dive/i).closest('a');
            expect(deepDiveLink).toHaveAttribute('href', '/product');
        });
    });

    describe('Final CTA Section', () => {
        it('renders scale headline', () => {
            render(<Home />, { wrapper: TestWrapper });

            expect(screen.getAllByText(/scale your volume without/i).length).toBeGreaterThan(0);
        });

        it('renders Get Started button', () => {
            render(<Home />, { wrapper: TestWrapper });

            expect(screen.getAllByText(/get started now/i).length).toBeGreaterThan(0);
        });

        it('renders View Platform Demo button', () => {
            render(<Home />, { wrapper: TestWrapper });

            expect(screen.getAllByText(/view platform demo/i).length).toBeGreaterThan(0);
        });

        it('renders trust badges', () => {
            render(<Home />, { wrapper: TestWrapper });

            // Trust badges may appear multiple times
            expect(screen.getAllByText(/tcpa compliant/i).length).toBeGreaterThan(0);
            expect(screen.getAllByText(/seamless crm sync/i).length).toBeGreaterThan(0);
            expect(screen.getAllByText(/no contract lock-in/i).length).toBeGreaterThan(0);
        });
    });

    describe('Chat Demo Component', () => {
        it('renders Live Demo badge', () => {
            render(<Home />, { wrapper: TestWrapper });

            expect(screen.getAllByText(/live demo/i).length).toBeGreaterThan(0);
        });

        it('renders lead avatar', () => {
            render(<Home />, { wrapper: TestWrapper });

            expect(screen.getAllByText(/john smith/i).length).toBeGreaterThan(0);
        });

        it('renders lead score', () => {
            render(<Home />, { wrapper: TestWrapper });

            expect(screen.getAllByText(/lead score: 85/i).length).toBeGreaterThan(0);
        });

        it('renders lead quality bar', () => {
            render(<Home />, { wrapper: TestWrapper });

            expect(screen.getAllByText(/lead quality/i).length).toBeGreaterThan(0);
            expect(screen.getAllByText(/high intent \(85%\)/i).length).toBeGreaterThan(0);
        });

        it('shows waiting message initially', () => {
            render(<Home />, { wrapper: TestWrapper });

            expect(screen.getAllByText(/waiting for incoming lead/i).length).toBeGreaterThan(0);
        });

        it('shows chat messages after animation starts', async () => {
            render(<Home />, { wrapper: TestWrapper });

            // Advance timers to trigger first message
            act(() => {
                vi.advanceTimersByTime(1500);
            });

            await waitFor(() => {
                expect(screen.getAllByText(/30-year fixed rate/i).length).toBeGreaterThan(0);
            });
        });

        it('shows AI response after delay', async () => {
            render(<Home />, { wrapper: TestWrapper });

            // Advance timers to trigger AI response
            act(() => {
                vi.advanceTimersByTime(4500);
            });

            await waitFor(() => {
                expect(screen.getAllByText(/rates change daily/i).length).toBeGreaterThan(0);
            });
        });
    });

    describe('Image Generation', () => {
        it('calls API to generate background images on mount', async () => {
            render(<Home />, { wrapper: TestWrapper });

            // Wait for API calls to be made
            await waitFor(() => {
                expect(mockFetch).toHaveBeenCalled();
            });

            // Should call for 4 different background images
            expect(mockFetch).toHaveBeenCalledWith(
                '/api/generate-content',
                expect.objectContaining({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                })
            );
        });

        it('handles image generation failure gracefully', async () => {
            mockFetch.mockRejectedValue(new Error('API Error'));

            // Should not throw
            expect(() => render(<Home />, { wrapper: TestWrapper })).not.toThrow();
        });
    });

    describe('Accessibility', () => {
        it('has accessible heading hierarchy', () => {
            render(<Home />, { wrapper: TestWrapper });

            const h1Elements = screen.getAllByRole('heading', { level: 1 });
            expect(h1Elements.length).toBeGreaterThan(0);
        });

        it('images have alt text', () => {
            render(<Home />, { wrapper: TestWrapper });

            const images = screen.getAllByRole('img');
            images.forEach(img => {
                expect(img).toHaveAttribute('alt');
            });
        });

        it('buttons are keyboard accessible', () => {
            render(<Home />, { wrapper: TestWrapper });

            const buttons = screen.getAllByRole('button');
            buttons.forEach(button => {
                expect(button).not.toHaveAttribute('tabindex', '-1');
            });
        });
    });
});
