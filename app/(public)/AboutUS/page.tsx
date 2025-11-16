import React from 'react';
import HeroSection from '../../components/publicPages/AboutUsComponents/HeroSection';
import CompanyLogosSection from '../../components/publicPages/HomePageComponents/CompanyLogosSection';
import AboutSectionCards from '../../components/publicPages/AboutUsComponents/AboutSectionCards';
import OurTeam from '../../components/publicPages/AboutUsComponents/OurTeam';
const AboutUsPage: React.FC = () => {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <AboutSectionCards />
      <OurTeam />
      <CompanyLogosSection />
    </div>
  );
};

export default AboutUsPage;
