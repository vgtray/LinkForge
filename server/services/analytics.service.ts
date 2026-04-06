import { EventType } from "@prisma/client";
import { prisma } from "../lib/prisma";


export async function recordEvent(
  pageId: string,
  blockId: string | undefined,
  eventType: EventType,
  referrer?: string,
  ipHash?: string,
  userAgent?: string
) {
  return prisma.analyticsEvent.create({
    data: {
      page_id: pageId,
      block_id: blockId || null,
      event_type: eventType,
      referrer: referrer || null,
      ip_hash: ipHash || null,
      user_agent: userAgent || null,
    },
  });
}

export async function getSummary(pageId: string, days: number) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const [views, clicks, topLinks] = await Promise.all([
    prisma.analyticsEvent.count({
      where: { page_id: pageId, event_type: "view", created_at: { gte: since } },
    }),
    prisma.analyticsEvent.count({
      where: { page_id: pageId, event_type: "click", created_at: { gte: since } },
    }),
    prisma.analyticsEvent.groupBy({
      by: ["block_id"],
      where: { page_id: pageId, event_type: "click", block_id: { not: null }, created_at: { gte: since } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    }),
  ]);

  const blockIds = topLinks.map((l) => l.block_id).filter(Boolean) as string[];
  const blocks = await prisma.block.findMany({
    where: { id: { in: blockIds } },
    select: { id: true, title: true },
  });
  const blockMap = new Map(blocks.map((b) => [b.id, b.title || "Untitled"]));

  const total_views = views;
  const total_clicks = clicks;
  const ctr = total_views > 0 ? Math.round((total_clicks / total_views) * 10000) / 100 : 0;

  return {
    total_views,
    total_clicks,
    ctr,
    top_links: topLinks.map((l) => ({
      block_id: l.block_id!,
      title: blockMap.get(l.block_id!) || "Untitled",
      clicks: l._count.id,
      ctr: total_views > 0 ? Math.round((l._count.id / total_views) * 10000) / 100 : 0,
    })),
  };
}

export async function getTimeline(pageId: string, days: number) {
  const since = new Date();
  since.setDate(since.getDate() - days);
  since.setHours(0, 0, 0, 0);

  const events = await prisma.analyticsEvent.findMany({
    where: { page_id: pageId, created_at: { gte: since } },
    select: { event_type: true, created_at: true },
    orderBy: { created_at: "asc" },
  });

  const map = new Map<string, { views: number; clicks: number }>();
  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    map.set(d.toISOString().slice(0, 10), { views: 0, clicks: 0 });
  }

  for (const e of events) {
    const key = e.created_at.toISOString().slice(0, 10);
    const entry = map.get(key);
    if (entry) {
      if (e.event_type === "view") entry.views++;
      else entry.clicks++;
    }
  }

  return Array.from(map.entries()).map(([date, data]) => ({
    date,
    views: data.views,
    clicks: data.clicks,
  }));
}
