export const SITE_URL = "https://sharfrasaqsan.vercel.app";

export const DEFAULT_OG_IMAGE =
  "https://res.cloudinary.com/sharfras/image/upload/v1778568121/app7cdpfw8szympmfqtr.webp";

/**
 * Returns an absolute URL based on the site origin
 */
export const absoluteUrl = (path: string = ""): string => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
};

/**
 * Safely extracts a valid image URL string, preventing "[object Object]" serialization bugs
 */
export const resolveImageUrl = (img: any): string => {
  if (!img) return DEFAULT_OG_IMAGE;
  if (typeof img === "string") {
    if (img.trim() === "" || img === "[object Object]") return DEFAULT_OG_IMAGE;
    return img.startsWith("http") ? img : absoluteUrl(img);
  }
  if (typeof img === "object" && img.url && typeof img.url === "string") {
    return img.url.startsWith("http") ? img.url : absoluteUrl(img.url);
  }
  return DEFAULT_OG_IMAGE;
};

/**
 * Calculates consistent reading time (in minutes) based on word count
 */
export const calculateReadingTime = (content: string = ""): number => {
  if (!content) return 1;
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

/**
 * Generates Person & WebSite schema for homepage and about pages
 */
export const buildPersonSchema = () => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Mohamed Sharfiras",
      alternateName: "Anwarkhan Mohamed Sharfiras",
      jobTitle: "Web Developer",
      description:
        "Web Developer with 4+ years of professional experience across enterprise web migrations (HSBC), high-traffic eCommerce (Oscar Wylee), React, Next.js, and Technical SEO.",
      url: SITE_URL,
      sameAs: [
        "https://www.linkedin.com/in/sharfiras",
        "https://github.com/sharfrasaqsan",
      ],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Colombo",
        addressCountry: "LK",
      },
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "University of Kelaniya",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Mohamed Sharfiras Portfolio",
      description: "Portfolio of Mohamed Sharfiras, Web & Frontend Engineer",
      publisher: {
        "@id": `${SITE_URL}/#person`,
      },
    },
  ],
});

/**
 * Generates CreativeWork / SoftwareApplication schema for project case studies
 */
export const buildProjectSchema = (project: any, canonicalUrl: string) => {
  const images =
    Array.isArray(project.images) && project.images.length > 0
      ? project.images.map(resolveImageUrl)
      : [resolveImageUrl(project.image)];

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    description: project.shortDesc || project.fullDesc?.slice(0, 160),
    url: canonicalUrl,
    image: images,
    applicationCategory: project.category || "WebApplication",
    operatingSystem: "Web",
    author: {
      "@type": "Person",
      name: "Mohamed Sharfiras",
      url: `${SITE_URL}/about`,
    },
    datePublished: project.createdAt?.toDate
      ? project.createdAt.toDate().toISOString()
      : undefined,
  };
};

/**
 * Generates BlogPosting schema with strictly validated string image URLs
 */
export const buildArticleSchema = (blog: any, canonicalUrl: string) => {
  const images =
    Array.isArray(blog.images) && blog.images.length > 0
      ? blog.images.map(resolveImageUrl)
      : [resolveImageUrl(blog.coverImage)];

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt || blog.title,
    url: canonicalUrl,
    image: images,
    author: {
      "@type": "Person",
      name: "Mohamed Sharfiras",
      url: `${SITE_URL}/about`,
    },
    datePublished: blog.createdAt?.toDate
      ? blog.createdAt.toDate().toISOString()
      : undefined,
    dateModified: blog.updatedAt?.toDate
      ? blog.updatedAt.toDate().toISOString()
      : blog.createdAt?.toDate
        ? blog.createdAt.toDate().toISOString()
        : undefined,
    publisher: {
      "@type": "Person",
      name: "Mohamed Sharfiras",
    },
  };
};

/**
 * Generates BreadcrumbList schema
 */
export const buildBreadcrumbsSchema = (
  items: { name: string; path: string }[],
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});
