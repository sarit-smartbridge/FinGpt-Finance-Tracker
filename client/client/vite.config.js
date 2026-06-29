import { defineConfig, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';

const jsAsJsx = () => ({
  name: 'load-js-files-as-jsx',
  async transform(code, id) {
    if (!id.match(/src\/.*\.js$/)) return null;

    return transformWithEsbuild(code, id, {
      loader: 'jsx',
      jsx: 'automatic',
    });
  },
});

export default defineConfig({
  plugins: [jsAsJsx(), react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
});
