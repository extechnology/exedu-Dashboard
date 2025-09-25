"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface exeduButtonProps {
  onClick?: () => void;
  label: string;
  icon?: ReactNode;
  className?: string;
}

const ExeduButton: React.FC<exeduButtonProps> = ({
  onClick,
  label,
  icon,
  className = "",
}) => {
  return (
    <motion.button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl 
        bg-gradient-to-r from-violet-500 to-fuchsia-500 
        text-white shadow-md hover:scale-105 transition-transform ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {icon && (
        <div className="p-2 text-white group-hover:shadow-lg transition-all duration-200">
          {icon}
        </div>
      )}
      <span className="font-semibold text-white">{label}</span>
    </motion.button>
  );
};

export default ExeduButton;
