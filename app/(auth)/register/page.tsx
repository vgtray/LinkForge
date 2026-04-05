"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Check, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, setAccessToken } from "@/lib/api";
import type { AuthResponse } from "@/types";

const USERNAME_REGEX = /^[a-z0-9_-]{3,30}$/;

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "taken" | "invalid"
  >("idle");

  const checkUsername = useCallback(async (name: string) => {
    if (!USERNAME_REGEX.test(name)) {
      setUsernameStatus("invalid");
      return;
    }
    setUsernameStatus("checking");
    try {
      const data = await api.get<{ available: boolean }>(
        `/api/username/check/${name}`
      );
      setUsernameStatus(data.available ? "available" : "taken");
    } catch {
      setUsernameStatus("idle");
    }
  }, []);

  useEffect(() => {
    if (!username || username.length < 3) {
      setUsernameStatus("idle");
      return;
    }

    const timer = setTimeout(() => checkUsername(username), 500);
    return () => clearTimeout(timer);
  }, [username, checkUsername]);

  function validate(): string | null {
    if (!USERNAME_REGEX.test(username)) {
      return "Username must be 3-30 characters, lowercase letters, numbers, hyphens, or underscores";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (password !== confirmPassword) {
      return "Passwords don't match";
    }
    if (usernameStatus === "taken") {
      return "Username is taken";
    }
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    setLoading(true);
    try {
      const data = await api.post<AuthResponse>("/api/auth/register", {
        username,
        email,
        password,
      });
      setAccessToken(data.access_token);
      router.push("/editor");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="rounded-xl border border-[var(--lf-border)] bg-[var(--lf-bg-secondary)] p-8">
        <h1 className="mb-1 font-display text-3xl font-bold tracking-tight text-[var(--lf-text-primary)]">
          Create your page
        </h1>
        <p className="mb-8 text-sm text-[var(--lf-text-secondary)]">
          Claim your unique link-in-bio page
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <Input
                id="username"
                type="text"
                placeholder="yourname"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                required
                autoComplete="username"
                className="border-[var(--lf-border)] bg-[var(--lf-bg-primary)] pr-10 text-[var(--lf-text-primary)] placeholder:text-[var(--lf-text-secondary)]"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {usernameStatus === "checking" && (
                  <Loader2 className="h-4 w-4 animate-spin text-[var(--lf-text-secondary)]" />
                )}
                {usernameStatus === "available" && (
                  <Check className="h-4 w-4 text-[var(--lf-success)]" />
                )}
                {(usernameStatus === "taken" || usernameStatus === "invalid") && (
                  <X className="h-4 w-4 text-[var(--lf-error)]" />
                )}
              </div>
            </div>
            {usernameStatus === "taken" && (
              <p className="text-xs text-[var(--lf-error)]">Username is taken</p>
            )}
            {usernameStatus === "invalid" && username.length >= 3 && (
              <p className="text-xs text-[var(--lf-error)]">
                Only lowercase letters, numbers, hyphens, underscores (3-30 chars)
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="border-[var(--lf-border)] bg-[var(--lf-bg-primary)] text-[var(--lf-text-primary)] placeholder:text-[var(--lf-text-secondary)]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="border-[var(--lf-border)] bg-[var(--lf-bg-primary)] text-[var(--lf-text-primary)] placeholder:text-[var(--lf-text-secondary)]"
            />
            {password.length > 0 && password.length < 8 && (
              <p className="text-xs text-[var(--lf-text-secondary)]">
                {8 - password.length} more characters needed
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="border-[var(--lf-border)] bg-[var(--lf-bg-primary)] text-[var(--lf-text-primary)] placeholder:text-[var(--lf-text-secondary)]"
            />
            {confirmPassword.length > 0 && password !== confirmPassword && (
              <p className="text-xs text-[var(--lf-error)]">
                Passwords don&apos;t match
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || usernameStatus === "taken"}
            className="w-full rounded-lg bg-gradient-to-r from-[var(--lf-gradient-start)] to-[var(--lf-gradient-end)] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[var(--lf-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--lf-bg-secondary)] disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Get started"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--lf-text-secondary)]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[var(--lf-accent)] transition-colors hover:text-[var(--lf-accent-hover)]"
          >
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
