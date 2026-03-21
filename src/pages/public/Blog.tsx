import { useEffect, useState } from 'react';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { motion } from 'framer-motion';
import { Calendar, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BlogSkeleton } from '../../components/Skeleton';

const Blog = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setBlogs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <Helmet>
        <title>Blog | Mohamed Sharfiras</title>
        <meta name="description" content="Technical blog by Mohamed Sharfiras covering web development, software engineering, and tutorials." />
      </Helmet>
      
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Blog</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">Writing about software development, technical challenges, and personal growth.</p>
      </motion.div>

      {loading ? (
        <div className="space-y-6">
          {[1,2,3,4].map(n => <BlogSkeleton key={n} />)}
        </div>
      ) : (
        <div className="space-y-8">
          {blogs.map((b, i) => (
            <motion.article 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: i * 0.1 }}
              key={b.id} 
              className="group bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-transparent group-hover:bg-blue-600 transition-colors"></div>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
                  <span className="flex items-center space-x-1"><Calendar className="w-4 h-4" /> <span>{b.createdAt?.toDate().toLocaleDateString() || new Date().toLocaleDateString()}</span></span>
                  <span className="flex items-center space-x-1"><Clock className="w-4 h-4" /> <span>5 min read</span></span>
                  {b.category && (
                    <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-800">
                      {b.category}
                    </span>
                  )}
                </div>
                <Link to={`/blog/${b.id}`}>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer">{b.title}</h2>
                </Link>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">{b.excerpt || 'No excerpt available. Click to read the full article and explore more insights inside.'}</p>
                <Link to={`/blog/${b.id}`} className="text-blue-600 font-bold flex items-center space-x-1 hover:space-x-2 transition-all group/btn inline-flex">
                  <span>Read Article</span>
                  <ChevronRight className="w-4 h-4 text-blue-600" />
                </Link>
              </div>
            </motion.article>
          ))}
          {blogs.length === 0 && (
             <div className="text-center py-24 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No posts yet</h3>
                <p className="text-gray-500 dark:text-gray-400">I'm currently writing some new content. Check back later!</p>
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
