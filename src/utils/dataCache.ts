// In-memory content cache to prevent redundant Firestore queries during client navigation
let cachedProjects: any[] | null = null;
let cachedBlogs: any[] | null = null;
let projectsFetchPromise: Promise<any[]> | null = null;
let blogsFetchPromise: Promise<any[]> | null = null;

import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";

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
  if (cachedBlogs && !forceRefresh) {
    return cachedBlogs;
  }

  if (blogsFetchPromise && !forceRefresh) {
    return blogsFetchPromise;
  }

  blogsFetchPromise = (async () => {
    try {
      const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      cachedBlogs = list;
      return list;
    } catch (err) {
      console.error("Error fetching blogs:", err);
      return cachedBlogs || [];
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
