import { IoTelescope } from "react-icons/io5";
import { FaPuzzlePiece } from "react-icons/fa6";
import { FaBookReader } from "react-icons/fa";
import { LuBrainCircuit } from "react-icons/lu";

const LandingSalesAndMarketingSection = () => {
  return (
    <section
      id="salesandmarketing"
      className="py-16 px-4 flex flex-col items-center"
    >
      <h1 className="text-3xl md:text-[40px] leading-tight md:leading-[56px] font-bold text-center max-w-[994px] px-4 md:px-10 flex flex-col">
        Avoid wasted sales & marketing efforts.
        <span className="text-primary-500">
          Focus your time on what matters most for your sales planning accounts.
        </span>
      </h1>
      <p className="text-lg md:text-2xl leading-normal md:leading-9 font-normal text-neutral-600 text-center max-w-3xl mx-auto mt-3 mb-8 md:mb-16">
        Align your Sales and Marketing approach to meet your clients needs and
        focus areas.
      </p>
      <div className="flex flex-col items-center justify-center gap-10 md:gap-20 w-full max-w-[90rem]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Feature
            icon={
              <IoTelescope className="w-8 h-8 md:w-12 md:h-12 text-primary-500" />
            }
            title="Targeted Sales Opportunities"
            description="Identify top sales opportunities 
          tailored to your offerings & identify buyers."
          />
          <Feature
            icon={
              <FaPuzzlePiece className="w-8 h-8 md:w-12 md:h-12 text-primary-500" />
            }
            title="Account Based Marketing"
            description="Generate targeted marketing tactics for each account aligned to your offerings and customer needs."
          />
          <Feature
            icon={
              <FaBookReader className="w-8 h-8 md:w-12 md:h-12 text-primary-500" />
            }
            title="Actionable Insights"
            description="Discover key initiatives, priorities, challenges & pain points."
          />
          <Feature
            icon={
              <LuBrainCircuit className="w-8 h-8 md:w-12 md:h-12 text-primary-500" />
            }
            title="Prioritize Accounts"
            description="Identity and prioritize high-potential accounts based on financial outlook and earnings summary"
          />
        </div>
      </div>
    </section>
  );
};

export default LandingSalesAndMarketingSection;

const Feature: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4">
    <div className="rounded-full flex items-center justify-center w-20 h-20 md:w-[102px] md:h-[102px] bg-primary-50 flex-shrink-0">
      {icon}
    </div>
    <div className="flex flex-col gap-1 max-w-[23rem]">
      <p className="text-primary-500 text-xl md:text-2xl leading-8 font-bold">
        {title}
      </p>
      <p className="text-gray-400 text-base md:text-xl">{description}</p>
    </div>
  </div>
);
