"use client";

import RequireAuth from "@/components/RequireAuth";
import InstructorDashboardContent from "@/components/InstructorDashboardContent";

export default function InstructorPage() {
  return (
    <RequireAuth roles={["instructor", "admin"]}>
      <InstructorDashboardContent />
    </RequireAuth>
  );
}