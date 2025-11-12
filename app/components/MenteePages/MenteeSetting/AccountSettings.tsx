"use client";

import { useState, useEffect } from "react";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Save } from "lucide-react";

export default function AccountSettings({ isDark }: { isDark: boolean }) {
  const [menteeId, setMenteeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
  });

useEffect(() => {
  const id = sessionStorage.getItem("menteeId");
  if (id) {
    setMenteeId(id);
  } else {
    console.warn("⚠️ menteeId not found in sessionStorage yet");
  }
}, []);



useEffect(() => {
  if (!menteeId) return;
  console.log("📡 Fetching settings for:", menteeId);
  (async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/mentees/${menteeId}/settings`, { cache: "no-store" });
      const json = await res.json();
      console.log("✅ Response:", json);
      if (json.ok && json.user) {
        setFormData({
          name: json.user.name || "",
          email: json.user.email || "",
          phone: json.user.phone || "",
          location: json.user.location || "",
          bio: json.user.bio || "",
        });
      }
    } catch (err) {
      console.error("❌ Error loading settings:", err);
    } finally {
      setLoading(false);
    }
  })();
}, [menteeId]);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!menteeId) return alert("Mentee ID not found!");
    try {
      setSaving(true);
      const res = await fetch(`/api/mentees/${menteeId}/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: formData }),
      });
      const json = await res.json();
      if (json.ok) {
        alert("✅ Settings updated successfully!");
      } else {
        alert("⚠️ Failed to update: " + (json.error || "Unknown error"));
      }
    } catch (err) {
      console.error("❌ Error saving settings:", err);
      alert("An error occurred while saving");
    } finally {
      setSaving(false);
    }
  };
        if (loading)
        return (
            <div
            className={`flex items-center justify-center min-h-screen ${
                isDark ? "bg-[#0a0f1e] text-white" : "bg-[#f5f3ff] text-[#2e1065]"
            }`}
            >
            <div className="flex flex-col items-center">
                {/* Spinner */}
                <div
                className={`w-12 h-12 border-4 border-t-transparent rounded-full animate-spin ${
                    isDark ? "border-teal-400" : "border-purple-500"
                }`}
                />
                {/* Text */}
                <p className="mt-4 text-lg font-medium tracking-wide">Loading your profile...</p>
            </div>
            </div>
        );

  return (
    <div
      className={`${
        isDark
          ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]"
          : "bg-white shadow-lg"
      } border ${
        isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"
      } rounded-xl p-6 backdrop-blur-sm`}
    >
      <h3
        className={`${
          isDark ? "text-white" : "text-[#2e1065]"
        } mb-6 font-semibold`}
      >
        Account Information
      </h3>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor="name"
              className={`${
                isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"
              } font-medium`}
            >
              Full Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={`mt-2 ${
                isDark
                  ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white"
                  : "bg-white border-[#ddd6fe] text-[#2e1065]"
              }`}
            />
          </div>

          <div>
            <Label
              htmlFor="email"
              className={`${
                isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"
              } font-medium`}
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              readOnly
              className={`mt-2 opacity-80 cursor-not-allowed ${
                isDark
                  ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white"
                  : "bg-[#f5f3ff] border-[#ddd6fe] text-[#6b21a8]"
              }`}
            />
          </div>
        </div>

        <div>
          <Label
            htmlFor="phone"
            className={`${
              isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"
            } font-medium`}
          >
            Phone
          </Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className={`mt-2 ${
              isDark
                ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white"
                : "bg-white border-[#ddd6fe] text-[#2e1065]"
            }`}
          />
        </div>

        <div>
          <Label
            htmlFor="location"
            className={`${
              isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"
            } font-medium`}
          >
            Location
          </Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            className={`mt-2 ${
              isDark
                ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white"
                : "bg-white border-[#ddd6fe] text-[#2e1065]"
            }`}
          />
        </div>

        <div>
          <Label
            htmlFor="bio"
            className={`${
              isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"
            } font-medium`}
          >
            Bio
          </Label>
          <textarea
            id="bio"
            rows={4}
            value={formData.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
            className={`w-full border rounded-md mt-2 p-3 text-sm focus:outline-none ${
              isDark
                ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white focus:border-[rgba(94,234,212,0.5)]"
                : "bg-white border-[#ddd6fe] text-[#2e1065] focus:border-[#a855f7]"
            }`}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            disabled={saving}
            onClick={handleSave}
            className={`${
              isDark
                ? "bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-[#0a0f1e] shadow-lg shadow-teal-500/20"
                : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-md"
            }`}
          >
            <Save size={16} className="mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
