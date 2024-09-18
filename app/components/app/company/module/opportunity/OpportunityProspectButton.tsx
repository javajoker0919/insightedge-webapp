import { useState } from "react";
import { IoBulb } from "react-icons/io5";

import { Modal } from "@/app/components";
import { OpportunityProps } from "@/app/components/interface";

interface OpportunityProspectButtonProps {
  opportunity: OpportunityProps;
}

const OpportunityProspectButton: React.FC<OpportunityProspectButtonProps> = ({
  opportunity,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="text-primary-500 hover:text-white font-semibold justify-center border-primary-500 border flex items-center gap-1 rounded-full !min-w-fit p-1 px-2 hover:bg-primary-500"
      >
        Prospect <IoBulb />
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
              Prospecting Tactics
            </h2>
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-primary-600 pb-2">
                Inbound Strategies
              </h3>
              <ul className="list-disc pl-8 space-y-3">
                {opportunity?.engagementTips?.inbound.map(
                  (tip: string, index: number) => (
                    <li key={`engagementTips_inbound_${index}`}>
                      <p className="text-gray-700">{tip}</p>
                    </li>
                  )
                )}
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-primary-600 pb-2">
                Outbound Strategies
              </h3>
              <ul className="list-disc pl-8 space-y-3">
                {opportunity.engagementTips.outbound.map(
                  (tip: string, index: number) => (
                    <li key={`engagementTips_outbound_${index}`}>
                      <p className="text-gray-700">{tip}</p>
                    </li>
                  )
                )}
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-primary-600 pb-2">
                Outbound Email
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="text-lg font-medium text-gray-800 mb-2">
                  {opportunity.outboundEmail.subject}
                </h4>
                <p className="text-gray-700 whitespace-pre-line">
                  {opportunity.outboundEmail.body}
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-primary-600 pb-2">
                Reasoning
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-700">{opportunity.reasoning}</p>
              </div>
            </section>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default OpportunityProspectButton;
