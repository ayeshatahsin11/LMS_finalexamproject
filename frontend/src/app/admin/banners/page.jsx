"use client";

import RequireAuth from "@/components/RequireAuth";
import ManageBannersContent from "@/components/ManageBannersContent";

export default function ManageBannersPage() {
  return (
    <RequireAuth roles={["admin"]}>
      <ManageBannersContent />
    </RequireAuth>
  );
}