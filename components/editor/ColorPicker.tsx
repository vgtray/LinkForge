"use client";

import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ThemeConfig } from "@/types";

const FONT_OPTIONS = [
  { value: "Inter", label: "Inter" },
  { value: "Georgia, serif", label: "Serif" },
  { value: "'Courier New', monospace", label: "Monospace" },
];

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-[#A1A1AA]">{label}</label>
      <div className="flex gap-2">
        <div className="relative">
          <input
            type="color"
            value={value || "#000000"}
            onChange={(e) => onChange(e.target.value)}
            className="h-9 w-9 cursor-pointer rounded-md border border-[#27272A] bg-transparent p-0.5"
          />
        </div>
        <Input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="border-[#27272A] bg-[#09090B] text-[#FAFAFA] text-sm font-mono focus-visible:ring-[#3B82F6]"
        />
      </div>
    </div>
  );
}

export function ColorPicker({
  theme,
  onChangeTheme,
}: {
  theme: ThemeConfig;
  onChangeTheme: (theme: ThemeConfig) => void;
}) {
  const update = (key: keyof ThemeConfig, value: string) => {
    onChangeTheme({ ...theme, [key]: value });
  };

  return (
    <div className="space-y-5 rounded-xl border border-[#27272A] bg-[#18181B] p-4">
      <ColorField
        label="Background color"
        value={theme.backgroundColor ?? "#09090B"}
        onChange={(v) => update("backgroundColor", v)}
      />
      <ColorField
        label="Button color"
        value={theme.buttonColor ?? "#3B82F6"}
        onChange={(v) => update("buttonColor", v)}
      />
      <ColorField
        label="Text color"
        value={theme.textColor ?? "#FAFAFA"}
        onChange={(v) => update("textColor", v)}
      />

      {/* Border radius */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-[#A1A1AA]">
            Border radius
          </label>
          <span className="text-xs text-[#52525B]">
            {parseInt(theme.borderRadius ?? "12")}px
          </span>
        </div>
        <Slider
          min={0}
          max={24}
          step={1}
          value={[parseInt(theme.borderRadius ?? "12")]}
          onValueChange={([v]) => update("borderRadius", `${v}px`)}
          className="[&_[role=slider]]:bg-[#3B82F6] [&_[role=slider]]:border-[#3B82F6]"
        />
      </div>

      {/* Font family */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-[#A1A1AA]">
          Font family
        </label>
        <Select
          value={theme.fontFamily ?? "Inter"}
          onValueChange={(v) => update("fontFamily", v)}
        >
          <SelectTrigger className="border-[#27272A] bg-[#09090B] text-[#FAFAFA] text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border-[#27272A] bg-[#18181B]">
            {FONT_OPTIONS.map((f) => (
              <SelectItem
                key={f.value}
                value={f.value}
                className="text-[#FAFAFA] focus:bg-[#27272A] focus:text-[#FAFAFA]"
              >
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Spacing */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-[#A1A1AA]">
            Spacing
          </label>
          <span className="text-xs text-[#52525B]">
            {parseInt(theme.spacing ?? "12")}px
          </span>
        </div>
        <Slider
          min={8}
          max={24}
          step={1}
          value={[parseInt(theme.spacing ?? "12")]}
          onValueChange={([v]) => update("spacing", `${v}px`)}
          className="[&_[role=slider]]:bg-[#3B82F6] [&_[role=slider]]:border-[#3B82F6]"
        />
      </div>
    </div>
  );
}
