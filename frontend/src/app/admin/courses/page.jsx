"use client";

import RequireAuth from "@/components/RequireAuth";
import ManageAllCoursesContent from "@/components/ManageAllCoursesContent";

export default function AdminCoursesPage() {
  return (
    <RequireAuth roles={["admin"]}>
      <ManageAllCoursesContent />
    </RequireAuth>
  );
}