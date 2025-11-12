import React from "react";

export default function SectionCard({
  className = "", children,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`rounded-xl p-8 backdrop-blur-sm border ${className}`}>
      {children}
    </div>
  );
}
