import { useState, useRef, FC, RefObject } from "react";
import {
  FaTimes,
  FaPlus,
  FaDownload,
  FaShare,
  FaFilePdf,
  FaFileCsv,
  FaFileCode,
  FaCheck,
} from "react-icons/fa";
import { useAtomValue } from "jotai";

import { ShareIcon } from "@/app/components/icon";
import { Modal } from "@/app/components";
import { profileAtom } from "@/utils/atoms";
import { emailShare } from "@/utils/apiClient";
import { useToastContext } from "@/contexts/toastContext";
import { getMixPanelClient } from "@/utils/mixpanel";

interface ModuleShareButtonProps {
  etIDs: number[];
}

interface EmailInputProps {
  newEmailRef: RefObject<HTMLInputElement>;
  isInputNotEmpty: boolean;
  isEmailValid: boolean;
  handleInputChange: () => void;
  handleAddEmail: () => void;
}

interface EmailListProps {
  emails: string[];
  handleRemoveEmail: (index: number) => void;
}

const EmailInput: FC<EmailInputProps> = ({
  newEmailRef,
  isInputNotEmpty,
  isEmailValid,
  handleInputChange,
  handleAddEmail,
}) => (
  <div>
    <div className="flex items-center gap-2 w-full">
      <input
        type="email"
        ref={newEmailRef}
        placeholder="Enter email address"
        className="w-full p-3 border border-gray-300 rounded-md text-base"
        onChange={handleInputChange}
      />
      {isInputNotEmpty && (
        <button
          onClick={handleAddEmail}
          className="p-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-100 focus:outline-none transition duration-150 ease-in-out transform"
        >
          <FaPlus />
        </button>
      )}
    </div>

    {!isEmailValid && (
      <p className="text-red-500 text-sm ml-2 mt-2">
        Please enter a valid email address.
      </p>
    )}
  </div>
);

const EmailList: FC<EmailListProps> = ({ emails, handleRemoveEmail }) => (
  <div className="flex flex-wrap gap-2 w-full my-4">
    {emails.map((email, index) => (
      <div
        key={index}
        className="flex items-center w-fit gap-1 rounded-full bg-gray-100 text-gray-900 border border-gray-300 p-1 pl-3"
      >
        <span className="text-base">{email}</span>
        <button
          onClick={() => handleRemoveEmail(index)}
          className="p-1 hover:bg-gray-300 rounded-full"
        >
          <FaTimes className="h-4 w-4" />
        </button>
      </div>
    ))}
  </div>
);

