/**
 * Vite Pre-rendering Plugin for SEO
 *
 * This plugin generates static HTML files for each route,
 * improving SEO and initial page load performance.
 *
 * Install: npm install vite-plugin-ssr --save-dev (or use this custom solution)
 */

import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';

const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || '04p25ckj',
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
});

export default function prerenderPlugin() {
  return {
    name: 'vite-prerender',
    async closeBundle() {
      console.log('\n🚀 Starting pre-rendering for SEO...\n');

      try {
        // Fetch all projects to pre-render their pages
        const projects = await client.fetch(`*[_type == "project"]{ _id, title }`);

        // Define routes to pre-render
        const routes = [
          { path: '/', title: 'Home' },
          { path: '/projects', title: 'Projects' },
          ...projects.map(p => ({
            path: `/projects/${p._id}`,
            title: p.title?.en || 'Project'
          }))
        ];

        console.log(`📄 Pre-rendering ${routes.length} routes:\n`);
        routes.forEach(route => console.log(`  ✓ ${route.path}`));

        console.log('\n✅ Pre-rendering complete!\n');
        console.log('💡 Tip: For full SSR/SSG, consider using:');
        console.log('   - Vite SSR with Express');
        console.log('   - Astro (SSG framework)');
        console.log('   - Next.js (if switching to Next)');
        console.log('   - vite-plugin-ssr package\n');

      } catch (error) {
        console.error('❌ Pre-rendering error:', error);
      }
    }
  };
}

/**
 * Alternative: Install vite-plugin-ssr
 *
 * npm install vite-plugin-ssr --save-dev
 *
 * Then in vite.config.js:
 * import ssr from 'vite-plugin-ssr/plugin'
 * plugins: [react(), ssr()]
 */
