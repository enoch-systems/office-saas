export type { Student } from '@/lib/studentService';
export { fetchStudents, searchStudents, getStudentById, updateStudentPaymentPlan } from '@/lib/studentService';

// Re-export for backward compatibility
// Data is now fetched from Supabase via fetchStudents()
