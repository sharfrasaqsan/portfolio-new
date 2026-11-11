import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Globe,
  Zap,
  Code2,
  Search,
  CheckCircle2,
  ArrowRight,
  Clock,
  ShieldCheck,
  Layers,
  FileCheck,
} from "lucide-react";
import { absoluteUrl } from "../../utils/seo";

export default function Services() {
  const canonicalUrl = absoluteUrl("/services");

  const offerings = [
    {
      id: "enterprise-modernization",
      icon: Globe,
      title: "Enterprise Web & Intranet Modernization",
      subtitle: "Multi-Environment Governance, Content Migration & WCAG AA",
      description:
        "Drawing on enterprise experience at HSBC GSC, I engineer robust corporate web portals and internal knowledge hubs. From strict design system enforcement to zero-regression release governance across Dev, UAT, and Production.",
      outcomes: [
        "Structured content migration workflows across WordPress & SharePoint",
        "Enterprise design system component libraries with strict brand fidelity",
        "Full WCAG 2.1 AA accessibility compliance and keyboard navigability",
        "Rigorous release checklists, defect remediation, and deployment sign-offs",
      ],
      idealFor:
        "Enterprises, financial institutions, and global teams migrating legacy portals or requiring structured release governance.",
    },
    {
      id: "cwv-technical-seo",
      icon: Zap,
      title: "Core Web Vitals & Technical SEO Remediation",
      subtitle: "Sub-Second LCP, INP Stabilization & Organic Search Uplift",
      description:
        "Proven results from commercial eCommerce at Oscar Wylee (+30% organic search traffic, +25% mobile speed score, -15% load latency). I identify critical rendering bottlenecks and refactor frontend architecture to dominate search indexing.",
      outcomes: [
        "Diagnostic telemetry audits identifying exact LCP, INP, and CLS culprits",
        "Critical CSS extraction, dynamic script deferral, and layout-shift eradication",
        "Structured JSON-LD schema architecture (Organization, Breadcrumbs, Case Studies)",
        "Static site pre-rendering pipelines ensuring 100% crawler discovery without SPA penalties",
      ],
      idealFor:
        "High-traffic eCommerce brands, legal platforms, and publications whose revenue depends on search ranking and conversion speed.",
    },
    {
      id: "react-nextjs-engineering",
      icon: Code2,
      title: "Custom React & Next.js Application Engineering",
      subtitle: "Scalable Frontend Systems, TypeScript & Cloud Integrations",
      description:
        "End-to-end frontend architecture for greenfield applications and SaaS products. Clean modular codebases authored with React 19, Next.js, strict TypeScript, and Tailwind CSS v4, backed by cloud storage and serverless APIs.",
      outcomes: [
        "Type-safe, component-driven UI architecture built for maintainability",
        "Cloudinary CDN pipelines for responsive, compressed modern media delivery",
        "Zero-latency client state management and in-memory caching layers",
        "Secure Firebase Firestore / RESTful API integrations with defensive validation",
      ],
      idealFor:
        "Product startups and scaleups needing a senior engineer to turn technical specifications into polished production web apps.",
    },
    {
      id: "frontend-audits",
      icon: Search,
      title: "Frontend Architecture Audits & Advisory",
      subtitle:
        "Codebase Inspection, Bundle Reduction & Modernization Roadmaps",
      description:
        "A rigorous, independent architectural review of your existing frontend application. I dissect bundle composition, runtime performance, dependency bloat, accessibility gaps, and security postures.",
      outcomes: [
        "Actionable, prioritized findings matrix categorized by business impact",
        "Bundle analysis identifying unneeded polyfills, heavy packages, and duplicate code",
        "Modernization blueprint with step-by-step refactoring PR recommendations",
        "Mentorship and architectural guidance for existing internal developer teams",
      ],
      idealFor:
        "Engineering leaders, CTOs, and non-technical founders seeking verified clarity on codebase quality before scaling.",
    },
  ];

  const processStages = [
    {
      step: "01",
      name: "Technical Discovery & Baseline Telemetry",
      summary:
        "Deep inspection of business goals, technical requirements, existing codebases, and performance baselines before writing a single line of code.",
    },
    {
      step: "02",
      name: "Architectural Specification & Contracts",
      summary:
        "Definition of component trees, data contracts, API boundaries, state topologies, and milestone deliverables with clear success criteria.",
    },
    {
      step: "03",
      name: "Iterative Engineering & Profiling",
      summary:
        "Sprint execution with strict TypeScript verification, automated linting, Chrome DevTools performance profiling, and continuous deployment previews.",
    },
    {
      step: "04",
      name: "Production Release & Telemetry Handover",
      summary:
        "Deployment to production infrastructure, verification across real devices, comprehensive technical runbooks, and handover documentation.",
    },
  ];

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Frontend Engineering & Technical Advisory",
    provider: {
      "@type": "Person",
      name: "Mohamed Sharfiras",
      jobTitle: "Web Developer & Frontend Engineer",
      url: "https://sharfrasaqsan.vercel.app",
    },
    areaServed: "Worldwide",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Frontend Engineering Services",
      itemListElement: offerings.map((o) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: o.title,
          description: o.description,
        },
      })),
    },
  };

  return (
    <div className="max-w-4xl mx-auto space-y-16 pb-16">
      <Helmet>
        <title>Engineering Services &amp; Advisory — Mohamed Sharfiras</title>
        <meta
          name="description"
          content="Professional frontend engineering, enterprise intranet modernization, Core Web Vitals remediation, and React/Next.js application architecture by Mohamed Sharfiras."
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta
          property="og:title"
          content="Engineering Services & Advisory — Mohamed Sharfiras"
        />
        <meta
          property="og:description"
          content="Enterprise intranet migrations, Core Web Vitals optimization, and high-performance React application architecture."
        />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify(serviceSchema)}
        </script>
      </Helmet>

      {/* Hero Header */}
      <section className="space-y-4 pt-4 border-b border-[#E5E4DE] dark:border-[#27313A] pb-12">
        <p className="font-mono text-xs uppercase tracking-wider text-[#1F51D0] dark:text-[#4F7FF7]">
          Capabilities &amp; Advisory
        </p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#171F24] dark:text-[#F1F4F6] max-w-2xl leading-tight">
          Reliable frontend engineering for high-stakes web platforms.
        </h1>
        <p className="text-sm sm:text-base text-[#55626F] dark:text-[#97A3AF] leading-relaxed max-w-2xl">
          Partnering with enterprise product teams, eCommerce brands, and
          founders to architect resilient frontend systems, resolve Core Web
          Vitals bottlenecks, and scale search engine visibility.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-3">
          <Link
            to="/contact?type=client"
            className="min-h-[44px] px-5 py-2.5 rounded-md bg-[#1F51D0] dark:bg-[#4F7FF7] text-white text-xs sm:text-sm font-semibold hover:bg-[#1942AA] dark:hover:bg-[#3D6CE5] transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-[#1F51D0]"
          >
            <span>Request Project Consultation</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
          <a
            href="#process"
            className="min-h-[44px] px-5 py-2.5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#1B2228] text-[#171F24] dark:text-[#F1F4F6] text-xs sm:text-sm font-semibold hover:bg-[#F2F1EC] dark:hover:bg-[#222B33] transition-colors inline-flex items-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#1F51D0]"
          >
            <span>How I Work</span>
          </a>
        </div>
      </section>

      {/* Core Service Offerings */}
      <section className="space-y-8">
        <div className="space-y-1">
          <p className="font-mono text-xs uppercase tracking-wider text-[#1F51D0] dark:text-[#4F7FF7]">
            Core Offerings
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-[#171F24] dark:text-[#F1F4F6]">
            Architectural Services
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offerings.map((o) => {
            const Icon = o.icon;
            return (
              <article
                key={o.id}
                className="p-6 sm:p-7 rounded-lg border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#171F24] flex flex-col justify-between space-y-6 hover:border-[#1F51D0]/50 dark:hover:border-[#4F7FF7]/50 transition-colors shadow-xs"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-md bg-[#F2F1EC] dark:bg-[#222B33] flex items-center justify-center text-[#1F51D0] dark:text-[#4F7FF7]">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#171F24] dark:text-[#F1F4F6] tracking-tight">
                      {o.title}
                    </h3>
                    <p className="font-mono text-[11px] text-[#1F51D0] dark:text-[#4F7FF7] mt-0.5">
                      {o.subtitle}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-[#55626F] dark:text-[#97A3AF] leading-relaxed">
                    {o.description}
                  </p>

                  {/* Concrete Outcomes */}
                  <div className="pt-2 border-t border-[#E5E4DE] dark:border-[#27313A] space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#171F24] dark:text-[#F1F4F6]">
                      Key Deliverables
                    </p>
                    <ul className="space-y-1.5 text-xs text-[#55626F] dark:text-[#97A3AF]">
                      {o.outcomes.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E5E4DE] dark:border-[#27313A] flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-[#55626F] dark:text-[#97A3AF]">
                    Best for: {o.idealFor.split(",")[0]}
                  </span>
                  <Link
                    to={`/contact?type=client&service=${encodeURIComponent(o.title)}`}
                    className="font-semibold text-[#1F51D0] dark:text-[#4F7FF7] hover:underline inline-flex items-center gap-1"
                  >
                    <span>Inquire</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Engagement Process */}
      <section
        id="process"
        className="space-y-8 pt-6 border-t border-[#E5E4DE] dark:border-[#27313A]"
      >
        <div className="space-y-1">
          <p className="font-mono text-xs uppercase tracking-wider text-[#1F51D0] dark:text-[#4F7FF7]">
            Methodology
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-[#171F24] dark:text-[#F1F4F6]">
            The 4-Stage Engagement Process
          </h2>
          <p className="text-xs sm:text-sm text-[#55626F] dark:text-[#97A3AF] max-w-xl">
            A disciplined, predictable delivery framework designed to eliminate
            architectural rework and ship verifiable production outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {processStages.map((stage) => (
            <div
              key={stage.step}
              className="p-5 rounded-lg border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#171F24] space-y-3"
            >
              <span className="text-2xl font-mono font-bold text-[#1F51D0] dark:text-[#4F7FF7]">
                {stage.step}
              </span>
              <h3 className="text-sm font-bold text-[#171F24] dark:text-[#F1F4F6] leading-snug">
                {stage.name}
              </h3>
              <p className="text-xs text-[#55626F] dark:text-[#97A3AF] leading-relaxed">
                {stage.summary}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Working Terms & Timezone Availability */}
      <section className="p-7 sm:p-9 rounded-lg border border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B] space-y-6">
        <div className="space-y-1">
          <p className="font-mono text-xs uppercase tracking-wider text-[#1F51D0] dark:text-[#4F7FF7]">
            Engagement Details
          </p>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#171F24] dark:text-[#F1F4F6]">
            Availability, Timezone &amp; Working Terms
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs sm:text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#171F24] dark:text-[#F1F4F6]">
              <Clock className="w-4 h-4 text-[#1F51D0] dark:text-[#4F7FF7]" />
              <span>Timezone Alignment</span>
            </div>
            <p className="text-[#55626F] dark:text-[#97A3AF] leading-relaxed">
              Based in <strong>Colombo (UTC+5:30)</strong>. Natural 4–6 hour
              working overlap with London/Europe (BST/CEST) and Asia-Pacific
              (AEST/SGT), and high asynchronous agility for Americas timezones.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#171F24] dark:text-[#F1F4F6]">
              <Layers className="w-4 h-4 text-[#1F51D0] dark:text-[#4F7FF7]" />
              <span>Engagement Models</span>
            </div>
            <p className="text-[#55626F] dark:text-[#97A3AF] leading-relaxed">
              Available for <strong>project-based contracts</strong>,{" "}
              <strong>fractional technical advisory</strong>, or{" "}
              <strong>full-time senior frontend engineering roles</strong>.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#171F24] dark:text-[#F1F4F6]">
              <FileCheck className="w-4 h-4 text-[#1F51D0] dark:text-[#4F7FF7]" />
              <span>Code Standards &amp; IP</span>
            </div>
            <p className="text-[#55626F] dark:text-[#97A3AF] leading-relaxed">
              Full copyright assignment, strict non-disclosure (NDA) compliance,
              clean Git history with PR reviews, and automated CI/CD pipeline
              integration.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-[#E5E4DE] dark:border-[#27313A] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#55626F] dark:text-[#97A3AF]">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>
              Currently accepting Q2/Q3 2026 client projects &amp; senior roles
            </span>
          </div>

          <Link
            to="/contact?type=client"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1F51D0] dark:text-[#4F7FF7] hover:underline"
          >
            <span>Start an engineering conversation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
