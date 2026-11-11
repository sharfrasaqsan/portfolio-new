import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import { absoluteUrl } from "../../utils/seo";

const NotFound = () => {
  return (
    <div className="py-20 text-center space-y-6 max-w-lg mx-auto">
      <Helmet>
        <title>Page Not Found | Mohamed Sharfiras</title>
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href={absoluteUrl("/404")} />
      </Helmet>

      <p className="font-mono text-xs uppercase tracking-widest text-[#1F51D0] dark:text-[#4F7FF7]">
        404 — Not Found
      </p>

      <h1 className="text-3xl font-bold tracking-tight text-[#171F24] dark:text-[#F1F4F6]">
        This page could not be located.
      </h1>

      <p className="text-sm text-[#55626F] dark:text-[#97A3AF] leading-relaxed">
        The destination you are looking for may have moved, been renamed, or
        does not exist.
      </p>

      <div className="pt-4 flex justify-center gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#171F24] dark:bg-[#F1F4F6] text-white dark:text-[#171F24] text-xs font-semibold hover:bg-[#27313A] dark:hover:bg-[#E5E4DE] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Return Home</span>
        </Link>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#1B2228] text-xs font-semibold text-[#171F24] dark:text-[#F1F4F6] hover:bg-[#F2F1EC] dark:hover:bg-[#222B33] transition-colors"
        >
          <span>Browse Projects</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
