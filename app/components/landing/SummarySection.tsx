const LandingSummarySection = () => {
  return (
    <section
      id="summary"
      className="py-8 md:py-16 px-4 flex flex-col items-center"
    >
      <h1 className="text-3xl md:text-[42px] leading-tight md:leading-[60px] font-bold text-center max-w-[60rem] mb-3 md:mb-5">
        Tailored insights and opportunities{" "}
        <span className="text-primary-500">delivered to your inbox</span>
      </h1>
      <p className="text-base md:text-[18px] leading-normal md:leading-7 font-normal text-neutral-600 max-w-[70rem] text-center mb-8 md:mb-5">
        Customize your outreach using insights from executive statements in
        earnings calls and press releases for your key accounts. Understand
        customer priorities, key initiatives, challenges & painpoints.
      </p>

      <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-6 mb-8 md:mb-5">
        <div className="w-full lg:w-1/2 h-[18rem] md:h-[22rem] relative">
          <video className="h-full w-full object-cover rounded-lg" controls>
            <source
              src="https://docs.material-tailwind.com/demo.mp4"
              type="video/mp4"
            />
          </video>
        </div>
        <SummaryContent />
      </div>
      <div className="flex flex-col lg:flex-row-reverse items-center gap-8">
        <div className="w-full lg:w-1/2 h-[18rem] md:h-[22rem] relative">
          <video className="h-full w-full object-cover rounded-lg" controls>
            <source
              src="https://docs.material-tailwind.com/demo.mp4"
              type="video/mp4"
            />
          </video>
        </div>
        <DashboardContent />
      </div>
    </section>
  );
};

export default LandingSummarySection;

const SummaryContent: React.FC = () => (
  <div className="flex flex-col gap-4 md:gap-6 p-4 md:p-6 md:pr-0 max-w-full lg:max-w-[35rem]">
    <p className="text-gray-600 text-xs md:text-sm">
      TAILORED ACCOUNT SPECIFIC STRATEGIES
    </p>
    <p className="text-2xl md:text-4xl font-bold text-primary-500 leading-tight md:leading-[56px]">
      Targeted Sales & Marketing
    </p>
    <div className="flex flex-col gap-1 text-gray-600 text-sm">
      <ul className="list-disc text-base md:text-xl font-normal leading-relaxed md:leading-8 ml-5 md:ml-10">
        <li>
          Generate growth opportunities based on customer priorities and market
          trends
        </li>
        <li>
          Develop strategies using insights from earnings calls, press releases,
          and customer pain points to tailor your messaging and value
          proposition
        </li>
        <li>
          Gain an edge by addressing specific customer needs, optimizing
          engagement through customer-focused messaging
        </li>
      </ul>
    </div>
  </div>
);

const DashboardContent: React.FC = () => (
  <div className="flex flex-col gap-4 md:gap-6 p-4 md:p-6 md:pl-0 max-w-full lg:max-w-[35rem]">
    <p className="text-neutral-600 text-xs md:text-base">
      DATA DRIVEN CUSTOMER ENGAGEMENT
    </p>
    <p className="text-2xl md:text-4xl font-bold text-primary-500 leading-tight md:leading-[56px]">
      Actionable Insights
    </p>
    <div className="flex flex-col gap-1 text-gray-600 text-sm">
      <ul className="list-disc text-base md:text-xl font-normal leading-relaxed md:leading-8 ml-5 md:ml-10">
        <li>
          Identify key business priorities and mission-critical projects driving
          customer decisions. Understand their core focus areas to tailor your
          approach.
        </li>
        <li>
          Reveal critical pain points and obstacles affecting your target
          accounts most important objectives. Recognize how these challenges
          impact their strategic goals.
        </li>
        <li>
          Demonstrate how your solutions directly support their mission-critical
          projects and focus areas, enhancing your conversion potential.
        </li>
      </ul>
    </div>
  </div>
);
