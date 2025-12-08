"use client";

import { Plus } from "lucide-react";

export default function JobCreateButton({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition"
    >
      <Plus size={18} />
      Create Job
    </button>
  );
}
