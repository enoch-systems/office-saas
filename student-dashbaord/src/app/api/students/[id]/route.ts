import { NextRequest, NextResponse } from "next/server";
import * as offlineDb from '@/lib/offline-db';

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Student ID is required." },
        { status: 400 },
      );
    }

    const student = await offlineDb.getStudentById(id);
    if (!student) {
      return NextResponse.json(
        { error: "Student not found." },
        { status: 404 },
      );
    }

    const success = await offlineDb.deleteStudent(id);

    if (!success) {
      throw new Error("Failed to delete student");
    }

    return NextResponse.json({
      success: true,
      message: `${student.name} was deleted successfully.`,
    });
  } catch (error) {
    console.error("Error deleting student:", error);

    return NextResponse.json(
      { error: "Failed to delete student." },
      { status: 500 },
    );
  }
}