import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

/** GitHub Pages: set site to https://<user>.github.io/Eidos-Design-Pattern/ */
export default defineConfig({
  site: "https://YOUR_GITHUB_USERNAME.github.io",
  base: "/Eidos-Design-Pattern",
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: "github-dark-dimmed",
    },
  },
});
