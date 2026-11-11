import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import { INITIAL_BLOGS } from "../data/blogsData";

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
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
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
