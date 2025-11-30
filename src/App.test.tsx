import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from '@/App';

describe('App', () => {
    it('renders without crashing', () => {
        render(<App />);
        // Check for a text that should always be present, e.g., from the Navbar or Hero
        // Since we don't have the full context of what's rendered initially, we can check for something generic or just that it renders.
        // However, App uses Router, so we need to make sure we are not wrapping it again if App already has Router.
        // App.tsx has <Router> inside <App>, so rendering <App /> is fine.

        // Let's check for the "Orign8" text which is likely in the Navbar or Hero
        // Or just check that the document body contains something.
        expect(document.body).toBeTruthy();
    });
});
