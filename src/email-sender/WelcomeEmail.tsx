import React from 'react';

interface WelcomeEmailProps {
  studentName: string;
  courseName: string;
  startDate: string;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({
  studentName,
  courseName,
  startDate
}) => {
  return (
    <div className="email-template">
      <h1>Welcome to {courseName}!</h1>
      <p>Dear {studentName},</p>
      <p>We are excited to welcome you to our {courseName} program. Your journey begins on {startDate}.</p>
      <p>Get ready for an amazing learning experience!</p>
      <p>Best regards,<br />The Team</p>
    </div>
  );
};

export default WelcomeEmail;
