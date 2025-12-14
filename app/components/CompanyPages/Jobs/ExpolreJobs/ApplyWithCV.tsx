"use client";

import { useState } from "react";
import UploadCV from "@/app/components/MenteePages/MenteeCV/upload/UploadMode";
import { Button } from "@/app/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  companyId: string;
  jobId: string;
  menteeId: string;
};

export default function ApplyWithCV({
  companyId,
  jobId,
  menteeId,
}: Props) {
  const router = useRouter();

  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submitApplication() {
    if (!analysisId) {
      toast.error("Please upload and analyze your CV first");
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch(
        `/api/company/${companyId}/jobs/${jobId}/apply`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            menteeId,
            analysisId,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to apply");
        return;
      }

      toast.success("Application submitted successfully 🎉");
      router.push("/mentee/applications");
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <UploadCV
        onSuccess={(result) => {
          setAnalysisId(result.analysisId);
          toast.success("CV analyzed successfully ✔️");
        }}
      />

      <Button
        className="w-full"
        disabled={!analysisId || submitting}
        onClick={submitApplication}
      >
        {submitting ? "Submitting..." : "Submit Application"}
      </Button>
    </div>
  );
}
