import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripHorizontal } from "lucide-react";
import { ModuleRenderer } from "./ModuleRenderer";
import { type IPageBlock } from "@/models/Page";

interface SortableBlockProps {
  block: IPageBlock;
  isSelected?: boolean;
  onSelect: () => void;
  template?: string;
}

export function SortableBlock({ block, isSelected, onSelect, template }: SortableBlockProps) {
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
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ring-inset ring-2 transition-all my-2 ${
        isSelected ? "ring-blue-500 z-10" : "ring-transparent hover:ring-white/20"
      }`}
    >
      {/* Drag handle */}
      <div
        className="absolute -top-3 left-1/2 -translate-x-1/2 bg-zinc-800 border border-zinc-700 text-zinc-400 p-1 rounded hover:bg-zinc-700 hover:text-white cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-lg"
        {...attributes}
        {...listeners}
      >
        <GripHorizontal size={14} />
      </div>

      {/* Block Type Badge */}
      <div 
        className={`absolute top-2 right-2 px-2 py-1 bg-black/80 backdrop-blur text-white text-[10px] rounded border border-white/10 uppercase tracking-widest font-semibold opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none ${
          isSelected ? "opacity-100 bg-blue-600 border-blue-500" : ""
        }`}
      >
        {block.type}
      </div>

      {/* Visual content (clickable for selection) */}
      <div className="pointer-events-none" onClick={(e) => { e.stopPropagation(); onSelect(); }}>
         <ModuleRenderer blocks={[block]} template={template} />
      </div>

      {/* Click overlay for empty blocks or general bounding */}
      <div 
         className="absolute inset-0 cursor-pointer z-10 opacity-0" 
         onClick={onSelect}
      />
    </div>
  );
}
