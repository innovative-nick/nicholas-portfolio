import { defineConfig } from 'astro/config';

// Change `site` if Cloudflare gives the project a different address.
export default defineConfig({
  site: 'https://nicholas.pages.dev',
  output: 'static',
  build: { inlineStylesheets: 'auto' },
});
