import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, mkdir, existsSync } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);
const mkdirAsync = promisify(mkdir);

const DB_DIR = join(process.cwd(), 'data');
const STUDENTS_FILE = join(DB_DIR, 'students.json');

// Initialize database directory and files
async function initDB() {
  try {
    if (!existsSync(DB_DIR)) {
      await mkdirAsync(DB_DIR, { recursive: true } as any);
    }

    if (!existsSync(STUDENTS_FILE)) {
      await writeFileAsync(STUDENTS_FILE, JSON.stringify([], null, 2) as any);
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Generic read function
async function readData<T>(filePath: string): Promise<T[]> {
  try {
    await initDB();
    const data = await readFileAsync(filePath, 'utf-8');
    return JSON.parse(data as unknown as string) as T[];
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
}

// Generic write function
async function writeData<T>(filePath: string, data: T[]): Promise<boolean> {
  try {
    await initDB();
    await writeFileAsync(filePath, JSON.stringify(data, null, 2) as any);
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

async function getAllStudents(): Promise<StudentData[]> {
  return readData<StudentData>(STUDENTS_FILE);
}

async function getStudentById(id: string): Promise<StudentData | null> {
  const students = await getAllStudents();
  return students.find(s => s.id === id) || null;
}

async function createStudent(student: Omit<StudentData, 'id' | 'created_at' | 'updated_at'>): Promise<StudentData> {
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

async function updateStudent(id: string, updates: Partial<StudentData>): Promise<boolean> {
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

async function deleteStudent(id: string): Promise<boolean> {
  const students = await getAllStudents();
  const filtered = students.filter(s => s.id !== id);
  return writeData(STUDENTS_FILE, filtered);
}

export async function GET() {
  try {
    const students = await getAllStudents();
    return NextResponse.json(students);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const student = await createStudent(body);
    return NextResponse.json(student);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    const success = await updateStudent(id, updates);
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Student ID required' }, { status: 400 });
    }
    const success = await deleteStudent(id);
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 });
  }
}
