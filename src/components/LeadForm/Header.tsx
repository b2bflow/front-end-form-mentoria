import { motion } from "framer-motion";
import logo_insider from "@/assets/logo_insider.png";

export const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="
        relative
        backdrop-blur-md 
        rounded-2xl 
        p-4 
        mb-8 
        flex flex-col sm:flex-row 
        items-center 
        justify-between 
        gap-4 
        bg-white
        shadow-[0_10px_30px_-10px_rgba(124,58,237,0.25)]
        border border-gray-200
      "
    >
      {/* Linha gradiente inferior */}
      <div className="
        absolute 
        bottom-0 
        left-1/2 
        -translate-x-1/2 
        w-[98%]  
        h-[3px] 
        bg-gradient-to-r 
        from-blue-600 
        via-indigo-500 
        to-purple-600
        rounded-b-2xl" />

      {/* Logo */}
      <div className="flex items-center gap-3 bg-white rounded-lg p-2 w-full sm:w-auto justify-center sm:justify-start">
        <img
          src={logo_insider}
          alt="AI Insider Club"
          className="h-10 w-10 rounded-lg object-cover shadow-sm"
        />
        <span className="font-bold text-xl text-gray-900 whitespace-nowrap tracking-tight">
          AI Insider Club
        </span>
      </div>

      {/* Frase */}
      <p
        className="
          text-sm 
          text-gray-700 
          text-center 
          sm:text-right 
          max-w-[280px] 
          sm:max-w-none 
          leading-tight 
          opacity-90
        "
      >
        A comunidade que cresce com{" "}
        <span className="
          font-semibold
          bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600
          bg-clip-text text-transparent
          block sm:inline
        ">
          Inteligência Artificial
        </span>
      </p>
    </motion.header>
  );
};
