import React, { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  writeBatch,
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
  ExternalLink,
  Search,
  Check,
  AlertCircle,
  ListOrdered,
  ArrowUp,
  ArrowDown,
  ChevronUp,
  ChevronDown,
  Save,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { invalidateContentCache } from "../../utils/dataCache";
import { extractMainTechs } from "../../utils/techUtils";

const CURATED_DEFAULT_ORDER: Record<string, number> = {
  MflCmhqBMJ5PDrz6H2DD: 1, // Atmospheric Intelligence
  "8CQMnDasKgNgV38huMuj": 2, // Fixxable
  TCxzhTSYCxuBr9q7EJUf: 3, // Auction Solicitor
  "0lqZjvslmHJncTTadAfw": 4, // Meridian Law Group
  Z8kfLosbaaFhg7QnhCv5: 5, // Webphoria
  b2L9FLiEVqPEPu99vFFM: 6, // Cosmetic Claims
  "6JQheDhQU2rDolV5YAa3": 7, // Study Tracker
  nxLXiGygVfYOuHQi4ftM: 8, // My Auction Lawyer
  ocU78f4RZ0bUpFE1uZha: 9, // Lease Lawyer
  "1xUxXzNbDPGVBrSkL8EV": 10, // Slinkup
  TmAGAucYY1nIvtbNRVE0: 11, // Royal Reserve
  AhtWy6o1sXQDjs820Os8: 12, // E-Shop
};

export const getEffectiveOrder = (p: any): number => {
  if (typeof p.order === "number") return p.order;
  if (CURATED_DEFAULT_ORDER[p.id]) return CURATED_DEFAULT_ORDER[p.id];
  return 999;
};

export default function AdminProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Manual Archive Reorder Modal State
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [reorderList, setReorderList] = useState<any[]>([]);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  // Homepage & Hero Showcase Modal State
  const [isHomeFeaturedModalOpen, setIsHomeFeaturedModalOpen] = useState(false);
  const [homeFeaturedList, setHomeFeaturedList] = useState<any[]>([]);
  const [heroProjectId, setHeroProjectId] = useState<string>("");
  const [isSavingHomeOrder, setIsSavingHomeOrder] = useState(false);

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
  const [isHero, setIsHero] = useState(false);
  const [homeOrder, setHomeOrder] = useState<number | "">("");
  const [type, setType] = useState("Individual Project");
  const [order, setOrder] = useState<number | "">("");

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
      data.sort((a, b) => getEffectiveOrder(a) - getEffectiveOrder(b));
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
        isHero,
        homeOrder: homeOrder === "" ? null : Number(homeOrder),
        type,
        order: order === "" ? null : Number(order),
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
    setIsHero(p.isHero || false);
    setHomeOrder(typeof p.homeOrder === "number" ? p.homeOrder : "");
    setType(p.type || "Individual Project");
    setOrder(typeof p.order === "number" ? p.order : "");
    setTechStack(p.techStack?.join(", ") || "");
    setGithubUrl(p.githubUrl || "");
    setLiveUrl(p.liveUrl || "");
    setIsModalOpen(true);
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
    setIsHero(false);
    setHomeOrder("");
    setType("Individual Project");
    setTechStack("");
    setGithubUrl("");
    setLiveUrl("");
    setOrder("");
    setIsModalOpen(false);
  };

  // Archive Reorder Modal Actions
  const openReorderModal = () => {
    const sorted = [...projects].sort(
      (a, b) => getEffectiveOrder(a) - getEffectiveOrder(b),
    );
    setReorderList(sorted);
    setIsOrderModalOpen(true);
  };

  const moveInModal = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= reorderList.length) return;
    const nextList = [...reorderList];
    const temp = nextList[index];
    nextList[index] = nextList[target];
    nextList[target] = temp;
    setReorderList(nextList);
  };

  const resetToCuratedDefault = () => {
    const reset = [...projects].sort((a, b) => {
      const oA = CURATED_DEFAULT_ORDER[a.id] ?? 999;
      const oB = CURATED_DEFAULT_ORDER[b.id] ?? 999;
      return oA - oB;
    });
    setReorderList(reset);
  };

  const handleSaveBatchOrder = async () => {
    setIsSavingOrder(true);
    try {
      const batch = writeBatch(db);
      reorderList.forEach((item, index) => {
        const docRef = doc(db, "projects", item.id);
        batch.update(docRef, {
          order: index + 1,
          updatedAt: serverTimestamp(),
        });
      });
      await batch.commit();
      invalidateContentCache();
      showToast(`Saved manual order for all ${reorderList.length} projects.`);
      setIsOrderModalOpen(false);
    } catch (err: any) {
      console.error("Batch order save error:", err);
      showToast("Failed to save order: " + err.message, "error");
    } finally {
      setIsSavingOrder(false);
    }
  };

  // Quick swap from project card on archive order
  const handleQuickShift = async (
    projectId: string,
    direction: "up" | "down",
  ) => {
    const sorted = [...projects].sort(
      (a, b) => getEffectiveOrder(a) - getEffectiveOrder(b),
    );
    const currentIndex = sorted.findIndex((p) => p.id === projectId);
    if (currentIndex === -1) return;
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    const itemA = sorted[currentIndex];
    const itemB = sorted[targetIndex];

    sorted[currentIndex] = itemB;
    sorted[targetIndex] = itemA;

    try {
      const batch = writeBatch(db);
      sorted.forEach((p, index) => {
        batch.update(doc(db, "projects", p.id), {
          order: index + 1,
          updatedAt: serverTimestamp(),
        });
      });
      await batch.commit();
      invalidateContentCache();
      showToast(
        `Swapped position of "${itemA.title}" to #${targetIndex + 1}.`,
      );
    } catch (err: any) {
      console.error("Quick shift error:", err);
      showToast("Failed to reorder: " + err.message, "error");
    }
  };

  // -------------------------------------------------------------
  // Homepage & Hero Showcase Modal Actions
  // -------------------------------------------------------------
  const openHomeFeaturedModal = () => {
    // Current hero
    const currentHero =
      projects.find((p) => p.isHero)?.id ||
      projects.find((p) => p.id === "MflCmhqBMJ5PDrz6H2DD")?.id ||
      projects[0]?.id ||
      "";
    setHeroProjectId(currentHero);

    // Current featured projects on homepage (strictly excluding the hero project)
    const featuredList = projects
      .filter((p) => p.featured && p.id !== currentHero)
      .sort(
        (a, b) =>
          (typeof a.homeOrder === "number" ? a.homeOrder : 99) -
          (typeof b.homeOrder === "number" ? b.homeOrder : 99),
      );

    if (featuredList.length >= 2) {
      setHomeFeaturedList(featuredList);
    } else {
      // Preload curated featured case studies (excluding Atmospheric hero)
      const defaultIds = [
        "8CQMnDasKgNgV38huMuj", // Fixxable
        "TCxzhTSYCxuBr9q7EJUf", // Auction Solicitor
        "0lqZjvslmHJncTTadAfw", // Meridian Law Group
        "Z8kfLosbaaFhg7QnhCv5", // Webphoria
      ];
      const defaults = defaultIds
        .map((id) => projects.find((p) => p.id === id))
        .filter(Boolean);
      setHomeFeaturedList(defaults);
    }

    setIsHomeFeaturedModalOpen(true);
  };

  const moveHomeInModal = (index: number, direction: "up" | "down") => {
    const list = homeFeaturedList.filter((p) => p.id !== heroProjectId);
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= list.length) return;
    const nextList = [...list];
    const temp = nextList[index];
    nextList[index] = nextList[target];
    nextList[target] = temp;
    setHomeFeaturedList(nextList);
  };

  const removeFromHomeFeatured = (id: string) => {
    const list = homeFeaturedList.filter(
      (p) => p.id !== heroProjectId && p.id !== id,
    );
    if (list.length < 1) {
      showToast("Keep at least 1 project in the homepage showcase.", "error");
      return;
    }
    setHomeFeaturedList(list);
  };

  const addToHomeFeatured = (p: any) => {
    if (p.id === heroProjectId) return;
    if (homeFeaturedList.some((item) => item.id === p.id)) return;
    setHomeFeaturedList((prev) => [
      ...prev.filter((item) => item.id !== heroProjectId),
      p,
    ]);
  };

  const handleSetHeroInModal = (id: string) => {
    setHeroProjectId(id);
    // Remove newly selected hero from the home featured list so its feature image is never duplicated
    setHomeFeaturedList((prev) => prev.filter((p) => p.id !== id));
  };

  const resetHomeShowcaseDefaults = () => {
    const defaultHero = "MflCmhqBMJ5PDrz6H2DD"; // Atmospheric (Hero)
    setHeroProjectId(defaultHero);
    const defaultIds = [
      "8CQMnDasKgNgV38huMuj", // Fixxable
      "TCxzhTSYCxuBr9q7EJUf", // Auction Solicitor
      "0lqZjvslmHJncTTadAfw", // Meridian Law Group
      "Z8kfLosbaaFhg7QnhCv5", // Webphoria
    ];
    const defaults = defaultIds
      .map((id) => projects.find((p) => p.id === id))
      .filter(Boolean);
    setHomeFeaturedList(defaults);
  };

  const handleSaveHomeShowcase = async () => {
    setIsSavingHomeOrder(true);
    try {
      const batch = writeBatch(db);
      const sanitizedFeatured = homeFeaturedList.filter(
        (p) => p.id !== heroProjectId,
      );
      const featuredIds = new Set(sanitizedFeatured.map((p) => p.id));

      // 1. Update the Hero project (exclusive to Hero section)
      if (heroProjectId) {
        const heroRef = doc(db, "projects", heroProjectId);
        batch.update(heroRef, {
          isHero: true,
          featured: false,
          homeOrder: null,
          updatedAt: serverTimestamp(),
        });
      }

      // 2. Update featured case studies (Selected Case Studies)
      sanitizedFeatured.forEach((item, index) => {
        const docRef = doc(db, "projects", item.id);
        batch.update(docRef, {
          featured: true,
          isHero: false,
          homeOrder: index + 1,
          updatedAt: serverTimestamp(),
        });
      });

      // 3. Update non-featured, non-hero projects
      projects.forEach((item) => {
        if (!featuredIds.has(item.id) && item.id !== heroProjectId) {
          const docRef = doc(db, "projects", item.id);
          batch.update(docRef, {
            featured: false,
            isHero: false,
            homeOrder: null,
            updatedAt: serverTimestamp(),
          });
        }
      });

      await batch.commit();
      invalidateContentCache();
      showToast(
        `Homepage & Hero showcase updated (${sanitizedFeatured.length} case studies + Hero).`,
      );
      setIsHomeFeaturedModalOpen(false);
    } catch (err: any) {
      console.error("Save home showcase error:", err);
      showToast("Failed to save homepage showcase: " + err.message, "error");
    } finally {
      setIsSavingHomeOrder(false);
    }
  };

  // Filter projects by query and status
  const filteredProjects = projects.filter((p) => {
    if (statusFilter === "Featured" && !p.featured && !p.isHero) return false;
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
  const countFeatured = projects.filter((p) => p.featured || p.isHero).length;

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
            {projects.length} case studies registered &bull; Ordered #1 to #
            {projects.length}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Homepage & Hero Showcase Manager */}
          <button
            type="button"
            onClick={openHomeFeaturedModal}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-md text-xs font-semibold border border-[#1F51D0]/30 dark:border-[#4F7FF7]/30 bg-[#1F51D0]/10 text-[#1F51D0] dark:text-[#4F7FF7] hover:bg-[#1F51D0]/20 transition-colors cursor-pointer shadow-xs"
          >
            <Sparkles className="w-4 h-4" />
            <span>
              Homepage &amp; Hero (
              {projects.filter((p) => p.featured || p.isHero).length})
            </span>
          </button>

          {/* Manual Archive Order Trigger */}
          <button
            type="button"
            onClick={openReorderModal}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-md text-xs font-semibold border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#171F24] text-[#171F24] dark:text-[#F1F4F6] hover:bg-[#F2F1EC] dark:hover:bg-[#222B33] transition-colors cursor-pointer shadow-xs"
          >
            <ListOrdered className="w-4 h-4 text-[#1F51D0] dark:text-[#4F7FF7]" />
            <span>Archive Order</span>
          </button>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-md text-xs font-semibold bg-[#1F51D0] dark:bg-[#4F7FF7] text-white hover:bg-[#1942AA] dark:hover:bg-[#3D6CE5] transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Project</span>
          </button>
        </div>
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
        {filteredProjects.map((p, index) => {
          const currentOrder = getEffectiveOrder(p);
          return (
            <div
              key={p.id}
              className="bg-[#FFFFFF] dark:bg-[#171F24] rounded-lg border border-[#E5E4DE] dark:border-[#27313A] overflow-hidden flex flex-col relative group transition-colors"
            >
              {/* Thumbnail with Quick Order Badge & Placement Tags */}
              <div className="h-36 bg-[#F2F1EC] dark:bg-[#222B33] relative overflow-hidden border-b border-[#E5E4DE] dark:border-[#27313A]">
                {/* Archive Order Badge & Shift Controls */}
                <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 bg-[#171F24]/90 dark:bg-[#F1F4F6]/90 text-white dark:text-[#171F24] pl-2 pr-1 py-1 rounded text-xs font-mono font-bold shadow-xs border border-white/10 dark:border-black/10">
                  <span>#{currentOrder}</span>
                  <div className="flex flex-col ml-1 border-l border-white/20 dark:border-black/20 pl-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickShift(p.id, "up");
                      }}
                      title="Move up in archive display order"
                      className="hover:text-[#4F7FF7] dark:hover:text-[#1F51D0] p-0.5 leading-none cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
                    >
                      <ChevronUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={index === filteredProjects.length - 1}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickShift(p.id, "down");
                      }}
                      title="Move down in archive display order"
                      className="hover:text-[#4F7FF7] dark:hover:text-[#1F51D0] p-0.5 leading-none cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Hero / Homepage Featured Badges */}
                <div className="absolute top-2.5 right-2.5 z-10 flex flex-col items-end gap-1">
                  {p.isHero ? (
                    <span className="inline-flex items-center gap-1 bg-purple-600 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-xs">
                      <Sparkles className="w-2.5 h-2.5 fill-white" />
                      Hero Showcase
                    </span>
                  ) : p.featured ? (
                    <span className="inline-flex items-center gap-1 bg-[#1F51D0] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-xs">
                      <Star className="w-2.5 h-2.5 fill-white" />
                      Home #{p.homeOrder ?? 1}
                    </span>
                  ) : null}
                </div>

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

                {/* Main Techs only */}
                {(() => {
                  const mainTechs = extractMainTechs(p.techStack);
                  if (mainTechs.length === 0) return null;
                  return (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {mainTechs.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#F2F1EC] dark:bg-[#222B33] text-[#55626F] dark:text-[#97A3AF]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Actions Bar (Clone removed) */}
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
                  onClick={() => confirmDelete(p.id, p.title)}
                  title="Delete project"
                  className="flex-1 py-2.5 flex items-center justify-center space-x-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          );
        })}

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
                className="text-xs font-mono text-[#1F51D0] dark:text-[#4F7FF7] underline cursor-pointer"
              >
                Clear Filters
              </button>
            ) : null}
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Homepage & Hero Showcase Manager Modal */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {isHomeFeaturedModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex justify-center items-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-[#FFFFFF] dark:bg-[#171F24] border border-[#E5E4DE] dark:border-[#27313A] rounded-lg max-w-2xl w-full shadow-2xl my-8 relative flex flex-col max-h-[85vh] text-[#171F24] dark:text-[#F1F4F6]"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-[#E5E4DE] dark:border-[#27313A] flex justify-between items-center sticky top-0 bg-[#FFFFFF] dark:bg-[#171F24] z-10 rounded-t-lg">
                <div>
                  <h2 className="text-base font-bold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#1F51D0] dark:text-[#4F7FF7]" />
                    <span>Homepage &amp; Hero Showcase Manager</span>
                  </h2>
                  <p className="text-xs text-[#55626F] dark:text-[#97A3AF] mt-0.5">
                    Designate your flagship Hero project and arrange the exact
                    order of Selected Case Studies on the homepage.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsHomeFeaturedModalOpen(false)}
                  className="p-1.5 rounded-md hover:bg-[#F2F1EC] dark:hover:bg-[#222B33] text-[#55626F] dark:text-[#97A3AF] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 overflow-y-auto space-y-6 flex-1">
                {/* Hero Showcase Highlight Banner */}
                <div className="p-4 rounded-lg border-2 border-purple-500/40 bg-purple-50/50 dark:bg-purple-950/20 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Hero Section Flagship Project</span>
                      </span>
                      <p className="text-[11px] text-[#55626F] dark:text-[#97A3AF] mt-0.5">
                        Appears exclusively in the top hero header. Not duplicated in the Selected Case Studies list below.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <label className="text-[11px] font-mono font-medium text-purple-700 dark:text-purple-300 whitespace-nowrap">
                        Change Hero:
                      </label>
                      <select
                        value={heroProjectId}
                        onChange={(e) => handleSetHeroInModal(e.target.value)}
                        className="px-2.5 py-1 rounded-md border border-purple-300 dark:border-purple-800 bg-white dark:bg-[#171F24] text-xs font-medium text-[#171F24] dark:text-[#F1F4F6] focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
                      >
                        {projects.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {(() => {
                    const hero = projects.find((p) => p.id === heroProjectId);
                    if (!hero) return null;
                    return (
                      <div className="flex items-center justify-between p-2.5 rounded-md bg-white dark:bg-[#171F24] border border-purple-200 dark:border-purple-900/50 gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-8 rounded bg-[#F2F1EC] dark:bg-[#222B33] overflow-hidden shrink-0 border border-[#E5E4DE] dark:border-[#27313A]">
                            <img
                              src={hero.images?.[0] || hero.image}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold truncate text-[#171F24] dark:text-[#F1F4F6]">
                              {hero.title}
                            </p>
                            <p className="text-[10px] font-mono text-[#55626F] dark:text-[#97A3AF]">
                              {hero.category} &bull;{" "}
                              {extractMainTechs(hero.techStack).join(", ") ||
                                "Web App"}
                            </p>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-600 text-white shrink-0">
                          Active Hero
                        </span>
                      </div>
                    );
                  })()}
                </div>

                {/* Homepage Selected Projects Ordering */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#171F24] dark:text-[#F1F4F6]">
                      Selected Case Studies Order ({homeFeaturedList.filter((p) => p.id !== heroProjectId).length} projects)
                    </h3>
                    <span className="text-[11px] font-mono text-[#55626F] dark:text-[#97A3AF]">
                      Top item appears first in Selected Work
                    </span>
                  </div>

                  <div className="space-y-2">
                    {homeFeaturedList
                      .filter((item) => item.id !== heroProjectId)
                      .map((item, idx, arr) => {
                        return (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-3 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B] transition-colors gap-3"
                          >
                            {/* Position Badge & Item Details */}
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="font-mono text-xs font-bold w-7 h-7 rounded-md bg-[#171F24] dark:bg-[#F1F4F6] text-white dark:text-[#171F24] flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>

                              <div className="w-12 h-8 rounded bg-[#F2F1EC] dark:bg-[#222B33] overflow-hidden shrink-0 border border-[#E5E4DE] dark:border-[#27313A]">
                                <img
                                  src={item.images?.[0] || item.image}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              <div className="min-w-0">
                                <p className="text-xs font-bold truncate text-[#171F24] dark:text-[#F1F4F6]">
                                  {item.title}
                                </p>
                                <p className="text-[10px] font-mono text-[#55626F] dark:text-[#97A3AF]">
                                  {extractMainTechs(item.techStack).join(", ") ||
                                    item.category}
                                </p>
                              </div>
                            </div>

                            {/* Quick Action Controls */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleSetHeroInModal(item.id)}
                                className="text-[10px] font-mono font-semibold px-2 py-1 rounded border border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/50 cursor-pointer"
                                title="Set as Hero preview project"
                              >
                                Make Hero
                              </button>

                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => moveHomeInModal(idx, "up")}
                                className="p-1.5 rounded border border-[#E5E4DE] dark:border-[#27313A] bg-white dark:bg-[#171F24] text-[#55626F] dark:text-[#97A3AF] hover:text-[#1F51D0] dark:hover:text-[#4F7FF7] hover:bg-[#F2F1EC] dark:hover:bg-[#222B33] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                                title="Move Up in Homepage Order"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === arr.length - 1}
                                onClick={() => moveHomeInModal(idx, "down")}
                                className="p-1.5 rounded border border-[#E5E4DE] dark:border-[#27313A] bg-white dark:bg-[#171F24] text-[#55626F] dark:text-[#97A3AF] hover:text-[#1F51D0] dark:hover:text-[#4F7FF7] hover:bg-[#F2F1EC] dark:hover:bg-[#222B33] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                                title="Move Down in Homepage Order"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeFromHomeFeatured(item.id)}
                                className="p-1.5 rounded border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                                title="Remove from Homepage"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Add Projects to Homepage Showcase */}
                {projects.filter(
                  (p) =>
                    p.id !== heroProjectId &&
                    !homeFeaturedList.some((item) => item.id === p.id),
                ).length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-dashed border-[#E5E4DE] dark:border-[#27313A]">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#55626F] dark:text-[#97A3AF] block">
                      Add other projects to homepage showcase:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {projects
                        .filter(
                          (p) =>
                            p.id !== heroProjectId &&
                            !homeFeaturedList.some((item) => item.id === p.id),
                        )
                        .map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => addToHomeFeatured(p)}
                            className="text-xs font-mono px-2.5 py-1.5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#1B2228] text-[#171F24] dark:text-[#F1F4F6] hover:border-[#1F51D0] dark:hover:border-[#4F7FF7] transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <Plus className="w-3 h-3 text-[#1F51D0] dark:text-[#4F7FF7]" />
                            <span>{p.title}</span>
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-[#E5E4DE] dark:border-[#27313A] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FBFBFA] dark:bg-[#13171B] rounded-b-lg shrink-0">
                <button
                  type="button"
                  onClick={resetHomeShowcaseDefaults}
                  className="text-xs font-mono text-[#55626F] dark:text-[#97A3AF] hover:text-[#171F24] dark:hover:text-[#F1F4F6] underline cursor-pointer"
                >
                  Reset to Curated Default Showcase
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsHomeFeaturedModalOpen(false)}
                    className="px-3.5 py-2 rounded-md text-xs font-semibold border border-[#E5E4DE] dark:border-[#27313A] text-[#55626F] dark:text-[#97A3AF] hover:bg-[#F2F1EC] dark:hover:bg-[#222B33] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isSavingHomeOrder}
                    onClick={handleSaveHomeShowcase}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold bg-[#1F51D0] dark:bg-[#4F7FF7] text-white hover:bg-[#1942AA] dark:hover:bg-[#3D6CE5] disabled:opacity-50 cursor-pointer shadow-xs"
                  >
                    {isSavingHomeOrder ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving Showcase...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Homepage &amp; Hero Order</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------- */}
      {/* Manual Archive Reorder Modal */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {isOrderModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex justify-center items-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-[#FFFFFF] dark:bg-[#171F24] border border-[#E5E4DE] dark:border-[#27313A] rounded-lg max-w-2xl w-full shadow-2xl my-8 relative flex flex-col max-h-[85vh] text-[#171F24] dark:text-[#F1F4F6]"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-[#E5E4DE] dark:border-[#27313A] flex justify-between items-center sticky top-0 bg-[#FFFFFF] dark:bg-[#171F24] z-10 rounded-t-lg">
                <div>
                  <h2 className="text-base font-bold flex items-center gap-2">
                    <ListOrdered className="w-4 h-4 text-[#1F51D0] dark:text-[#4F7FF7]" />
                    <span>Manual Archive Project Ordering</span>
                  </h2>
                  <p className="text-xs text-[#55626F] dark:text-[#97A3AF] mt-0.5">
                    Move projects up/down to configure the sequence on your
                    archive portfolio (#01 – #{reorderList.length}).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(false)}
                  className="p-1.5 rounded-md hover:bg-[#F2F1EC] dark:hover:bg-[#222B33] text-[#55626F] dark:text-[#97A3AF] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Order List */}
              <div className="p-5 overflow-y-auto space-y-2 flex-1">
                {reorderList.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B] hover:border-[#1F51D0]/30 transition-colors gap-3"
                  >
                    {/* Index Badge & Details */}
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-mono text-xs font-bold w-7 h-7 rounded-md bg-[#171F24] dark:bg-[#F1F4F6] text-white dark:text-[#171F24] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>

                      {/* Thumbnail Preview */}
                      <div className="w-12 h-8 rounded bg-[#F2F1EC] dark:bg-[#222B33] overflow-hidden shrink-0 border border-[#E5E4DE] dark:border-[#27313A]">
                        {item.images?.[0] || item.image ? (
                          <img
                            src={item.images?.[0] || item.image}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : null}
                      </div>

                      {/* Title & Metadata */}
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate text-[#171F24] dark:text-[#F1F4F6]">
                          {item.title}
                        </p>
                        <p className="text-[10px] font-mono text-[#55626F] dark:text-[#97A3AF]">
                          {item.category || "General"} &bull;{" "}
                          <span
                            className={
                              item.status === "Live"
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-amber-600 dark:text-amber-400"
                            }
                          >
                            {item.status || "Live"}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Move Up / Down controls */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveInModal(idx, "up")}
                        className="p-1.5 rounded border border-[#E5E4DE] dark:border-[#27313A] bg-white dark:bg-[#171F24] text-[#55626F] dark:text-[#97A3AF] hover:text-[#1F51D0] dark:hover:text-[#4F7FF7] hover:bg-[#F2F1EC] dark:hover:bg-[#222B33] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === reorderList.length - 1}
                        onClick={() => moveInModal(idx, "down")}
                        className="p-1.5 rounded border border-[#E5E4DE] dark:border-[#27313A] bg-white dark:bg-[#171F24] text-[#55626F] dark:text-[#97A3AF] hover:text-[#1F51D0] dark:hover:text-[#4F7FF7] hover:bg-[#F2F1EC] dark:hover:bg-[#222B33] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-[#E5E4DE] dark:border-[#27313A] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FBFBFA] dark:bg-[#13171B] rounded-b-lg shrink-0">
                <button
                  type="button"
                  onClick={resetToCuratedDefault}
                  className="text-xs font-mono text-[#55626F] dark:text-[#97A3AF] hover:text-[#171F24] dark:hover:text-[#F1F4F6] underline cursor-pointer"
                >
                  Reset to Curated Default
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsOrderModalOpen(false)}
                    className="px-3.5 py-2 rounded-md text-xs font-semibold border border-[#E5E4DE] dark:border-[#27313A] text-[#55626F] dark:text-[#97A3AF] hover:bg-[#F2F1EC] dark:hover:bg-[#222B33] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isSavingOrder}
                    onClick={handleSaveBatchOrder}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold bg-[#1F51D0] dark:bg-[#4F7FF7] text-white hover:bg-[#1942AA] dark:hover:bg-[#3D6CE5] disabled:opacity-50 cursor-pointer shadow-xs"
                  >
                    {isSavingOrder ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Archive Order</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------- */}
      {/* Edit / Create Project Modal */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex justify-center items-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-[#FFFFFF] dark:bg-[#171F24] border border-[#E5E4DE] dark:border-[#27313A] rounded-lg max-w-4xl w-full shadow-2xl my-8 relative flex flex-col max-h-[90vh] text-[#171F24] dark:text-[#F1F4F6]"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-[#E5E4DE] dark:border-[#27313A] flex justify-between items-center sticky top-0 bg-[#FFFFFF] dark:bg-[#171F24] z-10 rounded-t-lg">
                <div>
                  <h2 className="text-lg font-bold">
                    {editId ? "Edit Project" : "Create New Project"}
                  </h2>
                  <p className="text-xs text-[#55626F] dark:text-[#97A3AF]">
                    Document engineering decisions, deliverables, and system
                    architecture.
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

                    {/* Display Order Priority (Archive Page) */}
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider block mb-1 text-[#171F24] dark:text-[#F1F4F6]">
                        Archive Order Priority (#1 – #12)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="99"
                        value={order}
                        onChange={(e) =>
                          setOrder(
                            e.target.value === ""
                              ? ""
                              : parseInt(e.target.value, 10),
                          )
                        }
                        placeholder="e.g. 1"
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

                    {/* Homepage & Hero Placement Options */}
                    <div className="md:col-span-2 space-y-3 p-3.5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B]">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={featured}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setFeatured(checked);
                              if (checked) setIsHero(false);
                            }}
                            className="rounded border-[#E5E4DE] dark:border-[#27313A] text-[#1F51D0] focus:ring-[#1F51D0] w-4 h-4 cursor-pointer"
                          />
                          <div>
                            <span className="text-xs font-semibold text-[#171F24] dark:text-[#F1F4F6] block">
                              Feature on Homepage Selected Work
                            </span>
                            <span className="text-[11px] text-[#55626F] dark:text-[#97A3AF] block">
                              Displays in the Selected Case Studies grid
                            </span>
                          </div>
                        </label>

                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isHero}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setIsHero(checked);
                              if (checked) setFeatured(false);
                            }}
                            className="rounded border-[#E5E4DE] dark:border-[#27313A] text-purple-600 focus:ring-purple-600 w-4 h-4 cursor-pointer"
                          />
                          <div>
                            <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 block">
                              ★ Flagship Hero Showcase Project
                            </span>
                            <span className="text-[11px] text-[#55626F] dark:text-[#97A3AF] block">
                              Exclusive top header preview (not duplicated below)
                            </span>
                          </div>
                        </label>
                      </div>

                      {featured && (
                        <div className="pt-3 border-t border-[#E5E4DE] dark:border-[#27313A]">
                          <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1 text-[#55626F] dark:text-[#97A3AF]">
                            Selected Case Studies Order Position (1, 2, 3...)
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={homeOrder}
                            onChange={(e) =>
                              setHomeOrder(
                                e.target.value === ""
                                  ? ""
                                  : parseInt(e.target.value, 10),
                              )
                            }
                            placeholder="e.g. 1"
                            className="w-full sm:w-48 px-3 py-1.5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-white dark:bg-[#171F24] text-xs focus:outline-none focus:ring-1 focus:ring-[#1F51D0]"
                          />
                        </div>
                      )}
                    </div>

                    {/* Tech Stack */}
                    <div className="md:col-span-2">
                      <label className="text-xs font-semibold uppercase tracking-wider block mb-1 text-[#171F24] dark:text-[#F1F4F6]">
                        Tech Stack (Comma-separated) *
                      </label>
                      <input
                        required
                        value={techStack}
                        onChange={(e) => setTechStack(e.target.value)}
                        placeholder="React, TypeScript, Next.js, Node.js"
                        className="w-full px-3.5 py-2.5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B] text-sm focus:outline-none focus:ring-2 focus:ring-[#1F51D0]"
                      />
                    </div>

                    {/* GitHub URL */}
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

                    {/* Live URL */}
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider block mb-1 text-[#171F24] dark:text-[#F1F4F6]">
                        Live Deployment URL
                      </label>
                      <input
                        type="url"
                        value={liveUrl}
                        onChange={(e) => setLiveUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3.5 py-2.5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B] text-sm focus:outline-none focus:ring-2 focus:ring-[#1F51D0]"
                      />
                    </div>

                    {/* Short Description */}
                    <div className="md:col-span-2">
                      <label className="text-xs font-semibold uppercase tracking-wider block mb-1 text-[#171F24] dark:text-[#F1F4F6]">
                        Short Summary (Archive listing preview) *
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={shortDesc}
                        onChange={(e) => setShortDesc(e.target.value)}
                        placeholder="A 2-sentence summary outlining what this platform delivers."
                        className="w-full px-3.5 py-2.5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B] text-sm focus:outline-none focus:ring-2 focus:ring-[#1F51D0]"
                      />
                    </div>

                    {/* Image Assets Uploader */}
                    <div className="md:col-span-2">
                      <label className="text-xs font-semibold uppercase tracking-wider block text-[#171F24] dark:text-[#F1F4F6]">
                        Screenshots &amp; Architecture Previews
                      </label>
                      <span className="text-[11px] text-[#55626F] dark:text-[#97A3AF] block mb-2">
                        First image is used as primary card preview. Uploading
                        automatically uploads to Cloudinary.
                      </span>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                        {images.map((img, i) => (
                          <div
                            key={i}
                            className="relative aspect-video rounded-md overflow-hidden border border-[#E5E4DE] dark:border-[#27313A] group bg-[#F2F1EC] dark:bg-[#222B33]"
                          >
                            <img
                              src={img}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(i)}
                              aria-label={`Remove image ${i + 1}`}
                              className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            {i === 0 && (
                              <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                                Cover
                              </span>
                            )}
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
                            <>
                              <UploadCloud className="w-5 h-5 text-[#55626F] dark:text-[#97A3AF]" />
                              <span className="text-[11px] font-mono text-[#55626F] dark:text-[#97A3AF] mt-1.5">
                                Add Screenshot
                              </span>
                            </>
                          )}
                        </label>
                      </div>
                    </div>

                    {/* Case Study Sections */}
                    <div className="md:col-span-2 pt-4 border-t border-[#E5E4DE] dark:border-[#27313A]">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-[#171F24] dark:text-[#F1F4F6]">
                        Deep-Dive Case Study Content
                      </h3>
                      <p className="text-xs text-[#55626F] dark:text-[#97A3AF] mb-4">
                        Structured sections rendered on the individual case study
                        view.
                      </p>
                    </div>

                    {/* Full Description */}
                    <div className="md:col-span-2">
                      <label className="text-xs font-semibold uppercase tracking-wider block mb-1 text-[#171F24] dark:text-[#F1F4F6]">
                        Detailed System Overview
                      </label>
                      <textarea
                        rows={4}
                        value={fullDesc}
                        onChange={(e) => setFullDesc(e.target.value)}
                        placeholder="Comprehensive explanation of what was engineered, deliverables, and capabilities."
                        className="w-full px-3.5 py-2.5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B] text-sm focus:outline-none focus:ring-2 focus:ring-[#1F51D0]"
                      />
                    </div>

                    {/* Why Built */}
                    <div className="md:col-span-2">
                      <label className="text-xs font-semibold uppercase tracking-wider block mb-1 text-[#171F24] dark:text-[#F1F4F6]">
                        Problem Statement &amp; Purpose ("Why Built")
                      </label>
                      <textarea
                        rows={3}
                        value={whyBuilt}
                        onChange={(e) => setWhyBuilt(e.target.value)}
                        placeholder="Business context, friction points, or technical challenges being resolved."
                        className="w-full px-3.5 py-2.5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B] text-sm focus:outline-none focus:ring-2 focus:ring-[#1F51D0]"
                      />
                    </div>

                    {/* Lessons Learned */}
                    <div className="md:col-span-2">
                      <label className="text-xs font-semibold uppercase tracking-wider block mb-1 text-[#171F24] dark:text-[#F1F4F6]">
                        Key Takeaways &amp; Architectural Tradeoffs
                      </label>
                      <textarea
                        rows={3}
                        value={lessonLearned}
                        onChange={(e) => setLessonLearned(e.target.value)}
                        placeholder="What worked well, performance optimizations, and future iterations."
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

      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
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
