"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, setAccessToken } from "@/lib/api";
import type { AuthResponse } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await api.post<AuthResponse>("/api/auth/login", {
        email,
        password,
      });
      setAccessToken(data.access_token);
      router.push("/editor");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to sign in");
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
          Welcome back
        </h1>
        <p className="mb-8 text-sm text-[var(--lf-text-secondary)]">
          Sign in to your LinkForge account
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
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
              autoComplete="current-password"
              className="border-[var(--lf-border)] bg-[var(--lf-bg-primary)] text-[var(--lf-text-primary)] placeholder:text-[var(--lf-text-secondary)]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-[var(--lf-gradient-start)] to-[var(--lf-gradient-end)] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[var(--lf-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--lf-bg-secondary)] disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--lf-text-secondary)]">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-[var(--lf-accent)] transition-colors hover:text-[var(--lf-accent-hover)]"
          >
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
