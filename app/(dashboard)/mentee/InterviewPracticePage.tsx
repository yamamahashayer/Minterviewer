import AIInterviewerApp from '@/app/components/Interview_Components/AIInterviewerApp'

export default function InterviewPracticePage({ theme = "dark", onNavigate }: { theme?: "dark" | "light"; onNavigate?: (page: string) => void }) {
  return (
    <AIInterviewerApp />
  );
}
