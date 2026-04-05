"use client";

import { cn } from "@/lib/utils";
import type { AnalyticsSummary } from "@/types";

type TopLink = AnalyticsSummary["top_links"][number];

function CTRBadge({ ctr }: { ctr: number }) {
  const color =
    ctr >= 5
      ? "bg-[#22C55E]/10 text-[#22C55E]"
      : ctr >= 2
        ? "bg-[#EAB308]/10 text-[#EAB308]"
        : "bg-[#EF4444]/10 text-[#EF4444]";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        color
      )}
    >
      {ctr.toFixed(1)}%
    </span>
  );
}

export function LinkTable({ links }: { links: TopLink[] }) {
  if (!links.length) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-[#27272A] bg-[#18181B]">
        <p className="text-sm text-[#A1A1AA]">No link data yet</p>
      </div>
    );
  }

  const sorted = [...links].sort((a, b) => b.clicks - a.clicks);

  return (
    <div className="overflow-hidden rounded-xl border border-[#27272A] bg-[#18181B]">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#27272A]">
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#A1A1AA]">
              Link Title
            </th>
            <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#A1A1AA]">
              Clicks
            </th>
            <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#A1A1AA]">
              CTR
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((link) => (
            <tr
              key={link.block_id}
              className="border-b border-[#27272A] last:border-0 transition-colors hover:bg-[#27272A]/50"
            >
              <td className="px-6 py-4 text-sm font-medium text-[#FAFAFA]">
                {link.title || "Untitled"}
              </td>
              <td className="px-6 py-4 text-right text-sm tabular-nums text-[#A1A1AA]">
                {link.clicks.toLocaleString()}
              </td>
              <td className="px-6 py-4 text-right">
                <CTRBadge ctr={link.ctr} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
