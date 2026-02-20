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
      /* Alteração: Usamos grid para forçar colunas iguais. 
         grid-cols-1 em telas pequenas, grid-cols-2 ou mais em telas maiores.
      */
      className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 w-full"
    >
      {options.map((option, index) => (
        <motion.button
          key={option}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
          onClick={() => handleSelect(option)}
          disabled={hasSelected}
          /* Alteração: Adicionado 'w-full' para preencher a célula do grid 
             e 'break-words' caso o texto seja muito longo.
          */
          className={`
            w-full
            px-6 py-3 
            rounded-full 
            font-medium 
            text-sm
            text-center
            transition-all duration-300
            ${hasSelected
              ? "bg-black text-white opacity-60 cursor-not-allowed shadow-sm"
              : `bg-black  text-white 
                   shadow-[0_8px_20px_-5px]
                   hover:scale-105
                   hover:shadow-[0_12px_30px_-5px]
                   active:scale-95`
            }
          `}
        >
          {option}
        </motion.button>
      ))}
    </motion.div>
  );
};