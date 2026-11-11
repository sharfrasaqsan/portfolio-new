import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  orderBy,
  limit,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import {
  FolderKanban,
  FileText,
  Eye,
  Activity,
  BarChart3,
  MessageSquare,
  Plus,
  Trash2,
  Mail,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Skeleton } from "../../components/Skeleton";
import { Helmet } from "react-helmet-async";

interface StatCardProps {
  title: string;
  value: number | string | null;
  icon: React.ElementType;
  loading?: boolean;
  hint?: string;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  loading,
  hint,
}: StatCardProps) => (
  <div className="bg-[#FFFFFF] dark:bg-[#171F24] p-5 rounded-lg border border-[#E5E4DE] dark:border-[#27313A] space-y-3 shadow-2xs">
    <div className="flex items-center justify-between text-[#55626F] dark:text-[#97A3AF]">
      <span className="text-xs font-mono uppercase tracking-wider">
        {title}
      </span>
      <div className="p-2 rounded bg-[#F2F1EC] dark:bg-[#222B33] text-[#171F24] dark:text-[#F1F4F6]">
        <Icon className="w-4 h-4" />
      </div>
    </div>
    <div>
      {loading ? (
        <Skeleton className="h-8 w-16" />
      ) : (
        <p className="text-2xl font-bold font-mono tracking-tight text-[#171F24] dark:text-[#F1F4F6]">
          {value ?? 0}
        </p>
      )}
      {hint && (
        <p className="text-[11px] text-[#55626F] dark:text-[#97A3AF] mt-1 font-mono">
          {hint}
        </p>
      )}
    </div>
  </div>
);

