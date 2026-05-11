-- Payment Plan Operations for Supabase
-- This script provides functions to handle payment plan insertion and updates

-- Function to validate payment plan values
CREATE OR REPLACE FUNCTION validate_payment_plan(plan TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN plan IN ('Select a plan', 'Not Paid Yet', 'Fully Paid', '1st installment', '2nd installment');
END;
$$ LANGUAGE plpgsql;

-- Function to insert or update student payment plan
CREATE OR REPLACE FUNCTION upsert_student_payment_plan(
  p_student_id UUID,
  p_name TEXT,
  p_email TEXT,
  p_phone TEXT,
  p_course TEXT,
  p_reg_date TEXT,
  p_payment_plan TEXT,
  p_timestamp TEXT,
  p_gender TEXT,
  p_state_of_residence TEXT,
  p_learning_track TEXT,
  p_how_did_you_hear TEXT,
  p_has_laptop_and_internet TEXT,
  p_current_employment_status TEXT,
  p_wants_scholarship TEXT,
  p_why_learn_this_skill TEXT,
  p_reg_time TEXT DEFAULT NULL,
  p_amount_paid NUMERIC DEFAULT 0,
  p_balance_remaining NUMERIC DEFAULT 0,
  p_status TEXT DEFAULT 'None'
)
RETURNS UUID AS $$
DECLARE
  student_id UUID;
  existing_student RECORD;
BEGIN
  -- Validate payment plan
  IF NOT validate_payment_plan(p_payment_plan) THEN
    RAISE EXCEPTION 'Invalid payment plan: %', p_payment_plan;
  END IF;

  -- Check if student already exists by email
  SELECT * INTO existing_student 
  FROM public.students 
  WHERE email = p_email;

  IF existing_student IS NOT NULL THEN
    -- Update existing student
    UPDATE public.students SET
      name = p_name,
      phone = p_phone,
      course = p_course,
      reg_date = p_reg_date,
      reg_time = p_reg_time,
      payment_plan = p_payment_plan,
      amount_paid = p_amount_paid,
      balance_remaining = p_balance_remaining,
      status = p_status,
      timestamp = p_timestamp,
      gender = p_gender,
      state_of_residence = p_state_of_residence,
      learning_track = p_learning_track,
      how_did_you_hear = p_how_did_you_hear,
      has_laptop_and_internet = p_has_laptop_and_internet,
      current_employment_status = p_current_employment_status,
      wants_scholarship = p_wants_scholarship,
      why_learn_this_skill = p_why_learn_this_skill,
      updated_at = NOW()
    WHERE id = existing_student.id;
    
    student_id := existing_student.id;
  ELSE
    -- Insert new student
    INSERT INTO public.students (
      name, email, phone, course, reg_date, reg_time, payment_plan,
      amount_paid, balance_remaining, status, timestamp, gender,
      state_of_residence, learning_track, how_did_you_hear,
      has_laptop_and_internet, current_employment_status,
      wants_scholarship, why_learn_this_skill
    ) VALUES (
      p_name, p_email, p_phone, p_course, p_reg_date, p_reg_time, p_payment_plan,
      p_amount_paid, p_balance_remaining, p_status, p_timestamp, p_gender,
      p_state_of_residence, p_learning_track, p_how_did_you_hear,
      p_has_laptop_and_internet, p_current_employment_status,
      p_wants_scholarship, p_why_learn_this_skill
    ) RETURNING id INTO student_id;
  END IF;

  RETURN student_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update only payment plan for a student
CREATE OR REPLACE FUNCTION update_student_payment_plan(
  p_student_id UUID,
  p_payment_plan TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_amount_paid NUMERIC := 0;
  v_balance_remaining NUMERIC := 0;
BEGIN
  -- Validate payment plan
  IF NOT validate_payment_plan(p_payment_plan) THEN
    RAISE EXCEPTION 'Invalid payment plan: %', p_payment_plan;
  END IF;

  IF p_payment_plan = 'Fully Paid' THEN
    v_amount_paid := 50000;
    v_balance_remaining := 0;
  ELSIF p_payment_plan = '1st installment' THEN
    v_amount_paid := 30000;
    v_balance_remaining := 20000;
  ELSIF p_payment_plan = '2nd installment' THEN
    v_amount_paid := 20000;
    v_balance_remaining := 0;
  END IF;

  -- Update payment plan
  UPDATE public.students 
  SET 
    payment_plan = p_payment_plan,
    amount_paid = v_amount_paid,
    balance_remaining = v_balance_remaining,
    updated_at = NOW()
  WHERE id = p_student_id;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get payment plan statistics
CREATE OR REPLACE FUNCTION get_payment_plan_stats()
RETURNS TABLE(
  payment_plan TEXT,
  count BIGINT,
  percentage NUMERIC
) AS $$
DECLARE
  total_students BIGINT;
BEGIN
  -- Get total number of students with an actual saved payment plan
  SELECT COUNT(*) INTO total_students
  FROM public.students 
  WHERE payment_plan NOT IN ('Select a plan', 'Not Paid Yet');

  -- Return statistics
  RETURN QUERY
  SELECT 
    s.payment_plan,
    COUNT(*) as count,
    CASE 
      WHEN total_students > 0 THEN 
        ROUND((COUNT(*)::NUMERIC / total_students::NUMERIC) * 100, 2)
      ELSE 0 
    END as percentage
  FROM public.students s
  WHERE s.payment_plan NOT IN ('Select a plan', 'Not Paid Yet')
  GROUP BY s.payment_plan
  ORDER BY count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_payment_plan ON public.students(payment_plan);

-- Grant necessary permissions (adjust as needed)
-- GRANT EXECUTE ON FUNCTION validate_payment_plan TO authenticated;
-- GRANT EXECUTE ON FUNCTION upsert_student_payment_plan TO authenticated;
-- GRANT EXECUTE ON FUNCTION update_student_payment_plan TO authenticated;
-- GRANT EXECUTE ON FUNCTION get_payment_plan_stats TO authenticated;
