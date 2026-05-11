-- Update student information in students table
UPDATE students 
SET 
    name = 'Enoch Chukwudi',
    email = 'chuzzyenoch@gmail.com'
WHERE 
    email = 'amahchibu@gmail.com' 
    AND name = 'Olanrewaju john';

-- Also check and update in payment_requests table if needed
UPDATE payment_requests 
SET 
    name = 'Enoch Chukwudi',
    email = 'chuzzyenoch@gmail.com'
WHERE 
    email = 'amahchibu@gmail.com' 
    AND name = 'Olanrewaju john';

-- Also check and update in payment_receipts table if it exists
UPDATE payment_receipts 
SET 
    student_name = 'Enoch Chukwudi',
    email = 'chuzzyenoch@gmail.com'
WHERE 
    email = 'amahchibu@gmail.com' 
    AND student_name = 'Olanrewaju john';
