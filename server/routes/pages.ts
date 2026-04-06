import { Router, Request, Response } from "express";
import { z } from "zod";
import * as pageService from "../services/page.service";
import { authenticate } from "../middleware/auth";

const router = Router();

const updateSchema = z.object({
  title: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
  theme: z.record(z.unknown()).optional(),
  seo_title: z.string().max(100).optional(),
  seo_description: z.string().max(200).optional(),\n  is_published: z.boolean().optional(),
});

router.get("/me", authenticate, async (req: Request, res: Response) => {
  try {
    const page = await pageService.getByUserId(req.user!.userId);
    res.json({ page });
  } catch (err: any) {
    const status = err.statusCode || 500;
    res.status(status).json({ error: "Error", message: err.message, statusCode: status });
  }
});

router.put("/me", authenticate, async (req: Request, res: Response) => {
  try {
    const data = updateSchema.parse(req.body);
    const page = await pageService.update(req.user!.userId, data);
    res.json({ page });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: "Validation Error", message: err.errors[0].message, statusCode: 400 });
      return;
    }
    const status = err.statusCode || 500;
    res.status(status).json({ error: "Error", message: err.message, statusCode: status });
  }
});

router.post("/me/publish", authenticate, async (req: Request, res: Response) => {
  try {
    const page = await pageService.togglePublish(req.user!.userId);
    res.json({ page });
  } catch (err: any) {
    const status = err.statusCode || 500;
    res.status(status).json({ error: "Error", message: err.message, statusCode: status });
  }
});

router.get("/:username", async (req: Request<{ username: string }>, res: Response) => {
  try {
    const page = await pageService.getByUsername(req.params.username);
    res.json({ page });
  } catch (err: any) {
    const status = err.statusCode || 500;
    res.status(status).json({ error: "Error", message: err.message, statusCode: status });
  }
});

export default router;
