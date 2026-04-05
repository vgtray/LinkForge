import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export async function getByUsername(username: string) {
  const page = await prisma.page.findFirst({
    where: { user: { username }, is_published: true },
    include: {
      blocks: {
        where: { is_visible: true },
        orderBy: { position: "asc" },
      },
      user: {
        select: { username: true, avatar_url: true },
      },
    },
  });
  if (!page) throw Object.assign(new Error("Page not found"), { statusCode: 404 });
  return page;
}

export async function getByUserId(userId: string) {
  const page = await prisma.page.findUnique({
    where: { user_id: userId },
    include: {
      blocks: { orderBy: { position: "asc" } },
      user: {
        select: { username: true, avatar_url: true, email: true },
      },
    },
  });
  if (!page) throw Object.assign(new Error("Page not found"), { statusCode: 404 });
  return page;
}

export async function update(
  userId: string,
  data: {
    title?: string;
    bio?: string;
    theme?: Record<string, unknown>;
    seo_title?: string;
    seo_description?: string;
  }
) {
  const updateData: Prisma.PageUpdateInput = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.bio !== undefined) updateData.bio = data.bio;
  if (data.seo_title !== undefined) updateData.seo_title = data.seo_title;
  if (data.seo_description !== undefined) updateData.seo_description = data.seo_description;
  if (data.theme !== undefined) updateData.theme = data.theme as Prisma.InputJsonValue;

  return prisma.page.update({
    where: { user_id: userId },
    data: updateData,
    include: {
      blocks: { orderBy: { position: "asc" } },
      user: { select: { username: true, avatar_url: true } },
    },
  });
}

export async function togglePublish(userId: string) {
  const page = await prisma.page.findUnique({ where: { user_id: userId } });
  if (!page) throw Object.assign(new Error("Page not found"), { statusCode: 404 });

  return prisma.page.update({
    where: { user_id: userId },
    data: { is_published: !page.is_published },
  });
}
