import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing demo data
  const existingUser = await prisma.user.findUnique({
    where: { email: "demo@linkforge.io" },
  });
  if (existingUser) {
    await prisma.user.delete({ where: { id: existingUser.id } });
    console.log("Cleaned existing demo user.");
  }

  // Create demo user
  const passwordHash = await bcrypt.hash("password123", 10);
  const user = await prisma.user.create({
    data: {
      email: "demo@linkforge.io",
      password_hash: passwordHash,
      username: "demo",
    },
  });
  console.log(`Created user: ${user.email} (${user.id})`);

  // Create page with gradient-neon theme (inline from THEME_PRESETS)
  const page = await prisma.page.create({
    data: {
      user_id: user.id,
      title: "Alex Chen",
      bio: "Full-stack developer & open source contributor",
      is_published: true,
      theme: {
        backgroundColor: "#0A0A0A",
        textColor: "#FAFAFA",
        buttonColor: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
        buttonTextColor: "#FFFFFF",
        buttonHoverColor: "linear-gradient(135deg, #2563EB, #7C3AED)",
        borderRadius: "12px",
        fontFamily: "Inter",
        buttonStyle: "fill",
        cardBackground: "#18181B",
        cardBorder: "#27272A",
        spacing: "12px",
      },
    },
  });
  console.log(`Created page: ${page.title} (${page.id})`);

  // Create 6 blocks
  const blocks = await Promise.all([
    prisma.block.create({
      data: {
        page_id: page.id,
        type: "header",
        title: "My Links",
        position: 0,
      },
    }),
    prisma.block.create({
      data: {
        page_id: page.id,
        type: "link",
        title: "Portfolio",
        url: "https://alexchen.dev",
        position: 1,
      },
    }),
    prisma.block.create({
      data: {
        page_id: page.id,
        type: "link",
        title: "Blog",
        url: "https://blog.alexchen.dev",
        position: 2,
      },
    }),
    prisma.block.create({
      data: {
        page_id: page.id,
        type: "social",
        title: "GitHub",
        url: "https://github.com/alexchen",
        icon: "github",
        position: 3,
      },
    }),
    prisma.block.create({
      data: {
        page_id: page.id,
        type: "social",
        title: "Twitter",
        url: "https://twitter.com/alexchen",
        icon: "twitter",
        position: 4,
      },
    }),
    prisma.block.create({
      data: {
        page_id: page.id,
        type: "about",
        title: "About Me",
        position: 5,
        settings: {
          bio: "Building cool things on the web. Previously at Stripe, now indie.",
        },
      },
    }),
  ]);
  console.log(`Created ${blocks.length} blocks.`);

  // Create fake analytics events over the last 7 days
  const now = new Date();
  const clickableBlockIds = blocks
    .filter((b) => b.type === "link" || b.type === "social")
    .map((b) => b.id);

  const events: Array<{
    page_id: string;
    block_id: string | null;
    event_type: "view" | "click";
    referrer: string | null;
    ip_hash: string;
    user_agent: string;
    created_at: Date;
  }> = [];

  // 10 page views spread over 7 days
  for (let i = 0; i < 10; i++) {
    const daysAgo = Math.floor(Math.random() * 7);
    const hoursAgo = Math.floor(Math.random() * 24);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    date.setHours(date.getHours() - hoursAgo);

    events.push({
      page_id: page.id,
      block_id: null,
      event_type: "view",
      referrer: ["https://google.com", "https://twitter.com", null][
        Math.floor(Math.random() * 3)
      ],
      ip_hash: `hash_${i}`,
      user_agent: "Mozilla/5.0 (seed-data)",
      created_at: date,
    });
  }

  // 5 clicks on random clickable blocks
  for (let i = 0; i < 5; i++) {
    const daysAgo = Math.floor(Math.random() * 7);
    const hoursAgo = Math.floor(Math.random() * 24);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    date.setHours(date.getHours() - hoursAgo);

    events.push({
      page_id: page.id,
      block_id: clickableBlockIds[Math.floor(Math.random() * clickableBlockIds.length)],
      event_type: "click",
      referrer: null,
      ip_hash: `hash_click_${i}`,
      user_agent: "Mozilla/5.0 (seed-data)",
      created_at: date,
    });
  }

  await prisma.analyticsEvent.createMany({ data: events });
  console.log(`Created ${events.length} analytics events (10 views + 5 clicks).`);

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
