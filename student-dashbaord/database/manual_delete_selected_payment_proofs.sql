-- One-time manual cleanup for specific test payment proofs.
-- This does NOT add any delete functionality to the app.

BEGIN;

DELETE FROM public.payment_receipts
WHERE
  (
    student_name = 'Enoch Chuzzy'
    AND lower(email) = lower('chuzza@gmail.com')
    AND amount = 3
  )
  OR
  (
    student_name = 'Dan Phil'
    AND lower(email) = lower('chuzzy@gmail.com')
  );

COMMIT;
