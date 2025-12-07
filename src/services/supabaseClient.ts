import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ContactFormData } from '../types';
import { startTransaction, captureError } from './monitoring';
import { Database, Lead } from '../types/database';

// =============================================================================
// ENVIRONMENT VALIDATION
// =============================================================================

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate required environment variables
const validateEnv = (): { url: string; key: string } | null => {
    if (!SUPABASE_URL || SUPABASE_URL === 'your-project-url') {
        console.warn('[Supabase] VITE_SUPABASE_URL is not configured');
        return null;
    }
    if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY === 'your-anon-key') {
        console.warn('[Supabase] VITE_SUPABASE_ANON_KEY is not configured');
        return null;
    }
    return { url: SUPABASE_URL, key: SUPABASE_ANON_KEY };
};

// =============================================================================
// SUPABASE CLIENT
// =============================================================================

const envConfig = validateEnv();

export const supabase: SupabaseClient<Database> | null = envConfig
    ? createClient<Database>(envConfig.url, envConfig.key)
    : null;

export const isSupabaseConfigured = (): boolean => {
    return supabase !== null;
};

// =============================================================================
// LEAD SUBMISSION
// =============================================================================

export interface SubmitLeadResult {
    success: boolean;
    error?: string;
    data?: Lead | ({ id: string } & ContactFormData) | null;  // Lead from DB, mock data, or null
}

export const submitLead = async (data: ContactFormData): Promise<SubmitLeadResult> => {
    // Start performance tracking
    const transaction = startTransaction('supabase.lead.submit', 'db.write');

    // If Supabase is not configured, use mock mode for development
    if (!supabase) {
        console.warn('[Supabase] Running in mock mode - lead not actually saved');
        console.log('[Supabase] Mock submission data:', {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            company: data.company,
            // Don't log sensitive fields in full
        });

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        transaction.finish();
        return {
            success: true,
            data: { id: `mock-${Date.now()}`, ...data },
        };
    }

    // Real Supabase submission
    try {
        const { data: result, error } = await supabase
            .from('leads')
            .insert([{
                first_name: data.firstName,
                last_name: data.lastName,
                email: data.email,
                company: data.company,
                nmls_id: data.nmlsId || null,
                message: data.message,
                created_at: new Date().toISOString(),
            }])
            .select()
            .single();

        transaction.finish();

        if (error || !result) {
            const errorMsg = error?.message || 'Insert returned no data';
            console.error('[Supabase] Insert error:', errorMsg);
            captureError(new Error(errorMsg), {
                tags: { operation: 'lead-submit' },
                extra: { email: data.email },
            });
            return {
                success: false,
                error: errorMsg,
            };
        }

        return {
            success: true,
            data: result as Lead,
        };
    } catch (err) {
        transaction.finish();
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('[Supabase] Unexpected error:', errorMessage);
        captureError(err instanceof Error ? err : new Error(errorMessage), {
            tags: { operation: 'lead-submit' },
        });
        return {
            success: false,
            error: errorMessage,
        };
    }
};

// =============================================================================
// QUERY HELPERS
// =============================================================================

export const getLeads = async () => {
    const transaction = startTransaction('supabase.leads.fetch', 'db.read');

    if (!supabase) {
        console.warn('[Supabase] Cannot fetch leads - not configured');
        transaction.finish();
        return { data: [], error: 'Supabase not configured' };
    }

    try {
        const { data, error } = await supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false });

        transaction.finish();

        if (error) {
            console.error('[Supabase] Fetch error:', error.message);
            captureError(new Error(error.message), {
                tags: { operation: 'leads-fetch' },
            });
            return { data: null, error: error.message };
        }

        return { data, error: null };
    } catch (err) {
        transaction.finish();
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        captureError(err instanceof Error ? err : new Error(errorMessage), {
            tags: { operation: 'leads-fetch' },
        });
        return { data: null, error: errorMessage };
    }
};
