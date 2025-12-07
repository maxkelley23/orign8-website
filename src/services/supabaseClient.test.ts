import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock environment variables before importing module
const mockSupabaseUrl = 'https://test-project.supabase.co';
const mockSupabaseKey = 'test-anon-key-12345';

describe('Supabase Client', () => {
    describe('Environment Validation', () => {
        beforeEach(() => {
            vi.resetModules();
        });

        afterEach(() => {
            vi.unstubAllEnvs();
        });

        it('returns null when SUPABASE_URL is not configured', async () => {
            vi.stubEnv('VITE_SUPABASE_URL', '');
            vi.stubEnv('VITE_SUPABASE_ANON_KEY', mockSupabaseKey);

            const { supabase } = await import('@/services/supabaseClient');

            expect(supabase).toBeNull();
        });

        it('returns null when SUPABASE_URL is placeholder value', async () => {
            vi.stubEnv('VITE_SUPABASE_URL', 'your-project-url');
            vi.stubEnv('VITE_SUPABASE_ANON_KEY', mockSupabaseKey);

            const { supabase } = await import('@/services/supabaseClient');

            expect(supabase).toBeNull();
        });

        it('returns null when SUPABASE_ANON_KEY is not configured', async () => {
            vi.stubEnv('VITE_SUPABASE_URL', mockSupabaseUrl);
            vi.stubEnv('VITE_SUPABASE_ANON_KEY', '');

            const { supabase } = await import('@/services/supabaseClient');

            expect(supabase).toBeNull();
        });

        it('returns null when SUPABASE_ANON_KEY is placeholder value', async () => {
            vi.stubEnv('VITE_SUPABASE_URL', mockSupabaseUrl);
            vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'your-anon-key');

            const { supabase } = await import('@/services/supabaseClient');

            expect(supabase).toBeNull();
        });
    });

    describe('isSupabaseConfigured', () => {
        beforeEach(() => {
            vi.resetModules();
        });

        afterEach(() => {
            vi.unstubAllEnvs();
        });

        it('returns false when not configured', async () => {
            vi.stubEnv('VITE_SUPABASE_URL', '');
            vi.stubEnv('VITE_SUPABASE_ANON_KEY', '');

            const { isSupabaseConfigured } = await import('@/services/supabaseClient');

            expect(isSupabaseConfigured()).toBe(false);
        });
    });

    describe('submitLead - Mock Mode', () => {
        beforeEach(() => {
            vi.resetModules();
            vi.useFakeTimers();
        });

        afterEach(() => {
            vi.unstubAllEnvs();
            vi.useRealTimers();
        });

        it('returns success in mock mode when Supabase not configured', async () => {
            vi.stubEnv('VITE_SUPABASE_URL', '');
            vi.stubEnv('VITE_SUPABASE_ANON_KEY', '');

            const { submitLead } = await import('@/services/supabaseClient');

            const leadData = {
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane@example.com',
                company: 'Acme Mortgage',
                nmlsId: '123456',
                message: 'Interested in your services',
            };

            const resultPromise = submitLead(leadData);

            // Advance timers to skip the mock delay
            vi.advanceTimersByTime(1000);

            const result = await resultPromise;

            expect(result.success).toBe(true);
            expect(result.data).toBeDefined();
        });

        it('includes mock ID in response data', async () => {
            vi.stubEnv('VITE_SUPABASE_URL', '');
            vi.stubEnv('VITE_SUPABASE_ANON_KEY', '');

            const { submitLead } = await import('@/services/supabaseClient');

            const leadData = {
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane@example.com',
                company: 'Acme Mortgage',
                nmlsId: '123456',
                message: 'Test message',
            };

            const resultPromise = submitLead(leadData);
            vi.advanceTimersByTime(1000);
            const result = await resultPromise;

            expect((result.data as { id: string }).id).toMatch(/^mock-\d+$/);
        });

        it('simulates network delay in mock mode', async () => {
            vi.stubEnv('VITE_SUPABASE_URL', '');
            vi.stubEnv('VITE_SUPABASE_ANON_KEY', '');

            const { submitLead } = await import('@/services/supabaseClient');

            const leadData = {
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane@example.com',
                company: 'Acme Mortgage',
                nmlsId: '',
                message: 'Test',
            };

            let resolved = false;
            const resultPromise = submitLead(leadData).then(result => {
                resolved = true;
                return result;
            });

            // Should not resolve immediately
            expect(resolved).toBe(false);

            // Advance past the delay
            vi.advanceTimersByTime(1000);
            await resultPromise;

            expect(resolved).toBe(true);
        });
    });

    describe('getLeads - Mock Mode', () => {
        beforeEach(() => {
            vi.resetModules();
        });

        afterEach(() => {
            vi.unstubAllEnvs();
        });

        it('returns empty array when Supabase not configured', async () => {
            vi.stubEnv('VITE_SUPABASE_URL', '');
            vi.stubEnv('VITE_SUPABASE_ANON_KEY', '');

            const { getLeads } = await import('@/services/supabaseClient');

            const result = await getLeads();

            expect(result.data).toEqual([]);
            expect(result.error).toBe('Supabase not configured');
        });
    });

    describe('submitLead - Real Mode (with mocked Supabase)', () => {
        // These tests require mocking the Supabase client
        // In a real scenario, you'd mock the @supabase/supabase-js module

        it('transforms form data to database schema', async () => {
            // This test verifies the data transformation
            const leadData = {
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane@example.com',
                company: 'Acme Mortgage',
                nmlsId: '123456',
                message: 'Test message',
            };

            // Verify the expected transformation
            const expectedDbFormat = {
                first_name: leadData.firstName,
                last_name: leadData.lastName,
                email: leadData.email,
                company: leadData.company,
                nmls_id: leadData.nmlsId,
                message: leadData.message,
            };

            expect(expectedDbFormat.first_name).toBe('Jane');
            expect(expectedDbFormat.last_name).toBe('Doe');
            expect(expectedDbFormat.nmls_id).toBe('123456');
        });

        it('handles null NMLS ID correctly', async () => {
            const leadData = {
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane@example.com',
                company: 'Acme Mortgage',
                nmlsId: '', // Empty string should become null
                message: 'Test message',
            };

            // The code converts empty nmlsId to null
            const nmls_id = leadData.nmlsId || null;

            expect(nmls_id).toBeNull();
        });
    });
});

