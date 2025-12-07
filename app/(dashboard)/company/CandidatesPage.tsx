"use client";

export default function CandidatesPage({ theme }: { theme: "dark" | "light" }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold">Candidates</h1>
      <p className="text-gray-500 mt-2">
        Review applicants and manage candidate profiles.
      </p>

      <div className="mt-8 p-6 rounded-xl bg-white dark:bg-[#101727] border dark:border-white/10 shadow">
        <h2 className="text-lg">No candidates yet</h2>
        <p className="text-gray-500">Candidates will appear here once they apply.</p>
      </div>
    </div>
  );
}
