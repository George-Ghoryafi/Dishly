-- =============================================
-- CREATE FUNCTION TO GET EMAIL FROM USERNAME
-- =============================================

-- This function allows us to get a user's email address from their username
-- so they can sign in with either email or username
CREATE OR REPLACE FUNCTION get_email_from_username(username_input text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_id_found uuid;
  email_found text;
BEGIN
  -- Find the user ID from the profiles table using the username
  SELECT id INTO user_id_found
  FROM profiles
  WHERE LOWER(username) = LOWER(username_input)
  LIMIT 1;
  
  -- If no user found with that username, return null
  IF user_id_found IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Get the email from auth.users using the user ID
  SELECT email INTO email_found
  FROM auth.users
  WHERE id = user_id_found
  AND email_confirmed_at IS NOT NULL  -- Only return confirmed emails
  LIMIT 1;
  
  RETURN email_found;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_email_from_username(text) TO authenticated;
GRANT EXECUTE ON FUNCTION get_email_from_username(text) TO anon;

-- =============================================
-- TEST THE FUNCTION (Optional)
-- =============================================

-- You can test the function like this:
-- SELECT get_email_from_username('your_test_username');

-- =============================================
-- VERIFICATION
-- =============================================

-- Check that the function was created successfully
SELECT 
  proname as function_name,
  prosrc as function_body
FROM pg_proc 
WHERE proname = 'get_email_from_username'; 