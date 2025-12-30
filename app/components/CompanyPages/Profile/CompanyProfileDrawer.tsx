"use client";

import { X, ArrowLeft } from "lucide-react";
import CompanyHeader from "@/app/components/CompanyPages/Profile/CompanyHeader";
import CompanyInfoSection from "@/app/components/CompanyPages/Profile/CompanyInfoSection";

export default function CompanyProfileDrawer({
  company,
  open,
  onClose,
  isDark,
}: any) {
  if (!open || !company) return null;

  return (
    <div className="absolute inset-0 z-40">
      {/* الخلفية داخل المحتوى فقط */}
      <div
        className={`absolute inset-0 ${
          isDark ? "bg-[#0a0f1e]" : "bg-gray-50"
        }`}
      />

      {/* المحتوى */}
      <div className="relative h-full overflow-y-auto">
        {/* TOP BAR */}
        <div
          className={`sticky top-0 z-10 flex items-center justify-between
          px-6 py-4 border-b
          ${isDark ? "bg-[#0d1528] border-white/10" : "bg-white border-gray-200"}`}
        >
          <button
            onClick={onClose}
            className="flex items-center gap-2 opacity-80 hover:opacity-100"
          >
            <ArrowLeft />
            Back to Jobs
          </button>

          <button onClick={onClose} className="opacity-70 hover:opacity-100">
            <X />
          </button>
        </div>

        {/* PAGE CONTENT */}
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
         <CompanyHeader
          company={company}
          edited={company}
          isEditing={false}
          setIsEditing={() => {}}
          isDark={isDark}
          isOwner={false}                      // mentee view
        />


          <CompanyInfoSection
            edited={company}
            isEditing={false}
            setIsEditing={() => {}}
            onFieldChange={() => {}}
            onSave={() => {}}
            onCancel={() => {}}
            isDark={isDark}
            isOwner={false}
          />
        </div>
      </div>
    </div>
  );
}
