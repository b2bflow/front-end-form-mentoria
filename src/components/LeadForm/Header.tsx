import { motion } from "framer-motion";
import logo from "@/assets/logo.jpeg";
import logo_insider from "@/assets/logo_insider.png";

export const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="backdrop-blur-sm border border-white rounded-2xl p-4 mb-8 flex items-center justify-between shadow-xl bg-black"
    >
      <div className="flex items-center gap-3 bg-white rounded-lg p-2">
        <img src={logo_insider} alt="B2B Flow" className="h-10 w-10 rounded-lg object-cover" />
        <span className="font-bold text-xl text-black">
          <span>AI Insider Club</span>
        </span>
      </div>
      <p className="text-sm text-white">
        A comunidade que crescem com{" "}
        <span className="text-white font-bold">Inteligência Artificial</span>
      </p>
    </motion.header>
  );
};
