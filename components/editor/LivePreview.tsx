"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Page, Block } from "@/types";

function BlockButton({
  block,
  theme,
}: {
  block: Block;
  theme: Page["theme"];
}) {
  const radius = theme.borderRadius ?? "12px";
  const btnColor = theme.buttonColor ?? "#3B82F6";
  const btnText = theme.buttonTextColor ?? "#FFFFFF";
  const style = theme.buttonStyle ?? "fill";

  const baseStyles: React.CSSProperties = {
    borderRadius: radius,
    fontFamily: theme.fontFamily ?? "Inter",
    padding: "12px 16px",
    width: "100%",
    textAlign: "center" as const,
    fontSize: "14px",
    fontWeight: 500,
    transition: "transform 0.15s, opacity 0.15s",
    cursor: "pointer",
    display: "block",
    textDecoration: "none",
  };

  switch (style) {
    case "outline":
      return (
        <div
          style={{
            ...baseStyles,
            border: `2px solid ${btnColor === "transparent" ? (theme.textColor ?? "#FAFAFA") : btnColor}`,
            backgroundColor: "transparent",
            color: theme.textColor ?? "#FAFAFA",
          }}
        >
          {block.title || "Untitled"}
        </div>
      );
    case "glass":
      return (
        <div
          style={{
            ...baseStyles,
            backgroundColor: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: btnText,
          }}
        >
          {block.title || "Untitled"}
        </div>
      );
    case "brutal":
      return (
        <div
          style={{
            ...baseStyles,
            backgroundColor: btnColor,
            color: btnText,
            border: `3px solid ${theme.textColor ?? "#000000"}`,
            boxShadow: `4px 4px 0 ${theme.textColor ?? "#000000"}`,
            borderRadius: "0px",
          }}
        >
          {block.title || "Untitled"}
        </div>
      );
    case "shadow":
      return (
        <div
          style={{
            ...baseStyles,
            backgroundColor: btnColor,
            color: btnText,
            boxShadow: `0 4px 14px ${btnColor}44`,
          }}
        >
          {block.title || "Untitled"}
        </div>
      );
    default: // fill
      return (
        <div
          style={{
            ...baseStyles,
            background: btnColor,
            color: btnText,
          }}
        >
          {block.title || "Untitled"}
        </div>
      );
  }
}

export function LivePreview({
  page,
  blocks,
}: {
  page: Page;
  blocks: Block[];
}) {
  const theme = page.theme;
  const spacing = parseInt(theme.spacing ?? "12");

  return (
    <div className="sticky top-4">
      {/* Phone frame */}
      <div
        className="relative overflow-hidden border-[6px] border-[#27272A] bg-black"
        style={{
          width: 375,
          aspectRatio: "9/19.5",
          borderRadius: "2.5rem",
        }}
      >
        {/* Notch */}
        <div className="absolute left-1/2 top-2 z-10 h-6 w-28 -translate-x-1/2 rounded-full bg-black" />

        {/* Content scaled down */}
        <motion.div
          className="h-full w-full origin-top overflow-y-auto"
          style={{
            background: theme.backgroundGradient ?? theme.backgroundColor ?? "#09090B",
            transform: "scale(0.75)",
            transformOrigin: "top center",
            height: "133.33%",
            width: "133.33%",
            marginLeft: "-16.67%",
          }}
          initial={false}
          animate={{ backgroundColor: theme.backgroundColor }}
          transition={{ duration: 0.3 }}
        >
          <div
            className="flex flex-col items-center px-6 pt-16 pb-8"
            style={{ fontFamily: theme.fontFamily ?? "Inter" }}
          >
            {/* Avatar placeholder */}
            <div
              className="mb-4 h-20 w-20 rounded-full"
              style={{
                backgroundColor: theme.cardBackground ?? "#27272A",
                border: `2px solid ${theme.cardBorder ?? "#3B82F6"}`,
              }}
            />

            {/* Title */}
            {page.title && (
              <h2
                className="mb-1 text-xl font-bold"
                style={{ color: theme.textColor ?? "#FAFAFA" }}
              >
                {page.title}
              </h2>
            )}

            {/* Bio */}
            {page.bio && (
              <p
                className="mb-6 text-center text-sm opacity-70"
                style={{ color: theme.textColor ?? "#FAFAFA" }}
              >
                {page.bio}
              </p>
            )}

            {/* Blocks */}
            <div
              className="flex w-full flex-col"
              style={{ gap: `${spacing}px` }}
            >
              {blocks.map((block) => {
                if (block.type === "header") {
                  return (
                    <div
                      key={block.id}
                      className="py-2 text-center"
                    >
                      <span
                        className="text-xs font-semibold uppercase tracking-widest opacity-50"
                        style={{ color: theme.textColor ?? "#FAFAFA" }}
                      >
                        {block.title || "Header"}
                      </span>
                    </div>
                  );
                }

                if (block.type === "about") {
                  return (
                    <div
                      key={block.id}
                      className="rounded-lg p-4 text-center text-sm"
                      style={{
                        backgroundColor: theme.cardBackground ?? "rgba(255,255,255,0.05)",
                        border: `1px solid ${theme.cardBorder ?? "#27272A"}`,
                        borderRadius: theme.borderRadius ?? "12px",
                        color: theme.textColor ?? "#FAFAFA",
                      }}
                    >
                      {(block.settings?.bio as string) || "About me..."}
                    </div>
                  );
                }

                if (block.type === "embed" && block.url) {
                  return (
                    <div
                      key={block.id}
                      className="overflow-hidden"
                      style={{ borderRadius: theme.borderRadius ?? "12px" }}
                    >
                      <div className="aspect-video w-full bg-black/30 flex items-center justify-center">
                        <span
                          className="text-xs opacity-40"
                          style={{ color: theme.textColor ?? "#FAFAFA" }}
                        >
                          Embed preview
                        </span>
                      </div>
                    </div>
                  );
                }

                if (block.type === "social") {
                  const links = (block.settings?.links as Array<{ platform: string; url: string }>) || [];
                  const SOCIAL_ICONS: Record<string, string> = {
                    github: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z",
                    twitter: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
                    linkedin: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
                    instagram: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z",
                    youtube: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z",
                    tiktok: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
                    spotify: "M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z",
                  };
                  return (
                    <div key={block.id} className="flex items-center justify-center gap-4 py-2">
                      {links.length === 0 && (
                        <span className="text-xs opacity-40" style={{ color: theme.textColor ?? "#FAFAFA" }}>
                          No social links
                        </span>
                      )}
                      {links.map((link, i) => (
                        <div key={i} className="opacity-70">
                          <svg viewBox="0 0 24 24" fill={theme.textColor ?? "#FAFAFA"} style={{ width: 20, height: 20 }}>
                            <path d={SOCIAL_ICONS[link.platform.toLowerCase()] || ""} />
                          </svg>
                        </div>
                      ))}
                    </div>
                  );
                }

                return (
                  <BlockButton
                    key={block.id}
                    block={block}
                    theme={theme}
                  />
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
