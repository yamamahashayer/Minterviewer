"use client";

export default function PublicCompanyProfile({
  companyId,
}: {
  companyId?: string;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center text-lg">
      🏢 Public Company Profile
      {companyId && (
        <span className="ml-2 text-sm text-gray-500">
          (ID: {companyId})
        </span>
      )}
    </div>
  );
}
