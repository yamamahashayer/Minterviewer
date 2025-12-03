"use client";
import * as React from "react";
import { Plus, Pencil, Trash2, GraduationCap, Building2, Save, X } from "lucide-react";

/* ============================================================
                        TYPES
============================================================ */
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

/* ============================================================
                        HELPERS
============================================================ */
function fmt(d?: string) {
  if (!d) return "";
  try {
    return new Date(d).toISOString().split("T")[0];
  } catch {
    return d || "";
  }
}

/* ============================================================
                CARET PRESERVE FOR INPUTS
============================================================ */
function useCaretRestore<T extends HTMLInputElement | HTMLTextAreaElement>(value: any) {
  const ref = React.useRef<T>(null);
  const selRef = React.useRef({ start: null as number | null, end: null as number | null });

  const beforeInput = (e: any) => {
    selRef.current = {
      start: e.currentTarget.selectionStart,
      end: e.currentTarget.selectionEnd,
    };
  };

  const onChangeWrap = (orig: any) => (e: any) => {
    selRef.current = {
      start: e.currentTarget.selectionStart,
      end: e.currentTarget.selectionEnd,
    };
    orig?.(e);
  };

  React.useLayoutEffect(() => {
    const el = ref.current as any;
    if (!el) return;

    const { start, end } = selRef.current;
    if (start !== null && end !== null && document.activeElement === el) {
      try {
        el.setSelectionRange(start, end);
      } catch {}
    }
  }, [value]);

  return { ref, beforeInput, onChangeWrap };
}

function PreserveCaretInput(props: any) {
  const { value, onChange, className = "", ...rest } = props;
  const { ref, beforeInput, onChangeWrap } = useCaretRestore<HTMLInputElement>(value);

  return (
    <input
      ref={ref}
      value={value ?? ""}
      onInput={beforeInput}
      onChange={onChangeWrap(onChange)}
      className={className}
      {...rest}
    />
  );
}

function PreserveCaretTextarea(props: any) {
  const { value, onChange, className = "", ...rest } = props;
  const { ref, beforeInput, onChangeWrap } = useCaretRestore<HTMLTextAreaElement>(value);

  return (
    <textarea
      ref={ref}
      value={value ?? ""}
      onInput={beforeInput}
      onChange={onChangeWrap(onChange)}
      className={className}
      {...rest}
    />
  );
}

