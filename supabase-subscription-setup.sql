-- =============================================
-- ADD SUBSCRIPTION MANAGEMENT TO DATABASE
-- =============================================

-- First, let's create an enum for subscription types
CREATE TYPE subscription_type AS ENUM ('free', 'pro');

-- Add subscription fields to the profiles table
ALTER TABLE profiles 
ADD COLUMN subscription_status subscription_type DEFAULT 'free' NOT NULL,
ADD COLUMN subscription_start_date timestamptz,
ADD COLUMN subscription_end_date timestamptz,
ADD COLUMN subscription_auto_renew boolean DEFAULT false,
ADD COLUMN subscription_updated_at timestamptz DEFAULT now();

-- Create index for efficient subscription queries
CREATE INDEX profiles_subscription_status_idx ON profiles(subscription_status);
CREATE INDEX profiles_subscription_end_date_idx ON profiles(subscription_end_date);

-- =============================================
-- CREATE SUBSCRIPTION HISTORY TABLE
-- =============================================

-- Track subscription changes over time
CREATE TABLE subscription_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  subscription_type subscription_type NOT NULL,
  start_date timestamptz NOT NULL,
  end_date timestamptz,
  price_paid decimal(10,2),
  payment_method text,
  transaction_id text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'refunded')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add RLS policies for subscription_history
ALTER TABLE subscription_history ENABLE ROW LEVEL SECURITY;

-- Users can only see their own subscription history
CREATE POLICY "Users can view own subscription history" ON subscription_history
  FOR SELECT USING (auth.uid() = user_id);

-- Only authenticated users can insert their own subscription records
CREATE POLICY "Users can insert own subscription history" ON subscription_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for subscription_history
CREATE INDEX subscription_history_user_id_idx ON subscription_history(user_id);
CREATE INDEX subscription_history_status_idx ON subscription_history(status);
CREATE INDEX subscription_history_end_date_idx ON subscription_history(end_date);

-- =============================================
-- CREATE SUBSCRIPTION MANAGEMENT FUNCTIONS
-- =============================================

