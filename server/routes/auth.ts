import { Router, Request, Response } from "express";
import { z } from "zod";
import * as authService from "../services/auth.service";
import { authenticate } from "../middleware/auth";
import { authLimiter } from "../middleware/rateLimit";

const router = Router();

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/api/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const registerSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  username: z
    .string()
    .regex(/^[a-z0-9_-]{3,30}$/, "Username must be 3-30 chars, lowercase alphanumeric, hyphens, underscores"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

router.post("/register", authLimiter, async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);
    const result = await authService.register(data.email, data.password, data.username);
    res.cookie("refresh_token", result.refresh_token, REFRESH_COOKIE_OPTIONS);
    res.status(201).json({ user: result.user, access_token: result.access_token });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: "Validation Error", message: err.errors[0].message, statusCode: 400 });
      return;
    }
    const status = err.statusCode || 500;
    res.status(status).json({ error: "Error", message: err.message, statusCode: status });
  }
});

router.post("/login", authLimiter, async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);
    const result = await authService.login(data.email, data.password);
    res.cookie("refresh_token", result.refresh_token, REFRESH_COOKIE_OPTIONS);
    res.json({ user: result.user, access_token: result.access_token });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: "Validation Error", message: err.errors[0].message, statusCode: 400 });
      return;
    }
    const status = err.statusCode || 500;
    res.status(status).json({ error: "Error", message: err.message, statusCode: status });
  }
});

router.post("/logout", authenticate, async (req: Request, res: Response) => {
  try {
    await authService.logout(req.user!.userId);
    res.clearCookie("refresh_token", { path: "/api/auth" });
    res.json({ message: "Logged out" });
  } catch (err: any) {
    res.status(500).json({ error: "Error", message: err.message, statusCode: 500 });
  }
});

router.post("/refresh", async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refresh_token;
    if (!token) {
      res.status(401).json({ error: "Unauthorized", message: "No refresh token", statusCode: 401 });
      return;
    }
    const result = await authService.refresh(token);
    res.cookie("refresh_token", result.refresh_token, REFRESH_COOKIE_OPTIONS);
    res.json({ user: result.user, access_token: result.access_token });
  } catch (err: any) {
    const status = err.statusCode || 500;
    res.status(status).json({ error: "Error", message: err.message, statusCode: status });
  }
});

const updateProfileSchema = z.object({
  username: z.string().regex(/^[a-z0-9_-]{3,30}$/).optional(),
  email: z.string().email().optional(),
});

const updatePasswordSchema = z.object({
  current_password: z.string().min(1),
  new_password: z.string().min(8),
});

router.put("/me", authenticate, async (req: Request, res: Response) => {
  try {
    const data = updateProfileSchema.parse(req.body);
    const user = await authService.updateProfile(req.user!.userId, data);
    res.json({ user });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: "Validation Error", message: err.errors[0].message, statusCode: 400 });
      return;
    }
    const status = err.statusCode || 500;
    res.status(status).json({ error: "Error", message: err.message, statusCode: status });
  }
});

router.put("/password", authenticate, async (req: Request, res: Response) => {
  try {
    const data = updatePasswordSchema.parse(req.body);
    await authService.updatePassword(req.user!.userId, data.current_password, data.new_password);
    res.json({ message: "Password updated" });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: "Validation Error", message: err.errors[0].message, statusCode: 400 });
      return;
    }
    const status = err.statusCode || 500;
    res.status(status).json({ error: "Error", message: err.message, statusCode: status });
  }
});

router.delete("/me", authenticate, async (req: Request, res: Response) => {
  try {
    await authService.deleteAccount(req.user!.userId);
    res.clearCookie("refresh_token", { path: "/api/auth" });
    res.json({ message: "Account deleted" });
  } catch (err: any) {
    const status = err.statusCode || 500;
    res.status(status).json({ error: "Error", message: err.message, statusCode: status });
  }
});

router.get("/me", authenticate, async (req: Request, res: Response) => {
  try {
    const user = await authService.getMe(req.user!.userId);
    res.json({ user });
  } catch (err: any) {
    const status = err.statusCode || 500;
    res.status(status).json({ error: "Error", message: err.message, statusCode: status });
  }
});

export default router;
