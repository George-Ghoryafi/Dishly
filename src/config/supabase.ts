import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file and ensure EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY are set.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Enable automatic session refresh
    autoRefreshToken: true,
    // Persist session in async storage
    persistSession: true,
    // Detect session from URL (useful for magic links)
    detectSessionInUrl: false,
  },
});

// Types for our database tables (we'll expand this later)
export interface User {
  id: string;
  email: string;
  name: string;
  username?: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  username: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  subscription_status: 'free' | 'pro';
  subscription_start_date?: string;
  subscription_end_date?: string;
  subscription_auto_renew: boolean;
  subscription_updated_at: string;
  created_at: string;
  updated_at: string;
}

// Subscription history interface
export interface SubscriptionHistory {
  id: string;
  user_id: string;
  subscription_type: 'free' | 'pro';
  start_date: string;
  end_date?: string;
  price_paid?: number;
  payment_method?: string;
  transaction_id?: string;
  status: 'active' | 'cancelled' | 'expired' | 'refunded';
  created_at: string;
  updated_at: string;
} 