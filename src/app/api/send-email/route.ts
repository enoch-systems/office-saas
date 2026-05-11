import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { emailTemplates, EmailData, getEmailSubject } from '@/lib/email-templates';
import * as offlineDb from '@/lib/offline-db';

const resend = new Resend(process.env.RESEND_API_KEY);

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
  let followupId: string | null = null;

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

    // Create email followup record in offline DB
    if (studentId) {
      const followup = await offlineDb.createEmailFollowup({
        student_id: studentId,
        subject,
        message: emailHtml,
        status: 'pending',
        email_provider: 'resend',
        sent_at: '',
      });
      followupId = followup.id;
    }

    const { data: emailData, error } = await resend.emails.send({
      from: 'noreply@techtailblazeracademy.site',
      to: [to],
      subject: subject,
      html: emailHtml,
      text: buildPlainTextEmail(subject, data),
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    if (followupId) {
      await offlineDb.createEmailFollowup({
        student_id: studentId || '',
        subject,
        message: emailHtml,
        status: 'sent',
        email_provider: 'resend',
        sent_at: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { success: true, data: emailData, followupId },
      { status: 200 }
    );
  } catch (error) {
    if (followupId) {
      await offlineDb.createEmailFollowup({
        student_id: '',
        subject: '',
        message: '',
        status: 'failed',
        email_provider: 'resend',
        sent_at: '',
      });
    }

    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}