"use client";

import RequireAuth from "@/components/RequireAuth";
import MyCoursesContent from "@/components/MyCoursesContent";

export default function MyCoursesPage() {
  return (
    <RequireAuth roles={["instructor", "admin"]}>
      <MyCoursesContent />
    </RequireAuth>
  );
}