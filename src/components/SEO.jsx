import { Helmet } from "react-helmet-async";
import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";

/**
 * SEO Component - Manages all page-level meta tags
 *
 * @param {string} title - Page title (will be appended with " | DEVLY")
 * @param {string} description - Meta description (150-160 chars recommended)
 * @param {string} keywords - Comma-separated keywords
 * @param {string} image - Open Graph image URL (absolute URL)
 * @param {string} url - Canonical URL (absolute URL)
 * @param {string} type - OpenGraph type (website, article, etc.)
 * @param {object} structuredData - JSON-LD structured data object
 * @param {boolean} noindex - Set to true to prevent indexing
 */
export default function SEO({
  title = "Build Websites, Apps & Tech Solutions",
  description = "DEVLY is your all-in-one tech platform to build websites, web apps, mobile apps, desktop apps, and all tech solutions with ease.",
  keywords = "DEVLY, website builder, app builder, desktop apps, web development, mobile apps, tech platform, design, software development",
  image = "/og-image.webp",
  url = "/",
  type = "website",
  structuredData = null,
  noindex = false,
}) {
  const { language } = useContext(LanguageContext);

  // Construct full title
  const fullTitle = title === "DEVLY" ? title : `${title} | DEVLY`;

  // Ensure absolute URLs for OG tags
  const baseUrl = import.meta.env.VITE_SITE_URL || "https://yourdomain.com";
  const canonicalUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;
  const ogImage = image.startsWith("http") ? image : `${baseUrl}${image}`;

  // Language-specific attributes
  const langAttribute = language === "ar" ? "ar" : language === "fr" ? "fr" : "en";
  const dirAttribute = language === "ar" ? "rtl" : "ltr";

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={langAttribute} dir={dirAttribute} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="DEVLY" />

      {/* Robots */}
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />
      <meta name="googlebot" content={noindex ? "noindex, nofollow" : "index, follow"} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="DEVLY" />
      <meta property="og:locale" content={langAttribute === "ar" ? "ar_AR" : langAttribute === "fr" ? "fr_FR" : "en_US"} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={title} />

      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}
