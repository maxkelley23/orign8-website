---
name: testing-patterns
description: Testing patterns for orign8-website with Vitest and React Testing Library. Use when writing component tests, mocking services, testing hooks, or debugging test failures. Covers Vitest setup, component testing, async patterns, and Puppeteer e2e tests.
---

# Orign8 Website Testing Patterns

## Purpose

Comprehensive guide for testing patterns specific to this React 19 + Vite + TypeScript codebase using Vitest and React Testing Library.

## When to Use This Skill

- Writing new component tests
- Testing custom hooks
- Mocking Supabase services
- Debugging test failures
- Running e2e tests with Puppeteer
- Understanding test organization

---

## Quick Reference

### Test Organization

```
orign8-website/
├── src/
│   ├── test/
│   │   └── setup.ts          # Vitest setup
│   ├── App.test.tsx          # App component tests
│   └── components/
│       └── Button.test.tsx   # Component tests
├── scripts/
│   └── puppeteer-check.js    # E2E tests
├── vitest.config.ts          # Vitest config
└── package.json
```

### Running Tests

```bash
npm run test          # Run Vitest in watch mode
npm run e2e           # Run Puppeteer e2e tests
npm run e2e:preview   # Build and run e2e
```

---

## Vitest Configuration

### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/test/setup.ts'],
        include: ['**/*.test.{ts,tsx}'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
        },
    },
});
```

### Test Setup (src/test/setup.ts)

```typescript
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.matchMedia for dark mode tests
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));
```

---

## Component Testing

### Basic Component Test

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../components/Button';
import { ButtonVariant } from '../types';

describe('Button', () => {
    it('renders children correctly', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole('button')).toHaveTextContent('Click me');
    });

    it('applies primary variant by default', () => {
        render(<Button>Primary</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-slate-900');
    });

    it('applies secondary variant when specified', () => {
        render(<Button variant={ButtonVariant.SECONDARY}>Secondary</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-white');
    });

    it('applies full width when specified', () => {
        render(<Button fullWidth>Full Width</Button>);
        expect(screen.getByRole('button')).toHaveClass('w-full');
    });

    it('calls onClick handler when clicked', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Click</Button>);

        fireEvent.click(screen.getByRole('button'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('is disabled when disabled prop is true', () => {
        render(<Button disabled>Disabled</Button>);
        expect(screen.getByRole('button')).toBeDisabled();
    });
});
```

### Testing with Router

```typescript
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { Navbar } from '../components/Navbar';

const renderWithRouter = (component: React.ReactNode) => {
    return render(
        <MemoryRouter>{component}</MemoryRouter>
    );
};

describe('Navbar', () => {
    it('renders navigation links', () => {
        renderWithRouter(<Navbar />);

        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Product')).toBeInTheDocument();
        expect(screen.getByText('Contact')).toBeInTheDocument();
    });
});
```

### Testing with Theme Context

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';

const TestComponent = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <div>
            <span data-testid="theme">{theme}</span>
            <button onClick={toggleTheme}>Toggle</button>
        </div>
    );
};

describe('ThemeContext', () => {
    it('provides default theme', () => {
        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        expect(screen.getByTestId('theme')).toHaveTextContent('light');
    });

    it('toggles theme on button click', () => {
        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        fireEvent.click(screen.getByRole('button'));
        expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    });
});
```

---

## Mocking Services

### Mocking Supabase

```typescript
import { vi } from 'vitest';

// Mock the entire module
vi.mock('../services/supabaseClient', () => ({
    supabase: {
        from: vi.fn(() => ({
            select: vi.fn().mockReturnThis(),
            insert: vi.fn().mockReturnThis(),
            update: vi.fn().mockReturnThis(),
            delete: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn(),
        })),
        auth: {
            signIn: vi.fn(),
            signUp: vi.fn(),
            signOut: vi.fn(),
            getUser: vi.fn(),
        },
    },
    submitLead: vi.fn(),
}));
```

### Using Mocks in Tests

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Contact } from '../pages/Contact';
import { submitLead } from '../services/supabaseClient';

vi.mock('../services/supabaseClient');

describe('Contact', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('submits form data', async () => {
        (submitLead as vi.Mock).mockResolvedValue({ success: true });

        render(<Contact />);

        fireEvent.change(screen.getByLabelText('Name'), {
            target: { value: 'John Doe' },
        });
        fireEvent.change(screen.getByLabelText('Email'), {
            target: { value: 'john@example.com' },
        });
        fireEvent.click(screen.getByRole('button', { name: /submit/i }));

        await waitFor(() => {
            expect(submitLead).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: 'John Doe',
                    email: 'john@example.com',
                })
            );
        });
    });

    it('handles submission error', async () => {
        (submitLead as vi.Mock).mockRejectedValue(new Error('Failed'));

        render(<Contact />);

        // Fill and submit form...

        await waitFor(() => {
            expect(screen.getByText(/error/i)).toBeInTheDocument();
        });
    });
});
```

