import { NextRequest, NextResponse } from "next/server";
import * as offlineDb from '@/lib/offline-db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "20");
    const query = (searchParams.get("query") || "").trim().toLowerCase();

    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeLimit =
      Number.isFinite(limit) && limit > 0 && limit <= 100 ? limit : 20;
    const offset = (safePage - 1) * safeLimit;
    const rangeEnd = offset + safeLimit - 1;

    const allFollowups = await offlineDb.getAllEmailFollowups();
    const students = await offlineDb.getAllStudents();

    // Filter sent emails only
    let filtered = allFollowups.filter(f => f.status === 'sent');

    // Apply search filter
    if (query) {
      filtered = filtered.filter(f => {
        const student = students.find(s => s.id === f.student_id);
        const studentName = student?.name?.toLowerCase() || '';
        const studentEmail = student?.email?.toLowerCase() || '';
        return (
          f.subject.toLowerCase().includes(query) ||
          studentName.includes(query) ||
          studentEmail.includes(query)
        );
      });
    }

    // Sort by sent_at or created_at descending
    filtered.sort((a, b) => {
      const dateA = a.sent_at || a.created_at;
      const dateB = b.sent_at || b.created_at;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

    const total = filtered.length;
    const paginatedData = filtered.slice(offset, offset + safeLimit);

    const rows = paginatedData.map((item) => {
      const student = students.find(s => s.id === item.student_id);
      const studentName = student?.name || "Unknown student";
      const studentEmail = student?.email || "";
      const courseName = student?.course || "";
      const subject = item.subject || "";
      const emailType = subject.toLowerCase().includes("payment")
        ? "payment_confirmation"
        : subject.toLowerCase().includes("group")
          ? "group_redirection"
          : "welcome";

      return {
        id: item.id,
        studentId: item.student_id,
        studentName,
        studentEmail,
        courseName,
        emailType,
        subject,
        html: item.message || "",
        sentAt: item.sent_at || item.created_at,
      };
    });

    return NextResponse.json({
      success: true,
      data: rows,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total: total,
        totalPages: Math.max(1, Math.ceil(total / safeLimit)),
      },
    });
  } catch (error) {
    console.error("Error fetching email history:", error);
    return NextResponse.json(
      { error: "Failed to fetch email history." },
      { status: 500 },
    );
  }
}