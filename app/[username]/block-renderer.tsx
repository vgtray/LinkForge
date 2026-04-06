"use client";

import type { Block, ThemeConfig } from "@/types";

const SOCIAL_ICONS: Record<string, string> = {
  github: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z",
  twitter: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  linkedin: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  instagram: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z",
  youtube: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z",
  tiktok: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
  website: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z",
  email: "M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67z M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908z",
  spotify: "M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z",
};

function SocialIcon({ name }: { name: string }) {
  const path = SOCIAL_ICONS[name.toLowerCase()];
  if (!path) return null;
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d={path} />
    </svg>
  );
}

function getEmbedUrl(url: string): { type: "youtube" | "spotify" | null; embedUrl: string } {
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch) {
    return { type: "youtube", embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}` };
  }
  const spotifyMatch = url.match(
    /spotify\.com\/(track|album|playlist|episode)\/([a-zA-Z0-9]+)/
  );
  if (spotifyMatch) {
    return {
      type: "spotify",
      embedUrl: `https://open.spotify.com/embed/${spotifyMatch[1]}/${spotifyMatch[2]}`,
    };
  }
  return { type: null, embedUrl: "" };
}

function trackClick(pageId: string, blockId: string) {
  fetch("/api/analytics/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      page_id: pageId,
      block_id: blockId,
      event_type: "click",
    }),
  }).catch(() => {});
}

const ICON_MAP: Record<string, string> = {
  link: "\u{1F517}",
  globe: "\u{1F310}",
  mail: "\u2709\uFE0F",
  phone: "\u{1F4F1}",
  file: "\u{1F4C4}",
  star: "\u2B50",
  heart: "\u2764\uFE0F",
  bookmark: "\u{1F516}",
  "shopping-cart": "\u{1F6D2}",
  music: "\u{1F3B5}",
  camera: "\u{1F4F7}",
  code: "\u{1F4BB}",
  coffee: "\u2615",
  zap: "\u26A1",
};

function LinkButton({
  block,
  theme,
  pageId,
}: {
  block: Block;
  theme: ThemeConfig;
  pageId: string;
}) {
  const style = theme.buttonStyle || "fill";

  const base =
    "flex w-full items-center justify-center gap-2 px-5 py-3.5 text-sm font-medium transition-transform active:scale-[0.98]";

  const styles: Record<string, string> = {
    fill: "text-[var(--btn-text)]",
    outline: "border-2 bg-transparent",
    glass: "border backdrop-blur-md",
    brutal: "border-3 border-current shadow-[4px_4px_0_currentColor]",
    shadow: "shadow-lg",
  };

  const inlineStyle: React.CSSProperties = {
    borderRadius: style === "brutal" ? "0" : "var(--radius, 12px)",
  };

  if (style === "fill" || style === "shadow") {
    inlineStyle.backgroundColor = "var(--btn)";
    inlineStyle.color = "var(--btn-text)";
  } else if (style === "outline") {
    inlineStyle.borderColor = "var(--btn)";
    inlineStyle.color = "var(--btn)";
  } else if (style === "glass") {
    inlineStyle.backgroundColor = "rgba(255,255,255,0.1)";
    inlineStyle.borderColor = "rgba(255,255,255,0.1)";
    inlineStyle.color = "var(--text)";
  } else if (style === "brutal") {
    inlineStyle.backgroundColor = "var(--btn)";
    inlineStyle.color = "var(--btn-text)";
  }

  const iconEmoji = block.icon ? ICON_MAP[block.icon] : null;

  return (
    <a
      href={block.url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackClick(pageId, block.id)}
      className={`${base} ${styles[style] || ""}`}
      style={inlineStyle}
    >
      {iconEmoji && <span>{iconEmoji}</span>}
      {block.title}
    </a>
  );
}

export function BlockRenderer({
  block,
  theme,
  pageId,
}: {
  block: Block;
  theme: ThemeConfig;
  pageId: string;
}) {
  switch (block.type) {
    case "link":
      return <LinkButton block={block} theme={theme} pageId={pageId} />;

    case "header":
      return (
        <div className="pt-2">
          <h2 className="text-xs font-bold uppercase tracking-wider opacity-60">
            {block.title}
          </h2>
        </div>
      );

    case "social": {
      const links = (block.settings?.links as Array<{ platform: string; url: string }>) || [];
      return (
        <div className="flex items-center justify-center gap-4">
          {links.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-70 transition-opacity hover:opacity-100"
              onClick={() => trackClick(pageId, block.id)}
            >
              <SocialIcon name={link.platform} />
            </a>
          ))}
        </div>
      );
    }

    case "about": {
      const aboutAvatarUrl = block.settings?.avatar_url as string | undefined;
      return (
        <div className="text-sm leading-relaxed opacity-80">
          {aboutAvatarUrl && (
            <div className="mb-3 flex justify-center">
              <img
                src={aboutAvatarUrl}
                alt=""
                className="h-16 w-16 rounded-full object-cover"
                style={{ border: "2px solid var(--card-border, #27272A)" }}
              />
            </div>
          )}
          {(block.settings?.bio as string) || block.title}
        </div>
      );
    }

    case "embed": {
      if (!block.url) return null;
      const { type, embedUrl } = getEmbedUrl(block.url);
      if (!embedUrl) return null;
      return (
        <div className="overflow-hidden" style={{ borderRadius: "var(--radius, 12px)" }}>
          <iframe
            src={embedUrl}
            title={block.title || "Embed"}
            className="w-full border-0"
            style={{ height: type === "spotify" ? "152px" : "200px" }}
            allow="autoplay; encrypted-media"
            allowFullScreen
            loading="lazy"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      );
    }

    default:
      return null;
  }
}
