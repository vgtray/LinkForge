import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";


function signAccessToken(userId: string, username: string): string {
  return jwt.sign({ userId, username }, process.env.JWT_SECRET!, { expiresIn: "15m" });
}

function signRefreshToken(userId: string): string {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });
}

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function register(email: string, password: string, username: string) {
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });
  if (existing) {
    const field = existing.email === email ? "email" : "username";
    throw Object.assign(new Error(`This ${field} is already taken`), { statusCode: 409 });
  }

  const password_hash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      password_hash,
      username,
      page: { create: {} },
    },
    include: { page: true },
  });

  const access_token = signAccessToken(user.id, user.username);
  const refresh_token = signRefreshToken(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data: { refresh_token: hashToken(refresh_token) },
  });

  const { password_hash: _, refresh_token: __, ...safeUser } = user;
  return { user: safeUser, access_token, refresh_token };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw Object.assign(new Error("Invalid email or password"), { statusCode: 401 });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    throw Object.assign(new Error("Invalid email or password"), { statusCode: 401 });
  }

  const access_token = signAccessToken(user.id, user.username);
  const refresh_token = signRefreshToken(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data: { refresh_token: hashToken(refresh_token) },
  });

  const { password_hash: _, refresh_token: __, ...safeUser } = user;
  return { user: safeUser, access_token, refresh_token };
}

export async function refresh(refreshToken: string) {
  let payload: { userId: string };
  try {
    payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { userId: string };
  } catch {
    throw Object.assign(new Error("Invalid refresh token"), { statusCode: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user || user.refresh_token !== hashToken(refreshToken)) {
    throw Object.assign(new Error("Invalid refresh token"), { statusCode: 401 });
  }

  const access_token = signAccessToken(user.id, user.username);
  const new_refresh_token = signRefreshToken(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data: { refresh_token: hashToken(new_refresh_token) },
  });

  const { password_hash: _, refresh_token: __, ...safeUser } = user;
  return { user: safeUser, access_token, refresh_token: new_refresh_token };
}

export async function logout(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { refresh_token: null },
  });
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw Object.assign(new Error("User not found"), { statusCode: 404 });
  const { password_hash: _, refresh_token: __, ...safeUser } = user;
  return safeUser;
}

export async function updateProfile(userId: string, data: { username?: string; email?: string; avatar_url?: string }) {
  if (data.username || data.email) {
    const existing = await prisma.user.findFirst({
      where: {
        AND: [
          { id: { not: userId } },
          { OR: [
            ...(data.username ? [{ username: data.username }] : []),
            ...(data.email ? [{ email: data.email }] : []),
          ]},
        ],
      },
    });
    if (existing) {
      const field = data.email && existing.email === data.email ? "email" : "username";
      throw Object.assign(new Error(`This ${field} is already taken`), { statusCode: 409 });
    }
  }
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.username && { username: data.username }),
      ...(data.email && { email: data.email }),
      ...(data.avatar_url !== undefined && { avatar_url: data.avatar_url || null }),
    },
  });
  const { password_hash: _, refresh_token: __, ...safeUser } = user;
  return safeUser;
}

export async function updatePassword(userId: string, currentPassword: string, newPassword: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw Object.assign(new Error("User not found"), { statusCode: 404 });
  const valid = await bcrypt.compare(currentPassword, user.password_hash);
  if (!valid) throw Object.assign(new Error("Current password is incorrect"), { statusCode: 400 });
  const password_hash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: userId }, data: { password_hash } });
}

export async function deleteAccount(userId: string) {
  const page = await prisma.page.findUnique({ where: { user_id: userId } });
  if (page) {
    await prisma.analyticsEvent.deleteMany({ where: { page_id: page.id } });
    await prisma.block.deleteMany({ where: { page_id: page.id } });
    await prisma.page.delete({ where: { id: page.id } });
  }
  await prisma.user.delete({ where: { id: userId } });
}
