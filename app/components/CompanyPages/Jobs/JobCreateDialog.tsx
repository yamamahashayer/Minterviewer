"use client";

import React, { useState } from "react";

export default function JobCreateDialog({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    type: "",
    location: "",
    level: "",
    salaryRange: "",
    description: "",
    skills: "",
    deadline: "",
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submitJob = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/company/jobs", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          skills: form.skills.split(",").map((s) => s.trim()),
        }),
      });

      const data = await res.json();
      if (data.ok) onClose();
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-[450px] space-y-4">

        <h2 className="text-lg font-semibold">Create Job Post</h2>

        <input
          className="w-full p-2 border rounded"
          placeholder="Job Title"
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />

        <input
          className="w-full p-2 border rounded"
          placeholder="Type (Full-time, Part-time...)"
          value={form.type}
          onChange={(e) => handleChange("type", e.target.value)}
        />

        <input
          className="w-full p-2 border rounded"
          placeholder="Location"
          value={form.location}
          onChange={(e) => handleChange("location", e.target.value)}
        />

        <input
          className="w-full p-2 border rounded"
          placeholder="Level (Junior / Mid / Senior)"
          value={form.level}
          onChange={(e) => handleChange("level", e.target.value)}
        />

        <input
          className="w-full p-2 border rounded"
          placeholder="Salary Range"
          value={form.salaryRange}
          onChange={(e) => handleChange("salaryRange", e.target.value)}
        />

        <textarea
          className="w-full p-2 border rounded"
          rows={3}
          placeholder="Description"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />

        <input
          className="w-full p-2 border rounded"
          placeholder="Skills (comma separated)"
          value={form.skills}
          onChange={(e) => handleChange("skills", e.target.value)}
        />

        <input
          type="date"
          className="w-full p-2 border rounded"
          value={form.deadline}
          onChange={(e) => handleChange("deadline", e.target.value)}
        />

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={submitJob}
            disabled={loading}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
          >
            {loading ? "Posting..." : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}
