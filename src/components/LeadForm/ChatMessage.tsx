import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ChatMessageProps {
  children: ReactNode;
  isUser?: boolean;
  delay?: number;
}

export const ChatMessage = ({
  children,
  isUser = false,
  delay = 0,
}: ChatMessageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`
          max-w-[85%] md:max-w-[70%] 
          px-5 py-3 
          rounded-2xl 
          text-sm 
          leading-relaxed
          transition-all duration-300
          font-medium
          whitespace-pre-wrap
          ${
            isUser
              ? `
                bg-black
                text-white 
                shadow-[0_10px_25px_-5px]
                hover:scale-[1.02]
                font-medium
              `
              : `
                bg-white 
                text-gray-800 
                border border-gray-200 
                shadow-sm
              `
          }
        `}
      >
        {children}
      </div>
    </motion.div>
  );
};
