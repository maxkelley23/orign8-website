---
name: supabase-integration
description: Supabase database and authentication integration for orign8-website. Use when working with database operations, user authentication, lead submissions, real-time subscriptions, or Row Level Security policies. Covers client setup, CRUD operations, and auth patterns.
---

# Supabase Integration Guide

## Purpose

Guide for integrating Supabase as the backend for orign8-website, including database operations, authentication, and real-time features.

## When to Use This Skill

- Setting up Supabase client
- Database CRUD operations
- User authentication (signup, login, logout)
- Session management
- Lead form submissions
- Real-time subscriptions
- Row Level Security (RLS) policies

---

## Quick Reference

### Environment Variables

```bash
# .env.local
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Client Setup

```typescript
// services/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

---

## Database Operations

### Insert Data (Lead Submission)

```typescript
import { supabase } from './supabaseClient';
import { ContactFormData } from '../types';

export const submitLead = async (data: ContactFormData) => {
    const { data: result, error } = await supabase
        .from('leads')
        .insert([{
            name: data.name,
            email: data.email,
            phone: data.phone,
            message: data.message,
            transcription: data.transcription,
            created_at: new Date().toISOString()
        }])
        .select();

    if (error) {
        console.error('Lead submission error:', error);
        throw error;
    }

    return { success: true, data: result };
};
```

### Query Data

```typescript
// Get all leads
export const getLeads = async () => {
    const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

// Get single record by ID
export const getLeadById = async (id: string) => {
    const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
};

// Filtered query
export const getLeadsByStatus = async (status: string) => {
    const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};
```

### Update Data

```typescript
export const updateLeadStatus = async (id: string, status: string) => {
    const { data, error } = await supabase
        .from('leads')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select();

    if (error) throw error;
    return data;
};
```

### Delete Data

```typescript
export const deleteLead = async (id: string) => {
    const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

    if (error) throw error;
    return { success: true };
};
```

---

## Authentication

### Sign Up

```typescript
export const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) throw error;
    return data;
};
```

### Sign In

```typescript
export const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw error;
    return data;
};
```

### Sign Out

```typescript
export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};
```

### Get Current User

```typescript
export const getCurrentUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
};
```

### Auth State Listener

```typescript
import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import type { User } from '@supabase/supabase-js';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    return { user, loading };
};
```

---

## Real-time Subscriptions

### Subscribe to Changes

```typescript
import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

export const useLeadsRealtime = () => {
    const [leads, setLeads] = useState<Lead[]>([]);

    useEffect(() => {
        // Initial fetch
        const fetchLeads = async () => {
            const { data } = await supabase.from('leads').select('*');
            if (data) setLeads(data);
        };
        fetchLeads();

        // Subscribe to changes
        const channel = supabase
            .channel('leads-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'leads'
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setLeads(prev => [payload.new as Lead, ...prev]);
                    } else if (payload.eventType === 'UPDATE') {
                        setLeads(prev => prev.map(lead =>
                            lead.id === payload.new.id ? payload.new as Lead : lead
                        ));
                    } else if (payload.eventType === 'DELETE') {
                        setLeads(prev => prev.filter(lead => lead.id !== payload.old.id));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return leads;
};
```

---

## Type Definitions

```typescript
// types.ts
export interface Lead {
    id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    transcription?: string;
    status: 'new' | 'contacted' | 'qualified' | 'closed';
    created_at: string;
    updated_at?: string;
}

export interface ContactFormData {
    name: string;
    email: string;
    phone: string;
    message: string;
    transcription?: string;
}
```

---

## Database Schema (SQL)

```sql
-- Create leads table
CREATE TABLE leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT,
    transcription TEXT,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to read all leads
CREATE POLICY "Authenticated users can read leads"
ON leads FOR SELECT
TO authenticated
USING (true);

-- Policy for anyone to insert leads (public form)
CREATE POLICY "Anyone can insert leads"
ON leads FOR INSERT
TO anon, authenticated
WITH CHECK (true);
```

---

## Error Handling Pattern

```typescript
export const safeSupabaseCall = async <T>(
    operation: () => Promise<{ data: T | null; error: any }>
): Promise<T> => {
    try {
        const { data, error } = await operation();

        if (error) {
            console.error('Supabase error:', error.message);
            throw new Error(error.message);
        }

        if (!data) {
            throw new Error('No data returned');
        }

        return data;
    } catch (err) {
        console.error('Unexpected error:', err);
        throw err;
    }
};

// Usage
const leads = await safeSupabaseCall(() =>
    supabase.from('leads').select('*')
);
```

---

## Anti-Patterns to Avoid

❌ Exposing service role key in frontend code
❌ Not handling errors from Supabase operations
❌ Forgetting to unsubscribe from real-time channels
❌ Not using RLS policies for security
❌ Storing sensitive data without encryption

---

**Skill Status**: COMPLETE ✅
