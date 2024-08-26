const LandingScheduleSection = ({
  handleChange,
  handleSchedule,
  formData
}: {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSchedule: (e: React.FormEvent<HTMLFormElement>) => void;
  formData: {
    name: string;
    company: string;
    email: string;
  };
}) => {
  return (
    <div className="flex flex-col xl:flex-row w-full justify-center items-center gap-8 lg:gap-20 py-16 px-4 xl:px-0">
      <div className="w-full xl:w-[577px] h-[300px] lg:h-[512px] bg-primary-100 rounded-lg">
        <img
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Business team collaborating"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      <div className="flex flex-col w-full lg:max-w-[600px]">
        <h2 className="text-3xl lg:text-6xl font-bold leading-tight lg:leading-[64px] text-[#171A1FFF] mb-6 lg:mb-8 text-center lg:text-left">
          Generate your opportunities
        </h2>
        <form
          className="flex flex-col w-full gap-4 lg:gap-6"
          onSubmit={handleSchedule}
        >
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="peer px-4 lg:px-5 h-12 lg:h-14 w-full border-b border-blue-gray-200 bg-transparent font-sans text-base lg:text-lg font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
          />
          <input
            name="company"
            type="text"
            value={formData.company}
            onChange={handleChange}
            placeholder="Company"
            className="peer px-4 lg:px-5 h-12 lg:h-14 w-full border-b border-blue-gray-200 bg-transparent font-sans text-base lg:text-lg font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
          />
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email address"
            className="peer px-4 lg:px-5 h-12 lg:h-14 w-full border-b border-blue-gray-200 bg-transparent font-sans text-base lg:text-lg font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
          />
          <button
            type="submit"
            className="mt-4 lg:mt-6 w-full bg-primary-500 text-white rounded-full text-base lg:text-lg font-semibold py-3 lg:py-4 hover:bg-primary-600 active:bg-primary-700 transition-colors"
          >
            Schedule a demo
          </button>
        </form>
      </div>
    </div>
  );
};

export default LandingScheduleSection;
