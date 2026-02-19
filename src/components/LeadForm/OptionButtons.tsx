import { useState } from "react";
import { motion } from "framer-motion";

interface OptionButtonsProps {
  options: string[];
  onSelect: (option: string) => void;
}

export const OptionButtons = ({ options, onSelect }: OptionButtonsProps) => {
  const [hasSelected, setHasSelected] = useState(false);

  const handleSelect = (option: string) => {
    if (hasSelected) return;

    setHasSelected(true);
    onSelect(option);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-wrap justify-end gap-3 mb-4"
    >
      {options.map((option, index) => (
        <motion.button
          key={option}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
          onClick={() => handleSelect(option)}
          disabled={hasSelected}
          className={`
            px-6 py-3 
            rounded-full 
            font-medium 
            text-sm
            transition-all duration-300
            ${
              hasSelected
                ? `
                  bg-gradient-to-r 
                  from-blue-400 
                  to-purple-400 
                  text-white 
                  opacity-60 
                  cursor-not-allowed
                  shadow-sm
                `
                : `
                  bg-gradient-to-r 
                  from-blue-600 
                  via-indigo-500 
                  to-purple-600 
                  text-white 
                  shadow-[0_8px_20px_-5px_rgba(124,58,237,0.45)]
                  hover:scale-105
                  hover:shadow-[0_12px_30px_-5px_rgba(124,58,237,0.6)]
                  active:scale-95
                `
            }
          `}
        >
          {option}
        </motion.button>
      ))}
    </motion.div>
  );
};
