import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { motion } from 'framer-motion';
import { Calendar, Clock, ChevronLeft, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { ImageCarousel } from '../../components/ImageCarousel';

const SingleBlog = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<any>(null);
  const [recentBlogs, setRecentBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // Fetch current blog
        const docRef = doc(db, 'blogs', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setBlog({ id: docSnap.id, ...docSnap.data() });
        }

        // Fetch recent blogs for the sidebar (locally filtering to avoid manual Firestore indices)
        const q = query(
          collection(db, 'blogs'), 
          orderBy('createdAt', 'desc'), 
          limit(10)
        );
        const snap = await getDocs(q);
        setRecentBlogs(
          snap.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .filter((b: any) => b.id !== id && b.status === 'Published')
            .slice(0, 3)
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto animate-pulse flex space-x-12">
        <div className="w-3/4 space-y-6">
          <div className="h-12 bg-gray-100 rounded-xl w-2/3"></div>
          <div className="h-64 bg-gray-100 rounded-2xl w-full"></div>
        </div>
        <div className="w-1/4 space-y-4">
          <div className="h-8 bg-gray-100 rounded border-b pb-4"></div>
          <div className="h-24 bg-gray-100 rounded-xl border"></div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-24 space-y-4">
        <h1 className="text-3xl font-bold">Blog post not found.</h1>
        <Link to="/blog" className="text-blue-600 hover:text-blue-800 inline-flex items-center space-x-2">
          <ChevronLeft className="w-4 h-4" /> <span>Back to Blogs</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <Helmet>
        <title>{blog.title} | Alex Walker Portfolio</title>
        <meta name="description" content={blog.excerpt || `Read ${blog.title} by Alex Walker.`} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.excerpt} />
        {blog.coverImage && <meta property="og:image" content={blog.coverImage} />}
      </Helmet>

      <div className="mb-8">
        <Link to="/blog" className="text-gray-500 hover:text-gray-900 inline-flex items-center space-x-2 transition-colors font-medium">
          <ChevronLeft className="w-4 h-4" /> <span>Back to all posts</span>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Main Content (75%) */}
        <motion.article 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="lg:col-span-3 space-y-8"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-4 text-sm text-gray-500 font-medium">
              <span className="flex items-center space-x-1"><Calendar className="w-4 h-4" /> <span>{blog.createdAt?.toDate().toLocaleDateString() || new Date().toLocaleDateString()}</span></span>
              <span className="flex items-center space-x-1"><Clock className="w-4 h-4" /> <span>5 min read</span></span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">{blog.title}</h1>
          </div>

          {/* Media Carousel / Hero */}
          {(blog.images?.length > 0 || blog.coverImage) && (
            <ImageCarousel images={blog.images?.length > 0 ? blog.images : [blog.coverImage]} />
          )}

          <div className="prose prose-lg text-gray-700 max-w-none leading-relaxed">
            {/* If using a Markdown renderer, you'd wrap blog.content here. For now, simple paragraphs */}
            {blog.content?.split('\n').map((paragraph: string, i: number) => (
              paragraph.trim() ? <p key={i} className="mb-6">{paragraph}</p> : null
            ))}
          </div>
        </motion.article>

        {/* Sidebar (25%) */}
        <motion.aside 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-1 space-y-8"
        >
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center space-x-2">
               <span>Recent Posts</span>
            </h3>
            
            <div className="space-y-6">
              {recentBlogs.length === 0 && <p className="text-gray-500 text-sm">No other posts published yet.</p>}
              
              {recentBlogs.map(rb => (
                <Link to={`/blog/${rb.id}`} key={rb.id} className="group block space-y-2">
                  <h4 className="font-bold text-gray-800 leading-snug group-hover:text-blue-600 transition-colors">{rb.title}</h4>
                  <p className="text-sm text-gray-500 line-clamp-2">{rb.excerpt}</p>
                  <div className="flex items-center space-x-1 text-xs font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                    <span>Read</span> <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100 space-y-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest text-center">About Me</h3>
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto"></div>
              <p className="text-sm text-center text-gray-600">I build elegant digital experiences with scalable robust backend architectures.</p>
              <Link to="/about" className="block text-center text-sm font-bold text-blue-600 hover:text-blue-800">Learn more</Link>
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  );
};

export default SingleBlog;
