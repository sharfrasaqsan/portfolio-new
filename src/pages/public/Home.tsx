import { useEffect, useState } from "react";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CardSkeleton } from "../../components/Skeleton";

const Home = () => {
  const [featuredProjects, setFeaturedProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const q = query(
          collection(db, "projects"),
          where("featured", "==", true),
          limit(6),
        );
        const snap = await getDocs(q);
        setFeaturedProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Failed to fetch featured projects", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="space-y-24 pb-12">
      <Helmet>
        <title>Mohamed Sharfiras | Web Dev & SEO</title>
        <meta
          name="description"
          content="Portfolio of Mohamed Sharfiras, a full-stack developer passionate about creating scalable digital experiences."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="pt-12 md:pt-24 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
            Web Developer -{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              React, WordPress, Magento
            </span>
            .
          </h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl"
        >
          Performance-driven. SEO-focused. Automation-ready.
          <br />
          Building fast, scalable websites and eCommerce platforms with seamless
          automation using GHL.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center space-x-4 pt-4"
        >
          <Link
            to="/projects"
            className="bg-gray-900 dark:bg-white text-white dark:text-gray-950 px-6 py-3 rounded-full font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition shadow-lg shadow-gray-200 dark:shadow-none flex items-center space-x-2"
          >
            <span>View Work</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/contact"
            className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-6 py-3 rounded-full font-medium border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            Contact Me
          </Link>
          <a
            href="/resume.pdf"
            download
            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium flex items-center space-x-2 transition px-2"
          >
            <span className="border-b-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 transition-colors">Resume</span>
          </a>
          <div className="hidden sm:block w-px h-8 bg-gray-200 dark:bg-gray-800"></div>
          <Link
            to="/admin/login"
            className="bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 px-4 py-3 rounded-full font-medium hover:text-gray-900 dark:hover:text-white transition flex items-center"
          >
            Admin Login
          </Link>
        </motion.div>
      </section>

      {/* Featured Projects */}
      <section className="space-y-8">
        <div className="flex justify-between items-end border-b border-gray-100 dark:border-gray-800 pb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Featured Projects
          </h2>
          <Link
            to="/projects"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center space-x-1"
          >
            <span>View all</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {loading
            ? [1, 2, 3].map((i) => <CardSkeleton key={i} />)
            : featuredProjects.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="group rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition duration-300"
                >
                  <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                    )}
                  </div>

                  <div className="p-8 space-y-4 relative z-10">
                    <Link to={`/projects/${p.id}`} className="hover:underline">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {p.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-2 text-sm">
                      {p.shortDesc}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {p.techStack?.slice(0, 3).map((tech: string) => (
                        <span
                          key={tech}
                          className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-3 py-1 rounded-full border border-gray-100 dark:border-gray-700"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
          {!loading && featuredProjects.length === 0 && (
            <div className="col-span-3 text-center py-12 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              No featured projects yet. Go to admin panel to add some!
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
