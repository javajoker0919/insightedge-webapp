import Link from "next/link";

import { getMixPanelClient } from "@/utils/mixpanel";

const LandingCreditSection = () => {
  const mixpanel = getMixPanelClient();

  return (
    <section id="pricing" className="py-12 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Compare our plans
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Start for free or choose among our paid plans for more power
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex justify-center mb-8 md:mb-12">
          <div className="inline-flex bg-white/70 rounded-full p-1 shadow-md">
            <button className="text-white bg-blue-600 py-2 px-4 md:px-6 rounded-full text-sm font-medium transition duration-300 hover:bg-blue-700">
              Monthly
            </button>
            <button className="text-gray-700 py-2 px-4 md:px-6 rounded-full text-sm font-medium transition duration-300 hover:bg-gray-100">
              Yearly
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Free Plan */}
          <div className="bg-white/60 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
            {/* Plan header */}
            <div className="p-6 md:p-8 bg-gradient-to-br from-blue-50/70 to-purple-50/70">
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                Free
              </h3>
              <div className="text-3xl md:text-4xl font-bold text-gray-900">
                $0{" "}
                <span className="text-base md:text-lg font-normal text-gray-600">
                  / month
                </span>
              </div>
              <Link
                href="/auth/sign-up"
                onClick={() => {
                  mixpanel.track("goto.sign_up", {
                    $source: "pricing.free",
                  });
                }}
                className="block w-full mt-4 md:mt-6 px-4 md:px-6 py-2 md:py-3 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-full transition duration-300 text-center"
              >
                Sign Up
              </Link>
            </div>
            {/* Plan features */}
            <ul className="p-6 md:p-8 space-y-3 md:space-y-4">
              <li className="text-gray-600 text-sm">
                General Summary of Earnings Call, Latest News & Press Releases
              </li>
              <li className="text-gray-600 text-sm">
                General Insights into Company Priorities, Challenges, Pain
                Points & Key Initiatives
              </li>
              <li className="text-gray-600 text-sm">
                Top general sales Opportunities based for the company earnings,
                news & updates
              </li>
              <li className="text-gray-600 text-sm">
                Top general Marketing Tactics based on the company profile
              </li>
              <li className="text-gray-600 text-sm">
                Max 1 Watch List to track companies
              </li>
            </ul>
          </div>

          {/* Premium Plan */}
          <div className="bg-white/70 rounded-3xl overflow-hidden shadow-xl border-2 border-blue-500 transform scale-105 relative">
            {/* Popular badge */}
            <div className="bg-blue-500 text-white text-xs md:text-sm font-bold uppercase py-1 px-2 md:px-4 absolute right-0 top-0 rounded-bl-lg">
              Popular
            </div>
            {/* Plan header */}
            <div className="p-6 md:p-8 bg-gradient-to-br from-blue-100/70 to-purple-100/70">
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                Premium
              </h3>
              <div className="text-3xl md:text-4xl font-bold text-gray-900">
                $99{" "}
                <span className="text-base md:text-lg font-normal text-gray-600">
                  / month
                </span>
              </div>
              <Link
                href="/auth/sign-up"
                onClick={() => {
                  mixpanel.track("goto.sign_up", {
                    $source: "pricing.premium",
                  });
                }}
                className="block w-full mt-4 md:mt-6 px-4 md:px-6 py-2 md:py-3 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-full transition duration-300 text-center"
              >
                Sign Up
              </Link>
            </div>
            {/* Plan features */}
            <ul className="p-6 md:p-8 space-y-3 md:space-y-4">
              <li className="text-gray-600 text-sm">Everything in Free Tier</li>
              <li className="text-gray-600 text-sm">
                Tailored insights into Company Priorities, Challenges, Pain
                Points & Key Initiatives to your offerings
              </li>
              <li className="text-gray-600 text-sm">
                Tailored sales Opportunities based on your offerings
              </li>
              <li className="text-gray-600 text-sm">
                Identify buyers for each opportunity
              </li>
              <li className="text-gray-600 text-sm">
                Tailored inobund and outbound strategies each sales opportunity
              </li>
              <li className="text-gray-600 text-sm">
                Tailored Marketing Strategy based on your offerings
              </li>
              <li className="text-gray-600 text-sm">
                Unlimited Watch Lists to track companies
              </li>
              <li className="text-gray-600 text-sm">Emailed to your Inbox</li>
              <li className="text-gray-600 text-sm">Priority Support</li>
            </ul>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white/60 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
            {/* Plan header */}
            <div className="p-6 md:p-8 bg-gradient-to-br from-gray-100/70 to-blue-100/70">
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                Enterprise
              </h3>
              <div className="text-3xl md:text-4xl font-bold text-gray-900">
                Custom
              </div>
              <a
                href="https://calendly.com/pratik-padooru-prospectedge/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full mt-4 md:mt-6 px-4 md:px-6 py-2 md:py-3 text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 rounded-full transition duration-300 text-center"
              >
                Contact Sales
              </a>
            </div>
            {/* Plan features */}
            <ul className="p-6 md:p-8 space-y-3 md:space-y-4">
              <li className="text-gray-600 text-sm">
                Custom Integrations to existing CRM & systems
              </li>
              <li className="text-gray-600 text-sm">
                Personalized onboarding and training
              </li>
              <li className="text-gray-600 text-sm">
                Custom AI implementation
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingCreditSection;
