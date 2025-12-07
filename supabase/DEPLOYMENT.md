# Supabase Deployment Runbook

## Prerequisites

- Supabase account at [supabase.com](https://supabase.com)
- Supabase CLI installed: `npm install -g supabase`
- Project credentials from Supabase Dashboard

---

## 1. Initial Setup

### Create Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Select organization and enter project name: `orign8`
4. Choose region closest to your users
5. Set a strong database password (save it securely)
6. Wait for project to provision (~2 minutes)

### Get Credentials

From your project dashboard, navigate to **Settings > API**:

- **Project URL**: `https://[project-ref].supabase.co`
- **anon public key**: Used in frontend (safe to expose)
- **service_role key**: Backend only (keep secret)

---

## 2. Configure Environment

### Local Development

Create `.env.local` in project root:

```bash
VITE_SUPABASE_URL=https://[your-project-ref].supabase.co
VITE_SUPABASE_ANON_KEY=[your-anon-key]
```

### Production

Set these environment variables in your hosting platform (Vercel, Netlify, etc.):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## 3. Run Migrations

### Option A: Supabase CLI (Recommended)

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref [your-project-ref]

# Push migrations
supabase db push
```

### Option B: Manual SQL

1. Go to Supabase Dashboard > SQL Editor
2. Copy contents of `supabase/migrations/20241130000000_create_leads_table.sql`
3. Run the SQL

---

## 4. Seed Development Data (Optional)

For development/staging environments only:

```bash
# Via CLI
supabase db seed

# Or manually run supabase/seed.sql in SQL Editor
```

---

## 5. Verify Setup

### Test Connection

```bash
npm test -- src/services/supabaseClient.test.ts
```

Integration tests will automatically run when real credentials are detected.

### Manual Verification

1. Go to Supabase Dashboard > Table Editor
2. Verify `leads` table exists with correct schema
3. Check RLS policies are applied

---

## 6. Backup & Restore

### Create Backup

```bash
# Via Supabase CLI
supabase db dump -f backup_$(date +%Y%m%d).sql

# Or use Dashboard > Database > Backups
```

### Restore from Backup

```bash
# Via CLI
supabase db push --db-url postgresql://... < backup_file.sql

# Or use Dashboard SQL Editor to run backup SQL
```

### Automated Backups

Supabase Pro plan includes:
- Daily automated backups (7-day retention)
- Point-in-time recovery

---

## 7. Monitoring

### Check Logs

- Dashboard > Logs > Postgres logs
- Dashboard > Logs > API logs

### Query Performance

- Dashboard > Database > Query Performance
- Enable `pg_stat_statements` for detailed analysis

---

## 8. Troubleshooting

### "relation 'leads' does not exist"

Migration hasn't run. Execute step 3.

### "permission denied for table leads"

RLS policy issue. Verify policies in Dashboard > Authentication > Policies.

### "Invalid API key"

Check `.env.local` has correct `VITE_SUPABASE_ANON_KEY` (not service_role key).

### Connection timeout

- Check project is not paused (free tier pauses after 1 week inactivity)
- Verify network/firewall allows Supabase connections

---

## Schema Reference

```sql
-- leads table
CREATE TABLE public.leads (
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

-- Indexes
CREATE INDEX idx_leads_email ON public.leads(email);
CREATE INDEX idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX idx_leads_nmls_id ON public.leads(nmls_id) WHERE nmls_id IS NOT NULL;
```

---

## Security Checklist

- [ ] RLS enabled on `leads` table
- [ ] anon key used in frontend (not service_role)
- [ ] service_role key stored securely (never in frontend)
- [ ] Database password is strong and stored in password manager
- [ ] Production environment variables set correctly
