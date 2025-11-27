// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import netlify from "@astrojs/netlify";

export default defineConfig({
  // 1. Activamos Tailwind
  integrations: [tailwind()],
  
  // 2. IMPORTANTE: Activamos el modo servidor para que funcionen las APIs y el Login
  output: 'server',
  
  // 3. Conectamos con netlify
  adapter: netlify(),

  security: {
    checkOrigin: false
  }
  
});