import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Page, Block, ThemeConfig } from "@/types";
import Image from "next/image";
import { ViewTracker } from "./view-tracker";
import { BlockRenderer } from "./block-renderer";

interface Props {
  params: Promise<{ username: string }>;
}

async function getPage(username: string): Promise<Page | null> {
  try {
    const apiBase = process.env.API_INTERNAL_URL || "http://api:4000";
    const res = await fetch(`${apiBase}/api/pages/${username}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.page ?? null;
  } catch (err) {
    console.error("[getPage] Failed to fetch page:", err);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const page = await getPage(username);
  if (!page) return { title: "Not Found" };

  const title = page.seo_title || page.title || username;
  const description = page.seo_description || page.bio || "";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/${username}`,
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function UserPage({ params }: Props) {
  const { username } = await params;
  const page = await getPage(username);

  if (!page || !page.is_published) {
    notFound();
  }

  const theme = (typeof page.theme === "string" ? JSON.parse(page.theme) : page.theme) || {};
  const blocks = (page.blocks || [])
    .filter((b) => b.is_visible)
    .sort((a, b) => a.position - b.position);

  const initials = (page.title || username)
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="flex min-h-screen justify-center"
      style={
        {
          "--bg": theme.backgroundColor || "#0A0A0A",
          "--text": theme.textColor || "#FAFAFA",
          "--btn": theme.buttonColor || "#FAFAFA",
          "--btn-text": theme.buttonTextColor || "#0A0A0A",
          "--radius": theme.borderRadius || "12px",
          "--spacing": theme.spacing || "12px",
          backgroundColor: theme.backgroundGradient ? undefined : "var(--bg)",
          backgroundImage: theme.backgroundGradient || undefined,
          color: "var(--text)",
        } as React.CSSProperties
      }
    >
      <div className="stagger-fade-in flex w-full max-w-[480px] flex-col items-center px-5 py-12">
        {/* Avatar */}
        <div className="mb-4">
          {page.user?.avatar_url ? (
            <Image
              src={page.user.avatar_url}
              alt={username}
              width={80}
              height={80}
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full text-lg font-bold"
              style={{
                backgroundColor: "var(--btn)",
                color: "var(--btn-text)",
              }}
            >
              {initials}
            </div>
          )}
        </div>

        {/* Title & Bio */}
        {page.title && (
          <h1 className="mb-1 text-xl font-bold">{page.title}</h1>
        )}
        {page.bio && (
          <p className="mb-8 text-center text-sm opacity-80">{page.bio}</p>
        )}

        {/* Blocks */}
        <div
          className="flex w-full flex-col"
          style={{ gap: "var(--spacing, 12px)" }}
        >
          {blocks.map((block) => (
            <BlockRenderer
              key={block.id}
              block={block}
              theme={theme}
              pageId={page.id}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-12">
          <p className="text-xs opacity-40">
            Powered by LinkForge
          </p>
        </div>
      </div>

      <ViewTracker pageId={page.id} />
    </div>
  );
}
