import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { motion } from 'framer-motion';
import { LogOut, Home, FolderKanban, FileText, ArrowLeft } from 'lucide-react';

export const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow-sm hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center space-x-2">
          <div className="w-8 h-8 rounded bg-gray-900 flex items-center justify-center text-white font-bold">A</div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900">Admin</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin/dashboard" className="flex items-center space-x-3 text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors bg-white">
            <Home className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link to="/admin/projects" className="flex items-center space-x-3 text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <FolderKanban className="w-5 h-5" />
            <span className="font-medium">Projects</span>
          </Link>
          <Link to="/admin/blogs" className="flex items-center space-x-3 text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <FileText className="w-5 h-5" />
            <span className="font-medium">Blog Posts</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-100 space-y-2">
          <Link to="/" className="flex items-center space-x-3 text-gray-500 hover:text-gray-900 p-2 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Site</span>
          </Link>
          <button onClick={handleLogout} className="flex w-full items-center space-x-3 text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 bg-gray-50 flex flex-col min-h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 md:hidden">
            <div className="font-bold text-lg">Admin Panel</div>
        </header>
        <div className="flex-1 overflow-auto p-6 md:p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  );
};
