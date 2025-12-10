"use client";

import React, { useState } from "react";
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
}: {
  jobs: any[];
  theme: "dark" | "light";
}) {
  const isDark = theme === "dark";

  return (
    <Tabs defaultValue="active" className="w-full space-y-6">

      {/* =============== INTERNAL TABS =============== */}
      <TabsList
        className={`
          flex gap-1 w-fit rounded-lg p-1
          ${isDark ? "bg-gray-800" : "bg-gray-200"}
        `}
      >
        <TabsTrigger
          value="active"
          className={`
            px-4 py-2 rounded-md text-sm font-medium capitalize
            data-[state=active]:bg-white data-[state=active]:shadow
            ${isDark ? "text-gray-300 data-[state=active]:text-black" : "text-gray-700"}
          `}
        >
          Active
        </TabsTrigger>

      
        <TabsTrigger
          value="closed"
          className={`
            px-4 py-2 rounded-md text-sm font-medium capitalize
            data-[state=active]:bg-white data-[state=active]:shadow
            ${isDark ? "text-gray-300 data-[state=active]:text-black" : "text-gray-700"}
          `}
        >
          Closed
        </TabsTrigger>
      </TabsList>

      {/* ACTIVE JOBS */}
      <TabsContent value="active">
        {jobs.filter((j) => j.status !== "closed" && j.status !== "draft").length === 0 ? (
          <p className="text-gray-500 text-sm">No active jobs.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs
              .filter((j) => j.status !== "closed" && j.status !== "draft")
              .map((job) => (
                <JobCard key={job._id} job={job} theme={theme} />
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
                <JobCard key={job._id} job={job} theme={theme} />
              ))}
          </div>
        )}
      </TabsContent>

    </Tabs>
  );
}
