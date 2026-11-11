import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, "../dist");
const sitemapPath = path.resolve(__dirname, "../public/sitemap.xml");

const SITE_URL = "https://sharfrasaqsan.vercel.app";
const DEFAULT_OG_IMAGE =
  "https://res.cloudinary.com/sharfras/image/upload/v1778568121/app7cdpfw8szympmfqtr.webp";

if (!fs.existsSync(distDir)) {
  console.error("dist directory not found. Please run vite build first.");
  process.exit(1);
}

const templatePath = path.join(distDir, "index.html");
const template = fs.readFileSync(templatePath, "utf-8");

// Known project titles mapping for static metadata
const projectTitles = {
  "MflCmhqBMJ5PDrz6H2DD": "Atmospheric Intelligence — Weather Telemetry Platform",
  "8CQMnDasKgNgV38huMuj": "Fixxable — SaaS Automation Platform",
  "TCxzhTSYCxuBr9q7EJUf": "Auction Solicitor — Property Auction Legal Services",
  "0lqZjvslmHJncTTadAfw": "Meridian Law Group — Modern Legal Web Platform",
  "1xUxXzNbDPGVBrSkL8EV": "Slinkup — Social Networking Web Application",
  "6JQheDhQU2rDolV5YAa3": "Study Tracker — Productivity & Assignment Platform",
  "AhtWy6o1sXQDjs820Os8": "E-Shop: PC & Network Solutions — eCommerce System",
  "TmAGAucYY1nIvtbNRVE0": "Royal Reserve: Luxury Hotel Booking Platform",
  "Z8kfLosbaaFhg7QnhCv5": "Webphoria — Digital & Automation Agency",
  "b2L9FLiEVqPEPu99vFFM": "Cosmetic Claims — Medical Negligence Legal Services",
  "nxLXiGygVfYOuHQi4ftM": "My Auction Lawyer — Auction Property Legal Platform",
  "ocU78f4RZ0bUpFE1uZha": "Lease Lawyer — Commercial Lease Legal Services",
};

// Known blog titles mapping for static metadata
const blogTitles = {
  "core-web-vitals-ecommerce-optimization":
    "Deconstructing Core Web Vitals: How We Cut LCP from 4.2s to 1.1s on High-Traffic eCommerce",
  "zero-spam-resilient-client-forms":
    "Building Bulletproof Client Forms: Webhooks, Honeypots, and CRM Sync Without Annoying Users",
  "nextjs-app-router-vs-vite-spa":
    "Next.js App Router vs Vite SPA in 2026: A Practical Architecture Decision Matrix",
  "enterprise-intranet-migration-lessons":
    "Lessons from Enterprise Intranet Migrations: Governance, Zero Downtime, and Managing 1,000+ Internal Pages",
  "Ckh6CeqiqDYeywtEx6TT":
    "WordPress vs Custom Development: What I Actually Use for Client Projects in 2026",
  "PMEpikraHow948AXehE4":
    "How I Build High-Converting Websites as a Developer, Not Just a Designer",
  "RZ7k1CJZIHsbelpeEDxf":
    "From Static Website to Full System: How I Add Automation to My Web Projects",
  "Z4TtwbJlpi5LWfmyg9ob":
    "Why Most Business Websites Fail in 2026 (And How to Fix Yours Fast)",
  "sJiJUF6nHiXqldWQwmYC":
    "How I Build Fast, SEO-Optimized Websites Using HTML, WordPress & Modern Tools",
  "sxP5sfpjgQT36gyq1r3W":
    "7 Frontend Mistakes That Are Killing Your Website Performance (And How to Fix Them)",
};

