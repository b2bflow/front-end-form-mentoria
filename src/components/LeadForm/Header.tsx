import { motion } from "framer-motion";
import logo_insider from "@/assets/logo_insider.png";

export const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="
        backdrop-blur-sm border border-white/20 rounded-2xl p-4 mb-8 
        flex flex-col sm:flex-row items-center justify-between gap-4 
        shadow-xl bg-black/90"
    >
      {/* Container do Logo - Centralizado no mobile, esquerda no PC */}
      <div className="flex items-center gap-3 bg-white rounded-lg p-2 w-full sm:w-auto justify-center sm:justify-start">
        <img 
          src={logo_insider} 
          alt="B2B Flow" 
          className="h-10 w-10 rounded-lg object-cover" 
        />
        <span className="font-bold text-xl text-black whitespace-nowrap">
          AI Insider Club
        </span>
      </div>

      {/* Frase de efeito - Centralizada no mobile, direita no PC */}
      <p className="
        text-sm text-white 
        text-center sm:text-right 
        max-w-[280px] sm:max-w-none 
        leading-tight opacity-90">
        A comunidade que cresce com{" "}
        <span className="text-white font-bold block sm:inline">
          Inteligência Artificial
        </span>
      </p>
    </motion.header>
  );
};