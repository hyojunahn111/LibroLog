
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Vercel에서 설정한 API_KEY 환경 변수를 브라우저 코드 내 process.env.API_KEY로 치환
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
