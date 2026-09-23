"use client";

import RequireAuth from "@/components/RequireAuth";
import ManageReviewsContent from "@/components/ManageReviewsContent";

export default function ManageReviewsPage() {
  return (
    <RequireAuth roles={["admin"]}>
      <ManageReviewsContent />
    </RequireAuth>
  );
}