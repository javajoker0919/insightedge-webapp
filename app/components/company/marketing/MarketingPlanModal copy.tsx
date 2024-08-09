import { useState } from "react";
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
import { Details } from "../../../app/company/[id]/components";
import { IconType } from "react-icons/lib";

type FormFieldProps = {
  label: string;
  placeholder: string;
  icon: IconType;
  fieldClass?: string;
} & (
  | {
      elementType?: "input";
      type?: string;
      rows?: never;
    }
  | {
      elementType: "textarea";
      rows?: number;
      type?: never;
    }
);

const FormField: React.FC<FormFieldProps> = ({
  label,
  placeholder,
  icon: Icon,
  type,
  elementType = "input",
  rows = 2,
  fieldClass,
}) => {
  return (
    <Field className={fieldClass}>
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      <div className="relative mt-1">
        {elementType === "textarea" ? (
          <Textarea
            className="block w-full rounded-md bg-gray-100 py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            placeholder={placeholder}
            rows={rows}
          />
        ) : (
          <Input
            type={type}
            className="block w-full rounded-md bg-gray-100 py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder={placeholder}
          />
        )}
        {Icon && (
          <Icon
            className={
              elementType === "textarea"
                ? "absolute left-3 top-3 text-gray-400"
                : "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            }
          />
        )}
      </div>
    </Field>
  );
};

const MarketingPlanModal: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const [openedSection, setOpenedSection] = useState<1 | 2 | 3>(1);
  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      wrapperClass="backdrop-blur-[2px]"
      modalClass="md:min-w-[700px] max-h-[700px] max-w-full px-4 py-4 rounded-lg shadow-lg"
    >
      <Fieldset className="rounded-lg bg-white shadow-sm">
        <Legend className="text-xl font-bold text-primary-600 pb-4">
          Account-Based Marketing Plan
        </Legend>

        <div className="space-y-4">
          {/* Campaign Details Section */}
          <Details
            key={"section-1-" + (openedSection === 1 ? "open" : "close")}
            open={openedSection === 1}
            onToggle={(open) => open && setOpenedSection(1)}
            title="Campaign Details"
            // headClass="bg-primary-600 text-gray-100 hover:bg-primary-800"
            innerClass="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4"
            wrapperClass="border-primary-600 bg-white"
            iconClass="text-gray-100"
          >
            <FormField
              label="Marketing Tactic:"
              placeholder="Enter tactic"
              icon={FaRegLightbulb}
            />
            <FormField
              label="Tactic Score:"
              placeholder="Enter score"
              icon={FiStar}
            />
            <FormField
              label="Tactic Type:"
              placeholder="Enter type"
              icon={LuTags}
            />
            <FormField
              label="Implementation Timeframe:"
              placeholder="Enter timeframe"
              icon={FiCalendar}
            />
            <FormField
              label="Tactic Description:"
              placeholder="Describe the tactic"
              icon={ImInfo}
              elementType="textarea"
              rows={3}
              fieldClass="col-span-1 sm:col-span-2"
            />
          </Details>

          {/* Strategy Section */}
          <Details
            key={"section-2-" + (openedSection === 2 ? "open" : "close")}
            open={openedSection === 2}
            onToggle={(open) => open && setOpenedSection(2)}
            title="Strategy"
            // headClass="bg-primary-600 text-gray-100 hover:bg-primary-800"
            innerClass="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4"
            wrapperClass="border-primary-600 bg-white"
            iconClass="text-gray-100"
          >
            <FormField
              label="Channels:"
              placeholder="Seperate with commas"
              icon={TfiSignal}
            />
            <FormField
              label="Call to Action:"
              placeholder="Add call to action"
              icon={HiOutlineSpeakerphone}
            />
            <FormField
              label="Key Messages:"
              placeholder="One per line"
              icon={IoChatbubbleEllipsesOutline}
              elementType="textarea"
              fieldClass="col-span-1 sm:col-span-2"
            />
            <FormField
              label="Alignment with Company Goals:"
              placeholder="One per line"
              icon={FiFlag}
              elementType="textarea"
              fieldClass="col-span-1 sm:col-span-2"
            />
            <FormField
              label="Relevant Audience:"
              placeholder="Enter audience"
              icon={PiUsersThree}
            />
            <FormField
              label="Required Resources:"
              placeholder="One per line"
              icon={FaTools}
              elementType="textarea"
            />
          </Details>

          {/* Success Measurements Section */}
          <Details
            key={"section-3-" + (openedSection === 3 ? "open" : "close")}
            open={openedSection === 3}
            onToggle={(open) => open && setOpenedSection(3)}
            title="Success Measurements"
            // headClass="bg-primary-600 text-gray-100 hover:bg-primary-800"
            innerClass="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4"
            wrapperClass="border-primary-600 bg-white"
            iconClass="text-gray-100"
          >
            <FormField
              label="Success Metrics:"
              placeholder="One per line"
              icon={LuBarChartHorizontal}
              elementType="textarea"
            />
            <FormField
              label="Expected ROI:"
              placeholder="Enter ROI"
              icon={LuLineChart}
            />
          </Details>
        </div>
        {/* <div className="flex justify-end p-4">
            <button className="px-4 py-2 bg-primary-600 text-white font-medium rounded-md shadow-md hover:bg-primary-700">
            Go Peroform Action
            </button>
            </div> */}
      </Fieldset>
    </Modal>
  );
};

export default MarketingPlanModal;
