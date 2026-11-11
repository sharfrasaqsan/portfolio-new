import { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ExternalLink,
  Github,
  ArrowRight,
  Search,
  X,
  Layers,
  ArrowUpDown,
  RotateCcw,
} from "lucide-react";
import { CardSkeleton } from "../../components/Skeleton";
import {
  absoluteUrl,
  resolveImageUrl,
  buildBreadcrumbsSchema,
} from "../../utils/seo";
import { getCachedProjects } from "../../utils/dataCache";
import { extractMainTechs } from "../../utils/techUtils";

const CATEGORIES = [
  { id: "all", label: "All Projects" },
  { id: "commercial", label: "Commercial & Legal Platforms" },
  { id: "applications", label: "Applications & Systems" },
  { id: "live", label: "Live Deployments" },
];

const CURATED_PROJECT_ORDER: Record<string, number> = {
  // Flagship interactive telemetry and real-time frontend
  MflCmhqBMJ5PDrz6H2DD: 1, // Atmospheric Intelligence
  // Commercial SaaS automation & high-converting platforms
  "8CQMnDasKgNgV38huMuj": 2, // Fixxable — SaaS Automation Platform
  TCxzhTSYCxuBr9q7EJUf: 3, // Auction Solicitor — Property Auction Legal Services
  "0lqZjvslmHJncTTadAfw": 4, // Meridian Law Group — Modern Legal Web Platform
  Z8kfLosbaaFhg7QnhCv5: 5, // Webphoria — Digital & Automation Agency
  b2L9FLiEVqPEPu99vFFM: 6, // Cosmetic Claims — Medical Negligence Legal Services
  // Full-stack application systems & productivity
  "6JQheDhQU2rDolV5YAa3": 7, // Study Tracker — Productivity Platform
  nxLXiGygVfYOuHQi4ftM: 8, // My Auction Lawyer — Auction Property Legal Platform
  ocU78f4RZ0bUpFE1uZha: 9, // Lease Lawyer — Commercial Lease Legal Services
  "1xUxXzNbDPGVBrSkL8EV": 10, // Slinkup — Social Networking Web Application
  // Hospitality & eCommerce platforms
  TmAGAucYY1nIvtbNRVE0: 11, // Royal Reserve — Luxury Hotel Booking Platform
  AhtWy6o1sXQDjs820Os8: 12, // E-Shop: PC & Network Solutions — eCommerce System
};

const PROJECTS_PER_PAGE = 12;

