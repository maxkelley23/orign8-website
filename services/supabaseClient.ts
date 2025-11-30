import { createClient } from '@supabase/supabase-js';
import { ContactFormData } from '../types';

// Safely access process.env or provide defaults to prevent crashes in browser environments
const getEnv = (key: string, defaultValue: string) => {
  try {
    // Check if process exists safely before accessing env
    if (typeof process !== 'undefined' && process && process.env) {
      return process.env[key] || defaultValue;
    }
    return defaultValue;
  } catch {
    return defaultValue;
  }
};

const SUPABASE_URL = getEnv('REACT_APP_SUPABASE_URL', 'https://xyzcompany.supabase.co');
const SUPABASE_ANON_KEY = getEnv('REACT_APP_SUPABASE_ANON_KEY', 'public-anon-key');

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const submitLead = async (data: ContactFormData) => {
  // Mock submission for UI demonstration purposes since we don't have real credentials
  console.log("Submitting to Supabase:", data);
  
  // Simulation of network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // In real implementation:
  // const { error } = await supabase.from('leads').insert([data]);
  // if (error) throw error;
  
  return { success: true };
};