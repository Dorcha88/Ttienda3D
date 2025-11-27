// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";

export default defineConfig({
  // 1. Activamos Tailwind
  integrations: [tailwind()],
  
  // 2. IMPORTANTE: Activamos el modo servidor para que funcionen las APIs y el Login
  output: 'server',
  
  // 3. Conectamos con Vercel
  adapter: vercel(),
});