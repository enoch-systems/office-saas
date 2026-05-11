-- Supabase Database Schema for User Account Management
-- This schema creates tables for users, profiles, and business links

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles table
CREATE TABLE public.user_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  bio TEXT,
  profile_image_url TEXT DEFAULT '/belo.png',
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Business links table
CREATE TABLE public.business_links (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL, -- 'facebook', 'twitter', 'instagram', 'meta_business', 'whatsapp'
  url TEXT NOT NULL,
  display_name TEXT,
  description TEXT,
  icon_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, platform)
);

-- Social media links table (for profile social icons)
CREATE TABLE public.social_links (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL, -- 'facebook', 'twitter', 'instagram'
  url TEXT NOT NULL,
  icon_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, platform)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX idx_business_links_user_id ON public.business_links(user_id);
CREATE INDEX idx_social_links_user_id ON public.social_links(user_id);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only see their own data
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Profile policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Business links policies
CREATE POLICY "Users can view own business links" ON public.business_links
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own business links" ON public.business_links
  FOR ALL USING (auth.uid() = user_id);

-- Social links policies
CREATE POLICY "Users can view own social links" ON public.social_links
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own social links" ON public.social_links
  FOR ALL USING (auth.uid() = user_id);

-- Functions for automatic user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into users table
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  
  -- Insert default profile
  INSERT INTO public.user_profiles (user_id, first_name, last_name, bio, location)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'Name'),
    COALESCE(NEW.raw_user_meta_data->>'bio', ''),
    COALESCE(NEW.raw_user_meta_data->>'location', '')
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_business_links_updated_at BEFORE UPDATE ON public.business_links
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_social_links_updated_at BEFORE UPDATE ON public.social_links
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Students table
CREATE TABLE public.students (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  course TEXT NOT NULL,
  reg_date TEXT NOT NULL,
  reg_time TEXT,
  payment_plan TEXT NOT NULL,
  amount_paid NUMERIC DEFAULT 0,
  balance_remaining NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'None' CHECK (status IN ('None', 'Awaiting', 'Confirmed')),
  timestamp TEXT NOT NULL,
  gender TEXT NOT NULL,
  state_of_residence TEXT NOT NULL,
  learning_track TEXT NOT NULL,
  how_did_you_hear TEXT NOT NULL,
  has_laptop_and_internet TEXT NOT NULL,
  current_employment_status TEXT NOT NULL,
  wants_scholarship TEXT NOT NULL,
  why_learn_this_skill TEXT NOT NULL,
  last_progress TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email follow-ups table
CREATE TABLE public.email_followups (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  email_provider TEXT DEFAULT 'resend',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment requests table
CREATE TABLE public.payment_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  payment_date TEXT NOT NULL,
  image_url TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at TEXT NOT NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by TEXT,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for new tables
CREATE INDEX idx_students_email ON public.students(email);
CREATE INDEX idx_students_course ON public.students(course);
CREATE INDEX idx_students_status ON public.students(status);
CREATE INDEX idx_email_followups_student_id ON public.email_followups(student_id);
CREATE INDEX idx_email_followups_status ON public.email_followups(status);
CREATE INDEX idx_payment_requests_student_id ON public.payment_requests(student_id);
CREATE INDEX idx_payment_requests_status ON public.payment_requests(status);

-- Enable RLS for new tables
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for students (admin access only - modify as needed)
CREATE POLICY "Allow full access to students" ON public.students
  FOR ALL USING (true);

-- RLS Policies for email follow-ups
CREATE POLICY "Allow full access to email follow-ups" ON public.email_followups
  FOR ALL USING (true);

-- RLS Policies for payment requests
CREATE POLICY "Allow full access to payment requests" ON public.payment_requests
  FOR ALL USING (true);

-- Triggers for updated_at on new tables
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_email_followups_updated_at BEFORE UPDATE ON public.email_followups
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payment_requests_updated_at BEFORE UPDATE ON public.payment_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
