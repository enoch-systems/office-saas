-- Update student email in Supabase
UPDATE students 
SET 
  email = 'amahchivu@gmail.com',
  name = 'Olanrewaju john',
  course = 'UI/UX Design - Select a plan'
WHERE email = 'chuzzyenoch@gmail.com';

-- Check if the update was successful
SELECT * FROM students WHERE email = 'amahchivu@gmail.com';
