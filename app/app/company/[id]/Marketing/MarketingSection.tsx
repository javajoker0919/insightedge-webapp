import { useState, useEffect } from "react";
import {
  Field,
  Fieldset,
  Input,
  Label,
  Legend,
  Textarea,
} from "@headlessui/react";

import { FiStar, FiCalendar, FiFlag } from "react-icons/fi";
import { ImInfo } from "react-icons/im";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { LuBarChartHorizontal, LuLineChart, LuTags } from "react-icons/lu";
import { TfiSignal } from "react-icons/tfi";
import { FaTools, FaRegLightbulb } from "react-icons/fa";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { PiUsersThree } from "react-icons/pi";

import Modal from "@/app/components/Modal";
import { marketingStrategy } from "../Constants";
import MarketingStrategyTable from "./MarketingStrategyTable";

interface MarketingCompProps {
  companyID: number;
  companyName: string;
  year?: number | null;
  quarter?: number | null;
}

export interface MarketingProps {
  marketingTactic: string;
  tacticScore: number;
  tacticType: string;
  relevantAudience: string;
  channels: string[];
  tacticalDetails: {
    description: string;
    keyMessages: string[];
    callToAction: string;
    expectedROI: string;
    implementationTimeframe: string;
    requiredResources: string[];
    successMetrics: string[];
  };
  alignmentWithCompanyGoals: string[];
}

