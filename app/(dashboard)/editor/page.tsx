"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Link as LinkIcon, Hash, Share2, User, Play } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BlockList } from "@/components/editor/BlockList";
import { ThemePicker } from "@/components/editor/ThemePicker";
import { ColorPicker } from "@/components/editor/ColorPicker";
import { LivePreview } from "@/components/editor/LivePreview";
import { getApiUrl } from "@/lib/utils";
import { getAccessToken } from "@/lib/api";
import type { Page, Block, BlockType, ThemeConfig } from "@/types";

const BLOCK_TYPES: { type: BlockType; label: string; icon: React.ElementType }[] = [
  { type: "link", label: "Link", icon: LinkIcon },
  { type: "header", label: "Header", icon: Hash },
  { type: "social", label: "Social", icon: Share2 },
  { type: "about", label: "About", icon: User },
  { type: "embed", label: "Embed", icon: Play },
];


export default function EditorPage() {
  const [page, setPage] = useState<Page | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load page + blocks
  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    Promise.all([
      fetch(`${getApiUrl()}/api/pages/me`, { headers, credentials: "include" }),
      fetch(`${getApiUrl()}/api/blocks`, { headers, credentials: "include" }),
    ])
      .then(async ([pageRes, blocksRes]) => {
        if (!pageRes.ok || !blocksRes.ok) throw new Error("Failed to load");
        const pageData = await pageRes.json();
        const blocksData = await blocksRes.json();
        setPage(pageData.page ?? pageData);
        setBlocks(
          (blocksData.blocks ?? blocksData).sort(
            (a: Block, b: Block) => a.position - b.position
          )
        );
      })
      .catch(() => toast.error("Failed to load page data"))
      .finally(() => setLoading(false));
  }, []);

  // Auto-save debounce
  const triggerSave = useCallback(
    (updatedPage: Page) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        setSaving(true);
        setSaved(false);
        const token = getAccessToken();
        try {
          const res = await fetch(`${getApiUrl()}/api/pages/me`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              title: updatedPage.title,
              bio: updatedPage.bio,
              theme: updatedPage.theme,
              is_published: updatedPage.is_published,
            }),
          });
          if (!res.ok) throw new Error();
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        } catch {
          toast.error("Failed to save");
        } finally {
          setSaving(false);
        }
      }, 1500);
    },
    []
  );

  const updatePage = useCallback(
    (updates: Partial<Page>) => {
      setPage((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, ...updates };
        triggerSave(updated);
        return updated;
      });
    },
    [triggerSave]
  );

  const updateTheme = useCallback(
    (theme: ThemeConfig) => {
      updatePage({ theme });
    },
    [updatePage]
  );

  const handleTogglePublish = async () => {
    if (!page) return;
    try {
      const res = await fetch(`${getApiUrl()}/api/pages/me/publish`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPage((prev) => prev ? { ...prev, is_published: data.page.is_published } : prev);
      toast.success(data.page.is_published ? "Page published!" : "Page unpublished");
    } catch {
      toast.error("Failed to update publish status");
    }
  };

  const handleAddBlock = async (type: BlockType) => {
    const token = getAccessToken();
    try {
      const res = await fetch(`${getApiUrl()}/api/blocks`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          type,
          title: type === "about" ? "About" : "",
          settings: {},
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      const newBlock = data.block ?? data;
      setBlocks((prev) => [...prev, newBlock]);
      toast.success("Block added");
    } catch {
      toast.error("Failed to add block");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3B82F6] border-t-transparent" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-[#A1A1AA]">
        No page found. Please create one first.
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-8">
      {/* Left panel — Editor */}
      <ScrollArea className="w-[40%] shrink-0 pr-6">
        <div className="space-y-10 pb-16">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Edit your page</h1>
              <p className="mt-1 text-sm text-[#A1A1AA]">
                @{page.user?.username ?? "you"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <AnimatePresence mode="wait">
                {saving && (
                  <motion.span
                    key="saving"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-[#A1A1AA]"
                  >
                    Saving...
                  </motion.span>
                )}
                {saved && (
                  <motion.span
                    key="saved"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-[#22C55E]"
                  >
                    Saved
                  </motion.span>
                )}
              </AnimatePresence>
              <Button
                variant={page.is_published ? "destructive" : "default"}
                size="sm"
                onClick={handleTogglePublish}
                className={
                  page.is_published
                    ? ""
                    : "bg-[#3B82F6] hover:bg-[#2563EB]"
                }
              >
                {page.is_published ? "Unpublish" : "Publish"}
              </Button>
            </div>
          </div>

          {/* Title & Bio */}
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#A1A1AA]">
                Title
              </label>
              <Input
                value={page.title ?? ""}
                onChange={(e) => updatePage({ title: e.target.value })}
                placeholder="Your page title"
                className="border-[#27272A] bg-[#18181B] text-[#FAFAFA] placeholder:text-[#52525B] focus-visible:ring-[#3B82F6]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#A1A1AA]">
                Bio
              </label>
              <Textarea
                value={page.bio ?? ""}
                onChange={(e) => updatePage({ bio: e.target.value })}
                placeholder="A short bio about yourself"
                rows={3}
                className="border-[#27272A] bg-[#18181B] text-[#FAFAFA] placeholder:text-[#52525B] focus-visible:ring-[#3B82F6] resize-none"
              />
            </div>
          </div>

          {/* Blocks */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Blocks</h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#27272A] bg-[#18181B] text-[#FAFAFA] hover:bg-[#27272A]"
                  >
                    <Plus className="mr-1.5 h-4 w-4" />
                    Add Block
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="border-[#27272A] bg-[#18181B]"
                >
                  {BLOCK_TYPES.map(({ type, label, icon: Icon }) => (
                    <DropdownMenuItem
                      key={type}
                      onClick={() => handleAddBlock(type)}
                      className="gap-2 text-[#FAFAFA] focus:bg-[#27272A] focus:text-[#FAFAFA]"
                    >
                      <Icon className="h-4 w-4 text-[#A1A1AA]" />
                      {label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <BlockList blocks={blocks} setBlocks={setBlocks} />
          </div>

          {/* Theme */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Theme</h2>
            <ThemePicker
              currentTheme={page.theme}
              onSelectTheme={updateTheme}
            />
          </div>

          {/* Customize */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Customize</h2>
            <ColorPicker theme={page.theme} onChangeTheme={updateTheme} />
          </div>
        </div>
      </ScrollArea>

      {/* Right panel — Preview */}
      <div className="flex flex-1 items-start justify-center pt-4">
        <LivePreview page={page} blocks={blocks.filter((b) => b.is_visible)} />
      </div>
    </div>
  );
}