/* ============================================================
                MAIN COMPONENT
============================================================ */
export default function BackgroundSection({
  ownerId,
  ownerModel,
  theme = "light",
}: {
  ownerId: string | null;
  ownerModel: "Mentee" | "Mentor";
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

  /* ============================================================
                    API HANDLER
  ============================================================ */
  const api = (path: string) => {
    const base =
      ownerModel === "Mentor"
        ? `/api/mentors/${ownerId}`
        : `/api/mentees/${ownerId}`;
    return `${base}${path}`;
  };

  async function fetchList() {
    if (!ownerId) return;
    setLoading(true);

    try {
      const r = await fetch(api("/background"), { cache: "no-store" });
      const j = await r.json();
      setItems(j.items || []);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    fetchList();
  }, [ownerId]);

  /* ============================================================
                    ADD ITEM
  ============================================================ */
  async function addItem() {
    if (!ownerId) return;

    const body: any =
      addPayload.entry_type === "education"
        ? {
            entry_type: "education",
            school: addPayload.school,
            degree: addPayload.degree,
            start_date: addPayload.start_date,
            end_date: addPayload.end_date,
            description: addPayload.description,
          }
        : {
            entry_type: "work",
            company_name: addPayload.company_name,
            position: addPayload.position,
            start_date: addPayload.start_date,
            end_date: addPayload.end_date,
            description: addPayload.description,
          };

    body.ownerModel = ownerModel;
    body.owner = ownerId;

    await fetch(api("/background"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setOpenAdd(false);
    fetchList();
  }

  /* ============================================================
                    UPDATE ITEM
  ============================================================ */
  async function saveEdit(id: string) {
    if (!editPayload) return;

    setPendingId(id);

    const body: any = {};
    [
      "entry_type",
      "company_name",
      "position",
      "school",
      "degree",
      "start_date",
      "end_date",
      "description",
    ].forEach((k) => {
      if ((editPayload as any)[k] !== undefined)
        body[k] = (editPayload as any)[k];
    });

    await fetch(api(`/background/${id}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setEditId(null);
    setEditPayload(null);
    setPendingId(null);
    fetchList();
  }

  /* ============================================================
                    DELETE ITEM
  ============================================================ */
  async function removeItem(id: string) {
    if (!confirm("Delete this item?")) return;
    setPendingId(id);

    await fetch(api(`/background/${id}`), { method: "DELETE" });

    setPendingId(null);
    fetchList();
  }

  /* ============================================================
                    UI
  ============================================================ */
  const CardCls = `${
    isDark
      ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]"
      : "bg-white shadow-lg"
  } border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm`;

  return (
    <div className={CardCls}>
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <h3
          className={`${
            isDark ? "text-white" : "text-[#2e1065]"
          } flex items-center gap-2 font-semibold`}
        >
          <Building2 className={isDark ? "text-teal-300" : "text-purple-600"} />
          Professional Background ({ownerModel})
        </h3>

        <button
          className="px-3 py-1.5 rounded-lg border border-purple-200 hover:bg-purple-50"
          onClick={() => setOpenAdd(!openAdd)}
        >
          <Plus size={16} className="inline-block mr-1" />
          {openAdd ? "Close" : "Add"}
        </button>
      </div>

      {/* ADD FORM */}
      {openAdd && (
        <div className="p-4 mb-6 rounded-xl border bg-purple-50/50 border-purple-100">
          {/* TYPE SELECT */}
          <label className="block text-xs text-purple-700 mb-1">Type</label>
          <div className="flex gap-4 mb-4 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={addPayload.entry_type === "work"}
                onChange={() =>
                  setAddPayload({ ...addPayload, entry_type: "work" })
                }
              />
              Work
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={addPayload.entry_type === "education"}
                onChange={() =>
                  setAddPayload({ ...addPayload, entry_type: "education" })
                }
              />
              Education
            </label>
          </div>

          {/* EDUCATION FORM */}
          {addPayload.entry_type === "education" ? (
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="text-xs">School</label>
                <PreserveCaretInput
                  className={inputCls}
                  value={addPayload.school}
                  onChange={(e: any) =>
                    setAddPayload({ ...addPayload, school: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-xs">Degree</label>
                <PreserveCaretInput
                  className={inputCls}
                  value={addPayload.degree}
                  onChange={(e: any) =>
                    setAddPayload({ ...addPayload, degree: e.target.value })
                  }
                />
              </div>

              {/* DATES */}
              <div>
                <label className="text-xs">Start Date</label>
                <PreserveCaretInput
                  type="date"
                  className={inputCls}
                  value={addPayload.start_date}
                  onChange={(e: any) =>
                    setAddPayload({ ...addPayload, start_date: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-xs">End Date</label>
                <PreserveCaretInput
                  type="date"
                  className={inputCls}
                  value={addPayload.end_date}
                  onChange={(e: any) =>
                    setAddPayload({ ...addPayload, end_date: e.target.value })
                  }
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs">Description</label>
                <PreserveCaretTextarea
                  rows={3}
                  className={inputCls}
                  value={addPayload.description}
                  onChange={(e: any) =>
                    setAddPayload({
                      ...addPayload,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex justify-end gap-2 md:col-span-2">
                <button
                  onClick={() => setOpenAdd(false)}
                  className="px-3 py-1.5 rounded-lg border border-purple-200"
                >
                  <X size={14} className="inline-block mr-1" />
                  Cancel
                </button>
                <button
                  onClick={addItem}
                  className="px-3 py-1.5 rounded-lg bg-purple-600 text-white"
                >
                  <Save size={14} className="inline-block mr-1" />
                  Save
                </button>
              </div>
            </div>
          ) : (
            /* WORK FORM */
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="text-xs">Company</label>
                <PreserveCaretInput
                  className={inputCls}
                  value={addPayload.company_name}
                  onChange={(e: any) =>
                    setAddPayload({
                      ...addPayload,
                      company_name: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="text-xs">Position</label>
                <PreserveCaretInput
                  className={inputCls}
                  value={addPayload.position}
                  onChange={(e: any) =>
                    setAddPayload({ ...addPayload, position: e.target.value })
                  }
                />
              </div>

              {/* DATES */}
              <div>
                <label className="text-xs">Start Date</label>
                <PreserveCaretInput
                  type="date"
                  className={inputCls}
                  value={addPayload.start_date}
                  onChange={(e: any) =>
                    setAddPayload({ ...addPayload, start_date: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-xs">End Date</label>
                <PreserveCaretInput
                  type="date"
                  className={inputCls}
                  value={addPayload.end_date}
                  onChange={(e: any) =>
                    setAddPayload({ ...addPayload, end_date: e.target.value })
                  }
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs">Description</label>
                <PreserveCaretTextarea
                  rows={3}
                  className={inputCls}
                  value={addPayload.description}
                  onChange={(e: any) =>
                    setAddPayload({
                      ...addPayload,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex justify-end gap-2 md:col-span-2">
                <button
                  onClick={() => setOpenAdd(false)}
                  className="px-3 py-1.5 rounded-lg border border-purple-200"
                >
                  <X size={14} className="inline-block mr-1" />
                  Cancel
                </button>
                <button
                  onClick={addItem}
                  className="px-3 py-1.5 rounded-lg bg-purple-600 text-white"
                >
                  <Save size={14} className="inline-block mr-1" />
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================
                LIST & EDIT MODE
      ============================================================ */}
      {loading ? (
        <div className="text-sm opacity-80">Loading…</div>
      ) : items.length === 0 ? (
        <div className="text-sm opacity-70">No background yet.</div>
      ) : (
        <div className="space-y-4">
          {items.map((it) => (
            <div
              key={it._id}
              className={`rounded-xl p-4 border ${
                isDark ? "border-[rgba(94,234,212,0.2)]" : "border-purple-100"
              }`}
            >
              {editId === it._id ? (
                /* ========================= EDIT MODE ========================== */
                <div className="space-y-3">
                  {/* TYPE */}
                  <div>
                    <label className="text-xs">Type</label>
                    <div className="flex gap-4 mt-1">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={editPayload?.entry_type === "work"}
                          onChange={() =>
                            setEditPayload({ ...editPayload!, entry_type: "work" })
                          }
                        />
                        Work
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={editPayload?.entry_type === "education"}
                          onChange={() =>
                            setEditPayload({
                              ...editPayload!,
                              entry_type: "education",
                            })
                          }
                        />
                        Education
                      </label>
                    </div>
                  </div>

                  {/* WORK EDIT */}
                  {editPayload?.entry_type === "work" && (
                    <>
                      <PreserveCaretInput
                        className={inputCls}
                        value={editPayload.company_name}
                        placeholder="Company"
                        onChange={(e: any) =>
                          setEditPayload({
                            ...editPayload!,
                            company_name: e.target.value,
                          })
                        }
                      />

                      <PreserveCaretInput
                        className={inputCls}
                        value={editPayload.position}
                        placeholder="Position"
                        onChange={(e: any) =>
                          setEditPayload({
                            ...editPayload!,
                            position: e.target.value,
                          })
                        }
                      />
                    </>
                  )}

                  {/* EDUCATION EDIT */}
                  {editPayload?.entry_type === "education" && (
                    <>
                      <PreserveCaretInput
                        className={inputCls}
                        value={editPayload.school}
                        placeholder="School"
                        onChange={(e: any) =>
                          setEditPayload({
                            ...editPayload!,
                            school: e.target.value,
                          })
                        }
                      />

                      <PreserveCaretInput
                        className={inputCls}
                        value={editPayload.degree}
                        placeholder="Degree"
                        onChange={(e: any) =>
                          setEditPayload({
                            ...editPayload!,
                            degree: e.target.value,
                          })
                        }
                      />
                    </>
                  )}

                  {/* DATES */}
                  <div className="grid grid-cols-2 gap-3">
                    <PreserveCaretInput
                      type="date"
                      className={inputCls}
                      value={editPayload?.start_date}
                      onChange={(e: any) =>
                        setEditPayload({
                          ...editPayload!,
                          start_date: e.target.value,
                        })
                      }
                    />

                    <PreserveCaretInput
                      type="date"
                      className={inputCls}
                      value={editPayload?.end_date}
                      onChange={(e: any) =>
                        setEditPayload({
                          ...editPayload!,
                          end_date: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* DESCRIPTION */}
                  <PreserveCaretTextarea
                    rows={3}
                    className={inputCls}
                    value={editPayload?.description}
                    onChange={(e: any) =>
                      setEditPayload({
                        ...editPayload!,
                        description: e.target.value,
                      })
                    }
                  />

                  {/* BUTTONS */}
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => {
                        setEditId(null);
                        setEditPayload(null);
                      }}
                      className="px-3 py-1.5 rounded-lg border"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={() => saveEdit(it._id)}
                      className="px-3 py-1.5 rounded-lg bg-purple-600 text-white"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                /* ========================= VIEW MODE ========================== */
                <div>
                  <div className="flex justify-between">
                    <div className="font-semibold">
                      {it.entry_type === "education" ? (
                        <span className="inline-flex items-center gap-2">
                          <GraduationCap size={16} className="text-purple-600" />
                          {it.degree} — {it.school}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2">
                          <Building2 size={16} className="text-purple-600" />
                          {it.position} — {it.company_name}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm opacity-70">
                        {fmt(it.start_date)} —{" "}
                        {it.end_date ? fmt(it.end_date) : "Present"}
                      </span>

                      {/* EDIT BUTTON */}
                      <button
                        className="border px-2 rounded-lg"
                        onClick={() => {
                          setEditId(it._id);
                          setEditPayload({
                            ...it,
                            start_date: fmt(it.start_date),
                            end_date: fmt(it.end_date),
                          });
                        }}
                      >
                        <Pencil size={14} />
                      </button>

                      {/* DELETE BUTTON */}
                      <button
                        className="border px-2 rounded-lg border-red-300 text-red-600"
                        onClick={() => removeItem(it._id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {it.description && (
                    <p className="text-sm mt-1 opacity-80">{it.description}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
