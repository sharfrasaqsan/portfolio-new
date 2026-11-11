import { useState, useEffect } from "react";
import { Outlet, NavLink, Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "../components/ThemeToggle";
import { Menu, X, ArrowUpRight, Rss } from "lucide-react";
import FeedbackButton from "../components/FeedbackButton";
import { TimezoneStatus } from "../components/TimezoneStatus";
import { Logo } from "../components/Logo";

const navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Projects", path: "/projects" },
  { name: "Services", path: "/services" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
];

const socialLinks = [
  { name: "GitHub", url: "https://github.com/sharfrasaqsan" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/sharfiras/" },
  { name: "WhatsApp", url: "https://wa.me/94751230001" },
  { name: "Email", url: "mailto:sharfrasaqsan@gmail.com" },
];

export const PublicLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Global keyboard shortcuts (Escape closes mobile menu)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen bg-[#FBFBFA] dark:bg-[#13171B] text-[#171F24] dark:text-[#F1F4F6] flex flex-col font-sans transition-colors duration-200">
      {/* Skip to Content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-[#171F24] text-white dark:bg-[#F1F4F6] dark:text-[#171F24] rounded-sm text-sm font-semibold shadow-md"
      >
        Skip to main content
      </a>

      {/* Main Header */}
      <header className="border-b border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA]/90 dark:bg-[#13171B]/90 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-18">
            {/* Identity Brand Logo */}
            <Logo size="md" subtitle="Web Developer" />

            {/* Desktop Navigation */}
            <nav
              aria-label="Primary navigation"
              className="hidden md:flex items-center space-x-1 lg:space-x-2"
            >
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `px-3 py-1.5 text-sm font-medium transition-colors rounded-sm ${
                      isActive
                        ? "text-[#1F51D0] dark:text-[#4F7FF7] font-semibold bg-[#F2F1EC] dark:bg-[#1B2228]"
                        : "text-[#55626F] dark:text-[#97A3AF] hover:text-[#171F24] dark:hover:text-[#F1F4F6] hover:bg-[#F2F1EC]/60 dark:hover:bg-[#1B2228]/50"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}

              <div className="pl-2 border-l border-[#E5E4DE] dark:border-[#27313A] flex items-center space-x-2">
                <ThemeToggle />
              </div>
            </nav>

            {/* Mobile Actions */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={
                  mobileMenuOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
                }
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-nav-panel"
                className="p-2 rounded-md border border-[#E5E4DE] dark:border-[#27313A] text-[#171F24] dark:text-[#F1F4F6] hover:bg-[#F2F1EC] dark:hover:bg-[#1B2228] transition-colors cursor-pointer"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <Menu className="w-5 h-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <nav
            id="mobile-nav-panel"
            aria-label="Mobile navigation"
            className="md:hidden border-t border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#1B2228] px-5 py-4 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2.5 rounded-sm text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#F2F1EC] dark:bg-[#222B33] text-[#1F51D0] dark:text-[#4F7FF7] font-semibold"
                      : "text-[#171F24] dark:text-[#F1F4F6] hover:bg-[#F2F1EC]/60 dark:hover:bg-[#222B33]/60"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}

            <div className="pt-3 border-t border-[#E5E4DE] dark:border-[#27313A] flex items-center justify-between text-xs text-[#55626F] dark:text-[#97A3AF]">
              <TimezoneStatus compact />
            </div>
          </nav>
        )}
      </header>

      {/* Main Content Landmark */}
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-grow focus:outline-none"
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 py-10 md:py-16">
          <Outlet />
        </div>
      </main>

      {/* Floating feedback trigger */}
      <FeedbackButton />

      {/* Editorial Footer */}
      <footer className="border-t border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#171F24] py-12 text-[#55626F] dark:text-[#97A3AF] text-sm">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Identity & Bio */}
            <div className="md:col-span-5 space-y-3.5">
              <Logo size="sm" showSubtitle={false} className="py-0" />
              <p className="text-xs sm:text-sm leading-relaxed max-w-sm">
                Web Developer with 4+ years of professional experience
                specializing in enterprise intranet migrations, high-performance
                eCommerce, React, Next.js, and Technical SEO.
              </p>

              {/* Live Timezone & Availability Widget */}
              <TimezoneStatus />
            </div>

            {/* Sitemap Navigation */}
            <div className="md:col-span-3 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[#171F24] dark:text-[#F1F4F6]">
                Index
              </p>
              <ul className="space-y-1.5 text-xs sm:text-sm">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="hover:text-[#171F24] dark:hover:text-[#F1F4F6] transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to="/uses"
                    className="hover:text-[#171F24] dark:hover:text-[#F1F4F6] transition-colors"
                  >
                    Colophon &amp; Stack
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social & Contact Channels */}
            <div className="md:col-span-4 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[#171F24] dark:text-[#F1F4F6]">
                Channels &amp; Feeds
              </p>
              <ul className="space-y-1.5 text-xs sm:text-sm">
                {socialLinks.map((s) => (
                  <li key={s.name}>
                    <a
                      href={s.url}
                      target={s.url.startsWith("http") ? "_blank" : undefined}
                      rel={s.url.startsWith("http") ? "noreferrer" : undefined}
                      className="inline-flex items-center gap-1 hover:text-[#171F24] dark:hover:text-[#F1F4F6] transition-colors"
                    >
                      <span>{s.name}</span>
                      <ArrowUpRight
                        className="w-3.5 h-3.5 text-[#55626F] dark:text-[#97A3AF]"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="/rss.xml"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[#1F51D0] dark:text-[#4F7FF7] hover:underline"
                  >
                    <Rss className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>RSS Feed (Articles)</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-[#E5E4DE] dark:border-[#27313A] flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-[#55626F] dark:text-[#97A3AF]">
            <p>
              &copy; {new Date().getFullYear()} Mohamed Sharfiras. Designed and
              built with care.
            </p>
            <div className="flex items-center space-x-3">
              <span className="font-mono">
                Open for consulting &amp; advisory
              </span>
              <span
                aria-hidden="true"
                className="text-[#55626F]/40 dark:text-[#97A3AF]/40"
              >
                ·
              </span>
              <Link
                to="/admin/login"
                aria-label="Admin sign in"
                className="hover:text-[#171F24] dark:hover:text-[#F1F4F6] transition-colors underline-offset-4 hover:underline"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
