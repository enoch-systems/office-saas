"use client";
import React from "react";

interface PaymentTypeSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentTypeSelect: (type: string) => void;
  studentName?: string;
}

export function PaymentTypeSelection({ isOpen, onClose, onPaymentTypeSelect, studentName }: PaymentTypeSelectionProps) {
  if (!isOpen) return null;

  const paymentTypes = [
    {
      id: "Fully Paid",
      name: "Fully Paid",
      description: "Complete payment - N50,000"
    },
    {
      id: "1st Installment",
      name: "First Installment",
      description: "First installment - N30,000"
    },
    {
      id: "2nd Installment",
      name: "Second Installment",
      description: "Second installment - N20,000"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 transition-opacity" 
          onClick={onClose}
        ></div>
        
        {/* Modal */}
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Select Payment Type
              </h3>
              {studentName && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  For: <span className="font-medium">{studentName}</span>
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

          {/* Payment Type List */}
          <div className="space-y-2 mb-6">
            {paymentTypes.map((paymentType) => (
              <button
                key={paymentType.id}
                onClick={() => onPaymentTypeSelect(paymentType.id)}
                className="w-full text-left px-4 py-4 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 rounded-lg"
              >
                <div className="font-medium text-gray-900 dark:text-white mb-1">
                  {paymentType.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {paymentType.description}
                </div>
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
