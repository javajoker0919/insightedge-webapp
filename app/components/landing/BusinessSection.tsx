import { FaClock, FaRecycle } from "react-icons/fa";
import { MdOutlineToken } from "react-icons/md";

const LandingBusinessSection = () => {
  return (
    <section id="business" className="py-16 px-4 flex flex-col items-center">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center max-w-[60rem] mb-16 sm:mb-24 md:mb-32">
        What it means for{" "}
        <span className="text-primary-500">your business</span>
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 w-full items-start justify-center max-w-[80rem] gap-6">
        <BusinessFeature
          icon={
            <FaClock className="text-primary-500 w-16 h-16 sm:w-20 sm:h-20" />
          }
          title="TARGETED APPROACH"
          description="Align your sales and marketing approach to customers' most critical needs and projects."
        />
        <BusinessFeature
          icon={
            <FaRecycle className="text-primary-500 w-16 h-16 sm:w-20 sm:h-20" />
          }
          title="IMPROVE WIN RATES"
          description="Boost your conversion rate by aligning to customers' focus areas"
        />
        <BusinessFeature
          icon={
            <MdOutlineToken className="text-primary-500 w-16 h-16 sm:w-20 sm:h-20" />
          }
          title="BETTER PIPELINE QUALITY"
          description="Enhance pipeline quality through data-driven insights into customers' top priorities"
        />
      </div>
    </section>
  );
};

export default LandingBusinessSection;

const BusinessFeature: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 max-w-[25rem] w-full px-4 sm:px-0">
    {icon}
    <p className="text-primary-500 text-xl sm:text-2xl font-bold leading-8 sm:leading-9 text-center">
      {title}
    </p>
    <p className="text-center text-lg sm:text-xl leading-7 sm:leading-8 font-medium text-neutral-900 w-full sm:w-[15rem]">
      {description}
    </p>
  </div>
);
