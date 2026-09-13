"use client";

import RequireAuth from "@/components/RequireAuth";
import AdminDashboardContent from "@/components/AdminDashboardContent";

export default function AdminPage() {
  return (
    <RequireAuth roles={["admin"]}>
      <AdminDashboardContent />
    </RequireAuth>
  );
}