import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  Calendar,
  Clock,
  ChevronLeft,
  ArrowRight,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Bookmark,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { ImageCarousel } from "../../components/ImageCarousel";
import { PageSkeleton } from "../../components/Skeleton";
import ReactMarkdown from "react-markdown";

const SingleBlog = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<any>(null);
  const [recentBlogs, setRecentBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const fetchBlogData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const docRef = doc(db, "blogs", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setBlog({ id: docSnap.id, ...docSnap.data() });
        }

        const q = query(
          collection(db, "blogs"),
          orderBy("createdAt", "desc"),
          limit(10),
        );
        const snap = await getDocs(q);
        setRecentBlogs(
          snap.docs
            .map((d) => ({ id: d.id, ...d.data() }))
            .filter((b: any) => b.id !== id && b.status === "Published")
            .slice(0, 3),
        );
      } catch (err) {
        console.error("Error fetching blog", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <PageSkeleton />;
  if (!blog)
    return (
      <div className="text-center py-24 space-y-4">
        <h1 className="text-3xl font-bold dark:text-white">
          Blog post not found.
        </h1>
        <Link
          to="/blog"
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 inline-flex items-center space-x-2"
        >
          <ChevronLeft className="w-4 h-4" /> <span>Back to Blogs</span>
        </Link>
      </div>
    );

  const shareUrl = window.location.href;
  const shareTitle = blog.title;

  return (
    <div className="relative">
      <Helmet>
        <title>{blog.title} | Mohamed Sharfiras Blog</title>
        <meta
          name="description"
          content={blog.excerpt || `Read ${blog.title} by Mohamed Sharfiras.`}
        />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.excerpt} />
        {blog.coverImage && (
          <meta property="og:image" content={blog.coverImage} />
        )}
        <meta
          property="article:published_time"
          content={blog.createdAt?.toDate().toISOString()}
        />
        <meta property="article:author" content="Mohamed Sharfiras" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={blog.title} />
        <meta property="twitter:description" content={blog.excerpt} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: blog.title,
            image: blog.images?.length > 0 ? blog.images : [blog.coverImage],
            author: {
              "@type": "Person",
              name: "Mohamed Sharfiras",
              url: "https://sharfras.com/about",
            },
            datePublished: blog.createdAt?.toDate().toISOString(),
            description: blog.excerpt,
          })}
        </script>
      </Helmet>

      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-600 origin-left z-[60]"
        style={{ scaleX }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        {/* Breadcrumbs */}
        <nav className="mb-8 flex items-center space-x-2 text-sm font-medium text-gray-500 dark:text-gray-400">
          <Link
            to="/"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Home
          </Link>
          <span className="text-gray-300 dark:text-gray-700">/</span>
          <Link
            to="/blog"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Blog
          </Link>
          <span className="text-gray-300 dark:text-gray-700 hidden sm:inline">
            /
          </span>
          <span className="text-gray-900 dark:text-white truncate hidden sm:inline max-w-[200px]">
            {blog.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Content Area */}
          <div className="lg:col-span-8">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full space-y-16"
            >
              <header className="space-y-8 text-left">
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-widest">
                  <Bookmark className="w-3 h-3" />
                  <span>{blog.category || "Technology"}</span>
                </div>

                <h1 className="text-4xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tight leading-[1.0] max-w-4xl">
                  {blog.title}
                </h1>

                <div className="flex flex-wrap items-center justify-start gap-8 text-sm text-gray-500 dark:text-gray-400 border-y border-gray-100 dark:border-gray-800 py-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-xl shadow-blue-200/50 dark:shadow-none">
                      MS
                    </div>
                    <div>
                      <p className="font-black text-gray-900 dark:text-white text-base leading-none">
                        Mohamed Sharfiras
                      </p>
                      <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-blue-600 dark:text-blue-400 mt-1.5">
                        Web Developer
                      </p>
                    </div>
                  </div>
                  <div className="h-8 w-px bg-gray-200 dark:bg-gray-800 hidden sm:block"></div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <time
                        className="font-bold text-gray-700 dark:text-gray-300"
                        dateTime={blog.createdAt?.toDate().toISOString()}
                      >
                        {blog.createdAt?.toDate().toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span className="font-bold text-gray-700 dark:text-gray-300">
                        {Math.ceil((blog.content?.length || 0) / 1000) || 5} min
                        read
                      </span>
                    </div>
                  </div>
                </div>

                {blog.excerpt && (
                  <p className="text-2xl text-gray-600 dark:text-gray-400 font-medium leading-relaxed max-w-3xl border-l-4 border-blue-600 pl-8 py-2">
                    {blog.excerpt}
                  </p>
                )}
              </header>

              {/* Featured Image */}
              {(blog.images?.length > 0 || blog.coverImage) && (
                <div className="relative group mx-auto">
                  <div className="absolute -inset-4 bg-blue-600/10 dark:bg-blue-400/10 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10"></div>
                  <div className="rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-gray-100 dark:ring-gray-800">
                    <ImageCarousel
                      images={
                        blog.images?.length > 0
                          ? blog.images
                          : [blog.coverImage]
                      }
                    />
                  </div>
                </div>
              )}

              {/* Blog Body */}
              <div
                className="prose prose-lg md:prose-2xl prose-slate dark:prose-invert max-w-none 
                prose-headings:text-gray-900 dark:prose-headings:text-white
                prose-headings:font-black prose-headings:tracking-tight
                prose-p:leading-[1.8] prose-p:text-gray-700 dark:prose-p:text-gray-300
                prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-[2rem] prose-img:shadow-2xl
                prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-code:bg-blue-50 dark:prose-code:bg-blue-900/20 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-gray-950 dark:prose-pre:bg-black prose-pre:rounded-3xl prose-pre:border prose-pre:border-gray-800
                prose-blockquote:border-l-[6px] prose-blockquote:border-blue-600 prose-blockquote:bg-blue-50/50 dark:prose-blockquote:bg-blue-900/10 prose-blockquote:py-2 prose-blockquote:rounded-r-2xl prose-blockquote:font-medium prose-blockquote:italic
                selection:bg-blue-100 dark:selection:bg-blue-900/40"
              >
                <ReactMarkdown>{blog.content}</ReactMarkdown>
              </div>

              {/* Social Sharing */}
              <footer className="pt-16 border-t border-gray-100 dark:border-gray-800">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-8 bg-gray-50 dark:bg-gray-900/50 p-8 rounded-[2.5rem]">
                  <div className="space-y-1 text-center sm:text-left">
                    <p className="text-lg font-black text-gray-900 dark:text-white tracking-tight">
                      Enjoyed this read?
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Share your thoughts with your network.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-4 bg-white dark:bg-gray-800 rounded-2xl text-gray-600 dark:text-gray-400 hover:text-[#1877F2] dark:hover:text-[#1877F2] hover:scale-110 transition-all shadow-sm"
                    >
                      <Facebook className="w-5 h-5 fill-current" />
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-4 bg-white dark:bg-gray-800 rounded-2xl text-gray-600 dark:text-gray-400 hover:text-[#1DA1F2] dark:hover:text-[#1DA1F2] hover:scale-110 transition-all shadow-sm"
                    >
                      <Twitter className="w-5 h-5 fill-current" />
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-4 bg-white dark:bg-gray-800 rounded-2xl text-gray-600 dark:text-gray-400 hover:text-[#0A66C2] dark:hover:text-[#0A66C2] hover:scale-110 transition-all shadow-sm"
                    >
                      <Linkedin className="w-5 h-5 fill-current" />
                    </a>
                    <button
                      onClick={() => navigator.clipboard.writeText(shareUrl)}
                      className="p-4 bg-white dark:bg-gray-800 rounded-2xl text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:scale-110 transition-all shadow-sm"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </footer>
            </motion.article>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-12">
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-12 shrink-0 lg:sticky lg:top-24"
            >
              {/* Recent Posts Card */}
              <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none space-y-8">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-widest flex items-center gap-3">
                  <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                  RECENTS
                </h3>
                <div className="space-y-8">
                  {recentBlogs.map((rb) => (
                    <Link
                      to={`/blog/${rb.id}`}
                      key={rb.id}
                      className="group block space-y-3"
                    >
                      <div className="flex items-center space-x-2 text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">
                        <time>
                          {rb.createdAt?.toDate().toLocaleDateString()}
                        </time>
                      </div>
                      <h4 className="font-bold text-gray-900 dark:text-gray-100 leading-snug group-hover:text-blue-600 transition-colors text-lg">
                        {rb.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {rb.excerpt}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-600 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                        CONTINUE READING <ArrowRight className="w-3 h-3" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Author Card */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-600/40 transition-colors duration-700"></div>
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-xl font-black border border-white/20">
                      MS
                    </div>
                    <div>
                      <p className="font-black text-xl tracking-tight">
                        Mohamed Sharfiras
                      </p>
                      <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest">
                        Developer, SEO, AI Automation
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    I build scalable digital products and automate complex
                    workflows for high-performance teams.
                  </p>
                  <Link
                    to="/contact"
                    className="flex items-center justify-center gap-2 w-full py-4 bg-white text-gray-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-400 hover:text-white transition-all shadow-lg active:scale-95"
                  >
                    WORK WITH ME <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBlog;
