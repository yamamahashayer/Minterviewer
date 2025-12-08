"use client";

export default function JobCard({
  job,
  theme,
}: {
  job: any;
  theme: "dark" | "light";
}) {
  const isDark = theme === "dark";

  const cardStyle = isDark
    ? "bg-[#0F172A]/60 border-white/10 text-white"
    : "bg-white border-gray-200 text-black";

  const tagStyle = isDark
    ? "bg-white/10 text-white"
    : "bg-gray-100 text-gray-700";

  return (
    <div
      className={`border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 ${cardStyle}`}
    >
      {/* Title */}
      <h2 className="text-xl font-semibold mb-1">{job.title}</h2>

      {/* Location & Type */}
      <div className="flex items-center gap-2 text-sm opacity-80 mb-2">
        <span>{job.location}</span>
        <span className="opacity-50">•</span>
        <span>{job.type}</span>
      </div>

      {/* Level & Salary */}
      <div className="flex justify-between text-sm opacity-90 mb-4">
        <span>
          <strong>Level:</strong> {job.level}
        </span>
        <span>
          <strong>Salary:</strong> {job.salaryRange}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm opacity-90 mb-4">{job.description}</p>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills?.map((skill: string, idx: number) => (
          <span
            key={idx}
            className={`px-3 py-1 rounded-full text-xs font-medium ${tagStyle}`}
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-sm opacity-80">
        <span>{job.applicants?.length || 0} applicants</span>

        <button className="font-semibold underline hover:opacity-70 transition">
          View Applicants →
        </button>
      </div>
    </div>
  );
}
