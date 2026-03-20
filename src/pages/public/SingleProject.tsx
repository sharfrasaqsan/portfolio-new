import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { motion } from 'framer-motion';
import { ChevronLeft, Github, ExternalLink, Calendar, Briefcase, Lightbulb } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { ImageCarousel } from '../../components/ImageCarousel';
import { PageSkeleton } from '../../components/Skeleton';

const SingleProject = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'projects', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        console.error("Error fetching project", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return <PageSkeleton />;
  }

  if (!project) {
    return (
      <div className="text-center py-24">
        <h1 className="text-3xl font-bold dark:text-white">Project not found.</h1>
        <Link to="/projects" className="text-blue-600 dark:text-blue-400 mt-4 inline-block hover:underline">Return to Projects</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-24">
      <Helmet>
        <title>{project.title} | Projects Portfolio</title>
        <meta name="description" content={project.shortDesc} />
      </Helmet>

      <div className="mb-8">
        <Link to="/projects" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white inline-flex items-center space-x-2 transition-colors font-medium">
          <ChevronLeft className="w-4 h-4" /> <span>Back to all projects</span>
        </Link>
      </div>

      <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-12">
        {/* Header Section */}
        <div className="space-y-6 text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center space-x-2">
             <span className="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full text-sm font-bold tracking-wide uppercase">{project.category}</span>
             <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide border ${project.status === 'Live' ? 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/40' : 'bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900/40'}`}>
                {project.status}
             </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight">{project.title}</h1>
          <p className="text-2xl text-gray-500 dark:text-gray-400 leading-snug">{project.shortDesc}</p>
          
          <div className="flex justify-center space-x-4 pt-4">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center space-x-2 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-6 py-3 rounded-full font-bold transition">
                 <Github className="w-5 h-5" /> <span>Source Code</span>
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center space-x-2 text-white bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full font-bold transition shadow-lg shadow-blue-200 dark:shadow-none">
                 <ExternalLink className="w-5 h-5" /> <span>Live Demo</span>
              </a>
            )}
          </div>
        </div>

        {/* Hero Image / Carousel */}
        {project.images?.length > 0 || project.image ? (
          <ImageCarousel images={project.images?.length > 0 ? project.images : [project.image]} />
        ) : (
          <div className="bg-gray-100 rounded-3xl border border-gray-200 aspect-video flex flex-col items-center justify-center text-gray-400">
             <Briefcase className="w-16 h-16 mb-4 opacity-50" />
             <p className="font-medium text-lg">No hero image provided</p>
          </div>
        )}

        {/* Content Details */}
        <div className="grid md:grid-cols-3 gap-12 pt-8">
          
          {/* Main Info */}
          <div className="md:col-span-2 space-y-12">
             <section className="space-y-4">
                <h2 className="text-2xl font-bold border-b border-gray-100 dark:border-gray-800 pb-2 dark:text-white">Overview</h2>
                <div className="prose prose-lg text-gray-700 dark:text-gray-300 max-w-none">
                  {project.fullDesc ? project.fullDesc.split('\n').map((p:string,i:number) => <p key={i}>{p}</p>) : <p className="italic text-gray-400">No extensive description created yet.</p>}
                </div>
             </section>

             {project.whyBuilt && (
               <section className="space-y-4 bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                  <h2 className="text-xl font-bold flex items-center space-x-2 dark:text-white"><Lightbulb className="w-5 h-5 text-yellow-500" /> <span>Why I Built This</span></h2>
                  <p className="text-gray-700 dark:text-gray-400 leading-relaxed">{project.whyBuilt}</p>
               </section>
             )}

             {project.lessonLearned && (
               <section className="space-y-4">
                  <h2 className="text-2xl font-bold border-b border-gray-100 dark:border-gray-800 pb-2 dark:text-white">Lessons Learned</h2>
                  <p className="text-gray-700 dark:text-gray-400 leading-relaxed">{project.lessonLearned}</p>
               </section>
             )}
          </div>

          {/* Sidebar Metrics */}
          <div className="md:col-span-1 space-y-6">
             <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-6 sticky top-24">
                {project.timeToBuild && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1 flex items-center space-x-1"><Calendar className="w-3 h-3" /> <span>Time to Build</span></h3>
                    <p className="font-medium text-gray-900 dark:text-white">{project.timeToBuild}</p>
                  </div>
                )}
                
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack?.map((tech: string) => (
                      <span key={tech} className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm font-semibold px-3 py-1 rounded-md border border-blue-100 dark:border-blue-900/40">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 text-sm text-gray-500">
                  <p>Published on {project.createdAt?.toDate().toLocaleDateString()}</p>
                </div>
             </div>
          </div>
        </div>
      </motion.article>
    </div>
  );
};

export default SingleProject;
