import React from "react";
import LandingFooterSection from "../LandingFooterSection"; // Adjust the path as necessary

const FeatureFooterSection: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    // Implement scrolling logic if needed, or leave empty
  };

  return (
    <footer className="py-10 text-center">
      <LandingFooterSection scrollToSection={scrollToSection} />
    </footer>
  );
};

export default FeatureFooterSection;
