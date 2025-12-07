"use client";

export default function ProfilePage({ theme }: { theme: "dark" | "light" }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold">Company Profile</h1>
      <p className="text-gray-500 mt-2">
        Manage your company information, logo, website, and industry details.
      </p>

      <div className="mt-8 p-6 rounded-xl bg-white dark:bg-[#101727] border dark:border-white/10 shadow">
        <h2 className="text-xl font-medium">General Information</h2>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium">Company Name</label>
            <input
              className="mt-1 border p-2 w-full rounded-md dark:bg-[#0f1525] dark:border-white/20"
              placeholder="Your company name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Website</label>
            <input
              className="mt-1 border p-2 w-full rounded-md dark:bg-[#0f1525] dark:border-white/20"
              placeholder="https://company.com"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
