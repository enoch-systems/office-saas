-- Supabase Database Schema for Students, Email Follow-ups, and Payment Requests
-- This script creates only the NEW tables (students, email_followups, payment_requests)
-- Run this after the base schema.sql has been executed

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
