"use client";

import { useEffect } from "react";

export function ViewTracker({ pageId }: { pageId: string }) {
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/analytics/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page_id: pageId,
        event_type: "view",
      }),
    }).catch(() => {});
  }, [pageId]);

  return null;
}
