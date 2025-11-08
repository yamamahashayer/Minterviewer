"use client";
import * as React from "react";
import { Plus, Pencil, Trash2, GraduationCap, Building2, Save, X } from "lucide-react";

type BgItem = {
  _id: string;
  entry_type: "work" | "education";
  company_name?: string;
  position?: string;
  school?: string;
  degree?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};

function fmt(d?: string) {
  if (!d) return "";
  try {
    const iso = new Date(d).toISOString();
    return iso.split("T")[0];
  } catch {
    return d || "";
  }
}

/** ===== Inputs that preserve the caret ===== */
function useCaretRestore<T extends HTMLInputElement | HTMLTextAreaElement>(value: string | number | readonly string[] | undefined) {
  const ref = React.useRef<T>(null);
  const selRef = React.useRef<{ start: number | null; end: number | null }>({ start: null, end: null });

  const beforeInput = (e: React.FormEvent<T>) => {
    const el = e.currentTarget as T & { selectionStart: number | null; selectionEnd: number | null };
    selRef.current = { start: el.selectionStart, end: el.selectionEnd };
  };

  const onChangeWrap = <E extends T>(orig?: (e: React.ChangeEvent<E>) => void) =>
    (e: React.ChangeEvent<E>) => {
      const el = e.currentTarget as E & { selectionStart: number | null; selectionEnd: number | null };
      selRef.current = { start: el.selectionStart, end: el.selectionEnd };
      orig?.(e);
    };

  React.useLayoutEffect(() => {
    const el = ref.current as (T & { setSelectionRange?: (s: number, e: number) => void }) | null;
    if (!el) return;
    const { start, end } = selRef.current;
    if (start !== null && end !== null && typeof el.setSelectionRange === "function" && document.activeElement === el) {
      try { el.setSelectionRange(start, end); } catch {}
    }
  }, [value]);

  return { ref, beforeInput, onChangeWrap };
}

function PreserveCaretInput(
  { value, onChange, className = "", ...rest }:
  React.InputHTMLAttributes<HTMLInputElement>
) {
  const { ref, beforeInput, onChangeWrap } = useCaretRestore<HTMLInputElement>(value);
  return (
    <input
      ref={ref}
      value={value ?? ""}
      onInput={beforeInput}
      onChange={onChangeWrap(onChange as any)}
      className={className}
      {...rest}
    />
  );
}

function PreserveCaretTextarea(
  { value, onChange, className = "", ...rest }:
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  const { ref, beforeInput, onChangeWrap } = useCaretRestore<HTMLTextAreaElement>(value);
  return (
    <textarea
      ref={ref}
      value={value ?? ""}
      onInput={beforeInput}
      onChange={onChangeWrap(onChange as any)}
      className={className}
      {...rest}
    />
  );
}
/** ========================================= */

