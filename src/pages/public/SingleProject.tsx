import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import {
  ChevronLeft,
  Github,
  ExternalLink,
  Calendar,
  Briefcase,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  Layers,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { ImageCarousel } from "../../components/ImageCarousel";
import { PageSkeleton } from "../../components/Skeleton";
import {
  absoluteUrl,
  buildProjectSchema,
  buildBreadcrumbsSchema,
  resolveImageUrl,
} from "../../utils/seo";
import { getCachedProjects } from "../../utils/dataCache";
import { extractMainTechs } from "../../utils/techUtils";

const SingleProject = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any>(null);
  const [nextProject, setNextProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchProjectData = async () => {
      if (!id) return;
      try {
        const cachedList = await getCachedProjects();
        const found = cachedList.find((p) => p.id === id);
        if (found && isMounted) {
          setProject(found);
          const other = cachedList.find((p) => p.id !== id);
          setNextProject(other || null);
          setLoading(false);
          return;
        }

        setLoading(true);
        const docRef = doc(db, "projects", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && isMounted) {
          const currentData = { id: docSnap.id, ...docSnap.data() };
          setProject(currentData);
        } else if (isMounted) {
          setProject(null);
        }

        const other = cachedList.find((p) => p.id !== id);
        if (other && isMounted) {
          setNextProject(other);
        }
      } catch (err) {
        console.error("Error fetching project:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProjectData();
    window.scrollTo(0, 0);
    return () => {
      isMounted = false;
    };
  }, [id]);

  const canonicalUrl = absoluteUrl(`/projects/${id}`);
  const fallbackTitle = project
    ? `${project.title} — Case Study`
    : "Project Case Study";
  const projectImage = project
    ? resolveImageUrl(
        Array.isArray(project.images) && project.images.length > 0
          ? project.images[0]
          : project.image,
      )
    : resolveImageUrl(null);

  // Split description paragraphs into structured sections
  const descriptionParagraphs = project?.fullDesc
    ? project.fullDesc
        .split("\n\n")
        .map((p: string) => p.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-16">
      {/* Helmet rendered immediately so title/canonical never empty even during loading */}
      <Helmet>
        <title>{`${fallbackTitle} | Mohamed Sharfiras`}</title>
        <meta
          name="description"
          content={
            project?.shortDesc ||
            "Technical project case study documenting architecture, implementation decisions, and performance by Mohamed Sharfiras."
          }
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta
          property="og:title"
          content={`${fallbackTitle} | Mohamed Sharfiras`}
        />
        <meta
          property="og:description"
          content={project?.shortDesc || "Technical project case study."}
        />
        <meta property="og:image" content={projectImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`${fallbackTitle} | Mohamed Sharfiras`}
        />
        <meta
          name="twitter:description"
          content={project?.shortDesc || "Technical project case study."}
        />
        <meta name="twitter:image" content={projectImage} />
        {project && (
          <script type="application/ld+json">
            {JSON.stringify(buildProjectSchema(project, canonicalUrl))}
          </script>
        )}
        <script type="application/ld+json">
          {JSON.stringify(
            buildBreadcrumbsSchema([
              { name: "Home", path: "/" },
              { name: "Projects", path: "/projects" },
              { name: project?.title || "Project", path: `/projects/${id}` },
            ]),
          )}
        </script>
      </Helmet>

      {/* Navigation Breadcrumb */}
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
          to="/projects"
          className="hover:text-[#171F24] dark:hover:text-[#F1F4F6] transition-colors"
        >
          Projects
        </Link>
        <span>/</span>
        <span
          className="text-[#171F24] dark:text-[#F1F4F6] truncate max-w-[200px]"
          aria-current="page"
        >
          {project?.title || "Case Study"}
        </span>
      </nav>

      {loading ? (
        <PageSkeleton />
      ) : !project ? (
        <div className="text-center py-24 space-y-4 border border-dashed border-[#E5E4DE] dark:border-[#27313A] rounded-md p-8">
          <h1 className="text-2xl font-bold text-[#171F24] dark:text-[#F1F4F6]">
            Project Record Not Found
          </h1>
          <p className="text-xs text-[#55626F] dark:text-[#97A3AF] max-w-sm mx-auto">
            The project record you requested could not be located in the
            database.
          </p>
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1F51D0] dark:text-[#4F7FF7] hover:underline pt-2"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            <span>Return to project directory</span>
          </Link>
        </div>
      ) : (
        <article className="space-y-12">
          {/* Header Block */}
          <header className="space-y-4 border-b border-[#E5E4DE] dark:border-[#27313A] pb-8">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="px-2 py-0.5 rounded-sm bg-[#F2F1EC] dark:bg-[#222B33] text-[#55626F] dark:text-[#97A3AF]">
                {project.type || "Independent Project"}
              </span>
              <span className="px-2 py-0.5 rounded-sm bg-[#F2F1EC] dark:bg-[#222B33] text-[#55626F] dark:text-[#97A3AF]">
                {project.category || "Web Application"}
              </span>
              <span
                className={`font-semibold px-2 py-0.5 rounded-sm ${
                  project.status === "Live"
                    ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30"
                    : "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30"
                }`}
              >
                {project.status || "Live"}
              </span>
            </div>

            <h1 className="fluid-h1 font-extrabold text-[#171F24] dark:text-[#F1F4F6] tracking-tight">
              {project.title}
            </h1>

            <p className="text-base sm:text-lg text-[#55626F] dark:text-[#97A3AF] leading-relaxed max-w-3xl">
              {project.shortDesc}
            </p>

            {/* Live / Code Links */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-md bg-[#171F24] dark:bg-[#F1F4F6] text-[#FFFFFF] dark:text-[#171F24] text-xs font-semibold hover:bg-[#27313A] dark:hover:bg-[#E5E4DE] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Launch Live Platform</span>
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#1B2228] text-[#171F24] dark:text-[#F1F4F6] text-xs font-semibold hover:bg-[#F2F1EC] dark:hover:bg-[#222B33] transition-colors inline-flex items-center gap-1.5"
                >
                  <Github className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Source Code</span>
                </a>
              )}
            </div>
          </header>

          {/* Screenshot Gallery with Accessible Controls */}
          {(project.images?.length > 0 || project.image) && (
            <section aria-label="Project screenshot showcase">
              <ImageCarousel
                images={
                  project.images?.length > 0 ? project.images : [project.image]
                }
                title={project.title}
              />
            </section>
          )}

          {/* Project Details Grid (2-Column Asymmetric Layout) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Main Narrative Sections */}
            <div className="lg:col-span-8 space-y-10">
              {/* Architecture & Implementation Narrative */}
              <section className="space-y-4">
                <h2 className="text-xl font-bold text-[#171F24] dark:text-[#F1F4F6] border-b border-[#E5E4DE] dark:border-[#27313A] pb-2 flex items-center gap-2">
                  <Layers
                    className="w-4 h-4 text-[#1F51D0] dark:text-[#4F7FF7]"
                    aria-hidden="true"
                  />
                  <span>System Overview &amp; Architecture</span>
                </h2>

                <div className="space-y-4 text-sm text-[#55626F] dark:text-[#97A3AF] leading-relaxed">
                  {descriptionParagraphs.length > 0 ? (
                    descriptionParagraphs.map((para: string, idx: number) => (
                      <p key={idx}>{para}</p>
                    ))
                  ) : (
                    <p>{project.shortDesc}</p>
                  )}
                </div>
              </section>

              {/* Problem / Purpose ("Why I Built This") */}
              {project.whyBuilt && (
                <section className="p-6 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#1B2228] space-y-3">
                  <h2 className="text-base font-bold text-[#171F24] dark:text-[#F1F4F6] flex items-center gap-2">
                    <Lightbulb
                      className="w-4 h-4 text-amber-500"
                      aria-hidden="true"
                    />
                    <span>Purpose &amp; Objectives</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-[#55626F] dark:text-[#97A3AF] leading-relaxed whitespace-pre-line">
                    {project.whyBuilt}
                  </p>
                </section>
              )}

              {/* Engineering Tradeoffs & Lessons Learned */}
              {project.lessonLearned && (
                <section className="space-y-3">
                  <h2 className="text-xl font-bold text-[#171F24] dark:text-[#F1F4F6] border-b border-[#E5E4DE] dark:border-[#27313A] pb-2 flex items-center gap-2">
                    <CheckCircle2
                      className="w-4 h-4 text-emerald-600 dark:text-emerald-400"
                      aria-hidden="true"
                    />
                    <span>Technical Tradeoffs &amp; Lessons Learned</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-[#55626F] dark:text-[#97A3AF] leading-relaxed whitespace-pre-line">
                    {project.lessonLearned}
                  </p>
                </section>
              )}
            </div>

            {/* Sidebar Specifications */}
            <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              <div className="p-5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#1B2228] space-y-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#171F24] dark:text-[#F1F4F6] pb-2 border-b border-[#E5E4DE] dark:border-[#27313A]">
                  Project Specifications
                </h3>

                {project.type && (
                  <div>
                    <p className="text-[11px] font-mono uppercase text-[#55626F] dark:text-[#97A3AF] flex items-center gap-1">
                      <Briefcase className="w-3 h-3" aria-hidden="true" />
                      <span>Engagement Type</span>
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-[#171F24] dark:text-[#F1F4F6] mt-0.5">
                      {project.type}
                    </p>
                  </div>
                )}

                {project.timeToBuild && (
                  <div>
                    <p className="text-[11px] font-mono uppercase text-[#55626F] dark:text-[#97A3AF] flex items-center gap-1">
                      <Calendar className="w-3 h-3" aria-hidden="true" />
                      <span>Timeline / Duration</span>
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-[#171F24] dark:text-[#F1F4F6] mt-0.5">
                      {project.timeToBuild}
                    </p>
                  </div>
                )}

                {project.techStack && (
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-mono uppercase text-[#55626F] dark:text-[#97A3AF]">
                      Technology Stack
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {(extractMainTechs(project.techStack).length > 0
                        ? extractMainTechs(project.techStack)
                        : Array.isArray(project.techStack)
                          ? project.techStack
                          : []
                      ).map((tech: string) => (
                        <span
                          key={tech}
                          className="text-xs font-mono px-2 py-0.5 rounded-sm bg-[#F2F1EC] dark:bg-[#222B33] text-[#55626F] dark:text-[#97A3AF]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-[#E5E4DE] dark:border-[#27313A] text-xs text-[#55626F] dark:text-[#97A3AF] font-mono space-y-1">
                  {project.createdAt?.toDate && (
                    <p>
                      Published:{" "}
                      {project.createdAt.toDate().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  )}
                  {project.updatedAt?.toDate && (
                    <p>
                      Updated:{" "}
                      {project.updatedAt.toDate().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </div>
            </aside>
          </div>

          {/* Navigation to Next Project & Directory */}
          <footer className="pt-8 border-t border-[#E5E4DE] dark:border-[#27313A] flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              to="/projects"
              className="text-xs sm:text-sm font-semibold text-[#55626F] dark:text-[#97A3AF] hover:text-[#171F24] dark:hover:text-[#F1F4F6] inline-flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              <span>Back to all projects</span>
            </Link>

            {nextProject && (
              <Link
                to={`/projects/${nextProject.id}`}
                className="text-xs sm:text-sm font-semibold text-[#1F51D0] dark:text-[#4F7FF7] hover:underline inline-flex items-center gap-1.5"
              >
                <span>Next Project: {nextProject.title}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            )}
          </footer>
        </article>
      )}
    </div>
  );
};

export default SingleProject;
