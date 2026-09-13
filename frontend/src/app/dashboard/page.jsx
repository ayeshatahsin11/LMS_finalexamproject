"use client";

import RequireAuth from "@/components/RequireAuth";
import StudentDashboardContent from "@/components/StudentDashboardContent";

export default function DashboardPage() {
  return (
    <RequireAuth roles={["student"]}>
      <StudentDashboardContent />
    </RequireAuth>
  );
}