import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Cpu, Monitor, Terminal, Zap, Code2, ArrowRight } from "lucide-react";
import { absoluteUrl } from "../../utils/seo";

export default function Uses() {
  const canonicalUrl = absoluteUrl("/uses");

  const siteArchitecture = [
    {
      label: "Runtime & Core",
      value: "React 19 + TypeScript 5.9 + Vite 8.0",
      detail:
        "Modern ES module build system enabling instant HMR in development and tree-shaken rollup chunks in production.",
    },
    {
      label: "Styling & Design System",
      value: "Tailwind CSS v4 + Editorial Token System",
      detail:
        "Fluid typography clamped via custom CSS variables, fine rules, and zero CSS-in-JS runtime execution overhead.",
    },
    {
      label: "Rendering Strategy",
      value: "Static Site Pre-rendering (SSG) + Client Hydration",
      detail:
        "Every public route is compiled to static HTML on build, guaranteeing instant crawler indexation without SPA penalties.",
    },
    {
      label: "Data Architecture & Cache",
      value: "Firebase Firestore + Zero-Latency In-Memory Cache",
      detail:
        "Public pages utilize client-side memory caching to eliminate duplicate Firestore round-trips with admin invalidation hooks.",
    },
    {
      label: "Media Delivery",
      value: "Cloudinary CDN",
      detail:
        "Automated format negotiation (WebP/AVIF), quality optimization, and responsive resolution endpoints.",
    },
    {
      label: "Accessibility Compliance",
      value: "WCAG 2.1 AA Compliant",
      detail:
        "Full keyboard navigability, screen-reader landmarks, skip-to-content anchors, and accessible 4.5:1+ contrast ratios.",
    },
    {
      label: "Client Bundle Footprint",
      value: "~69 kB gzipped initial bundle",
      detail:
        "Strict route-level code splitting ensures administrative and analytical dependencies never impact public visitor load time.",
    },
  ];

  const categories = [
    {
      title: "Core Development Stack",
      icon: Code2,
      items: [
        {
          name: "React 19 & Next.js",
          role: "Application Frameworks",
          description:
            "Primary view library for building robust component architectures, declarative states, and server-rendered portals.",
        },
        {
          name: "TypeScript",
          role: "Type Safety & Domain Modeling",
          description:
            "Configured with strict mode enabled. Ensures robust data contracts across APIs and UI components.",
        },
        {
          name: "Tailwind CSS v4",
          role: "Styling Engine",
          description:
            "Utility-first styling compiled with the latest lightning-fast engine, paired with custom editorial design tokens.",
        },
        {
          name: "Vite",
          role: "Bundler & Dev Server",
          description:
            "Ultra-fast build tool with native ESM support and optimized Rollup production bundling.",
        },
      ],
    },
    {
      title: "Performance & Diagnostic Arsenal",
      icon: Zap,
      items: [
        {
          name: "Chrome DevTools Performance Panel",
          role: "Flamechart Profiling",
          description:
            "Daily instrument for recording runtime CPU bottlenecks, long tasks (>50ms), layout thrashing, and memory leaks.",
        },
        {
          name: "Web Vitals Chrome Extension & API",
          role: "Core Web Vitals Telemetry",
          description:
            "Real-time measurement of LCP, INP, and CLS during active interaction and state transitions.",
        },
        {
          name: "Lighthouse CI & PageSpeed Insights",
          role: "Automated Auditing",
          description:
            "Automated benchmarking across performance, accessibility, best practices, and technical SEO.",
        },
        {
          name: "Rollup Visualizer / Bundle Analyzer",
          role: "Asset Health",
          description:
            "Continuous inspection of production chunk sizes to prevent accidental dependency bloat.",
        },
      ],
    },
    {
      title: "Code Quality, Git & Tooling",
      icon: Terminal,
      items: [
        {
          name: "VS Code (Visual Studio Code)",
          role: "Primary Code Editor",
          description:
            "Configured with strict keybindings, JetBrains Mono font with ligatures, and zero distracting visual clutter.",
        },
        {
          name: "ESLint Flat Config & Prettier",
          role: "Code Hygiene & Formatting",
          description:
            "Modern flat configuration with strict TypeScript linting and automated formatting across all source files.",
        },
        {
          name: "Git & GitHub Worktrees",
          role: "Version Control",
          description:
            "Branch-isolated development, clean atomic commit messages, and automated GitHub Actions CI pipelines.",
        },
        {
          name: "Cloudinary & Firebase Admin",
          role: "Cloud Infrastructure",
          description:
            "Serverless document storage and dynamic cloud asset pipelines for global low-latency delivery.",
        },
      ],
    },
    {
      title: "Workstation & Ergonomics",
      icon: Monitor,
      items: [
        {
          name: "HP Victus Performance Workstation",
          role: "Primary Development Machine",
          description:
            "High-throughput multi-core CPU, fast NVMe storage, and dedicated GPU for rapid local builds and emulation.",
        },
        {
          name: "Dual Display Setup",
          role: "Visual & Inspector Layout",
          description:
            "Color-calibrated high-resolution monitors configured for side-by-side code editing and live DevTools profiling.",
        },
        {
          name: "Tactile Mechanical Keyboard",
          role: "Input Device",
          description:
            "Tuned tactile mechanical switches offering consistent actuation force and comfortable long-session ergonomics.",
        },
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-16 pb-16">
      <Helmet>
        <title>Colophon &amp; Toolkit — Mohamed Sharfiras</title>
        <meta
          name="description"
          content="The architectural stack, engineering colophon, hardware, and diagnostic tools used by Mohamed Sharfiras to build resilient web platforms."
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta
          property="og:title"
          content="Colophon & Toolkit — Mohamed Sharfiras"
        />
        <meta
          property="og:description"
          content="The architectural stack, hardware, and performance tools used by Mohamed Sharfiras."
        />
        <meta property="og:url" content={canonicalUrl} />
      </Helmet>

      {/* Hero Header */}
      <section className="space-y-4 pt-4 border-b border-[#E5E4DE] dark:border-[#27313A] pb-12">
        <p className="font-mono text-xs uppercase tracking-wider text-[#1F51D0] dark:text-[#4F7FF7]">
          Colophon &amp; Tooling
        </p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#171F24] dark:text-[#F1F4F6] max-w-2xl leading-tight">
          The engineering toolkit, systems &amp; site colophon.
        </h1>
        <p className="text-sm sm:text-base text-[#55626F] dark:text-[#97A3AF] leading-relaxed max-w-2xl">
          An honest index of the development environment, diagnostic software,
          architectural choices, and hardware I rely on daily to build fast,
          accessible web applications.
        </p>
      </section>

      {/* Site Colophon Breakdown */}
      <section className="p-7 sm:p-9 rounded-lg border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#171F24] space-y-6 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-[#1F51D0] dark:bg-[#4F7FF7] text-white flex items-center justify-center">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#171F24] dark:text-[#F1F4F6] tracking-tight">
              Site Colophon: How This Portfolio Is Built
            </h2>
            <p className="text-xs text-[#55626F] dark:text-[#97A3AF]">
              Architected for zero unnecessary bloat, instant transitions, and
              verified accessibility
            </p>
          </div>
        </div>

        <div className="divide-y divide-[#E5E4DE] dark:divide-[#27313A] text-xs sm:text-sm">
          {siteArchitecture.map((item, idx) => (
            <div
              key={idx}
              className="py-3.5 first:pt-0 last:pb-0 grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-baseline"
            >
              <div className="md:col-span-4 font-mono font-bold text-[#171F24] dark:text-[#F1F4F6] text-xs">
                {item.label}
              </div>
              <div className="md:col-span-8 space-y-1">
                <p className="font-semibold text-[#1F51D0] dark:text-[#4F7FF7]">
                  {item.value}
                </p>
                <p className="text-xs text-[#55626F] dark:text-[#97A3AF] leading-relaxed">
                  {item.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tooling Categories */}
      <div className="space-y-12">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <section key={cat.title} className="space-y-6">
              <div className="flex items-center gap-2.5 pb-2 border-b border-[#E5E4DE] dark:border-[#27313A]">
                <Icon className="w-4 h-4 text-[#1F51D0] dark:text-[#4F7FF7]" />
                <h2 className="text-xl font-bold tracking-tight text-[#171F24] dark:text-[#F1F4F6]">
                  {cat.title}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cat.items.map((item) => (
                  <div
                    key={item.name}
                    className="p-5 rounded-lg border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#171F24] space-y-2 hover:border-[#1F51D0]/40 dark:hover:border-[#4F7FF7]/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-sm text-[#171F24] dark:text-[#F1F4F6]">
                        {item.name}
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F2F1EC] dark:bg-[#222B33] text-[#55626F] dark:text-[#97A3AF] shrink-0">
                        {item.role}
                      </span>
                    </div>
                    <p className="text-xs text-[#55626F] dark:text-[#97A3AF] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Footer CTA */}
      <section className="p-6 sm:p-8 rounded-lg border border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-[#171F24] dark:text-[#F1F4F6]">
            Curious about a specific engineering choice or benchmark?
          </h3>
          <p className="text-xs text-[#55626F] dark:text-[#97A3AF] mt-0.5">
            I am always happy to discuss frontend performance, tooling, or
            architecture trade-offs.
          </p>
        </div>

        <Link
          to="/contact"
          className="min-h-[40px] px-4 py-2 rounded-md bg-[#171F24] dark:bg-[#F1F4F6] text-[#FFFFFF] dark:text-[#171F24] text-xs font-semibold hover:bg-[#27313A] dark:hover:bg-[#E5E4DE] transition-colors inline-flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
        >
          <span>Get in Touch</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>
    </div>
  );
}
