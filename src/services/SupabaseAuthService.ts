import { supabase } from '../config/supabase';
import { User, Profile } from '../config/supabase';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  username?: string;
  subscriptionStatus: 'free' | 'pro';
  subscriptionEndDate?: string;
  isProUser: boolean;
}

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
}

class SupabaseAuthService {
  // Sign up new user
  async signUp({ email, password, firstName, lastName, username }: SignUpData): Promise<AuthUser> {
    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            username: username,
          },
          // Skip email confirmation in development
          emailRedirectTo: undefined,
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('User creation failed');

      // 2. Create profile record (fallback if trigger doesn't work)
      // Wait a moment for the trigger to potentially create the profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if profile was created by trigger
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', authData.user.id)
        .single();

      if (!existingProfile) {
        // Profile wasn't created by trigger, create it manually
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            username,
            first_name: firstName,
            last_name: lastName,
          });

        if (profileError) {
          console.error('Manual profile creation error:', profileError);
          // Don't throw here - user is created, profile can be created later
        }
      }

      return {
        id: authData.user.id,
        email: authData.user.email!,
        name: `${firstName} ${lastName}`,
        username,
        subscriptionStatus: 'free' as const,
        subscriptionEndDate: undefined,
        isProUser: false,
      };
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      // Handle specific error cases
      if (error?.message?.includes('duplicate key value violates unique constraint')) {
        if (error.message.includes('username')) {
          throw new Error('This username is already taken. Please choose a different username.');
        }
        if (error.message.includes('email')) {
          throw new Error('An account with this email already exists. Please use a different email or sign in.');
        }
      }
      
      // Handle other Supabase Auth errors
      if (error?.message?.includes('User already registered')) {
        throw new Error('An account with this email already exists. Please sign in instead.');
      }
      
      throw error;
    }
  }

  // Helper method to determine if input is email or username
  private isEmail(input: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
  }

  // Get email from username using database function
  private async getEmailFromUsername(username: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .rpc('get_email_from_username', { username_input: username.trim() });

      if (error) {
        console.error('Error getting email from username:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error calling get_email_from_username function:', error);
      return null;
    }
  }

  // Sign in with email or username
  async signInWithEmailOrUsername(emailOrUsername: string, password: string): Promise<AuthUser> {
    try {
      let email = emailOrUsername.trim();
      
      // If it's not an email, assume it's a username and try to find the associated email
      if (!this.isEmail(email)) {
        const foundEmail = await this.getEmailFromUsername(email);
        
        if (!foundEmail) {
          throw new Error('Invalid username or password. Please check your credentials and try again.');
        }
        
        email = foundEmail;
      }

      // Proceed with normal email sign-in
      return await this.signIn(email, password);
    } catch (error) {
      console.error('Sign in with email/username error:', error);
      throw error;
    }
  }

  // Sign in existing user (original method for email only)
  async signIn(email: string, password: string): Promise<AuthUser> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Provide more specific error messages
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Please check your email and confirm your account before signing in.');
        } else if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials and try again.');
        }
        throw error;
      }

      if (!data.user) throw new Error('Sign in failed');

      // Check if user email is confirmed (when email confirmation is enabled)
      if (!data.user.email_confirmed_at && data.user.confirmation_sent_at) {
        throw new Error('Please check your email and confirm your account before signing in.');
      }

      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      return {
        id: data.user.id,
        email: data.user.email!,
        name: profile ? `${profile.first_name} ${profile.last_name}` : data.user.email!,
        username: profile?.username,
        subscriptionStatus: profile?.subscription_status || 'free',
        subscriptionEndDate: profile?.subscription_end_date,
        isProUser: profile?.subscription_status === 'pro' && 
                   (!profile?.subscription_end_date || new Date(profile.subscription_end_date) > new Date()),
      };
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  // Get current user
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;

      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return {
        id: user.id,
        email: user.email!,
        name: profile ? `${profile.first_name} ${profile.last_name}` : user.email!,
        username: profile?.username,
        subscriptionStatus: profile?.subscription_status || 'free',
        subscriptionEndDate: profile?.subscription_end_date,
        isProUser: profile?.subscription_status === 'pro' && 
                   (!profile?.subscription_end_date || new Date(profile.subscription_end_date) > new Date()),
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Check if user is logged in
  async isLoggedIn(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null;
  }

  // Reserved usernames that cannot be used
  private reservedUsernames = [
    'admin', 'administrator', 'root', 'superuser', 'moderator', 'mod',
    'recipic', 'support', 'help', 'api', 'www', 'mail', 'email',
    'info', 'contact', 'about', 'terms', 'privacy', 'legal',
    'user', 'users', 'account', 'accounts', 'profile', 'profiles',
    'settings', 'config', 'system', 'service', 'services',
    'public', 'private', 'secure', 'security', 'auth', 'login',
    'signup', 'register', 'dashboard', 'home', 'index', 'main',
    'test', 'testing', 'demo', 'example', 'sample', 'null',
    'undefined', 'true', 'false', 'anonymous', 'guest'
  ];

  // Check username availability
  async isUsernameAvailable(username: string): Promise<boolean> {
    try {
      const trimmedUsername = username.trim().toLowerCase();
      
      // Check if username is reserved
      if (this.reservedUsernames.includes(trimmedUsername)) {
        return false;
      }

      // Check for exact match (case-insensitive due to our database index)
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .ilike('username', username.trim());

      if (error) {
        console.error('Username availability check error:', error);
        // On error, assume username is not available for safety
        return false;
      }

      // If no data returned, username is available
      // If data is returned, username is taken
      return !data || data.length === 0;
    } catch (error) {
      console.error('Username check error:', error);
      // On error, assume username is not available for safety
      return false;
    }
  }



  // Upgrade user to Pro subscription
  async upgradeToProSubscription(
    userId: string,
    durationMonths: number = 1,
    pricePaid: number = 9.99,
    paymentMethod: string = 'stripe',
    transactionId?: string
  ): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('upgrade_to_pro', {
        user_id_input: userId,
        duration_months: durationMonths,
        price_paid_input: pricePaid,
        payment_method_input: paymentMethod,
        transaction_id_input: transactionId,
      });

      if (error) {
        console.error('Error upgrading to Pro:', error);
        return false;
      }

      return data;
    } catch (error) {
      console.error('Error upgrading to Pro:', error);
      return false;
    }
  }

  // Downgrade user to Free subscription
  async downgradeToFreeSubscription(userId: string, reason: string = 'user_cancelled'): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('downgrade_to_free', {
        user_id_input: userId,
        reason: reason,
      });

      if (error) {
        console.error('Error downgrading to Free:', error);
        return false;
      }

      return data;
    } catch (error) {
      console.error('Error downgrading to Free:', error);
      return false;
    }
  }

  // Get user's subscription history
  async getSubscriptionHistory(userId: string) {
    try {
      const { data, error } = await supabase
        .from('subscription_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching subscription history:', error);
        return [];
      }

      return data;
    } catch (error) {
      console.error('Error fetching subscription history:', error);
      return [];
    }
  }

  // Check if user has active Pro subscription
  async hasActiveProSubscription(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_status, subscription_end_date')
        .eq('id', userId)
        .single();

      if (error || !data) {
        return false;
      }

      return data.subscription_status === 'pro' && 
             (!data.subscription_end_date || new Date(data.subscription_end_date) > new Date());
    } catch (error) {
      console.error('Error checking Pro subscription:', error);
      return false;
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = await this.getCurrentUser();
        callback(user);
      } else {
        callback(null);
      }
    });
  }
}

export const supabaseAuthService = new SupabaseAuthService(); 