"use client";

import RequireAuth from "@/components/RequireAuth";
import MyLessonsContent from "@/components/MyLessonsContent";

export default function MyLessonsPage() {
  return (
    <RequireAuth roles={["student"]}>
      <MyLessonsContent />
    </RequireAuth>
  );
}