---
name: frontend-dev-guidelines
description: Frontend development guidelines for orign8-website React 19 + Vite + TypeScript application. Use when creating components, pages, hooks, styling with Tailwind CSS, routing with React Router, dark mode theming, View Transitions API, or Lucide icons. Covers component patterns, type safety, and testing with Vitest.
---

# Orign8 Website Frontend Guidelines

## Purpose

Comprehensive guide for the React 19 + Vite + TypeScript marketing website, emphasizing type safety, component patterns, modern React practices, and smooth user experience.

## When to Use This Skill

- Creating new components or pages
- Building UI features
- Styling with Tailwind CSS
- Implementing dark mode support
- Working with View Transitions API
- Using Lucide React icons
- Routing with React Router (HashRouter)
- Writing frontend tests with Vitest
- TypeScript best practices

---

## Quick Reference

### Tech Stack

- **React 19** with concurrent features
- **Vite 6** for build tooling
- **TypeScript** strict mode
- **Tailwind CSS** for styling
- **React Router 7** (HashRouter)
- **Lucide React** for icons
- **Supabase** for backend
- **Gemini AI** for voice transcription
- **Vitest** for testing

### New Component Checklist

- [ ] Use `React.FC<Props>` pattern with TypeScript
- [ ] Define Props interface with JSDoc comments
- [ ] Style with Tailwind utility classes
- [ ] Support dark mode with `dark:` variants
- [ ] Use `useCallback` for handlers passed to children
- [ ] Handle loading and error states
- [ ] Export as named export

### New Feature Checklist

- [ ] Create component in `components/` or `pages/`
- [ ] Add TypeScript types in `types.ts`
- [ ] Create service in `services/` if needed
- [ ] Add to router in `App.tsx` if it's a page
- [ ] Write tests in `src/`

---

## Directory Structure

```
orign8-website/
├── components/          # Reusable components
│   ├── Button.tsx       # Custom button with variants
│   ├── Navbar.tsx       # Navigation bar
│   └── Footer.tsx       # Footer component
├── contexts/            # React contexts
│   └── ThemeContext.tsx # Dark mode theme provider
├── pages/               # Page components
│   ├── Home.tsx
│   ├── Contact.tsx      # Voice input + lead capture
│   ├── Product.tsx      # Compliance features
│   ├── About.tsx
│   └── Login.tsx
├── services/            # API/external services
│   └── supabaseClient.ts
├── src/                 # Tests and utilities
│   ├── App.test.tsx
│   ├── components/
│   └── test/
├── types.ts             # TypeScript type definitions
├── App.tsx              # Main app with router
└── index.tsx            # Entry point
```

---

## Component Patterns

### Standard Component Template

```typescript
import React, { useState, useCallback } from 'react';
import { ButtonVariant } from '../types';

interface MyComponentProps {
    /** The unique identifier */
    id: string;
    /** Optional callback when action occurs */
    onAction?: () => void;
    /** Additional CSS classes */
    className?: string;
}

export const MyComponent: React.FC<MyComponentProps> = ({
    id,
    onAction,
    className = '',
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = useCallback(() => {
        setIsLoading(true);
        onAction?.();
    }, [onAction]);

    return (
        <div className={`p-4 rounded-lg bg-white dark:bg-slate-800 ${className}`}>
            <button
                onClick={handleClick}
                disabled={isLoading}
                className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50"
            >
                {isLoading ? 'Loading...' : 'Action'}
            </button>
        </div>
    );
};
```

### Button Component Pattern (from project)

```typescript
import React from 'react';
import { ButtonVariant } from '../types';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    fullWidth?: boolean;
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    variant = ButtonVariant.PRIMARY,
    fullWidth = false,
    className = '',
    children,
    ...props
}) => {
    const baseStyles = "relative inline-flex items-center justify-center px-6 py-3 text-sm font-semibold...";

    const variants = {
        [ButtonVariant.PRIMARY]: "bg-slate-900 text-white dark:bg-white dark:text-slate-950...",
        [ButtonVariant.SECONDARY]: "bg-white text-slate-900 dark:bg-slate-800...",
        [ButtonVariant.OUTLINE]: "bg-transparent text-slate-600 dark:text-slate-300...",
        [ButtonVariant.GHOST]: "bg-transparent text-slate-500 dark:text-slate-400..."
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
```

---

## Styling with Tailwind CSS

### Dark Mode Support

Always include dark mode variants:

```typescript
// Background colors
<div className="bg-white dark:bg-slate-950">

// Text colors
<p className="text-slate-900 dark:text-slate-50">

// Border colors
<div className="border border-slate-200 dark:border-slate-700">

// Hover states with dark mode
<button className="hover:bg-slate-100 dark:hover:bg-slate-800">
```

### Brand Colors

The project uses custom brand colors:

