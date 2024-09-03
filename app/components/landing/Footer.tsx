import Image from "next/image";
import Logo from "../Logo";
import Link from "next/link";
import { FaTwitter } from "react-icons/fa";
import { getMixPanelClient } from "@/utils/mixpanel";

const LandingFooterSection = ({
  scrollToSection,
}: {
  scrollToSection: (sectionId: string) => void;
}) => {
  const mixpanel = getMixPanelClient();

  return (
    <footer id="cta" className="mt-20">
      <div className="flex flex-col px-4 sm:px-6 lg:px-20 lg:flex-row justify-between items-center w-full">
        <div className="flex flex-col items-center lg:items-start mb-8 lg:mb-0">
          <Logo
            onClick={() => {
              mixpanel.track("logo.click", {
                $source: "landing.footer",
              });
            }}
            withIcon
          />

          <div className="flex flex-row gap-4 mt-6 lg:mt-8 lg:ml-[100px]">
            {[
              {
                alt: "youtube",
                component: (
                  <Image
                    width={24}
                    height={24}
                    alt="youtube"
                    src="/icons/phosphor-youtube-logo.svg"
                    className="text-gray-800"
                  />
                ), // Updated to match twitter icon
                url: "https://www.youtube.com",
              },
              {
                alt: "linkedin",
                component: (
                  <Image
                    width={24}
                    height={24}
                    alt="linkedin"
                    src="/icons/phosphor-linkedin-logo.svg"
                    className="text-gray-800"
                  />
                ), // Updated to match twitter icon
                url: "https://www.linkedin.com",
              },
              {
                alt: "twitter",
                component: <FaTwitter size={24} className="text-gray-800" />, // Updated color to dark gray
                url: "https://www.twitter.com",
              },
            ].map((icon, index) => (
              <Link
                key={index}
                href={icon.url}
                className="p-2 border border-solid border-[#F3F4F6FF] rounded-sm"
              >
                {icon.component}
              </Link>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 sm:flex sm:flex-row gap-8 sm:gap-12 lg:gap-20 lg:mr-20">
          <div className="flex flex-col gap-3 text-sm font-medium text-[#171A1FFF]">
            <Link href="/">Home</Link> {/* Updated link */}
            <Link href="/features">Features</Link>
            <Link href="/pricing">Pricing</Link>
          </div>
          <div className="flex flex-col gap-3 text-sm font-medium text-[#171A1FFF]">
            <Link href="/">Resources</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/">Guides</Link>
          </div>
          <div className="flex flex-col gap-3 text-sm font-medium text-[#171A1FFF]">
            <Link href="/">Legal</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center lg:flex-row lg:justify-between px-4 sm:px-6 lg:px-20 mt-12 lg:mt-20 py-8 border-t border-[#F3F4F6FF]">
        <div className="flex flex-col gap-1 text-center lg:text-left mb-4 lg:mb-0"></div>
        <div className="flex">
          <p className="text-xs font-normal text-[#6F7787FF] leading-5">
            @2024 ProspectEdge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooterSection;