const baseRoutes = [
  {
    path: "/",
    title: "Mohamed Sharfiras — Web Developer",
    description:
      "Portfolio of Mohamed Sharfiras, a Web Developer with 4+ years of professional experience in enterprise web migrations (HSBC), high-performance eCommerce (Oscar Wylee), React, Next.js, and Technical SEO.",
  },
  {
    path: "/about",
    title: "About Mohamed Sharfiras — Web Developer",
    description:
      "Professional background of Mohamed Sharfiras: 4+ years of experience across enterprise intranet migrations (HSBC), high-traffic eCommerce (Oscar Wylee), React, Next.js, and Technical SEO.",
  },
  {
    path: "/projects",
    title: "Projects Archive | Mohamed Sharfiras — Web Developer",
    description:
      "Explore the engineering project archive of Mohamed Sharfiras: enterprise intranets, commercial legal platforms, high-performance web applications, and telemetry systems.",
  },
  {
    path: "/blog",
    title: "Engineering Blog & Notes | Mohamed Sharfiras",
    description:
      "Technical writing by Mohamed Sharfiras on frontend engineering, enterprise migrations, WordPress architectures, performance optimization, and automation.",
  },
  {
    path: "/services",
    title: "Web Services & Advisory | Mohamed Sharfiras",
    description:
      "Enterprise web migrations, Core Web Vitals remediation, and high-performance React/Next.js application engineering by Mohamed Sharfiras.",
  },
  {
    path: "/uses",
    title: "Colophon & Toolkit (/uses) | Mohamed Sharfiras",
    description:
      "The architectural stack, site colophon, performance profiling tools, and development environment used by Mohamed Sharfiras.",
  },
  {
    path: "/contact",
    title: "Contact Mohamed Sharfiras — Web Developer",
    description:
      "Discuss an enterprise intranet migration, high-performance web project, or technical consultation with Mohamed Sharfiras. Based in Colombo, Sri Lanka.",
  },
];

// Read sitemap to discover all routes
let allRoutes = [...baseRoutes];
if (fs.existsSync(sitemapPath)) {
  const xml = fs.readFileSync(sitemapPath, "utf-8");
  const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);

  locs.forEach((loc) => {
    const routePath = loc.replace(SITE_URL, "") || "/";
    if (!allRoutes.some((r) => r.path === routePath)) {
      if (routePath.startsWith("/projects/")) {
        const id = routePath.split("/")[2];
        const title = projectTitles[id] || "Project Case Study";
        allRoutes.push({
          path: routePath,
          title: `${title} | Mohamed Sharfiras`,
          description: `Technical case study documenting architecture, implementation decisions, and tradeoffs for ${title} by Mohamed Sharfiras.`,
        });
      } else if (routePath.startsWith("/blog/")) {
        const id = routePath.split("/")[2];
        const title = blogTitles[id] || "Technical Article";
        allRoutes.push({
          path: routePath,
          title: `${title} | Mohamed Sharfiras`,
          description: `Technical article by Mohamed Sharfiras: ${title}.`,
        });
      }
    }
  });
}

function generateHtml(route) {
  const canonicalUrl = `${SITE_URL}${route.path === "/" ? "" : route.path}`;

  let html = template;

  // Replace Title
  html = html.replace(
    /<title>.*?<\/title>/,
    `<title>${route.title}</title>`,
  );

  // Replace Description
  html = html.replace(
    /<meta\s+name="description"\s+content=".*?"\s*\/?>/,
    `<meta name="description" content="${route.description}" />`,
  );

  // Inject Canonical & OpenGraph & Twitter tags into <head>
  const tags = `
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:type" content="${route.path.startsWith("/blog/") ? "article" : "website"}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:title" content="${route.title}" />
    <meta property="og:description" content="${route.description}" />
    <meta property="og:image" content="${DEFAULT_OG_IMAGE}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${route.title}" />
    <meta name="twitter:description" content="${route.description}" />
    <meta name="twitter:image" content="${DEFAULT_OG_IMAGE}" />
  `;

  html = html.replace("</head>", `${tags}\n  </head>`);
  return html;
}

console.log(`Generating static prerendered HTML files for ${allRoutes.length} routes...`);

allRoutes.forEach((route) => {
  const html = generateHtml(route);

  if (route.path === "/") {
    fs.writeFileSync(path.join(distDir, "index.html"), html, "utf-8");
  } else {
    const targetDir = path.join(distDir, route.path.replace(/^\//, ""));
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(path.join(targetDir, "index.html"), html, "utf-8");
  }
});

console.log(`✓ Prerendered ${allRoutes.length} routes into dist/ successfully.`);

// Ensure RSS feed is copied to dist
const rssSource = path.resolve(__dirname, "../public/rss.xml");
const rssDest = path.join(distDir, "rss.xml");
if (fs.existsSync(rssSource)) {
  fs.copyFileSync(rssSource, rssDest);
  console.log("✓ Copied rss.xml to dist/");
}
