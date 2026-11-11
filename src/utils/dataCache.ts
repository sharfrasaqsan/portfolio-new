import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import { INITIAL_BLOGS } from "../data/blogsData";

// Curated Impact Order for projects
export const PROJECT_PRIORITY_ORDER: Record<string, number> = {
  // 1. Flagship Weather Telemetry & Meteorological Intelligence
  MflCmhqBMJ5PDrz6H2DD: 1, // Atmospheric Intelligence
  // 2. SaaS Automation Platform
  "8CQMnDasKgNgV38huMuj": 2, // Fixxable — SaaS Automation Platform
  // 3. Corporate Legal Platform
  "0lqZjvslmHJncTTadAfw": 3, // Meridian Law Group
  // 4. Commercial Auction Legal Services
  TCxzhTSYCxuBr9q7EJUf: 4, // Auction Solicitor
  // 5. Digital & Automation Agency Platform
  Z8kfLosbaaFhg7QnhCv5: 5, // Webphoria — Web & Automation Agency
  // 6. Property Auction Legal Services
  nxLXiGygVfYOuHQi4ftM: 6, // My Auction Lawyer
  // 7. Commercial Lease Legal Portal
  ocU78f4RZ0bUpFE1uZha: 7, // Lease Lawyer
  // 8. Clinical Negligence & Claims Platform
  b2L9FLiEVqPEPu99vFFM: 8, // Cosmetic Claims
  // 9. Real-time Social Networking Web App
  "1xUxXzNbDPGVBrSkL8EV": 9, // Slinkup
  // 10. Productivity & Academic Retrospective System
  "6JQheDhQU2rDolV5YAa3": 10, // Study Tracker
  // 11. Luxury Hotel Reservation System
  TmAGAucYY1nIvtbNRVE0: 11, // Royal Reserve
  // 12. Retail Hardware eCommerce (Archived Reference)
  AhtWy6o1sXQDjs820Os8: 12, // E-Shop: PC & Network Solutions
};

export const sortProjectsByPriority = (projects: any[]): any[] => {
  return [...projects].sort((a, b) => {
    // 1. Explicit numeric order from document if set, or curated mapping
    const orderA =
      typeof a.order === "number" ? a.order : PROJECT_PRIORITY_ORDER[a.id];
    const orderB =
      typeof b.order === "number" ? b.order : PROJECT_PRIORITY_ORDER[b.id];

    if (orderA !== undefined && orderB !== undefined) {
      return orderA - orderB;
    }
    if (orderA !== undefined) return -1;
    if (orderB !== undefined) return 1;

    // 2. Deprioritize archived projects unless explicitly ordered
    if (a.status === "Archived" && b.status !== "Archived") return 1;
    if (b.status === "Archived" && a.status !== "Archived") return -1;

    // 3. Fallback to newest createdAt
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
};

// In-memory content cache to prevent redundant Firestore queries during client navigation
let cachedProjects: any[] | null = null;
let cachedBlogs: any[] | null = null;
let projectsFetchPromise: Promise<any[]> | null = null;
let blogsFetchPromise: Promise<any[]> | null = null;

export const getCachedProjects = async (
  forceRefresh = false,
): Promise<any[]> => {
  if (cachedProjects && !forceRefresh) {
    return cachedProjects;
  }

  if (projectsFetchPromise && !forceRefresh) {
    return projectsFetchPromise;
  }

  projectsFetchPromise = (async () => {
    try {
      const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const rawList = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const list = sortProjectsByPriority(rawList);
      cachedProjects = list;
      return list;
    } catch (err) {
      console.error("Error fetching projects:", err);
      return cachedProjects || [];
    } finally {
      projectsFetchPromise = null;
    }
  })();

  return projectsFetchPromise;
};

export const getCachedBlogs = async (forceRefresh = false): Promise<any[]> => {
  if (
    cachedBlogs &&
    !forceRefresh &&
    cachedBlogs.length >= INITIAL_BLOGS.length
  ) {
    return cachedBlogs;
  }

  if (blogsFetchPromise && !forceRefresh) {
    return blogsFetchPromise;
  }

  blogsFetchPromise = (async () => {
    try {
      const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const firestoreList: any[] = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      // Merge enriched INITIAL_BLOGS with any Firestore updates/additions
      const mergedMap = new Map<string, any>();
      INITIAL_BLOGS.forEach((b) => mergedMap.set(b.id, b));

      firestoreList.forEach((d) => {
        if (mergedMap.has(d.id)) {
          const local = mergedMap.get(d.id);
          // Preserve local rich markdown content and code blocks, but allow status/thumbnail overrides if provided
          mergedMap.set(d.id, {
            ...d,
            ...local,
            status: d.status || local.status,
          });
        } else {
          // Brand new blog authored via admin dashboard
          mergedMap.set(d.id, d);
        }
      });

      const list = Array.from(mergedMap.values()).sort((a, b) => {
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

      cachedBlogs = list;
      return list;
    } catch (err) {
      console.error(
        "Error fetching blogs, falling back to local dataset:",
        err,
      );
      cachedBlogs = INITIAL_BLOGS;
      return INITIAL_BLOGS;
    } finally {
      blogsFetchPromise = null;
    }
  })();

  return blogsFetchPromise;
};

export const invalidateContentCache = () => {
  cachedProjects = null;
  cachedBlogs = null;
};
