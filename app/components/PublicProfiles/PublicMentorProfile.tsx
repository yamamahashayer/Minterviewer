"use client";

export default function PublicMentorProfile({
  mentorId,
}: {
  mentorId?: string;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center text-lg">
      🧑‍🏫 Public Mentor Profile
      {mentorId && (
        <span className="ml-2 text-sm text-gray-500">
          (ID: {mentorId})
        </span>
      )}
    </div>
  );
}
