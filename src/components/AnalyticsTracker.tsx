import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { db } from '../firebase/config';
import { doc, setDoc, increment, serverTimestamp } from 'firebase/firestore';

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Only track public paths, avoid admin paths
    if (location.pathname.startsWith('/admin')) return;

    const trackView = async () => {
      try {
        // Sanitize path for doc ID (replace slashes with underscores or similar if needed, 
        // but Firestore supports slashes in doc IDs within collections)
        const pathId = location.pathname === '/' ? 'home' : location.pathname.slice(1).replace(/\//g, '_');
        
        const docRef = doc(db, 'analytics', pathId);
        await setDoc(docRef, {
          path: location.pathname,
          views: increment(1),
          lastVisited: serverTimestamp()
        }, { merge: true });

        // Also update a global counter
        const globalRef = doc(db, 'analytics', 'global_stats');
        await setDoc(globalRef, {
          totalViews: increment(1),
          lastUpdate: serverTimestamp()
        }, { merge: true });

      } catch (err) {
        console.error("Analytics tracking failed", err);
      }
    };

    trackView();
  }, [location.pathname]);

  return null; // This component doesn't render anything
};

export default AnalyticsTracker;
