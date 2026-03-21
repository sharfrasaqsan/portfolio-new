import { Outlet, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ThemeToggle } from "../components/ThemeToggle";
import { Github, Linkedin, Facebook, Mail, MessageCircle } from "lucide-react";

export const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white flex flex-col font-sans transition-colors duration-300">
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link
              to="/"
              className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400"
            >
              Mohamed Sharfiras
            </Link>
            <div className="hidden md:flex space-x-8 items-center">
              <Link
                to="/"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                About
              </Link>
              <Link
                to="/projects"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Projects
              </Link>
              <Link
                to="/blog"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Blog
              </Link>
              <Link
                to="/contact"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Contact
              </Link>
              <ThemeToggle />
            </div>
            {/* Mobile Toggle Placeholder */}
            <div className="md:hidden flex items-center">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-grow">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        >
          <Outlet />
        </motion.div>
      </main>
      <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-12 flex flex-col items-center space-y-6">
        <div className="flex items-center space-x-6">
          <a
            href="https://github.com/sharfrasaqsan"
            target="_blank"
            rel="noreferrer"
            className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/sharfiras/"
            target="_blank"
            rel="noreferrer"
            className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href="https://web.facebook.com/sharfras.aqsan97"
            target="_blank"
            rel="noreferrer"
            className="text-gray-500 hover:text-blue-700 dark:hover:text-blue-500 transition-colors"
          >
            <Facebook className="w-5 h-5" />
          </a>
          <a
            href="mailto:sharfrasaqsan@gmail.com"
            className="text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <Mail className="w-5 h-5" />
          </a>
          <a
            href="https://wa.me/94751230001"
            target="_blank"
            rel="noreferrer"
            className="text-gray-500 hover:text-green-600 dark:hover:text-green-400 transition-colors"
          >
            <MessageCircle className="w-5 h-5 transition-transform hover:scale-110" />
          </a>
        </div>
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Mohamed Sharfiras. All rights
            reserved.
          </p>
          <Link
            to="/admin/login"
            className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Admin Access
          </Link>
        </div>
      </footer>
    </div>
  );
};
