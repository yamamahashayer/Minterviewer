"use client";

export default function JobsPage({ theme }: { theme: "dark" | "light" }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold">Job Listings</h1>
      <p className="text-gray-500 mt-2">
        Manage, post, and track open job positions.
      </p>

      <div className="mt-8 grid gap-6">
        <div className="p-6 rounded-xl bg-white dark:bg-[#101727] border dark:border-white/10 shadow">
          <h2 className="text-xl font-medium">No jobs posted yet</h2>
          <p className="text-gray-500">Start by adding your first job posting.</p>
        </div>
      </div>
    </div>
  );
}
