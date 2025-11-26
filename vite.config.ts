import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  ssr: {
    noExternal: command === 'build' ? true : undefined,
    optimizeDeps: {
      include: ['@prisma/client-generated'],
    },
  },
  plugins: [react()],
  server: {
    host: true,
  },
  build: {
    rollupOptions: {
      external: ['@prisma/client-generated'],
    },
  },
}));
