"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { THEME_PRESETS, type ThemeConfig } from "@/types";

const THEME_NAMES: Record<string, string> = {
  "minimal-light": "Minimal Light",
  "minimal-dark": "Minimal Dark",
  glassmorphism: "Glass",
  "gradient-neon": "Neon",
  brutalist: "Brutalist",
};

export function ThemePicker({
  currentTheme,
  onSelectTheme,
}: {
  currentTheme: ThemeConfig;
  onSelectTheme: (theme: ThemeConfig) => void;
}) {
  const isSelected = (preset: ThemeConfig) => {
    return (
      preset.backgroundColor === currentTheme.backgroundColor &&
      preset.buttonColor === currentTheme.buttonColor &&
      preset.buttonStyle === currentTheme.buttonStyle
    );
  };

  return (
    <div className="grid grid-cols-5 gap-3">
      {Object.entries(THEME_PRESETS).map(([key, preset]) => {
        const selected = isSelected(preset);
        return (
          <motion.button
            key={key}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelectTheme(preset)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-colors",
              selected
                ? "border-[#3B82F6] bg-[#3B82F6]/5"
                : "border-[#27272A] bg-[#18181B] hover:border-[#3B82F6]/40"
            )}
          >
            {/* Mini preview */}
            <div
              className="flex h-16 w-full flex-col items-center justify-center gap-1.5 rounded-lg"
              style={{
                background:
                  preset.backgroundGradient ?? preset.backgroundColor,
              }}
            >
              <div
                className="h-2 w-8 rounded-sm"
                style={{
                  background: preset.buttonColor?.startsWith("linear")
                    ? preset.buttonColor
                    : preset.buttonColor,
                  border:
                    preset.buttonStyle === "outline"
                      ? `1.5px solid ${preset.buttonTextColor}`
                      : undefined,
                  opacity: preset.buttonStyle === "glass" ? 0.4 : 1,
                }}
              />
              <div
                className="h-2 w-8 rounded-sm"
                style={{
                  background: preset.buttonColor?.startsWith("linear")
                    ? preset.buttonColor
                    : preset.buttonColor,
                  border:
                    preset.buttonStyle === "outline"
                      ? `1.5px solid ${preset.buttonTextColor}`
                      : undefined,
                  opacity: preset.buttonStyle === "glass" ? 0.4 : 1,
                }}
              />
            </div>
            <span className="text-[10px] font-medium text-[#A1A1AA]">
              {THEME_NAMES[key] ?? key}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
