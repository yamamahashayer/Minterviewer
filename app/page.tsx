import HeroSection from './components/publicPages/HomePageComponents/HeroSection';
import CompanyLogosSection from './components/publicPages/HomePageComponents/CompanyLogosSection';
import LiveSessionsLanding from './components/publicPages/HomePageComponents/prossection';
import WhatNumberssaySection from './components/publicPages/HomePageComponents/WhatNumberssaySection';
import PlatformWalkthrough from './components/publicPages/HomePageComponents/WalkThrough';
import TestimonialsSection from './components/publicPages/HomePageComponents/Testemotional';
import FAQSection from './components/publicPages/HomePageComponents/FAQSection';

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
