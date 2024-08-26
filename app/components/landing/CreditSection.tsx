const LandingCreditSection = () => {
  return (
    <section
      id="pricing"
      className="py-16 px-4 flex flex-col items-center gap-10"
    >
      <div className="text-[40px] leading-[56px] font-bold text-center max-w-[60rem]">
        <span className="text-primary-500">Compare our plans</span> and find
        yours
        <p className="text-base text-neutral-500 font-normal leading-[26px] mt-3">
          Start for free or choose among our paid plans for more power
        </p>
      </div>
      <div className="w-full max-w-7xl mx-auto font-sans p-4">
        <div className="flex justify-center mb-16">
          <div className="inline-flex bg-gray-100 rounded-full p-1">
            <button className="text-white bg-blue-600 py-2 px-4 rounded-full text-sm font-medium">
              Monthly
            </button>
            <button className="text-gray-700 py-2 px-4 rounded-full text-sm font-medium">
              Yearly
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg p-8">
            <div className="text-left">
              <h4 className="text-gray-800 font-semibold text-2xl">Free</h4>
              <h3 className="text-gray-800 font-semibold text-3xl mt-4">
                $0
                <span className="text-sm font-medium text-gray-600 ml-1">
                  / user
                </span>
                <span className="text-sm font-medium text-gray-600 ml-1">
                  / month
                </span>
              </h3>
              <button
                type="button"
                className="w-full mt-8 px-6 py-3 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-full transition duration-300"
              >
                Sign Up
              </button>
            </div>

            <ul className="mt-8 space-y-4">
              <li className="flex items-center justify-center">
                <svg
                  className="w-9 h-9 text-blue-600 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-600 text-sm flex-1 w-full">
                  General Summary of Earnings Call, Latest News & Press Releases
                </span>
              </li>
              <li className="flex items-center justify-center">
                <svg
                  className="w-9 h-9 text-blue-600 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-600 text-sm flex-1 w-full">
                  General Insights into Company Priorities, Challenges, Pain
                  Points & Key Initiatives
                </span>
              </li>
              <li className="flex items-center justify-center">
                <svg
                  className="w-9 h-9 text-blue-600 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-600 text-sm flex-1 w-full">
                  Top general sales Opportunities based for the company
                  earnings, news & updates
                </span>
              </li>
              <li className="flex items-center justify-center">
                <svg
                  className="w-9 h-9 text-blue-600 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-600 text-sm flex-1 w-full">
                  Top general Marketing Tactics based on the company profile
                </span>
              </li>
              <li className="flex items-center justify-center">
                <svg
                  className="w-9 h-9 text-blue-600 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-600 text-sm flex-1 w-full">
                  Max 1 Watch List to track companies
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden shadow-xl p-8 transform scale-105 border-2 border-blue-500 relative">
            <span className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 text-sm font-bold rounded-bl-lg">
              Popular
            </span>
            <div className="text-left">
              <h4 className="text-gray-800 font-semibold text-2xl">Premium</h4>
              <h3 className="text-gray-800 font-semibold text-3xl mt-4">
                $99
                <span className="text-sm font-medium text-gray-600 ml-1">
                  / user
                </span>
                <span className="text-sm font-medium text-gray-600 ml-1">
                  / month
                </span>
              </h3>
              <button
                type="button"
                className="w-full mt-8 px-6 py-3 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-full transition duration-300"
              >
                Subscribe
              </button>
            </div>

            <ul className="mt-8 space-y-4">
              <li className="flex items-center justify-center">
                <svg
                  className="w-9 h-9 text-blue-600 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-600 text-sm flex w-full">
                  Everything in Free Tier
                </span>
              </li>
              <li className="flex items-center justify-center">
                <svg
                  className="w-9 h-9 text-blue-600 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-600 text-sm flex w-full">
                  Tailored insights into Company Priorities, Challenges, Pain
                  Points & Key Initiatives to your offerings
                </span>
              </li>
              <li className="flex items-center justify-center">
                <svg
                  className="w-9 h-9 text-blue-600 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-600 text-sm flex w-full">
                  Tailored sales Opportunities based on your offerings
                </span>
              </li>
              <li className="flex items-center justify-center">
                <svg
                  className="w-9 h-9 text-blue-600 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-600 text-sm flex w-full">
                  Identify buyers for each opportunity
                </span>
              </li>
              <li className="flex items-center justify-center">
                <svg
                  className="w-9 h-9 text-blue-600 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-600 text-sm flex w-full">
                  Tailored inobund and outbound strategies each sales
                  opportunity
                </span>
              </li>
              <li className="flex items-center justify-center">
                <svg
                  className="w-9 h-9 text-blue-600 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-600 text-sm flex w-full">
                  Tailored Marketing Strategy based on your offerings
                </span>
              </li>
              <li className="flex items-center justify-center">
                <svg
                  className="w-9 h-9 text-blue-600 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-600 text-sm flex w-full">
                  Unlimited Watch Lists to track companies
                </span>
              </li>
              <li className="flex items-center justify-center ">
                <svg
                  className="w-9 h-9 text-blue-600 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-600 text-sm flex w-full">
                  Emailed to your Inbox
                </span>
              </li>
              <li className="flex items-center justify-center">
                <svg
                  className="w-9 h-9 text-blue-600 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-600 text-sm flex w-full">
                  Priority Support
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden shadow-lg p-8">
            <div className="text-left">
              <h4 className="text-gray-800 font-semibold text-2xl">
                Enterprise
              </h4>
              <h3 className="text-gray-800 font-semibold text-3xl mt-4">
                Custom
              </h3>
              <button
                type="button"
                className="w-full mt-8 px-6 py-3 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-full transition duration-300"
              >
                Contact Sales
              </button>
            </div>

            <ul className="mt-8 space-y-4">
              <li className="flex items-center justify-center">
                <svg
                  className="w-9 h-9 text-blue-600 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-600 text-sm flex w-full">
                  Custom Integrations to existing CRM & systems
                </span>
              </li>
              <li className="flex items-center justify-center">
                <svg
                  className="w-9 h-9 text-blue-600 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-600 text-sm flex w-full">
                  Personalized onboarding and training
                </span>
              </li>
              <li className="flex items-center justify-center">
                <svg
                  className="w-9 h-9 text-blue-600 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-600 text-sm flex w-full">
                  Custom AI implementation
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingCreditSection;
