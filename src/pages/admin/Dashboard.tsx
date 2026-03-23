import { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { FolderKanban, FileText, Activity, Eye, BarChart3, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { Skeleton } from '../../components/Skeleton';

const StatCard = ({ title, value, icon: Icon, color, loading }: any) => (
  <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center space-x-4">
    <div className={`p-4 rounded-lg flex-shrink-0 ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
      {loading ? (
        <Skeleton className="h-8 w-16 mt-1" />
      ) : (
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pSnap = await getDocs(collection(db, 'projects'));
        const bSnap = await getDocs(collection(db, 'blogs'));
        setProjectCount(pSnap.size);
        setBlogCount(bSnap.size);

        // Fetch Analytics
        const globalSnap = await getDoc(doc(db, 'analytics', 'global_stats'));
        if (globalSnap.exists()) {
          setTotalViews(globalSnap.data()?.totalViews);
        }

        const analyticsSnap = await getDocs(collection(db, 'analytics'));
        const stats = analyticsSnap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(s => s.id !== 'global_stats')
          .sort((a: any, b: any) => b.views - a.views);
        setPageStats(stats);

        // Fetch Feedback
        const fQuery = query(collection(db, 'feedback'), orderBy('createdAt', 'desc'), limit(5));
        const fSnap = await getDocs(fQuery);
        setFeedbacks(fSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      } catch (err) {
        console.error("Dashboard failed to fetch stats", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <StatCard title="Total Projects" value={projectCount} icon={FolderKanban} color="bg-blue-600" loading={projectCount === null} />
        </motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <StatCard title="Total Blogs" value={blogCount} icon={FileText} color="bg-green-600" loading={blogCount === null} />
        </motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <StatCard title="Total Views" value={totalViews} icon={Eye} color="bg-orange-600" loading={totalViews === null} />
        </motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
          <StatCard title="Active Status" value="Online" icon={Activity} color="bg-purple-600" loading={false} />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center space-x-2 mb-6">
             <BarChart3 className="w-5 h-5 text-blue-600" />
             <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Page Performance</h2>
          </div>
          <div className="space-y-4">
            {pageStats.length > 0 ? pageStats.map((stat: any) => (
              <div key={stat.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[200px]">{stat.path}</p>
                  <p className="text-[10px] text-gray-400">Last visited: {stat.lastVisited?.toDate().toLocaleTimeString()}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">{stat.views}</span>
                  <span className="ml-1 text-[10px] text-gray-500 uppercase tracking-tighter">views</span>
                </div>
              </div>
            )) : (
              <p className="text-sm text-gray-500 italic py-8 text-center uppercase tracking-widest font-bold opacity-50">No data collected yet.</p>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Welcome back, Admin!</h2>
            <p className="text-gray-600 dark:text-gray-400">You now have access to real-time analytics. Tracking is automated and only records unique paths visited by users.</p>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center space-x-2 mb-6">
               <MessageSquare className="w-5 h-5 text-green-600" />
               <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Feedback</h2>
            </div>
            <div className="space-y-4">
              {feedbacks.length > 0 ? feedbacks.map((f: any) => (
                <div key={f.id} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 space-y-2">
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400">{f.email}</p>
                    <p className="text-[10px] text-gray-400">{f.createdAt?.toDate().toLocaleDateString()}</p>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">"{f.feedback}"</p>
                  <p className="text-[10px] text-gray-400 italic">Sent from: {f.path}</p>
                </div>
              )) : (
                <p className="text-sm text-gray-500 italic py-8 text-center">No feedback received yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
