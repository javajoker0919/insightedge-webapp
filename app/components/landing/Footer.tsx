import Image from "next/image";
import Logo from "../Logo";

const LandingFooterSection = () => {
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
              { alt: "tiktok", src: "/icons/phosphor-tiktok-logo.svg" },
              { alt: "facebook", src: "/icons/phosphor-facebook-logo.svg" },
              { alt: "youtube", src: "/icons/phosphor-youtube-logo.svg" },
              { alt: "linkedin", src: "/icons/phosphor-linkedin-logo.svg" }
            ].map((icon, index) => (
              <div
                key={index}
                className="p-2 border border-solid border-[#F3F4F6FF] rounded-sm"
              >
                <Image width={24} height={24} alt={icon.alt} src={icon.src} />
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 sm:flex sm:flex-row gap-8 sm:gap-12 lg:gap-20 lg:mr-20">
          {[
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
          ))}
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
