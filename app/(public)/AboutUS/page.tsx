import React from 'react';
import HeroSection from '../../components/AboutUsComponents/HeroSection';
import CompanyLogosSection from '../../components/HomePageComponents/CompanyLogosSection';
import AboutSectionCards from '../../components/AboutUsComponents/AboutSectionCards';
import OurTeam from '../../components/AboutUsComponents/OurTeam';
import MainLayout from '../../layout';

const AboutUsPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="flex flex-col w-full">
        <HeroSection />
        <AboutSectionCards />
        <OurTeam />
        <CompanyLogosSection />
      </div>
    </MainLayout>
  );
};

export default AboutUsPage;
