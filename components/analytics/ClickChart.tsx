"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { TimelineData } from "@/types";

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[#27272A] bg-[#18181B]/95 backdrop-blur-sm px-3 py-2.5 shadow-lg">
      <p className="mb-1.5 text-xs text-[#A1A1AA]">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-sm font-medium" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

export function ClickChart({ data }: { data: TimelineData[] }) {
  if (!data.length) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-xl border border-[#27272A] bg-[#18181B]">
        <p className="text-sm text-[#A1A1AA]">No data for this period</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#27272A] bg-[#18181B] p-6">
      <h3 className="mb-6 text-sm font-semibold text-[#A1A1AA]">
        Views & Clicks
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="gradViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradClicks" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22C55E" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#27272A"
            strokeOpacity={0.5}
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fill: "#A1A1AA", fontSize: 12 }}
            axisLine={{ stroke: "#27272A" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#A1A1AA", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="views"
            name="Views"
            stroke="#3B82F6"
            strokeWidth={1.5}
            fill="url(#gradViews)"
          />
          <Area
            type="monotone"
            dataKey="clicks"
            name="Clicks"
            stroke="#22C55E"
            strokeWidth={1.5}
            fill="url(#gradClicks)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
