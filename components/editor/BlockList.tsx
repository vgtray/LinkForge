"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";
import {
  GripVertical,
  Link as LinkIcon,
  Hash,
  Share2,
  User,
  Play,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { BlockEditor } from "@/components/editor/BlockEditor";
import { cn, getApiUrl } from "@/lib/utils";
import type { Block, BlockType } from "@/types";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

const BLOCK_ICONS: Record<BlockType, React.ElementType> = {
  link: LinkIcon,
  header: Hash,
  social: Share2,
  about: User,
  embed: Play,
};

const BLOCK_PLACEHOLDERS: Record<BlockType, string> = {
  link: "Untitled Link",
  header: "Untitled Header",
  social: "Social Link",
  about: "About",
  embed: "Embed",
};

function SortableBlock({
  block,
  onUpdate,
  onDelete,
}: {
  block: Block;
  onUpdate: (id: string, data: Partial<Block>) => void;
  onDelete: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const Icon = BLOCK_ICONS[block.type];

  const handleToggleVisibility = () => {
    onUpdate(block.id, { is_visible: !block.is_visible });
  };

  const handleDelete = () => {
    onDelete(block.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
    >
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          "rounded-lg border bg-[#18181B] transition-colors",
          isDragging
            ? "z-50 border-[#3B82F6]/30 bg-[#18181B]/95"
            : "border-[#27272A]"
        )}
      >
        <div className="flex items-center gap-3 px-3 py-3">
          {/* Drag handle */}
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab text-[#52525B] hover:text-[#A1A1AA] active:cursor-grabbing"
          >
            <GripVertical className="h-5 w-5" />
          </button>

          {/* Icon */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#27272A]">
            <Icon className="h-4 w-4 text-[#A1A1AA]" />
          </div>

          {/* Title */}
          <span className="flex-1 truncate text-sm font-medium">
            {block.title || BLOCK_PLACEHOLDERS[block.type]}
          </span>

          {/* Visibility toggle */}
          <Switch
            checked={block.is_visible}
            onCheckedChange={handleToggleVisibility}
            className="data-[state=checked]:bg-[#3B82F6]"
          />

          {/* Edit button */}
          <button
            onClick={() => setEditing(!editing)}
            className="rounded-md p-1.5 text-[#A1A1AA] transition-colors hover:bg-[#27272A] hover:text-[#FAFAFA]"
          >
            <Pencil className="h-4 w-4" />
          </button>

          {/* Delete button */}
          <button
            onClick={handleDelete}
            className="rounded-md p-1.5 text-[#A1A1AA] transition-colors hover:bg-[#27272A] hover:text-[#EF4444]"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Inline editor */}
        <AnimatePresence>
          {editing && (
            <BlockEditor
              block={block}
              onSave={(data) => {
                onUpdate(block.id, data);
                setEditing(false);
              }}
              onCancel={() => setEditing(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function BlockList({
  blocks,
  setBlocks,
}: {
  blocks: Block[];
  setBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = blocks.findIndex((b) => b.id === active.id);
    const newIndex = blocks.findIndex((b) => b.id === over.id);
    const reordered = arrayMove(blocks, oldIndex, newIndex).map((b, i) => ({
      ...b,
      position: i,
    }));
    setBlocks(reordered);

    const token = getToken();
    try {
      await fetch(`${getApiUrl()}/api/blocks/reorder`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          order: reordered.map((b) => b.id),
        }),
      });
    } catch {
      toast.error("Failed to save order");
    }
  };

  const handleUpdateBlock = async (id: string, data: Partial<Block>) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...data } : b))
    );
    const token = getToken();
    try {
      const res = await fetch(`${getApiUrl()}/api/blocks/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
    } catch {
      toast.error("Failed to update block");
    }
  };

  const handleDeleteBlock = async (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    const token = getToken();
    try {
      await fetch(`${getApiUrl()}/api/blocks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      toast.success("Block deleted");
    } catch {
      toast.error("Failed to delete block");
    }
  };

  if (blocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-[#27272A] py-12 text-center">
        <p className="text-sm text-[#A1A1AA]">No blocks yet</p>
        <p className="mt-1 text-xs text-[#52525B]">Add a block to get started</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={blocks.map((b) => b.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {blocks.map((block) => (
              <SortableBlock
                key={block.id}
                block={block}
                onUpdate={handleUpdateBlock}
                onDelete={handleDeleteBlock}
              />
            ))}
          </AnimatePresence>
        </div>
      </SortableContext>
    </DndContext>
  );
}
