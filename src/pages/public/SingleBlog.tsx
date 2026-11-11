import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  Calendar,
  Clock,
  ChevronLeft,
  Linkedin,
  Twitter,
  Facebook,
  Bookmark,
  List,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { ImageCarousel } from "../../components/ImageCarousel";
import { PageSkeleton } from "../../components/Skeleton";
import { CodeBlock } from "../../components/CodeBlock";
import ReactMarkdown from "react-markdown";
import {
  absoluteUrl,
  calculateReadingTime,
  resolveImageUrl,
  buildArticleSchema,
  buildBreadcrumbsSchema,
} from "../../utils/seo";
import { getCachedBlogs } from "../../utils/dataCache";

const SingleBlog = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<any>(null);
  const [nextBlog, setNextBlog] = useState<any>(null);
  const [prevBlog, setPrevBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Smooth reading progress indicator
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    let isMounted = true;
    const fetchBlogData = async () => {
      if (!id) return;
      try {
        const allBlogs = await getCachedBlogs();
        const pubBlogs = allBlogs.filter((b: any) => b.status === "Published");
        const found = pubBlogs.find((b: any) => b.id === id);

        if (found && isMounted) {
          setBlog(found);
          const currentIndex = pubBlogs.findIndex((b: any) => b.id === id);
          if (currentIndex !== -1) {
            setNextBlog(pubBlogs[currentIndex - 1] || null);
            setPrevBlog(pubBlogs[currentIndex + 1] || null);
          }
          setLoading(false);
          return;
        }

        setLoading(true);
        const docRef = doc(db, "blogs", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && isMounted) {
          const data = docSnap.data();
          if (data && data.status === "Published") {
            setBlog({ id: docSnap.id, ...data });
          } else {
            setBlog(null);
          }
        }
      } catch (err) {
        console.error("Error fetching article:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBlogData();
    window.scrollTo(0, 0);
    return () => {
      isMounted = false;
    };
  }, [id]);

  // Extract table of contents headings from Markdown
  const headings = useMemo(() => {
    if (!blog?.content) return [];
    const lines = blog.content.split("\n");
    const extracted: { text: string; id: string; level: number }[] = [];

    lines.forEach((line: string) => {
      const match = line.match(/^(#{2,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim();
        const cleanId = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-");
        extracted.push({ text, id: cleanId, level });
      }
    });

    return extracted;
  }, [blog?.content]);

  const canonicalUrl = absoluteUrl(`/blog/${id}`);
  const fallbackTitle = blog ? blog.title : "Technical Article";
  const readingTime = blog ? calculateReadingTime(blog.content) : 5;

  // Resolve cover image strictly as string URL
  const coverImageUrl = blog
    ? resolveImageUrl(
        Array.isArray(blog.images) && blog.images.length > 0
          ? blog.images[0]
          : blog.coverImage,
      )
    : resolveImageUrl(null);

  const shareUrl = canonicalUrl;

  return (
    <div className="relative max-w-4xl mx-auto space-y-12 pb-20">
      {/* Scroll Reading Progress Bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1 bg-[#1F51D0] dark:bg-[#4F7FF7] z-50 origin-left pointer-events-none"
      />

      {/* Immediate Helmet metadata to prevent empty title/canonical while loading */}
      <Helmet>
        <title>{`${fallbackTitle} | Mohamed Sharfiras`}</title>
        <meta
          name="description"
          content={
            blog?.excerpt || `Read ${fallbackTitle} by Mohamed Sharfiras.`
          }
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={fallbackTitle} />
        <meta
          property="og:description"
          content={blog?.excerpt || fallbackTitle}
        />
        <meta property="og:image" content={coverImageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fallbackTitle} />
        <meta
          name="twitter:description"
          content={blog?.excerpt || fallbackTitle}
        />
        <meta name="twitter:image" content={coverImageUrl} />
        {blog?.createdAt?.toDate && (
          <meta
            property="article:published_time"
            content={blog.createdAt.toDate().toISOString()}
          />
        )}
        <meta property="article:author" content="Mohamed Sharfiras" />
        {blog && (
          <script type="application/ld+json">
            {JSON.stringify(buildArticleSchema(blog, canonicalUrl))}
          </script>
        )}
        <script type="application/ld+json">
          {JSON.stringify(
            buildBreadcrumbsSchema([
              { name: "Home", path: "/" },
              { name: "Blog", path: "/blog" },
              { name: blog?.title || "Article", path: `/blog/${id}` },
            ]),
          )}
        </script>
      </Helmet>

      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center space-x-2 text-xs font-mono text-[#55626F] dark:text-[#97A3AF]"
      >
        <Link
          to="/"
          className="hover:text-[#171F24] dark:hover:text-[#F1F4F6] transition-colors"
        >
          Home
        </Link>
        <span>/</span>
        <Link
          to="/blog"
          className="hover:text-[#171F24] dark:hover:text-[#F1F4F6] transition-colors"
        >
          Blog
        </Link>
        <span>/</span>
        <span
          className="text-[#171F24] dark:text-[#F1F4F6] truncate max-w-[220px]"
          aria-current="page"
        >
          {blog?.title || "Article"}
        </span>
      </nav>

      {loading ? (
        <PageSkeleton />
      ) : !blog ? (
        <div className="text-center py-24 space-y-4 border border-dashed border-[#E5E4DE] dark:border-[#27313A] rounded-md p-8">
          <h1 className="text-2xl font-bold text-[#171F24] dark:text-[#F1F4F6]">
            Article Not Located
          </h1>
          <p className="text-xs text-[#55626F] dark:text-[#97A3AF] max-w-sm mx-auto">
            This article may have been unpublished, moved, or deleted.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1F51D0] dark:text-[#4F7FF7] hover:underline pt-2"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            <span>Return to blog archive</span>
          </Link>
        </div>
      ) : (
        <article className="space-y-10">
          {/* Article Header */}
          <header className="space-y-4 border-b border-[#E5E4DE] dark:border-[#27313A] pb-8">
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#55626F] dark:text-[#97A3AF]">
              {blog.category && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm bg-[#F2F1EC] dark:bg-[#222B33] text-[#171F24] dark:text-[#F1F4F6] font-semibold uppercase text-[11px]">
                  <Bookmark
                    className="w-3 h-3 text-[#1F51D0] dark:text-[#4F7FF7]"
                    aria-hidden="true"
                  />
                  <span>{blog.category}</span>
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                <time
                  dateTime={
                    blog.createdAt?.toDate
                      ? blog.createdAt.toDate().toISOString()
                      : undefined
                  }
                >
                  {blog.createdAt?.toDate
                    ? blog.createdAt.toDate().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Published"}
                </time>
              </span>
              <span>&bull;</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{readingTime} min read</span>
              </span>
              {blog.updatedAt && (
                <>
                  <span>&bull;</span>
                  <span className="text-[11px] text-[#55626F] dark:text-[#97A3AF]">
                    Updated:{" "}
                    {typeof blog.updatedAt?.toDate === "function"
                      ? blog.updatedAt.toDate().toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Recently"}
                  </span>
                </>
              )}
            </div>

            <h1 className="fluid-h1 font-black text-[#171F24] dark:text-[#F1F4F6] tracking-tight leading-tight">
              {blog.title}
            </h1>

            {blog.excerpt && (
              <p className="text-base sm:text-lg text-[#55626F] dark:text-[#97A3AF] leading-relaxed max-w-3xl">
                {blog.excerpt}
              </p>
            )}

            {/* Author Byline */}
            <div className="pt-2 flex items-center gap-3 text-xs">
              <div className="w-8 h-8 rounded-full bg-[#171F24] dark:bg-[#F1F4F6] text-[#FFFFFF] dark:text-[#171F24] flex items-center justify-center font-bold text-xs">
                MS
              </div>
              <div>
                <p className="font-bold text-[#171F24] dark:text-[#F1F4F6]">
                  Mohamed Sharfiras
                </p>
                <p className="text-[#55626F] dark:text-[#97A3AF]">
                  Web Developer &bull; Colombo, Sri Lanka
                </p>
              </div>
            </div>
          </header>

          {/* Featured Image / Gallery */}
          {(blog.images?.length > 0 || blog.coverImage) && (
            <div className="overflow-hidden rounded-md border border-[#E5E4DE] dark:border-[#27313A]">
              <ImageCarousel
                images={
                  blog.images?.length > 0 ? blog.images : [blog.coverImage]
                }
                title={blog.title}
              />
            </div>
          )}

          {/* Table of Contents (Only rendered if article has 3+ headings) */}
          {headings.length >= 3 && (
            <nav
              aria-label="Table of contents"
              className="p-5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#1B2228] space-y-2.5"
            >
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#171F24] dark:text-[#F1F4F6] flex items-center gap-1.5">
                <List
                  className="w-3.5 h-3.5 text-[#1F51D0] dark:text-[#4F7FF7]"
                  aria-hidden="true"
                />
                <span>Article Outline</span>
              </h2>
              <ul className="space-y-1.5 text-xs text-[#55626F] dark:text-[#97A3AF] font-mono">
                {headings.map((h, i) => (
                  <li
                    key={i}
                    className={h.level === 3 ? "pl-4 text-[11px]" : ""}
                  >
                    <a
                      href={`#${h.id}`}
                      className="hover:text-[#171F24] dark:hover:text-[#F1F4F6] hover:underline"
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* Markdown Content (Formatted with comfortable editorial measure) */}
          <div className="reading-measure prose prose-slate dark:prose-invert max-w-none text-base sm:text-lg leading-relaxed prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-[#171F24] dark:prose-headings:text-[#F1F4F6] prose-a:text-[#1F51D0] dark:prose-a:text-[#4F7FF7] prose-a:underline-offset-4">
            <ReactMarkdown components={{ code: CodeBlock }}>
              {blog.content}
            </ReactMarkdown>
          </div>

          {/* Social Share Strip */}
          <footer className="pt-8 border-t border-[#E5E4DE] dark:border-[#27313A] space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#1B2228]">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#171F24] dark:text-[#F1F4F6]">
                  Share this article
                </p>
                <p className="text-xs text-[#55626F] dark:text-[#97A3AF]">
                  Distribute technical notes to your professional network.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Share article on LinkedIn"
                  className="p-2 rounded-sm border border-[#E5E4DE] dark:border-[#27313A] hover:bg-[#F2F1EC] dark:hover:bg-[#222B33] text-[#55626F] dark:text-[#97A3AF] transition-colors"
                >
                  <Linkedin className="w-4 h-4" aria-hidden="true" />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(blog.title)}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Share article on Twitter"
                  className="p-2 rounded-sm border border-[#E5E4DE] dark:border-[#27313A] hover:bg-[#F2F1EC] dark:hover:bg-[#222B33] text-[#55626F] dark:text-[#97A3AF] transition-colors"
                >
                  <Twitter className="w-4 h-4" aria-hidden="true" />
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Share article on Facebook"
                  className="p-2 rounded-sm border border-[#E5E4DE] dark:border-[#27313A] hover:bg-[#F2F1EC] dark:hover:bg-[#222B33] text-[#55626F] dark:text-[#97A3AF] transition-colors"
                >
                  <Facebook className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Previous & Next Article Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prevBlog ? (
                <Link
                  to={`/blog/${prevBlog.id}`}
                  className="p-4 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#1B2228] hover:border-[#1F51D0] dark:hover:border-[#4F7FF7] transition-colors space-y-1 text-left"
                >
                  <span className="text-[11px] font-mono uppercase text-[#55626F] dark:text-[#97A3AF]">
                    &larr; Older Post
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-[#171F24] dark:text-[#F1F4F6] line-clamp-1">
                    {prevBlog.title}
                  </p>
                </Link>
              ) : (
                <div />
              )}

              {nextBlog ? (
                <Link
                  to={`/blog/${nextBlog.id}`}
                  className="p-4 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#1B2228] hover:border-[#1F51D0] dark:hover:border-[#4F7FF7] transition-colors space-y-1 text-right"
                >
                  <span className="text-[11px] font-mono uppercase text-[#55626F] dark:text-[#97A3AF]">
                    Newer Post &rarr;
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-[#171F24] dark:text-[#F1F4F6] line-clamp-1">
                    {nextBlog.title}
                  </p>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </footer>
        </article>
      )}
    </div>
  );
};

export default SingleBlog;
