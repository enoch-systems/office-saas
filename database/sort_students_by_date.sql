-- SQL Script to Sort Students by Registration Date (Most Recent First)
-- Run this in Supabase SQL Editor

-- 1. Create an index on created_at for faster sorting by registration date
CREATE INDEX IF NOT EXISTS idx_students_created_at_desc 
ON public.students(created_at DESC);

-- 2. Create an index on timestamp for alternative sorting
CREATE INDEX IF NOT EXISTS idx_students_timestamp_desc 
ON public.students(timestamp DESC);

-- 3. Query to fetch students ordered by most recent registration (using created_at)
-- This is the recommended query for your application
SELECT 
  id,
  name,
  email,
  phone,
  course,
  reg_date,
  reg_time,
  payment_plan,
  amount_paid,
  balance_remaining,
  status,
  timestamp,
  gender,
  state_of_residence,
  learning_track,
  how_did_you_hear,
  has_laptop_and_internet,
  current_employment_status,
  wants_scholarship,
  why_learn_this_skill,
  last_progress,
  created_at,
  updated_at
FROM public.students
ORDER BY created_at DESC;

-- 4. Alternative query using timestamp field (if preferred)
SELECT *
FROM public.students
ORDER BY timestamp DESC;

-- 5. If you want to update existing records to have proper timestamps based on reg_date
-- Uncomment and run this if your timestamp field needs to be synchronized with reg_date
/*
UPDATE public.students
SET timestamp = 
  CASE 
    WHEN reg_date LIKE '%/%' THEN
      -- Convert DD/MM/YYYY to ISO format
      (regexp_matches(reg_date, '(\d{2})/(\d{2})/(\d{4})'))[3] || '-' ||
      (regexp_matches(reg_date, '(\d{2})/(\d{2})/(\d{4})'))[2] || '-' ||
      (regexp_matches(reg_date, '(\d{2})/(\d{2})/(\d{4})'))[1] ||
      CASE WHEN reg_time IS NOT NULL THEN ' ' || reg_time ELSE '' END
    ELSE reg_date
  END
WHERE timestamp IS NULL OR timestamp = '';
*/
