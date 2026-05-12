// Local Database Service
// This replaces Supabase with a completely offline database
// Uses SQLite when available, falls back to JSON files for Electron builds
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Try to import electron database as fallback
let electronDb: any = null;
try {
  electronDb = require('./electron-database');
} catch (error) {
  // electron-database not available, will use SQLite
}

// Database file path - store in project root
const DB_PATH = path.join(process.cwd(), 'data', 'offline-students.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database connection
let db: Database.Database | null = null;

function getDatabase(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    initializeDatabase();
  }
  return db;
}

function initializeDatabase() {
  const database = getDatabase();
  
  // Create students table
  database.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      public_student_id TEXT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      course TEXT,
      reg_date TEXT,
      reg_time TEXT,
      payment_plan TEXT,
      amount_paid REAL DEFAULT 0,
      balance_remaining REAL DEFAULT 0,
      status TEXT DEFAULT 'None',
      timestamp TEXT,
      gender TEXT,
      state_of_residence TEXT,
      learning_track TEXT,
      how_did_you_hear TEXT,
      has_laptop_and_internet TEXT,
      current_employment_status TEXT,
      wants_scholarship TEXT,
      why_learn_this_skill TEXT,
      last_progress TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create payment_receipts table
  database.exec(`
    CREATE TABLE IF NOT EXISTS payment_receipts (
      id TEXT PRIMARY KEY,
      student_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      amount REAL NOT NULL,
      payment_date TEXT,
      payment_type TEXT,
      status TEXT DEFAULT 'pending',
      image_url TEXT,
      original_filename TEXT,
      submitted_at TEXT,
      reviewed_at TEXT,
      reviewed_by TEXT,
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create email_followups table
  database.exec(`
    CREATE TABLE IF NOT EXISTS email_followups (
      id TEXT PRIMARY KEY,
      student_id TEXT,
      subject TEXT,
      message TEXT,
      sent_at TEXT,
      status TEXT,
      email_provider TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id)
    )
  `);

  // Create viewed_receipts table
  database.exec(`
    CREATE TABLE IF NOT EXISTS viewed_receipts (
      receipt_id TEXT,
      user_id TEXT,
      viewed_at TEXT DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (receipt_id, user_id),
      FOREIGN KEY (receipt_id) REFERENCES payment_receipts(id)
    )
  `);

  console.log('Database initialized successfully');
}

// Student operations
export function getAllStudents(): any[] {
  if (electronDb) {
    return electronDb.getAllStudents();
  }
  const database = getDatabase();
  const stmt = database.prepare('SELECT * FROM students ORDER BY created_at DESC');
  return stmt.all();
}

export function getStudentById(id: string): any | null {
  if (electronDb) {
    return electronDb.getStudentById(id);
  }
  const database = getDatabase();
  const stmt = database.prepare('SELECT * FROM students WHERE id = ?');
  return stmt.get(id) || null;
}

export function createStudent(student: Omit<any, 'id' | 'created_at' | 'updated_at'>): any {
  if (electronDb) {
    return electronDb.createStudent(student);
  }
  const database = getDatabase();
  const id = `student_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  const now = new Date().toISOString();
  
  const stmt = database.prepare(`
    INSERT INTO students (
      id, public_student_id, name, email, phone, course, reg_date, reg_time,
      payment_plan, amount_paid, balance_remaining, status, timestamp, gender,
      state_of_residence, learning_track, how_did_you_hear, has_laptop_and_internet,
      current_employment_status, wants_scholarship, why_learn_this_skill, last_progress,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    id, student.public_student_id, student.name, student.email, student.phone,
    student.course, student.reg_date, student.reg_time, student.payment_plan,
    student.amount_paid, student.balance_remaining, student.status, student.timestamp,
    student.gender, student.state_of_residence, student.learning_track,
    student.how_did_you_hear, student.has_laptop_and_internet,
    student.current_employment_status, student.wants_scholarship, student.why_learn_this_skill,
    student.last_progress, now, now
  );
  
  return getStudentById(id);
}

export function updateStudent(id: string, updates: Partial<any>): boolean {
  if (electronDb) {
    return electronDb.updateStudent(id, updates);
  }
  const database = getDatabase();
  const now = new Date().toISOString();
  
  const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
  const values = Object.values(updates);
  
  const stmt = database.prepare(`
    UPDATE students 
    SET ${fields}, updated_at = ? 
    WHERE id = ?
  `);
  
  const result = stmt.run(...values, now, id);
  return result.changes > 0;
}

export function deleteStudent(id: string): boolean {
  if (electronDb) {
    return electronDb.deleteStudent(id);
  }
  const database = getDatabase();
  const stmt = database.prepare('DELETE FROM students WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}

// Payment receipt operations
export function getAllPaymentReceipts(): any[] {
  if (electronDb) {
    return electronDb.getAllPaymentReceipts();
  }
  const database = getDatabase();
  const stmt = database.prepare('SELECT * FROM payment_receipts ORDER BY created_at DESC');
  return stmt.all();
}

export function getPaymentReceiptById(id: string): any | null {
  if (electronDb) {
    return electronDb.getPaymentReceiptById(id);
  }
  const database = getDatabase();
  const stmt = database.prepare('SELECT * FROM payment_receipts WHERE id = ?');
  return stmt.get(id) || null;
}

export function createPaymentReceipt(receipt: Omit<any, 'id' | 'created_at' | 'updated_at'>): any {
  if (electronDb) {
    return electronDb.createPaymentReceipt(receipt);
  }
  const database = getDatabase();
  const id = `receipt_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  const now = new Date().toISOString();
  
  const stmt = database.prepare(`
    INSERT INTO payment_receipts (
      id, student_name, email, phone, amount, payment_date, payment_type,
      status, image_url, original_filename, submitted_at, reviewed_at,
      reviewed_by, notes, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    id, receipt.student_name, receipt.email, receipt.phone, receipt.amount,
    receipt.payment_date, receipt.payment_type, receipt.status,
    receipt.image_url, receipt.original_filename, receipt.submitted_at,
    receipt.reviewed_at, receipt.reviewed_by, receipt.notes, now, now
  );
  
  return getPaymentReceiptById(id);
}

export function updatePaymentReceipt(id: string, updates: Partial<any>): boolean {
  if (electronDb) {
    return electronDb.updatePaymentReceipt(id, updates);
  }
  const database = getDatabase();
  const now = new Date().toISOString();
  
  const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
  const values = Object.values(updates);
  
  const stmt = database.prepare(`
    UPDATE payment_receipts 
    SET ${fields}, updated_at = ? 
    WHERE id = ?
  `);
  
  const result = stmt.run(...values, now, id);
  return result.changes > 0;
}

// Email followup operations
export function getAllEmailFollowups(): any[] {
  if (electronDb) {
    return electronDb.getAllEmailFollowups();
  }
  const database = getDatabase();
  const stmt = database.prepare('SELECT * FROM email_followups ORDER BY created_at DESC');
  return stmt.all();
}

export function getEmailFollowupsByStudentId(studentId: string): any[] {
  if (electronDb) {
    return electronDb.getEmailFollowupsByStudentId(studentId);
  }
  const database = getDatabase();
  const stmt = database.prepare('SELECT * FROM email_followups WHERE student_id = ? ORDER BY created_at DESC');
  return stmt.all(studentId);
}

export function createEmailFollowup(followup: Omit<any, 'id' | 'created_at' | 'updated_at'>): any {
  if (electronDb) {
    return electronDb.createEmailFollowup(followup);
  }
  const database = getDatabase();
  const id = `followup_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  const now = new Date().toISOString();
  
  const stmt = database.prepare(`
    INSERT INTO email_followups (
      id, student_id, subject, message, sent_at, status, email_provider,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    id, followup.student_id, followup.subject, followup.message,
    followup.sent_at, followup.status, followup.email_provider, now, now
  );
  
  return { ...followup, id, created_at: now, updated_at: now };
}

// Viewed receipts operations
export function getAllViewedReceipts(): any[] {
  if (electronDb) {
    return electronDb.getAllViewedReceipts();
  }
  const database = getDatabase();
  const stmt = database.prepare('SELECT * FROM viewed_receipts ORDER BY viewed_at DESC');
  return stmt.all();
}

export function markReceiptViewed(receiptId: string, userId: string): boolean {
  if (electronDb) {
    return electronDb.markReceiptViewed(receiptId, userId);
  }
  const database = getDatabase();
  const now = new Date().toISOString();
  
  const stmt = database.prepare(`
    INSERT OR REPLACE INTO viewed_receipts (receipt_id, user_id, viewed_at)
    VALUES (?, ?, ?)
  `);
  
  const result = stmt.run(receiptId, userId, now);
  return result.changes > 0;
}

export function getViewedReceiptsByUser(userId: string): string[] {
  if (electronDb) {
    return electronDb.getViewedReceiptsByUser(userId);
  }
  const database = getDatabase();
  const stmt = database.prepare('SELECT receipt_id FROM viewed_receipts WHERE user_id = ?');
  const results = stmt.all(userId);
  return results.map((r: any) => r.receipt_id);
}

// Close database connection
export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
  if (electronDb) {
    electronDb.closeDatabase();
  }
}

// Export database instance for advanced operations
export { getDatabase };
