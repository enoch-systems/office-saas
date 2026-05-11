import { PaymentUploadForm } from "@/components/students/PaymentUploadForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Payment Upload",
  description:
    "Internal payment-proof upload page for testing and admin-side submission checks.",
};

export default function PaymentUploadPage() {
  return <PaymentUploadForm />;
}
