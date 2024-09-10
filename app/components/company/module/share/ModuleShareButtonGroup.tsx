import { useState, useRef, FC, RefObject } from "react";
import {
  FaTimes,
  FaPlus,
  FaDownload,
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

interface ModuleItem {
  value: string;
  title: string;
}

interface ModuleShareButtonGroupProps {
  companyID: number;
  etIDs: number[];
  items: ModuleItem[];
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

const ModuleShareButtonGroup: FC<ModuleShareButtonGroupProps> = ({
  companyID,
  etIDs,
  items,
}) => {
  const { invokeToast } = useToastContext();
  const mixpanel = getMixPanelClient();
  const profile = useAtomValue(profileAtom);
  const newEmailRef = useRef<HTMLInputElement>(null);

  const [emails, setEmails] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isInputNotEmpty, setIsInputNotEmpty] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const [activeTab, setActiveTab] = useState<"export" | "share">("export");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedMethod, setSelectedMethod] = useState<string>("PDF");

  const handleOpenModal = (tab: "export" | "share") => {
    setActiveTab(tab);
    setIsModalOpen(true);
  };

  const handleClose = (): void => {
    setIsModalOpen(false);
    setEmails([]);
    setIsInputNotEmpty(false);
    setIsEmailValid(true);
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

  const handleInputChange = (): void => {
    if (newEmailRef.current) {
      setIsInputNotEmpty(newEmailRef.current.value.trim() !== "");
      setIsEmailValid(true);
    }
  };

  const handleSendEmail = async (): Promise<void> => {
    if (!profile || !etIDs || selectedItems.length === 0) return;

    setIsSending(true);
    try {
      const emailData = {
        user_id: profile.user_id,
        earnings_transcript_id: etIDs[0].toString(),
        organization_id: profile.org_id.toString(),
        share_email_ids: emails.filter((email) => email !== ""),
        selected_items: selectedItems,
      };

      mixpanel.track("share.email", {
        email_count: emailData.share_email_ids.length,
        item_count: selectedItems.length,
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

  const handleItemSelection = (item: string) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleExport = () => {
    if (selectedItems.length === 0) {
      invokeToast("error", "Please select at least one item to export.");
      return;
    }
    if (!selectedMethod) {
      invokeToast("error", "Please select a export method.");
      return;
    }
    // Placeholder for export functionality
    console.log(`Exporting as ${selectedMethod}`, { selectedItems });
    invokeToast(
      "success",
      `Exported ${selectedItems.length} item(s) as ${selectedMethod}`
    );
    handleClose();
  };

  const renderExportMethods = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-6">Choose method</h3>
      <div className="flex items-center gap-2 py-2 justify-between">
        {[
          { method: "PDF", icon: FaFilePdf },
          { method: "CSV", icon: FaFileCsv },
          { method: "JSON", icon: FaFileCode },
        ].map(({ method, icon: Icon }) => (
          <button
            key={method}
            onClick={() => setSelectedMethod(method)}
            className={`w-full p-4 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none transition duration-150 ease-in-out flex items-center justify-between ${
              selectedMethod === method
                ? "bg-primary-100 border-primary-500"
                : ""
            }`}
          >
            <div className="flex items-center">
              <Icon className="mr-3 text-xl" />
              {method}
            </div>
            {selectedMethod === method && (
              <FaCheck className="text-primary-500" />
            )}
          </button>
        ))}
      </div>
      <button
        onClick={handleExport}
        disabled={selectedItems.length === 0 || !selectedMethod}
        className={`w-full px-6 py-3 text-base font-medium text-white bg-primary-500 rounded-md shadow-sm hover:bg-primary-600 focus:outline-none transition duration-150 ease-in-out ${
          selectedItems.length === 0 || !selectedMethod
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
      >
        Export
      </button>
    </div>
  );

  const renderItemSelection = () => {
    const defaultItems: ModuleItem[] = [
      {
        title: "General Opportunity",
        value: "general_opportunity",
      },
      {
        title: "Tailored Opportunity",
        value: "tailored_opportunity",
      },
      {
        title: "General Marketing Campaign",
        value: "general_marketing_campaign",
      },
      {
        title: "Tailored Marketing Campaign",
        value: "tailored_marketing_campaign",
      },
      {
        title: "General Transcript Summary",
        value: "general_transcript_summary",
      },
      {
        title: "Tailored Transcript Summary",
        value: "tailored_transcript_summary",
      },
    ];

    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold mb-6">
          Select items to {activeTab === "export" ? "export" : "share"}
        </h3>
        <div className="space-y-4">
          {[...defaultItems, ...items].map((item) => (
            <div key={`item-${item.value}`} className="flex items-center">
              <input
                type="checkbox"
                id={item.value}
                checked={selectedItems.includes(item.value)}
                onChange={() => handleItemSelection(item.value)}
                className="mr-2"
              />
              <label
                htmlFor={item.value}
                className={`text-base font-medium text-gray-700`}
              >
                {item.title}
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEmailInput = () => (
    <div className="space-y-6">
      <span className="text-xl font-semibold">Enter emails</span>
      <EmailInput
        newEmailRef={newEmailRef}
        isInputNotEmpty={isInputNotEmpty}
        isEmailValid={isEmailValid}
        handleInputChange={handleInputChange}
        handleAddEmail={handleAddEmail}
      />
      <EmailList emails={emails} handleRemoveEmail={handleRemoveEmail} />
      <button
        onClick={handleSendEmail}
        disabled={
          isSending || emails.length === 0 || selectedItems.length === 0
        }
        className={`w-full px-6 py-3 text-base font-medium text-white bg-primary-500 rounded-md shadow-sm hover:bg-primary-600 focus:outline-none transition duration-150 ease-in-out ${
          isSending || emails.length === 0 || selectedItems.length === 0
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
      >
        {isSending ? "Sharing..." : "Share"}
      </button>
    </div>
  );

  const renderTabContent = () => {
    return (
      <div className="space-y-6">
        {renderItemSelection()}
        {activeTab === "export" ? renderExportMethods() : renderEmailInput()}
      </div>
    );
  };

  return (
    <>
      <div className="flex gap-1">
        <button
          onClick={() => handleOpenModal("export")}
          className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-100 focus:outline-none flex items-center gap-1 transition duration-150 ease-in-out"
        >
          <FaDownload className="h-4 w-4 text-blue-700" />
          Export
        </button>
        <button
          onClick={() => handleOpenModal("share")}
          className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-100 focus:outline-none flex items-center gap-1 transition duration-150 ease-in-out"
        >
          <ShareIcon />
          Share
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleClose} modalClass="w-[600px]">
        <div className="relative">
          <button
            onClick={handleClose}
            className="absolute -top-4 -right-4 text-gray-700 hover:text-gray-900 hover:bg-gray-200 rounded-full p-2"
          >
            <FaTimes className="h-4 w-4" />
          </button>
          <div className="mb-6">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("export")}
                className={`py-2 px-4 text-sm font-medium ${
                  activeTab === "export"
                    ? "border-b-2 border-primary-500 text-primary-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Export
              </button>
              <button
                onClick={() => setActiveTab("share")}
                className={`py-2 px-4 text-sm font-medium ${
                  activeTab === "share"
                    ? "border-b-2 border-primary-500 text-primary-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Share
              </button>
            </div>
          </div>
          {renderTabContent()}
        </div>
      </Modal>
    </>
  );
};

export default ModuleShareButtonGroup;