const ModuleShareButton: FC<ModuleShareButtonProps> = ({ etIDs }) => {
  const { invokeToast } = useToastContext();
  const mixpanel = getMixPanelClient();
  const profile = useAtomValue(profileAtom);
  const newEmailRef = useRef<HTMLInputElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isInputNotEmpty, setIsInputNotEmpty] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [flow, setFlow] = useState<"initial" | "download" | "share">("initial");
  const [step, setStep] = useState<"items" | "method" | "email">("items");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleClose = (): void => {
    setIsModalOpen(false);
    setEmails([]);
    setIsInputNotEmpty(false);
    setIsEmailValid(true);
    setFlow("initial");
    setStep("items");
    setSelectedItems([]);
    if (newEmailRef.current) {
      newEmailRef.current.value = "";
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddEmail = (): void => {
    if (newEmailRef.current && newEmailRef.current.value.trim() !== "") {
      const newEmail = newEmailRef.current.value;
      if (validateEmail(newEmail)) {
        if (!emails.includes(newEmail)) {
          setEmails([...emails, newEmail]);
        }
        newEmailRef.current.value = "";
        setIsInputNotEmpty(false);
        setIsEmailValid(true);
      } else {
        setIsEmailValid(false);
      }
    }
  };

  const handleRemoveEmail = (index: number): void => {
    const newEmails = emails.filter((_, i) => i !== index);
    setEmails(newEmails);
  };

  const handleSendEmail = async (): Promise<void> => {
    if (!profile || !etIDs) return;

    setIsSending(true);
    try {
      const emailData = {
        user_id: profile.user_id,
        earnings_transcript_id: etIDs[0].toString(),
        organization_id: profile.org_id.toString(),
        share_email_ids: emails.filter((email) => email !== ""),
      };

      mixpanel.track("share.email", {
        email_count: emailData.share_email_ids.length,
      });

      const { data } = await emailShare(emailData);

      invokeToast("success", data.message);
    } catch (error) {
      console.error("Error sending email:", error);
      invokeToast("error", "Failed to send email.");
    } finally {
      setIsSending(false);
      handleClose();
    }
  };

  const handleInputChange = (): void => {
    if (newEmailRef.current) {
      setIsInputNotEmpty(newEmailRef.current.value.trim() !== "");
      setIsEmailValid(true);
    }
  };

  const handleFlowSelection = (selectedFlow: "download" | "share") => {
    setFlow(selectedFlow);
    setStep("items");
  };

  const handleItemSelection = (item: string) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleBack = () => {
    if (step === "method" || step === "email") {
      setStep("items");
    } else {
      setFlow("initial");
      setStep("items");
    }
  };

  const handleContinue = () => {
    if (flow === "download") {
      setStep("method");
    } else if (flow === "share") {
      setStep("email");
    }
  };

  const handleDownload = (method: string) => {
    // Placeholder for download functionality
    console.log(`Downloading as ${method}`, { selectedItems });
    invokeToast("success", `Downloaded as ${method}`);
    handleClose();
  };

  const renderInitialOptions = () => (
    <div className="flex gap-6 p-4">
      <button
        onClick={() => handleFlowSelection("download")}
        className="flex-1 p-6 text-xl font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none transition duration-150 ease-in-out"
      >
        <FaDownload className="mx-auto mb-3 text-3xl" />
        Download
      </button>
      <button
        onClick={() => handleFlowSelection("share")}
        className="flex-1 p-6 text-xl font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none transition duration-150 ease-in-out"
      >
        <FaShare className="mx-auto mb-3 text-3xl" />
        Share
      </button>
    </div>
  );

  const renderItemSelection = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold mb-6">
        Select items to {flow === "download" ? "download" : "share"}
      </h3>
      <div className="grid grid-cols-1 gap-4">
        {[
          "General Opportunity",
          "Tailored Opportunity",
          "General Marketing Campaign",
          "Tailored Marketing Campaign",
          "General Summary",
          "Tailored Summary",
        ].map((item) => (
          <button
            key={item}
            onClick={() => handleItemSelection(item)}
            className={`p-4 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none transition duration-150 ease-in-out flex items-center justify-between ${
              selectedItems.includes(item)
                ? "bg-primary-100 border-primary-500"
                : ""
            }`}
          >
            {item}
            {selectedItems.includes(item) && (
              <FaCheck className="text-primary-500" />
            )}
          </button>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={handleBack}
          className="px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={selectedItems.length === 0}
          className={`px-6 py-3 text-base font-medium text-white bg-primary-500 rounded-md shadow-sm hover:bg-primary-600 focus:outline-none transition duration-150 ease-in-out ${
            selectedItems.length === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );

  const renderDownloadMethods = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold mb-6">Choose download method</h3>
      <div className="space-y-4">
        {[
          { method: "PDF", icon: FaFilePdf },
          { method: "CSV", icon: FaFileCsv },
          { method: "JSON", icon: FaFileCode },
        ].map(({ method, icon: Icon }) => (
          <button
            key={method}
            onClick={() => handleDownload(method)}
            className="w-full p-4 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none transition duration-150 ease-in-out flex items-center"
          >
            <Icon className="mr-3 text-xl" />
            Download as {method}
          </button>
        ))}
      </div>
      <button
        onClick={handleBack}
        className="w-full mt-6 px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100"
      >
        Back
      </button>
    </div>
  );

  const renderEmailInput = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold mb-6">Share via Email</h3>
      <EmailInput
        newEmailRef={newEmailRef}
        isInputNotEmpty={isInputNotEmpty}
        isEmailValid={isEmailValid}
        handleInputChange={handleInputChange}
        handleAddEmail={handleAddEmail}
      />
      <EmailList emails={emails} handleRemoveEmail={handleRemoveEmail} />
      <div className="flex justify-between mt-8">
        <button
          onClick={handleBack}
          className="px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100"
        >
          Back
        </button>
        <button
          onClick={handleSendEmail}
          disabled={isSending || emails.length === 0}
          className={`px-6 py-3 text-base font-medium text-white bg-primary-500 rounded-md shadow-sm hover:bg-primary-600 focus:outline-none transition duration-150 ease-in-out ${
            isSending || emails.length === 0
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          {isSending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-100 focus:outline-none flex items-center gap-1 transition duration-150 ease-in-out"
      >
        <ShareIcon />
        Share
      </button>

      <Modal isOpen={isModalOpen} onClose={handleClose} modalClass="w-[600px]">
        <div className="relative">
          <button
            onClick={handleClose}
            className="absolute -top-4 -right-4 text-gray-700 hover:text-gray-900 hover:bg-gray-200 rounded-full p-2"
          >
            <FaTimes className="h-4 w-4" />
          </button>
          {flow === "initial" && renderInitialOptions()}
          {flow !== "initial" && step === "items" && renderItemSelection()}
          {flow === "download" && step === "method" && renderDownloadMethods()}
          {flow === "share" && step === "email" && renderEmailInput()}
        </div>
      </Modal>
    </>
  );
};

export default ModuleShareButton;
