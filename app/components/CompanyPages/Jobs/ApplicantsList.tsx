"use client";

import { User, Mail, Phone } from "lucide-react";

export default function ApplicantsList({
  applicants,
  theme,
  onBack,
}: {
  applicants: any[];
  theme: "dark" | "light";
  onBack: () => void;
}) {
  const isDark = theme === "dark";

  return (
    <div
      className={`
        p-6 rounded-xl 
        animate-fadeIn
        ${isDark ? "bg-[#1b2333] text-white" : "bg-white text-black"}
      `}
    >
      {/* BACK BUTTON */}
      <button
        onClick={onBack}
        className="
          flex items-center gap-2 mb-6
          text-sm font-medium
          px-3 py-2 w-fit rounded-lg
          transition-all
          hover:opacity-80
          hover:-translate-x-1
          border border-gray-600/30
          bg-white/10 backdrop-blur
        "
      >
        <span className="text-lg">←</span> Back to Jobs
      </button>

      <h2 className="text-2xl font-semibold mb-6">
        Applicants ({applicants.length})
      </h2>

      {applicants.length === 0 && (
        <p className="text-center text-sm opacity-70">
          No applicants yet.
        </p>
      )}

      <div className="space-y-4">
        {applicants.map((a: any) => (
          <div
            key={a._id}
            className={`
              p-4 rounded-xl border animate-fadeIn
              ${
                isDark
                  ? "border-gray-700 bg-[#20283d]"
                  : "border-gray-200 bg-gray-50"
              }
            `}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full overflow-hidden bg-gray-300`}
              >
                {a.profile_photo ? (
                  <img
                    src={a.profile_photo}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 p-2 opacity-70" />
                )}
              </div>

              <div>
                <p className="font-semibold">{a.full_name}</p>
                <p className="text-sm opacity-70">{a.Country}</p>
              </div>
            </div>

            {/* Contact */}
            <div className="mt-3 space-y-1 text-sm">
              <div className="flex items-center gap-2 opacity-80">
                <Mail size={16} /> {a.email}
              </div>
              <div className="flex items-center gap-2 opacity-80">
                <Phone size={16} /> {a.phoneNumber}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-3">
              <button className="px-3 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600">
                View CV
              </button>
              <button className="px-3 py-1 text-sm rounded border border-gray-500 hover:bg-gray-200 hover:text-black transition">
                Contact
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
