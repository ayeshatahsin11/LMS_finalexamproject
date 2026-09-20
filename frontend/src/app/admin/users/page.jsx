"use client";

import RequireAuth from "@/components/RequireAuth";
import ManageUsersContent from "@/components/ManageUsersContent";

export default function ManageUsersPage() {
  return (
    <RequireAuth roles={["admin"]}>
      <ManageUsersContent />
    </RequireAuth>
  );
}
