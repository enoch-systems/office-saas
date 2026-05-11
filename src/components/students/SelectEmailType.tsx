"use client";
import React from "react";

interface SelectEmailTypeProps {
  isOpen: boolean;
  onClose: () => void;
  onEmailTypeSelect: (type: string) => void;
  studentName?: string;
  studentEmail?: string;
}

export function SelectEmailType({ isOpen, onClose, onEmailTypeSelect, studentName, studentEmail }: SelectEmailTypeProps) {
  if (!isOpen) return null;

  const emailTypes = [
    {
      id: "welcome",
      name: "Welcome Email",
      description: "Professional onboarding email with class kickoff and track-specific career direction."
    },
    {
      id: "payment_confirmation",
      name: "Payment Confirmation Email",
      description: "Personalized receipt email based on fully paid / first installment / second installment."
    },
    {
      id: "group_redirection",
      name: "Group Redirection Email",
      description: "Course-based WhatsApp group invite with direct join link."
    }
  ];

  const handleEmailTypeSelect = (type: string) => {
    onEmailTypeSelect(type);
    onClose();
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
                Select Email Type
              </h3>
              {studentName && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Sending to: <span className="font-medium">{studentName}</span>
                  {studentEmail && (
                    <span className="text-gray-500"> ({studentEmail})</span>
                  )}
                </p>
              )}
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

          {/* Email Type List */}
          <div className="space-y-2 mb-6">
            {emailTypes.map((emailType) => (
              <button
                key={emailType.id}
                onClick={() => handleEmailTypeSelect(emailType.id)}
                className="w-full text-left px-4 py-3 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-gray-900 dark:text-white"
              >
                <p className="font-medium">{emailType.name}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{emailType.description}</p>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
