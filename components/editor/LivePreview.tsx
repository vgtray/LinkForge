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
