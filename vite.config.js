import { defineConfig } from 'vite';

// base './' để build chạy được dưới mọi đường dẫn (GitHub Pages: /<tên-repo>/)
export default defineConfig({
  base: './',
  build: { outDir: 'dist' },
});
