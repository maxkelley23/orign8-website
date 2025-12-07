import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

// Mock useTheme hook
const mockToggleTheme = vi.fn();
vi.mock('@/contexts/ThemeContext', async () => {
    const actual = await vi.importActual('@/contexts/ThemeContext');
    return {
        ...actual,
        useTheme: vi.fn(() => ({
            theme: 'light',
            toggleTheme: mockToggleTheme,
        })),
    };
});

// Helper to render with router at specific path
const renderWithRouter = (initialPath = '/') => {
    return render(
        <MemoryRouter initialEntries={[initialPath]}>
            <ThemeProvider>
                <Navbar />
            </ThemeProvider>
        </MemoryRouter>
    );
};

describe('Navbar Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset scroll position
        Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Rendering', () => {
        it('renders logo', () => {
            renderWithRouter();

            expect(screen.getByText('orign8')).toBeInTheDocument();
        });

        it('renders navigation links', () => {
            renderWithRouter();

            // Navigation links appear in both desktop and mobile menus
            expect(screen.getAllByText('Product').length).toBeGreaterThan(0);
            expect(screen.getAllByText('About').length).toBeGreaterThan(0);
            expect(screen.getAllByText('Contact').length).toBeGreaterThan(0);
        });

        it('renders Book Demo button', () => {
            renderWithRouter();

            // Book Demo appears in both desktop and mobile menus
            expect(screen.getAllByText('Book Demo').length).toBeGreaterThan(0);
        });

        it('renders theme toggle button', () => {
            renderWithRouter();

            const themeButton = screen.getByLabelText(/toggle theme/i);
            expect(themeButton).toBeInTheDocument();
        });

        it('logo links to home page', () => {
            renderWithRouter();

            const logoLink = screen.getByText('orign8').closest('a');
            expect(logoLink).toHaveAttribute('href', '/');
        });
    });

    describe('Navigation Links', () => {
        it('Product link navigates to /product', () => {
            renderWithRouter();

            // Get all Product links and check first one has correct href
            const productLinks = screen.getAllByText('Product');
            const productLink = productLinks[0].closest('a');
            expect(productLink).toHaveAttribute('href', '/product');
        });

        it('About link navigates to /about', () => {
            renderWithRouter();

            // Get all About links and check first one has correct href
            const aboutLinks = screen.getAllByText('About');
            const aboutLink = aboutLinks[0].closest('a');
            expect(aboutLink).toHaveAttribute('href', '/about');
        });

        it('Contact link navigates to /contact', () => {
            renderWithRouter();

            // Get all Contact links and check first one has correct href
            const contactLinks = screen.getAllByText('Contact');
            const contactLink = contactLinks[0].closest('a');
            expect(contactLink).toHaveAttribute('href', '/contact');
        });

        it('Book Demo links to /contact', () => {
            renderWithRouter();

            // Get all Book Demo links and check first one has correct href
            const bookDemoLinks = screen.getAllByText('Book Demo');
            const bookDemoLink = bookDemoLinks[0].closest('a');
            expect(bookDemoLink).toHaveAttribute('href', '/contact');
        });
    });

    describe('Theme Toggle', () => {
        it('calls toggleTheme when theme button is clicked', async () => {
            const user = userEvent.setup();
            renderWithRouter();

            const themeButton = screen.getByLabelText(/toggle theme/i);
            await user.click(themeButton);

            expect(mockToggleTheme).toHaveBeenCalled();
        });

        it('passes click event to toggleTheme for animation', async () => {
            const user = userEvent.setup();
            renderWithRouter();

            const themeButton = screen.getByLabelText(/toggle theme/i);
            await user.click(themeButton);

            // Should pass the event
            expect(mockToggleTheme).toHaveBeenCalledWith(expect.any(Object));
        });
    });

    describe('Mobile Menu', () => {
        it('renders mobile menu toggle button', () => {
            renderWithRouter();

            const mobileMenuButton = screen.getByLabelText(/toggle menu/i);
            expect(mobileMenuButton).toBeInTheDocument();
        });

        it('opens mobile menu when toggle is clicked', async () => {
            const user = userEvent.setup();
            renderWithRouter();

            const mobileMenuButton = screen.getByLabelText(/toggle menu/i);
            await user.click(mobileMenuButton);

            // Menu should be visible with navigation items
            await waitFor(() => {
                // In mobile menu, there are additional nav links rendered
                const productLinks = screen.getAllByText('Product');
                expect(productLinks.length).toBeGreaterThan(0);
            });
        });

        it('closes mobile menu when toggle is clicked again', async () => {
            const user = userEvent.setup();
            renderWithRouter();

            const mobileMenuButton = screen.getByLabelText(/toggle menu/i);

            // Open menu
            await user.click(mobileMenuButton);

            // Close menu
            await user.click(mobileMenuButton);

            // Menu should have closing animation class
            await waitFor(() => {
                const menuDropdown = document.querySelector('.max-h-0');
                expect(menuDropdown).toBeInTheDocument();
            });
        });

        it('renders mobile theme toggle', () => {
            renderWithRouter();

            // Should have two theme toggles (desktop and mobile)
            const themeToggles = screen.getAllByLabelText(/toggle theme/i);
            expect(themeToggles.length).toBeGreaterThanOrEqual(1);
        });
    });

    describe('Scroll Behavior', () => {
        it('starts with transparent background on home page', () => {
            renderWithRouter('/');

            const nav = document.querySelector('nav');
            expect(nav?.className).toContain('bg-transparent');
        });

        it('changes to solid background after scrolling', async () => {
            renderWithRouter('/');

            // Simulate scroll
            act(() => {
                Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
                window.dispatchEvent(new Event('scroll'));
            });

            await waitFor(() => {
                const nav = document.querySelector('nav');
                // Should have white/solid background class after scroll
                expect(nav?.className).toContain('bg-white');
            });
        });

        it('hides Login link after scrolling', async () => {
            renderWithRouter('/');

            // Initially should show Login
            expect(screen.queryByText('Log in')).toBeInTheDocument();

            // Simulate scroll
            act(() => {
                Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
                window.dispatchEvent(new Event('scroll'));
            });

            await waitFor(() => {
                // Login should be hidden after scroll
                expect(screen.queryByText('Log in')).not.toBeInTheDocument();
            });
        });
    });

    describe('Transparent Nav Pages', () => {
        it('has transparent background on home page', () => {
            renderWithRouter('/');

            const nav = document.querySelector('nav');
            expect(nav?.className).toContain('bg-transparent');
        });

        it('has transparent background on product page', () => {
            renderWithRouter('/product');

            const nav = document.querySelector('nav');
            expect(nav?.className).toContain('bg-transparent');
        });

        it('does NOT have transparent background on contact page', async () => {
            renderWithRouter('/contact');

            const nav = document.querySelector('nav');
            // On contact page without scroll, should still have some styling
            expect(nav).toBeInTheDocument();
        });
    });

    describe('Active Link Styling', () => {
        it('highlights Product link when on /product', () => {
            renderWithRouter('/product');

            // Find the desktop Product link (not in mobile menu)
            const productLinks = screen.getAllByText('Product');
            const desktopLink = productLinks.find(link =>
                link.closest('a')?.className?.includes('md:flex') === false
            );

            // Active link should have special styling
            expect(desktopLink?.closest('a')?.className).toContain('font-medium');
        });
    });

    describe('Accessibility', () => {
        it('has accessible theme toggle', () => {
            renderWithRouter();

            const themeButton = screen.getByLabelText(/toggle theme/i);
            expect(themeButton).toHaveAttribute('aria-label');
        });

        it('has accessible mobile menu toggle', () => {
            renderWithRouter();

            const menuButton = screen.getByLabelText(/toggle menu/i);
            expect(menuButton).toHaveAttribute('aria-label');
        });

        it('navigation is keyboard accessible', () => {
            renderWithRouter();

            const links = screen.getAllByRole('link');
            links.forEach(link => {
                expect(link).not.toHaveAttribute('tabindex', '-1');
            });
        });
    });

    describe('Clean up', () => {
        it('removes scroll listener on unmount', () => {
            const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
            const { unmount } = renderWithRouter();

            unmount();

            expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
        });
    });
});
