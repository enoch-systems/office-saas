import React from 'react';

interface PaymentReminderEmailProps {
  studentName: string;
  courseName: string;
  amountDue: number;
  dueDate: string;
}

export const PaymentReminderEmail: React.FC<PaymentReminderEmailProps> = ({
  studentName,
  courseName,
  amountDue,
  dueDate
}) => {
  return (
    <div className="email-template">
      <h1>Payment Reminder - {courseName}</h1>
      <p>Dear {studentName},</p>
      <p>This is a friendly reminder that you have an outstanding payment of ${amountDue} for your {courseName} course.</p>
      <p>Payment is due by: {dueDate}</p>
      <p>Please ensure your payment is made on time to avoid any interruption in your access to the course materials.</p>
      <p>Thank you for your prompt attention to this matter.</p>
      <p>Best regards,<br />The Team</p>
    </div>
  );
};

export default PaymentReminderEmail;
