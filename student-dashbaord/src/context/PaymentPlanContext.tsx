"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { PaymentPlanService, normalizePaymentPlan } from "@/utils/paymentPlanService";

export type PaymentPlan =
  | "Select a plan"
  | "Not Paid Yet"
  | "Fully Paid"
  | "1st installment"
  | "2nd installment";

interface PaymentPlanContextType {
  studentPaymentPlans: { [key: string]: PaymentPlan };
  updateStudentPaymentPlan: (studentId: string, plan: PaymentPlan) => Promise<boolean>;
  getStudentPaymentPlan: (studentId: string) => PaymentPlan;
  loadStudentPaymentPlans: () => Promise<void>;
  isLoading: boolean;
}

const PaymentPlanContext = createContext<PaymentPlanContextType | undefined>(undefined);

export function PaymentPlanProvider({ children }: { children: ReactNode }) {
  const [studentPaymentPlans, setStudentPaymentPlans] = useState<{ [key: string]: PaymentPlan }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Load all students and their payment plans from database
  const loadStudentPaymentPlans = async () => {
    setIsLoading(true);
    try {
      const result = await PaymentPlanService.getAllStudents();
      if (result.success && result.data) {
        const plans: { [key: string]: PaymentPlan } = {};
        result.data.forEach((student: any) => {
          plans[student.id] = normalizePaymentPlan(student.payment_plan);
        });
        setStudentPaymentPlans(plans);
      }
    } catch (error) {
      console.error('Failed to load payment plans:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update payment plan in database and local state
  const updateStudentPaymentPlan = async (studentId: string, plan: PaymentPlan): Promise<boolean> => {
    try {
      const result = await PaymentPlanService.updateStudentPaymentPlan(studentId, plan);
      if (result.success) {
        // Update local state immediately for better UX
        setStudentPaymentPlans((prev) => ({
          ...prev,
          [studentId]: plan,
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update payment plan:', error);
      return false;
    }
  };

  const getStudentPaymentPlan = (studentId: string): PaymentPlan => {
    return normalizePaymentPlan(studentPaymentPlans[studentId]);
  };

  // Load payment plans on component mount
  useEffect(() => {
    loadStudentPaymentPlans();
  }, []);

  return (
    <PaymentPlanContext.Provider value={{ 
      studentPaymentPlans, 
      updateStudentPaymentPlan, 
      getStudentPaymentPlan,
      loadStudentPaymentPlans,
      isLoading
    }}>
      {children}
    </PaymentPlanContext.Provider>
  );
}

export function usePaymentPlan() {
  const context = useContext(PaymentPlanContext);
  if (context === undefined) {
    throw new Error("usePaymentPlan must be used within a PaymentPlanProvider");
  }
  return context;
}
