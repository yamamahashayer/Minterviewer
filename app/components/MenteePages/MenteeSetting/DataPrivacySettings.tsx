"use client";
import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Download, Trash2, Loader2, XCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";

export default function DataPrivacySettings({ isDark }: { isDark: boolean }) {
  const [loading, setLoading] = useState<"export" | "delete" | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const menteeId =
    typeof window !== "undefined" ? sessionStorage.getItem("menteeId") : null;

  /* 🟣 1️⃣ Export Data */
  const handleExport = async () => {
    if (!menteeId) return alert("⚠️ menteeId not found in session!");
    setLoading("export");
    try {
      const res = await fetch(`/api/mentees/${menteeId}/export`);
      if (!res.ok) throw new Error("Failed to export data");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Minterviewer_Data_${menteeId}.json`;
      a.click();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to export data. Try again later.");
    } finally {
      setLoading(null);
    }
  };

  /* 🟥 2️⃣ Delete Account */
  const handleDelete = async () => {
    if (!menteeId) return alert("⚠️ menteeId not found in session!");
    setLoading("delete");
    try {
      const res = await fetch(`/api/mentees/${menteeId}`, { method: "DELETE" });
      const data = await res.json();

      if (data.ok) {
        setShowConfirm(false);
        alert("✅ Account deleted successfully.");

        sessionStorage.clear();
        localStorage.clear();

        window.location.href = "/"; 
      } else {
        alert(`❌ ${data.message || "Failed to delete account"}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Server error during deletion.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Data */}
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
          Export Data
        </h3>
        <p
          className={`${
            isDark ? "text-[#99a1af]" : "text-[#6b21a8]"
          } text-sm mb-4`}
        >
          Download a copy of your data including interview history and
          achievements.
        </p>
        <Button
          onClick={handleExport}
          disabled={loading === "export"}
          className={`${
            isDark
              ? "bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 border-2 border-teal-400/50"
              : "bg-purple-100 hover:bg-purple-200 text-purple-700 border-2 border-purple-300"
          }`}
        >
          {loading === "export" ? (
            <Loader2 size={16} className="mr-2 animate-spin" />
          ) : (
            <Download size={16} className="mr-2" />
          )}
          {loading === "export" ? "Exporting..." : "Export My Data"}
        </Button>
      </div>

      {/* Danger Zone */}
      <div
        className={`${
          isDark
            ? "bg-gradient-to-br from-[rgba(220,38,38,0.1)] to-[rgba(255,255,255,0.02)] border-[rgba(220,38,38,0.3)]"
            : "bg-red-50 border-red-200"
        } border rounded-xl p-6 backdrop-blur-sm`}
      >
        <h3
          className={`${
            isDark ? "text-red-400" : "text-red-600"
          } mb-6 font-semibold`}
        >
          Danger Zone
        </h3>

        <div className="flex items-center justify-between">
          <div>
            <h4
              className={`${
                isDark ? "text-white" : "text-red-700"
              } mb-1 font-medium`}
            >
              Delete Account
            </h4>
            <p
              className={`${
                isDark ? "text-[#99a1af]" : "text-red-600"
              } text-sm`}
            >
              Permanently delete your account and all associated data.
            </p>
          </div>

          {/* 🔴 Confirmation Modal */}
          <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
            <AlertDialogTrigger asChild>
              <Button
                disabled={loading === "delete"}
                className={`${
                  isDark
                    ? "bg-red-500/30 hover:bg-red-500/40 text-red-100 border-2 border-red-400/60"
                    : "bg-red-200 hover:bg-red-300 text-red-800 border-2 border-red-400"
                }`}
              >
                <Trash2 size={16} className="mr-2" />
                Delete Account
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent
              className={`${
                isDark
                  ? "bg-[#0b1020] border border-red-400/30 text-white"
                  : "bg-white border border-red-200 text-gray-900"
              } rounded-xl shadow-xl`}
            >
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-lg font-bold text-red-600 dark:text-red-400">
                  <XCircle size={20} /> Confirm Account Deletion
                </AlertDialogTitle>
                <AlertDialogDescription
                  className={`${
                    isDark ? "text-gray-300" : "text-gray-600"
                  } text-sm mt-2`}
                >
                  This action <strong>cannot be undone</strong>. All your
                  interviews, CV analyses, and achievements will be permanently
                  removed.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter className="mt-6">
                <AlertDialogCancel
                  className={`${
                    isDark
                      ? "bg-gray-700 hover:bg-gray-600 text-white border border-gray-500"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  Cancel
                </AlertDialogCancel>

                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={loading === "delete"}
                  className={`${
                    isDark
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                >
                  {loading === "delete" ? (
                    <Loader2 size={16} className="mr-2 animate-spin" />
                  ) : (
                    <Trash2 size={16} className="mr-2" />
                  )}
                  {loading === "delete" ? "Deleting..." : "Yes, delete it"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
