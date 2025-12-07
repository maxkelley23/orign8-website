-- =============================================================================
-- LEADS TABLE MIGRATION
-- =============================================================================
-- This migration creates the leads table for mortgage lead capture.
-- Run via Supabase CLI: supabase db push
-- Or apply directly in Supabase Dashboard SQL Editor

-- Create leads table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT NOT NULL,
    nmls_id TEXT,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_nmls_id ON public.leads(nmls_id) WHERE nmls_id IS NOT NULL;

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- RLS POLICIES
-- =============================================================================

-- Policy: Allow inserts from authenticated users and anonymous (for public contact form)
CREATE POLICY "Allow public lead submissions"
    ON public.leads
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Policy: Only authenticated users can read leads (admin dashboard)
CREATE POLICY "Authenticated users can view leads"
    ON public.leads
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy: Only service role can update leads (backend operations)
-- Note: Service role bypasses RLS by default, this is just for documentation

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.leads
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON TABLE public.leads IS 'Mortgage lead capture from contact form';
COMMENT ON COLUMN public.leads.nmls_id IS 'NMLS ID for mortgage industry compliance verification';
COMMENT ON COLUMN public.leads.message IS 'Optional message or voice transcription from lead';
