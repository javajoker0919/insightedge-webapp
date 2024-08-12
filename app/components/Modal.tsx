"use client";
import React, { useState, useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  wrapperClass?: string;
  modalClass?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  wrapperClass = "",
  modalClass = "",
}) => {
  const [isVisible, setIsVisible] = useState(isOpen);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isVisible, onClose]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={
        "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 " +
        wrapperClass
      }
    >
      <div
        ref={modalRef}
        className={"bg-white rounded-lg p-6 max-w-md w-full " + modalClass}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
