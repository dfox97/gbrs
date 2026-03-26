// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: netlify({
    imageCDN: true,
  }),
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
    domains: [],
    remotePatterns: [],
  },
});
