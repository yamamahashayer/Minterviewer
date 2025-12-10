"use client";

import React, { useState } from "react";
import JobList from "./JobList";
import CreateJobInlineForm from "./CreateJobInlineForm";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/app/components/ui/tabs";
import JobsOverview from "./JobsOverview";

type Theme = "dark" | "light";

export default function JobsPageComponent({
  theme,
  jobs,
  refreshJobs,
}: {
  theme: Theme;
  jobs: any[];
  refreshJobs: () => void;
}) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [editJob, setEditJob] = useState<any | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const isDark = theme === "dark";

  /* ==================================
        HANDLERS
  =================================== */

  const handleEdit = (job: any) => {
    setEditJob({ ...job }); // deep copy
  };

  const handleClose = async (jobId: string) => {
    const raw = sessionStorage.getItem("user");
    const user = JSON.parse(raw!);
    const companyId = user.companyId;

    await fetch(`/api/company/${companyId}/jobs/${jobId}`, {
      method: "PATCH",
    });

    refreshJobs();
  };

  const handleDelete = async (jobId: string) => {
    const confirmed = confirm("Are you sure you want to delete this job?");
    if (!confirmed) return;

    const raw = sessionStorage.getItem("user");
    const user = JSON.parse(raw!);
    const companyId = user.companyId;

    await fetch(`/api/company/${companyId}/jobs/${jobId}`, {
      method: "DELETE",
    });

    refreshJobs();
  };

  /* ==================================
        UPDATE HANDLER (PUT)
  =================================== */

  const saveEdit = async () => {
    if (!editJob) return;
    setSavingEdit(true);

    const raw = sessionStorage.getItem("user");
    const user = JSON.parse(raw!);
    const companyId = user.companyId;

    await fetch(`/api/company/${companyId}/jobs/${editJob._id}`, {
      method: "PUT",
      body: JSON.stringify(editJob),
    });

    setSavingEdit(false);
    setEditJob(null);
    refreshJobs();
  };

  return (
    <div className={`p-6 space-y-6 ${isDark ? "text-white" : "text-black"}`}>

      {/* SUCCESS ANIMATION */}
      {showSuccess && (
        <div
          className="
            fixed bottom-8 right-8 
            bg-purple-600 text-white 
            px-6 py-3 rounded-xl shadow-lg
            flex items-center gap-3
            animate-fade-in-out 
            z-50
          "
        >
          <span className="text-xl">✔</span>
          <span className="font-medium">Job Published Successfully</span>
        </div>
      )}

      {/* ============================
            EDIT MODAL
      ============================= */}
      {editJob && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className={`
              w-[550px] rounded-xl p-6 shadow-xl
              ${isDark ? "bg-[#1b1c26] text-white" : "bg-white text-black"}
            `}
          >
            <h2 className="text-xl font-bold mb-4">
              Edit Job — {editJob.title}
            </h2>

            {/* Title */}
            <div className="mb-3">
              <label className="text-sm font-medium">Job Title</label>
              <input
                value={editJob.title}
                onChange={(e) =>
                  setEditJob({ ...editJob, title: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 rounded-md border dark:bg-[#141414]"
              />
            </div>

            {/* Location & Type */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="text-sm font-medium">Location</label>
                <input
                  value={editJob.location}
                  onChange={(e) =>
                    setEditJob({ ...editJob, location: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 rounded-md border dark:bg-[#141414]"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Type</label>
                <input
                  value={editJob.type}
                  onChange={(e) =>
                    setEditJob({ ...editJob, type: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 rounded-md border dark:bg-[#141414]"
                />
              </div>
            </div>

            {/* Level & Deadline */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="text-sm font-medium">Level</label>
                <input
                  value={editJob.level}
                  onChange={(e) =>
                    setEditJob({ ...editJob, level: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 rounded-md border dark:bg-[#141414]"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Deadline</label>
                <input
                  type="date"
                  value={editJob.deadline?.substring(0, 10)}
                  onChange={(e) =>
                    setEditJob({ ...editJob, deadline: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 rounded-md border dark:bg-[#141414]"
                />
              </div>
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="text-sm font-medium">Description</label>
              <textarea
                value={editJob.description}
                onChange={(e) =>
                  setEditJob({ ...editJob, description: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 rounded-md border min-h-[90px] dark:bg-[#141414]"
              />
            </div>

            {/* Skills */}
            <div className="mb-3">
              <label className="text-sm font-medium">Skills</label>
              <input
                value={editJob.skills?.join(", ")}
                onChange={(e) =>
                  setEditJob({
                    ...editJob,
                    skills: e.target.value.split(",").map((s) => s.trim()),
                  })
                }
                className="w-full mt-1 px-3 py-2 rounded-md border dark:bg-[#141414]"
              />
            </div>

            {/* BUTTONS */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setEditJob(null)}
                className="px-4 py-2 rounded-md border"
              >
                Cancel
              </button>

              <button
                onClick={saveEdit}
                disabled={savingEdit}
                className="px-5 py-2 rounded-md bg-purple-600 text-white"
              >
                {savingEdit ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div
        className="
          w-full rounded-xl p-6 mb-6 
          bg-gradient-to-r from-purple-100/50 to-pink-100/40 
          border border-purple-200/40
        "
      >
        <h1 className="text-3xl font-bold text-[#4c1d95]">Job Posts</h1>
        <p className="text-[#6b21a8] mt-1">
          Manage all your openings, view applicants, and create new positions.
        </p>
      </div>

      {/* MAIN TABS */}
      <Tabs defaultValue="overview" className="w-full">

        <TabsList
          className={`
            flex gap-1 w-fit rounded-lg p-2
            ${isDark ? "bg-gray-800" : "bg-gray-200"}
          `}
        >
          <TabsTrigger value="overview" className="px-5 py-3">Overview</TabsTrigger>
          <TabsTrigger value="jobs" className="px-5 py-3">Jobs</TabsTrigger>
          <TabsTrigger value="create" className="px-5 py-3">Create Job</TabsTrigger>
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview">
          <JobsOverview jobs={jobs} theme={theme} />
        </TabsContent>

        {/* JOBS LIST */}
        <TabsContent value="jobs">
          <JobList
            jobs={jobs}
            theme={theme}
            onEdit={handleEdit}
            onClose={handleClose}
            onDelete={handleDelete}
          />
        </TabsContent>

        {/* CREATE JOB */}
        <TabsContent value="create">
          <CreateJobInlineForm
            theme={theme}
            onCancel={() => {}}
            onSaved={() => {
              refreshJobs();
              setShowSuccess(true);
              setTimeout(() => setShowSuccess(false), 2000);
            }}
          />
        </TabsContent>

      </Tabs>
    </div>
  );
}
