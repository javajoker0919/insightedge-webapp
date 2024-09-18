import { useCallback } from "react";
import { FaLightbulb } from "react-icons/fa";

import { MarketingProps } from "./MarketingStrategySection";

interface MSTableCompProps {
  strategies: MarketingProps[];
  onQuickAction: (opp: MarketingProps) => void;
}

const MarketingStrategyTable: React.FC<MSTableCompProps> = ({
  strategies,
  onQuickAction,
}) => {
  const strats = strategies;

  const coloredChannelList = [
    { color: "#3C5DAC", content: "Default" },
    { color: "#FF0000", content: "Billboard Advertising" },
    { color: "#FF0000", content: "Cold Calling" },
    { color: "#FF0000", content: "Direct Mail" },
    { color: "#FF0000", content: "Television Advertising" },
    { color: "#FF0000", content: "Radio Advertising" },
    { color: "#00FF00", content: "Blog Posts" },
    { color: "#00FF00", content: "Industry Publications" },
    { color: "#00FF00", content: "Podcasts" },
    { color: "#00FF00", content: "Video Marketing" },
    { color: "#00FF00", content: "YouTube Channel" },
    { color: "#00FF00", content: "Case Studies" },
    { color: "#00FF00", content: "White Papers" },
    { color: "#00FF00", content: "Infographics" },
    { color: "#00FF00", content: "eBooks" },
    { color: "#00FF00", content: "Guest Blogging" },
    { color: "#00FF00", content: "Thought Leadership Articles" },
    { color: "#00FF00", content: "Newsletters" },
    { color: "#00FF00", content: "Webinar Series" },
    { color: "#00FF00", content: "Research Reports" },
    { color: "#0000FF", content: "Email Marketing" },
    { color: "#0000FF", content: "LinkedIn Advertising" },
    { color: "#0000FF", content: "Search Engine Optimization (SEO)" },
    { color: "#0000FF", content: "Chatbots" },
    { color: "#0000FF", content: "Pay-Per-Click Advertising (PPC)" },
    { color: "#0000FF", content: "Facebook Advertising" },
    { color: "#0000FF", content: "Twitter Marketing" },
    { color: "#0000FF", content: "Retargeting Ads" },
    { color: "#0000FF", content: "Display Advertising" },
    { color: "#0000FF", content: "Google My Business" },
    { color: "#0000FF", content: "Instagram Marketing" },
    { color: "#0000FF", content: "Affiliate Marketing" },
    { color: "#0000FF", content: "Quora Marketing" },
    { color: "#0000FF", content: "Reddit Marketing" },
    { color: "#0000FF", content: "SlideShare Presentations" },
    { color: "#0000FF", content: "Mobile App Marketing" },
    { color: "#0000FF", content: "Pinterest Marketing" },
    { color: "#FFFF00", content: "Trade Shows" },
    { color: "#FFFF00", content: "Webinars" },
    { color: "#FFFF00", content: "Networking Events" },
    { color: "#FFFF00", content: "Virtual Conferences" },
    { color: "#FFFF00", content: "Workshops" },
    { color: "#FFFF00", content: "Sponsorships" },
    { color: "#FFFF00", content: "Product Demos" },
    { color: "#FFFF00", content: "Roadshows" },
    { color: "#800080", content: "Partner Marketing" },
    { color: "#800080", content: "Referral Programs" },
    { color: "#800080", content: "Customer Advisory Boards" },
    { color: "#800080", content: "Industry Associations" },
    { color: "#800080", content: "Employee Advocacy" },
    { color: "#800080", content: "Strategic Alliances" },
  ];

  const TableHeadingRow = useCallback(
    () => (
      <tr className="bg-gray-100 text-black">
        <th className="px-4 py-3 text-center font-medium border-x border-gray-200 w-1/2">
          Tactic
        </th>
        <th className="px-4 py-3 text-center font-medium border-x border-gray-200 ">
          Target Personas
        </th>
        <th className="px-4 py-3 text-center font-medium border-x border-gray-200 w-2/12">
          Channels
        </th>
        <th className="px-4 py-3 text-center font-medium border-x border-gray-200 ">
          Quick Actions
        </th>
      </tr>
    ),
    []
  );

  return (
    <>
      {strats.length > 0 ? (
        <table className="w-full relative border-collapse min-w-[1200px]">
          <thead className="sticky z-10 top-0">
            <TableHeadingRow />
          </thead>
          <tbody className="text-center relative">
            {strats.map((strgy, index) => {
              return (
                <tr
                  key={`market-strategy-${index}`}
                  className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} ${
                    strategies.length > 0 ? "" : "blur"
                  }`}
                >
                  <td className="px-4 py-3 border text-left border-gray-200">
                    {strgy.tactic}
                  </td>
                  <td className="px-4 py-3 border border-gray-200 text-left ">
                    {strgy.targetPersonas.split(", ").map((aud, indx) => (
                      <span
                        key={`audience-${indx}-${aud}`}
                        className={`text-xs font-medium`}
                      >
                        {aud +
                          (strgy.targetPersonas?.split(", ").length - 1 !== indx
                            ? ", "
                            : "")}
                      </span>
                    ))}
                  </td>
                  <td className="px-4 py-3 border border-gray-200">
                    {strgy.channel.split(", ").map((chnl, indx) => {
                      const coloredChnl = coloredChannelList.find((el) =>
                        el.content.includes(chnl)
                      );
                      const foundColor =
                        coloredChnl?.color?.toLowerCase() || `#004AAD`;

                      return (
                        <span
                          key={`channel-${indx}-${chnl}`}
                          style={{
                            backgroundColor: `${foundColor}4d`,
                          }}
                          className={
                            "inline-block min-w-7 px-2 py-1 m-[2px] rounded-full text-xs font-medium"
                          }
                        >
                          {chnl}
                        </span>
                      );
                    })}
                  </td>
                  <td className="px-4 py-3 border border-gray-200">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => onQuickAction(strgy)}
                        className="text-primary-500 hover:text-white font-semibold justify-center border-primary-500 border flex items-center gap-1 rounded-full !min-w-fit p-1 px-2 hover:bg-primary-500"
                      >
                        Details <FaLightbulb />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {strategies.length === 0 && (
              <tr>
                <td colSpan={4}>
                  <div className="w-full h-full items-center flex justify-center absolute top-0 left-0">
                    <span className="text-4xl text-gray-600">No data</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      ) : (
        <div className="w-full">
          <table className="w-full border-collapse">
            <thead>
              <TableHeadingRow />
            </thead>
            <tbody>
              <tr>
                <td colSpan={4}>
                  <div className="w-full p-10 text-gray-500 text-xl flex items-center justify-center">
                    No data
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default MarketingStrategyTable;
