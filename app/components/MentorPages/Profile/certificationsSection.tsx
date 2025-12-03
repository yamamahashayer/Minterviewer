"use client";

import React, { useState } from "react";
import { Award, Plus, ExternalLink, Pencil, Trash2, X } from "lucide-react";

/* ===========================================================
   MAIN SECTION
=========================================================== */
type Props = {
  profile: any;
  isEditing: boolean;
  isDark?: boolean;
  onFieldChange: (key: string, value: any) => void;
};

export default function CertificationsSection({
  profile,
  isEditing,
  isDark = false,
  onFieldChange,
}: Props) {
  const data = profile || {};
  const iconClass = isDark ? "w-5 h-5 text-teal-300" : "w-5 h-5 text-purple-600";

  const [newTitle, setNewTitle] = useState("");
  const [editingCert, setEditingCert] = useState<any>(null);

  /* Add certificate */
  const addCertificate = () => {
    if (!newTitle.trim()) return;

    const arr = [...(data.certifications || [])];
    arr.push({
      title: newTitle,
      issuer: "",
      date: "",
      id: "",
      url: "",
    });

    onFieldChange("certifications", arr);
    setNewTitle("");
  };

  /* Remove */
  const deleteCert = (index: number) => {
    const arr = [...data.certifications];
    arr.splice(index, 1);
    onFieldChange("certifications", arr);
  };

  /* Save edited cert */
  const saveEdited = (updated: any, index: number) => {
    const arr = [...data.certifications];
    arr[index] = updated;
    onFieldChange("certifications", arr);
  };

  return (
    <Card isDark={isDark}>
      <SectionTitle
        title="Certifications"
        icon={<Award className={iconClass} />}
        isDark={isDark}
      />

      {/* No certificates */}
      {!data.certifications?.length && !isEditing && (
        <p className={isDark ? "text-white/50 italic ml-7" : "text-[var(--foreground-muted)] italic ml-7"}>
          None
        </p>
      )}

      {/* LIST */}
      <div className="space-y-4">
        {(data.certifications || []).map((cert: any, i: number) => (
          <div
            key={i}
            className={`ml-7 mt-2 p-4 rounded-lg border ${
              isDark
                ? "bg-[rgba(255,255,255,0.05)] border-teal-300/20 text-white"
                : "bg-[var(--card)] border-[var(--border)]"
            }`}
          >
            <div className="flex justify-between">
              {/* LEFT INFO */}
              <div>
                <div
                  className={`font-medium flex items-center gap-2 ${
                    isDark ? "text-white" : "text-[var(--foreground)]"
                  }`}
                >
                  <Award className={isDark ? "w-4 h-4 text-teal-300" : "w-4 h-4 text-purple-600"} />
                  {cert.title || "Untitled Certificate"}
                </div>

                {cert.issuer && (
                  <p className={isDark ? "text-white/60" : "text-[var(--foreground-muted)]"}>
                    Issuer: {cert.issuer}
                  </p>
                )}

                {cert.date && (
                  <p className={isDark ? "text-white/60" : "text-[var(--foreground-muted)]"}>
                    Date: {cert.date}
                  </p>
                )}

                {cert.id && (
                  <p className={isDark ? "text-white/60" : "text-[var(--foreground-muted)]"}>
                    Credential ID: {cert.id}
                  </p>
                )}

                {cert.url && (
                  <a
                    href={cert.url}
                    target="_blank"
                    className={
                      isDark
                        ? "text-teal-300 mt-2 flex items-center gap-1 text-sm"
                        : "text-purple-600 mt-2 flex items-center gap-1 text-sm"
                    }
                  >
                    Verify Credential <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* EDIT / DELETE BUTTONS */}
              {isEditing && (
                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => setEditingCert({ ...cert, index: i })}
                    className={
                      isDark
                        ? "p-2 hover:bg-teal-300/20 rounded-md"
                        : "p-2 hover:bg-purple-300/20 rounded-md"
                    }
                  >
                    <Pencil className={isDark ? "w-4 h-4 text-teal-300" : "w-4 h-4 text-purple-600"} />
                  </button>

                  <button
                    onClick={() => deleteCert(i)}
                    className="p-2 hover:bg-red-300/20 rounded-md"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ADD NEW */}
      {isEditing && (
        <div className="mt-4 ml-7">
          <label
            className={`text-sm mb-1 block ${
              isDark ? "text-white" : "text-[var(--foreground)]"
            }`}
          >
            Add Certification
          </label>

          <div className="flex gap-2">
            <input
              className={
                `flex-1 p-2 rounded-md outline-none ${
                  isDark
                    ? "bg-[rgba(255,255,255,0.05)] border border-teal-300/20 text-white placeholder:text-white/50"
                    : "bg-[var(--card)] border border-[var(--border)]"
                }`
              }
              placeholder="Certificate title…"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />

            <button
              onClick={addCertificate}
              className={
                `px-4 py-2 rounded-md flex items-center justify-center ${
                  isDark
                    ? "bg-teal-400 text-black hover:bg-teal-300"
                    : "bg-purple-600 text-white"
                }`
              }
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingCert && (
        <EditCertificationModal
          cert={editingCert}
          onClose={() => setEditingCert(null)}
          onSave={saveEdited}
          onDelete={(index) => deleteCert(index)}
          isDark={isDark}
        />
      )}
    </Card>
  );
}

/* ===========================================================
   SUB COMPONENTS (Card, Title)
=========================================================== */

function Card({ children, isDark }: any) {
  return (
    <div
      className={
        `p-6 rounded-xl border backdrop-blur-sm ${
          isDark
            ? "bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0.02)] border-[rgba(94,234,212,0.2)] shadow-[0_0_25px_rgba(0,255,255,0.05)] text-white"
            : "bg-white border-[#eae2ff] text-[var(--foreground)]"
        }`
      }
    >
      {children}
    </div>
  );
}


function SectionTitle({ title, icon, isDark }: any) {
  return (
    <h3
      className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
        isDark ? "text-white" : "text-[var(--foreground)]"
      }`}
    >
      {icon}
      {title}
    </h3>
  );
}

/* ===========================================================
   MODAL COMPONENT — DARK MODE INCLUDED
=========================================================== */

function EditCertificationModal({
  cert,
  onClose,
  onSave,
  onDelete,
  isDark,
}: any) {
  const [title, setTitle] = useState(cert.title || "");
  const [issuer, setIssuer] = useState(cert.issuer || "");
  const [date, setDate] = useState(cert.date || "");
  const [credId, setCredId] = useState(cert.id || "");
  const [url, setUrl] = useState(cert.url || "");

  const save = () => {
    onSave(
      {
        title,
        issuer,
        date,
        id: credId,
        url,
      },
      cert.index
    );
    onClose();
  };

  const remove = () => {
    onDelete(cert.index);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div
        className={
          `p-6 rounded-xl w-[460px] shadow-xl border ${
            isDark
              ? "bg-[rgba(10,10,10,0.95)] border-teal-400/30 text-white"
              : "bg-white border-gray-200"
          }`
        }
      >
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">Edit Certification</h2>
          <X
            className={`w-5 h-5 cursor-pointer ${
              isDark ? "hover:text-red-400" : ""
            }`}
            onClick={onClose}
          />
        </div>

        <div className="space-y-4">
          <Input label="Certificate Title" value={title} onChange={setTitle} required isDark={isDark} />
          <Input label="Issuing Organization" value={issuer} onChange={setIssuer} required isDark={isDark} />
          <Input label="Issue Date" type="date" value={date} onChange={setDate} isDark={isDark} />
          <Input label="Credential ID" value={credId} onChange={setCredId} isDark={isDark} />
          <Input label="Verification URL" value={url} onChange={setUrl} isDark={isDark} />
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={remove}
            className={
              `px-4 py-2 rounded-lg ${
                isDark ? "bg-red-500 text-white" : "bg-red-500 text-white"
              }`
            }
          >
            Delete
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className={
                `px-4 py-2 rounded-lg ${
                  isDark ? "bg-gray-600 text-white" : "bg-gray-200"
                }`
              }
            >
              Cancel
            </button>

            <button
              onClick={save}
              className={
                `px-4 py-2 rounded-lg ${
                  isDark ? "bg-teal-400 text-black" : "bg-purple-600 text-white"
                }`
              }
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========= INPUT COMPONENT WITH DARK MODE ========= */

function Input({ label, value, onChange, type = "text", required, isDark }: any) {
  return (
    <div>
      <label className={`text-sm mb-1 block ${isDark ? "text-white" : "text-[var(--foreground)]"}`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <input
        type={type}
        className={
          `w-full p-2 rounded-md outline-none border ${
            isDark
              ? "bg-[rgba(255,255,255,0.08)] border-teal-300/20 text-white placeholder:text-white/40"
              : "bg-white border-gray-300"
          }`
        }
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
