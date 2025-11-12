"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card } from "@/app/components/ui/card";
import { toast } from "sonner"; // npm install sonner

export default function SecuritySettings({
  menteeId,
  isDark,
}: {
  menteeId?: string;
  isDark?: boolean;
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordUpdate = async () => {
    setMessage(null);
    setError(null);

    if (!menteeId) {
      setError("Mentee ID is missing.");
      return;
    }

    if (!currentPassword || !newPassword) {
      setError("Please fill in all required fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/mentees/${menteeId}/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Password update failed.");
      }

      setMessage("✅ Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`rounded-xl p-8 shadow-lg border transition ${
        isDark
          ? "bg-[#0b1020]/60 border-teal-400/30"
          : "bg-white border-purple-200"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Lock
          className={`${
            isDark ? "text-teal-400" : "text-purple-600"
          } w-5 h-5`}
        />
        <h2
          className={`text-lg font-semibold ${
            isDark ? "text-teal-200" : "text-purple-700"
          }`}
        >
          Change Password
        </h2>
      </div>

      <p
        className={`text-sm mb-6 ${
          isDark ? "text-gray-400" : "text-gray-600"
        }`}
      >
        You can update your account password here. Make sure to choose a strong,
        unique password for better security.
      </p>

      {/* Form */}
      <div className="grid gap-5">
        <div>
          <Label>Current Password</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your current password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-gray-500 text-sm"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div>
          <Label>New Password</Label>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />
          {newPassword && (
            <p
              className={`text-xs mt-1 ${
                newPassword.length < 6
                  ? "text-red-500"
                  : newPassword.length < 10
                  ? "text-yellow-500"
                  : "text-green-500"
              }`}
            >
              Password strength:{" "}
              {newPassword.length < 6
                ? "Weak"
                : newPassword.length < 10
                ? "Medium"
                : "Strong"}
            </p>
          )}
        </div>

        <div>
          <Label>Confirm New Password</Label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
          />
        </div>
      </div>

      {/* Messages */}
      {error && (
        <p className="text-red-500 text-sm mt-4 bg-red-50 p-2 rounded-lg border border-red-200">
          ❌ {error}
        </p>
      )}
      {message && (
        <p className="text-green-600 text-sm mt-4 bg-green-50 p-2 rounded-lg border border-green-200">
          {message}
        </p>
      )}

      {/* Button */}
      <div className="mt-6">
        <Button
          onClick={handlePasswordUpdate}
          disabled={loading}
          className="w-full py-2 text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 rounded-lg"
        >
          {loading ? "Updating..." : "Update Password"}
        </Button>
      </div>
    </div>
  );
}
