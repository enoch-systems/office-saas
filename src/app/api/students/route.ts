import { NextRequest, NextResponse } from 'next/server';
import {
  getAllStudents,
  getStudentById,
  createStudent as createStudentDB,
  updateStudent as updateStudentDB,
  deleteStudent as deleteStudentDB
} from '@/lib/local-database';

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

// All database operations are now handled by the local-database module

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
    const student = await createStudentDB(body);
    return NextResponse.json(student);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    const success = await updateStudentDB(id, updates);
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
    const success = await deleteStudentDB(id);
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 });
  }
}
