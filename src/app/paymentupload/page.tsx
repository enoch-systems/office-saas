import { PaymentUploadForm } from "@/components/students/PaymentUploadForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upload Payment Proof",
  description:
    "Send your payment proof with name, email, amount paid, and receipt image for review.",
};

export default function PaymentUploadPage() {
  return <PaymentUploadForm />;
}
