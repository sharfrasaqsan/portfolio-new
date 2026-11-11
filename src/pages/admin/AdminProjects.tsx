import React, { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import axios from "axios";
import { db } from "../../firebase/config";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  UploadCloud,
  Loader2,
  Star,
  Copy,
  ExternalLink,
  Search,
  Check,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { invalidateContentCache } from "../../utils/dataCache";

export default function AdminProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Toast feedback state
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [fullDesc, setFullDesc] = useState("");
  const [whyBuilt, setWhyBuilt] = useState("");
  const [lessonLearned, setLessonLearned] = useState("");
  const [status, setStatus] = useState("In Progress");
  const [timeToBuild, setTimeToBuild] = useState("");
  const [category, setCategory] = useState("Web App");
  const [techStack, setTechStack] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [featured, setFeatured] = useState(false);
  const [type, setType] = useState("Individual Project");

  // Upload State
  const [isUploading, setIsUploading] = useState(false);

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "projects"), (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setProjects(data);
    });
    return () => unsub();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setIsUploading(true);

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      showToast(
        "Cloudinary configuration missing (VITE_CLOUDINARY_CLOUD_NAME).",
        "error",
      );
      setIsUploading(false);
      return;
    }

    const uploadedUrls: string[] = [];
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          formData,
        );

        uploadedUrls.push(response.data.secure_url);
      }
      setImages((prev: string[]) => [...prev, ...uploadedUrls]);
      showToast(
        `Uploaded ${uploadedUrls.length} image${uploadedUrls.length > 1 ? "s" : ""}.`,
      );
    } catch (err: any) {
      console.error(err);
      showToast(
        "Cloudinary upload failed: " +
          (err.response?.data?.error?.message || err.message),
        "error",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev: string[]) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: title.trim(),
        shortDesc: shortDesc.trim(),
        fullDesc: fullDesc.trim(),
        whyBuilt: whyBuilt.trim(),
        lessonLearned: lessonLearned.trim(),
        status,
        timeToBuild: timeToBuild.trim(),
        category: category.trim(),
        images,
        featured,
        type,
        image: images.length > 0 ? images[0] : "", // backwards compatibility
        techStack: techStack
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        githubUrl: githubUrl.trim(),
        liveUrl: liveUrl.trim(),
        updatedAt: serverTimestamp(),
      };

      if (editId) {
        await updateDoc(doc(db, "projects", editId), payload);
        showToast(`Project "${title}" updated.`);
      } else {
        await addDoc(collection(db, "projects"), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        showToast(`Project "${title}" created.`);
      }

      // Invalidate public page in-memory cache
      invalidateContentCache();
      closeModal();
    } catch (err: any) {
      console.error(err);
      showToast("Error saving project: " + err.message, "error");
    }
  };

  const openEdit = (p: any) => {
    setEditId(p.id);
    setTitle(p.title || "");
    setShortDesc(p.shortDesc || "");
    setFullDesc(p.fullDesc || "");
    setWhyBuilt(p.whyBuilt || "");
    setLessonLearned(p.lessonLearned || "");
    setStatus(p.status || "In Progress");
    setTimeToBuild(p.timeToBuild || "");
    setCategory(p.category || "Web App");
    setImages(p.images ? p.images : p.image ? [p.image] : []);
    setFeatured(p.featured || false);
    setType(p.type || "Individual Project");
    setTechStack(p.techStack?.join(", ") || "");
    setGithubUrl(p.githubUrl || "");
    setLiveUrl(p.liveUrl || "");
    setIsModalOpen(true);
  };

  const handleDuplicate = async (p: any) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, createdAt, updatedAt, ...rest } = p;
      const duplicateData = {
        ...rest,
        title: `${p.title || "Untitled"} (Copy)`,
        status: "In Progress",
        featured: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await addDoc(collection(db, "projects"), duplicateData);
      invalidateContentCache();
      showToast(`Duplicated "${p.title}" as draft copy.`);
    } catch (err: any) {
      console.error(err);
      showToast("Failed to duplicate: " + err.message, "error");
    }
  };

  const confirmDelete = async (id: string, projectTitle: string) => {
    if (window.confirm(`Permanently delete project "${projectTitle}"?`)) {
      try {
        await deleteDoc(doc(db, "projects", id));
        invalidateContentCache();
        showToast(`Deleted "${projectTitle}".`);
      } catch (err: any) {
        showToast("Delete failed: " + err.message, "error");
      }
    }
  };

  const closeModal = () => {
    setEditId(null);
    setTitle("");
    setShortDesc("");
    setFullDesc("");
    setWhyBuilt("");
    setLessonLearned("");
    setStatus("In Progress");
    setTimeToBuild("");
    setCategory("Web App");
    setImages([]);
    setFeatured(false);
    setType("Individual Project");
    setTechStack("");
    setGithubUrl("");
    setLiveUrl("");
    setIsModalOpen(false);
  };

  // Filter projects by query and status
  const filteredProjects = projects.filter((p) => {
    if (statusFilter === "Featured" && !p.featured) return false;
    if (
      statusFilter !== "All" &&
      statusFilter !== "Featured" &&
      p.status !== statusFilter
    ) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchTitle = (p.title || "").toLowerCase().includes(q);
    const matchCategory = (p.category || "").toLowerCase().includes(q);
    const matchStack = (p.techStack || []).some((t: string) =>
      t.toLowerCase().includes(q),
    );
    return matchTitle || matchCategory || matchStack;
  });

  const countLive = projects.filter((p) => p.status === "Live").length;
  const countInProgress = projects.filter(
    (p) => p.status === "In Progress",
  ).length;
  const countFeatured = projects.filter((p) => p.featured).length;

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Projects — Studio Console</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#E5E4DE] dark:border-[#27313A]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#171F24] dark:text-[#F1F4F6]">
            Manage Projects
          </h1>
          <p className="text-xs text-[#55626F] dark:text-[#97A3AF] mt-0.5">
            {projects.length} case studies registered in Firestore
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-md text-xs font-semibold bg-[#1F51D0] dark:bg-[#4F7FF7] text-white hover:bg-[#1942AA] dark:hover:bg-[#3D6CE5] transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-[#FFFFFF] dark:bg-[#171F24] p-3.5 rounded-lg border border-[#E5E4DE] dark:border-[#27313A]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#55626F] dark:text-[#97A3AF]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, category, or tech stack..."
            className="w-full pl-9 pr-8 py-1.5 text-xs rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B] text-[#171F24] dark:text-[#F1F4F6] placeholder:text-[#55626F] dark:placeholder:text-[#97A3AF] focus:outline-none focus:ring-1 focus:ring-[#1F51D0]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#55626F] dark:text-[#97A3AF] hover:text-[#171F24] dark:hover:text-[#F1F4F6]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: "All", label: `All (${projects.length})` },
            { id: "Live", label: `Live (${countLive})` },
            { id: "In Progress", label: `In Progress (${countInProgress})` },
            { id: "Featured", label: `Featured (${countFeatured})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`text-[11px] font-mono px-2.5 py-1 rounded transition-colors cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-[#1F51D0] text-white font-semibold"
                  : "bg-[#F2F1EC] dark:bg-[#222B33] text-[#55626F] dark:text-[#97A3AF] hover:text-[#171F24] dark:hover:text-[#F1F4F6]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((p) => (
          <div
            key={p.id}
            className="bg-[#FFFFFF] dark:bg-[#171F24] rounded-lg border border-[#E5E4DE] dark:border-[#27313A] overflow-hidden flex flex-col relative group transition-colors"
          >
            {p.featured && (
              <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 bg-[#1F51D0] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-xs z-10">
                <Star className="w-2.5 h-2.5 fill-white" />
                Featured
              </span>
            )}

            {/* Thumbnail */}
            <div className="h-36 bg-[#F2F1EC] dark:bg-[#222B33] relative overflow-hidden border-b border-[#E5E4DE] dark:border-[#27313A]">
              {p.images?.length > 0 || p.image ? (
                <img
                  src={p.images?.[0] || p.image}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  alt=""
                />
              ) : (
                <div className="flex items-center justify-center h-full text-xs font-mono text-[#55626F] dark:text-[#97A3AF]">
                  No preview asset
                </div>
              )}
            </div>

            {/* Body */}
            <div className="p-5 flex-1 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-bold text-base text-[#171F24] dark:text-[#F1F4F6] line-clamp-1">
                  {p.title}
                </h2>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full flex-shrink-0 ${
                    p.status === "Live"
                      ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50"
                      : "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50"
                  }`}
                >
                  {p.status}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] font-mono text-[#55626F] dark:text-[#97A3AF]">
                <span>{p.category || "General"}</span>
                <span>·</span>
                <span>{p.type || "Individual"}</span>
              </div>

              <p className="text-xs text-[#55626F] dark:text-[#97A3AF] line-clamp-2 leading-relaxed">
                {p.shortDesc || "No short summary provided."}
              </p>

              {p.techStack?.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {p.techStack.slice(0, 3).map((t: string) => (
                    <span
                      key={t}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#F2F1EC] dark:bg-[#222B33] text-[#55626F] dark:text-[#97A3AF]"
                    >
                      {t}
                    </span>
                  ))}
                  {p.techStack.length > 3 && (
                    <span className="text-[10px] font-mono text-[#55626F] dark:text-[#97A3AF] self-center">
                      +{p.techStack.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Actions Bar */}
            <div className="border-t border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B]/50 flex divide-x divide-[#E5E4DE] dark:divide-[#27313A] text-xs">
              <a
                href={`/projects/${p.id}`}
                target="_blank"
                rel="noopener noreferrer"
                title="View on live website"
                className="flex-1 py-2.5 flex items-center justify-center space-x-1 text-[#55626F] dark:text-[#97A3AF] hover:text-[#1F51D0] dark:hover:text-[#4F7FF7] hover:bg-[#F2F1EC] dark:hover:bg-[#222B33] transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Live</span>
              </a>
              <button
                type="button"
                onClick={() => openEdit(p)}
                title="Edit project"
                className="flex-1 py-2.5 flex items-center justify-center space-x-1 text-[#1F51D0] dark:text-[#4F7FF7] hover:bg-[#F2F1EC] dark:hover:bg-[#222B33] transition-colors cursor-pointer font-medium"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => handleDuplicate(p)}
                title="Duplicate project as draft"
                className="flex-1 py-2.5 flex items-center justify-center space-x-1 text-[#55626F] dark:text-[#97A3AF] hover:text-[#171F24] dark:hover:text-[#F1F4F6] hover:bg-[#F2F1EC] dark:hover:bg-[#222B33] transition-colors cursor-pointer font-medium"
              >
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clone</span>
              </button>
              <button
                type="button"
                onClick={() => confirmDelete(p.id, p.title)}
                title="Delete project"
                className="flex-1 py-2.5 flex items-center justify-center space-x-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Del</span>
              </button>
            </div>
          </div>
        ))}

        {filteredProjects.length === 0 && (
          <div className="col-span-full text-center py-16 text-[#55626F] dark:text-[#97A3AF] bg-[#FFFFFF] dark:bg-[#171F24] rounded-lg border border-dashed border-[#E5E4DE] dark:border-[#27313A] space-y-3">
            <p className="font-mono text-sm">
              {searchQuery || statusFilter !== "All"
                ? "No projects match your filter criteria."
                : "No projects stored in Firestore database."}
            </p>
            {searchQuery || statusFilter !== "All" ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("All");
                }}
                className="text-xs font-semibold text-[#1F51D0] dark:text-[#4F7FF7] underline cursor-pointer"
              >
                Reset filters
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="text-xs font-semibold text-[#1F51D0] dark:text-[#4F7FF7] underline cursor-pointer"
              >
                Create your first project entry
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal Dialog */}
      <AnimatePresence>
        {isModalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex justify-center items-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="bg-[#FFFFFF] dark:bg-[#171F24] border border-[#E5E4DE] dark:border-[#27313A] rounded-lg max-w-4xl w-full shadow-2xl my-8 relative flex flex-col max-h-[90vh] text-[#171F24] dark:text-[#F1F4F6]"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-[#E5E4DE] dark:border-[#27313A] flex justify-between items-center sticky top-0 bg-[#FFFFFF] dark:bg-[#171F24] z-10 rounded-t-lg">
                <div>
                  <h2
                    id="project-modal-title"
                    className="text-lg font-bold text-[#171F24] dark:text-[#F1F4F6]"
                  >
                    {editId ? "Edit Project Entry" : "Create New Project"}
                  </h2>
                  <p className="text-xs text-[#55626F] dark:text-[#97A3AF]">
                    Fill in architectural context and assets
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  aria-label="Close dialog"
                  className="p-1.5 rounded-md hover:bg-[#F2F1EC] dark:hover:bg-[#222B33] text-[#55626F] dark:text-[#97A3AF] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6">
                <form
                  id="projectForm"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Title */}
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider block mb-1 text-[#171F24] dark:text-[#F1F4F6]">
                        Project Title *
                      </label>
                      <input
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Atmospheric Intelligence"
                        className="w-full px-3.5 py-2.5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B] text-sm focus:outline-none focus:ring-2 focus:ring-[#1F51D0]"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider block mb-1 text-[#171F24] dark:text-[#F1F4F6]">
                        Category *
                      </label>
                      <input
                        required
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="e.g. Commercial Platform, Application"
                        className="w-full px-3.5 py-2.5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B] text-sm focus:outline-none focus:ring-2 focus:ring-[#1F51D0]"
                      />
                    </div>

                    {/* Status */}
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider block mb-1 text-[#171F24] dark:text-[#F1F4F6]">
                        Status
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B] text-sm focus:outline-none focus:ring-2 focus:ring-[#1F51D0]"
                      >
                        <option value="Live">Live</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </div>

                    {/* Building Time */}
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider block mb-1 text-[#171F24] dark:text-[#F1F4F6]">
                        Building Time / Duration
                      </label>
                      <input
                        value={timeToBuild}
                        onChange={(e) => setTimeToBuild(e.target.value)}
                        placeholder="e.g. 4 months, 2 weeks"
                        className="w-full px-3.5 py-2.5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B] text-sm focus:outline-none focus:ring-2 focus:ring-[#1F51D0]"
                      />
                    </div>

                    {/* Project Type */}
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider block mb-1 text-[#171F24] dark:text-[#F1F4F6]">
                        Project Engagement Type
                      </label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B] text-sm focus:outline-none focus:ring-2 focus:ring-[#1F51D0]"
                      >
                        <option value="Individual Project">
                          Individual Project
                        </option>
                        <option value="Company Project">Company Project</option>
                        <option value="Freelance Project">
                          Freelance Project
                        </option>
                        <option value="Collaborative">Collaborative</option>
                        <option value="Open Source">Open Source</option>
                      </select>
                    </div>

                    {/* Featured Checkbox */}
                    <div className="flex items-center">
                      <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B] w-full">
                        <input
                          type="checkbox"
                          checked={featured}
                          onChange={(e) => setFeatured(e.target.checked)}
                          className="w-4 h-4 rounded text-[#1F51D0] focus:ring-[#1F51D0]"
                        />
                        <span className="text-xs font-medium text-[#171F24] dark:text-[#F1F4F6]">
                          Feature on Homepage Selected Work
                        </span>
                      </label>
                    </div>

                    {/* Short Description */}
                    <div className="md:col-span-2">
                      <label className="text-xs font-semibold uppercase tracking-wider block mb-1 text-[#171F24] dark:text-[#F1F4F6]">
                        Short Summary (Archive &amp; Cards) *
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={shortDesc}
                        onChange={(e) => setShortDesc(e.target.value)}
                        placeholder="Concise 1-2 sentence engineering brief..."
                        className="w-full px-3.5 py-2.5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B] text-sm focus:outline-none focus:ring-2 focus:ring-[#1F51D0]"
                      />
                    </div>

                    {/* Tech Stack */}
                    <div className="md:col-span-2">
                      <label className="text-xs font-semibold uppercase tracking-wider block mb-1 text-[#171F24] dark:text-[#F1F4F6]">
                        Tech Stack (comma separated)
                      </label>
                      <input
                        value={techStack}
                        onChange={(e) => setTechStack(e.target.value)}
                        placeholder="React 19, TypeScript, Tailwind CSS, Vite, Cloudinary..."
                        className="w-full px-3.5 py-2.5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B] text-sm focus:outline-none focus:ring-2 focus:ring-[#1F51D0]"
                      />
                    </div>

                    {/* Links */}
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider block mb-1 text-[#171F24] dark:text-[#F1F4F6]">
                        GitHub Repository URL
                      </label>
                      <input
                        type="url"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        placeholder="https://github.com/..."
                        className="w-full px-3.5 py-2.5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B] text-sm focus:outline-none focus:ring-2 focus:ring-[#1F51D0]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider block mb-1 text-[#171F24] dark:text-[#F1F4F6]">
                        Live Site URL
                      </label>
                      <input
                        type="url"
                        value={liveUrl}
                        onChange={(e) => setLiveUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3.5 py-2.5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B] text-sm focus:outline-none focus:ring-2 focus:ring-[#1F51D0]"
                      />
                    </div>

                    {/* Image Upload Area */}
                    <div className="md:col-span-2 space-y-3">
                      <label className="text-xs font-semibold uppercase tracking-wider block text-[#171F24] dark:text-[#F1F4F6]">
                        Project Screenshots &amp; Assets
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {images.map((img, idx) => (
                          <div
                            key={idx}
                            className="relative aspect-video rounded-md overflow-hidden border border-[#E5E4DE] dark:border-[#27313A] group bg-[#F2F1EC] dark:bg-[#222B33]"
                          >
                            <img
                              src={img}
                              alt={`Upload ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              aria-label="Remove image"
                              className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}

                        <label className="border-2 border-dashed border-[#E5E4DE] dark:border-[#27313A] rounded-md aspect-video flex flex-col items-center justify-center cursor-pointer hover:border-[#1F51D0] dark:hover:border-[#4F7FF7] transition-colors bg-[#FBFBFA] dark:bg-[#13171B]">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            disabled={isUploading}
                          />
                          {isUploading ? (
                            <Loader2 className="w-5 h-5 animate-spin text-[#1F51D0] dark:text-[#4F7FF7]" />
                          ) : (
                            <UploadCloud className="w-5 h-5 text-[#55626F] dark:text-[#97A3AF]" />
                          )}
                          <span className="text-[11px] font-mono text-[#55626F] dark:text-[#97A3AF] mt-1.5">
                            {isUploading ? "Uploading..." : "Add Images"}
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Deep Dive Details Section Header */}
                    <div className="md:col-span-2 pt-4 border-t border-[#E5E4DE] dark:border-[#27313A]">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-[#171F24] dark:text-[#F1F4F6]">
                        Editorial Case Study Breakdown
                      </h3>
                      <p className="text-xs text-[#55626F] dark:text-[#97A3AF]">
                        Structured case study details displayed on the single
                        project view
                      </p>
                    </div>

                    {/* Full Description */}
                    <div className="md:col-span-2">
                      <label className="text-xs font-semibold uppercase tracking-wider block mb-1 text-[#171F24] dark:text-[#F1F4F6]">
                        System Architecture &amp; Implementation Details
                      </label>
                      <textarea
                        rows={5}
                        value={fullDesc}
                        onChange={(e) => setFullDesc(e.target.value)}
                        placeholder="Comprehensive breakdown of architectural choices, challenges, and solutions..."
                        className="w-full px-3.5 py-2.5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B] text-sm focus:outline-none focus:ring-2 focus:ring-[#1F51D0]"
                      />
                    </div>

                    {/* Why I Built This */}
                    <div className="md:col-span-2">
                      <label className="text-xs font-semibold uppercase tracking-wider block mb-1 text-[#171F24] dark:text-[#F1F4F6]">
                        Project Purpose &amp; Problem Statement
                      </label>
                      <textarea
                        rows={3}
                        value={whyBuilt}
                        onChange={(e) => setWhyBuilt(e.target.value)}
                        placeholder="What concrete real-world problem or business requirement prompted this build?"
                        className="w-full px-3.5 py-2.5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B] text-sm focus:outline-none focus:ring-2 focus:ring-[#1F51D0]"
                      />
                    </div>

                    {/* Lesson Learned / Mistake */}
                    <div className="md:col-span-2">
                      <label className="text-xs font-semibold uppercase tracking-wider block mb-1 text-[#171F24] dark:text-[#F1F4F6]">
                        Engineering Trade-offs &amp; Lessons Learned
                      </label>
                      <textarea
                        rows={3}
                        value={lessonLearned}
                        onChange={(e) => setLessonLearned(e.target.value)}
                        placeholder="Technical hurdles, compromises made, or performance trade-offs experienced..."
                        className="w-full px-3.5 py-2.5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B] text-sm focus:outline-none focus:ring-2 focus:ring-[#1F51D0]"
                      />
                    </div>
                  </div>
                </form>
              </div>

              {/* Modal Footer */}
              <div className="p-5 border-t border-[#E5E4DE] dark:border-[#27313A] flex justify-end space-x-3 bg-[#FBFBFA] dark:bg-[#13171B] rounded-b-lg shrink-0">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-md text-xs font-semibold border border-[#E5E4DE] dark:border-[#27313A] hover:bg-[#F2F1EC] dark:hover:bg-[#222B33] text-[#55626F] dark:text-[#97A3AF] cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="projectForm"
                  disabled={isUploading}
                  className="px-5 py-2 rounded-md text-xs font-semibold bg-[#1F51D0] dark:bg-[#4F7FF7] text-white hover:bg-[#1942AA] dark:hover:bg-[#3D6CE5] disabled:opacity-50 cursor-pointer transition-colors shadow-xs"
                >
                  {editId ? "Update Project" : "Publish Project"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.15 }}
            className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-xl text-xs font-medium flex items-center gap-2 border ${
              toast.type === "error"
                ? "bg-red-50 dark:bg-red-950/90 text-red-800 dark:text-red-200 border-red-200 dark:border-red-900"
                : "bg-emerald-50 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-900"
            }`}
          >
            {toast.type === "error" ? (
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
            ) : (
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
