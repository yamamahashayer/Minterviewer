import HeroSection from './components/HomePageComponents/HeroSection';
import CompanyLogosSection from './components/HomePageComponents/CompanyLogosSection';
import LiveSessionsLanding from './components/HomePageComponents/prossection';
import WhatNumberssaySection from './components/HomePageComponents/WhatNumberssaySection';
import PlatformWalkthrough from './components/HomePageComponents/WalkThrough';
import TestimonialsSection from './components/HomePageComponents/Testemotional';
import FAQSection from './components/HomePageComponents/FAQSection';

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <CompanyLogosSection />
      <WhatNumberssaySection />
      <LiveSessionsLanding />
      <PlatformWalkthrough
        videoUrl={"https://www.youtube.com/embed/Y9-0Jj3avRg?si=A-35oqff_ahFSrqo"}
      />
      <TestimonialsSection />
      <FAQSection />
    </div>
  );
}
