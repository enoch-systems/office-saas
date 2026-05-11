import React from 'react';

interface FullPaymentConfirmationEmailProps {
  studentName: string;
  courseName: string;
  totalAmount: number;
  paymentDate: string;
  completionDate: string;
}

export const FullPaymentConfirmationEmail: React.FC<FullPaymentConfirmationEmailProps> = ({
  studentName,
  courseName,
  totalAmount,
  paymentDate,
  completionDate
}) => {
  return (
    <div className="email-template">
      <h1>Payment Confirmation - {courseName}</h1>
      <p>Dear {studentName},</p>
      <p>Thank you for your full payment! We&apos;re pleased to confirm that we have received your payment of ${totalAmount} for the {courseName} course.</p>
      <p><strong>Payment Details:</strong></p>
      <ul>
        <li>Course: {courseName}</li>
        <li>Total Amount Paid: ${totalAmount}</li>
        <li>Payment Date: {paymentDate}</li>
        <li>Expected Completion: {completionDate}</li>
      </ul>
      <p>Your enrollment is now fully confirmed and you have complete access to all course materials. We wish you success in your learning journey!</p>
      <p>Best regards,<br />The Team</p>
    </div>
  );
};

export default FullPaymentConfirmationEmail;
