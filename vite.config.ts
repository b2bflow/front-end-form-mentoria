import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  const PORT = Number(env.VITE_PORT) || 4173;

  return {
    server: {
      host: true,
      port: PORT,
      hmr: {
        overlay: false,
      },
    },

    preview: {
      host: true,
      port: PORT,
      allowedHosts: true,
    },

    plugins: [
      react(),
      mode === "development" && componentTagger(),
    ].filter(Boolean),

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
