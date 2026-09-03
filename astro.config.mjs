import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://adamoorsini.com",
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    sitemap({
      // Keep error pages and any future development-only routes out of search.
      filter: (page) => {
        const { pathname } = new URL(page);
        return pathname !== "/404/" && !pathname.startsWith("/dev-");
      },
    }),
  ],
});
