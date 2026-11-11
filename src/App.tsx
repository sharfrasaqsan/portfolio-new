import { Suspense, lazy, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicLayout } from "./layouts/PublicLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import AnalyticsTracker from "./components/AnalyticsTracker";

// Lazy Loaded Public Pages
const Home = lazy(() => import("./pages/public/Home"));
const About = lazy(() => import("./pages/public/About"));
const Projects = lazy(() => import("./pages/public/Projects"));
const SingleProject = lazy(() => import("./pages/public/SingleProject"));
const Blog = lazy(() => import("./pages/public/Blog"));
const SingleBlog = lazy(() => import("./pages/public/SingleBlog"));
const Contact = lazy(() => import("./pages/public/Contact"));
const Services = lazy(() => import("./pages/public/Services"));
const Uses = lazy(() => import("./pages/public/Uses"));
const NotFound = lazy(() => import("./pages/public/NotFound"));

// Lazy Loaded Admin Pages (keeps admin dependencies out of public bundles)
const Login = lazy(() => import("./pages/admin/Login"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminProjects = lazy(() => import("./pages/admin/AdminProjects"));
const AdminBlogs = lazy(() => import("./pages/admin/AdminBlogs"));

// Resets scroll position when route changes
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <ScrollToTop />
            <AnalyticsTracker />
            <Suspense
              fallback={
                <div
                  aria-label="Loading page content"
                  className="min-h-[50vh] flex items-center justify-center flex-col space-y-3"
                >
                  <div className="w-8 h-8 rounded-full border-2 border-[#E5E4DE] dark:border-[#27313A] border-t-[#1F51D0] dark:border-t-[#4F7FF7] animate-spin" />
                  <p className="text-xs font-mono text-[#55626F] dark:text-[#97A3AF]">
                    Loading...
                  </p>
                </div>
              }
            >
              <Routes>
                {/* Public Routes */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/:id" element={<SingleProject />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:id" element={<SingleBlog />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/uses" element={<Uses />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/admin/login" element={<Login />} />
                  <Route path="*" element={<NotFound />} />
                </Route>

                {/* Admin Routes */}
                <Route
                  element={
                    <ProtectedRoute>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
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
