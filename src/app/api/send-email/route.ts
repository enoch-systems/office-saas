import { NextRequest, NextResponse } from 'next/server';
import { emailTemplates, EmailData, getEmailSubject } from '@/lib/email-templates';
import {
  createEmailFollowup as createEmailFollowupDB,
  getAllEmailFollowups
} from '@/lib/local-database';

// Offline Email Service - creates email records and provides export functionality
class OfflineEmailService {
  static async sendEmail(data: {
    to: string;
    subject: string;
    html: string;
    text: string;
    studentId?: string;
  }) {
    console.log('Offline mode: Email created for:', data.to);
    
    // Create email followup record in local database
    if (data.studentId) {
      await createEmailFollowupDB({
        student_id: data.studentId,
        subject: data.subject,
        message: data.html,
        status: 'ready_to_send',
        email_provider: 'offline',
        sent_at: new Date().toISOString(),
      });
    }

    return { 
      data: { 
        id: `offline-${Date.now()}`,
        message: 'Email saved locally. Ready for export.'
      }, 
      error: null 
    };
  }

  static async getEmailHistory(studentId?: string) {
    const followups = await getAllEmailFollowups();
    if (studentId) {
      return followups.filter(f => f.student_id === studentId);
    }
    return followups;
  }

  static generateMailtoLink(email: string, subject: string, body: string) {
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
}

function generateEmailHtml(emailType: string, data: EmailData): string {
  switch (emailType) {
    case 'welcome':
      return emailTemplates.welcome(data);
    case 'payment_confirmation':
      return emailTemplates.payment_confirmation(data);
    case 'group_redirection':
      return emailTemplates.group_redirection(data);
    default:
      return '';
  }
}

function buildPlainTextEmail(subject: string, data: EmailData): string {
  const studentName = data?.studentName || "Student";
  const courseName = String(data?.courseName || "your selected course");
  const lines = [
    subject,
    "",
    `Hello ${studentName},`,
    "",
    `This is an update from Tech Trailblazer Academy regarding ${courseName}.`,
    "Please view this message in an HTML-capable email client for the full formatted version.",
    "",
    "Warm regards,",
    "Programs Team, Tech Trailblazer Academy",
  ];

  return lines.join("\n");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, emailType, data, studentId } = body;

    if (!to || !emailType) {
      return NextResponse.json(
        { error: 'Missing required fields: to and emailType' },
        { status: 400 }
      );
    }

    const subject = getEmailSubject(emailType, data);

    if (!subject) {
      return NextResponse.json(
        { error: 'Invalid email type' },
        { status: 400 }
      );
    }

    const emailHtml = generateEmailHtml(emailType, data);
    const plainText = buildPlainTextEmail(subject, data);

    // Send email using offline service
    const { data: emailData, error } = await OfflineEmailService.sendEmail({
      to,
      subject,
      html: emailHtml,
      text: plainText,
      studentId,
    });

    if (error) {
      console.error('Email service error:', error);
      return NextResponse.json(
        { error: 'Failed to create email' },
        { status: 400 }
      );
    }

    // Generate mailto link for manual sending
    const mailtoLink = OfflineEmailService.generateMailtoLink(to, subject, plainText);

    return NextResponse.json(
      { 
        success: true, 
        data: emailData, 
        mailtoLink,
        message: 'Email saved locally. Use mailto link to send manually.'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create email' },
      { status: 500 }
    );
  }
}
