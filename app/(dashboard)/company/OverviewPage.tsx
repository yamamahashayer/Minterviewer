"use client";

export default function OverviewPage({ theme }: { theme: "dark" | "light" }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold">Company Overview</h1>
      <p className="mt-2 text-gray-500">
        Welcome to your company dashboard. Here's a quick overview of your activity.
      </p>

      {/* Quick Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="p-6 rounded-xl bg-white dark:bg-[#101727] border dark:border-white/10 shadow">
          <h3 className="text-lg font-medium">Jobs Posted</h3>
          <p className="text-3xl mt-3">0</p>
        </div>

        <div className="p-6 rounded-xl bg-white dark:bg-[#101727] border dark:border-white/10 shadow">
          <h3 className="text-lg font-medium">Total Candidates</h3>
          <p className="text-3xl mt-3">0</p>
        </div>

        <div className="p-6 rounded-xl bg-white dark:bg-[#101727] border dark:border-white/10 shadow">
          <h3 className="text-lg font-medium">Messages</h3>
          <p className="text-3xl mt-3">0</p>
        </div>
      </div>
    </div>
  );
}
