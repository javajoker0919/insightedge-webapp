import { useState } from "react";

import { Details, Modal } from "@/app/components";

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
  selectedStrats
}) => {
  const [openedSection, setOpenedSection] = useState<1 | 2 | 3>(1);
  return (
    <Modal
      wrapperClass="backdrop-blur-[2px]"
      modalClass="w-full mx-16 min-w-[60rem] xl:min-w-[80rem] xl:max-w-full max-h-[90vh] overflow-y-auto"
      isOpen={open}
      onClose={onClose}
    >
      {selectedStrats && (
        <>
          {/* <Details
            key={"campaign-details-" + (openedSection === 1 ? "open" : "close")}
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
            key={"strategy-" + (openedSection === 2 ? "open" : "close")}
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
            key={
              "success-measurement-" + (openedSection === 3 ? "open" : "close")
            }
            title="Success Measurement"
            wrapperClass="border-primary-600 bg-[#f5f5ff]"
            headClass="hover:bg-[#f5f5ff] text-gray-800"
          >
            <ul className="list-disc pl-8 mb-4 text-gray-600">
              {selectedStrats.keyPerformanceIndicators.map((item, index) => {
                return <li key={"performance-indicator" + index}>{item}</li>;
              })}
            </ul>
          </Details> */}
          <div className="p-3 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-primary-600">
                Prospecting Tactics
              </h2>
            </div>

            <div className="space-y-6">
              <section>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                  Campaign Details
                </h3>
                <ul className="list-disc pl-5 sm:pl-8 space-y-3">
                  <li className="mb-2">Tactic: {selectedStrats.tactic}</li>
                  <li className="mb-2">
                    Tactic Score: {selectedStrats.tacticScore}
                  </li>
                  <li className="mb-2">
                    Value Proposition: {selectedStrats.valueProposition}
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                  Strategy
                </h3>
                <ul className="list-disc pl-5 sm:pl-8 space-y-3">
                  <li className="mb-2">Channels: {selectedStrats.channel}</li>
                  <li className="mb-2">
                    Strategic Alignment: {selectedStrats.strategicAlignment}
                  </li>
                  <li className="mb-2">
                    Call To Action: {selectedStrats.callToAction}
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                  Success Measurement
                </h3>
                <ul className="list-disc pl-5 sm:pl-8 space-y-3">
                  {selectedStrats.keyPerformanceIndicators.map(
                    (item, index) => {
                      return (
                        <li key={"performance-indicator" + index}>{item}</li>
                      );
                    }
                  )}
                </ul>
              </section>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};

export default MarketingPlanModal;
