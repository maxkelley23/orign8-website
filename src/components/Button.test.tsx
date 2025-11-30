import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/Button';
import { ButtonVariant } from '@/types';

describe('Button', () => {
    it('renders children correctly', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('calls onClick handler when clicked', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Click me</Button>);
        fireEvent.click(screen.getByText('Click me'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('applies primary variant styles by default', () => {
        render(<Button>Primary</Button>);
        const button = screen.getByText('Primary');
        expect(button.className).toContain('bg-slate-900');
    });

    it('applies outline variant styles when specified', () => {
        render(<Button variant={ButtonVariant.OUTLINE}>Outline</Button>);
        const button = screen.getByText('Outline');
        expect(button.className).toContain('border');
    });
});
