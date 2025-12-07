-- =============================================================================
-- DEVELOPMENT SEED DATA
-- =============================================================================
-- This file seeds the database with sample data for development.
-- Run via: supabase db seed
-- Or manually in Supabase Dashboard SQL Editor

-- Sample leads for development/testing
INSERT INTO public.leads (first_name, last_name, email, company, nmls_id, message, created_at)
VALUES
    ('John', 'Smith', 'john.smith@example.com', 'ABC Mortgage', '123456', 'Interested in AI-powered calling solutions for our loan officers.', NOW() - INTERVAL '7 days'),
    ('Sarah', 'Johnson', 'sarah.j@mortgagepro.com', 'MortgagePro Inc', '789012', 'Looking to improve our lead conversion rates. Please call me back.', NOW() - INTERVAL '3 days'),
    ('Michael', 'Williams', 'm.williams@homeloans.com', 'Home Loans Direct', '345678', NULL, NOW() - INTERVAL '1 day'),
    ('Emily', 'Brown', 'emily.brown@lendright.com', 'LendRight Financial', '901234', 'Our team needs TCPA-compliant calling automation. Very interested!', NOW() - INTERVAL '12 hours'),
    ('David', 'Miller', 'david.m@quickmortgage.com', 'Quick Mortgage LLC', NULL, 'Heard about your product from a colleague. Would like a demo.', NOW())
ON CONFLICT DO NOTHING;
