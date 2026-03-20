import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Filter, Briefcase, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const Projects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(
          collection(db, 'projects'),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const statuses = ['All', 'Live', 'In Progress', 'Archived'];
  const filteredProjects = filter === 'All' ? projects : projects.filter(p => p.status === filter);

  return (
    <div className="space-y-12">
      <Helmet>
        <title>Portfolio Projects | Alex Walker</title>
        <meta name="description" content="Explore my portfolio of web applications, open-source repositories, and freelance programming work." />
      </Helmet>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 max-w-2xl">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Projects</h1>
        <p className="text-xl text-gray-600">A collection of things I've built, ranging from web applications to open-source tools.</p>
      </motion.div>

      <div className="flex items-center space-x-4 border-b border-gray-100 pb-4 overflow-x-auto scroolbar-hide">
        <Filter className="w-5 h-5 text-gray-400" />
        {statuses.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              filter === s ? 'bg-gray-900 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1,2,3].map(n => <div key={n} className="h-64 bg-gray-100 animate-pulse rounded-2xl" />)}
        </div>
      ) : (
        <motion.div layout className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filteredProjects.map((p, i) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={p.id}
                className="group rounded-2xl border border-gray-200 bg-white overflow-hidden hover:shadow-2xl hover:border-gray-300 transition-all duration-300 flex flex-col"
              >
                <div className="h-48 bg-gray-100 flex items-center justify-center border-b border-gray-100 relative group-hover:opacity-90 transition-opacity">
                   {p.image ? (
                     <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                   ) : (
                     <Briefcase className="w-12 h-12 text-gray-300 group-hover:text-blue-500 transition-colors" />
                   )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <Link to={`/projects/${p.id}`} className="hover:underline">
                      <h3 className="text-xl font-bold group-hover:text-blue-600 transition-colors">{p.title}</h3>
                    </Link>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${p.status === 'Live' ? 'bg-green-100 text-green-700' : p.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                      {p.status}
                    </span>
                  </div>
                  <p className="text-gray-600 line-clamp-2 text-sm mb-6 flex-1">{p.shortDesc}</p>
                  
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                        {p.techStack?.slice(0, 4).map((tech: string) => (
                        <span key={tech} className="bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded-md border border-gray-100 font-medium tracking-wide">
                            {tech}
                        </span>
                        ))}
                    </div>
                    
                    <div className="flex space-x-3 pt-4 border-t border-gray-50">
                        {p.githubUrl && (
                        <a href={p.githubUrl} target="_blank" rel="noreferrer" className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-black transition-colors">
                            <Github className="w-4 h-4" /> <span>Source</span>
                        </a>
                        )}
                        {p.liveUrl && (
                        <a href={p.liveUrl} target="_blank" rel="noreferrer" className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                            <ExternalLink className="w-4 h-4" /> <span>Visit</span>
                        </a>
                        )}
                    </div>
                    <Link to={`/projects/${p.id}`} className="mt-2 text-blue-600 font-bold flex items-center space-x-1 hover:space-x-2 transition-all text-sm w-max">
                      <span>View Details</span> <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {!loading && filteredProjects.length === 0 && (
         <div className="text-center py-24 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
           <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
           <h3 className="text-lg font-medium text-gray-900">No projects found.</h3>
           <p className="text-gray-500">Check back later or change the filter criteria.</p>
         </div>
      )}
    </div>
  );
};

export default Projects;
