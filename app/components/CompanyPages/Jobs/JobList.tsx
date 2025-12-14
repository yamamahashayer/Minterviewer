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
  onViewApplicants,
}: {
  jobs: any[];
  theme: "dark" | "light";
  onEdit: (job: any) => void;
  onClose: (id: string) => void;
  onDelete: (id: string) => void;
  onViewApplicants: (job: any) => void; // ✅ job كامل
}) {
  const isDark = theme === "dark";

  return (
    <Tabs defaultValue="active" className="w-full space-y-6">


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
                  onViewApplicants={() => onViewApplicants(job)} // ✅ هون الإصلاح
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
                  onViewApplicants={() => onViewApplicants(job)} // ✅
                />
              ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
