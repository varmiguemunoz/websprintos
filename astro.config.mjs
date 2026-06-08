import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import Compress from 'astro-compress';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

const SITE_URL = 'https://www.sprintos.run';

export default defineConfig({
  site: SITE_URL,
  output: 'server',

  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },

  adapter: vercel({
    webAnalytics: { enabled: true },
    speedInsights: { enabled: true },
  }),

  image: {
    remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com' }],
    service: { entrypoint: 'astro/assets/services/sharp' },
  },

  markdown: {
    shikiConfig: {
      theme: 'material-theme-palenight',
      wrap: true,
    },
  },

  integrations: [
    mdx({
      syntaxHighlight: 'shiki',
      shikiConfig: {
        theme: 'material-theme-palenight',
        wrap: true,
      },
    }),

    tailwind({ applyBaseStyles: false }),

    react(),

    Compress({
      CSS: true,
      HTML: {
        removeAttributeQuotes: false,
        removeComments: true,
        collapseWhitespace: true,
      },
      Image: false,
      JavaScript: true,
      SVG: true,
    }),

    sitemap({
      filter: (page) =>
        !page.includes('/funnel/') &&
        !page.includes('/payment/') &&
        !page.includes('/thank-you/') &&
        !page.includes('/api/'),
      customPages: [SITE_URL, `${SITE_URL}/blog`, `${SITE_URL}/privacy-policy`, `${SITE_URL}/terms-and-conditions`],
      serialize(item) {
        /* Homepage — highest priority */
        if (item.url === `${SITE_URL}/`) {
          return { ...item, priority: 1.0, changefreq: 'weekly' };
        }
        /* Blog listing */
        if (item.url === `${SITE_URL}/blog` || item.url === `${SITE_URL}/blog/`) {
          return { ...item, priority: 0.9, changefreq: 'daily' };
        }
        /* Individual blog posts */
        if (item.url.includes('/blog/')) {
          return { ...item, priority: 0.8, changefreq: 'monthly' };
        }
        /* Legal pages */
        if (item.url.includes('/privacy') || item.url.includes('/terms')) {
          return { ...item, priority: 0.2, changefreq: 'yearly' };
        }
        return { ...item, priority: 0.6, changefreq: 'monthly' };
      },
      lastmod: new Date(),
    }),

    robotsTxt({
      policy: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/api/'],
          crawlDelay: 0,
        },
        {
          userAgent: 'Googlebot',
          allow: '/',
          disallow: ['/api/'],
          crawlDelay: 0,
        },
      ],
      sitemap: `${SITE_URL}/sitemap-index.xml`,
    }),
  ],

  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            /* Only packages that are actually used in the SprintOS site */
            'react-vendor': ['react', 'react-dom'],
          },
        },
      },
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          passes: 2,
        },
        format: { comments: false },
      },
      chunkSizeWarningLimit: 500,
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
  },
});