-- Function to upgrade user to Pro
CREATE OR REPLACE FUNCTION upgrade_to_pro(
  user_id_input uuid,
  duration_months integer DEFAULT 1,
  price_paid_input decimal DEFAULT 9.99,
  payment_method_input text DEFAULT 'stripe',
  transaction_id_input text DEFAULT null
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  end_date_calculated timestamptz;
BEGIN
  -- Calculate end date based on duration
  end_date_calculated := now() + (duration_months || ' months')::interval;
  
  -- Update user's subscription status in profiles
  UPDATE profiles 
  SET 
    subscription_status = 'pro',
    subscription_start_date = now(),
    subscription_end_date = end_date_calculated,
    subscription_auto_renew = true,
    subscription_updated_at = now()
  WHERE id = user_id_input;
  
  -- Add record to subscription history
  INSERT INTO subscription_history (
    user_id,
    subscription_type,
    start_date,
    end_date,
    price_paid,
    payment_method,
    transaction_id,
    status
  ) VALUES (
    user_id_input,
    'pro',
    now(),
    end_date_calculated,
    price_paid_input,
    payment_method_input,
    transaction_id_input,
    'active'
  );
  
  RETURN true;
END;
$$;

-- Function to downgrade user to Free (or cancel subscription)
CREATE OR REPLACE FUNCTION downgrade_to_free(
  user_id_input uuid,
  reason text DEFAULT 'user_cancelled'
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update user's subscription status in profiles
  UPDATE profiles 
  SET 
    subscription_status = 'free',
    subscription_end_date = now(),
    subscription_auto_renew = false,
    subscription_updated_at = now()
  WHERE id = user_id_input;
  
  -- Update current active subscription in history
  UPDATE subscription_history 
  SET 
    status = 'cancelled',
    end_date = now(),
    updated_at = now()
  WHERE user_id = user_id_input 
    AND status = 'active' 
    AND subscription_type = 'pro';
  
  RETURN true;
END;
$$;

-- Function to check if user's subscription is expired and update status
CREATE OR REPLACE FUNCTION check_and_update_expired_subscriptions()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  expired_count integer := 0;
BEGIN
  -- Update profiles where subscription has expired
  UPDATE profiles 
  SET 
    subscription_status = 'free',
    subscription_auto_renew = false,
    subscription_updated_at = now()
  WHERE subscription_status = 'pro' 
    AND subscription_end_date < now();
  
  GET DIAGNOSTICS expired_count = ROW_COUNT;
  
  -- Update subscription history for expired subscriptions
  UPDATE subscription_history 
  SET 
    status = 'expired',
    updated_at = now()
  WHERE status = 'active' 
    AND end_date < now();
  
  RETURN expired_count;
END;
$$;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION upgrade_to_pro(uuid, integer, decimal, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION downgrade_to_free(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION check_and_update_expired_subscriptions() TO authenticated;

-- =============================================
-- CREATE SUBSCRIPTION HELPER VIEWS
-- =============================================

-- View for active subscriptions
CREATE VIEW active_subscriptions AS
SELECT 
  p.id as user_id,
  p.username,
  p.first_name,
  p.last_name,
  p.subscription_status,
  p.subscription_start_date,
  p.subscription_end_date,
  p.subscription_auto_renew,
  CASE 
    WHEN p.subscription_end_date > now() THEN 'active'
    WHEN p.subscription_end_date <= now() THEN 'expired'
    ELSE 'free'
  END as current_status,
  CASE 
    WHEN p.subscription_end_date > now() 
    THEN p.subscription_end_date - now()
    ELSE null
  END as time_remaining
FROM profiles p
WHERE p.subscription_status = 'pro';

-- Grant access to the view
GRANT SELECT ON active_subscriptions TO authenticated;

-- =============================================
-- UPDATE EXISTING USERS TO FREE TIER
-- =============================================

-- Set all existing users to free tier (they can upgrade later)
UPDATE profiles 
SET 
  subscription_status = 'free',
  subscription_updated_at = now()
WHERE subscription_status IS NULL;

-- =============================================
-- CREATE TRIGGER FOR SUBSCRIPTION UPDATES
-- =============================================

-- Function to update subscription_updated_at timestamp
CREATE OR REPLACE FUNCTION update_subscription_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.subscription_updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger to automatically update subscription_updated_at
CREATE TRIGGER update_subscription_timestamp_trigger
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  WHEN (
    OLD.subscription_status IS DISTINCT FROM NEW.subscription_status OR
    OLD.subscription_end_date IS DISTINCT FROM NEW.subscription_end_date OR
    OLD.subscription_auto_renew IS DISTINCT FROM NEW.subscription_auto_renew
  )
  EXECUTE FUNCTION update_subscription_timestamp();

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Check that the subscription fields were added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'profiles' 
  AND column_name LIKE 'subscription%'
ORDER BY column_name;

-- Check that the subscription_history table was created
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_name = 'subscription_history'
ORDER BY ordinal_position;

-- Check that the functions were created
SELECT proname as function_name, pronargs as num_args
FROM pg_proc 
WHERE proname IN ('upgrade_to_pro', 'downgrade_to_free', 'check_and_update_expired_subscriptions');

-- =============================================
-- EXAMPLE USAGE
-- =============================================

/*
-- Upgrade a user to Pro for 1 month
SELECT upgrade_to_pro(
  'user-uuid-here'::uuid, 
  1, -- 1 month
  9.99, -- price
  'stripe', -- payment method
  'txn_1234567890' -- transaction ID
);

-- Downgrade a user to Free
SELECT downgrade_to_free('user-uuid-here'::uuid, 'user_cancelled');

-- Check for expired subscriptions (run this periodically)
SELECT check_and_update_expired_subscriptions();

-- Get all active Pro subscribers
SELECT * FROM active_subscriptions;

-- Get subscription history for a user
SELECT * FROM subscription_history WHERE user_id = 'user-uuid-here'::uuid;
*/ 