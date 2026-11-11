import { useState } from "react";
import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { ThemeToggle } from "../components/ThemeToggle";
import { Logo, LogoMark } from "../components/Logo";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  ArrowLeft,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export const AdminLayout = () => {
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/admin/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navItems = [
    { name: "Overview", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Projects", path: "/admin/projects", icon: FolderKanban },
    { name: "Articles", path: "/admin/blogs", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFA] dark:bg-[#13171B] text-[#171F24] dark:text-[#F1F4F6] flex flex-col md:flex-row antialiased selection:bg-[#1F51D0] selection:text-white transition-colors duration-200">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-[#FFFFFF] dark:bg-[#171F24] border-r border-[#E5E4DE] dark:border-[#27313A] hidden md:flex flex-col justify-between flex-shrink-0 min-h-screen sticky top-0 h-screen">
        <div>
          {/* Header / Identity */}
          <div className="p-6 border-b border-[#E5E4DE] dark:border-[#27313A] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <LogoMark size="sm" />
              <div>
                <p className="font-bold text-sm leading-tight text-[#171F24] dark:text-[#F1F4F6]">
                  Studio Console
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-mono text-[#55626F] dark:text-[#97A3AF]">
                    Authenticated
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5" aria-label="Admin Navigation">
            <p className="px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-[#55626F] dark:text-[#97A3AF]">
              Management
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[#F2F1EC] dark:bg-[#222B33] text-[#1F51D0] dark:text-[#4F7FF7] font-semibold border-l-2 border-[#1F51D0] dark:border-[#4F7FF7]"
                        : "text-[#55626F] dark:text-[#97A3AF] hover:bg-[#F2F1EC]/60 dark:hover:bg-[#222B33]/60 hover:text-[#171F24] dark:hover:text-[#F1F4F6]"
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#E5E4DE] dark:border-[#27313A] space-y-2">
          <div className="flex items-center justify-between px-3 py-1">
            <span className="text-xs text-[#55626F] dark:text-[#97A3AF] font-mono">
              Theme
            </span>
            <ThemeToggle />
          </div>

          <Link
            to="/"
            className="flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-medium text-[#55626F] dark:text-[#97A3AF] hover:text-[#171F24] dark:hover:text-[#F1F4F6] hover:bg-[#F2F1EC]/60 dark:hover:bg-[#222B33]/60 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Public Site</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden border-b border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#171F24] px-5 py-3 flex items-center justify-between sticky top-0 z-40">
        <Logo size="sm" subtitle="Console" to="/admin/dashboard" />

        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label={mobileNavOpen ? "Close admin menu" : "Open admin menu"}
            className="p-1.5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] text-[#171F24] dark:text-[#F1F4F6] hover:bg-[#F2F1EC] dark:hover:bg-[#222B33]"
          >
            {mobileNavOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Dropdown */}
      {mobileNavOpen && (
        <div className="md:hidden border-b border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#171F24] px-5 py-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileNavOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? "bg-[#F2F1EC] dark:bg-[#222B33] text-[#1F51D0] dark:text-[#4F7FF7]"
                      : "text-[#55626F] dark:text-[#97A3AF]"
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
          <div className="pt-2 border-t border-[#E5E4DE] dark:border-[#27313A] flex justify-between items-center text-xs">
            <Link
              to="/"
              className="text-[#55626F] dark:text-[#97A3AF] hover:underline"
            >
              Public Site
            </Link>
            <button
              onClick={handleLogout}
              className="text-red-600 dark:text-red-400 font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-5 sm:p-8 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
