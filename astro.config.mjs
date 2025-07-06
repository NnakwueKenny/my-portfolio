import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: "https://codehermit.netlify.app/",
  
  // Build optimizations
  build: {
    inlineStylesheets: 'auto',
  },
  
  // Performance optimizations
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['astro']
          }
        }
      }
    }
  },
  
  // Security headers
  security: {
    checkOrigin: true
  },
  
  // Image optimization
  image: {
    domains: ['dev.notjustevent.com']
  }
});