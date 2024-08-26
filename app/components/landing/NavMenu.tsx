import Link from "next/link";
import { useAtomValue } from "jotai";
import { userMetadataAtom } from "@/utils/atoms";

const LandingNavMenuSection = ({
  scrollToSection
}: {
  scrollToSection: (sectionId: string) => void;
}) => {
  const userMetadata = useAtomValue(userMetadataAtom);
  return (
    <>
      <nav
        className={`flex flex-col md:flex-row md:justify-end items-center space-y-4 md:space-y-0 md:space-x-8 bg-white md:bg-transparent p-4 md:p-0`}
      >
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("business");
            }}
            className="w-full md:w-auto text-center hover:text-primary-600 transition-colors"
          >
            Benefits
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("summary");
            }}
            className="w-full md:w-auto text-center hover:text-primary-600 transition-colors"
          >
            Features
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("pricing");
            }}
            className="w-full md:w-auto text-center hover:text-primary-600 transition-colors"
          >
            Pricing
          </a>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-4">
          {userMetadata ? (
            <Link
              href={"/app"}
              className="w-full md:w-auto px-4 md:py-2 text-center md:bg-primary-600 text-black md:text-white rounded-full md:hover:bg-primary-700 transition-colors flex items-center justify-center"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <a
                href="/auth/sign-in"
                className="w-full md:w-auto px-4 md:py-2 text-center md:hover:text-primary-600 transition-colors md:border rounded-full flex items-center justify-center"
              >
                Log In
              </a>
              <a
                href="/auth/sign-up"
                className="w-full md:w-auto px-4 md:py-2 text-center md:bg-primary-600 text-black md:text-white rounded-full md:hover:bg-primary-700 transition-colors flex items-center justify-center"
              >
                Sign Up
              </a>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default LandingNavMenuSection;