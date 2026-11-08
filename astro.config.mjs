// @ts-check
import { defineConfig } from 'astro/config';

// SITE_URL and BASE_PATH are filled in by the GitHub Pages workflow, so the
// same code works at deovandski.github.io/ or deovandski.github.io/Deovandski/.
export default defineConfig({
  site: process.env.SITE_URL || 'https://deovandski.github.io',
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'ignore',
  vite: {
    server: { fs: { allow: ['..'] } },
  },
});
