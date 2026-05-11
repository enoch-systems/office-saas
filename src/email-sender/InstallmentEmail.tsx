import React from 'react';

interface InstallmentEmailProps {
  studentName: string;
  courseName: string;
  installmentAmount: number;
  installmentNumber: number;
  totalInstallments: number;
  dueDate: string;
}

export const InstallmentEmail: React.FC<InstallmentEmailProps> = ({
  studentName,
  courseName,
  installmentAmount,
  installmentNumber,
  totalInstallments,
  dueDate
}) => {
  return (
    <div className="email-template">
      <h1>Installment Payment - {courseName}</h1>
      <p>Dear {studentName},</p>
      <p>This is a reminder for your installment payment for the {courseName} course.</p>
      <p><strong>Installment Details:</strong></p>
      <ul>
        <li>Installment Number: {installmentNumber} of {totalInstallments}</li>
        <li>Amount Due: ${installmentAmount}</li>
        <li>Due Date: {dueDate}</li>
      </ul>
      <p>Please make your payment on time to continue enjoying uninterrupted access to your course.</p>
      <p>Thank you for your continued enrollment!</p>
      <p>Best regards,<br />The Team</p>
    </div>
  );
};

export default InstallmentEmail;
