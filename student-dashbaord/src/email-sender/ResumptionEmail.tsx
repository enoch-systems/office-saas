import React from 'react';

interface ResumptionEmailProps {
  studentName: string;
  courseName: string;
  resumptionDate: string;
  lastProgress: string;
}

export const ResumptionEmail: React.FC<ResumptionEmailProps> = ({
  studentName,
  courseName,
  resumptionDate,
  lastProgress
}) => {
  return (
    <div className="email-template">
      <h1>Welcome Back to {courseName}!</h1>
      <p>Dear {studentName},</p>
      <p>We&apos;re excited to welcome you back to your {courseName} course! Your learning journey continues on {resumptionDate}.</p>
      <p><strong>Your Progress:</strong></p>
      <p>Last completed: {lastProgress}</p>
      <p>You can pick up right where you left off and continue your path to mastery. All your previous progress and materials will be available to you.</p>
      <p>If you have any questions or need assistance getting back into the flow, please don&apos;t hesitate to reach out to our support team.</p>
      <p>We&apos;re thrilled to have you back and look forward to helping you achieve your learning goals!</p>
      <p>Best regards,<br />The Team</p>
    </div>
  );
};

export default ResumptionEmail;
