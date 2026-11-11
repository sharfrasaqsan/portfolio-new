import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Calendar, Clock, Rss, Search, X } from "lucide-react";
import { BlogSkeleton } from "../../components/Skeleton";
import {
  absoluteUrl,
  resolveImageUrl,
  buildBreadcrumbsSchema,
  calculateReadingTime,
} from "../../utils/seo";
import { getCachedBlogs } from "../../utils/dataCache";

const Blog = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let isMounted = true;
    const fetchBlogs = async () => {
      try {
        const allBlogs = await getCachedBlogs(true);
        if (isMounted) {
          setBlogs(allBlogs.filter((b: any) => b.status === "Published"));
        }
      } catch (err) {
        console.error("Blog fetch error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchBlogs();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    blogs.forEach((b) => {
      if (b.category) set.add(b.category);
    });
    return ["All", ...Array.from(set)];
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      const matchesCategory =
        selectedCategory === "All" || b.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        b.title?.toLowerCase().includes(q) ||
        b.excerpt?.toLowerCase().includes(q) ||
        b.category?.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [blogs, selectedCategory, searchQuery]);

  const canonicalUrl = absoluteUrl("/blog");

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      <Helmet>
        <title>Engineering Blog &amp; Notes | Mohamed Sharfiras</title>
        <meta
          name="description"
          content="Technical writing by Mohamed Sharfiras on frontend engineering, enterprise migrations, WordPress architectures, performance optimization, and automation."
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="blog" />
        <meta property="og:url" content={canonicalUrl} />
        <meta
          property="og:title"
          content="Engineering Blog &amp; Notes | Mohamed Sharfiras"
        />
        <meta
          property="og:description"
          content="Technical writing by Mohamed Sharfiras on frontend engineering, enterprise migrations, performance, and automation."
        />
        <meta property="og:image" content={resolveImageUrl(null)} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify(
            buildBreadcrumbsSchema([
              { name: "Home", path: "/" },
              { name: "Blog", path: "/blog" },
            ]),
          )}
        </script>
      </Helmet>

      {/* Header Introduction */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E5E4DE] dark:border-[#27313A] pb-8">
        <div className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-wider text-[#1F51D0] dark:text-[#4F7FF7]">
            Technical Notes &amp; Systems
          </p>
          <h1 className="fluid-h1 font-extrabold text-[#171F24] dark:text-[#F1F4F6] tracking-tight">
            Articles &amp; Architecture Notes
          </h1>
          <p className="text-sm sm:text-base text-[#55626F] dark:text-[#97A3AF] max-w-2xl leading-relaxed">
            Production teardowns, Core Web Vitals remediation, enterprise
            migration notes, and resilient lead pipeline architectures.
          </p>
        </div>

        <a
          href="/rss.xml"
          target="_blank"
          rel="noreferrer"
          aria-label="Subscribe to RSS feed"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#1B2228] text-xs font-mono text-[#55626F] dark:text-[#97A3AF] hover:text-[#1F51D0] dark:hover:text-[#4F7FF7] transition-colors shrink-0 shadow-2xs self-start sm:self-auto"
        >
          <Rss className="w-3.5 h-3.5 text-amber-500" />
          <span>RSS Feed</span>
        </a>
      </section>

      {/* Category Pills & Search Controls */}
      <section className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          {/* Category Tabs */}
          <div
            className="flex flex-wrap items-center gap-1.5"
            role="tablist"
            aria-label="Filter articles by category"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                role="tab"
                aria-selected={selectedCategory === cat}
                className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#171F24] dark:bg-[#F1F4F6] text-[#FFFFFF] dark:text-[#171F24] font-bold shadow-2xs"
                    : "bg-[#FFFFFF] dark:bg-[#1B2228] border border-[#E5E4DE] dark:border-[#27313A] text-[#55626F] dark:text-[#97A3AF] hover:text-[#171F24] dark:hover:text-[#F1F4F6]"
                }`}
              >
                {cat}
                {cat === "All" && blogs.length > 0 ? ` (${blogs.length})` : ""}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-3.5 h-3.5 text-[#55626F] dark:text-[#97A3AF] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              aria-label="Search articles"
              className="w-full pl-9 pr-8 py-1.5 text-xs font-mono rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#1B2228] text-[#171F24] dark:text-[#F1F4F6] placeholder:text-[#97A3AF] dark:placeholder:text-[#55626F] focus:outline-none focus:border-[#1F51D0] dark:focus:border-[#4F7FF7]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#55626F] dark:text-[#97A3AF] hover:text-[#171F24] dark:hover:text-[#F1F4F6] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Articles Archive */}
      <section aria-label="Published articles">
        {loading ? (
          <div className="space-y-6">
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
          </div>
        ) : filteredBlogs.length > 0 ? (
          <div className="space-y-8 divide-y divide-[#E5E4DE] dark:divide-[#27313A]">
            {filteredBlogs.map((b) => {
              const readingTime = calculateReadingTime(b.content);
              const dateStr = b.createdAt?.toDate
                ? b.createdAt.toDate().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Published";

              const coverImg = resolveImageUrl(
                Array.isArray(b.images) && b.images.length > 0
                  ? b.images[0]
                  : b.coverImage,
              );

              return (
                <article
                  key={b.id}
                  className="pt-8 first:pt-0 grid grid-cols-1 md:grid-cols-12 gap-6 items-start group"
                >
                  <div className="md:col-span-8 space-y-3">
                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#55626F] dark:text-[#97A3AF]">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                        <time
                          dateTime={
                            b.createdAt?.toDate
                              ? b.createdAt.toDate().toISOString()
                              : undefined
                          }
                        >
                          {dateStr}
                        </time>
                      </span>
                      <span>&bull;</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{readingTime} min read</span>
                      </span>
                      {b.category && (
                        <>
                          <span>&bull;</span>
                          <span className="px-2 py-0.5 rounded bg-[#F2F1EC] dark:bg-[#222B33] text-[#55626F] dark:text-[#97A3AF] uppercase text-[10px] font-semibold">
                            {b.category}
                          </span>
                        </>
                      )}
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold text-[#171F24] dark:text-[#F1F4F6] tracking-tight leading-snug group-hover:text-[#1F51D0] dark:group-hover:text-[#4F7FF7] transition-colors">
                      <Link to={`/blog/${b.id}`}>{b.title}</Link>
                    </h2>

                    <p className="text-xs sm:text-sm text-[#55626F] dark:text-[#97A3AF] line-clamp-3 leading-relaxed">
                      {b.excerpt ||
                        "Read full technical notes and analysis inside."}
                    </p>

                    <div className="pt-2">
                      <Link
                        to={`/blog/${b.id}`}
                        className="text-xs sm:text-sm font-semibold text-[#1F51D0] dark:text-[#4F7FF7] hover:underline inline-flex items-center gap-1.5"
                      >
                        <span>Read full article</span>
                        <ArrowRight
                          className="w-3.5 h-3.5"
                          aria-hidden="true"
                        />
                      </Link>
                    </div>
                  </div>

                  {/* Thumbnail Preview */}
                  <div className="md:col-span-4">
                    <Link
                      to={`/blog/${b.id}`}
                      className="block overflow-hidden rounded-lg border border-[#E5E4DE] dark:border-[#27313A] bg-[#F2F1EC] dark:bg-[#1B2228] aspect-[16/10] shadow-2xs hover:border-[#1F51D0]/40 transition-colors"
                      aria-label={`Read article: ${b.title}`}
                    >
                      <img
                        src={coverImg}
                        alt={`${b.title} preview`}
                        width={480}
                        height={300}
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                        loading="lazy"
                      />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-[#E5E4DE] dark:border-[#27313A] rounded-lg p-8 space-y-3">
            <p className="text-sm font-semibold text-[#171F24] dark:text-[#F1F4F6]">
              No articles match your query
            </p>
            <p className="text-xs text-[#55626F] dark:text-[#97A3AF] max-w-sm mx-auto">
              Try adjusting your search terms or selecting a different category
              filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="text-xs font-mono font-semibold text-[#1F51D0] dark:text-[#4F7FF7] hover:underline cursor-pointer pt-2"
            >
              Reset all filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Blog;
