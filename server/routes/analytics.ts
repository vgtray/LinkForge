import { Router, Request, Response } from "express";
import { z } from "zod";
import crypto from "crypto";
import { prisma } from "../lib/prisma";
import * as analyticsService from "../services/analytics.service";
import { authenticate } from "../middleware/auth";
import { analyticsLimiter } from "../middleware/rateLimit";

const router = Router();

const eventSchema = z.object({
  page_id: z.string().uuid(),
  block_id: z.string().uuid().optional(),
  event_type: z.enum(["view", "click"]),
});

const timelineSchema = z.object({
  days: z.coerce.number().refine((v) => v === 7 || v === 30, "days must be 7 or 30"),
});

function hashIp(ip: string): string {
  return crypto.createHash("sha256").update(ip).digest("hex");
}

router.post("/event", analyticsLimiter, async (req: Request, res: Response) => {
  try {
    const data = eventSchema.parse(req.body);
    const referrer = req.headers.referer || req.headers.referrer || undefined;
    const userAgent = req.headers["user-agent"] || undefined;
    const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.ip || "";
    const ipHash = ip ? hashIp(ip) : undefined;

    await analyticsService.recordEvent(
      data.page_id,
      data.block_id,
      data.event_type,
      referrer as string | undefined,
      ipHash,
      userAgent
    );
    res.status(201).json({ message: "Event recorded" });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: "Validation Error", message: err.errors[0].message, statusCode: 400 });
      return;
    }
    const status = err.statusCode || 500;
    res.status(status).json({ error: "Error", message: err.message, statusCode: status });
  }
});

router.get("/summary", authenticate, async (req: Request, res: Response) => {
  try {
    const page = await prisma.page.findUnique({ where: { user_id: req.user!.userId } });
    if (!page) {
      res.status(404).json({ error: "Not Found", message: "Page not found", statusCode: 404 });
      return;
    }
    const summary = await analyticsService.getSummary(page.id);
    res.json(summary);
  } catch (err: any) {
    const status = err.statusCode || 500;
    res.status(status).json({ error: "Error", message: err.message, statusCode: status });
  }
});

router.get("/timeline", authenticate, async (req: Request, res: Response) => {
  try {
    const { days } = timelineSchema.parse(req.query);
    const page = await prisma.page.findUnique({ where: { user_id: req.user!.userId } });
    if (!page) {
      res.status(404).json({ error: "Not Found", message: "Page not found", statusCode: 404 });
      return;
    }
    const timeline = await analyticsService.getTimeline(page.id, days);
    res.json({ timeline });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: "Validation Error", message: err.errors[0].message, statusCode: 400 });
      return;
    }
    const status = err.statusCode || 500;
    res.status(status).json({ error: "Error", message: err.message, statusCode: status });
  }
});

export default router;
