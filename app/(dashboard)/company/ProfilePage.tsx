"use client";

import { useState, useEffect } from "react";

import CompanyHeader from "@/app/components/CompanyPages/Profile/CompanyHeader";
import CompanyStats from "@/app/components/CompanyPages/Profile/CompanyStats";
import CompanyInfoSection from "@/app/components/CompanyPages/Profile/CompanyInfoSection";

export default function ProfilePage({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const isDark = theme === "dark";

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [company, setCompany] = useState<any>(null);
  const [editedCompany, setEditedCompany] = useState<any>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const token = sessionStorage.getItem("token");
        const r = await fetch("/api/company", {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        if (!r.ok) throw new Error(await r.text());

        const j = await r.json();
        setCompany(j);
        setEditedCompany(j);
      } catch (e: any) {
        setErr(String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = sessionStorage.getItem("token");

      const r = await fetch("/api/company", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ profile: editedCompany }),
      });

      if (!r.ok) throw new Error(await r.text());

      setCompany(editedCompany);
      setIsEditing(false);
    } catch {
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedCompany(company);
    setIsEditing(false);
  };

  if (loading)
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (err)
    return <div className="text-red-500 p-8">Failed to load profile: {err}</div>;

  return (
    <div
      className={`min-h-screen ${
        isDark ? "bg-[#0a0f1e] text-white" : "bg-[#f5f3ff] text-[#2e1065]"
      }`}
    >
      {/* 🎯 أهم تعديل: نفس عرض المنتور */}
      <div className="w-full flex justify-center">
        <div className="w-full max-w-6xl px-4 py-8">

          <CompanyHeader
            company={company}
            edited={editedCompany}
            setEdited={setEditedCompany}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            isDark={isDark}
            onSave={handleSave}
            onCancel={handleCancel}
          />

          <CompanyStats
            isDark={isDark}
            stats={[
              { label: "Total Jobs", value: company?.stats?.jobs ?? 0 },
              { label: "Applications", value: company?.stats?.applications ?? 0 },
              { label: "Status", value: company?.isVerified ? "Verified" : "Pending" },
            ]}
          />

          <CompanyInfoSection
            company={company}
            edited={editedCompany}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            onFieldChange={(key, value) =>
              setEditedCompany((prev: any) => ({
                ...prev,
                [key]: value,
              }))
            }
            onSave={handleSave}
            onCancel={handleCancel}
            isDark={isDark}
          />

        </div>
      </div>
    </div>
  );
}
