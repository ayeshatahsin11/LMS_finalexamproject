"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Lock } from "lucide-react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import Breadcrumbs from "@/components/Breadcrumbs";
import ErrorMessage from "@/components/ErrorMessage";
import SuccessMessage from "@/components/SuccessMessage";
import Modal from "@/components/Modal";
import PasswordInput from "@/components/PasswordInput";
import { useAutoDismiss } from "@/lib/useAutoDismiss";

const MAX_PASSWORD_ATTEMPTS = 5;

const ROLE_STYLES = {
  student: "bg-indigo/15 text-indigo border-indigo/30",
  instructor: "bg-pink/15 text-pink border-pink/30",
  admin: "bg-amber-400/15 text-amber-400 border-amber-400/30",
};

export default function ProfileContent() {
  const { user, setUser, logout } = useAuth();
  const router = useRouter();

  // Profile details form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    avatar: user?.avatar || "",
  });
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Password change form state
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showLockoutModal, setShowLockoutModal] = useState(false);

  useAutoDismiss(profileSuccess, setProfileSuccess);
  useAutoDismiss(profileError, setProfileError, 6000);
  useAutoDismiss(passwordSuccess, setPasswordSuccess);
  useAutoDismiss(passwordError, setPasswordError, 6000);

  const handleProfileChange = (e) => setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");
    setSavingProfile(true);
    try {
      const res = await api.put("/users/me", profileForm);
      const updated = { ...user, ...res.data.user };
      setUser(updated);
      localStorage.setItem("lms_user", JSON.stringify(updated));
      setProfileSuccess("Profile updated successfully.");
    } catch (err) {
      setProfileError(err.response?.data?.message || "Unable to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    setSavingPassword(true);
    try {
      await api.put("/users/me/password", passwordForm);
      setPasswordSuccess("Password changed successfully.");
      setPasswordForm({ currentPassword: "", newPassword: "" });
      setFailedAttempts(0);
    } catch (err) {
      const isWrongPassword = err.response?.status === 400 && err.response?.data?.message?.includes("incorrect");

      if (isWrongPassword) {
        const nextCount = failedAttempts + 1;
        setFailedAttempts(nextCount);

        if (nextCount >= MAX_PASSWORD_ATTEMPTS) {
          setShowLockoutModal(true);
        } else {
          setPasswordError(
            `Current password is incorrect. (${nextCount}/${MAX_PASSWORD_ATTEMPTS} attempts — you'll be logged out after ${MAX_PASSWORD_ATTEMPTS} failed tries.)`
          );
        }
      } else {
        setPasswordError(err.response?.data?.message || "Unable to change password.");
      }
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLockoutConfirm = () => {
    setShowLockoutModal(false);
    logout();
    router.push("/login");
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <Breadcrumbs items={[{ label: "Profile" }]} />
      <h1 className="text-3xl mb-1">Your profile</h1>
      <p className="text-text-muted mb-8">Manage your personal details and account security.</p>

      {/* Profile details */}
      <form onSubmit={handleProfileSubmit} className="card p-6 flex flex-col gap-4 mb-8">
        <div className="flex items-center gap-2 mb-1">
          <User size={18} className="text-purple" />
          <h2 className="text-xl">Personal details</h2>
        </div>

        <ErrorMessage message={profileError} />
        <SuccessMessage message={profileSuccess} />

        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo via-purple to-pink flex items-center justify-center text-white font-serif text-2xl shrink-0 overflow-hidden">
            {profileForm.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profileForm.avatar} alt={user?.name} className="h-full w-full object-cover" />
            ) : (
              user?.name?.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-text mb-1.5">Avatar URL</label>
            <input
              type="url"
              name="avatar"
              className="input-field"
              value={profileForm.avatar}
              onChange={handleProfileChange}
              placeholder="https://..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Full name</label>
          <input
            type="text"
            name="name"
            required
            className="input-field"
            value={profileForm.name}
            onChange={handleProfileChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Email</label>
          <input type="email" disabled value={user?.email || ""} className="input-field opacity-60 cursor-not-allowed" />
          <p className="text-xs text-text-faint mt-1">Email can't be changed.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1.5">
            Bio <span className="text-text-faint font-normal">(optional)</span>
          </label>
          <textarea
            name="bio"
            rows={3}
            maxLength={500}
            className="input-field resize-none"
            value={profileForm.bio}
            onChange={handleProfileChange}
            placeholder="Tell others a little about yourself..."
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-text-faint">
          <span className={`capitalize px-3 py-1 rounded-full font-medium border ${ROLE_STYLES[user?.role] || "bg-purple/10 text-purple border-purple/20"}`}>
            {user?.role}
          </span>
          account
        </div>

        <button type="submit" disabled={savingProfile} className="btn-primary self-start mt-2">
          {savingProfile ? "Saving..." : "Save changes"}
        </button>
      </form>

      {/* Password change */}
      <form onSubmit={handlePasswordSubmit} className="card p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-1">
          <Lock size={18} className="text-pink" />
          <h2 className="text-xl">Change password</h2>
        </div>

        <ErrorMessage message={passwordError} />
        <SuccessMessage message={passwordSuccess} />

        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Current password</label>
          <PasswordInput
            name="currentPassword"
            required
            autoComplete="current-password"
            value={passwordForm.currentPassword}
            onChange={handlePasswordChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1.5">New password</label>
          <PasswordInput
            name="newPassword"
            required
            minLength={6}
            autoComplete="new-password"
            value={passwordForm.newPassword}
            onChange={handlePasswordChange}
            placeholder="At least 6 characters"
          />
        </div>

        <button type="submit" disabled={savingPassword} className="btn-primary self-start mt-2">
          {savingPassword ? "Updating..." : "Update password"}
        </button>
      </form>

      <Modal
        open={showLockoutModal}
        onClose={handleLockoutConfirm}
        variant="danger"
        title="Too many failed attempts"
        message={`You've entered the wrong current password ${MAX_PASSWORD_ATTEMPTS} times. For your account's security, you're being logged out. Please log back in to try again.`}
        actionLabel="Log out now"
        onAction={handleLockoutConfirm}
      />
    </div>
  );
}