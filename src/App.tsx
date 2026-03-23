import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicLayout } from './layouts/PublicLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Lazy Loaded Public Pages
const Home = lazy(() => import('./pages/public/Home'));
const About = lazy(() => import('./pages/public/About'));
const Projects = lazy(() => import('./pages/public/Projects'));
const SingleProject = lazy(() => import('./pages/public/SingleProject'));
const Blog = lazy(() => import('./pages/public/Blog'));
const SingleBlog = lazy(() => import('./pages/public/SingleBlog'));
const Contact = lazy(() => import('./pages/public/Contact'));

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import AdminProjects from './pages/admin/AdminProjects';
import AdminBlogs from './pages/admin/AdminBlogs';

import AnalyticsTracker from './components/AnalyticsTracker';

const App = () => {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <AnalyticsTracker />
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col space-y-4"><div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-gray-950 animate-spin"></div><p className="text-gray-500 font-medium">Loading Portfolio...</p></div>}>
              <Routes>
                {/* Public Routes */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/:id" element={<SingleProject />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:id" element={<SingleBlog />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/admin/login" element={<Login />} />
                </Route>

                {/* Admin Routes */}
                <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                  <Route path="/admin" element={<Dashboard />} />
                  <Route path="/admin/dashboard" element={<Dashboard />} />
                  <Route path="/admin/projects" element={<AdminProjects />} />
                  <Route path="/admin/blogs" element={<AdminBlogs />} />
                </Route>
              </Routes>
            </Suspense>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default App;
