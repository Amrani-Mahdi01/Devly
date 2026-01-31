/**
 * Structured Data (JSON-LD) Generators
 * These functions create schema.org markup for better SEO
 */

const baseUrl = import.meta.env.VITE_SITE_URL || "https://yourdomain.com";

/**
 * Organization Schema - Use on homepage
 */
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "DEVLY",
  "description": "Professional web development, mobile apps, and tech solutions agency",
  "url": baseUrl,
  "logo": `${baseUrl}/logo.svg`,
  "foundingDate": "2020",
  "sameAs": [
    // Add your social media URLs
    // "https://www.facebook.com/devly",
    // "https://twitter.com/devly",
    // "https://www.linkedin.com/company/devly",
    // "https://github.com/devly"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Service",
    "availableLanguage": ["English", "French", "Arabic"]
  },
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "US" // Update with your country
  }
};

/**
 * Website Schema - Use on homepage
 */
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "DEVLY",
  "description": "Build Websites, Apps & Tech Solutions",
  "url": baseUrl,
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${baseUrl}/projects?search={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  }
};

/**
 * Breadcrumb Schema Generator
 * @param {Array} items - Array of {name, url} objects
 */
export const breadcrumbSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url.startsWith("http") ? item.url : `${baseUrl}${item.url}`
  }))
});

/**
 * Service Schema - Use on services section/page
 */
export const servicesSchema = (services) => ({
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "DEVLY",
  "url": baseUrl,
  "description": "Professional web development and tech solutions",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Tech Services",
    "itemListElement": services.map(service => ({
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": service.name || service.title,
        "description": service.description
      }
    }))
  }
});

/**
 * Project/Portfolio Schema
 * @param {Object} project - Project details
 */
export const projectSchema = (project) => ({
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": project.title,
  "description": project.description,
  "image": project.image,
  "url": `${baseUrl}/projects/${project.slug || project.id}`,
  "author": {
    "@type": "Organization",
    "name": "DEVLY"
  },
  "datePublished": project.publishedDate,
  "keywords": project.tags?.join(", ") || project.category
});

/**
 * FAQ Schema Generator
 * @param {Array} faqs - Array of {question, answer} objects
 */
export const faqSchema = (faqs) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

/**
 * Article Schema - For blog posts or detailed project pages
 */
export const articleSchema = (article) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "description": article.description,
  "image": article.image,
  "author": {
    "@type": "Organization",
    "name": "DEVLY"
  },
  "publisher": {
    "@type": "Organization",
    "name": "DEVLY",
    "logo": {
      "@type": "ImageObject",
      "url": `${baseUrl}/logo.svg`
    }
  },
  "datePublished": article.publishedDate,
  "dateModified": article.modifiedDate || article.publishedDate
});

/**
 * Offer/Pricing Schema
 * @param {Array} offers - Array of pricing plans
 */
export const offerSchema = (offers) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": offers.map((offer, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "item": {
      "@type": "Offer",
      "name": offer.name || offer.title,
      "description": offer.description,
      "price": offer.price,
      "priceCurrency": offer.currency || "USD"
    }
  }))
});

/**
 * Combined Homepage Schema - Organization + Website
 */
export const homepageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    organizationSchema,
    websiteSchema
  ]
};
