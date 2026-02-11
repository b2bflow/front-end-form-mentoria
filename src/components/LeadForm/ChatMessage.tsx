import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ChatMessageProps {
  children: ReactNode;
  isUser?: boolean;
  delay?: number;
}

export const ChatMessage = ({ children, isUser = false, delay = 0 }: ChatMessageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-[85%] md:max-w-[70%] px-5 py-3 rounded-2xl tex ${
          isUser
            ? "bg-chat-user text-primary-foreground shadow-lg text-black"
            : "text-white"
        }`}
      >
        {children}
      </div>
    </motion.div>
  );
};