const MarketingSection: React.FC<MarketingCompProps> = ({
  companyID,
  companyName,
}) => {
  const [activeTab, setActiveTab] = useState<"general" | "tailored">("general");
  const [selectedStrats, setSelectedStrats] = useState<MarketingProps | null>(
    null
  );
  const [generalStrats, setGeneralStrats] = useState<MarketingProps[] | null>(
    null
  );
  const [tailoredStrats, setTailoredStrats] = useState<MarketingProps[] | null>(
    null
  );

  const [isGeneralLoading, setIsGeneralLoading] = useState<boolean>(false);
  const [isTailoredLoading, setIsTailoredLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsGeneralLoading(true);
    setIsTailoredLoading(true);

    setGeneralStrats(null);
    setTailoredStrats(null);
  }, []);

  useEffect(() => {
    setGeneralStrats(marketingStrategy);
    setTailoredStrats(marketingStrategy);

    setIsGeneralLoading(false);
    setIsTailoredLoading(false);
  }, [marketingStrategy]);

  const handleQuickAction = (strt: MarketingProps) => {
    setSelectedStrats(strt);
  };

  return (
    <div className="bg-indigo border border-gray-300 rounded-lg overflow-hidden">
      <div className="w-full border-b border-gray-300 flex items-center bg-gray-100 justify-between">
        <div className="flex">
          <button
            onClick={() => setActiveTab("general")}
            className={`px-4 py-4 border-indigo-600 border-b-2 ${
              activeTab === "general"
                ? "text-indigo-600 border-opacity-100"
                : "text-gray-600 border-opacity-0 hover:border-gray-300 hover:border-opacity-100 hover:text-gray-900"
            }`}
          >
            General Marketing Strategy
          </button>
          <button
            onClick={() => setActiveTab("tailored")}
            className={`px-4 py-4 border-indigo-600 border-b-2 ${
              activeTab === "tailored"
                ? "text-indigo-600 border-opacity-100"
                : "text-gray-600 border-opacity-0 hover:border-gray-300 hover:border-opacity-100 hover:text-gray-900"
            }`}
          >
            Tailored Marketing Strategy
          </button>
        </div>
      </div>

      <div className="overflow-x-auto overflow-y-auto max-h-[500px] text-sm">
        {activeTab === "general" &&
          (isGeneralLoading ? (
            <LoadingSection />
          ) : (
            <>
              <div className="p-4 bg-gray-100 text-black">
                {companyName}'s top Marketing Strategy.
                {tailoredStrats?.length === 0 && (
                  <span>
                    To find the best ways to sell your solutions to{" "}
                    {companyName}, click "Generate Tailored Marketing Strategy."
                  </span>
                )}
              </div>
              {generalStrats && (
                <MarketingStrategyTable
                  companyName={companyName}
                  strategies={generalStrats.sort(() => Math.random() - 0.5)}
                  // SM_NOTE: remove this suffeling later
                  onQuickAction={handleQuickAction}
                />
              )}
            </>
          ))}
        {activeTab === "tailored" &&
          (isTailoredLoading ? (
            <LoadingSection />
          ) : (
            <>
              <div className="p-4 bg-gray-100 text-black">
                Below is your company specific marketing strategy. You can
                explore the top marketing tactics for selling your solutions to{" "}
                {companyName}
              </div>
              {tailoredStrats && (
                <MarketingStrategyTable
                  companyName={companyName}
                  strategies={tailoredStrats.sort(() => Math.random() - 0.5)}
                  // SM_NOTE: remove this suffeling later
                  onQuickAction={handleQuickAction}
                />
              )}
            </>
          ))}
      </div>

      <Modal
        wrapperClass="backdrop-blur-[2px]"
        modalClass="min-w-[600px] max-h-[600px] max-w-full p-0 rounded-lg shadow-lg"
        isOpen={!!selectedStrats}
        onClose={() => setSelectedStrats(null)}
      >
        <Fieldset className="rounded-lg bg-white shadow-sm">
          <Legend className="text-xl font-bold text-indigo-600 p-4">
            Account-Based Marketing Plan
          </Legend>
          <div className="max-h-[500px] overflow-y-auto space-y-4 px-4 pb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field>
                <Label className="text-sm font-medium text-gray-700">
                  Marketing Tactic:
                </Label>
                <div className="relative mt-1">
                  <Input
                    className="block w-full rounded-md bg-gray-100 py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter tactic"
                  />
                  <FaRegLightbulb className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </Field>
              <Field>
                <Label className="text-sm font-medium text-gray-700">
                  Tactic Score:
                </Label>
                <div className="relative mt-1">
                  <Input
                    className="block w-full rounded-md bg-gray-100 py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter score"
                  />
                  <FiStar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </Field>
              <Field>
                <Label className="text-sm font-medium text-gray-700">
                  Tactic Type:
                </Label>
                <div className="relative mt-1">
                  <Input
                    className="block w-full rounded-md bg-gray-100 py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter type"
                  />
                  <LuTags className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </Field>
              <Field>
                <Label className="text-sm font-medium text-gray-700">
                  Relevant Audience:
                </Label>
                <div className="relative mt-1">
                  <Input
                    className="block w-full rounded-md bg-gray-100 py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter audience"
                  />
                  <PiUsersThree className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </Field>
              <Field>
                <Label className="text-sm font-medium text-gray-700">
                  Channels:
                </Label>
                <div className="relative mt-1">
                  <Input
                    className="block w-full rounded-md bg-gray-100 py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Seperate with commas"
                  />
                  <TfiSignal className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </Field>
              <Field>
                <Label className="text-sm font-medium text-gray-700">
                  Call to Action:
                </Label>
                <div className="relative mt-1">
                  <Input
                    className="block w-full rounded-md bg-gray-100 py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter timeframe"
                  />
                  <HiOutlineSpeakerphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </Field>
              <Field>
                <Label className="text-sm font-medium text-gray-700">
                  Expected ROI:
                </Label>
                <div className="relative mt-1">
                  <Input
                    className="block w-full rounded-md bg-gray-100 py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter ROI"
                  />
                  <LuLineChart className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </Field>
              <Field>
                <Label className="text-sm font-medium text-gray-700">
                  Implementation Timeframe:
                </Label>
                <div className="relative mt-1">
                  <Input
                    className="block w-full rounded-md bg-gray-100 py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter timeframe"
                  />
                  <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </Field>
              <Field className="col-span-1 sm:col-span-2">
                <Label className="text-sm font-medium text-gray-700">
                  Tactic Description:
                </Label>
                <div className="relative mt-1">
                  <Textarea
                    className="block w-full rounded-md bg-gray-100 py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    rows={3}
                    placeholder="Describe the tactic"
                  />
                  <ImInfo className="absolute left-3 top-3 text-gray-400" />
                </div>
              </Field>
              <Field>
                <Label className="text-sm font-medium text-gray-700">
                  Key Messages:
                </Label>
                <div className="relative mt-1">
                  <Textarea
                    className="block w-full rounded-md bg-gray-100 py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    rows={2}
                    placeholder="One per line"
                  />
                  <IoChatbubbleEllipsesOutline className="absolute left-3 top-3 text-gray-400" />
                </div>
              </Field>
              <Field>
                <Label className="text-sm font-medium text-gray-700">
                  Required Resources:
                </Label>
                <div className="relative mt-1">
                  <Textarea
                    className="block w-full rounded-md bg-gray-100 py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    rows={2}
                    placeholder="One per line"
                  />
                  <FaTools className="absolute left-3 top-3 text-gray-400" />
                </div>
              </Field>
              <Field>
                <Label className="text-sm font-medium text-gray-700">
                  Success Metrics:
                </Label>
                <div className="relative mt-1">
                  <Textarea
                    className="block w-full rounded-md bg-gray-100 py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    rows={2}
                    placeholder="One per line"
                  />
                  <LuBarChartHorizontal className="absolute left-3 top-3 text-gray-400" />
                </div>
              </Field>
              <Field>
                <Label className="text-sm font-medium text-gray-700">
                  Alignment with Company Goals:
                </Label>
                <div className="relative mt-1">
                  <Textarea
                    className="block w-full rounded-md bg-gray-100 py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    rows={2}
                    placeholder="One per line"
                  />
                  <FiFlag className="absolute left-3 top-3 text-gray-400" />
                </div>
              </Field>
            </div>
          </div>
          {/* <div className="flex justify-end p-4">
            <button className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md shadow-md hover:bg-indigo-700">
              Go Peroform Action
            </button>
          </div> */}
        </Fieldset>
      </Modal>
    </div>
  );
};

const LoadingSection: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-44">
      <span className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
    </div>
  );
};

export default MarketingSection;
