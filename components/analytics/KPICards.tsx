"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Eye, MousePointerClick, TrendingUp } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import type { AnalyticsSummary } from "@/types";

function AnimatedCounter({ value }: { value: number }) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => formatNumber(Math.round(v)));
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1],
    });
    return controls.stop;
  }, [motionValue, value]);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (v) => {
      if (ref.current) ref.current.textContent = v;
    });
    return unsubscribe;
  }, [rounded]);

  return <span ref={ref}>0</span>;
}

const CARDS = [
  {
    key: "views" as const,
    label: "Total Views",
    icon: Eye,
    color: "#3B82F6",
    getValue: (s: AnalyticsSummary) => s.total_views,
  },
  {
    key: "clicks" as const,
    label: "Total Clicks",
    icon: MousePointerClick,
    color: "#22C55E",
    getValue: (s: AnalyticsSummary) => s.total_clicks,
  },
  {
    key: "ctr" as const,
    label: "Click Rate",
    icon: TrendingUp,
    color: "#8B5CF6",
    getValue: (s: AnalyticsSummary) => s.ctr,
    format: (v: number) => `${v.toFixed(1)}%`,
  },
];

export function KPICards({ summary }: { summary: AnalyticsSummary | null }) {
  if (!summary) return null;

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      {CARDS.map((card, i) => {
        const value = card.getValue(summary);
        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
            whileHover={{ scale: 1.02 }}
            className="rounded-xl border border-[#27272A] bg-[#18181B] p-6 transition-colors hover:border-[#3B82F6]/20"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[#A1A1AA]">
                {card.label}
              </p>
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${card.color}10` }}
              >
                <card.icon
                  className="h-5 w-5"
                  style={{ color: card.color }}
                />
              </div>
            </div>
            <p className="mt-3 text-3xl font-bold tabular-nums">
              {card.format ? (
                card.format(value)
              ) : (
                <AnimatedCounter value={value} />
              )}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
