"use client";

import RequireAuth from "@/components/RequireAuth";
import ManageCategoriesContent from "@/components/ManageCategoriesContent";

export default function ManageCategoriesPage() {
  return (
    <RequireAuth roles={["admin"]}>
      <ManageCategoriesContent />
    </RequireAuth>
  );
}