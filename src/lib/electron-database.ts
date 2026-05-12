// Electron Database Service - Fallback for Electron builds without native dependencies
// This uses JSON file storage as fallback when better-sqlite3 is not available

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'data');
const STUDENTS_FILE = join(DATA_DIR, 'students.json');
const PAYMENT_RECEIPTS_FILE = join(DATA_DIR, 'payment-receipts.json');
const EMAIL_FOLLOWUPS_FILE = join(DATA_DIR, 'email-followups.json');
const VIEWED_RECEIPTS_FILE = join(DATA_DIR, 'viewed-receipts.json');

// Ensure data directory exists
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize JSON files if they don't exist
function initializeFile(filePath: string, defaultContent: any[] = []) {
  if (!existsSync(filePath)) {
    writeFileSync(filePath, JSON.stringify(defaultContent, null, 2));
  }
}

initializeFile(STUDENTS_FILE);
initializeFile(PAYMENT_RECEIPTS_FILE);
initializeFile(EMAIL_FOLLOWUPS_FILE);
initializeFile(VIEWED_RECEIPTS_FILE);

function readJsonFile(filePath: string): any[] {
  try {
    const data = readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
}

function writeJsonFile(filePath: string, data: any[]): boolean {
  try {
    writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
}

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

// Student operations
export function getAllStudents(): any[] {
  return readJsonFile(STUDENTS_FILE);
}

export function getStudentById(id: string): any | null {
  const students = getAllStudents();
  return students.find(s => s.id === id) || null;
}

export function createStudent(student: Omit<any, 'id' | 'created_at' | 'updated_at'>): any {
  const students = getAllStudents();
  const now = new Date().toISOString();
  const newStudent = {
    ...student,
    id: generateId(),
    created_at: now,
    updated_at: now,
  };
  students.push(newStudent);
  writeJsonFile(STUDENTS_FILE, students);
  return newStudent;
}

export function updateStudent(id: string, updates: Partial<any>): boolean {
  const students = getAllStudents();
  const index = students.findIndex(s => s.id === id);
  if (index === -1) return false;

  students[index] = {
    ...students[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  return writeJsonFile(STUDENTS_FILE, students);
}

export function deleteStudent(id: string): boolean {
  const students = getAllStudents();
  const filtered = students.filter(s => s.id !== id);
  return writeJsonFile(STUDENTS_FILE, filtered);
}

// Payment receipt operations
export function getAllPaymentReceipts(): any[] {
  return readJsonFile(PAYMENT_RECEIPTS_FILE);
}

export function getPaymentReceiptById(id: string): any | null {
  const receipts = getAllPaymentReceipts();
  return receipts.find(r => r.id === id) || null;
}

export function createPaymentReceipt(receipt: Omit<any, 'id' | 'created_at' | 'updated_at'>): any {
  const receipts = getAllPaymentReceipts();
  const now = new Date().toISOString();
  const newReceipt = {
    ...receipt,
    id: generateId(),
    created_at: now,
    updated_at: now,
  };
  receipts.push(newReceipt);
  writeJsonFile(PAYMENT_RECEIPTS_FILE, receipts);
  return newReceipt;
}

export function updatePaymentReceipt(id: string, updates: Partial<any>): boolean {
  const receipts = getAllPaymentReceipts();
  const index = receipts.findIndex(r => r.id === id);
  if (index === -1) return false;

  receipts[index] = {
    ...receipts[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  return writeJsonFile(PAYMENT_RECEIPTS_FILE, receipts);
}

// Email followup operations
export function getAllEmailFollowups(): any[] {
  return readJsonFile(EMAIL_FOLLOWUPS_FILE);
}

export function getEmailFollowupsByStudentId(studentId: string): any[] {
  const followups = getAllEmailFollowups();
  return followups.filter(f => f.student_id === studentId);
}

export function createEmailFollowup(followup: Omit<any, 'id' | 'created_at' | 'updated_at'>): any {
  const followups = getAllEmailFollowups();
  const now = new Date().toISOString();
  const newFollowup = {
    ...followup,
    id: generateId(),
    created_at: now,
    updated_at: now,
  };
  followups.push(newFollowup);
  writeJsonFile(EMAIL_FOLLOWUPS_FILE, followups);
  return newFollowup;
}

// Viewed receipts operations
export function getAllViewedReceipts(): any[] {
  return readJsonFile(VIEWED_RECEIPTS_FILE);
}

export function markReceiptViewed(receiptId: string, userId: string): boolean {
  const viewed = getAllViewedReceipts();
  const now = new Date().toISOString();
  
  // Check if already viewed
  const existing = viewed.find(v => v.receipt_id === receiptId && v.user_id === userId);
  if (existing) return true;
  
  viewed.push({
    receipt_id: receiptId,
    user_id: userId,
    viewed_at: now,
  });
  
  return writeJsonFile(VIEWED_RECEIPTS_FILE, viewed);
}

export function getViewedReceiptsByUser(userId: string): string[] {
  const viewed = getAllViewedReceipts();
  return viewed.filter(v => v.user_id === userId).map(v => v.receipt_id);
}

export function closeDatabase() {
  // No cleanup needed for JSON files
}
