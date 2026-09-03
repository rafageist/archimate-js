import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const exampleRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  root: exampleRoot,
  base: './',
  server: { port: 3000 },
  preview: { port: 4173 },
  build: {
    outDir: resolve(exampleRoot, '..', '..', 'demo-dist'),
    emptyOutDir: true
  }
});
