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

const MarketingPlanModal: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => (
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
      <div className="h-[500px] xl:h-auto overflow-y-auto space-y-4 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field>
            <Label className="text-sm font-medium text-gray-700">
              Marketing Tactic:
            </Label>
            <div className="relative mt-1">
              <Input
                className="block w-full rounded-md bg-gray-100 py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                className="block w-full rounded-md bg-gray-100 py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                className="block w-full rounded-md bg-gray-100 py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                className="block w-full rounded-md bg-gray-100 py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                className="block w-full rounded-md bg-gray-100 py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                className="block w-full rounded-md bg-gray-100 py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                className="block w-full rounded-md bg-gray-100 py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                className="block w-full rounded-md bg-gray-100 py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                className="block w-full rounded-md bg-gray-100 py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
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
                className="block w-full rounded-md bg-gray-100 py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
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
                className="block w-full rounded-md bg-gray-100 py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
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
                className="block w-full rounded-md bg-gray-100 py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
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
                className="block w-full rounded-md bg-gray-100 py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                rows={2}
                placeholder="One per line"
              />
              <FiFlag className="absolute left-3 top-3 text-gray-400" />
            </div>
          </Field>
        </div>
      </div>
      {/* <div className="flex justify-end p-4">
            <button className="px-4 py-2 bg-primary-600 text-white font-medium rounded-md shadow-md hover:bg-primary-700">
              Go Peroform Action
            </button>
          </div> */}
    </Fieldset>
  </Modal>
);

export default MarketingPlanModal;