"use client";

import { ShieldAlert, Clock } from "lucide-react";

export default function CompanyPendingPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20 text-center">

      <div className="bg-yellow-500/10 border border-yellow-500/30 px-10 py-10 rounded-2xl max-w-xl">
        <ShieldAlert className="w-16 h-16 text-yellow-400 mx-auto mb-4" />

        <h1 className="text-3xl font-semibold text-white mb-3">
          Your Company Is Under Review
        </h1>

        <p className="text-gray-300 leading-relaxed">
          Thank you for signing up!  
          Our team is currently reviewing your company details to ensure authenticity.
          You will be notified once your account is approved.
        </p>

        <div className="flex items-center justify-center gap-2 text-gray-400 mt-4">
          <Clock className="w-5 h-5" />
          <span>Usually takes 12–24 hours</span>
        </div>

      </div>

    </div>
  );
}
