-- Confirm all existing users (for development/testing)
-- This sets email_confirmed_at for users who haven't confirmed yet
UPDATE auth.users 
SET 
  email_confirmed_at = NOW(),
  updated_at = NOW()
WHERE 
  email_confirmed_at IS NULL 
  AND deleted_at IS NULL; 