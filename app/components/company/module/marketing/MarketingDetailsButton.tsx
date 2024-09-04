import { useState } from "react";
import { IoBulb } from "react-icons/io5";

import { Modal } from "@/app/components";
import { MarketingProps } from "@/app/components/interface";

interface MarketingDetailsButtonProps {
  marketing: MarketingProps;
}

const MarketingDetailsButton: React.FC<MarketingDetailsButtonProps> = ({
  marketing,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="text-primary-500 hover:text-white font-semibold justify-center border-primary-500 border flex items-center gap-1 rounded-full !min-w-fit p-1 px-2 hover:bg-primary-500"
      >
        Details <IoBulb />
      </button>

      <Modal
        wrapperClass="backdrop-blur-[2px]"
        modalClass="w-full mx-16 min-w-[60rem] xl:max-w-[50rem] xl:max-w-full max-h-[90vh] overflow-y-auto"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="p-3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-primary-600">
              Marketing Strategy Details
            </h2>
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-primary-600 pb-2">
                Key Performance Indicators
              </h3>
              <ul className="list-disc pl-8 space-y-3">
                {marketing.keyPerformanceIndicators &&
                  marketing.keyPerformanceIndicators.map(
                    (kpi: string, index: number) => (
                      <li key={`kpi_${index}`}>
                        <p className="text-gray-700">{kpi}</p>
                      </li>
                    )
                  )}
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-primary-600 pb-2">
                Strategic Alignment
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-700">{marketing.strategicAlignment}</p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-primary-600 pb-2">
                Call to Action
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-700">{marketing.callToAction}</p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-primary-600 pb-2">
                Value Proposition
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-700">{marketing.valueProposition}</p>
              </div>
            </section>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MarketingDetailsButton;
