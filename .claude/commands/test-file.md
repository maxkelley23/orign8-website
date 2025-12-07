---
description: Generate a test file for a source file following project patterns
argument-hint: Path to the source file to test (e.g., components/Button.tsx)
---

Generate a comprehensive test file for the specified source file: $ARGUMENTS

## Instructions

1. **Read the source file** to understand:
   - What component/function is being exported
   - What props/parameters it accepts
   - What dependencies need to be mocked
   - What user interactions it supports

2. **Determine test location**:
   - Components: `src/components/<ComponentName>.test.tsx`
   - Pages: `src/pages/<PageName>.test.tsx`
   - Services: `services/<serviceName>.test.ts`
   - Hooks: `src/hooks/<hookName>.test.ts`

3. **Identify what to mock**:
   - Supabase client (`services/supabaseClient`)
   - React Router hooks
   - Theme context
   - External APIs (Gemini)
   - Browser APIs (navigator.mediaDevices)

4. **Generate test file** following project patterns:

### Component Test Template (Vitest + React Testing Library)

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import { ComponentUnderTest } from './ComponentUnderTest';

// Mock services
vi.mock('../services/supabaseClient', () => ({
    supabase: {
        from: vi.fn(() => ({
            select: vi.fn().mockReturnThis(),
            insert: vi.fn().mockReturnThis(),
        })),
    },
    submitLead: vi.fn(),
}));

// Helper to render with providers
const renderWithProviders = (component: React.ReactNode) => {
    return render(
        <ThemeProvider>
            <MemoryRouter>
                {component}
            </MemoryRouter>
        </ThemeProvider>
    );
};

describe('ComponentUnderTest', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders correctly', () => {
        renderWithProviders(<ComponentUnderTest />);
        expect(screen.getByText('Expected Text')).toBeInTheDocument();
    });

    it('handles user interaction', async () => {
        renderWithProviders(<ComponentUnderTest />);

        const button = screen.getByRole('button', { name: /submit/i });
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText('Success')).toBeInTheDocument();
        });
    });

    it('applies correct styling', () => {
        renderWithProviders(<ComponentUnderTest className="custom-class" />);
        expect(screen.getByTestId('component')).toHaveClass('custom-class');
    });
});
```

### Hook Test Template

```typescript
import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCustomHook } from './useCustomHook';

describe('useCustomHook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns initial state', () => {
        const { result } = renderHook(() => useCustomHook());
        expect(result.current.value).toBe(initialValue);
    });

    it('updates state correctly', async () => {
        const { result } = renderHook(() => useCustomHook());

        await act(async () => {
            result.current.updateValue('new value');
        });

        expect(result.current.value).toBe('new value');
    });
});
```

### Service Test Template

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { myService } from './myService';

// Mock Supabase
vi.mock('./supabaseClient', () => ({
    supabase: {
        from: vi.fn(() => ({
            select: vi.fn().mockReturnThis(),
            insert: vi.fn().mockResolvedValue({ data: [], error: null }),
            eq: vi.fn().mockReturnThis(),
        })),
    },
}));

describe('myService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('fetches data successfully', async () => {
        const result = await myService.fetchData();
        expect(result).toBeDefined();
    });

    it('handles errors gracefully', async () => {
        // Setup error mock
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockResolvedValue({
                data: null,
                error: new Error('Database error'),
            }),
        } as any);

        await expect(myService.fetchData()).rejects.toThrow('Database error');
    });
});
```

## Key Testing Patterns

### Mocking Supabase

```typescript
vi.mock('../services/supabaseClient', () => ({
    supabase: {
        from: vi.fn(() => ({
            select: vi.fn().mockReturnThis(),
            insert: vi.fn().mockReturnThis(),
            update: vi.fn().mockReturnThis(),
            delete: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: mockData, error: null }),
        })),
        auth: {
            signIn: vi.fn(),
            signOut: vi.fn(),
            getUser: vi.fn(),
        },
    },
    submitLead: vi.fn().mockResolvedValue({ success: true }),
}));
```

### Mocking Theme Context

```typescript
vi.mock('../contexts/ThemeContext', () => ({
    useTheme: () => ({
        theme: 'light',
        toggleTheme: vi.fn(),
    }),
    ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));
```

### Mocking Router

```typescript
import { MemoryRouter } from 'react-router-dom';

// Wrap component
render(
    <MemoryRouter initialEntries={['/contact']}>
        <ComponentUnderTest />
    </MemoryRouter>
);

// Or mock useNavigate
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});
```

### Testing Async Operations

```typescript
it('handles async submission', async () => {
    const mockSubmit = vi.fn().mockResolvedValue({ success: true });

    renderWithProviders(<Form onSubmit={mockSubmit} />);

    fireEvent.change(screen.getByLabelText('Email'), {
        target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith(
            expect.objectContaining({ email: 'test@example.com' })
        );
    });
});
```

## Test Categories

| Source Location | Test Location |
|----------------|---------------|
| `components/*.tsx` | `src/components/*.test.tsx` |
| `pages/*.tsx` | `src/pages/*.test.tsx` |
| `services/*.ts` | `services/*.test.ts` |
| `contexts/*.tsx` | `src/contexts/*.test.tsx` |
| `hooks/*.ts` | `src/hooks/*.test.ts` |

## Running Tests

```bash
# All tests
npm run test

# Specific file
npm run test -- Button.test.tsx

# With coverage
npm run test -- --coverage

# Watch mode (default)
npm run test
```

## Deliverable

Generate a complete test file with:
- [ ] All props/variants covered
- [ ] User interaction tests
- [ ] Loading/error state tests
- [ ] Accessibility checks (roles, labels)
- [ ] Dark mode considerations
- [ ] Proper mock setup and cleanup
