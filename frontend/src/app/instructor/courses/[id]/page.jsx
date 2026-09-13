"use client";

import RequireAuth from "@/components/RequireAuth";
import ManageCourseContent from "@/components/ManageCourseContent";

export default function ManageCoursePage() {
  return (
    <RequireAuth roles={["instructor", "admin"]}>
      <ManageCourseContent />
    </RequireAuth>
  );
}