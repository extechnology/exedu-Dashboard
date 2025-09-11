import { motion, AnimatePresence } from "framer-motion";
import { LogOut } from "lucide-react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center h-screen content-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 text-red-600 p-3 rounded-full">
                <LogOut className="h-6 w-6" />
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Confirm Logout
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to log out? You will need to log in again to
              continue.
            </p>

            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={onConfirm} 
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-5 rounded-lg shadow-md transition"
              >
                Yes, Logout
              </button>

              <button
                type="button"
                onClick={onClose} 
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-5 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LogoutModal;
