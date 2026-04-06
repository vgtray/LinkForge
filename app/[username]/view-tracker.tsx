"use client";

import { useEffect } from "react";

export function ViewTracker({ pageId }: { pageId: string }) {
  useEffect(() => {
    const key = `lf_viewed_${pageId}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    fetch(`/api/analytics/event`, {
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
