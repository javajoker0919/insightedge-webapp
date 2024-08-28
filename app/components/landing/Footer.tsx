import Image from "next/image";
import Logo from "../Logo";
import Link from "next/link";

const LandingFooterSection = ({
  scrollToSection
}: {
  scrollToSection: (sectionId: string) => void;
}) => {
  return (
    <footer id="cta" className="mt-20">
      <div className="flex flex-col px-4 sm:px-6 lg:px-20 lg:flex-row justify-between items-center w-full">
        <div className="flex flex-col items-center lg:items-start mb-8 lg:mb-0">
          <div className="flex items-center">
            <Image
              src={"/favicon.png"}
              alt={"ProspectEdge"}
              width={40}
              height={40}
            />
            <Logo />
          </div>
          <div className="flex flex-row gap-4 mt-6 lg:mt-8 lg:ml-[100px]">
            {[
              {
                alt: "tiktok",
                src: "/icons/phosphor-tiktok-logo.svg",
                url: "https://www.tiktok.com"
              },
              {
                alt: "facebook",
                src: "/icons/phosphor-facebook-logo.svg",
                url: "https://www.facebook.com"
              },
              {
                alt: "youtube",
                src: "/icons/phosphor-youtube-logo.svg",
                url: "https://www.youtube.com"
              },
              {
                alt: "linkedin",
                src: "/icons/phosphor-linkedin-logo.svg",
                url: "https://www.linkedin.com"
              }
            ].map((icon, index) => (
              <Link
                key={index}
                href={icon.url}
                className="p-2 border border-solid border-[#F3F4F6FF] rounded-sm"
              >
                <Image width={24} height={24} alt={icon.alt} src={icon.src} />
              </Link>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 sm:flex sm:flex-row gap-8 sm:gap-12 lg:gap-20 lg:mr-20">
          {/* {[
            { title: "Product", items: ["Features", "Pricing"] },
            { title: "Resources", items: ["Blog", "User guides"] },
            { title: "Legal", items: ["Privacy", "Terms"] }
          ].map((section, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 text-sm font-medium text-[#171A1FFF]"
            >
              <p className="font-semibold">{section.title}</p>
              {section.items.map((item, itemIndex) => (
                <p key={itemIndex}>{item}</p>
              ))}
            </div>
          ))} */}
          <div className="flex flex-col gap-3 text-sm font-medium text-[#171A1FFF]">
            <Link href="/">Product</Link>
            <Link
              href="/"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("summary");
              }}
            >
              Features
            </Link>
            <Link
              href="/"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("pricing");
              }}
            >
              Pricing
            </Link>
          </div>
          <div className="flex flex-col gap-3 text-sm font-medium text-[#171A1FFF]">
            <Link href="/">Resources</Link>
            <Link href="/">Blog</Link>
            <Link href="/">guides</Link>
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
