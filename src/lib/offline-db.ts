// Offline Database Client - Uses API routes instead of direct file access
export interface StudentData {
  id: string;
  public_student_id: string | null;
  name: string;
  email: string;
  phone: string;
  course: string;
  reg_date: string;
  reg_time: string | null;
  payment_plan: string;
  amount_paid: number;
  balance_remaining: number;
  status: string;
  timestamp: string;
  gender: string;
  state_of_residence: string;
  learning_track: string;
  how_did_you_hear: string;
  has_laptop_and_internet: string;
  current_employment_status: string;
  wants_scholarship: string;
  why_learn_this_skill: string;
  last_progress: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentReceiptData {
  id: string;
  student_name: string;
  email: string;
  phone?: string;
  amount: number;
  payment_date: string;
  payment_type: string;
  status: 'pending' | 'approved' | 'rejected';
  image_url?: string;
  original_filename?: string;
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface EmailFollowupData {
  id: string;
  student_id: string;
  subject: string;
  message: string;
  sent_at: string;
  status: string;
  email_provider: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentRequestData {
  id: string;
  student_id: string;
  name: string;
  email: string;
  phone: string;
  amount: number;
  payment_date: string;
  image_url: string;
  status: string;
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface ViewedReceiptData {
  receipt_id: string;
  user_id: string;
  viewed_at: string;
}

// API-based database functions
export async function getAllStudents(): Promise<StudentData[]> {
  try {
    const response = await fetch('/api/students');
    if (!response.ok) throw new Error('Failed to fetch students');
    return response.json();
  } catch (error) {
    console.error('Error fetching students:', error);
    return [];
  }
}

export async function getStudentById(id: string): Promise<StudentData | null> {
  try {
    const response = await fetch(`/api/students?id=${id}`);
    if (!response.ok) throw new Error('Failed to fetch student');
    const students = await response.json();
    return students.find((s: StudentData) => s.id === id) || null;
  } catch (error) {
    console.error('Error fetching student:', error);
    return null;
  }
}

export async function createStudent(student: Omit<StudentData, 'id' | 'created_at' | 'updated_at'>): Promise<StudentData> {
  try {
    const response = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student),
    });
    if (!response.ok) throw new Error('Failed to create student');
    return response.json();
  } catch (error) {
    console.error('Error creating student:', error);
    throw error;
  }
}

export async function updateStudent(id: string, updates: Partial<StudentData>): Promise<boolean> {
  try {
    const response = await fetch('/api/students', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    });
    if (!response.ok) throw new Error('Failed to update student');
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error updating student:', error);
    return false;
  }
}

export async function deleteStudent(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/students?id=${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete student');
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error deleting student:', error);
    return false;
  }
}

export async function getAllPaymentReceipts(): Promise<PaymentReceiptData[]> {
  try {
    const response = await fetch('/api/payment-receipts');
    if (!response.ok) throw new Error('Failed to fetch payment receipts');
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching payment receipts:', error);
    return [];
  }
}

export async function getPaymentReceiptById(id: string): Promise<PaymentReceiptData | null> {
  try {
    const receipts = await getAllPaymentReceipts();
    return receipts.find(r => r.id === id) || null;
  } catch (error) {
    console.error('Error fetching payment receipt:', error);
    return null;
  }
}

export async function createPaymentReceipt(receipt: Omit<PaymentReceiptData, 'id' | 'created_at' | 'updated_at'>): Promise<PaymentReceiptData> {
  try {
    const response = await fetch('/api/payment-receipts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(receipt),
    });
    if (!response.ok) throw new Error('Failed to create payment receipt');
    return response.json();
  } catch (error) {
    console.error('Error creating payment receipt:', error);
    throw error;
  }
}

export async function updatePaymentReceipt(id: string, updates: Partial<PaymentReceiptData>): Promise<boolean> {
  try {
    const response = await fetch('/api/payment-receipts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    });
    if (!response.ok) throw new Error('Failed to update payment receipt');
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error updating payment receipt:', error);
    return false;
  }
}

export async function getAllEmailFollowups(): Promise<EmailFollowupData[]> {
  // For now, return empty array - would need API route for email followups
  return [];
}

export async function getEmailFollowupsByStudentId(studentId: string): Promise<EmailFollowupData[]> {
  const followups = await getAllEmailFollowups();
  return followups.filter(f => f.student_id === studentId);
}

export async function createEmailFollowup(followup: Omit<EmailFollowupData, 'id' | 'created_at' | 'updated_at'>): Promise<EmailFollowupData> {
  // For now, return mock data - would need API route for email followups
  const now = new Date().toISOString();
  return {
    ...followup,
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
    created_at: now,
    updated_at: now,
  };
}

export async function getAllPaymentRequests(): Promise<PaymentRequestData[]> {
  // For now, return empty array - would need API route for payment requests
  return [];
}

export async function createPaymentRequest(request: Omit<PaymentRequestData, 'id' | 'created_at' | 'updated_at'>): Promise<PaymentRequestData> {
  // For now, return mock data - would need API route for payment requests
  const now = new Date().toISOString();
  return {
    ...request,
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
    created_at: now,
    updated_at: now,
  };
}

export async function updatePaymentRequest(id: string, updates: Partial<PaymentRequestData>): Promise<boolean> {
  // For now, return true - would need API route for payment requests
  return true;
}

export async function getAllViewedReceipts(): Promise<ViewedReceiptData[]> {
  // For now, return empty array - would need API route for viewed receipts
  return [];
}

export async function markReceiptViewed(receiptId: string, userId: string): Promise<boolean> {
  // For now, return true - would need API route for viewed receipts
  return true;
}

export async function getViewedReceiptsByUser(userId: string): Promise<string[]> {
  const viewed = await getAllViewedReceipts();
  return viewed.filter(v => v.user_id === userId).map(v => v.receipt_id);
}
