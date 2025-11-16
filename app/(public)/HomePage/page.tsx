"use client";

import React from "react";
import HeroSection from "../../components/publicPages/HomePageComponents/HeroSection";
import CompanyLogosSection from "../../components/publicPages/HomePageComponents/CompanyLogosSection";
import LiveSessionsLanding from "../../components/publicPages/HomePageComponents/prossection";
import WhatNumberssaySection from "../../components/publicPages/HomePageComponents/WhatNumberssaySection";
import PlatformWalkthrough from "../../components/publicPages/HomePageComponents/WalkThrough";
import Testemotional from "../../components/publicPages/HomePageComponents/Testemotional";
import { useTheme } from "Context/ThemeContext";
import FAQSection from "../../components/publicPages/HomePageComponents/FAQSection"; 
import TestimonialsSection from "../../components/publicPages/HomePageComponents/Testemotional";


const HomePage: React.FC = () => {
  const { isDark: themeIsDark } = useTheme();
  return (
    <>
      <HeroSection />
      <CompanyLogosSection />
      <WhatNumberssaySection />
      <LiveSessionsLanding />
      <PlatformWalkthrough

        videoUrl={
          "https://www.youtube.com/embed/Y9-0Jj3avRg?si=A-35oqff_ahFSrqo"
        }
      />
      <FAQSection />
      <TestimonialsSection />
    </>
  );
};

export default HomePage;
