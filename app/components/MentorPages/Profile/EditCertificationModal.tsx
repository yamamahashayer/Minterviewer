"use client";

import { useState } from "react";
import { X } from "lucide-react";

type Props = {
  cert: any;             // { title, issuer, date, id, url, index }
  onClose: () => void;
  onSave: (updatedCert: any, index: number) => void;
  onDelete: (index: number) => void;
};

export default function EditCertificationModal({
  cert,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const [title, setTitle] = useState(cert.title || "");
  const [issuer, setIssuer] = useState(cert.issuer || "");
  const [date, setDate] = useState(cert.date || "");
  const [credId, setCredId] = useState(cert.id || "");
  const [url, setUrl] = useState(cert.url || "");

  const saveChanges = () => {
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

  const deleteCert = () => {
    onDelete(cert.index);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-[460px] shadow-lg">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Edit Certification</h2>
          <X className="w-5 h-5 cursor-pointer" onClick={onClose} />
        </div>

        {/* FORM */}
        <div className="space-y-4">

          <Input label="Certificate Title" value={title} onChange={setTitle} required />
          <Input label="Issuing Organization" value={issuer} onChange={setIssuer} required />
          <Input label="Issue Date" type="date" value={date} onChange={setDate} />
          <Input label="Credential ID" value={credId} onChange={setCredId} />
          <Input label="Verification URL" value={url} onChange={setUrl} />

        </div>

        {/* BUTTONS */}
        <div className="mt-6 flex justify-between">

          <button
            onClick={deleteCert}
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            Delete
          </button>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-lg"
            >
              Cancel
            </button>

            <button
              onClick={saveChanges}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg"
            >
              Save
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

/* -------------------- INPUT COMPONENT -------------------- */

function Input({ label, value, onChange, type = "text", required }: any) {
  return (
    <div>
      <label className="text-sm font-medium block mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <input
        type={type}
        className="w-full p-2 border border-gray-300 rounded-md focus:border-purple-500 focus:ring-purple-300 focus:ring-2 transition"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
