import { useState } from "react";
import Modal from "@/app/components/Modal";
import { Details } from "..";

interface MarketingPlanModalProps {
  open: boolean;
  onClose: () => void;
  selectedStrats: {
    tactic: string;
    tacticScore: number;
    targetPersonas: string;
    channel: string;
    valueProposition: string;
    keyPerformanceIndicators: string[];
    strategicAlignment: string;
    callToAction: string;
  } | null;
}

const MarketingPlanModal: React.FC<MarketingPlanModalProps> = ({
  open,
  onClose,
  selectedStrats,
}) => {
  return (
    <Modal
      wrapperClass="backdrop-blur-[2px]"
      modalClass="min-w-[80rem] max-w-full"
      isOpen={open}
      onClose={onClose}
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xl font-bold text-primary-600">
          Prospecting Tactics
        </h4>
      </div>
      {selectedStrats && (
        <>
          <Details
            key={"campaign-details"}
            title="Campaign Details"
            wrapperClass="border-primary-600 bg-[#f5f5ff]"
            headClass="hover:bg-[#f5f5ff] text-gray-800"
          >
            <ul className="list-disc pl-8 mb-4 text-gray-600">
              <li className="mb-2">Tactic: {selectedStrats.tactic}</li>
              <li className="mb-2">
                Tactic Score: {selectedStrats.tacticScore}
              </li>
              <li className="mb-2">
                Value Proposition: {selectedStrats.valueProposition}
              </li>
            </ul>
          </Details>
          <Details
            key={"strategy"}
            title="Strategy"
            wrapperClass="border-primary-600 bg-[#f5f5ff]"
            headClass="hover:bg-[#f5f5ff] text-gray-800"
          >
            <ul className="list-disc pl-8 mb-4 text-gray-600">
              <li className="mb-2">Channels: {selectedStrats.channel}</li>
              <li className="mb-2">
                Strategic Alignment: {selectedStrats.strategicAlignment}
              </li>
              <li className="mb-2">
                Call To Action: {selectedStrats.callToAction}
              </li>
            </ul>
          </Details>
          <Details
            key={"success-measurement"}
            title="Success Measurement"
            wrapperClass="border-primary-600 bg-[#f5f5ff]"
            headClass="hover:bg-[#f5f5ff] text-gray-800"
          >
            <ul className="list-disc pl-8 mb-4 text-gray-600">
              {selectedStrats.keyPerformanceIndicators.map((item, index) => {
                return <li key={"performance-indicator" + index}>{item}</li>;
              })}
            </ul>
          </Details>
        </>
      )}
    </Modal>
  );
};

export default MarketingPlanModal;
