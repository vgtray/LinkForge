"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { KPICards } from "@/components/analytics/KPICards";
import { LinkTable } from "@/components/analytics/LinkTable";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getApiUrl } from "@/lib/utils";
import type { AnalyticsSummary, TimelineData } from "@/types";
import { toast } from "sonner";

const ClickChart = dynamic(
  () => import("@/components/analytics/ClickChart").then((mod) => mod.ClickChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] w-full animate-pulse rounded-xl bg-[#18181B]" />
    ),
  }
);

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<"7" | "30">("7");
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [timeline, setTimeline] = useState<TimelineData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    setLoading(true);
    Promise.all([
      fetch(`${getApiUrl()}/api/analytics/summary?days=${period}`, {
        headers,
        credentials: "include",
      }),
      fetch(`${getApiUrl()}/api/analytics/timeline?days=${period}`, {
        headers,
        credentials: "include",
      }),
    ])
      .then(async ([summaryRes, timelineRes]) => {
        if (!summaryRes.ok || !timelineRes.ok) throw new Error();
        const summaryData = await summaryRes.json();
        const timelineData = await timelineRes.json();
        setSummary(summaryData.summary ?? summaryData);
        setTimeline(timelineData.timeline ?? timelineData);
      })
      .catch(() => toast.error("Failed to load analytics"))
      .finally(() => setLoading(false));
  }, [period]);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <Tabs
          value={period}
          onValueChange={(v) => setPeriod(v as "7" | "30")}
        >
          <TabsList className="bg-[#18181B] border border-[#27272A]">
            <TabsTrigger
              value="7"
              className="data-[state=active]:bg-[#27272A] data-[state=active]:text-[#FAFAFA]"
            >
              7 days
            </TabsTrigger>
            <TabsTrigger
              value="30"
              className="data-[state=active]:bg-[#27272A] data-[state=active]:text-[#FAFAFA]"
            >
              30 days
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {loading ? (
        <div className="flex h-[40vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3B82F6] border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-8">
          <KPICards summary={summary} />
          <ClickChart data={timeline} />
          <LinkTable links={summary?.top_links ?? []} />
        </div>
      )}
    </div>
  );
}
