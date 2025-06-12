import { defineConfig } from 'vite';
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('react-router')) {
              return 'router-vendor';
            }
            if (id.includes('@tanstack/react-query')) {
              return 'query-vendor';
            }
            if (id.includes('@radix-ui') || id.includes('lucide-react')) {
              return 'ui-vendor';
            }
            if (id.includes('@aptos-labs') || id.includes('aptos')) {
              return 'aptos-vendor';
            }
            if (id.includes('tailwind') || id.includes('clsx') || id.includes('class-variance-authority')) {
              return 'styling-vendor';
            }
            // Other large vendor libraries
            return 'vendor';
          }
          
          // Application chunks
          if (id.includes('/src/blockchain/')) {
            return 'blockchain';
          }
          if (id.includes('/src/pages/dashboard/')) {
            return 'dashboard-pages';
          }
          if (id.includes('/src/pages/certification/')) {
            return 'certification-pages';
          }
          if (id.includes('/src/components/ui/')) {
            return 'ui-components';
          }
          if (id.includes('/src/components/')) {
            return 'components';
          }
          if (id.includes('/src/pages/')) {
            return 'pages';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
