// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeContentLinks from './src/utils/content-links.js';

const base = process.env.SITE_BASE || '/';

// https://astro.build/config
export default defineConfig({
  site: 'https://sungeuns.github.io',
  base,
  trailingSlash: 'always',
  integrations: [
    mdx({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex, [rehypeContentLinks, { base }]],
    }),
    react()
  ],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex, [rehypeContentLinks, { base }]],
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ko'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
