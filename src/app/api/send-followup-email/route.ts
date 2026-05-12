import { NextRequest, NextResponse } from 'next/server';
import * as offlineDb from '@/lib/offline-db';

// Mock Resend for offline mode
const resend = {
  emails: {
    send: async (data: any) => {
      console.log('Offline mode: Followup email would be sent:', data);
      return { 
        data: { id: `offline-${Date.now()}` }, 
        error: null 
      };
    }
  }
};

export async function POST(request: NextRequest) {
  try {
    const { studentId, studentName, studentEmail, subject, message } = await request.json();

    if (!studentId || !studentName || !studentEmail || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send the email
    try {
      const { data: emailData, error: emailError } = await resend.emails.send({
        from: 'Tech Trailblazer Academy <onboarding@resend.dev>',
        to: studentEmail,
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Hello ${studentName},</h2>
            <p style="color: #666; line-height: 1.6;">${message}</p>
            <p style="color: #666; margin-top: 20px;">Best regards,<br>Tech Trailblazer Academy Team</p>
          </div>
        `,
      });

      if (emailError) {
        throw emailError;
      }

      // Create email followup record
      const followup = await offlineDb.createEmailFollowup({
        student_id: studentId,
        subject,
        message,
        status: 'sent',
        email_provider: 'resend',
        sent_at: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        followupId: followup.id,
        emailId: emailData?.id
      });

    } catch (emailError) {
      console.error('Error sending email:', emailError);

      await offlineDb.createEmailFollowup({
        student_id: studentId,
        subject,
        message,
        status: 'failed',
        email_provider: 'resend',
        sent_at: '',
      });

      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error in send-followup-email API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}