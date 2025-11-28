export default function MentorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {children}
    </div>
  );
}
