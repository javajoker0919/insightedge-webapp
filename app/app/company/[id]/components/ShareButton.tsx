import { useState, useRef, useEffect, FC, RefObject } from "react";
import { FaEnvelope, FaTimes, FaPlus } from "react-icons/fa";
import { useAtomValue } from "jotai";

import { ShareSvg } from ".";
import { profileAtom } from "@/utils/atoms";
import { emailShare } from "@/utils/apiClient";
import { useToastContext } from "@/contexts/toastContext";
import { getMixPanelClient } from "@/utils/mixpanel";

interface ShareButtonProps {
  etID: number | null;
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
  <div className="flex items-center gap-2 w-full">
    <input
      type="email"
      ref={newEmailRef}
      placeholder="Enter email address"
      className="w-full p-2 border border-gray-300 rounded-md"
      onChange={handleInputChange}
    />
    {isInputNotEmpty && (
      <button
        onClick={handleAddEmail}
        className="p-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-100 focus:outline-none transition duration-150 ease-in-out transform"
      >
        <FaPlus />
      </button>
    )}
    {!isEmailValid && (
      <p className="text-red-500 text-sm mt-2">
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
        className="flex items-center w-fit gap-1 rounded-full bg-gray-100 text-gray-900 border border-gray-300 p-0.5 pl-2"
      >
        <span className="text-sm">{email}</span>
        <button
          onClick={() => handleRemoveEmail(index)}
          className="p-1 hover:bg-gray-300 rounded-full"
        >
          <FaTimes className="h-3 w-3" />
        </button>
      </div>
    ))}
  </div>
);

const ShareButton: FC<ShareButtonProps> = ({ etID }) => {
  const { invokeToast } = useToastContext();
  const mixpanel = getMixPanelClient();

  const profile = useAtomValue(profileAtom);

  const modalRef = useRef<HTMLDivElement>(null);
  const newEmailRef = useRef<HTMLInputElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isInputNotEmpty, setIsInputNotEmpty] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);

  const handleShare = (): void => {
    setIsModalOpen(true);
  };

  const handleClose = (): void => {
    setIsModalOpen(false);
    setEmails([]);
    setIsInputNotEmpty(false);
    setIsEmailValid(true);
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
    if (!profile || !etID) return;

    setIsSending(true);
    try {
      const emailData = {
        user_id: profile.user_id,
        earnings_transcript_id: etID.toString(),
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  const handleInputChange = (): void => {
    if (newEmailRef.current) {
      setIsInputNotEmpty(newEmailRef.current.value.trim() !== "");
      setIsEmailValid(true);
    }
  };

  return (
    <>
      <button
        onClick={handleShare}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-100 focus:outline-none flex items-center transition duration-150 ease-in-out"
      >
        <ShareSvg />
        Share
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 !m-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-lg overflow-hidden shadow-xl w-96"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Share via Email
                </h2>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-500 transition duration-150 ease-in-out"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-col items-center">
                <FaEnvelope className="h-12 w-12 text-red-500 mb-4" />
                <EmailInput
                  newEmailRef={newEmailRef}
                  isInputNotEmpty={isInputNotEmpty}
                  isEmailValid={isEmailValid}
                  handleInputChange={handleInputChange}
                  handleAddEmail={handleAddEmail}
                />
                <EmailList
                  emails={emails}
                  handleRemoveEmail={handleRemoveEmail}
                />
                <button
                  onClick={handleSendEmail}
                  className={`px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded w-full shadow-sm hover:bg-primary-600 focus:outline-none transition duration-150 ease-in-out ${
                    isSending || emails.length === 0
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={isSending || emails.length === 0}
                >
                  {isSending ? "Sending..." : "Send"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShareButton;
