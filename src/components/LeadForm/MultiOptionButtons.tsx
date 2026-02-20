import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MultiOptionButtonsProps {
    options: string[];
    onConfirm: (selectedOptions: string[]) => void;
}

export const MultiOptionButtons = ({ options, onConfirm }: MultiOptionButtonsProps) => {
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const toggleOption = (option: string) => {
        if (isSubmitted) return;
        setSelectedItems((prev) =>
            prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
        );
    };

    const handleConfirm = () => {
        if (selectedItems.length === 0 || isSubmitted) return;
        setIsSubmitted(true);
        onConfirm(selectedItems);
    };

    return (
        <div className="w-full space-y-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
                {options.map((option, index) => {
                    const isSelected = selectedItems.includes(option);

                    return (
                        <motion.button
                            key={option}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            onClick={() => toggleOption(option)}
                            disabled={isSubmitted}
                            className={`
                relative px-6 py-4 rounded-[2rem] font-medium text-sm
                transition-all duration-300 flex items-center justify-between gap-3
                w-full h-full text-left
                ${isSelected
                                    ? "bg-black text-white scale-[1.02]" 
                                    : "bg-black text-white hover:scale-[1.02] hover:opacity-100"
                                }
                ${isSubmitted && !isSelected ? "opacity-40 grayscale-[0.5]" : "opacity-100"}
              `}
                        >
                            {/* Texto sem truncate para aparecer tudo */}
                            <span className="leading-tight flex-1">{option}</span>

                            {/* Checkbox minimalista para combinar com o estilo arredondado */}
                            <div
                                className={`
                shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                ${isSelected ? "bg-white border-white" : "border-white/40"}
              `}
                            >
                                {isSelected && (
                                    <motion.svg
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-4 h-4 text-indigo-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                                    </motion.svg>
                                )}
                            </div>
                        </motion.button>
                    );
                })}
            </motion.div>

            <AnimatePresence>
                {selectedItems.length > 0 && !isSubmitted && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={handleConfirm}
                        className="w-full py-4 rounded-full bg-slate-900 text-white font-bold shadow-xl hover:bg-black transition-all border-2 border-purple-500/30"
                    >
                        Confirmar {selectedItems.length} {selectedItems.length === 1 ? 'opção' : 'opções'}
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
};