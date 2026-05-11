"use client";
import React, { useState } from 'react';
import { PaymentPlan } from '@/context/PaymentPlanContext';
import {
  PaymentPlanService,
  StudentData,
  PAYMENT_PLAN_OPTIONS,
  PAYMENT_PLAN_PLACEHOLDER,
  getPaymentPlanAmounts,
} from '@/utils/paymentPlanService';

interface PaymentPlanFormProps {
  initialData?: Partial<StudentData>;
  onSuccess?: (studentId: string) => void;
  onError?: (error: string) => void;
}

export function PaymentPlanForm({ initialData, onSuccess, onError }: PaymentPlanFormProps) {
  const [formData, setFormData] = useState<StudentData>({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    course: initialData?.course || '',
    reg_date: initialData?.reg_date || '',
    reg_time: initialData?.reg_time || '',
    payment_plan: initialData?.payment_plan || PAYMENT_PLAN_PLACEHOLDER,
    amount_paid: initialData?.amount_paid || 0,
    balance_remaining: initialData?.balance_remaining || 0,
    status: initialData?.status || 'None',
    timestamp: initialData?.timestamp || new Date().toISOString(),
    gender: initialData?.gender || '',
    state_of_residence: initialData?.state_of_residence || '',
    learning_track: initialData?.learning_track || '',
    how_did_you_hear: initialData?.how_did_you_hear || '',
    has_laptop_and_internet: initialData?.has_laptop_and_internet || '',
    current_employment_status: initialData?.current_employment_status || '',
    wants_scholarship: initialData?.wants_scholarship || '',
    why_learn_this_skill: initialData?.why_learn_this_skill || '',
    id: initialData?.id
  });

  const [isLoading, setIsLoading] = useState(false);

  const paymentPlanOptions: PaymentPlan[] = [PAYMENT_PLAN_PLACEHOLDER, ...PAYMENT_PLAN_OPTIONS];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'payment_plan') {
      const paymentPlan = value as PaymentPlan;
      const paymentAmounts = getPaymentPlanAmounts(paymentPlan);

      setFormData(prev => ({
        ...prev,
        payment_plan: paymentPlan,
        amount_paid: paymentAmounts?.amountPaid ?? 0,
        balance_remaining: paymentAmounts?.balanceRemaining ?? 0,
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await PaymentPlanService.upsertStudentPaymentPlan(formData);
      
      if (result.success) {
        onSuccess?.(result.data);
        // Reset form if it's a new record
        if (!initialData?.id) {
          setFormData(prev => ({
            ...prev,
            payment_plan: PAYMENT_PLAN_PLACEHOLDER,
            amount_paid: 0,
            balance_remaining: 0,
          }));
        }
      } else {
        onError?.(result.error || 'Failed to save payment plan');
      }
    } catch (error) {
      onError?.('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="course" className="block text-sm font-medium text-gray-700">
            Course
          </label>
          <input
            type="text"
            id="course"
            name="course"
            value={formData.course}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="payment_plan" className="block text-sm font-medium text-gray-700">
            Payment Plan
          </label>
          <select
            id="payment_plan"
            name="payment_plan"
            value={formData.payment_plan}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {paymentPlanOptions.map(option => (
              <option key={option} value={option} disabled={option === PAYMENT_PLAN_PLACEHOLDER}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="amount_paid" className="block text-sm font-medium text-gray-700">
            Amount Paid
          </label>
          <input
            type="number"
            id="amount_paid"
            name="amount_paid"
            value={formData.amount_paid}
            onChange={handleInputChange}
            step="0.01"
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="balance_remaining" className="block text-sm font-medium text-gray-700">
            Balance Remaining
          </label>
          <input
            type="number"
            id="balance_remaining"
            name="balance_remaining"
            value={formData.balance_remaining}
            onChange={handleInputChange}
            step="0.01"
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="reg_date" className="block text-sm font-medium text-gray-700">
            Registration Date
          </label>
          <input
            type="date"
            id="reg_date"
            name="reg_date"
            value={formData.reg_date}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="state_of_residence" className="block text-sm font-medium text-gray-700">
            State of Residence
          </label>
          <input
            type="text"
            id="state_of_residence"
            name="state_of_residence"
            value={formData.state_of_residence}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="learning_track" className="block text-sm font-medium text-gray-700">
            Learning Track
          </label>
          <input
            type="text"
            id="learning_track"
            name="learning_track"
            value={formData.learning_track}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          disabled={isLoading || formData.payment_plan === PAYMENT_PLAN_PLACEHOLDER}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : (initialData?.id ? 'Update Payment Plan' : 'Save Payment Plan')}
        </button>
      </div>
    </form>
  );
}
