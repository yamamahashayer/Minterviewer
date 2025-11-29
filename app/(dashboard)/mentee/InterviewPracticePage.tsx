
import AIInterviewerApp from '@/app/components/Interview_Components/SetupScreen'
export default function InterviewPracticePage({ theme = "dark", onNavigate }: { theme?: "dark" | "light"; onNavigate?: (page: string) => void }) {
  // At module scope (e.g., above React components)
  const spokenOnce = new Set<string>();

  // Initial Type Selection Screen
  return (
    <>
      <AIInterviewerApp  > </AIInterviewerApp>
    </>
  );
}
