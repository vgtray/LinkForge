import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import QRCode from "qrcode";

const prisma = new PrismaClient();
const router = Router();

const USERNAME_REGEX = /^[a-z0-9_-]{3,30}$/;

router.get("/username/check/:name", async (req: Request<{ name: string }>, res: Response) => {
  try {
    const name = req.params.name;
    if (!USERNAME_REGEX.test(name)) {
      res.json({ available: false, reason: "Invalid format (3-30 chars, lowercase alphanumeric, hyphens, underscores)" });
      return;
    }
    const existing = await prisma.user.findUnique({ where: { username: name } });
    res.json({ available: !existing });
  } catch (err: any) {
    res.status(500).json({ error: "Error", message: err.message, statusCode: 500 });
  }
});

router.get("/qrcode/:username", async (req: Request<{ username: string }>, res: Response) => {
  try {
    const url = `https://linkf.vgtray.fr/${req.params.username}`;
    const buffer = await QRCode.toBuffer(url, {
      type: "png",
      width: 400,
      margin: 2,
      color: { dark: "#000000", light: "#FFFFFF" },
    });
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send(buffer);
  } catch (err: any) {
    res.status(500).json({ error: "Error", message: err.message, statusCode: 500 });
  }
});

export default router;
