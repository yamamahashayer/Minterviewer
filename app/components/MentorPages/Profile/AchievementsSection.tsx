"use client";

import { useState } from "react";
import { Award, Plus, X, Pencil, Check, XCircle } from "lucide-react";

type Props = {
  profile: any;
  isEditing: boolean;
  onFieldChange: (key: string, val: any) => void;
  onSave: () => void;
  onCancel: () => void;
};

export default function AchievementsSection({
  profile,
  isEditing,
  onFieldChange,
  onSave,
  onCancel,
}: Props) {
  const data = profile || {};
  const iconClass = "w-5 h-5 text-purple-600";

  const [newAch, setNewAch] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const achievements = data.achievements || [];

  const addAchievement = () => {
    if (!newAch.trim()) return;
    onFieldChange("achievements", [...achievements, newAch.trim()]);
    setNewAch("");
  };

  const removeAchievement = (index: number) => {
    const arr = [...achievements];
    arr.splice(index, 1);
    onFieldChange("achievements", arr);
  };

  const startEdit = (index: number, value: string) => {
    setEditingIndex(index);
    setEditValue(value);
  };

  const saveEdit = (index: number) => {
    const arr = [...achievements];
    arr[index] = editValue;
    onFieldChange("achievements", arr);
    setEditingIndex(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <SectionTitle title="Achievements" icon={<Award className={iconClass} />} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

          {achievements.map((a: string, i: number) => (
            <div key={i} className="p-4 rounded-lg border bg-white/40 flex justify-between items-center">
              
              {editingIndex === i ? (
                <div className="flex-1 flex gap-2">
                  <input
                    className="flex-1 p-2 border rounded-md bg-[var(--card)]"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                  />
                  <Check className="text-green-600 cursor-pointer" onClick={() => saveEdit(i)} />
                  <XCircle className="text-red-500 cursor-pointer" onClick={() => setEditingIndex(null)} />
                </div>
              ) : (
                <>
                  <p className="font-medium">{a}</p>

                  {isEditing && (
                    <div className="flex gap-2">
                      <Pencil
                        className="w-4 h-4 text-purple-600 cursor-pointer"
                        onClick={() => startEdit(i, a)}
                      />
                      <X
                        className="w-4 h-4 text-red-500 cursor-pointer"
                        onClick={() => removeAchievement(i)}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {/* Add new Achievement */}
        {isEditing && (
          <div className="flex gap-2 mt-4">
            <input
              className="flex-1 p-2 border rounded-md bg-[var(--card)]"
              placeholder="Add new achievement..."
              value={newAch}
              onChange={(e) => setNewAch(e.target.value)}
            />
            <button className="px-3 py-2 bg-purple-600 text-white rounded-md flex items-center gap-1"
              onClick={addAchievement}
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
        )}

        {isEditing && (
          <div className="flex gap-3 mt-4">
            <button
              onClick={onSave}
              className="px-4 py-2 bg-purple-600 text-white rounded-md"
            >
              Save
            </button>

            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 text-black rounded-md"
            >
              Cancel
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ===== Shared Components (same as before) ===== */

function Card({ children }: any) {
  return (
    <div
      className="p-6 rounded-xl"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ title, icon }: any) {
  return (
    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-[var(--foreground)]">
      {icon}
      {title}
    </h3>
  );
}
