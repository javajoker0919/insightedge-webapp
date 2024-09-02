"use client";
import LandingHeaderSection from "../components/landing/Header";
import LandingFooterSection from "../components/landing/Footer";

const Terms = () => {
  return (
    <div className="w-full h-screen overflow-y-auto">
      <LandingHeaderSection />
      <div className="flex flex-col items-center justify-start w-full min-">
        <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            ProspectEdge Terms of Service
          </h1>
          <p className="text-sm text-gray-500 mb-12">
            Last Updated: April 1, 2024
          </p>

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                1. Permissions
              </h2>
              <p className="text-gray-600">
                1.1 The Service includes customizable settings allowing Users to
                grant permissions to other Users to perform various tasks within
                the Service ("Permissions").
              </p>
              <p className="text-gray-600 mt-2">
                1.2 It is solely the Customer's responsibility to set and manage
                all Permissions, including determining which Users can set such
                Permissions.
              </p>
              <p className="text-gray-600 mt-2">
                1.3 ProspectEdge has no responsibility for managing Permissions
                and no liability for Permissions set by the Customer and its
                Users.
              </p>
              <p className="text-gray-600 mt-2">
                1.4 The Customer may provide access to the Service to its
                Affiliates, in which case all rights granted and obligations
                incurred under this Agreement shall extend to such Affiliates.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. Restrictions
              </h2>
              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">
                2.1 Customer's Responsibilities
              </h3>
              <p className="text-gray-600">
                The Customer is responsible for all activity on its account and
                those of its Users, except where such activity results from
                unauthorized access due to vulnerabilities in the Service
                itself.
              </p>
              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">
                2.2 Use Restrictions
              </h3>
              <p className="text-gray-600">
                The Customer agrees not to, and not to permit Users or third
                parties to, directly or indirectly: (a) modify, translate, copy,
                or create derivative works based on the Service; (b) reverse
                engineer, decompile, or attempt to discover the source code or
                underlying ideas of the Service, except as permitted by law; (c)
                sublicense, sell, rent, lease, distribute, or otherwise
                commercially exploit the Service; ...
              </p>
              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">
                2.3 API Access Restrictions
              </h3>
              <p className="text-gray-600">
                ProspectEdge may provide access to APIs as part of the Service.
                ProspectEdge reserves the right to set and enforce usage limits
                on the APIs, and the Customer agrees to comply with such limits.
              </p>
            </section>
          </div>
        </div>
      </div>
      <LandingFooterSection scrollToSection={(sectionId: string) => {}} />
    </div>
  );
};

export default Terms;
