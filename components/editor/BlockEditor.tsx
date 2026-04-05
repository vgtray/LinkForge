"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Block } from "@/types";

const SOCIAL_PLATFORMS = [
  "github",
  "linkedin",
  "twitter",
  "instagram",
  "youtube",
  "tiktok",
  "website",
] as const;

const ICON_OPTIONS = [
  "link",
  "globe",
  "mail",
  "phone",
  "file",
  "star",
  "heart",
  "bookmark",
  "shopping-cart",
  "music",
  "camera",
  "code",
  "coffee",
  "zap",
] as const;

export function BlockEditor({
  block,
  onSave,
  onCancel,
}: {
  block: Block;
  onSave: (data: Partial<Block>) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(block.title ?? "");
  const [url, setUrl] = useState(block.url ?? "");
  const [icon, setIcon] = useState(block.icon ?? "");
  const [platform, setPlatform] = useState(
    (block.settings?.platform as string) ?? "github"
  );
  const [bio, setBio] = useState(
    (block.settings?.bio as string) ?? ""
  );
  const [avatarUrl, setAvatarUrl] = useState(
    (block.settings?.avatar_url as string) ?? ""
  );

  const handleSave = () => {
    const data: Partial<Block> = { title };

    switch (block.type) {
      case "link":
        data.url = url;
        data.icon = icon;
        break;
      case "header":
        break;
      case "social":
        data.url = url;
        data.settings = { ...block.settings, platform };
        break;
      case "about":
        data.settings = { ...block.settings, bio, avatar_url: avatarUrl };
        break;
      case "embed":
        data.url = url;
        break;
    }

    onSave(data);
  };

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden"
    >
      <div className="space-y-3 border-t border-[#27272A] px-4 py-4">
        {/* Title — all types except about use custom title */}
        {block.type !== "about" && (
          <div>
            <label className="mb-1 block text-xs font-medium text-[#A1A1AA]">
              Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Block title"
              className="border-[#27272A] bg-[#09090B] text-[#FAFAFA] text-sm focus-visible:ring-[#3B82F6]"
            />
          </div>
        )}

        {/* Link type */}
        {block.type === "link" && (
          <>
            <div>
              <label className="mb-1 block text-xs font-medium text-[#A1A1AA]">
                URL
              </label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="border-[#27272A] bg-[#09090B] text-[#FAFAFA] text-sm focus-visible:ring-[#3B82F6]"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[#A1A1AA]">
                Icon
              </label>
              <Select value={icon} onValueChange={setIcon}>
                <SelectTrigger className="border-[#27272A] bg-[#09090B] text-[#FAFAFA] text-sm">
                  <SelectValue placeholder="Choose an icon" />
                </SelectTrigger>
                <SelectContent className="border-[#27272A] bg-[#18181B]">
                  {ICON_OPTIONS.map((i) => (
                    <SelectItem
                      key={i}
                      value={i}
                      className="text-[#FAFAFA] focus:bg-[#27272A] focus:text-[#FAFAFA]"
                    >
                      {i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* Social type */}
        {block.type === "social" && (
          <>
            <div>
              <label className="mb-1 block text-xs font-medium text-[#A1A1AA]">
                Platform
              </label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger className="border-[#27272A] bg-[#09090B] text-[#FAFAFA] text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-[#27272A] bg-[#18181B]">
                  {SOCIAL_PLATFORMS.map((p) => (
                    <SelectItem
                      key={p}
                      value={p}
                      className="text-[#FAFAFA] capitalize focus:bg-[#27272A] focus:text-[#FAFAFA]"
                    >
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[#A1A1AA]">
                URL
              </label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="border-[#27272A] bg-[#09090B] text-[#FAFAFA] text-sm focus-visible:ring-[#3B82F6]"
              />
            </div>
          </>
        )}

        {/* About type */}
        {block.type === "about" && (
          <>
            <div>
              <label className="mb-1 block text-xs font-medium text-[#A1A1AA]">
                Bio
              </label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write about yourself..."
                rows={3}
                className="border-[#27272A] bg-[#09090B] text-[#FAFAFA] text-sm resize-none focus-visible:ring-[#3B82F6]"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[#A1A1AA]">
                Avatar URL
              </label>
              <Input
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://..."
                className="border-[#27272A] bg-[#09090B] text-[#FAFAFA] text-sm focus-visible:ring-[#3B82F6]"
              />
            </div>
          </>
        )}

        {/* Embed type */}
        {block.type === "embed" && (
          <div>
            <label className="mb-1 block text-xs font-medium text-[#A1A1AA]">
              Embed URL
            </label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="YouTube or Spotify URL"
              className="border-[#27272A] bg-[#09090B] text-[#FAFAFA] text-sm focus-visible:ring-[#3B82F6]"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button
            size="sm"
            onClick={handleSave}
            className="bg-[#3B82F6] hover:bg-[#2563EB] text-sm"
          >
            Save
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onCancel}
            className="border-[#27272A] text-[#A1A1AA] hover:bg-[#27272A] hover:text-[#FAFAFA] text-sm"
          >
            Cancel
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
