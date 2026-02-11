import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

interface TextInputProps {
  placeholder: string;
  onSubmit: (value: string) => void;
  type?: "text" | "email" | "tel";
}

export const TextInput = ({ placeholder, onSubmit, type = "text" }: TextInputProps) => {
  const [value, setValue] = useState("");
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (value.trim() === "") {
      setIsValid(false);
      return;
    }

    switch (type) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setIsValid(emailRegex.test(value));
        break;
      case "tel":
        const digits = value.replace(/\D/g, "");
        setIsValid(digits.length >= 10);
        break;
      default:
        setIsValid(value.trim().length >= 3);
        break;
    }
  }, [value, type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onSubmit(value.trim());
      setValue("");
    }
  };

  const getStatusColor = () => {
    if (value === "") return "ring-transparent border-transparent";
    return isValid 
      ? "ring-emerald-400/50 border-emerald-400" 
      : "ring-red-300/50 border-red-300";
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="flex justify-end mb-4"
    >
      <div 
        className={`flex items-center gap-2 bg-chat-user rounded-full px-4 py-2 shadow-lg max-w-[85%] md:max-w-[70%] transition-all duration-300 border-2 ${getStatusColor()} ring-2`}
      >
        <input
          type={type}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="bg-transparent text-black placeholder:text-slate-600 focus:outline-none min-w-[150px] md:min-w-[200px]"
          autoFocus
        />
        <button
          type="submit"
          disabled={!isValid}
          className={`p-2 rounded-full transition-all duration-300 ${
            isValid 
              ? "bg-black text-primary-foreground opacity-100 scale-100" 
              : "bg-white/20 text-white/50 opacity-50 scale-90 cursor-not-allowed"
          }`}
        >
          <Send className="text-white" size={16} />
        </button>
      </div>
    </motion.form>
  );
};