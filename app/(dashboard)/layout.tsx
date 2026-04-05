"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Layers,
  BarChart3,
  Settings,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { cn, getApiUrl } from "@/lib/utils";
import type { User } from "@/types";

const NAV_ITEMS = [
  { href: "/editor", label: "Editor", icon: Layers },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

function clearToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
  }
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    fetch(`${getApiUrl()}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setUser(data.user ?? data);
        setLoading(false);
      })
      .catch(() => {
        clearToken();
        router.replace("/login");
      });
  }, [router]);

  const handleLogout = () => {
    clearToken();
    router.replace("/login");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#09090B]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3B82F6] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#09090B] text-[#FAFAFA]">
      {/* Sidebar */}
      <aside className="flex w-16 flex-col border-r border-[#27272A] bg-[#09090B] md:w-64">
        {/* Logo */}
        <div className="flex h-16 items-center px-4">
          <span className="text-xl font-bold tracking-tight md:hidden">LF</span>
          <span className="hidden text-xl font-bold tracking-tight md:block">
            Link<span className="text-[#3B82F6]">Forge</span>
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-1 px-2 pt-4">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "text-[#3B82F6]"
                    : "text-[#A1A1AA] hover:text-[#FAFAFA]"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-lg bg-[#27272A]"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <item.icon className="relative z-10 h-5 w-5 shrink-0" />
                <span className="relative z-10 hidden md:block">
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* View page link */}
          {user && (
            <a
              href={`/${user.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#A1A1AA] transition-colors hover:text-[#FAFAFA]"
            >
              <ExternalLink className="h-5 w-5 shrink-0" />
              <span className="hidden md:block">View Page</span>
            </a>
          )}
        </nav>

        {/* Logout */}
        <div className="border-t border-[#27272A] p-2">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#A1A1AA] transition-colors hover:text-[#EF4444]"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span className="hidden md:block">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content — subtle radial gradient for depth */}
      <main
        className="flex-1 overflow-y-auto"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(59,130,246,0.04) 0%, transparent 60%), #09090B",
        }}
      >
        <div
          className="mx-auto max-w-7xl py-8"
          style={{ padding: "2rem clamp(1rem, 5vw, 5rem)" }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
