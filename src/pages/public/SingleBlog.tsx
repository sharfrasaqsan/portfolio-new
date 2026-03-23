import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  Calendar,
  Clock,
  ChevronLeft,
  ArrowRight,
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
  const [nextBlog, setNextBlog] = useState<any>(null);
  const [prevBlog, setPrevBlog] = useState<any>(null);
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
        let blogData: any = null;
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data && data.status === "Published") {
            blogData = { id: docSnap.id, ...data };
            setBlog(blogData);
          } else {
            setBlog(null);
          }
        }

        const q = query(
          collection(db, "blogs"),
          orderBy("createdAt", "desc"),
          limit(30),
        );
        const snap = await getDocs(q);
        const pubBlogs = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((b: any) => b.status === "Published");
          
        setRecentBlogs(pubBlogs.filter((b: any) => b.id !== id).slice(0, 3));

        // Fetch Next/Prev Blogs
        if (blogData && blogData.createdAt) {
          const currentIndex = pubBlogs.findIndex(b => b.id === id);
          if (currentIndex !== -1) {
            setNextBlog(pubBlogs[currentIndex - 1] || null); // Newer
            setPrevBlog(pubBlogs[currentIndex + 1] || null); // Older
          }
        }
      } catch (err) {
        console.error("Error fetching blog", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogData();
    window.scrollTo(0, 0);
  }, [id]);

  const shareUrl = window.location.href;

  return (
    <div className="relative">
      <Helmet>
        <title>{blog ? `${blog.title}` : "Loading Blog..."}</title>
        {blog && (
          <>
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
          </>
        )}
      </Helmet>

      {loading ? (
        <PageSkeleton />
      ) : !blog ? (
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
      ) : (
        <>
          <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-blue-600 origin-left z-[60]"
            style={{ scaleX }}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
            <nav className="mb-8 flex items-center space-x-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
              <span className="text-gray-300 dark:text-gray-700">/</span>
              <Link to="/blog" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Blog</Link>
              <span className="text-gray-300 dark:text-gray-700 hidden sm:inline">/</span>
              <span className="text-gray-900 dark:text-white truncate hidden sm:inline max-w-[200px]">{blog.title}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-8">
                <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full space-y-16">
                  <header className="space-y-8 text-left">
                    <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-widest">
                      <Bookmark className="w-3 h-3" />
                      <span>{blog.category || "Technology"}</span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-[1.1] max-w-4xl">
                      {blog.title}
                    </h1>

                    <div className="flex flex-wrap items-center justify-start gap-8 text-sm text-gray-500 dark:text-gray-400 border-y border-gray-100 dark:border-gray-800 py-8">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-xl shadow-blue-200/50 dark:shadow-none">MS</div>
                        <div>
                          <p className="font-black text-gray-900 dark:text-white text-base leading-none">Mohamed Sharfiras</p>
                          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-blue-600 dark:text-blue-400 mt-1.5">Web Developer</p>
                        </div>
                      </div>
                      <div className="h-8 w-px bg-gray-200 dark:bg-gray-800 hidden sm:block"></div>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <time className="font-bold text-gray-700 dark:text-gray-300">
                            {blog.createdAt?.toDate().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                          </time>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-blue-500" />
                          <span className="font-bold text-gray-700 dark:text-gray-300">{Math.ceil((blog.content?.length || 0) / 1000) || 5} min read</span>
                        </div>
                        {blog.updatedAt && (
                           <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-800">
                             <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">Updated: </span>
                             <time className="text-xs font-bold text-gray-600 dark:text-gray-400">
                                {blog.updatedAt.toDate().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                             </time>
                           </div>
                        )}
                      </div>
                    </div>
                  </header>

                  {(blog.images?.length > 0 || blog.coverImage) && (
                    <div className="rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-gray-100 dark:ring-gray-800">
                      <ImageCarousel images={blog.images?.length > 0 ? blog.images : [blog.coverImage]} />
                    </div>
                  )}

                  <div className="prose prose-lg md:prose-xl prose-slate dark:prose-invert max-w-none prose-headings:font-black prose-p:text-lg md:prose-p:text-xl prose-img:rounded-[2rem]">
                    <ReactMarkdown>{blog.content}</ReactMarkdown>
                  </div>

                  <nav className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-12 border-t border-gray-100 dark:border-gray-800">
                    {prevBlog ? (
                      <Link to={`/blog/${prevBlog.id}`} className="group p-8 rounded-[2rem] bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 hover:border-blue-600 transition-all text-left space-y-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Previous Post</span>
                        <h4 className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 line-clamp-1">{prevBlog.title}</h4>
                      </Link>
                    ) : <div />}
                    {nextBlog ? (
                      <Link to={`/blog/${nextBlog.id}`} className="group p-8 rounded-[2rem] bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 hover:border-blue-600 transition-all text-right space-y-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Next Post</span>
                        <h4 className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 line-clamp-1">{nextBlog.title}</h4>
                      </Link>
                    ) : <div />}
                  </nav>

                  <footer className="pt-16 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-8 bg-gray-50 dark:bg-gray-900/50 p-8 rounded-[2.5rem]">
                      <div className="text-center sm:text-left">
                        <p className="text-lg font-black text-gray-900 dark:text-white">Enjoyed this read?</p>
                        <p className="text-sm text-gray-500">Share your thoughts with your network.</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" className="p-4 bg-white dark:bg-gray-800 rounded-2xl hover:text-[#1877F2] transition-all"><Facebook className="w-5 h-5" /></a>
                        <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(blog.title)}`} target="_blank" rel="noreferrer" className="p-4 bg-white dark:bg-gray-800 rounded-2xl hover:text-[#1DA1F2] transition-all"><Twitter className="w-5 h-5" /></a>
                        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" className="p-4 bg-white dark:bg-gray-800 rounded-2xl hover:text-[#0A66C2] transition-all"><Linkedin className="w-5 h-5" /></a>
                      </div>
                    </div>
                  </footer>
                </motion.article>
              </div>

              <div className="lg:col-span-4 space-y-12">
                <motion.aside initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                  <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl space-y-8">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-widest flex items-center gap-3"><span className="w-2 h-8 bg-blue-600 rounded-full"></span>RECENTS</h3>
                    <div className="space-y-8">
                      {recentBlogs.map((rb) => (
                        <Link to={`/blog/${rb.id}`} key={rb.id} className="group block space-y-3">
                          <time className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">{rb.createdAt?.toDate().toLocaleDateString()}</time>
                          <h4 className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors text-lg line-clamp-2">{rb.title}</h4>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                    <div className="relative z-10 space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-xl font-black border border-white/20">MS</div>
                        <div>
                          <p className="font-black text-xl tracking-tight">Mohamed Sharfiras</p>
                          <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest">Developer, SEO, AI Automation</p>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed">I build scalable digital products and automate complex workflows for high-performance teams.</p>
                      <Link to="/contact" className="flex items-center justify-center gap-2 w-full py-4 bg-white text-gray-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-400 hover:text-white transition-all shadow-lg active:scale-95">WORK WITH ME <ArrowRight className="w-4 h-4" /></Link>
                    </div>
                  </div>

                  <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                    <div className="relative z-10 space-y-6">
                      <h3 className="text-2xl font-black leading-tight">Ready to boost your digital presence?</h3>
                      <p className="text-blue-100 text-sm leading-relaxed">Let's discuss your project and see how I can help you achieve your business goals.</p>
                      <Link to="/contact" className="flex items-center justify-center gap-2 w-full py-4 bg-white text-blue-600 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-50 transition-all shadow-lg active:scale-95">GET STARTED NOW <ArrowRight className="w-4 h-4" /></Link>
                    </div>
                  </div>
                </motion.aside>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SingleBlog;
