# Orign8 Website - Remaining Tasks

## Priority 1: Lead Capture & Notifications

### Supabase Setup
- [ ] Create Supabase project at [supabase.com](https://supabase.com)
- [ ] Run migration: Copy `supabase/migrations/20241130000000_create_leads_table.sql` into SQL Editor
- [ ] Add to `.env.local`:
  ```
  VITE_SUPABASE_URL=https://[your-project].supabase.co
  VITE_SUPABASE_ANON_KEY=[your-anon-key]
  ```
- [ ] Add same variables to Vercel Environment Variables

### Email Notifications (Resend + Supabase Edge Function)

#### Step 1: Set up Resend
- [ ] Create account at [resend.com](https://resend.com) (free tier: 3k emails/month)
- [ ] Go to API Keys → Create API Key
- [ ] Save the API key (starts with `re_`)
- [ ] Verify your domain OR use `onboarding@resend.dev` for testing

#### Step 2: Create Supabase Edge Function
- [ ] Install Supabase CLI: `npm install -g supabase`
- [ ] Login: `supabase login`
- [ ] Link project: `supabase link --project-ref [your-project-ref]`
- [ ] Create function: `supabase functions new notify-lead`
- [ ] Replace `supabase/functions/notify-lead/index.ts` with:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const NOTIFICATION_EMAIL = "your-email@example.com"; // Change this!

serve(async (req) => {
  const { record } = await req.json();

  const emailHtml = `
    <h2>New Lead Submission</h2>
    <p><strong>Name:</strong> ${record.first_name} ${record.last_name}</p>
    <p><strong>Email:</strong> ${record.email}</p>
    <p><strong>Company:</strong> ${record.company}</p>
    <p><strong>NMLS ID:</strong> ${record.nmls_id || "Not provided"}</p>
    <p><strong>Message:</strong> ${record.message || "No message"}</p>
    <p><strong>Submitted:</strong> ${new Date(record.created_at).toLocaleString()}</p>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "Orign8 Leads <onboarding@resend.dev>", // Or your verified domain
      to: [NOTIFICATION_EMAIL],
      subject: `New Lead: ${record.first_name} ${record.last_name} - ${record.company}`,
      html: emailHtml,
    }),
  });

  const data = await res.json();
  return new Response(JSON.stringify(data), { status: res.status });
});
```

#### Step 3: Deploy Edge Function
- [ ] Deploy: `supabase functions deploy notify-lead`
- [ ] Set secret: `supabase secrets set RESEND_API_KEY=re_your_api_key`

#### Step 4: Create Database Webhook
- [ ] Go to Supabase Dashboard → Database → Webhooks
- [ ] Click "Create a new hook"
- [ ] Configure:
  - **Name:** `notify-new-lead`
  - **Table:** `leads`
  - **Events:** `INSERT`
  - **Type:** `Supabase Edge Functions`
  - **Function:** `notify-lead`
- [ ] Save

#### Step 5: Test
- [ ] Submit a test lead on the contact form
- [ ] Check your email for notification

---

## Priority 2: Content & Legal

### Footer Links (Currently Placeholders)
- [ ] Create `/privacy` page with Privacy Policy
- [ ] Create `/terms` page with Terms of Service
- [ ] Or: Remove Legal section from footer entirely

### Content Review
- [ ] Review all marketing copy for accuracy
- [ ] Verify company name: "Orign8 Technologies Inc."
- [ ] Confirm contact email/phone if displayed anywhere

---

## Priority 3: Production Hardening

### Analytics (Optional)
- [ ] Set up Google Analytics 4 or Plausible
- [ ] Add `VITE_GA4_MEASUREMENT_ID` or `VITE_PLAUSIBLE_DOMAIN` to Vercel

### Error Monitoring (Optional)
- [ ] Create Sentry project at [sentry.io](https://sentry.io)
- [ ] Add `VITE_SENTRY_DSN` to Vercel

### SEO Finalization
- [ ] Update `BASE_URL` in `components/SEO.tsx` to actual domain
- [ ] Convert `public/og-image.svg` to PNG (1200x630) for social media
- [ ] Convert `public/apple-touch-icon.svg` to PNG (180x180)
- [ ] Update `public/sitemap.xml` with actual domain

---

## Priority 4: Voice AI Demo (If Needed)

### Server Setup
- [ ] Deploy `server/` to a Node.js host (Railway, Render, Fly.io)
- [ ] Add `GEMINI_API_KEY` to server environment
- [ ] Update `VITE_API_URL` in Vercel to point to deployed server

---

## Quick Reference

### Environment Variables Needed in Vercel
| Variable | Required | Purpose |
|----------|----------|---------|
| `VITE_SUPABASE_URL` | Yes | Database connection |
| `VITE_SUPABASE_ANON_KEY` | Yes | Database auth |
| `VITE_SENTRY_DSN` | No | Error tracking |
| `VITE_GA4_MEASUREMENT_ID` | No | Analytics |
| `VITE_API_URL` | No | Voice AI server |

### Files to Update Before Launch
- `components/SEO.tsx` - Update BASE_URL
- `public/sitemap.xml` - Update domain
- `index.html` - Update og:image URLs if domain changes
