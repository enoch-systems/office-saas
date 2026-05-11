import type { Metadata } from "next";
import { StudentDatabaseTable } from "@/components/students/StudentDatabaseTable";
import React from "react";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description:
    "Manage student registrations, records, and operations from the TT Academy admin dashboard.",
};

export default function StudentDatabase() {
  return <StudentDatabaseTable />;
}
