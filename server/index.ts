import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import path from "path";

import authRoutes from "./routes/auth";
import pageRoutes from "./routes/pages";
import blockRoutes from "./routes/blocks";
import analyticsRoutes from "./routes/analytics";
import utilsRoutes from "./routes/utils";
import { generalLimiter } from "./middleware/rateLimit";

const app = express();
const PORT = process.env.PORT || 4000;

// Global middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:"],
        frameSrc: ["'self'", "https://www.youtube.com", "https://open.spotify.com"],
        connectSrc: ["'self'", process.env.CORS_ORIGIN || "http://localhost:3000"],
      },
    },
  })
);
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(generalLimiter);

// Validate required env vars
const requiredEnvVars = ["JWT_SECRET", "JWT_REFRESH_SECRET", "DATABASE_URL"];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`FATAL: ${envVar} is not set`);
    process.exit(1);
  }
}

// Static uploads
app.use("/uploads", express.static(path.resolve(__dirname, "../public/uploads")));

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", version: "1.0.0" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/pages", pageRoutes);
app.use("/api/blocks", blockRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api", utilsRoutes);

// Global error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack || err.message);
  const status = err.statusCode || 500;
  res.status(status).json({
    error: err.name || "Internal Server Error",
    message: process.env.NODE_ENV === "production" ? "Something went wrong" : err.message,
    statusCode: status,
  });
});

app.listen(PORT, () => {
  console.log(`LinkForge API running on port ${PORT}`);
});

export default app;
