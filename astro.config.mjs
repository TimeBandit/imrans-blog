import mdx from '@astrojs/mdx';
import netlify from "@astrojs/netlify";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://www.imran-nazir.com", // Update with your actual Netlify URL
  integrations: [mdx(),preact(),sitemap(),],
  image: {
    responsiveStyles: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
  // experimental: {
  //   svgo: true,
  // },
  markdown: {
    // Turn the whole syntax‑highlighting pipeline off
    syntaxHighlight: false,
    format: "mdx",
  },
  adapter: netlify(),
});