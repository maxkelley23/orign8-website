import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Contact } from '@/pages/Contact';
import { ThemeProvider } from '@/contexts/ThemeContext';
import * as supabaseClient from '@/services/supabaseClient';

// Mock the supabase client
vi.mock('@/services/supabaseClient', () => ({
    submitLead: vi.fn(),
}));

// Mock fetch for transcription API
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock MediaRecorder
const mockMediaRecorder = {
    start: vi.fn(),
    stop: vi.fn(),
    ondataavailable: null as ((event: { data: Blob }) => void) | null,
    onstop: null as (() => void) | null,
};

const mockGetUserMedia = vi.fn();

// Wrapper component for tests
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <BrowserRouter>
        <ThemeProvider>
            {children}
        </ThemeProvider>
    </BrowserRouter>
);

describe('Contact Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Setup MediaRecorder mock
        global.MediaRecorder = vi.fn().mockImplementation(() => mockMediaRecorder) as unknown as typeof MediaRecorder;

        // Setup getUserMedia mock
        Object.defineProperty(navigator, 'mediaDevices', {
            value: { getUserMedia: mockGetUserMedia },
            writable: true,
        });

        mockGetUserMedia.mockResolvedValue({
            getTracks: () => [{ stop: vi.fn() }],
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Form Rendering', () => {
        it('renders all form fields', () => {
            render(<Contact />, { wrapper: TestWrapper });

            expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/work email/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/company name/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/nmls/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/how can we help/i)).toBeInTheDocument();
        });

        it('renders submit button', () => {
            render(<Contact />, { wrapper: TestWrapper });
            expect(screen.getByRole('button', { name: /submit application/i })).toBeInTheDocument();
        });

        it('renders voice input button', () => {
            render(<Contact />, { wrapper: TestWrapper });
            expect(screen.getByTitle(/voice input/i)).toBeInTheDocument();
        });

        it('renders process steps on left side', () => {
            render(<Contact />, { wrapper: TestWrapper });

            expect(screen.getByText(/discovery call/i)).toBeInTheDocument();
            expect(screen.getByText(/integration setup/i)).toBeInTheDocument();
            expect(screen.getByText(/launch & monitor/i)).toBeInTheDocument();
        });
    });

    describe('Form Validation', () => {
        it('requires first name field', () => {
            render(<Contact />, { wrapper: TestWrapper });
            const firstName = screen.getByLabelText(/first name/i);
            expect(firstName).toHaveAttribute('required');
        });

        it('requires last name field', () => {
            render(<Contact />, { wrapper: TestWrapper });
            const lastName = screen.getByLabelText(/last name/i);
            expect(lastName).toHaveAttribute('required');
        });

        it('requires email field', () => {
            render(<Contact />, { wrapper: TestWrapper });
            const email = screen.getByLabelText(/work email/i);
            expect(email).toHaveAttribute('required');
            expect(email).toHaveAttribute('type', 'email');
        });

        it('requires company field', () => {
            render(<Contact />, { wrapper: TestWrapper });
            const company = screen.getByLabelText(/company name/i);
            expect(company).toHaveAttribute('required');
        });

        it('NMLS field is optional', () => {
            render(<Contact />, { wrapper: TestWrapper });
            const nmls = screen.getByLabelText(/nmls/i);
            expect(nmls).not.toHaveAttribute('required');
        });

        it('requires message field', () => {
            render(<Contact />, { wrapper: TestWrapper });
            const message = screen.getByLabelText(/how can we help/i);
            expect(message).toHaveAttribute('required');
        });
    });

    describe('Form Input Handling', () => {
        it('updates form data on input change', async () => {
            const user = userEvent.setup();
            render(<Contact />, { wrapper: TestWrapper });

            const firstName = screen.getByLabelText(/first name/i);
            await user.type(firstName, 'Jane');

            expect(firstName).toHaveValue('Jane');
        });

        it('updates all fields correctly', async () => {
            const user = userEvent.setup();
            render(<Contact />, { wrapper: TestWrapper });

            await user.type(screen.getByLabelText(/first name/i), 'Jane');
            await user.type(screen.getByLabelText(/last name/i), 'Doe');
            await user.type(screen.getByLabelText(/work email/i), 'jane@example.com');
            await user.type(screen.getByLabelText(/company name/i), 'Acme Mortgage');
            await user.type(screen.getByLabelText(/nmls/i), '123456');
            await user.type(screen.getByLabelText(/how can we help/i), 'Need help with leads');

            expect(screen.getByLabelText(/first name/i)).toHaveValue('Jane');
            expect(screen.getByLabelText(/last name/i)).toHaveValue('Doe');
            expect(screen.getByLabelText(/work email/i)).toHaveValue('jane@example.com');
            expect(screen.getByLabelText(/company name/i)).toHaveValue('Acme Mortgage');
            expect(screen.getByLabelText(/nmls/i)).toHaveValue('123456');
            expect(screen.getByLabelText(/how can we help/i)).toHaveValue('Need help with leads');
        });
    });

    describe('Form Submission', () => {
        const fillForm = async (user: ReturnType<typeof userEvent.setup>) => {
            await user.type(screen.getByLabelText(/first name/i), 'Jane');
            await user.type(screen.getByLabelText(/last name/i), 'Doe');
            await user.type(screen.getByLabelText(/work email/i), 'jane@example.com');
            await user.type(screen.getByLabelText(/company name/i), 'Acme Mortgage');
            await user.type(screen.getByLabelText(/how can we help/i), 'Need help with leads');
        };

        it('calls submitLead on form submission', async () => {
            const user = userEvent.setup();
            vi.mocked(supabaseClient.submitLead).mockResolvedValue({ success: true });

            render(<Contact />, { wrapper: TestWrapper });
            await fillForm(user);

            const submitButton = screen.getByRole('button', { name: /submit application/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(supabaseClient.submitLead).toHaveBeenCalledWith({
                    firstName: 'Jane',
                    lastName: 'Doe',
                    email: 'jane@example.com',
                    company: 'Acme Mortgage',
                    nmlsId: '',
                    message: 'Need help with leads',
                });
            });
        });

        it('shows loading state during submission', async () => {
            const user = userEvent.setup();
            vi.mocked(supabaseClient.submitLead).mockImplementation(
                () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 100))
            );

            render(<Contact />, { wrapper: TestWrapper });
            await fillForm(user);

            const submitButton = screen.getByRole('button', { name: /submit application/i });
            await user.click(submitButton);

            expect(screen.getByText(/processing/i)).toBeInTheDocument();
        });

        it('shows success message after successful submission', async () => {
            const user = userEvent.setup();
            vi.mocked(supabaseClient.submitLead).mockResolvedValue({ success: true });

            render(<Contact />, { wrapper: TestWrapper });
            await fillForm(user);

            const submitButton = screen.getByRole('button', { name: /submit application/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/application received/i)).toBeInTheDocument();
            });
        });

        it('shows error message on submission failure', async () => {
            const user = userEvent.setup();
            vi.mocked(supabaseClient.submitLead).mockResolvedValue({
                success: false,
                error: 'Network error',
            });

            render(<Contact />, { wrapper: TestWrapper });
            await fillForm(user);

            const submitButton = screen.getByRole('button', { name: /submit application/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/network error/i)).toBeInTheDocument();
            });
        });

        it('clears form after successful submission', async () => {
            const user = userEvent.setup();
            vi.mocked(supabaseClient.submitLead).mockResolvedValue({ success: true });

            render(<Contact />, { wrapper: TestWrapper });
            await fillForm(user);

            const submitButton = screen.getByRole('button', { name: /submit application/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/application received/i)).toBeInTheDocument();
            });

            // Click "Book another demo" to reset form
            await user.click(screen.getByText(/book another demo/i));

            expect(screen.getByLabelText(/first name/i)).toHaveValue('');
        });

        it('disables submit button during submission', async () => {
            const user = userEvent.setup();
            vi.mocked(supabaseClient.submitLead).mockImplementation(
                () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 100))
            );

            render(<Contact />, { wrapper: TestWrapper });
            await fillForm(user);

            const submitButton = screen.getByRole('button', { name: /submit application/i });
            await user.click(submitButton);

            // Button should be disabled and show "Processing..."
            await waitFor(() => {
                const processingButton = screen.getByRole('button', { name: /processing/i });
                expect(processingButton).toBeDisabled();
            });
        });
    });

    describe('Voice Input', () => {
        it('starts recording when mic button is clicked', async () => {
            const user = userEvent.setup();
            render(<Contact />, { wrapper: TestWrapper });

            const micButton = screen.getByTitle(/voice input/i);
            await user.click(micButton);

            await waitFor(() => {
                expect(mockGetUserMedia).toHaveBeenCalledWith({ audio: true });
            });
        });

        it('shows recording state indicator', async () => {
            const user = userEvent.setup();
            render(<Contact />, { wrapper: TestWrapper });

            const micButton = screen.getByTitle(/voice input/i);
            await user.click(micButton);

            await waitFor(() => {
                expect(screen.getByText(/recording/i)).toBeInTheDocument();
            });
        });

        it('shows error when microphone access is denied', async () => {
            const user = userEvent.setup();
            mockGetUserMedia.mockRejectedValue(new Error('Permission denied'));

            render(<Contact />, { wrapper: TestWrapper });

            const micButton = screen.getByTitle(/voice input/i);
            await user.click(micButton);

            await waitFor(() => {
                expect(screen.getByText(/could not access microphone/i)).toBeInTheDocument();
            });
        });

        it('stops recording and shows transcribing state', async () => {
            const user = userEvent.setup();
            render(<Contact />, { wrapper: TestWrapper });

            const micButton = screen.getByTitle(/voice input/i);
            await user.click(micButton);

            await waitFor(() => {
                expect(screen.getByText(/recording/i)).toBeInTheDocument();
            });

            // Click again to stop
            await user.click(micButton);

            // Should trigger stop on mediaRecorder
            expect(mockMediaRecorder.stop).toHaveBeenCalled();
        });
    });

    describe('Accessibility', () => {
        it('has accessible form labels', () => {
            render(<Contact />, { wrapper: TestWrapper });

            const firstName = screen.getByLabelText(/first name/i);
            const lastName = screen.getByLabelText(/last name/i);
            const email = screen.getByLabelText(/work email/i);
            const company = screen.getByLabelText(/company name/i);
            const message = screen.getByLabelText(/how can we help/i);

            expect(firstName).toBeInTheDocument();
            expect(lastName).toBeInTheDocument();
            expect(email).toBeInTheDocument();
            expect(company).toBeInTheDocument();
            expect(message).toBeInTheDocument();
        });

        it('voice input button has accessible label', () => {
            render(<Contact />, { wrapper: TestWrapper });
            expect(screen.getByTitle(/voice input/i)).toBeInTheDocument();
        });
    });
});
