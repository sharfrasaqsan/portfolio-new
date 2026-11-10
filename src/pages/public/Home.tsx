import { useEffect, useState } from "react";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Download,
  Building2,
  TrendingUp,
  Smartphone,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CardSkeleton } from "../../components/Skeleton";

const stats = [
  {
    icon: Building2,
    value: "4+ Years",
    label: "Professional Experience",
    detail: "Enterprise, legal & e-commerce",
  },
  {
    icon: TrendingUp,
    value: "+30%",
    label: "Organic Traffic Growth",
    detail: "Data-backed technical SEO",
  },
  {
    icon: Smartphone,
    value: "+25%",
    label: "Mobile Performance Lift",
    detail: "Mobile-first responsive architecture",
  },
  {
    icon: Zap,
    value: "-15%",
    label: "Page Load Time",
    detail: "Refactoring, caching & asset tuning",
  },
];

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
    <div className="space-y-20 pb-12">
      <Helmet>
        <title>Mohamed Sharfiras | Enterprise Web & Frontend Developer</title>
        <meta
          name="description"
          content="Portfolio of Mohamed Sharfiras, a Web Developer with 4+ years of experience specializing in React, Next.js, WordPress, Magento, SharePoint, Technical SEO, and Enterprise Web Migration."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="pt-8 md:pt-16 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-semibold tracking-wide uppercase"
        >
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          <span>Enterprise Web • Frontend Engineering • Technical SEO</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="space-y-4 max-w-4xl"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 dark:text-white leading-[1.12]">
            Engineering reliable web platforms,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500">
              enterprise intranets & high-converting eCommerce.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl pt-2">
            Hi, I’m{" "}
            <strong className="text-gray-900 dark:text-white font-semibold">
              Mohamed Sharfiras
            </strong>{" "}
            — a Web Developer with 4+ years of professional experience building
            SEO-optimized, high-performance web applications across enterprise,
            legal, and retail sectors. Proficient in React.js, Next.js,
            TypeScript, WordPress, SharePoint, and Magento 2.
          </p>
        </motion.div>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-wrap items-center gap-4 pt-2"
        >
          <Link
            to="/projects"
            className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-950 px-6 py-3.5 rounded-full font-semibold transition-all shadow-lg shadow-gray-200 dark:shadow-none flex items-center space-x-2"
          >
            <span>Explore Work</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/contact"
            className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-6 py-3.5 rounded-full font-semibold border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
          >
            Let’s Connect
          </Link>

          <a
            href="/resume.pdf"
            download="Mohamed_Sharfiras_CV.pdf"
            className="group bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-900/50 px-6 py-3.5 rounded-full font-semibold transition-all flex items-center space-x-2"
          >
            <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            <span>Download CV</span>
          </a>
        </motion.div>

        {/* Current Focus Highlight Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-transparent dark:from-blue-950/20 dark:via-gray-900 dark:to-gray-900 border border-blue-100 dark:border-blue-900/40 shadow-sm"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                  Current Engagement
                </p>
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Web Production Officer at GSC, HSBC
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
                Leading page build and content migration for a global intranet
                across WordPress and SharePoint — ensuring layout fidelity, UAT
                defect resolution, and multi-stage production releases.
              </p>
            </div>
            <Link
              to="/about"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 self-start md:self-center shrink-0"
            >
              <span>Read Career Story</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* Quantitative Track Record Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-4"
        >
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow space-y-2"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                  {s.value}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {s.label}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">
                  {s.detail}
                </p>
              </div>
            );
          })}
        </motion.div>
      </section>

      {/* Featured Projects */}
      <section className="space-y-8">
        <div className="flex justify-between items-end border-b border-gray-100 dark:border-gray-800 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Featured Work
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              A curated selection of production applications and enterprise
              platforms.
            </p>
          </div>
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
                  className="group rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col"
                >
                  <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                        {p.title}
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <Link
                        to={`/projects/${p.id}`}
                        className="hover:underline"
                      >
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {p.title}
                        </h3>
                      </Link>
                      <p className="text-gray-600 dark:text-gray-400 line-clamp-2 text-sm mt-1">
                        {p.shortDesc}
                      </p>
                    </div>

                    <div className="space-y-4 pt-2">
                      <div className="flex flex-wrap gap-1.5">
                        {p.techStack?.slice(0, 4).map((tech: string) => (
                          <span
                            key={tech}
                            className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-2.5 py-1 rounded-md border border-gray-100 dark:border-gray-700"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <Link
                        to={`/projects/${p.id}`}
                        className="text-blue-600 dark:text-blue-400 font-bold flex items-center space-x-1 hover:space-x-2 transition-all text-sm w-max"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
          {!loading && featuredProjects.length === 0 && (
            <div className="col-span-3 text-center py-12 text-gray-500 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
              No featured projects yet. Check back soon!
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
