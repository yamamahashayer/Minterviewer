"use client";

export default function MessagesPage({ theme }: { theme: "dark" | "light" }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold">Messages</h1>
      <p className="text-gray-500 mt-2">
        Communicate with candidates and manage conversations.
      </p>

      <div className="mt-8 p-6 rounded-xl bg-white dark:bg-[#101727] border dark:border-white/10 shadow">
        <h2>No messages yet</h2>
      </div>
    </div>
  );
}
