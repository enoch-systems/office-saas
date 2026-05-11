import { PaymentChecker } from "@/components/students/PaymentChecker";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Payment Checker",
  description:
    "Review payment-proof messages, open receipt images, and track unread submissions.",
};

export default function PaymentCheckerPage() {
  return <PaymentChecker />;
}
