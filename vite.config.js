import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react({ fastRefresh: false })],
  build: {
    sourcemap: false,
    outDir: 'dist-render'
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: [
      'infolinx-server-hrms.onrender.com',
      '.onrender.com'
    ]
  }
});
