import { supabase } from './supabase';
import type { Student as SupabaseStudent } from '@/types/database';
import { getPublicStudentId } from './studentId';

export interface Student {
  id: number;
  publicStudentId: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  regDate: string;
  regTime?: string;
  paymentPlan: string;
  amountPaid: number;
  balanceRemaining: number;
  status: "None" | "Awaiting" | "Confirmed";
  timestamp: string;
  gender: string;
  stateOfResidence: string;
  learningTrack: string;
  howDidYouHear: string;
  hasLaptopAndInternet: string;
  currentEmploymentStatus: string;
  wantsScholarship: string;
  whyLearnThisSkill: string;
  lastProgress?: string;
  originalId: string;
}

function mapSupabaseStudent(student: SupabaseStudent, index: number): Student {
  return {
    id: index + 1,
    publicStudentId: getPublicStudentId(student.name, student.id, student.public_student_id),
    name: student.name,
    email: student.email,
    phone: student.phone,
    course: student.course,
    regDate: student.reg_date,
    regTime: student.reg_time || undefined,
    paymentPlan: student.payment_plan,
    amountPaid: student.amount_paid,
    balanceRemaining: student.balance_remaining,
    status: student.status as "None" | "Awaiting" | "Confirmed",
    timestamp: student.timestamp,
    gender: student.gender,
    stateOfResidence: student.state_of_residence,
    learningTrack: student.learning_track,
    howDidYouHear: student.how_did_you_hear,
    hasLaptopAndInternet: student.has_laptop_and_internet,
    currentEmploymentStatus: student.current_employment_status,
    wantsScholarship: student.wants_scholarship,
    whyLearnThisSkill: student.why_learn_this_skill,
    lastProgress: student.last_progress || undefined,
    originalId: student.id,
  };
}

export async function fetchStudents(): Promise<Student[]> {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching students:', error);
      const errorMsg = (error as any)?.message || String(error);
      throw new Error(`Failed to fetch students: ${errorMsg}`);
    }

    if (!data) {
      return [];
    }

    return data.map(mapSupabaseStudent);
  } catch (error) {
    console.error('Error fetching students:', error);
    throw new Error(`Failed to fetch students: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function searchStudents(searchTerm: string): Promise<Student[]> {
  try {
    const result = await supabase
      .from('students')
      .select('*')
      .order('name', { ascending: true })
      .then((res: any) => res);

    if (!result.data) {
      return [];
    }

    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    return result.data
      .map(mapSupabaseStudent)
      .filter((student: Student) => {
        return (
          student.name.toLowerCase().includes(normalizedSearchTerm) ||
          student.email.toLowerCase().includes(normalizedSearchTerm) ||
          student.course.toLowerCase().includes(normalizedSearchTerm) ||
          student.publicStudentId.toLowerCase().includes(normalizedSearchTerm)
        );
      });
  } catch (error) {
    console.error('Error searching students:', error);
    throw new Error(`Failed to search students: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getStudentById(id: string): Promise<Student | null> {
  try {
    const result = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single();

    if (result.error) {
      // Handle different error scenarios
      if (result.error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      
      // Create a more descriptive error message
      const errorMessage = result.error.message || 'Database query failed';
      const errorCode = result.error.code || 'UNKNOWN';
      
      console.error('Error fetching student:', {
        code: errorCode,
        message: errorMessage
      });
      
      throw new Error(`Failed to fetch student (${errorCode}): ${errorMessage}`);
    }

    if (!result.data) {
      return null;
    }

    return mapSupabaseStudent(result.data, 0);
  } catch (err) {
    console.error('Unexpected error in getStudentById:', err);
    
    // Handle different error types
    if (err instanceof Error) {
      throw new Error(`Failed to fetch student: ${err.message}`);
    } else if (typeof err === 'object' && err !== null) {
      // Handle object errors that might not be Error instances
      const errorObj = err as Record<string, unknown>;
      const message =
        (typeof errorObj.message === "string" && errorObj.message) ||
        (typeof errorObj.error === "string" && errorObj.error) ||
        JSON.stringify(err);
      throw new Error(`Failed to fetch student: ${message}`);
    } else {
      throw new Error('Failed to fetch student: Unknown error occurred');
    }
  }
}

export async function updateStudentPaymentPlan(
  id: string,
  paymentPlan: string,
  amountPaid: number,
  balanceRemaining: number
): Promise<void> {
  try {
    const result = await (supabase as any)
      .from('students')
      .update({
        payment_plan: paymentPlan,
        amount_paid: amountPaid,
        balance_remaining: balanceRemaining,
      })
      .eq('id', id)
      .then((res: any) => res);

    if (result.error) {
      console.error('Error updating student payment plan:', result.error);
      throw new Error(`Failed to update payment plan: ${result.error.message}`);
    }
  } catch (error) {
    console.error('Error updating student payment plan:', error);
    throw new Error(`Failed to update payment plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
