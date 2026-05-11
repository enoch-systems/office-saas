"use client";
import React, { useState } from "react";

interface ConfirmEmailTypeProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  emailType: string;
  studentName?: string;
  studentEmail?: string;
  previewData?: {
    courseName?: string;
    paymentType?: string;
    amountPaid?: number;
    groupName?: string;
    groupLink?: string;
    startDate?: string;
  };
}

export function ConfirmEmailType({ 
  isOpen, 
  onClose, 
  onConfirm, 
  emailType, 
  studentName, 
  studentEmail,
  previewData,
}: ConfirmEmailTypeProps) {
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const getEmailTypeConfig = (type: string) => {
    const configs = {
      welcome: {
        title: "Welcome Email",
        description: "Professional onboarding email with kickoff details and personalized course-career context."
      },
      payment_confirmation: {
        title: "Payment Confirmation Email",
        description: "Personalized payment receipt email based on selected payment type."
      },
      group_redirection: {
        title: "Group Redirection Email",
        description: "Course-based WhatsApp group invitation with direct join link."
      }
    };

    return configs[type as keyof typeof configs] || configs.welcome;
  };

  const config = getEmailTypeConfig(emailType);

  const handleConfirm = async () => {
    setIsSending(true);
    
    // Simulate sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onConfirm();
    setIsSending(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 transition-opacity" 
          onClick={onClose}
        ></div>
        
        {/* Modal */}
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Confirm Email
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Confirmation Message */}
          <div className="mb-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
              <div className="text-sm text-gray-900 dark:text-white">
                <p className="font-medium mb-1">Email Type:</p>
                <p className="text-gray-600 dark:text-gray-300">{config.title}</p>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{config.description}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
              <div className="text-sm text-gray-900 dark:text-white">
                <p className="font-medium mb-1">Recipient:</p>
                <p className="text-gray-600 dark:text-gray-300">
                  {studentName}
                  {studentEmail && (
                    <span className="block text-xs mt-1">{studentEmail}</span>
                  )}
                </p>
              </div>
            </div>

            {previewData?.courseName ? (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Course</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{previewData.courseName}</p>
              </div>
            ) : null}

            {emailType === "payment_confirmation" ? (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Payment Confirmation Details</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Type: {previewData?.paymentType || "Fully Paid"}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Amount: N{Number(previewData?.amountPaid || 0).toLocaleString()}</p>
              </div>
            ) : null}

            {emailType === "group_redirection" ? (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Group Redirection Details</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Group: {previewData?.groupName || "General Group"}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 break-all mt-1">{previewData?.groupLink || "-"}</p>
              </div>
            ) : null}

            <div className="text-center py-4">
              <p className="text-gray-900 dark:text-white font-medium mb-2">
                You are about to send this {config.title.toLowerCase()}.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Please review the details above. This action sends immediately.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
            <button
              onClick={onClose}
              disabled={isSending}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isSending}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSending ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Sending...
                </>
              ) : (
                "Send Email"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
