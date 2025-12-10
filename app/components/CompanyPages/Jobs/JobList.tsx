"use client";

import React from "react";
import JobCard from "./JobCard";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/app/components/ui/tabs";

export default function JobList({
  jobs,
  theme,
  onEdit,
  onClose,
  onDelete,
  onViewApplicants,     // ⭐ لازم نستقبله
}: {
  jobs: any[];
  theme: "dark" | "light";
  onEdit: (job: any) => void;
  onClose: (id: string) => void;
  onDelete: (id: string) => void;
  onViewApplicants: (id: string) => void;   // ⭐ لازم نعرّفه
}) {
  const isDark = theme === "dark";

  return (
    <Tabs defaultValue="active" className="w-full space-y-6">

      {/* INTERNAL TABS */}
      <TabsList
        className={`
          flex gap-1 w-fit rounded-lg p-1
          ${isDark ? "bg-gray-800" : "bg-gray-200"}
        `}
      >
        <TabsTrigger
          value="active"
          className="px-4 py-2 rounded-md text-sm font-medium capitalize
            data-[state=active]:bg-white data-[state=active]:shadow"
        >
          Active
        </TabsTrigger>

        <TabsTrigger
          value="closed"
          className="px-4 py-2 rounded-md text-sm font-medium capitalize
            data-[state=active]:bg-white data-[state=active]:shadow"
        >
          Closed
        </TabsTrigger>
      </TabsList>

      {/* ACTIVE JOBS */}
      <TabsContent value="active">
        {jobs.filter((j) => j.status === "active").length === 0 ? (
          <p className="text-gray-500 text-sm">No active jobs.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs
              .filter((j) => j.status === "active")
              .map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  theme={theme}
                  onEdit={() => onEdit(job)}
                  onClose={() => onClose(job._id)}
                  onDelete={() => onDelete(job._id)}
                  onViewApplicants={() => onViewApplicants(job._id)}  // ⭐ هون السر
                />
              ))}
          </div>
        )}
      </TabsContent>

      {/* CLOSED JOBS */}
      <TabsContent value="closed">
        {jobs.filter((j) => j.status === "closed").length === 0 ? (
          <p className="text-gray-500 text-sm">No closed jobs.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs
              .filter((j) => j.status === "closed")
              .map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  theme={theme}
                  onEdit={() => onEdit(job)}
                  onClose={() => onClose(job._id)}
                  onDelete={() => onDelete(job._id)}
                  onViewApplicants={() => onViewApplicants(job._id)}  // ⭐ نفس الشي
                />
              ))}
          </div>
        )}
      </TabsContent>

    </Tabs>
  );
}