```typescript
// Selection highlight
<div className="selection:bg-brand-500 selection:text-white">

// Brand accents
<div className="bg-brand-500 hover:bg-brand-600">
<div className="text-brand-500 dark:text-brand-400">
```

### Common Layout Patterns

```typescript
// Flexbox centering
<div className="flex items-center justify-between gap-4">

// Grid layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Full-height app layout
<div className="min-h-screen flex flex-col">
    <main className="flex-grow">{children}</main>
</div>

// Responsive padding
<div className="p-4 md:p-6 lg:p-8">

// Container with max width
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
```

### Animation Classes

```typescript
// Transition for color/background changes
<div className="transition-colors duration-300">

// Scale on active
<button className="active:scale-[0.98]">

// Custom drift animation (defined in project)
<div className="animate-drift">
```

---

## Routing with React Router

### HashRouter Setup (from App.tsx)

```typescript
import { HashRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';

const App: React.FC = () => {
    return (
        <ThemeProvider>
            <Router>
                <ScrollToTop />
                <AppContent />
            </Router>
        </ThemeProvider>
    );
};
```

### View Transitions API Integration

```typescript
// Handle navigation with View Transitions
useEffect(() => {
    if (!document.startViewTransition) return;

    const handleAnchorClick = (e: MouseEvent) => {
        const anchor = (e.target as HTMLElement).closest('a');
        const href = anchor?.getAttribute('href');

        if (!anchor || !href || !href.startsWith('#/')) return;

        e.preventDefault();
        const to = href.replace(/^#/, '');

        document.startViewTransition(() => {
            flushSync(() => {
                navigate(to);
            });
        });
    };

    document.addEventListener('click', handleAnchorClick, true);
    return () => document.removeEventListener('click', handleAnchorClick, true);
}, [navigate]);
```

### Link Format

Use hash-based links for HashRouter:

```typescript
<a href="#/product">Product</a>
<a href="#/contact">Contact</a>
```

---

## Theme Context

### Using ThemeProvider

```typescript
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

// In component
const { theme, toggleTheme } = useTheme();

// Toggle button
<button onClick={toggleTheme}>
    {theme === 'dark' ? <Sun /> : <Moon />}
</button>
```

---

## Icons with Lucide React

```typescript
import { Menu, X, Sun, Moon, ChevronDown } from 'lucide-react';

// Usage
<Menu className="w-6 h-6" />
<Sun className="w-5 h-5 text-yellow-500" />

// With conditional rendering
{isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
```

---

## Type Definitions

### Types in types.ts

```typescript
// Button variants enum
export enum ButtonVariant {
    PRIMARY = 'primary',
    SECONDARY = 'secondary',
    OUTLINE = 'outline',
    GHOST = 'ghost'
}

// Form data interface
export interface ContactFormData {
    name: string;
    email: string;
    phone: string;
    message: string;
    transcription?: string;
}
```

---

## Supabase Integration

### Client Setup

```typescript
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

### Data Operations

```typescript
// Insert data
export const submitLead = async (data: ContactFormData) => {
    const { error } = await supabase.from('leads').insert([data]);
    if (error) throw error;
    return { success: true };
};

// Query data
const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });
```

---

## Testing with Vitest

### Component Test Template

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../components/Button';
import { ButtonVariant } from '../types';

describe('Button', () => {
    it('renders with default variant', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole('button')).toHaveTextContent('Click me');
    });

    it('applies full width when specified', () => {
        render(<Button fullWidth>Full Width</Button>);
        expect(screen.getByRole('button')).toHaveClass('w-full');
    });

    it('calls onClick handler', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Click</Button>);

        fireEvent.click(screen.getByRole('button'));
        expect(handleClick).toHaveBeenCalled();
    });
});
```

### Running Tests

```bash
npm run test          # Run Vitest in watch mode
npm run e2e           # Run Puppeteer e2e tests
```

---

## Common Imports Cheatsheet

```typescript
// React
import React, { useState, useCallback, useMemo, useEffect } from 'react';

// Router
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { flushSync } from 'react-dom';

// Icons
import { Menu, X, Sun, Moon, ChevronDown, Phone, Mail } from 'lucide-react';

// Types
import { ButtonVariant, ContactFormData } from './types';

// Theme
import { useTheme } from './contexts/ThemeContext';

// Supabase
import { supabase, submitLead } from './services/supabaseClient';
```

---

## Anti-Patterns to Avoid

❌ Inline styles instead of Tailwind classes
❌ `any` type in TypeScript
❌ Forgetting dark mode variants (`dark:`)
❌ Using BrowserRouter links with HashRouter
❌ Missing error handling in async operations
❌ Not memoizing callbacks passed to children
❌ Hardcoding colors instead of using Tailwind/brand tokens

---

## Related Skills

- **supabase-integration**: Database and auth patterns
- **gemini-voice**: Voice transcription integration
- **testing-patterns**: Testing patterns for this codebase

---

**Skill Status**: COMPLETE ✅