---

## Testing Custom Hooks

```typescript
import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useVoiceRecording } from '../hooks/useVoiceRecording';

// Mock navigator.mediaDevices
const mockMediaDevices = {
    getUserMedia: vi.fn(),
};
Object.defineProperty(navigator, 'mediaDevices', {
    value: mockMediaDevices,
});

describe('useVoiceRecording', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('starts recording when startRecording is called', async () => {
        const mockStream = {
            getTracks: () => [{ stop: vi.fn() }],
        };
        mockMediaDevices.getUserMedia.mockResolvedValue(mockStream);

        const { result } = renderHook(() => useVoiceRecording());

        expect(result.current.isRecording).toBe(false);

        await act(async () => {
            await result.current.startRecording();
        });

        expect(result.current.isRecording).toBe(true);
    });

    it('handles permission denied error', async () => {
        mockMediaDevices.getUserMedia.mockRejectedValue(
            new Error('Permission denied')
        );

        const { result } = renderHook(() => useVoiceRecording());

        await act(async () => {
            await result.current.startRecording();
        });

        expect(result.current.error).toBeTruthy();
        expect(result.current.isRecording).toBe(false);
    });
});
```

---

## Async Testing Patterns

### Testing Loading States

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

describe('AsyncComponent', () => {
    it('shows loading state initially', () => {
        render(<AsyncComponent />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('shows data after loading', async () => {
        render(<AsyncComponent />);

        await waitFor(() => {
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
        });

        expect(screen.getByText('Data loaded')).toBeInTheDocument();
    });
});
```

### Testing with Fake Timers

```typescript
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('TimerComponent', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('updates after delay', async () => {
        render(<TimerComponent />);

        expect(screen.getByText('0')).toBeInTheDocument();

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(screen.getByText('1')).toBeInTheDocument();
    });
});
```

---

## E2E Testing with Puppeteer

### Basic E2E Test (scripts/puppeteer-check.js)

```javascript
const puppeteer = require('puppeteer');

async function runTests() {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    try {
        // Navigate to app
        await page.goto('http://localhost:5173', {
            waitUntil: 'networkidle0',
        });

        // Check homepage loads
        const title = await page.title();
        console.log('✓ Page loaded:', title);

        // Check navigation works
        await page.click('a[href="#/contact"]');
        await page.waitForSelector('form');
        console.log('✓ Navigation to Contact works');

        // Check form exists
        const formExists = await page.$('form');
        if (formExists) {
            console.log('✓ Contact form rendered');
        }

        // Test dark mode toggle
        await page.click('[aria-label="Toggle theme"]');
        const isDark = await page.evaluate(() =>
            document.documentElement.classList.contains('dark')
        );
        console.log('✓ Dark mode toggle works:', isDark);

        console.log('\n✅ All e2e tests passed!');
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        process.exit(1);
    } finally {
        await browser.close();
    }
}

runTests();
```

---

## Common Test Utilities

### Custom Render with Providers

```typescript
// src/test/utils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';

interface CustomRenderOptions extends RenderOptions {
    initialRoute?: string;
}

export const customRender = (
    ui: React.ReactElement,
    options: CustomRenderOptions = {}
) => {
    const { initialRoute = '/', ...renderOptions } = options;

    return render(
        <ThemeProvider>
            <MemoryRouter initialEntries={[initialRoute]}>
                {ui}
            </MemoryRouter>
        </ThemeProvider>,
        renderOptions
    );
};

export * from '@testing-library/react';
export { customRender as render };
```

---

## Common Gotchas

### 1. Missing act() Warning

**Solution:** Wrap state updates in act()

```typescript
await act(async () => {
    fireEvent.click(button);
});
```

### 2. Router Context Missing

**Solution:** Wrap component in MemoryRouter

### 3. Theme Context Missing

**Solution:** Wrap component in ThemeProvider

### 4. Async State Not Updated

**Solution:** Use waitFor or findBy queries

```typescript
await waitFor(() => {
    expect(screen.getByText('Updated')).toBeInTheDocument();
});
```

### 5. Mock Not Cleared Between Tests

**Solution:** Call vi.clearAllMocks() in beforeEach

---

## Related Skills

- **frontend-dev-guidelines**: Component patterns being tested
- **supabase-integration**: Supabase mocking patterns
- **gemini-voice**: Voice feature testing patterns

---

**Skill Status**: COMPLETE ✅
