-- Run this in Supabase SQL Editor to support the new payment-plan flow.

ALTER TABLE public.students
  DROP CONSTRAINT IF EXISTS students_payment_plan_check;

ALTER TABLE public.students
  ADD CONSTRAINT students_payment_plan_check
  CHECK (
    payment_plan IN (
      'Select a plan',
      'Not Paid Yet',
      'Fully Paid',
      '1st installment',
      '2nd installment'
    )
  );

CREATE OR REPLACE FUNCTION validate_payment_plan(plan TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN plan IN ('Select a plan', 'Not Paid Yet', 'Fully Paid', '1st installment', '2nd installment');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_student_payment_plan(
  p_student_id UUID,
  p_payment_plan TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_amount_paid NUMERIC := 0;
  v_balance_remaining NUMERIC := 0;
BEGIN
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

CREATE OR REPLACE FUNCTION get_payment_plan_stats()
RETURNS TABLE(
  payment_plan TEXT,
  count BIGINT,
  percentage NUMERIC
) AS $$
DECLARE
  total_students BIGINT;
BEGIN
  SELECT COUNT(*) INTO total_students
  FROM public.students
  WHERE payment_plan NOT IN ('Select a plan', 'Not Paid Yet');

  RETURN QUERY
  SELECT
    s.payment_plan,
    COUNT(*) AS count,
    CASE
      WHEN total_students > 0 THEN ROUND((COUNT(*)::NUMERIC / total_students::NUMERIC) * 100, 2)
      ELSE 0
    END AS percentage
  FROM public.students s
  WHERE s.payment_plan NOT IN ('Select a plan', 'Not Paid Yet')
  GROUP BY s.payment_plan
  ORDER BY count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

UPDATE public.students
SET
  amount_paid = CASE
    WHEN payment_plan = 'Fully Paid' THEN 50000
    WHEN payment_plan = '1st installment' THEN 30000
    WHEN payment_plan = '2nd installment' THEN 20000
    ELSE 0
  END,
  balance_remaining = CASE
    WHEN payment_plan = 'Fully Paid' THEN 0
    WHEN payment_plan = '1st installment' THEN 20000
    WHEN payment_plan = '2nd installment' THEN 0
    ELSE 0
  END,
  updated_at = NOW();

-- Optional:
-- If you want old placeholder rows to become the new visible choice, run this too.
-- UPDATE public.students
-- SET payment_plan = 'Not Paid Yet', updated_at = NOW()
-- WHERE payment_plan = 'Select a plan';
