import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too Many Requests", message: "Too many attempts, try again later", statusCode: 429 },
});

export const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too Many Requests", message: "Rate limit exceeded", statusCode: 429 },
});

export const analyticsLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too Many Requests", message: "Rate limit exceeded", statusCode: 429 },
});
