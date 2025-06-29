-- =============================================
-- ADD UNIQUE CONSTRAINTS TO PROFILES TABLE
-- =============================================

-- First, let's check for any existing duplicate usernames or emails
-- (Run these queries first to see if there are any duplicates)

-- Check for duplicate usernames
SELECT username, COUNT(*) 
FROM profiles 
WHERE username IS NOT NULL 
GROUP BY username 
HAVING COUNT(*) > 1;

-- Check for duplicate emails (from auth.users)
SELECT email, COUNT(*) 
FROM auth.users 
WHERE email IS NOT NULL 
GROUP BY email 
HAVING COUNT(*) > 1;

-- =============================================
-- CLEAN UP ANY EXISTING DUPLICATES (if needed)
-- =============================================

-- If you found duplicates above, you may need to clean them up first
-- This query will keep the first occurrence and delete the rest
-- UNCOMMENT AND RUN ONLY IF YOU HAVE DUPLICATES:

/*
DELETE FROM profiles 
WHERE id NOT IN (
  SELECT DISTINCT ON (username) id 
  FROM profiles 
  WHERE username IS NOT NULL 
  ORDER BY username, created_at
);
*/

-- =============================================
-- ADD UNIQUE CONSTRAINTS
-- =============================================

-- Add unique constraint to username in profiles table
-- This will prevent duplicate usernames
ALTER TABLE profiles 
ADD CONSTRAINT profiles_username_unique 
UNIQUE (username);

-- Note: Email uniqueness is already enforced by Supabase Auth
-- The auth.users table already has a unique constraint on email
-- But let's verify it exists:
SELECT 
  conname as constraint_name,
  contype as constraint_type
FROM pg_constraint 
WHERE conrelid = 'auth.users'::regclass 
  AND contype = 'u'
  AND conname LIKE '%email%';

-- =============================================
-- CREATE CASE-INSENSITIVE UNIQUE INDEX FOR USERNAME
-- =============================================

-- Drop the existing index if it exists
DROP INDEX IF EXISTS profiles_username_idx;

-- Create a case-insensitive unique index for username
-- This prevents users from creating "JohnDoe" when "johndoe" already exists
CREATE UNIQUE INDEX profiles_username_lower_unique_idx 
ON profiles (LOWER(username)) 
WHERE username IS NOT NULL;

-- =============================================
-- UPDATE THE TRIGGER FUNCTION FOR BETTER ERROR HANDLING
-- =============================================

-- Update the trigger function to handle potential constraint violations
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile with error handling
  INSERT INTO public.profiles (id, first_name, last_name, username)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'username'
  );
  
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- If username is already taken, we'll let the application handle it
    -- The user will still be created in auth.users, but profile creation will fail
    -- This allows the application to show a proper error message
    RAISE NOTICE 'Profile creation failed due to unique constraint violation for user %', NEW.id;
    RETURN NEW;
  WHEN OTHERS THEN
    -- Log other errors but don't prevent user creation
    RAISE NOTICE 'Profile creation failed for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- VERIFY THE CONSTRAINTS
-- =============================================

-- Check that the constraints were added successfully
SELECT 
  conname as constraint_name,
  contype as constraint_type,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'profiles'::regclass 
  AND contype = 'u';

-- Check the unique index
SELECT 
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename = 'profiles' 
  AND indexname LIKE '%username%';

-- =============================================
-- TEST THE CONSTRAINTS (Optional)
-- =============================================

-- You can test the constraints with these queries:
-- (These should fail after running the above SQL)

/*
-- This should fail if you try to insert a duplicate username:
INSERT INTO profiles (id, username, first_name, last_name) 
VALUES (gen_random_uuid(), 'testuser', 'Test', 'User');

INSERT INTO profiles (id, username, first_name, last_name) 
VALUES (gen_random_uuid(), 'testuser', 'Another', 'User');

-- This should also fail (case-insensitive):
INSERT INTO profiles (id, username, first_name, last_name) 
VALUES (gen_random_uuid(), 'TESTUSER', 'Case', 'Test');
*/ 