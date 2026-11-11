import React, { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import axios from "axios";
import { db } from "../../firebase/config";
import { INITIAL_BLOGS } from "../../data/blogsData";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  UploadCloud,
  Loader2,
  Image as ImageIcon,
  Copy,
  ExternalLink,
  Search,
  Check,
  AlertCircle,
  Eye,
  PenLine,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import { CodeBlock } from "../../components/CodeBlock";
import { invalidateContentCache } from "../../utils/dataCache";

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Editor mode tab: "write" vs "preview"
  const [editorMode, setEditorMode] = useState<"write" | "preview">("write");

  // Toast feedback state
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("Draft");
  const [category, setCategory] = useState("Engineering");
  const [images, setImages] = useState<any[]>([]);

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
    const unsub = onSnapshot(collection(db, "blogs"), async (snap) => {
      const firestoreData = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const existingIds = new Set(firestoreData.map((d) => d.id));

      // Merge enriched initial blogs with Firestore records
      const mergedMap = new Map<string, any>();
      INITIAL_BLOGS.forEach((b) => mergedMap.set(b.id, b));
      firestoreData.forEach((d) => {
        mergedMap.set(d.id, {
          ...(mergedMap.get(d.id) || {}),
          ...d,
        });
      });

      const allMerged = Array.from(mergedMap.values()).sort((a, b) => {
        const timeA = a.createdAt?.toDate
          ? a.createdAt.toDate().getTime()
          : a.createdAt?.seconds
            ? a.createdAt.seconds * 1000
            : 0;
        const timeB = b.createdAt?.toDate
          ? b.createdAt.toDate().getTime()
          : b.createdAt?.seconds
            ? b.createdAt.seconds * 1000
            : 0;
        return timeB - timeA;
      });

      setBlogs(allMerged);

      // Auto-populate missing initial articles to Firestore if authenticated admin
      const missing = INITIAL_BLOGS.filter((b) => !existingIds.has(b.id));
      if (missing.length > 0) {
        for (const mb of missing) {
          try {
            await setDoc(doc(db, "blogs", mb.id), {
              title: mb.title,
              category: mb.category,
              excerpt: mb.excerpt,
              content: mb.content,
              status: mb.status,
              coverImage: mb.coverImage,
              images: mb.images,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
          } catch (e) {
            console.warn("Auto-syncing article to Firestore pending:", mb.id, e);
          }
        }
      }
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
      setImages((prev: any[]) => [
        ...prev,
        ...uploadedUrls.map((url) => ({ url, alt: "" })),
      ]);
      showToast(`Uploaded ${uploadedUrls.length} header image(s).`);
    } catch (err: any) {
      console.error(err);
      showToast(
        "Upload failed: " + (err.response?.data?.error?.message || err.message),
        "error",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleContentImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      showToast("Cloudinary not configured in environment.", "error");
      setIsUploading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData,
      );

      const url = response.data.secure_url;
      const alt =
        prompt("Enter image description (alt text):") || "Article illustration";
      insertMarkdown(`![${alt}](${url})`, "");
      showToast("Inline image uploaded and markdown tag inserted.");
    } catch (err: any) {
      console.error(err);
      showToast("Inline image upload failed.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev: any[]) => prev.filter((_, i) => i !== index));
  };

  const updateImageAlt = (index: number, alt: string) => {
    setImages((prev: any[]) => {
      const newImages = [...prev];
      if (typeof newImages[index] === "string") {
        newImages[index] = { url: newImages[index], alt };
      } else {
        newImages[index] = { ...newImages[index], alt };
      }
      return newImages;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: title.trim(),
        excerpt: excerpt.trim(),
        content: content.trim(),
        status,
        images,
        category: category.trim(),
        coverImage:
          images.length > 0
            ? typeof images[0] === "string"
              ? images[0]
              : images[0].url
            : "",
        updatedAt: serverTimestamp(),
      };

      if (editId) {
        await updateDoc(doc(db, "blogs", editId), payload);
        showToast(`Article "${title}" updated.`);
      } else {
        await addDoc(collection(db, "blogs"), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        showToast(`Article "${title}" created.`);
      }

      // Invalidate public page in-memory cache
      invalidateContentCache();
      closeModal();
    } catch (err: any) {
      console.error(err);
      showToast("Error saving article: " + err.message, "error");
    }
  };

  const openEdit = (b: any) => {
    setEditId(b.id);
    setTitle(b.title || "");
    setExcerpt(b.excerpt || "");
    setContent(b.content || "");
    setStatus(b.status || "Draft");
    setImages(b.images ? b.images : b.coverImage ? [b.coverImage] : []);
    setCategory(b.category || "Engineering");
    setEditorMode("write");
    setIsModalOpen(true);
  };

  const handleDuplicate = async (b: any) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, createdAt, updatedAt, ...rest } = b;
      const duplicateData = {
        ...rest,
        title: `${b.title || "Untitled"} (Draft Copy)`,
        status: "Draft",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await addDoc(collection(db, "blogs"), duplicateData);
      invalidateContentCache();
      showToast(`Duplicated "${b.title}" as draft copy.`);
    } catch (err: any) {
      console.error(err);
      showToast("Failed to duplicate: " + err.message, "error");
    }
  };

  const confirmDelete = async (id: string, postTitle: string) => {
    if (window.confirm(`Permanently delete article "${postTitle}"?`)) {
      try {
        await deleteDoc(doc(db, "blogs", id));
        invalidateContentCache();
        showToast(`Deleted "${postTitle}".`);
      } catch (err: any) {
        showToast("Delete failed: " + err.message, "error");
      }
    }
  };

  const closeModal = () => {
    setEditId(null);
    setTitle("");
    setExcerpt("");
    setContent("");
    setStatus("Draft");
    setCategory("Engineering");
    setImages([]);
    setEditorMode("write");
    setIsModalOpen(false);
  };

  const insertMarkdown = (prefix: string, suffix: string = "") => {
    const textarea = document.getElementById(
      "blogContent",
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    const selection = text.substring(start, end);

    const newContent = before + prefix + selection + suffix + after;
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  // Filter articles
  const filteredBlogs = blogs.filter((b) => {
    if (statusFilter !== "All" && b.status !== statusFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchTitle = (b.title || "").toLowerCase().includes(q);
    const matchCategory = (b.category || "").toLowerCase().includes(q);
    const matchExcerpt = (b.excerpt || "").toLowerCase().includes(q);
    return matchTitle || matchCategory || matchExcerpt;
  });

  const countPublished = blogs.filter((b) => b.status === "Published").length;
  const countDraft = blogs.filter((b) => b.status === "Draft").length;

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Articles — Studio Console</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#E5E4DE] dark:border-[#27313A]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#171F24] dark:text-[#F1F4F6]">
            Manage Articles
          </h1>
          <p className="text-xs text-[#55626F] dark:text-[#97A3AF] mt-0.5">
            {blogs.length} engineering articles &amp; notes in Firestore
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            closeModal();
            setIsModalOpen(true);
          }}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-md text-xs font-semibold bg-[#1F51D0] dark:bg-[#4F7FF7] text-white hover:bg-[#1942AA] dark:hover:bg-[#3D6CE5] transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
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
            placeholder="Search by title, category, or summary..."
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
            { id: "All", label: `All (${blogs.length})` },
            { id: "Published", label: `Published (${countPublished})` },
            { id: "Draft", label: `Drafts (${countDraft})` },
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

      {/* Articles List */}
      <div className="space-y-3">
        {filteredBlogs.map((b) => (
          <div
            key={b.id}
            className="bg-[#FFFFFF] dark:bg-[#171F24] rounded-lg border border-[#E5E4DE] dark:border-[#27313A] overflow-hidden flex flex-col sm:flex-row transition-colors group"
          >
            {/* Thumbnail */}
            <div className="w-full sm:w-44 h-32 sm:h-auto bg-[#F2F1EC] dark:bg-[#222B33] relative shrink-0 border-b sm:border-b-0 sm:border-r border-[#E5E4DE] dark:border-[#27313A]">
              {b.images?.length > 0 || b.coverImage ? (
                <img
                  src={
                    typeof b.images?.[0] === "object"
                      ? b.images[0].url
                      : b.images?.[0] || b.coverImage
                  }
                  className="w-full h-full object-cover"
                  alt=""
                />
              ) : (
                <div className="flex items-center justify-center h-full text-xs font-mono text-[#55626F] dark:text-[#97A3AF]">
                  No cover
                </div>
              )}
            </div>

            {/* Content info */}
            <div className="p-5 flex-1 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-bold text-base text-[#171F24] dark:text-[#F1F4F6] line-clamp-1">
                  {b.title}
                </h2>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full flex-shrink-0 ${
                    b.status === "Published"
                      ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50"
                      : "bg-[#F2F1EC] dark:bg-[#222B33] text-[#55626F] dark:text-[#97A3AF] border border-[#E5E4DE] dark:border-[#27313A]"
                  }`}
                >
                  {b.status}
                </span>
              </div>

              <p className="text-xs text-[#55626F] dark:text-[#97A3AF] line-clamp-2 leading-relaxed">
                {b.excerpt || "No excerpt summary provided."}
              </p>

              <div className="flex items-center gap-2 text-[11px] font-mono text-[#55626F] dark:text-[#97A3AF] pt-1">
                <span>{b.category || "Engineering"}</span>
                {b.createdAt?.toDate && (
                  <>
                    <span>·</span>
                    <span>{b.createdAt.toDate().toLocaleDateString()}</span>
                  </>
                )}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="border-t sm:border-t-0 sm:border-l border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B]/50 flex sm:flex-col divide-x sm:divide-x-0 sm:divide-y divide-[#E5E4DE] dark:divide-[#27313A] shrink-0 text-xs sm:w-28">
              <a
                href={`/blog/${b.id}`}
                target="_blank"
                rel="noopener noreferrer"
                title="View on live website"
                className="flex-1 py-3 px-3 flex items-center justify-center space-x-1.5 text-[#55626F] dark:text-[#97A3AF] hover:text-[#1F51D0] dark:hover:text-[#4F7FF7] hover:bg-[#F2F1EC] dark:hover:bg-[#222B33] transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Live</span>
              </a>
              <button
                type="button"
                onClick={() => openEdit(b)}
                title="Edit article"
                className="flex-1 py-3 px-3 flex items-center justify-center space-x-1.5 text-[#1F51D0] dark:text-[#4F7FF7] hover:bg-[#F2F1EC] dark:hover:bg-[#222B33] transition-colors cursor-pointer font-medium"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => handleDuplicate(b)}
                title="Duplicate article as draft"
                className="flex-1 py-3 px-3 flex items-center justify-center space-x-1.5 text-[#55626F] dark:text-[#97A3AF] hover:text-[#171F24] dark:hover:text-[#F1F4F6] hover:bg-[#F2F1EC] dark:hover:bg-[#222B33] transition-colors cursor-pointer font-medium"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Clone</span>
              </button>
              <button
                type="button"
                onClick={() => confirmDelete(b.id, b.title)}
                title="Delete article"
                className="flex-1 py-3 px-3 flex items-center justify-center space-x-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Del</span>
              </button>
            </div>
          </div>
        ))}

        {filteredBlogs.length === 0 && (
          <div className="text-center py-16 text-[#55626F] dark:text-[#97A3AF] bg-[#FFFFFF] dark:bg-[#171F24] rounded-lg border border-dashed border-[#E5E4DE] dark:border-[#27313A] space-y-3">
            <p className="font-mono text-sm">
              {searchQuery || statusFilter !== "All"
                ? "No articles match your filter criteria."
                : "No articles published yet."}
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
                onClick={() => {
                  closeModal();
                  setIsModalOpen(true);
                }}
                className="text-xs font-semibold text-[#1F51D0] dark:text-[#4F7FF7] underline cursor-pointer"
              >
                Write your first engineering note
              </button>
            )}
          </div>
        )}
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="article-modal-title"
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
                    id="article-modal-title"
                    className="text-lg font-bold text-[#171F24] dark:text-[#F1F4F6]"
                  >
                    {editId ? "Edit Article" : "Write New Article"}
                  </h2>
                  <p className="text-xs text-[#55626F] dark:text-[#97A3AF]">
                    Full Markdown support with live syntax controls and preview
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  aria-label="Close editor"
                  className="p-1.5 rounded-md hover:bg-[#F2F1EC] dark:hover:bg-[#222B33] text-[#55626F] dark:text-[#97A3AF] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6">
                <form
                  id="blogForm"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Title */}
                    <div className="md:col-span-1">
                      <label className="text-xs font-semibold uppercase tracking-wider block mb-1 text-[#171F24] dark:text-[#F1F4F6]">
                        Article Title *
                      </label>
                      <input
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Scaling Core Web Vitals..."
                        className="w-full px-3.5 py-2.5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B] text-sm focus:outline-none focus:ring-2 focus:ring-[#1F51D0]"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider block mb-1 text-[#171F24] dark:text-[#F1F4F6]">
                        Category
                      </label>
                      <input
                        required
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="e.g. Engineering, Performance"
                        className="w-full px-3.5 py-2.5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B] text-sm focus:outline-none focus:ring-2 focus:ring-[#1F51D0]"
                      />
                    </div>

                    {/* Status */}
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider block mb-1 text-[#171F24] dark:text-[#F1F4F6]">
                        Publication Status
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B] text-sm focus:outline-none focus:ring-2 focus:ring-[#1F51D0]"
                      >
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </div>
                  </div>

                  {/* Header / Gallery Images */}
                  <div className="space-y-3">
                    <label className="text-xs font-semibold uppercase tracking-wider block text-[#171F24] dark:text-[#F1F4F6]">
                      Article Header Images
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FBFBFA] dark:bg-[#13171B] p-4 rounded-md border border-[#E5E4DE] dark:border-[#27313A]">
                      {images.map((img, idx) => {
                        const url = typeof img === "string" ? img : img.url;
                        const alt = typeof img === "string" ? "" : img.alt;
                        return (
                          <div
                            key={idx}
                            className="relative rounded-md overflow-hidden border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#171F24] flex flex-col group"
                          >
                            <div className="aspect-video relative">
                              <img
                                src={url}
                                alt={`Header preview ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                aria-label="Remove image"
                                className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                            <input
                              type="text"
                              placeholder="Alt description..."
                              value={alt}
                              onChange={(e) =>
                                updateImageAlt(idx, e.target.value)
                              }
                              className="text-[11px] font-mono p-1.5 w-full border-t border-[#E5E4DE] dark:border-[#27313A] bg-transparent outline-none focus:bg-[#1F51D0]/5"
                            />
                          </div>
                        );
                      })}

                      <label className="border-2 border-dashed border-[#E5E4DE] dark:border-[#27313A] rounded-md aspect-video flex flex-col items-center justify-center cursor-pointer hover:border-[#1F51D0] dark:hover:border-[#4F7FF7] transition-colors bg-[#FFFFFF] dark:bg-[#171F24]">
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
                          {isUploading ? "Uploading..." : "Add Image"}
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider block mb-1 text-[#171F24] dark:text-[#F1F4F6]">
                      Article Excerpt / Summary *
                    </label>
                    <input
                      required
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      placeholder="Brief synopsis for index archive and social metadata..."
                      className="w-full px-3.5 py-2.5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B] text-sm focus:outline-none focus:ring-2 focus:ring-[#1F51D0]"
                    />
                  </div>

                  {/* Markdown Body with [Write] / [Preview] Toggle */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-[#171F24] dark:text-[#F1F4F6]">
                          Article Body *
                        </label>
                        {/* Editor Mode Tabs */}
                        <div className="inline-flex rounded-md border border-[#E5E4DE] dark:border-[#27313A] p-0.5 bg-[#F2F1EC] dark:bg-[#222B33]">
                          <button
                            type="button"
                            onClick={() => setEditorMode("write")}
                            className={`flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                              editorMode === "write"
                                ? "bg-[#FFFFFF] dark:bg-[#171F24] text-[#171F24] dark:text-[#F1F4F6] shadow-xs"
                                : "text-[#55626F] dark:text-[#97A3AF] hover:text-[#171F24] dark:hover:text-[#F1F4F6]"
                            }`}
                          >
                            <PenLine className="w-3 h-3" />
                            <span>Write</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditorMode("preview")}
                            className={`flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                              editorMode === "preview"
                                ? "bg-[#FFFFFF] dark:bg-[#171F24] text-[#171F24] dark:text-[#F1F4F6] shadow-xs"
                                : "text-[#55626F] dark:text-[#97A3AF] hover:text-[#171F24] dark:hover:text-[#F1F4F6]"
                            }`}
                          >
                            <Eye className="w-3 h-3" />
                            <span>Preview</span>
                          </button>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-[#55626F] dark:text-[#97A3AF] hidden sm:inline">
                        GitHub Flavored Markdown
                      </span>
                    </div>

                    {editorMode === "write" ? (
                      <div>
                        {/* Toolbar */}
                        <div className="border border-[#E5E4DE] dark:border-[#27313A] rounded-t-md bg-[#F2F1EC] dark:bg-[#222B33] p-2 flex flex-wrap gap-1.5 border-b-0">
                          <button
                            type="button"
                            onClick={() => insertMarkdown("## ")}
                            className="px-2.5 py-1 bg-[#FFFFFF] dark:bg-[#171F24] hover:bg-[#FBFBFA] dark:hover:bg-[#1B2228] rounded text-xs font-bold border border-[#E5E4DE] dark:border-[#27313A] cursor-pointer"
                            title="Heading 2"
                          >
                            H2
                          </button>
                          <button
                            type="button"
                            onClick={() => insertMarkdown("### ")}
                            className="px-2.5 py-1 bg-[#FFFFFF] dark:bg-[#171F24] hover:bg-[#FBFBFA] dark:hover:bg-[#1B2228] rounded text-xs font-bold border border-[#E5E4DE] dark:border-[#27313A] cursor-pointer"
                            title="Heading 3"
                          >
                            H3
                          </button>
                          <button
                            type="button"
                            onClick={() => insertMarkdown("**", "**")}
                            className="px-2.5 py-1 bg-[#FFFFFF] dark:bg-[#171F24] hover:bg-[#FBFBFA] dark:hover:bg-[#1B2228] rounded text-xs font-bold border border-[#E5E4DE] dark:border-[#27313A] cursor-pointer"
                            title="Bold"
                          >
                            B
                          </button>
                          <button
                            type="button"
                            onClick={() => insertMarkdown("*", "*")}
                            className="px-2.5 py-1 bg-[#FFFFFF] dark:bg-[#171F24] hover:bg-[#FBFBFA] dark:hover:bg-[#1B2228] rounded text-xs italic border border-[#E5E4DE] dark:border-[#27313A] cursor-pointer"
                            title="Italic"
                          >
                            I
                          </button>
                          <button
                            type="button"
                            onClick={() => insertMarkdown("- ")}
                            className="px-2.5 py-1 bg-[#FFFFFF] dark:bg-[#171F24] hover:bg-[#FBFBFA] dark:hover:bg-[#1B2228] rounded text-xs border border-[#E5E4DE] dark:border-[#27313A] cursor-pointer"
                            title="Bullet list"
                          >
                            List
                          </button>
                          <button
                            type="button"
                            onClick={() => insertMarkdown("[", "](https://)")}
                            className="px-2.5 py-1 bg-[#FFFFFF] dark:bg-[#171F24] hover:bg-[#FBFBFA] dark:hover:bg-[#1B2228] rounded text-xs border border-[#E5E4DE] dark:border-[#27313A] cursor-pointer"
                            title="Link"
                          >
                            Link
                          </button>
                          <button
                            type="button"
                            onClick={() => insertMarkdown("> ")}
                            className="px-2.5 py-1 bg-[#FFFFFF] dark:bg-[#171F24] hover:bg-[#FBFBFA] dark:hover:bg-[#1B2228] rounded text-xs border border-[#E5E4DE] dark:border-[#27313A] cursor-pointer"
                            title="Blockquote"
                          >
                            Quote
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              insertMarkdown("```typescript\n", "\n```")
                            }
                            className="px-2.5 py-1 bg-[#FFFFFF] dark:bg-[#171F24] hover:bg-[#FBFBFA] dark:hover:bg-[#1B2228] rounded text-xs font-mono border border-[#E5E4DE] dark:border-[#27313A] cursor-pointer"
                            title="Code block"
                          >
                            &lt;/&gt;
                          </button>

                          <label className="px-2.5 py-1 bg-[#FFFFFF] dark:bg-[#171F24] hover:bg-[#FBFBFA] dark:hover:bg-[#1B2228] rounded text-xs border border-[#E5E4DE] dark:border-[#27313A] cursor-pointer flex items-center gap-1.5 ml-auto">
                            {isUploading ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1F51D0] dark:text-[#4F7FF7]" />
                            ) : (
                              <ImageIcon className="w-3.5 h-3.5" />
                            )}
                            <span>
                              {isUploading
                                ? "Uploading..."
                                : "Insert Inline Image"}
                            </span>
                            <input
                              type="file"
                              hidden
                              accept="image/*"
                              onChange={handleContentImageUpload}
                              disabled={isUploading}
                            />
                          </label>
                        </div>

                        <textarea
                          id="blogContent"
                          required
                          rows={14}
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          placeholder="# Write your article here in markdown..."
                          className="w-full border border-[#E5E4DE] dark:border-[#27313A] rounded-b-md p-4 bg-[#FBFBFA] dark:bg-[#13171B] font-mono text-sm leading-relaxed outline-none focus:ring-2 focus:ring-[#1F51D0] text-[#171F24] dark:text-[#F1F4F6]"
                        />
                      </div>
                    ) : (
                      <div className="border border-[#E5E4DE] dark:border-[#27313A] rounded-md p-6 bg-[#FBFBFA] dark:bg-[#13171B] min-h-[360px] max-h-[500px] overflow-y-auto">
                        {content.trim() ? (
                          <div className="prose prose-sm dark:prose-invert max-w-none text-[#171F24] dark:text-[#F1F4F6] space-y-4">
                            <ReactMarkdown
                              components={{
                                code: CodeBlock,
                                h1: ({ children }) => (
                                  <h1 className="text-xl font-bold border-b border-[#E5E4DE] dark:border-[#27313A] pb-2 mt-4 mb-3">
                                    {children}
                                  </h1>
                                ),
                                h2: ({ children }) => (
                                  <h2 className="text-lg font-bold border-b border-[#E5E4DE] dark:border-[#27313A] pb-1 mt-6 mb-2">
                                    {children}
                                  </h2>
                                ),
                                h3: ({ children }) => (
                                  <h3 className="text-base font-semibold mt-4 mb-2">
                                    {children}
                                  </h3>
                                ),
                                p: ({ children }) => (
                                  <p className="leading-relaxed text-sm mb-3">
                                    {children}
                                  </p>
                                ),
                                ul: ({ children }) => (
                                  <ul className="list-disc pl-5 space-y-1 text-sm mb-3">
                                    {children}
                                  </ul>
                                ),
                                ol: ({ children }) => (
                                  <ol className="list-decimal pl-5 space-y-1 text-sm mb-3">
                                    {children}
                                  </ol>
                                ),
                                blockquote: ({ children }) => (
                                  <blockquote className="border-l-4 border-[#1F51D0] pl-4 italic text-[#55626F] dark:text-[#97A3AF] my-4">
                                    {children}
                                  </blockquote>
                                ),
                                img: ({ src, alt }) => (
                                  <img
                                    src={src}
                                    alt={alt}
                                    className="rounded-lg border border-[#E5E4DE] dark:border-[#27313A] max-h-96 mx-auto my-4"
                                  />
                                ),
                              }}
                            >
                              {content}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <div className="text-center py-12 text-[#55626F] dark:text-[#97A3AF] font-mono text-xs">
                            Nothing to preview yet. Switch back to
                            &ldquo;Write&rdquo; to draft content.
                          </div>
                        )}
                      </div>
                    )}
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
                  form="blogForm"
                  disabled={isUploading}
                  className="px-5 py-2 rounded-md text-xs font-semibold bg-[#1F51D0] dark:bg-[#4F7FF7] text-white hover:bg-[#1942AA] dark:hover:bg-[#3D6CE5] disabled:opacity-50 cursor-pointer transition-colors shadow-xs"
                >
                  {editId ? "Update Article" : "Publish Article"}
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
