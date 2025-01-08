import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  base: mode === 'production' ? '/' : '/',
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  },
  optimizeDeps: {
    include: ['@twilio/voice-sdk', 'react', 'react-dom', 'react/jsx-runtime']
  },
  build: {
    commonjsOptions: {
      include: [/@twilio\/voice-sdk/, /node_modules/],
      transformMixedEsModules: true
    }
  }
}));