export default function MenteeBackgroundSection({
  menteeId,
  theme = "light",
}: {
  menteeId: string | null;
  theme?: "dark" | "light";
}) {
  const isDark = theme === "dark";
  const inputCls = `w-full rounded-lg px-3 py-2 outline-none border ${
    isDark
      ? "bg-[rgba(0,0,0,0.35)] border-[rgba(94,234,212,0.25)] text-white placeholder:text-white/50"
      : "bg-white border-purple-200"
  }`;
  const [items, setItems] = React.useState<BgItem[]>([]);
  const [loading, setLoading] = React.useState(false);

  const [openAdd, setOpenAdd] = React.useState(false);
  const [addPayload, setAddPayload] = React.useState<BgItem>({
    _id: "",
    entry_type: "work",
    company_name: "",
    position: "",
    school: "",
    degree: "",
    start_date: "",
    end_date: "",
    description: "",
  });

  const [editId, setEditId] = React.useState<string | null>(null);
  const [editPayload, setEditPayload] = React.useState<BgItem | null>(null);
  const [pendingId, setPendingId] = React.useState<string | null>(null);

  const api = (path: string) => `/api/mentees/${encodeURIComponent(menteeId || "")}${path}`;

  async function fetchList() {
    if (!menteeId) return;
    setLoading(true);
    try {
      const r = await fetch(api("/background"), { cache: "no-store" });
      const j = await r.json();
      setItems(Array.isArray(j?.items) ? j.items : []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    if (menteeId) fetchList();
  }, [menteeId]);

  function RowLabel({ children }: { children: React.ReactNode }) {
    return (
      <label className={`block text-xs mb-1 ${isDark ? "text-teal-200" : "text-purple-700"}`}>
        {children}
      </label>
    );
  }

  function Button({
    variant = "primary",
    className = "",
    ...rest
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" }) {
    const base = "px-3 py-1.5 rounded-lg text-sm disabled:opacity-60 disabled:cursor-not-allowed";
    const styles =
      variant === "primary"
        ? isDark
          ? "bg-teal-300 text-[#0b1223] hover:brightness-95"
          : "bg-purple-600 text-white hover:brightness-110"
        : variant === "danger"
        ? isDark
          ? "border border-red-400/50 text-red-300 hover:bg-red-500/10"
          : "border border-red-300 text-red-600 hover:bg-red-50"
        : isDark
        ? "border border-[rgba(94,234,212,0.3)] text-teal-300 hover:bg-[rgba(94,234,212,0.08)]"
        : "border border-purple-200 text-purple-700 hover:bg-purple-50";

    return <button {...rest} className={`${base} ${styles} ${className}`} />;
  }

  // إضافة
  async function addItem() {
    if (!menteeId) return;
    const body: any =
      addPayload.entry_type === "education"
        ? {
            entry_type: "education",
            school: addPayload.school?.trim() || undefined,
            degree: addPayload.degree?.trim() || undefined,
            start_date: addPayload.start_date || undefined,
            end_date: addPayload.end_date || undefined,
            description: addPayload.description?.trim() || undefined,
          }
        : {
            entry_type: "work",
            company_name: addPayload.company_name?.trim() || undefined,
            position: addPayload.position?.trim() || undefined,
            start_date: addPayload.start_date || undefined,
            end_date: addPayload.end_date || undefined,
            description: addPayload.description?.trim() || undefined,
          };

    try {
      const r = await fetch(api("/background"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!r.ok) throw new Error("Add failed");
      setOpenAdd(false);
      setAddPayload({
        _id: "",
        entry_type: "work",
        company_name: "",
        position: "",
        school: "",
        degree: "",
        start_date: "",
        end_date: "",
        description: "",
      });
      await fetchList();
    } catch {
      alert("Failed to add, please try again.");
    }
  }

  // تعديل
  async function saveEdit(id: string) {
    if (!menteeId || !editPayload) return;
    setPendingId(id);
    try {
      const body: Record<string, any> = {};
      (["entry_type","company_name","position","school","degree","start_date","end_date","description"] as const).forEach((k) => {
        const v = (editPayload as any)[k];
        if (v !== "" && v !== undefined) body[k] = v;
      });

      const r = await fetch(api(`/background/${id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!r.ok) throw new Error("Update failed");
      setEditId(null);
      setEditPayload(null);
      await fetchList();
    } catch {
      alert("Failed to update, please try again.");
    } finally {
      setPendingId(null);
    }
  }

  // حذف
  async function removeItem(id: string) {
    if (!menteeId) return;
    if (!confirm("Delete this background item?")) return;
    setPendingId(id);
    try {
      const r = await fetch(api(`/background/${id}`), { method: "DELETE" });
      if (!r.ok) throw new Error("Delete failed");
      await fetchList();
    } catch {
      alert("Failed to delete, please try again.");
    } finally {
      setPendingId(null);
    }
  }

  const CardCls = `${
    isDark
      ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]"
      : "bg-white shadow-lg"
  } border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm`;

  return (
    <div className={CardCls}>
      <div className="mb-6 flex items-center justify-between">
        <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} flex items-center gap-2 font-semibold`}>
          <Building2 className={isDark ? "text-teal-300" : "text-purple-600"} size={20} />
          Professional Background
        </h3>
        <Button variant="ghost" onClick={() => setOpenAdd((v) => !v)}>
          <Plus size={16} className="inline -mt-0.5 mr-1" />
          {openAdd ? "Close" : "Add"}
        </Button>
      </div>

      {/* Add Form */}
      {openAdd && (
        <div
          className={`mb-6 rounded-xl p-4 border ${
            isDark ? "border-[rgba(94,234,212,0.2)] bg-[rgba(255,255,255,0.04)]" : "border-purple-100 bg-purple-50/50"
          }`}
        >
          <div className="mb-3">
            <RowLabel>Type</RowLabel>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="entry_type"
                  checked={addPayload.entry_type === "work"}
                  onChange={() => setAddPayload((p) => ({ ...p, entry_type: "work" }))}
                />
                Work
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="entry_type"
                  checked={addPayload.entry_type === "education"}
                  onChange={() => setAddPayload((p) => ({ ...p, entry_type: "education" }))}
                />
                Education
              </label>
            </div>
          </div>

          {addPayload.entry_type === "education" ? (
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <RowLabel>School</RowLabel>
                <PreserveCaretInput
                  placeholder="AAUP"
                  value={addPayload.school}
                  onChange={(e) => setAddPayload((p) => ({ ...p, school: e.target.value }))}
                  className={inputCls}
                />
              </div>
              <div>
                <RowLabel>Degree</RowLabel>
                <PreserveCaretInput
                  placeholder="B.Sc. Computer Engineering"
                  value={addPayload.degree}
                  onChange={(e) => setAddPayload((p) => ({ ...p, degree: e.target.value }))}
                  className={inputCls}
                />
              </div>
              <div>
                <RowLabel>Start date</RowLabel>
                <PreserveCaretInput
                  type="date"
                  value={addPayload.start_date}
                  onChange={(e) => setAddPayload((p) => ({ ...p, start_date: e.target.value }))}
                  className={inputCls}
                />
              </div>
              <div>
                <RowLabel>End date</RowLabel>
                <PreserveCaretInput
                  type="date"
                  value={addPayload.end_date}
                  onChange={(e) => setAddPayload((p) => ({ ...p, end_date: e.target.value }))}
                  className={inputCls}
                />
              </div>
              <div className="md:col-span-2">
                <RowLabel>Description</RowLabel>
                <PreserveCaretTextarea
                  rows={3}
                  placeholder="Notes / achievements"
                  value={addPayload.description}
                  onChange={(e) => setAddPayload((p) => ({ ...p, description: e.target.value }))}
                  className={inputCls}
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setOpenAdd(false)}>
                  <X size={16} className="inline -mt-0.5 mr-1" />
                  Cancel
                </Button>
                <Button onClick={addItem}>
                  <Save size={16} className="inline -mt-0.5 mr-1" />
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <RowLabel>Company</RowLabel>
                <PreserveCaretInput
                  placeholder="Minterviewer"
                  value={addPayload.company_name}
                  onChange={(e) => setAddPayload((p) => ({ ...p, company_name: e.target.value }))}
                  className={inputCls}
                />
              </div>
              <div>
                <RowLabel>Position</RowLabel>
                <PreserveCaretInput
                  placeholder="Software Trainee"
                  value={addPayload.position}
                  onChange={(e) => setAddPayload((p) => ({ ...p, position: e.target.value }))}
                  className={inputCls}
                />
              </div>
              <div>
                <RowLabel>Start date</RowLabel>
                <PreserveCaretInput
                  type="date"
                  value={addPayload.start_date}
                  onChange={(e) => setAddPayload((p) => ({ ...p, start_date: e.target.value }))}
                  className={inputCls}
                />
              </div>
              <div>
                <RowLabel>End date</RowLabel>
                <PreserveCaretInput
                  type="date"
                  value={addPayload.end_date}
                  onChange={(e) => setAddPayload((p) => ({ ...p, end_date: e.target.value }))}
                  className={inputCls}
                />
              </div>
              <div className="md:col-span-2">
                <RowLabel>Description</RowLabel>
                <PreserveCaretTextarea
                  rows={3}
                  placeholder="What did you do?"
                  value={addPayload.description}
                  onChange={(e) => setAddPayload((p) => ({ ...p, description: e.target.value }))}
                  className={inputCls}
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setOpenAdd(false)}>
                  <X size={16} className="inline -mt-0.5 mr-1" />
                  Cancel
                </Button>
                <Button onClick={addItem}>
                  <Save size={16} className="inline -mt-0.5 mr-1" />
                  Save
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className={`${isDark ? "text-[#9bb0b5]" : "text-[#6b21a8]"} text-sm`}>Loading…</div>
      ) : items.length === 0 ? (
        <div className={`${isDark ? "text-[#9bb0b5]" : "text-[#6b21a8]"} text-sm opacity-80`}>
          No background yet — add your first entry.
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((it) =>
            editId === it._id ? (
              // EDIT ROW
              <div
                key={`edit-${it._id}`}
                className={`rounded-xl p-4 border ${
                  isDark ? "border-[rgba(94,234,212,0.2)] bg-[rgba(255,255,255,0.04)]" : "border-purple-100 bg-purple-50/50"
                }`}
              >
                <div className="mb-3">
                  <RowLabel>Type</RowLabel>
                  <div className="flex gap-3">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name={`t-${it._id}`}
                        checked={editPayload?.entry_type === "work"}
                        onChange={() =>
                          setEditPayload((p) => (p ? { ...p, entry_type: "work", school: "", degree: "" } : p))
                        }
                      />
                      Work
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name={`t-${it._id}`}
                        checked={editPayload?.entry_type === "education"}
                        onChange={() =>
                          setEditPayload((p) => (p ? { ...p, entry_type: "education", company_name: "", position: "" } : p))
                        }
                      />
                      Education
                    </label>
                  </div>
                </div>

                {editPayload?.entry_type === "education" ? (
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <RowLabel>School</RowLabel>
                      <PreserveCaretInput
                        value={editPayload.school || ""}
                        onChange={(e) => setEditPayload((p) => (p ? { ...p, school: e.target.value } : p))}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <RowLabel>Degree</RowLabel>
                      <PreserveCaretInput
                        value={editPayload.degree || ""}
                        onChange={(e) => setEditPayload((p) => (p ? { ...p, degree: e.target.value } : p))}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <RowLabel>Start date</RowLabel>
                      <PreserveCaretInput
                        type="date"
                        value={editPayload.start_date || ""}
                        onChange={(e) => setEditPayload((p) => (p ? { ...p, start_date: e.target.value } : p))}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <RowLabel>End date</RowLabel>
                      <PreserveCaretInput
                        type="date"
                        value={editPayload.end_date || ""}
                        onChange={(e) => setEditPayload((p) => (p ? { ...p, end_date: e.target.value } : p))}
                        className={inputCls}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <RowLabel>Description</RowLabel>
                      <PreserveCaretTextarea
                        rows={3}
                        value={editPayload.description || ""}
                        onChange={(e) => setEditPayload((p) => (p ? { ...p, description: e.target.value } : p))}
                        className={inputCls}
                      />
                    </div>
                    <div className="md:col-span-2 flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setEditId(null);
                          setEditPayload(null);
                        }}
                        disabled={pendingId === it._id}
                      >
                        <X size={16} className="inline -mt-0.5 mr-1" />
                        Cancel
                      </Button>
                      <Button onClick={() => saveEdit(it._id)} disabled={pendingId === it._id}>
                        <Save size={16} className="inline -mt-0.5 mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <RowLabel>Company</RowLabel>
                      <PreserveCaretInput
                        value={editPayload?.company_name || ""}
                        onChange={(e) => setEditPayload((p) => (p ? { ...p, company_name: e.target.value } : p))}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <RowLabel>Position</RowLabel>
                      <PreserveCaretInput
                        value={editPayload?.position || ""}
                        onChange={(e) => setEditPayload((p) => (p ? { ...p, position: e.target.value } : p))}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <RowLabel>Start date</RowLabel>
                      <PreserveCaretInput
                        type="date"
                        value={editPayload?.start_date || ""}
                        onChange={(e) => setEditPayload((p) => (p ? { ...p, start_date: e.target.value } : p))}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <RowLabel>End date</RowLabel>
                      <PreserveCaretInput
                        type="date"
                        value={editPayload?.end_date || ""}
                        onChange={(e) => setEditPayload((p) => (p ? { ...p, end_date: e.target.value } : p))}
                        className={inputCls}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <RowLabel>Description</RowLabel>
                      <PreserveCaretTextarea
                        rows={3}
                        value={editPayload?.description || ""}
                        onChange={(e) => setEditPayload((p) => (p ? { ...p, description: e.target.value } : p))}
                        className={inputCls}
                      />
                    </div>
                    <div className="md:col-span-2 flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setEditId(null);
                          setEditPayload(null);
                        }}
                        disabled={pendingId === it._id}
                      >
                        <X size={16} className="inline -mt-0.5 mr-1" />
                        Cancel
                      </Button>
                      <Button onClick={() => saveEdit(it._id)} disabled={pendingId === it._id}>
                        <Save size={16} className="inline -mt-0.5 mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // VIEW ROW
              <div
                key={it._id}
                className={`rounded-xl p-4 border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-purple-100"}`}
              >
                <div className="flex justify-between">
                  <div className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} font-semibold`}>
                    {it.entry_type === "education" ? (
                      <span className="inline-flex items-center gap-2">
                        <GraduationCap size={16} className={isDark ? "text-teal-300" : "text-purple-600"} />
                        {it.degree || "—"}{it.school ? ` — ${it.school}` : ""}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        <Building2 size={16} className={isDark ? "text-teal-300" : "text-purple-600"} />
                        {it.position || "—"}{it.company_name ? ` — ${it.company_name}` : ""}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`${isDark ? "text-[#9bb0b5]" : "text-[#6b21a8]"} text-sm`}>
                      {fmt(it.start_date)}{it.end_date ? ` — ${fmt(it.end_date)}` : " — Present"}
                    </span>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setEditId(it._id);
                        setEditPayload({
                          _id: it._id,
                          entry_type: it.entry_type,
                          company_name: it.company_name ?? "",
                          position: it.position ?? "",
                          school: it.school ?? "",
                          degree: it.degree ?? "",
                          start_date: fmt(it.start_date),
                          end_date: fmt(it.end_date),
                          description: it.description ?? "",
                          createdAt: it.createdAt,
                          updatedAt: it.updatedAt,
                        });
                      }}
                      disabled={pendingId === it._id}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button variant="danger" onClick={() => removeItem(it._id)} disabled={pendingId === it._id}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
                {it.description && (
                  <p className={`${isDark ? "text-[#9bb0b5]" : "text-[#6b21a8]"} mt-1 text-sm`}>{it.description}</p>
                )}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
