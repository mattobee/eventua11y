import { sanityIntegration } from '@sanity/astro';
import { defineConfig } from "astro/config";

import netlify from "@astrojs/netlify/functions";

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  adapter: netlify(),
  integrations: [
    sanityIntegration({
      projectId: "2g5zqxo3",
      dataset: "production",
      // Set useCdn to false if you're building statically.
      useCdn: false,
    })
  ]
});