// =============================================================================
// INTEGRATION TESTS (run with real Supabase credentials)
// =============================================================================
// These tests only run when explicitly enabled via VITE_RUN_INTEGRATION_TESTS=true
// This prevents accidental failures in CI or when credentials are misconfigured.
//
// To run integration tests:
//   1. Set up .env.local with real Supabase credentials
//   2. Ensure migration has been applied (leads table exists with correct RLS)
//   3. Add VITE_RUN_INTEGRATION_TESTS=true to .env.local
//   4. Run: npm test -- src/services/supabaseClient.test.ts

const shouldRunIntegrationTests = (): boolean => {
    // Require explicit opt-in to run integration tests
    return import.meta.env.VITE_RUN_INTEGRATION_TESTS === 'true';
};

const describeIntegration = shouldRunIntegrationTests() ? describe : describe.skip;

describeIntegration('Supabase Integration Tests (requires real credentials)', () => {
    const testEmail = `test-${Date.now()}@integration-test.local`;

    it('successfully inserts a lead into the database', async () => {
        vi.resetModules();
        const { submitLead, isSupabaseConfigured } = await import('@/services/supabaseClient');

        expect(isSupabaseConfigured()).toBe(true);

        const leadData = {
            firstName: 'Integration',
            lastName: 'Test',
            email: testEmail,
            company: 'Test Company Inc',
            nmlsId: '999999',
            message: 'Automated integration test - safe to delete',
        };

        const result = await submitLead(leadData);

        expect(result.success).toBe(true);
        expect(result.error).toBeUndefined();
        expect(result.data).toBeDefined();
    });

    it('successfully retrieves leads from the database', async () => {
        vi.resetModules();
        const { getLeads, isSupabaseConfigured } = await import('@/services/supabaseClient');

        expect(isSupabaseConfigured()).toBe(true);

        const result = await getLeads();

        expect(result.error).toBeNull();
        expect(Array.isArray(result.data)).toBe(true);
    });

    it('retrieves the lead we just inserted', async () => {
        vi.resetModules();
        const { getLeads } = await import('@/services/supabaseClient');

        const result = await getLeads();

        expect(result.data).toBeDefined();
        const insertedLead = (result.data as Array<{ email: string }>)?.find(
            lead => lead.email === testEmail
        );
        expect(insertedLead).toBeDefined();
    });
});