const Dashboard = () => {
  const [projectCount, setProjectCount] = useState<number | null>(null);
  const [blogCount, setBlogCount] = useState<number | null>(null);
  const [totalViews, setTotalViews] = useState<number | null>(null);
  const [pageStats, setPageStats] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [feedbackSearch, setFeedbackSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pSnap, bSnap, globalSnap, analyticsSnap, fSnap] =
          await Promise.all([
            getDocs(collection(db, "projects")),
            getDocs(collection(db, "blogs")),
            getDoc(doc(db, "analytics", "global_stats")),
            getDocs(collection(db, "analytics")),
            getDocs(
              query(
                collection(db, "feedback"),
                orderBy("createdAt", "desc"),
                limit(15),
              ),
            ),
          ]);

        setProjectCount(pSnap.size);
        setBlogCount(bSnap.size);

        if (globalSnap.exists()) {
          setTotalViews(globalSnap.data()?.totalViews ?? 0);
        } else {
          setTotalViews(0);
        }

        const stats = analyticsSnap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((s) => s.id !== "global_stats")
          .sort((a: any, b: any) => (b.views || 0) - (a.views || 0));
        setPageStats(stats);

        setFeedbacks(fSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Dashboard failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeleteFeedback = async (id: string) => {
    if (!window.confirm("Permanently delete this feedback note?")) return;
    try {
      await deleteDoc(doc(db, "feedback", id));
      setFeedbacks((prev) => prev.filter((f) => f.id !== id));
      showToast("success", "Feedback note deleted.");
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to delete feedback.");
    }
  };

  const maxViews = Math.max(1, ...pageStats.map((s) => s.views || 0));

  const filteredFeedbacks = feedbacks.filter((f) => {
    if (!feedbackSearch.trim()) return true;
    const q = feedbackSearch.toLowerCase();
    return (
      f.feedback?.toLowerCase().includes(q) ||
      f.email?.toLowerCase().includes(q) ||
      f.path?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8">
      <Helmet>
        <title>Dashboard — Studio Console</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Toast Notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-md text-xs font-medium shadow-lg flex items-center gap-2 border animate-in slide-in-from-top-2 ${
            toast.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
              : "bg-red-50 dark:bg-red-950/80 border-red-300 dark:border-red-800 text-red-800 dark:text-red-300"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#E5E4DE] dark:border-[#27313A]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#171F24] dark:text-[#F1F4F6]">
            Studio Console Overview
          </h1>
          <p className="text-xs text-[#55626F] dark:text-[#97A3AF] mt-0.5">
            Operational telemetry, portfolio assets, and interactive feedback
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/projects"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-md text-xs font-semibold bg-[#1F51D0] dark:bg-[#4F7FF7] text-white hover:bg-[#1942AA] dark:hover:bg-[#3D6CE5] transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Manage Projects</span>
          </Link>
          <Link
            to="/admin/blogs"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-md text-xs font-semibold border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#171F24] text-[#171F24] dark:text-[#F1F4F6] hover:bg-[#F2F1EC] dark:hover:bg-[#222B33] transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Manage Articles</span>
          </Link>
        </div>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Published Projects"
          value={projectCount}
          icon={FolderKanban}
          loading={loading}
          hint="Case studies active"
        />
        <StatCard
          title="Published Articles"
          value={blogCount}
          icon={FileText}
          loading={loading}
          hint="Technical essays"
        />
        <StatCard
          title="Cumulative Views"
          value={totalViews}
          icon={Eye}
          loading={loading}
          hint="Automated path visits"
        />
        <StatCard
          title="Firestore Status"
          value="Healthy"
          icon={Activity}
          loading={false}
          hint="Connected securely"
        />
      </div>

      {/* Two-Column Analytics & Feedback Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Page Performance Table */}
        <div className="lg:col-span-7 bg-[#FFFFFF] dark:bg-[#171F24] p-6 rounded-lg border border-[#E5E4DE] dark:border-[#27313A] space-y-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E4DE] dark:border-[#27313A]">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-[#1F51D0] dark:text-[#4F7FF7]" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#171F24] dark:text-[#F1F4F6]">
                Route Telemetry &amp; Page Views
              </h2>
            </div>
            <span className="text-[11px] font-mono text-[#55626F] dark:text-[#97A3AF]">
              {pageStats.length} monitored paths
            </span>
          </div>

          <div className="space-y-3">
            {pageStats.length > 0 ? (
              pageStats.map((stat: any) => {
                const percentage = Math.round(
                  ((stat.views || 0) / maxViews) * 100,
                );
                return (
                  <div
                    key={stat.id}
                    className="p-3 rounded-md bg-[#FBFBFA] dark:bg-[#13171B] border border-[#E5E4DE]/60 dark:border-[#27313A]/60 space-y-2 hover:border-[#1F51D0]/40 transition-colors"
                  >
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-1.5 truncate max-w-[280px]">
                        <span className="font-mono font-medium text-[#171F24] dark:text-[#F1F4F6] truncate">
                          {stat.path || "/"}
                        </span>
                        <a
                          href={stat.path || "/"}
                          target="_blank"
                          rel="noreferrer"
                          title="Open live path in new tab"
                          className="text-[#55626F] hover:text-[#1F51D0] dark:hover:text-[#4F7FF7]"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-[#1F51D0] dark:text-[#4F7FF7]">
                          {stat.views || 0}
                        </span>
                        <span className="text-[10px] text-[#55626F] dark:text-[#97A3AF] ml-1 uppercase">
                          views
                        </span>
                      </div>
                    </div>

                    {/* Progress track */}
                    <div className="w-full bg-[#E5E4DE] dark:bg-[#27313A] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#1F51D0] dark:bg-[#4F7FF7] h-full rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(4, percentage)}%` }}
                      />
                    </div>

                    {stat.lastVisited && (
                      <p className="text-[10px] text-[#55626F] dark:text-[#97A3AF] font-mono">
                        Last ping:{" "}
                        {stat.lastVisited.toDate?.()
                          ? stat.lastVisited.toDate().toLocaleString()
                          : "Recently"}
                      </p>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-[#55626F] dark:text-[#97A3AF] italic py-8 text-center font-mono">
                {loading
                  ? "Loading telemetry records..."
                  : "No page visits recorded yet."}
              </p>
            )}
          </div>
        </div>

        {/* Feedback Management Hub */}
        <div className="lg:col-span-5 bg-[#FFFFFF] dark:bg-[#171F24] p-6 rounded-lg border border-[#E5E4DE] dark:border-[#27313A] space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E4DE] dark:border-[#27313A]">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#171F24] dark:text-[#F1F4F6]">
                Feedback Hub
              </h2>
            </div>
            <span className="text-[11px] font-mono text-[#55626F] dark:text-[#97A3AF]">
              {feedbacks.length} notes
            </span>
          </div>

          {/* Search Feedback */}
          {feedbacks.length > 3 && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#55626F] dark:text-[#97A3AF]" />
              <input
                type="text"
                value={feedbackSearch}
                onChange={(e) => setFeedbackSearch(e.target.value)}
                placeholder="Filter feedback notes..."
                className="w-full pl-8 pr-3 py-1.5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B] text-xs outline-none focus:ring-1 focus:ring-[#1F51D0]"
              />
            </div>
          )}

          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {filteredFeedbacks.length > 0 ? (
              filteredFeedbacks.map((f: any) => (
                <div
                  key={f.id}
                  className="p-3.5 rounded-md bg-[#FBFBFA] dark:bg-[#13171B] border border-[#E5E4DE]/60 dark:border-[#27313A]/60 space-y-2 text-xs"
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-mono font-semibold text-[#1F51D0] dark:text-[#4F7FF7] truncate">
                      {f.email || "Anonymous"}
                    </span>
                    <span className="text-[10px] text-[#55626F] dark:text-[#97A3AF] font-mono flex-shrink-0">
                      {f.createdAt?.toDate?.()
                        ? f.createdAt.toDate().toLocaleDateString()
                        : "Recent"}
                    </span>
                  </div>

                  <p className="text-[#171F24] dark:text-[#F1F4F6] leading-relaxed">
                    "{f.feedback}"
                  </p>

                  <div className="pt-2 border-t border-[#E5E4DE]/60 dark:border-[#27313A]/60 flex items-center justify-between text-[11px]">
                    <span className="font-mono text-[#55626F] dark:text-[#97A3AF] truncate max-w-[150px]">
                      {f.path || "/"}
                    </span>

                    <div className="flex items-center space-x-2">
                      {f.email &&
                        f.email !== "anonymous" &&
                        f.email.includes("@") && (
                          <a
                            href={`mailto:${f.email}?subject=${encodeURIComponent(
                              "Re: Your portfolio note",
                            )}&body=${encodeURIComponent(
                              `Hi,\n\nThank you for reaching out via my portfolio. Regarding your note:\n"${f.feedback}"\n\n`,
                            )}`}
                            className="inline-flex items-center gap-1 text-[#1F51D0] dark:text-[#4F7FF7] hover:underline"
                          >
                            <Mail className="w-3 h-3" />
                            <span>Reply</span>
                          </a>
                        )}

                      <button
                        type="button"
                        onClick={() => handleDeleteFeedback(f.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                        title="Delete feedback"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#55626F] dark:text-[#97A3AF] italic py-8 text-center font-mono">
                {loading
                  ? "Checking feedback logs..."
                  : "No feedback submitted yet."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
