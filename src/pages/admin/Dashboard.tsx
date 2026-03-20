import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { FolderKanban, FileText, Activity } from 'lucide-react';
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pSnap = await getDocs(collection(db, 'projects'));
        const bSnap = await getDocs(collection(db, 'blogs'));
        setProjectCount(pSnap.size);
        setBlogCount(bSnap.size);
      } catch (err) {
        console.error("Dashboard failed to fetch stats", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Quick Overview</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <StatCard title="Total Projects" value={projectCount} icon={FolderKanban} color="bg-blue-600" loading={projectCount === null} />
        </motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <StatCard title="Total Blogs" value={blogCount} icon={FileText} color="bg-green-600" loading={blogCount === null} />
        </motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <StatCard title="Active Status" value="Online" icon={Activity} color="bg-purple-600" loading={false} />
        </motion.div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm mt-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Welcome back, Admin!</h2>
        <p className="text-gray-600 dark:text-gray-400">Use the sidebar to manage your portfolio projects and blog posts. Changes to Firestore update in real-time on your public frontend if you listen to changes, or upon page refresh.</p>
      </div>
    </div>
  );
};

export default Dashboard;
