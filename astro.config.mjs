import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  vite: { build: { sourcemap: false } },
  server: {
    port: 3000,
    host: '127.0.0.1'
  }
});
