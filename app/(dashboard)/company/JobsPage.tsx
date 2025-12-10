// "use client";

// import JobsPageComponent from "@/app/components/CompanyPages/Jobs/JobsPageComponent";
// import React, { useState, useEffect } from "react";

// type Theme = "dark" | "light";

// export default function JobsPage({ theme }: { theme: Theme }) {
//   const [open, setOpen] = useState(false);
//   const [jobs, setJobs] = useState([]);

//   const isDark = theme === "dark";

//   const fetchJobs = async () => {
//     try {
//       const res = await fetch("/api/company/jobs");
//       const data = await res.json();
//       if (data.ok) setJobs(data.jobs);
//     } catch (err) {
//       console.error("Error fetching jobs:", err);
//     }
//   };

//   useEffect(() => {
//     fetchJobs();
//   }, []);

//   return (
//     <div className={`p-6 ${isDark ? "text-white" : "text-black"}`}>   
//             <JobsPageComponent theme={theme} />    
//     </div>
//   );
// }
"use client";

import JobsPageComponent from "@/app/components/CompanyPages/Jobs/JobsPageComponent";
import React, { useState, useEffect } from "react";

type Theme = "dark" | "light";

export default function JobsPage({ theme }: { theme: Theme }) {
  const [jobs, setJobs] = useState([]);

  const isDark = theme === "dark";

  const fetchJobs = async () => {
    try {
      const raw = sessionStorage.getItem("user");
      if (!raw) return;

      const user = JSON.parse(raw);
      const companyId = user.companyId;

      const res = await fetch(`/api/company/${companyId}/jobs`);
      const data = await res.json();

      if (data.ok) setJobs(data.jobs);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className={`p-6 ${isDark ? "text-white" : "text-black"}`}>
      <JobsPageComponent
        theme={theme}
        jobs={jobs}
        refreshJobs={fetchJobs}
      />
    </div>
  );
}
