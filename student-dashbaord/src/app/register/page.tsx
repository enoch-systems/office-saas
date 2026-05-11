import { RegistrationForm } from "@/components/students/RegistrationForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register for Trailblazer Bootcamp",
  description:
    "Submit your registration for Tech Trailblazer Bootcamp with your details, track, and learning goals.",
};

export default function RegisterPage() {
  return <RegistrationForm />;
}
