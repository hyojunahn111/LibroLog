
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Vercel 환경 변수가 없을 경우에도 앱이 죽지 않도록 빈 문자열 처리
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || "")
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // 브라우저 호환성을 위해 빌드 타겟 설정
    target: 'esnext'
  }
});
