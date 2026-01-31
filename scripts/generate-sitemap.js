/**
 * Sitemap Generator for DEVLY
 *
 * This script generates a sitemap.xml file for better SEO.
 * It fetches projects from Sanity CMS and creates URLs for all pages.
 *
 * Usage: node scripts/generate-sitemap.js
 */

import { createClient } from '@sanity/client';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Sanity client configuration
const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || '04p25ckj',
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
});

// Your site URL (update this or use environment variable)
const SITE_URL = process.env.VITE_SITE_URL || 'https://yourdomain.com';

/**
 * Generate sitemap XML
 */
async function generateSitemap() {
  try {
    console.log('Fetching projects from Sanity...');

    // Fetch all projects
    const projects = await client.fetch(`*[_type == "project"]{
      _id,
      _updatedAt,
      slug
    }`);

    console.log(`Found ${projects.length} projects`);

    // Static pages
    const staticPages = [
      { url: '/', changefreq: 'daily', priority: '1.0' },
      { url: '/projects', changefreq: 'weekly', priority: '0.8' },
    ];

    // Dynamic project pages
    const projectPages = projects.map(project => ({
      url: `/projects/${project._id}`,
      changefreq: 'monthly',
      priority: '0.7',
      lastmod: project._updatedAt,
    }));

    // Combine all pages
    const allPages = [...staticPages, ...projectPages];

    // Generate XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    page => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    ${page.lastmod ? `<lastmod>${new Date(page.lastmod).toISOString()}</lastmod>` : ''}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    // Write to public/sitemap.xml
    const outputPath = join(__dirname, '../public/sitemap.xml');
    writeFileSync(outputPath, sitemap);

    console.log(`✅ Sitemap generated successfully at ${outputPath}`);
    console.log(`📄 Total URLs: ${allPages.length}`);
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

// Run the generator
generateSitemap();
