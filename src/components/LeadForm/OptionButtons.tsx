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
      className="flex flex-wrap justify-end gap-2 mb-4"
    >
      {options.map((option, index) => (
        <motion.button
          key={option}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
          
          // Lógica de clique e desativação
          onClick={() => handleSelect(option)}
          disabled={hasSelected}
          
          // Estilização condicional para o estado desativado
          className={`px-5 py-3 text-black rounded-full shadow-lg font-medium transition-all duration-200
            ${hasSelected 
              ? "bg-gray-300 cursor-not-allowed opacity-70" 
              : "bg-chat-user hover:shadow-xl hover:scale-105 active:scale-95"
            }`}
        >
          {option}
        </motion.button>
      ))}
    </motion.div>
  );
};