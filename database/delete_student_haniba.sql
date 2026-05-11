-- Delete student record for Haniba
-- Email: haniba@gmail.com
-- Phone: 08036719928
-- Course: Backend Development

DELETE FROM public.students
WHERE email = 'haniba@gmail.com'
  AND phone = '08036719928'
  AND course = 'Backend Development';
