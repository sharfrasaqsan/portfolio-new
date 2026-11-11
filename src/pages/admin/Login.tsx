import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";
import { Lock, Mail, Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Logo } from "../../components/Logo";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigate("/admin/dashboard");
    } catch (err: any) {
      const code = err.code || "";
      if (
        code === "auth/invalid-credential" ||
        code === "auth/user-not-found" ||
        code === "auth/wrong-password"
      ) {
        setError(
          "Invalid email address or password. Please verify your credentials.",
        );
      } else if (code === "auth/too-many-requests") {
        setError(
          "Too many unsuccessful attempts. Please wait a few minutes and try again.",
        );
      } else {
        setError(err.message || "Authentication failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-10 px-4">
      <Helmet>
        <title>Admin Sign In — Mohamed Sharfiras</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="w-full max-w-md bg-[#FFFFFF] dark:bg-[#171F24] border border-[#E5E4DE] dark:border-[#27313A] rounded-lg p-7 sm:p-9 shadow-sm">
        {/* Brand / Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="flex justify-center mb-2">
            <Logo size="lg" subtitle="Studio Console" />
          </div>
          <p className="text-xs text-[#55626F] dark:text-[#97A3AF]">
            Authorized administrator access for Mohamed Sharfiras
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 p-3.5 rounded-md text-xs leading-relaxed bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300"
          >
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleLogin} noValidate>
          {/* Email Field */}
          <div>
            <label
              htmlFor="admin-email"
              className="block text-xs font-semibold uppercase tracking-wider text-[#171F24] dark:text-[#F1F4F6] mb-1.5"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail
                className="w-4 h-4 text-[#55626F] dark:text-[#97A3AF] absolute left-3.5 top-3.5 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sharfrasaqsan@gmail.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B] text-[#171F24] dark:text-[#F1F4F6] text-sm focus:outline-none focus:ring-2 focus:ring-[#1F51D0] dark:focus:ring-[#4F7FF7] transition-shadow placeholder:text-[#55626F]/50 dark:placeholder:text-[#97A3AF]/50"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-semibold uppercase tracking-wider text-[#171F24] dark:text-[#F1F4F6] mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <Lock
                className="w-4 h-4 text-[#55626F] dark:text-[#97A3AF] absolute left-3.5 top-3.5 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="admin-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B] text-[#171F24] dark:text-[#F1F4F6] text-sm focus:outline-none focus:ring-2 focus:ring-[#1F51D0] dark:focus:ring-[#4F7FF7] transition-shadow placeholder:text-[#55626F]/50 dark:placeholder:text-[#97A3AF]/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-3 text-[#55626F] dark:text-[#97A3AF] hover:text-[#171F24] dark:hover:text-[#F1F4F6] focus:outline-none cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-md font-medium text-sm text-white bg-[#1F51D0] hover:bg-[#1942AA] dark:bg-[#4F7FF7] dark:hover:bg-[#3D6CE5] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1F51D0] focus:ring-offset-2 dark:focus:ring-offset-[#13171B] disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-2 shadow-xs"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying credentials...</span>
              </>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[#E5E4DE] dark:border-[#27313A] text-center">
          <Link
            to="/"
            className="inline-flex items-center space-x-1.5 text-xs text-[#55626F] dark:text-[#97A3AF] hover:text-[#171F24] dark:hover:text-[#F1F4F6] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to portfolio homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
