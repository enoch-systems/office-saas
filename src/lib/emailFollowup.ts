import { Resend } from 'resend';
import * as offlineDb from './offline-db';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailFollowupData {
  studentId: string;
  subject: string;
  message: string;
}

/**
 * Create an email follow-up record
 */
export async function createEmailFollowup(data: EmailFollowupData) {
  const followup = await offlineDb.createEmailFollowup({
    student_id: data.studentId,
    subject: data.subject,
    message: data.message,
    status: 'pending',
    email_provider: 'resend',
    sent_at: '',
  });
  return followup;
}

/**
 * Send an email to a student
 */
export async function sendFollowupEmail(
  studentEmail: string,
  studentName: string,
  subject: string,
  message: string
) {
  try {
    const { data, error } = await resend.emails.send({
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

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

/**
 * Create and send an email follow-up in one operation
 */
export async function createAndSendFollowup(
  student: { id: string; email: string; name: string },
  subject: string,
  message: string
) {
  // Create the follow-up record
  const followup = await createEmailFollowup({
    studentId: student.id,
    subject,
    message,
  });

  // Send the email
  try {
    await sendFollowupEmail(student.email, student.name, subject, message);

    // Update the follow-up status to sent
    await offlineDb.createEmailFollowup({
      student_id: student.id,
      subject,
      message,
      status: 'sent',
      email_provider: 'resend',
      sent_at: new Date().toISOString(),
    });

    return { ...followup, status: 'sent' as const };
  } catch (error) {
    // Mark as failed
    await offlineDb.createEmailFollowup({
      student_id: student.id,
      subject,
      message,
      status: 'failed',
      email_provider: 'resend',
      sent_at: '',
    });
    throw error;
  }
}

/**
 * Get all email follow-ups for a student
 */
export async function getStudentFollowups(studentId: string) {
  const followups = await offlineDb.getEmailFollowupsByStudentId(studentId);
  return followups || [];
}

/**
 * Get all pending follow-ups
 */
export async function getPendingFollowups() {
  const allFollowups = await offlineDb.getAllEmailFollowups();
  const pending = allFollowups.filter(f => f.status === 'pending');
  
  // Attach student info
  const students = await offlineDb.getAllStudents();
  return pending.map(f => {
    const student = students.find(s => s.id === f.student_id);
    return { ...f, students: student || null };
  });
}

/**
 * Get follow-up statistics
 */
export async function getFollowupStats() {
  const allFollowups = await offlineDb.getAllEmailFollowups();

  const sent = allFollowups.filter(f => f.status === 'sent').length;
  const pending = allFollowups.filter(f => f.status === 'pending').length;
  const failed = allFollowups.filter(f => f.status === 'failed').length;

  return {
    sent,
    pending,
    failed,
    total: sent + pending + failed,
  };
}