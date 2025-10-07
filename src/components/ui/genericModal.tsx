import React from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-4xl w-full max-h-[90vh] relative flex flex-col">
        {/* Close Button inside modal (absolute relative to modal) */}
        <button
          title="Close"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>

        {/* Scrollable content */}
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
