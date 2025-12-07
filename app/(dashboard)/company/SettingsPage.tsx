"use client";

export default function SettingsPage({ theme }: { theme: "dark" | "light" }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold">Settings</h1>
      <p className="text-gray-500 mt-2">Update account & company preferences.</p>

      <div className="mt-8 p-6 rounded-xl bg-white dark:bg-[#101727] border dark:border-white/10 shadow">
        <h2 className="text-xl">General Settings</h2>
        <p className="text-gray-500 mt-2">More settings will be added here.</p>
      </div>
    </div>
  );
}
