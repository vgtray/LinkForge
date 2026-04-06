"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getApiUrl } from "@/lib/utils";
import { getAccessToken, clearAccessToken } from "@/lib/api";
import type { User } from "@/types";


export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    fetch(`${getApiUrl()}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        const u = data.user ?? data;
        setUser(u);
        setUsername(u.username);
        setEmail(u.email);
        setAvatarUrl(u.avatar_url ?? "");
      })
      .catch(() => toast.error("Failed to load profile"));
  }, []);

  const handleSaveProfile = async () => {
    const token = getAccessToken();
    setSavingProfile(true);
    try {
      const res = await fetch(`${getApiUrl()}/api/auth/me`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, email, avatar_url: avatarUrl }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to save");
      }
      toast.success("Profile updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    const token = getAccessToken();
    setSavingPassword(true);
    try {
      const res = await fetch(`${getApiUrl()}/api/auth/password`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update password");
      }
      toast.success("Password updated");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update password");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    const token = getAccessToken();
    try {
      const res = await fetch(`${getApiUrl()}/api/auth/me`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      clearAccessToken();
      window.location.href = "/";
    } catch {
      toast.error("Failed to delete account");
    }
  };

  return (
    <div className="max-w-2xl space-y-12">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Profile */}
      <section className="space-y-5 rounded-xl border border-[#27272A] bg-[#18181B] p-8">
        <h2 className="text-lg font-semibold">Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#A1A1AA]">
              Username
            </label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border-[#27272A] bg-[#09090B] text-[#FAFAFA] focus-visible:ring-[#3B82F6]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#A1A1AA]">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-[#27272A] bg-[#09090B] text-[#FAFAFA] focus-visible:ring-[#3B82F6]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#A1A1AA]">
              Avatar URL
            </label>
            <div className="flex items-center gap-4">
              {avatarUrl && (
                <img
                  src={avatarUrl}
                  alt="Avatar preview"
                  className="h-10 w-10 rounded-full object-cover border border-[#27272A]"
                />
              )}
              <Input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="border-[#27272A] bg-[#09090B] text-[#FAFAFA] focus-visible:ring-[#3B82F6]"
              />
            </div>
            <p className="mt-1 text-xs text-[#71717A]">
              Paste a URL to an image to use as your profile avatar.
            </p>
          </div>
          <Button
            onClick={handleSaveProfile}
            disabled={savingProfile}
            className="bg-[#3B82F6] hover:bg-[#2563EB]"
          >
            {savingProfile ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </section>

      {/* Security */}
      <section className="space-y-5 rounded-xl border border-[#27272A] bg-[#18181B] p-8">
        <h2 className="text-lg font-semibold">Security</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#A1A1AA]">
              Current password
            </label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="border-[#27272A] bg-[#09090B] text-[#FAFAFA] focus-visible:ring-[#3B82F6]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#A1A1AA]">
              New password
            </label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border-[#27272A] bg-[#09090B] text-[#FAFAFA] focus-visible:ring-[#3B82F6]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#A1A1AA]">
              Confirm new password
            </label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border-[#27272A] bg-[#09090B] text-[#FAFAFA] focus-visible:ring-[#3B82F6]"
            />
          </div>
          <Button
            onClick={handleUpdatePassword}
            disabled={savingPassword}
            className="bg-[#3B82F6] hover:bg-[#2563EB]"
          >
            {savingPassword ? "Updating..." : "Update password"}
          </Button>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="space-y-4 rounded-xl border border-red-500/20 bg-[#18181B] p-8">
        <h2 className="text-lg font-semibold text-[#EF4444]">Danger Zone</h2>
        <p className="text-sm text-[#A1A1AA]">
          Once you delete your account, there is no going back. All your data
          will be permanently removed.
        </p>
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive">Delete my account</Button>
          </DialogTrigger>
          <DialogContent className="border-[#27272A] bg-[#18181B]">
            <DialogHeader>
              <DialogTitle className="text-[#FAFAFA]">
                Are you absolutely sure?
              </DialogTitle>
              <DialogDescription className="text-[#A1A1AA]">
                This action cannot be undone. This will permanently delete your
                account and all associated data.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setDeleteOpen(false)}
                className="border-[#27272A] text-[#FAFAFA] hover:bg-[#27272A]"
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteAccount}>
                Yes, delete my account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
    </div>
  );
}
