import { Router, Request, Response } from "express";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { authenticate } from "../middleware/auth";

const router = Router();

const blockTypeEnum = z.enum(["link", "header", "social", "about", "embed"]);

const createSchema = z.object({
  type: blockTypeEnum,
  title: z.string().max(200).optional(),
  url: z.string().url().max(2000).optional(),
  icon: z.string().max(100).optional(),
  settings: z.record(z.unknown()).optional(),
});

const updateSchema = z.object({
  type: blockTypeEnum.optional(),
  title: z.string().max(200).optional().nullable(),
  url: z.string().url().max(2000).optional().nullable(),
  icon: z.string().max(100).optional().nullable(),
  settings: z.record(z.unknown()).optional(),
  is_visible: z.boolean().optional(),
});

const reorderSchema = z.object({
  orderedIds: z.array(z.string().uuid()),
});

async function getUserPage(userId: string) {
  const page = await prisma.page.findUnique({ where: { user_id: userId } });
  if (!page) throw Object.assign(new Error("Page not found"), { statusCode: 404 });
  return page;
}

router.get("/", authenticate, async (req: Request, res: Response) => {
  try {
    const page = await getUserPage(req.user!.userId);
    const blocks = await prisma.block.findMany({
      where: { page_id: page.id },
      orderBy: { position: "asc" },
    });
    res.json({ blocks });
  } catch (err: any) {
    const status = err.statusCode || 500;
    res.status(status).json({ error: "Error", message: err.message, statusCode: status });
  }
});

router.post("/", authenticate, async (req: Request, res: Response) => {
  try {
    const data = createSchema.parse(req.body);
    const page = await getUserPage(req.user!.userId);

    const maxPos = await prisma.block.aggregate({
      where: { page_id: page.id },
      _max: { position: true },
    });

    const block = await prisma.block.create({
      data: {
        page_id: page.id,
        type: data.type,
        title: data.title || null,
        url: data.url || null,
        icon: data.icon || null,
        settings: (data.settings || {}) as Prisma.InputJsonValue,
        position: (maxPos._max.position ?? -1) + 1,
      },
    });
    res.status(201).json({ block });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: "Validation Error", message: err.errors[0].message, statusCode: 400 });
      return;
    }
    const status = err.statusCode || 500;
    res.status(status).json({ error: "Error", message: err.message, statusCode: status });
  }
});

router.put("/reorder", authenticate, async (req: Request, res: Response) => {
  try {
    const { orderedIds } = reorderSchema.parse(req.body);
    const page = await getUserPage(req.user!.userId);

    const blocks = await prisma.block.findMany({
      where: { page_id: page.id },
      select: { id: true },
    });
    const ownedIds = new Set(blocks.map((b) => b.id));
    const invalid = orderedIds.find((id) => !ownedIds.has(id));
    if (invalid) {
      res.status(403).json({ error: "Forbidden", message: "Block not owned by user", statusCode: 403 });
      return;
    }

    await prisma.$transaction(
      orderedIds.map((id, i) => prisma.block.update({ where: { id }, data: { position: i } }))
    );

    const updated = await prisma.block.findMany({
      where: { page_id: page.id },
      orderBy: { position: "asc" },
    });
    res.json({ blocks: updated });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: "Validation Error", message: err.errors[0].message, statusCode: 400 });
      return;
    }
    const status = err.statusCode || 500;
    res.status(status).json({ error: "Error", message: err.message, statusCode: status });
  }
});

router.put("/:id", authenticate, async (req: Request<{ id: string }>, res: Response) => {
  try {
    const data = updateSchema.parse(req.body);
    const page = await getUserPage(req.user!.userId);

    const block = await prisma.block.findUnique({ where: { id: req.params.id } });
    if (!block || block.page_id !== page.id) {
      res.status(404).json({ error: "Not Found", message: "Block not found", statusCode: 404 });
      return;
    }

    const updateData: Prisma.BlockUpdateInput = {};
    if (data.type !== undefined) updateData.type = data.type;
    if (data.title !== undefined) updateData.title = data.title;
    if (data.url !== undefined) updateData.url = data.url;
    if (data.icon !== undefined) updateData.icon = data.icon;
    if (data.is_visible !== undefined) updateData.is_visible = data.is_visible;
    if (data.settings !== undefined) updateData.settings = data.settings as Prisma.InputJsonValue;

    const updated = await prisma.block.update({
      where: { id: req.params.id },
      data: updateData,
    });
    res.json({ block: updated });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: "Validation Error", message: err.errors[0].message, statusCode: 400 });
      return;
    }
    const status = err.statusCode || 500;
    res.status(status).json({ error: "Error", message: err.message, statusCode: status });
  }
});

router.delete("/:id", authenticate, async (req: Request<{ id: string }>, res: Response) => {
  try {
    const page = await getUserPage(req.user!.userId);

    const block = await prisma.block.findUnique({ where: { id: req.params.id } });
    if (!block || block.page_id !== page.id) {
      res.status(404).json({ error: "Not Found", message: "Block not found", statusCode: 404 });
      return;
    }

    await prisma.block.delete({ where: { id: req.params.id } });

    const remaining = await prisma.block.findMany({
      where: { page_id: page.id },
      orderBy: { position: "asc" },
    });
    if (remaining.length > 0) {
      await prisma.$transaction(
        remaining.map((b, i) => prisma.block.update({ where: { id: b.id }, data: { position: i } }))
      );
    }

    res.json({ message: "Block deleted" });
  } catch (err: any) {
    const status = err.statusCode || 500;
    res.status(status).json({ error: "Error", message: err.message, statusCode: status });
  }
});

export default router;
