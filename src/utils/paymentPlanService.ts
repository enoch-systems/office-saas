import * as offlineDb from '@/lib/offline-db';
import { PaymentPlan } from '@/context/PaymentPlanContext';

export const PAYMENT_PLAN_PLACEHOLDER: PaymentPlan = 'Select a plan';
export const EDITABLE_PAYMENT_PLANS: PaymentPlan[] = ['Not Paid Yet'];
export const LOCKED_PAYMENT_PLANS: PaymentPlan[] = ['Fully Paid', '1st installment', '2nd installment'];
export const PAYMENT_PLAN_OPTIONS: PaymentPlan[] = [
  'Not Paid Yet',
  'Fully Paid',
  '1st installment',
  '2nd installment',
];

export function normalizePaymentPlan(plan?: string | null): PaymentPlan {
  if (plan === 'Not Paid Yet' || plan === 'Fully Paid' || plan === '1st installment' || plan === '2nd installment') {
    return plan;
  }

  return PAYMENT_PLAN_PLACEHOLDER;
}

export function isLockedPaymentPlan(plan: PaymentPlan): boolean {
  return LOCKED_PAYMENT_PLANS.includes(plan);
}

export function getPaymentPlanAmounts(plan: PaymentPlan): { amountPaid: number; balanceRemaining: number } | null {
  switch (plan) {
    case 'Fully Paid':
      return { amountPaid: 50000, balanceRemaining: 0 };
    case '1st installment':
      return { amountPaid: 30000, balanceRemaining: 20000 };
    case '2nd installment':
      return { amountPaid: 20000, balanceRemaining: 0 };
    case 'Not Paid Yet':
    case 'Select a plan':
    default:
      return null;
  }
}

export interface StudentData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  reg_date: string;
  reg_time?: string;
  payment_plan: PaymentPlan;
  amount_paid?: number;
  balance_remaining?: number;
  status?: string;
  timestamp: string;
  gender: string;
  state_of_residence: string;
  learning_track: string;
  how_did_you_hear: string;
  has_laptop_and_internet: string;
  current_employment_status: string;
  wants_scholarship: string;
  why_learn_this_skill: string;
}

export class PaymentPlanService {
  // Save or update student with payment plan
  static async upsertStudentPaymentPlan(studentData: StudentData): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const normalizedPlan = normalizePaymentPlan(studentData.payment_plan);
      const paymentAmounts = getPaymentPlanAmounts(normalizedPlan);

      if (studentData.id) {
        // Update existing student
        const success = await offlineDb.updateStudent(studentData.id, {
          name: studentData.name,
          email: studentData.email,
          phone: studentData.phone,
          course: studentData.course,
          reg_date: studentData.reg_date,
          reg_time: studentData.reg_time || null,
          payment_plan: normalizedPlan,
          amount_paid: paymentAmounts?.amountPaid ?? 0,
          balance_remaining: paymentAmounts?.balanceRemaining ?? 0,
          status: studentData.status || 'None',
          timestamp: studentData.timestamp,
          gender: studentData.gender,
          state_of_residence: studentData.state_of_residence,
          learning_track: studentData.learning_track,
          how_did_you_hear: studentData.how_did_you_hear,
          has_laptop_and_internet: studentData.has_laptop_and_internet,
          current_employment_status: studentData.current_employment_status,
          wants_scholarship: studentData.wants_scholarship,
          why_learn_this_skill: studentData.why_learn_this_skill,
        });

        if (!success) {
          return { success: false, error: 'Failed to update student' };
        }

        return { success: true, data: { id: studentData.id } };
      } else {
        // Create new student
        const newStudent = await offlineDb.createStudent({
          public_student_id: null,
          name: studentData.name,
          email: studentData.email,
          phone: studentData.phone,
          course: studentData.course,
          reg_date: studentData.reg_date,
          reg_time: studentData.reg_time || null,
          payment_plan: normalizedPlan,
          amount_paid: paymentAmounts?.amountPaid ?? 0,
          balance_remaining: paymentAmounts?.balanceRemaining ?? 0,
          status: studentData.status || 'None',
          timestamp: studentData.timestamp,
          gender: studentData.gender,
          state_of_residence: studentData.state_of_residence,
          learning_track: studentData.learning_track,
          how_did_you_hear: studentData.how_did_you_hear,
          has_laptop_and_internet: studentData.has_laptop_and_internet,
          current_employment_status: studentData.current_employment_status,
          wants_scholarship: studentData.wants_scholarship,
          why_learn_this_skill: studentData.why_learn_this_skill,
          last_progress: null,
        });

        return { success: true, data: newStudent };
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }

  // Update only payment plan for existing student
  static async updateStudentPaymentPlan(studentId: string, paymentPlan: PaymentPlan): Promise<{ success: boolean; error?: string }> {
    try {
      const normalizedPlan = normalizePaymentPlan(paymentPlan);
      const paymentAmounts = getPaymentPlanAmounts(normalizedPlan);

      const success = await offlineDb.updateStudent(studentId, {
        payment_plan: normalizedPlan,
        amount_paid: paymentAmounts?.amountPaid ?? 0,
        balance_remaining: paymentAmounts?.balanceRemaining ?? 0,
      });

      if (!success) {
        return { success: false, error: 'Failed to update payment plan' };
      }

      return { success: true };
    } catch (err) {
      console.error('Unexpected error:', err);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }

  // Get payment plan statistics
  static async getPaymentPlanStats(): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const students = await offlineDb.getAllStudents();

      const stats = {
        notPaidYet: students.filter(s => s.payment_plan === 'Not Paid Yet').length,
        fullyPaid: students.filter(s => s.payment_plan === 'Fully Paid').length,
        firstInstallment: students.filter(s => s.payment_plan === '1st installment').length,
        secondInstallment: students.filter(s => s.payment_plan === '2nd installment').length,
      };

      return { success: true, data: stats };
    } catch (err) {
      console.error('Unexpected error:', err);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }

  // Get student by ID
  static async getStudentById(studentId: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const student = await offlineDb.getStudentById(studentId);

      if (!student) {
        return { success: false, error: 'Student not found' };
      }

      return { success: true, data: student };
    } catch (err) {
      console.error('Unexpected error:', err);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }

  // Get all students
  static async getAllStudents(): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const students = await offlineDb.getAllStudents();
      return { success: true, data: students };
    } catch (err) {
      console.error('Unexpected error:', err);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }

  // Delete student
  static async deleteStudent(studentId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const success = await offlineDb.deleteStudent(studentId);

      if (!success) {
        return { success: false, error: 'Failed to delete student' };
      }

      return { success: true };
    } catch (err) {
      console.error('Unexpected error:', err);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }
}