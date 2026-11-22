import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  // GitHub Pages serves the game from /bodai-word-ladder/; locally it's the root.
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), tailwindcss()],
  build: {
    // Word meanings are big (5-letter is ~700 KB) but load only when a word is tapped.
    chunkSizeWarningLimit: 800,
  },
});
