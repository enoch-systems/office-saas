-- Reset database schema - drop all existing tables and recreate
-- Run this if you need to completely reset the database

-- Drop tables in reverse order due to foreign key constraints
DROP TABLE IF EXISTS public.social_links;
DROP TABLE IF EXISTS public.business_links;
DROP TABLE IF EXISTS public.user_profiles;
DROP TABLE IF EXISTS public.users;

-- Drop triggers and functions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.update_updated_at_column();

-- Note: After running this, run the complete schema.sql file to recreate everything