const Projects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCategory = searchParams.get("category") || "all";
  const currentTech = searchParams.get("tech") || "all";
  const currentSort = searchParams.get("sort") || "curated";
  const searchQuery = searchParams.get("q") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10) || 1;

  useEffect(() => {
    let isMounted = true;
    const fetchProjects = async () => {
      try {
        const list = await getCachedProjects();
        if (isMounted) {
          setProjects(list);
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

  // Extract ONLY main technologies across the project catalog for the filter bar
  const popularTechList = useMemo(() => {
    const map: Record<string, number> = {};
    projects.forEach((p) => {
      const mainTechs = extractMainTechs(p.techStack);
      mainTechs.forEach((tech) => {
        map[tech] = (map[tech] || 0) + 1;
      });
    });

    return Object.entries(map)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([name, count]) => ({ name, count }));
  }, [projects]);

  // Match against project's main technologies
  const matchesTechFilter = (p: any, targetTech: string) => {
    if (targetTech === "all") return true;
    const mainTechs = extractMainTechs(p.techStack);
    return mainTechs.some(
      (t) => t.toLowerCase() === targetTech.toLowerCase(),
    );
  };

  // 1. Sort projects according to curated order or user selection
  const orderedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      const orderA =
        typeof a.order === "number"
          ? a.order
          : (CURATED_PROJECT_ORDER[a.id] ?? 999);
      const orderB =
        typeof b.order === "number"
          ? b.order
          : (CURATED_PROJECT_ORDER[b.id] ?? 999);

      if (currentSort === "curated") {
        if (orderA !== orderB) return orderA - orderB;
        const timeA = a.createdAt?.toDate
          ? a.createdAt.toDate().getTime()
          : a.createdAt?.seconds
            ? a.createdAt.seconds * 1000
            : 0;
        const timeB = b.createdAt?.toDate
          ? b.createdAt.toDate().getTime()
          : b.createdAt?.seconds
            ? b.createdAt.seconds * 1000
            : 0;
        return timeB - timeA;
      }

      if (currentSort === "newest") {
        const timeA = a.createdAt?.toDate
          ? a.createdAt.toDate().getTime()
          : a.createdAt?.seconds
            ? a.createdAt.seconds * 1000
            : 0;
        const timeB = b.createdAt?.toDate
          ? b.createdAt.toDate().getTime()
          : b.createdAt?.seconds
            ? b.createdAt.seconds * 1000
            : 0;
        return timeB - timeA;
      }

      if (currentSort === "oldest") {
        const timeA = a.createdAt?.toDate
          ? a.createdAt.toDate().getTime()
          : a.createdAt?.seconds
            ? a.createdAt.seconds * 1000
            : 0;
        const timeB = b.createdAt?.toDate
          ? b.createdAt.toDate().getTime()
          : b.createdAt?.seconds
            ? b.createdAt.seconds * 1000
            : 0;
        return timeA - timeB;
      }

      if (currentSort === "name") {
        return (a.title || "").localeCompare(b.title || "");
      }

      return orderA - orderB;
    });
  }, [projects, currentSort]);

  // 2. Filter projects across category, tech stack, and search query
  const filteredProjects = useMemo(() => {
    return orderedProjects.filter((p) => {
      // Category filter
      if (currentCategory === "live" && p.status !== "Live") return false;
      if (currentCategory === "commercial") {
        const isCommercial =
          p.type === "Company Project" ||
          p.type === "Freelance Project" ||
          p.title?.toLowerCase().includes("law") ||
          p.title?.toLowerCase().includes("solicitor") ||
          p.title?.toLowerCase().includes("fixxable") ||
          p.title?.toLowerCase().includes("webphoria") ||
          p.title?.toLowerCase().includes("claims");
        if (!isCommercial) return false;
      }
      if (currentCategory === "applications") {
        const isApp =
          p.type === "Individual Project" ||
          p.title?.includes("Atmospheric") ||
          p.title?.includes("Tracker") ||
          p.title?.includes("Slinkup") ||
          p.title?.includes("E-Shop") ||
          p.title?.includes("Reserve");
        if (!isApp) return false;
      }

      // Tech Stack filter
      if (!matchesTechFilter(p, currentTech)) return false;

      // Keyword Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = p.title?.toLowerCase().includes(q);
        const descMatch = p.shortDesc?.toLowerCase().includes(q);
        const techList: string[] = Array.isArray(p.techStack)
          ? p.techStack
          : typeof p.techStack === "string"
            ? p.techStack.split(",")
            : [];
        const techMatch = techList.some((t: string) =>
          t.toLowerCase().includes(q),
        );
        if (!titleMatch && !descMatch && !techMatch) return false;
      }

      return true;
    });
  }, [orderedProjects, currentCategory, currentTech, searchQuery]);

  const totalPages =
    Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE) || 1;
  const validPage = Math.min(Math.max(currentPage, 1), totalPages);

  const startIndex = (validPage - 1) * PROJECTS_PER_PAGE;
  const visibleProjects = filteredProjects.slice(
    startIndex,
    startIndex + PROJECTS_PER_PAGE,
  );

  const updateFilters = (updates: Record<string, string>) => {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (!val || val === "all" || (key === "sort" && val === "curated")) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, val);
      }
    });
    nextParams.delete("page"); // reset pagination on filter change
    setSearchParams(nextParams);
  };

  const handleCategoryChange = (catId: string) => {
    updateFilters({ category: catId });
  };

  const handleTechChange = (techName: string) => {
    // Toggle if clicking active tech
    if (currentTech.toLowerCase() === techName.toLowerCase()) {
      updateFilters({ tech: "all" });
    } else {
      updateFilters({ tech: techName });
    }
  };

  const handleSortChange = (sortVal: string) => {
    updateFilters({ sort: sortVal });
  };

  const handleSearchChange = (q: string) => {
    updateFilters({ q });
  };

  const handleResetAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (pageNum: number) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", pageNum.toString());
    setSearchParams(nextParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isFiltered =
    currentCategory !== "all" ||
    currentTech !== "all" ||
    searchQuery.trim().length > 0 ||
    currentSort !== "curated";

  const canonicalUrl = absoluteUrl("/projects");

  return (
    <div className="space-y-10">
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
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="fluid-h1 font-extrabold text-[#171F24] dark:text-[#F1F4F6] tracking-tight">
              Engineering &amp; Client Projects
            </h1>
            <p className="text-sm sm:text-base text-[#55626F] dark:text-[#97A3AF] max-w-2xl leading-relaxed mt-1">
              A systematically ordered record of commercial platforms, enterprise
              systems, and full-stack web applications. Filter by category, tech
              stack, or sort order.
            </p>
          </div>

          {/* Quick Counter */}
          <div className="shrink-0 flex items-center gap-2 font-mono text-xs text-[#55626F] dark:text-[#97A3AF] bg-[#F2F1EC] dark:bg-[#1B2228] px-3 py-1.5 rounded-md border border-[#E5E4DE] dark:border-[#27313A]">
            <span>Total Projects:</span>
            <span className="font-bold text-[#171F24] dark:text-[#F1F4F6]">
              {projects.length}
            </span>
          </div>
        </div>

        {/* Search & Sort Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
          {/* Instant Search Bar */}
          <div className="relative flex-1">
            <Search
              className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#55626F] dark:text-[#97A3AF] pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by title, technology, or keywords..."
              aria-label="Search projects by keyword"
              className="w-full pl-9 pr-9 py-2 text-xs font-mono rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#1B2228] text-[#171F24] dark:text-[#F1F4F6] placeholder:text-[#55626F] dark:placeholder:text-[#97A3AF] focus:outline-none focus:ring-1 focus:ring-[#1F51D0]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchChange("")}
                aria-label="Clear search query"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#55626F] dark:text-[#97A3AF] hover:text-[#171F24] dark:hover:text-[#F1F4F6] p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Order Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <ArrowUpDown
              className="w-3.5 h-3.5 text-[#55626F] dark:text-[#97A3AF] hidden sm:block"
              aria-hidden="true"
            />
            <label htmlFor="sort-select" className="sr-only">
              Sort projects by
            </label>
            <select
              id="sort-select"
              value={currentSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 text-xs font-mono rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#1B2228] text-[#171F24] dark:text-[#F1F4F6] focus:outline-none focus:ring-1 focus:ring-[#1F51D0] cursor-pointer"
            >
              <option value="curated">Sort: Curated Order (#01 – #12)</option>
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="name">Sort: Project Name (A – Z)</option>
            </select>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div
          role="tablist"
          aria-label="Filter projects by category"
          className="flex flex-wrap items-center gap-2 pt-2"
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
                className={`min-h-[36px] px-3 py-1.5 rounded-md text-xs font-mono transition-colors cursor-pointer border ${
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

        {/* Tech Stack Filter Bar */}
        <div className="space-y-2 pt-3 border-t border-dashed border-[#E5E4DE] dark:border-[#27313A]">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#55626F] dark:text-[#97A3AF] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#1F51D0] dark:text-[#4F7FF7]" />
              <span>Filter by Tech Stack:</span>
            </span>

            {isFiltered && (
              <button
                type="button"
                onClick={handleResetAllFilters}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-[#1F51D0] dark:text-[#4F7FF7] hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          <div
            role="group"
            aria-label="Filter by technology stack"
            className="flex flex-wrap items-center gap-1.5"
          >
            {/* All Stacks Pill */}
            <button
              type="button"
              onClick={() => updateFilters({ tech: "all" })}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer border ${
                currentTech === "all"
                  ? "bg-[#1F51D0] dark:bg-[#4F7FF7] text-white border-[#1F51D0] dark:border-[#4F7FF7] font-semibold"
                  : "bg-[#FFFFFF] dark:bg-[#1B2228] text-[#55626F] dark:text-[#97A3AF] border-[#E5E4DE] dark:border-[#27313A] hover:bg-[#F2F1EC] dark:hover:bg-[#222B33]"
              }`}
            >
              All Stacks ({projects.length})
            </button>

            {/* Individual Tech Stack Pills */}
            {popularTechList.map(({ name, count }) => {
              const isSelected =
                currentTech.toLowerCase() === name.toLowerCase();
              return (
                <button
                  key={name}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => handleTechChange(name)}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer border flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-[#171F24] dark:bg-[#F1F4F6] text-[#FFFFFF] dark:text-[#171F24] border-[#171F24] dark:border-[#F1F4F6] font-semibold shadow-xs"
                      : "bg-[#FFFFFF] dark:bg-[#1B2228] text-[#55626F] dark:text-[#97A3AF] border-[#E5E4DE] dark:border-[#27313A] hover:bg-[#F2F1EC] dark:hover:bg-[#222B33]"
                  }`}
                >
                  <span>{name}</span>
                  <span
                    className={`text-[10px] px-1 py-0.2 rounded ${
                      isSelected
                        ? "bg-white/20 dark:bg-black/20 text-white dark:text-black"
                        : "bg-[#F2F1EC] dark:bg-[#222B33] text-[#55626F] dark:text-[#97A3AF]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Filter Status & Match Summary */}
        <div className="flex items-center justify-between text-xs font-mono text-[#55626F] dark:text-[#97A3AF] pt-2">
          <span>
            Showing{" "}
            <strong className="text-[#171F24] dark:text-[#F1F4F6]">
              {filteredProjects.length}
            </strong>{" "}
            of {projects.length} projects
            {currentTech !== "all" && (
              <span>
                {" "}
                matching <em>"{currentTech}"</em>
              </span>
            )}
            {searchQuery && (
              <span>
                {" "}
                matching query <em>"{searchQuery}"</em>
              </span>
            )}
          </span>

          {currentSort === "curated" && (
            <span className="text-[11px] text-[#1F51D0] dark:text-[#4F7FF7] hidden sm:inline">
              Ordered by priority (#01 – #{String(projects.length).padStart(2, "0")})
            </span>
          )}
        </div>
      </section>

      {/* Projects Grid */}
      <section aria-label="Project catalog list">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: PROJECTS_PER_PAGE }, (_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : visibleProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleProjects.map((p, index) => {
              const imageUrl = resolveImageUrl(
                Array.isArray(p.images) && p.images.length > 0
                  ? p.images[0]
                  : p.image,
              );

              // Calculate display index: use curated order mapping or document order
              const displayOrder =
                typeof p.order === "number"
                  ? p.order
                  : (CURATED_PROJECT_ORDER[p.id] ?? startIndex + index + 1);

              return (
                <article
                  key={p.id}
                  className="rounded-lg border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#1B2228] overflow-hidden flex flex-col justify-between hover:border-[#1F51D0]/40 dark:hover:border-[#4F7FF7]/40 transition-colors shadow-2xs group"
                >
                  <div>
                    {/* Visual Preview */}
                    <div className="aspect-[16/10] bg-[#F2F1EC] dark:bg-[#13171B] overflow-hidden border-b border-[#E5E4DE] dark:border-[#27313A] relative">
                      {/* Explicit Sequential Order Badge */}
                      <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#171F24]/90 dark:bg-[#F1F4F6]/90 text-white dark:text-[#171F24] backdrop-blur-xs shadow-xs border border-white/10 dark:border-black/10">
                        #{String(displayOrder).padStart(2, "0")}
                      </span>

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

                      {/* Interactive Main Tech Stack Tags on Card */}
                      {(() => {
                        const cardMainTechs = extractMainTechs(p.techStack);
                        if (cardMainTechs.length === 0) return null;
                        return (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {cardMainTechs.map((tech) => {
                              const isCurrentFilter =
                                currentTech.toLowerCase() ===
                                tech.toLowerCase();
                              return (
                                <button
                                  key={tech}
                                  type="button"
                                  onClick={() => handleTechChange(tech)}
                                  title={`Filter by ${tech}`}
                                  className={`text-[11px] font-mono px-2 py-0.5 rounded cursor-pointer transition-colors ${
                                    isCurrentFilter
                                      ? "bg-[#171F24] dark:bg-[#F1F4F6] text-white dark:text-[#171F24] font-semibold"
                                      : "bg-[#F2F1EC] dark:bg-[#222B33] text-[#55626F] dark:text-[#97A3AF] hover:bg-[#E5E4DE] dark:hover:bg-[#2C3842] hover:text-[#171F24] dark:hover:text-[#F1F4F6]"
                                  }`}
                                >
                                  {tech}
                                </button>
                              );
                            })}
                          </div>
                        );
                      })()}
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
          <div className="py-16 text-center border border-dashed border-[#E5E4DE] dark:border-[#27313A] rounded-lg p-8 space-y-3">
            <p className="text-sm font-semibold text-[#171F24] dark:text-[#F1F4F6]">
              No projects found matching the selected criteria.
            </p>
            <p className="text-xs text-[#55626F] dark:text-[#97A3AF] max-w-md mx-auto">
              {currentTech !== "all" && `No projects found for technology "${currentTech}". `}
              {searchQuery && `No matches for keyword "${searchQuery}". `}
              Try resetting your filters or selecting another category.
            </p>
            <button
              type="button"
              onClick={handleResetAllFilters}
              className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-mono font-semibold bg-[#171F24] dark:bg-[#F1F4F6] text-white dark:text-[#171F24] cursor-pointer hover:opacity-90"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}

        {/* Accessible Pagination Navigation */}
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
