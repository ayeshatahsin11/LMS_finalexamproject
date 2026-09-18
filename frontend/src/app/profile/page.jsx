"use client";

import RequireAuth from "@/components/RequireAuth";
import ProfileContent from "@/components/ProfileContent";

export default function ProfilePage() {
  return (
    <RequireAuth>
      <ProfileContent />
    </RequireAuth>
  );
}



