import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ExternalLink, Github, ArrowRight } from "lucide-react";
import { CardSkeleton } from "../../components/Skeleton";
import {
  absoluteUrl,
  resolveImageUrl,
  buildBreadcrumbsSchema,
} from "../../utils/seo";
import {
  getCachedProjects,
  sortProjectsByPriority,
} from "../../utils/dataCache";

const CATEGORIES = [
  { id: "all", label: "All Projects" },
  { id: "commercial", label: "Commercial & Legal Platforms" },
  { id: "applications", label: "Applications & Systems" },
  { id: "live", label: "Live Deployments" },
];

const PROJECTS_PER_PAGE = 12;

const Projects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCategory = searchParams.get("category") || "all";
  const currentPage = parseInt(searchParams.get("page") || "1", 10) || 1;

  useEffect(() => {
    let isMounted = true;
    const fetchProjects = async () => {
      try {
        const list = await getCachedProjects(true);
        if (isMounted) {
          setProjects(sortProjectsByPriority(list));
        }
      } catch (err) {
        console.error("Projects fetch error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProjects();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter projects according to dataset reality
  const filteredProjects = projects.filter((p) => {
    if (currentCategory === "all") return true;
    if (currentCategory === "live") return p.status === "Live";
    if (currentCategory === "commercial") {
      return (
        p.type === "Company Project" ||
        p.type === "Freelance Project" ||
        p.title?.toLowerCase().includes("law") ||
        p.title?.toLowerCase().includes("solicitor") ||
        p.title?.toLowerCase().includes("fixxable") ||
        p.title?.toLowerCase().includes("webphoria") ||
        p.title?.toLowerCase().includes("claims")
      );
    }
    if (currentCategory === "applications") {
      return (
        p.type === "Individual Project" ||
        p.title?.includes("Atmospheric") ||
        p.title?.includes("Tracker") ||
        p.title?.includes("Slinkup") ||
        p.title?.includes("E-Shop") ||
        p.title?.includes("Reserve")
      );
    }
    return true;
  });

  const totalPages =
    Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE) || 1;
  const validPage = Math.min(Math.max(currentPage, 1), totalPages);

  const startIndex = (validPage - 1) * PROJECTS_PER_PAGE;
  const visibleProjects = filteredProjects.slice(
    startIndex,
    startIndex + PROJECTS_PER_PAGE,
  );

  const handleCategoryChange = (catId: string) => {
    setSearchParams({ category: catId, page: "1" });
  };

  const handlePageChange = (pageNum: number) => {
    setSearchParams({ category: currentCategory, page: pageNum.toString() });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const canonicalUrl = absoluteUrl("/projects");

  return (
    <div className="space-y-12">
      <Helmet>
        <title>Projects Archive | Mohamed Sharfiras — Web Developer</title>
        <meta
          name="description"
          content="Explore the engineering project archive of Mohamed Sharfiras: enterprise intranets, commercial legal platforms, high-performance web applications, and telemetry systems."
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta
          property="og:title"
          content="Projects Archive | Mohamed Sharfiras"
        />
        <meta
          property="og:description"
          content="Curated engineering archive: commercial web platforms, full-stack React applications, and enterprise systems."
        />
        <meta property="og:image" content={resolveImageUrl(null)} />
        <script type="application/ld+json">
          {JSON.stringify(
            buildBreadcrumbsSchema([
              { name: "Home", path: "/" },
              { name: "Projects", path: "/projects" },
            ]),
          )}
        </script>
      </Helmet>

      {/* Header Introduction */}
      <section className="space-y-3 border-b border-[#E5E4DE] dark:border-[#27313A] pb-8">
        <p className="font-mono text-xs uppercase tracking-wider text-[#1F51D0] dark:text-[#4F7FF7]">
          Work Archive
        </p>
        <h1 className="fluid-h1 font-extrabold text-[#171F24] dark:text-[#F1F4F6] tracking-tight">
          Engineering &amp; Client Projects
        </h1>
        <p className="text-sm sm:text-base text-[#55626F] dark:text-[#97A3AF] max-w-2xl leading-relaxed">
          A documented record of commercial platforms, enterprise systems, and
          independent full-stack applications. Each case study details technical
          decisions, architecture, and tradeoffs.
        </p>

        {/* Filter Navigation (Persisted in URL Search Params) */}
        <div
          role="tablist"
          aria-label="Filter projects by category"
          className="flex flex-wrap items-center gap-2 pt-4"
        >
          {CATEGORIES.map((cat) => {
            const isActive = currentCategory === cat.id;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isActive}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-md text-xs font-mono transition-colors cursor-pointer border ${
                  isActive
                    ? "bg-[#171F24] dark:bg-[#F1F4F6] text-[#FFFFFF] dark:text-[#171F24] border-[#171F24] dark:border-[#F1F4F6] font-semibold"
                    : "bg-[#FFFFFF] dark:bg-[#1B2228] text-[#55626F] dark:text-[#97A3AF] border-[#E5E4DE] dark:border-[#27313A] hover:bg-[#F2F1EC] dark:hover:bg-[#222B33]"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Projects Grid */}
      <section aria-label="Project list">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: PROJECTS_PER_PAGE }, (_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : visibleProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleProjects.map((p) => {
              const imageUrl = resolveImageUrl(
                Array.isArray(p.images) && p.images.length > 0
                  ? p.images[0]
                  : p.image,
              );

              return (
                <article
                  key={p.id}
                  className="rounded-lg border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#1B2228] overflow-hidden flex flex-col justify-between hover:border-[#1F51D0]/40 dark:hover:border-[#4F7FF7]/40 transition-colors shadow-2xs group"
                >
                  <div>
                    {/* Visual Preview */}
                    <div className="aspect-[16/10] bg-[#F2F1EC] dark:bg-[#13171B] overflow-hidden border-b border-[#E5E4DE] dark:border-[#27313A] relative">
                      <Link
                        to={`/projects/${p.id}`}
                        aria-label={`View ${p.title} case study`}
                      >
                        <img
                          src={imageUrl}
                          alt={`${p.title} case study preview`}
                          width={640}
                          height={400}
                          decoding="async"
                          className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-300"
                          loading="lazy"
                        />
                      </Link>
                    </div>

                    {/* Metadata Header */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#55626F] dark:text-[#97A3AF]">
                        <span className="uppercase tracking-wider">
                          {p.type || "Independent"}
                        </span>
                        <span
                          className={`font-semibold ${
                            p.status === "Live"
                              ? "text-emerald-700 dark:text-emerald-400"
                              : "text-amber-700 dark:text-amber-400"
                          }`}
                        >
                          {p.status || "Live"}
                        </span>
                      </div>

                      <h2 className="text-lg font-bold text-[#171F24] dark:text-[#F1F4F6] tracking-tight leading-snug hover:underline">
                        <Link to={`/projects/${p.id}`}>{p.title}</Link>
                      </h2>

                      <p className="text-xs text-[#55626F] dark:text-[#97A3AF] line-clamp-3 leading-relaxed">
                        {p.shortDesc}
                      </p>

                      {p.techStack && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {p.techStack.slice(0, 4).map((tech: string) => (
                            <span
                              key={tech}
                              className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#F2F1EC] dark:bg-[#222B33] text-[#55626F] dark:text-[#97A3AF]"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="p-5 pt-3 border-t border-[#E5E4DE] dark:border-[#27313A] flex items-center justify-between text-xs">
                    <Link
                      to={`/projects/${p.id}`}
                      className="font-semibold text-[#1F51D0] dark:text-[#4F7FF7] hover:underline inline-flex items-center gap-1"
                    >
                      <span>Case Study</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </Link>

                    <div className="flex items-center space-x-3">
                      {p.githubUrl && (
                        <a
                          href={p.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#55626F] dark:text-[#97A3AF] hover:text-[#171F24] dark:hover:text-[#F1F4F6] inline-flex items-center gap-1"
                        >
                          <Github className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Code</span>
                        </a>
                      )}
                      {p.liveUrl && (
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#55626F] dark:text-[#97A3AF] hover:text-[#171F24] dark:hover:text-[#F1F4F6] inline-flex items-center gap-1"
                        >
                          <ExternalLink
                            className="w-3.5 h-3.5"
                            aria-hidden="true"
                          />
                          <span>Live</span>
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center border border-dashed border-[#E5E4DE] dark:border-[#27313A] rounded-lg p-8 space-y-2">
            <p className="text-sm font-semibold text-[#171F24] dark:text-[#F1F4F6]">
              No projects found for this criteria.
            </p>
            <p className="text-xs text-[#55626F] dark:text-[#97A3AF]">
              Try choosing another filter from above to view other records.
            </p>
          </div>
        )}

        {/* Accessible Pagination Navigation with min-44px targets */}
        {totalPages > 1 && (
          <nav
            aria-label="Pagination navigation"
            className="flex items-center justify-center space-x-2 pt-10 border-t border-[#E5E4DE] dark:border-[#27313A] mt-10"
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => {
              const isCurrent = validPage === num;
              return (
                <button
                  key={num}
                  type="button"
                  aria-current={isCurrent ? "page" : undefined}
                  aria-label={`Go to page ${num}`}
                  onClick={() => handlePageChange(num)}
                  className={`min-w-[44px] min-h-[44px] rounded-md text-xs font-mono transition-colors cursor-pointer border flex items-center justify-center ${
                    isCurrent
                      ? "bg-[#171F24] dark:bg-[#F1F4F6] text-[#FFFFFF] dark:text-[#171F24] border-[#171F24] dark:border-[#F1F4F6] font-bold"
                      : "bg-[#FFFFFF] dark:bg-[#1B2228] text-[#55626F] dark:text-[#97A3AF] border-[#E5E4DE] dark:border-[#27313A] hover:bg-[#F2F1EC] dark:hover:bg-[#222B33]"
                  }`}
                >
                  {num}
                </button>
              );
            })}
          </nav>
        )}
      </section>
    </div>
  );
};

export default Projects;
