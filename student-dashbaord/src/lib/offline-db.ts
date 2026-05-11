// Offline Database Implementation using JSON files
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

const DB_DIR = join(process.cwd(), 'data');
const STUDENTS_FILE = join(DB_DIR, 'students.json');
const PAYMENT_RECEIPTS_FILE = join(DB_DIR, 'payment-receipts.json');
const EMAIL_FOLLOWUPS_FILE = join(DB_DIR, 'email-followups.json');
const PAYMENT_REQUESTS_FILE = join(DB_DIR, 'payment-requests.json');
const VIEWED_RECEIPTS_FILE = join(DB_DIR, 'viewed-receipts.json');

// Initialize database directory and files
async function initDB() {
  try {
    if (!existsSync(DB_DIR)) {
      await mkdir(DB_DIR, { recursive: true });
    }

    const files = [
      { path: STUDENTS_FILE, data: [] },
      { path: PAYMENT_RECEIPTS_FILE, data: [] },
      { path: EMAIL_FOLLOWUPS_FILE, data: [] },
      { path: PAYMENT_REQUESTS_FILE, data: [] },
      { path: VIEWED_RECEIPTS_FILE, data: [] },
    ];

    for (const file of files) {
      if (!existsSync(file.path)) {
        await writeFile(file.path, JSON.stringify(file.data, null, 2));
      }
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Generic read function
async function readData<T>(filePath: string): Promise<T[]> {
  try {
    await initDB();
    const data = await readFile(filePath, 'utf-8');
    return JSON.parse(data) as T[];
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
}

// Generic write function
async function writeData<T>(filePath: string, data: T[]): Promise<boolean> {
  try {
    await initDB();
    await writeFile(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
}

// Generate UUID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

// Students operations
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

export async function getAllStudents(): Promise<StudentData[]> {
  return readData<StudentData>(STUDENTS_FILE);
}

export async function getStudentById(id: string): Promise<StudentData | null> {
  const students = await getAllStudents();
  return students.find(s => s.id === id) || null;
}

export async function createStudent(student: Omit<StudentData, 'id' | 'created_at' | 'updated_at'>): Promise<StudentData> {
  const students = await getAllStudents();
  const now = new Date().toISOString();
  const newStudent: StudentData = {
    ...student,
    id: generateId(),
    created_at: now,
    updated_at: now,
  };
  students.push(newStudent);
  await writeData(STUDENTS_FILE, students);
  return newStudent;
}

export async function updateStudent(id: string, updates: Partial<StudentData>): Promise<boolean> {
  const students = await getAllStudents();
  const index = students.findIndex(s => s.id === id);
  if (index === -1) return false;

  students[index] = {
    ...students[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  return writeData(STUDENTS_FILE, students);
}

export async function deleteStudent(id: string): Promise<boolean> {
  const students = await getAllStudents();
  const filtered = students.filter(s => s.id !== id);
  return writeData(STUDENTS_FILE, filtered);
}

// Payment Receipts operations
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

export async function getAllPaymentReceipts(): Promise<PaymentReceiptData[]> {
  return readData<PaymentReceiptData>(PAYMENT_RECEIPTS_FILE);
}

export async function getPaymentReceiptById(id: string): Promise<PaymentReceiptData | null> {
  const receipts = await getAllPaymentReceipts();
  return receipts.find(r => r.id === id) || null;
}

export async function createPaymentReceipt(receipt: Omit<PaymentReceiptData, 'id' | 'created_at' | 'updated_at'>): Promise<PaymentReceiptData> {
  const receipts = await getAllPaymentReceipts();
  const now = new Date().toISOString();
  const newReceipt: PaymentReceiptData = {
    ...receipt,
    id: generateId(),
    created_at: now,
    updated_at: now,
  };
  receipts.push(newReceipt);
  await writeData(PAYMENT_RECEIPTS_FILE, receipts);
  return newReceipt;
}

export async function updatePaymentReceipt(id: string, updates: Partial<PaymentReceiptData>): Promise<boolean> {
  const receipts = await getAllPaymentReceipts();
  const index = receipts.findIndex(r => r.id === id);
  if (index === -1) return false;

  receipts[index] = {
    ...receipts[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  return writeData(PAYMENT_RECEIPTS_FILE, receipts);
}

// Email Followups operations
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

export async function getAllEmailFollowups(): Promise<EmailFollowupData[]> {
  return readData<EmailFollowupData>(EMAIL_FOLLOWUPS_FILE);
}

export async function getEmailFollowupsByStudentId(studentId: string): Promise<EmailFollowupData[]> {
  const followups = await getAllEmailFollowups();
  return followups.filter(f => f.student_id === studentId);
}

export async function createEmailFollowup(followup: Omit<EmailFollowupData, 'id' | 'created_at' | 'updated_at'>): Promise<EmailFollowupData> {
  const followups = await getAllEmailFollowups();
  const now = new Date().toISOString();
  const newFollowup: EmailFollowupData = {
    ...followup,
    id: generateId(),
    created_at: now,
    updated_at: now,
  };
  followups.push(newFollowup);
  await writeData(EMAIL_FOLLOWUPS_FILE, followups);
  return newFollowup;
}

// Payment Requests operations
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

export async function getAllPaymentRequests(): Promise<PaymentRequestData[]> {
  return readData<PaymentRequestData>(PAYMENT_REQUESTS_FILE);
}

export async function createPaymentRequest(request: Omit<PaymentRequestData, 'id' | 'created_at' | 'updated_at'>): Promise<PaymentRequestData> {
  const requests = await getAllPaymentRequests();
  const now = new Date().toISOString();
  const newRequest: PaymentRequestData = {
    ...request,
    id: generateId(),
    created_at: now,
    updated_at: now,
  };
  requests.push(newRequest);
  await writeData(PAYMENT_REQUESTS_FILE, requests);
  return newRequest;
}

export async function updatePaymentRequest(id: string, updates: Partial<PaymentRequestData>): Promise<boolean> {
  const requests = await getAllPaymentRequests();
  const index = requests.findIndex(r => r.id === id);
  if (index === -1) return false;

  requests[index] = {
    ...requests[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  return writeData(PAYMENT_REQUESTS_FILE, requests);
}

// Viewed Receipts operations
export interface ViewedReceiptData {
  receipt_id: string;
  user_id: string;
  viewed_at: string;
}

export async function getAllViewedReceipts(): Promise<ViewedReceiptData[]> {
  return readData<ViewedReceiptData>(VIEWED_RECEIPTS_FILE);
}

export async function markReceiptViewed(receiptId: string, userId: string): Promise<boolean> {
  const viewedReceipts = await getAllViewedReceipts();
  const exists = viewedReceipts.some(v => v.receipt_id === receiptId && v.user_id === userId);
  if (exists) return true;

  viewedReceipts.push({
    receipt_id: receiptId,
    user_id: userId,
    viewed_at: new Date().toISOString(),
  });
  return writeData(VIEWED_RECEIPTS_FILE, viewedReceipts);
}

export async function getViewedReceiptsByUser(userId: string): Promise<string[]> {
  const viewedReceipts = await getAllViewedReceipts();
  return viewedReceipts
    .filter(v => v.user_id === userId)
    .map(v => v.receipt_id);
}
