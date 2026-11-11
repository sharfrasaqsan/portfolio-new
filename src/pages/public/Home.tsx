import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight,
  Download,
  ExternalLink,
  Github,
  Building2,
  TrendingUp,
  Smartphone,
  Zap,
  Clock,
  Calendar,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { CardSkeleton } from "../../components/Skeleton";
import { CoreWebVitalsInspector } from "../../components/CoreWebVitalsInspector";
import {
  absoluteUrl,
  buildPersonSchema,
  resolveImageUrl,
  calculateReadingTime,
} from "../../utils/seo";
import { getCachedProjects, getCachedBlogs } from "../../utils/dataCache";
import { extractMainTechs } from "../../utils/techUtils";

const Home = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadContent = async () => {
      try {
        const [projectList, blogList] = await Promise.all([
          getCachedProjects(),
          getCachedBlogs(),
        ]);

        if (isMounted) {
          setProjects(projectList);
          const publishedBlogs = blogList
            .filter((b: any) => b.status === "Published")
            .slice(0, 3);
          setBlogs(publishedBlogs);
        }
      } catch (err) {
        console.error("Home content load error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadContent();
    return () => {
      isMounted = false;
    };
  }, []);

  // Dedicated Hero Project Preview (controlled via admin isHero: true, or top homeOrder featured project)
  const heroProject = useMemo(() => {
    if (projects.length === 0) return null;
    // 1. Explicitly designated hero project
    const explicitHero = projects.find((p) => p.isHero);
    if (explicitHero) return explicitHero;
    // 2. Top featured project by homeOrder
    const topFeatured = projects
      .filter((p) => p.featured)
      .sort(
        (a, b) =>
          (typeof a.homeOrder === "number" ? a.homeOrder : 99) -
          (typeof b.homeOrder === "number" ? b.homeOrder : 99),
      )[0];
    if (topFeatured) return topFeatured;
    // 3. Fallback to Atmospheric Intelligence or first available project
    return (
      projects.find((p) => p.id === "MflCmhqBMJ5PDrz6H2DD") || projects[0]
    );
  }, [projects]);

  // Selected Case Studies on Homepage (sorted by admin homeOrder)
  // The hero project is strictly excluded so its feature image is not duplicated in Selected Case Studies
  const selectedProjects = useMemo(() => {
    if (projects.length === 0) return [];

    const heroId = heroProject?.id;

    // Filter projects explicitly marked as featured on homepage (excluding hero project)
    const featuredProjects = projects
      .filter((p) => p.featured && p.id !== heroId)
      .sort(
        (a, b) =>
          (typeof a.homeOrder === "number" ? a.homeOrder : 99) -
          (typeof b.homeOrder === "number" ? b.homeOrder : 99),
      );

    // If at least 2 are marked as featured, use them
    if (featuredProjects.length >= 2) {
      return featuredProjects;
    }

    // Default fallback if not yet configured in admin
    const atmospheric = projects.find(
      (p) =>
        p.title?.includes("Atmospheric") ||
        p.id === "MflCmhqBMJ5PDrz6H2DD",
    );
    const commercial = projects.filter(
      (p) =>
        p.type === "Company Project" &&
        p.id !== atmospheric?.id &&
        p.id !== heroId,
    );
    const others = projects.filter(
      (p) =>
        p.id !== atmospheric?.id &&
        p.id !== heroId &&
        !commercial.some((c) => c.id === p.id),
    );

    const list: any[] = [];
    if (atmospheric && atmospheric.id !== heroId) list.push(atmospheric);
    if (commercial[0]) list.push(commercial[0]);
    if (commercial[1]) list.push(commercial[1]);
    if (commercial[2]) list.push(commercial[2]);
    if (others[0]) list.push(others[0]);

    const nonHeroProjects = projects.filter((p) => p.id !== heroId);
    return list.length >= 3 ? list : nonHeroProjects.slice(0, 4);
  }, [projects, heroProject]);

  const canonicalUrl = absoluteUrl("/");

  return (
    <div className="space-y-20 md:space-y-28">
      <Helmet>
        <title>Mohamed Sharfiras — Web Developer</title>
        <meta
          name="description"
          content="Portfolio of Mohamed Sharfiras, a Web Developer with 4+ years of professional experience across enterprise web migrations (HSBC), high-performance eCommerce (Oscar Wylee), React, Next.js, and Technical SEO."
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Mohamed Sharfiras — Web Developer" />
        <meta
          property="og:description"
          content="Engineering reliable web platforms, enterprise intranets, and high-converting eCommerce. 4+ years across React, Next.js, WordPress, SharePoint, and Technical SEO."
        />
        <meta property="og:image" content={resolveImageUrl(null)} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Mohamed Sharfiras — Web Developer"
        />
        <meta
          name="twitter:description"
          content="Engineering reliable web platforms, enterprise intranets, and high-converting eCommerce."
        />
        <meta name="twitter:image" content={resolveImageUrl(null)} />
        <script type="application/ld+json">
          {JSON.stringify(buildPersonSchema())}
        </script>
      </Helmet>

      {/* 1. Opening Composition: Identity, Evidence & Meaningful Project Preview */}
      <section className="pt-2 md:pt-6 border-b border-[#E5E4DE] dark:border-[#27313A] pb-16 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            {/* Status indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#1B2228] text-xs font-mono text-[#55626F] dark:text-[#97A3AF] shadow-2xs">
              <span
                className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"
                aria-hidden="true"
              />
              <span>
                Web Developer &bull; Available for Advisory &amp; Projects
              </span>
            </div>

            <h1 className="fluid-hero font-extrabold text-[#171F24] dark:text-[#F1F4F6] tracking-tight leading-[1.08]">
              Reliable web platforms. <br />
              <span className="text-[#55626F] dark:text-[#97A3AF] font-normal">
                Built with precision.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#55626F] dark:text-[#97A3AF] leading-relaxed max-w-2xl font-normal">
              I’m{" "}
              <strong className="text-[#171F24] dark:text-[#F1F4F6] font-semibold">
                Mohamed Sharfiras
              </strong>{" "}
              — a Web Developer with 4+ years of professional experience
              building high-performance, SEO-compliant web systems across
              enterprise financial intranets, UK legal platforms, and global
              retail eCommerce.
            </p>

            {/* CTAs with generous touch targets */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#selected-work"
                className="min-h-[44px] px-5 py-2.5 rounded-md bg-[#171F24] dark:bg-[#F1F4F6] text-[#FFFFFF] dark:text-[#171F24] text-xs sm:text-sm font-semibold hover:bg-[#27313A] dark:hover:bg-[#E5E4DE] transition-all inline-flex items-center gap-2 cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-[#1F51D0]"
              >
                <span>View selected work</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>

              <Link
                to="/contact"
                className="min-h-[44px] px-5 py-2.5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#1B2228] text-[#171F24] dark:text-[#F1F4F6] text-xs sm:text-sm font-semibold hover:bg-[#F2F1EC] dark:hover:bg-[#222B33] transition-colors inline-flex items-center focus-visible:ring-2 focus-visible:ring-[#1F51D0]"
              >
                Contact me
              </Link>

              <a
                href="/resume.pdf"
                download="Mohamed_Sharfiras_CV.pdf"
                className="min-h-[44px] px-4 py-2.5 rounded-md text-xs sm:text-sm text-[#55626F] dark:text-[#97A3AF] hover:text-[#171F24] dark:hover:text-[#F1F4F6] transition-colors inline-flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#1F51D0]"
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                <span className="underline decoration-[#E5E4DE] dark:decoration-[#27313A] underline-offset-4">
                  Curriculum Vitae
                </span>
              </a>
            </div>
          </div>

          {/* Meaningful Project Preview in Hero Layout (Dynamic from Admin) */}
          <div className="lg:col-span-5">
            {heroProject ? (
              <div className="rounded-lg border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#1B2228] p-4 sm:p-5 space-y-3.5 shadow-sm hover:border-[#1F51D0]/40 transition-colors">
                <div className="flex items-center justify-between text-xs pb-2.5 border-b border-[#E5E4DE] dark:border-[#27313A]">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#1F51D0] dark:text-[#4F7FF7] font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#1F51D0] dark:text-[#4F7FF7]" />
                    <span>Featured Case Study</span>
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#F2F1EC] dark:bg-[#222B33] text-[#55626F] dark:text-[#97A3AF]">
                    {extractMainTechs(heroProject.techStack)
                      .slice(0, 2)
                      .join(" & ") ||
                      heroProject.category ||
                      "Web Platform"}
                  </span>
                </div>

                <div className="aspect-[16/10] overflow-hidden rounded-md bg-[#F2F1EC] dark:bg-[#13171B] border border-[#E5E4DE] dark:border-[#27313A]">
                  <Link
                    to={`/projects/${heroProject.id}`}
                    aria-label={`Inspect ${heroProject.title} case study`}
                  >
                    <img
                      src={resolveImageUrl(
                        heroProject.images?.[0] || heroProject.image,
                      )}
                      alt={`${heroProject.title} interface preview`}
                      width={640}
                      height={400}
                      decoding="async"
                      loading="eager"
                      className="w-full h-full object-cover object-top hover:scale-[1.02] transition-transform duration-300"
                    />
                  </Link>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <h2 className="text-sm sm:text-base font-bold text-[#171F24] dark:text-[#F1F4F6] hover:underline">
                      <Link to={`/projects/${heroProject.id}`}>
                        {heroProject.title}
                      </Link>
                    </h2>
                    <Link
                      to={`/projects/${heroProject.id}`}
                      className="text-xs text-[#1F51D0] dark:text-[#4F7FF7] font-semibold hover:underline inline-flex items-center gap-1 shrink-0"
                    >
                      <span>Inspect</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                  <p className="text-xs text-[#55626F] dark:text-[#97A3AF] leading-relaxed line-clamp-2">
                    {heroProject.shortDesc}
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-64 rounded-lg bg-[#F2F1EC] dark:bg-[#1B2228] animate-pulse" />
            )}
          </div>
        </div>

        {/* Current Role Context Line (Truthful & Non-Promotional) */}
        <div className="p-4 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#1B2228] text-xs sm:text-sm text-[#55626F] dark:text-[#97A3AF] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span
              className="w-2 h-2 rounded-full bg-[#1F51D0] dark:bg-[#4F7FF7] shrink-0"
              aria-hidden="true"
            />
            <span>
              <strong className="text-[#171F24] dark:text-[#F1F4F6] font-semibold">
                Current role:
              </strong>{" "}
              Web Production Officer at GSC, HSBC (via TempServe) in Havelock
              City, Colombo — global enterprise intranet migration across
              WordPress &amp; SharePoint.
            </span>
          </div>
          <Link
            to="/about"
            className="text-xs font-semibold text-[#1F51D0] dark:text-[#4F7FF7] hover:underline self-start sm:self-auto shrink-0 inline-flex items-center gap-1"
          >
            <span>Employment record</span>
            <ArrowRight className="w-3 h-3" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* 2. Selected Work (Deliberately chosen based on evidence & variety) */}
      <section id="selected-work" className="space-y-8 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E5E4DE] dark:border-[#27313A] pb-4">
          <div className="space-y-1">
            <p className="font-mono text-xs uppercase tracking-wider text-[#1F51D0] dark:text-[#4F7FF7]">
              Curated Production Work
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171F24] dark:text-[#F1F4F6]">
              Selected Case Studies
            </h2>
          </div>
          <Link
            to="/projects"
            className="text-xs sm:text-sm font-semibold text-[#1F51D0] dark:text-[#4F7FF7] hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View complete archive ({projects.length})</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-8">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : (
          <div className="space-y-10">
            {selectedProjects.map((p, index) => {
              const isEven = index % 2 === 0;
              const imageUrl = resolveImageUrl(
                Array.isArray(p.images) && p.images.length > 0
                  ? p.images[0]
                  : p.image,
              );

              return (
                <article
                  key={p.id}
                  className="rounded-lg border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#1B2228] overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 hover:border-[#1F51D0]/40 dark:hover:border-[#4F7FF7]/40 transition-colors shadow-2xs"
                >
                  {/* Project Screenshot Display */}
                  <div
                    className={`lg:col-span-7 bg-[#F2F1EC] dark:bg-[#13171B] relative flex items-center justify-center p-4 sm:p-7 border-b lg:border-b-0 ${
                      isEven
                        ? "lg:border-r border-[#E5E4DE] dark:border-[#27313A]"
                        : "lg:order-2 lg:border-l border-[#E5E4DE] dark:border-[#27313A]"
                    }`}
                  >
                    <Link
                      to={`/projects/${p.id}`}
                      className="block w-full overflow-hidden rounded-md border border-[#E5E4DE] dark:border-[#27313A] group shadow-xs"
                      aria-label={`View case study for ${p.title}`}
                    >
                      <img
                        src={imageUrl}
                        alt={`${p.title} production interface overview`}
                        width={800}
                        height={500}
                        decoding="async"
                        className="w-full h-auto max-h-[380px] object-cover object-top group-hover:scale-[1.01] transition-transform duration-300"
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                    </Link>
                  </div>

                  {/* Project Context & Metadata */}
                  <div
                    className={`lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 ${
                      !isEven ? "lg:order-1" : ""
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-[#55626F] dark:text-[#97A3AF] px-2 py-0.5 rounded bg-[#F2F1EC] dark:bg-[#222B33]">
                          {p.type || "Independent Project"}
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                          {p.status || "Live"}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold text-[#171F24] dark:text-[#F1F4F6] tracking-tight">
                        <Link
                          to={`/projects/${p.id}`}
                          className="hover:underline"
                        >
                          {p.title}
                        </Link>
                      </h3>

                      <p className="text-xs sm:text-sm text-[#55626F] dark:text-[#97A3AF] leading-relaxed line-clamp-3">
                        {p.shortDesc}
                      </p>

                      {(() => {
                        const mainTechs = extractMainTechs(p.techStack);
                        if (mainTechs.length === 0) return null;
                        return (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {mainTechs.map((tech) => (
                              <span
                                key={tech}
                                className="text-[11px] font-mono px-2 py-0.5 rounded border border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B] text-[#55626F] dark:text-[#97A3AF]"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        );
                      })()}
                    </div>

                    <div className="pt-4 border-t border-[#E5E4DE] dark:border-[#27313A] flex items-center justify-between">
                      <Link
                        to={`/projects/${p.id}`}
                        className="text-xs sm:text-sm font-semibold text-[#1F51D0] dark:text-[#4F7FF7] hover:underline inline-flex items-center gap-1.5"
                      >
                        <span>Read Case Study</span>
                        <ArrowRight
                          className="w-3.5 h-3.5"
                          aria-hidden="true"
                        />
                      </Link>

                      <div className="flex items-center space-x-3 text-xs">
                        {p.liveUrl && (
                          <a
                            href={p.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#55626F] dark:text-[#97A3AF] hover:text-[#171F24] dark:hover:text-[#F1F4F6] inline-flex items-center gap-1"
                          >
                            <span>Live</span>
                            <ExternalLink
                              className="w-3 h-3"
                              aria-hidden="true"
                            />
                          </a>
                        )}
                        {p.githubUrl && (
                          <a
                            href={p.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#55626F] dark:text-[#97A3AF] hover:text-[#171F24] dark:hover:text-[#F1F4F6] inline-flex items-center gap-1"
                          >
                            <Github className="w-3 h-3" aria-hidden="true" />
                            <span>Code</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. Results Attribution (Accurately Contextualized to Oscar Wylee Experience) */}
      <section className="rounded-lg border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#1B2228] p-6 sm:p-9 space-y-6 shadow-2xs">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#1F51D0] dark:text-[#4F7FF7]">
            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Verified Production Telemetry</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#171F24] dark:text-[#F1F4F6]">
            Performance &amp; Technical SEO Impact
          </h2>
          <p className="text-xs sm:text-sm text-[#55626F] dark:text-[#97A3AF] leading-relaxed">
            Delivered during frontend engineering tenure at{" "}
            <strong className="text-[#171F24] dark:text-[#F1F4F6]">
              Oscar Wylee
            </strong>{" "}
            (via Cloud Atlantic International Group, Sep 2022 – Sep 2025) across
            Magento 2 and WordPress omnichannel retail pages:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
          <div className="p-5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B] space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" aria-hidden="true" />
              <span className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight">
                +30%
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-[#171F24] dark:text-[#F1F4F6]">
              Organic Search Traffic
            </p>
            <p className="text-xs text-[#55626F] dark:text-[#97A3AF] leading-relaxed">
              Attained through systematic on-page &amp; technical SEO,
              structured data markup, and Core Web Vitals compliance.
            </p>
          </div>

          <div className="p-5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B] space-y-2">
            <div className="flex items-center gap-2 text-[#1F51D0] dark:text-[#4F7FF7]">
              <Smartphone className="w-4 h-4" aria-hidden="true" />
              <span className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight">
                +25%
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-[#171F24] dark:text-[#F1F4F6]">
              Mobile Performance Score
            </p>
            <p className="text-xs text-[#55626F] dark:text-[#97A3AF] leading-relaxed">
              Achieved by restructuring mobile layouts, eliminating cumulative
              layout shifts, and conducting cross-browser device testing.
            </p>
          </div>

          <div className="p-5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B] space-y-2">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <Zap className="w-4 h-4" aria-hidden="true" />
              <span className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight">
                -15%
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-[#171F24] dark:text-[#F1F4F6]">
              Average Page Load Time
            </p>
            <p className="text-xs text-[#55626F] dark:text-[#97A3AF] leading-relaxed">
              Reduced via frontend code refactoring, intelligent image
              compression pipelines, lazy loading, and caching policies.
            </p>
          </div>
        </div>

        {/* Interactive Telemetry Deep Dive */}
        <div className="pt-2">
          <CoreWebVitalsInspector />
        </div>
      </section>

      {/* 4. Capabilities Connected to Real Practice */}
      <section className="space-y-6">
        <div className="space-y-1">
          <p className="font-mono text-xs uppercase tracking-wider text-[#1F51D0] dark:text-[#4F7FF7]">
            Core Disciplines
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-[#171F24] dark:text-[#F1F4F6]">
            Technical Competencies
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#1B2228] space-y-3 shadow-2xs">
            <div className="w-9 h-9 rounded-md bg-[#F2F1EC] dark:bg-[#222B33] flex items-center justify-center text-[#171F24] dark:text-[#F1F4F6]">
              <Building2 className="w-4 h-4" aria-hidden="true" />
            </div>
            <h3 className="text-base font-bold text-[#171F24] dark:text-[#F1F4F6]">
              Enterprise Intranet &amp; CMS
            </h3>
            <p className="text-xs sm:text-sm text-[#55626F] dark:text-[#97A3AF] leading-relaxed">
              Multi-tier migration, layout validation, and release management on
              WordPress &amp; SharePoint under structured Dev, UAT, and
              production environments (HSBC).
            </p>
          </div>

          <div className="p-6 rounded-lg border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#1B2228] space-y-3 shadow-2xs">
            <div className="w-9 h-9 rounded-md bg-[#F2F1EC] dark:bg-[#222B33] flex items-center justify-center text-[#171F24] dark:text-[#F1F4F6]">
              <Zap className="w-4 h-4" aria-hidden="true" />
            </div>
            <h3 className="text-base font-bold text-[#171F24] dark:text-[#F1F4F6]">
              Modern Web Development
            </h3>
            <p className="text-xs sm:text-sm text-[#55626F] dark:text-[#97A3AF] leading-relaxed">
              Modular applications in React 19, Next.js, and TypeScript,
              focusing on state isolation, fluid design systems, and WCAG AA
              accessibility standards.
            </p>
          </div>

          <div className="p-6 rounded-lg border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#1B2228] space-y-3 shadow-2xs">
            <div className="w-9 h-9 rounded-md bg-[#F2F1EC] dark:bg-[#222B33] flex items-center justify-center text-[#171F24] dark:text-[#F1F4F6]">
              <TrendingUp className="w-4 h-4" aria-hidden="true" />
            </div>
            <h3 className="text-base font-bold text-[#171F24] dark:text-[#F1F4F6]">
              Technical SEO &amp; Automation
            </h3>
            <p className="text-xs sm:text-sm text-[#55626F] dark:text-[#97A3AF] leading-relaxed">
              Core Web Vitals compliance, structured data architecture
              (JSON-LD), automated CRM pipelines with GoHighLevel (GHL), and
              CI/CD deployment automation.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Published Writing (Recent technical articles from the archive) */}
      {blogs.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-end justify-between border-b border-[#E5E4DE] dark:border-[#27313A] pb-4">
            <div className="space-y-1">
              <p className="font-mono text-xs uppercase tracking-wider text-[#1F51D0] dark:text-[#4F7FF7]">
                Technical Notes &amp; Writing
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-[#171F24] dark:text-[#F1F4F6]">
                Recent Articles
              </h2>
            </div>
            <Link
              to="/blog"
              className="text-xs sm:text-sm font-semibold text-[#1F51D0] dark:text-[#4F7FF7] hover:underline inline-flex items-center gap-1"
            >
              <span>View all articles</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.map((b) => {
              const readingTime = calculateReadingTime(b.content);
              const dateStr = b.createdAt?.toDate
                ? b.createdAt.toDate().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "Recent";

              return (
                <article
                  key={b.id}
                  className="rounded-lg border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#1B2228] p-5 flex flex-col justify-between space-y-4 hover:border-[#1F51D0]/40 transition-colors shadow-2xs"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3 text-xs text-[#55626F] dark:text-[#97A3AF]">
                      <span className="inline-flex items-center gap-1 font-mono">
                        <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{dateStr}</span>
                      </span>
                      <span>&bull;</span>
                      <span className="inline-flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{readingTime} min</span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#171F24] dark:text-[#F1F4F6] line-clamp-2 hover:underline">
                      <Link to={`/blog/${b.id}`}>{b.title}</Link>
                    </h3>

                    <p className="text-xs text-[#55626F] dark:text-[#97A3AF] line-clamp-3 leading-relaxed">
                      {b.excerpt || b.title}
                    </p>
                  </div>

                  <Link
                    to={`/blog/${b.id}`}
                    className="text-xs font-semibold text-[#1F51D0] dark:text-[#4F7FF7] hover:underline inline-flex items-center gap-1 pt-3 border-t border-[#E5E4DE] dark:border-[#27313A]"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* 6. Closing Invitation to Connect */}
      <section className="rounded-lg border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#1B2228] p-8 sm:p-10 space-y-4 text-center sm:text-left sm:flex sm:items-center sm:justify-between sm:space-y-0 shadow-2xs">
        <div className="space-y-1 max-w-xl">
          <h2 className="text-xl sm:text-2xl font-bold text-[#171F24] dark:text-[#F1F4F6]">
            Discuss a project, migration, or technical consultation.
          </h2>
          <p className="text-xs sm:text-sm text-[#55626F] dark:text-[#97A3AF]">
            Available for specialized intranet consulting, client projects, and
            technical advisory.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 shrink-0">
          <Link
            to="/contact"
            className="min-h-[44px] px-5 py-2.5 rounded-md bg-[#171F24] dark:bg-[#F1F4F6] text-[#FFFFFF] dark:text-[#171F24] text-xs sm:text-sm font-semibold hover:bg-[#27313A] dark:hover:bg-[#E5E4DE] transition-colors inline-flex items-center cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-[#1F51D0]"
          >
            Get in touch
          </Link>
          <a
            href="mailto:sharfrasaqsan@gmail.com"
            className="min-h-[44px] px-4 py-2.5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] text-xs sm:text-sm font-semibold text-[#171F24] dark:text-[#F1F4F6] hover:bg-[#F2F1EC] dark:hover:bg-[#222B33] transition-colors inline-flex items-center focus-visible:ring-2 focus-visible:ring-[#1F51D0]"
          >
            sharfrasaqsan@gmail.com
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
