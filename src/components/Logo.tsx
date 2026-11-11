import React from "react";
import { Link } from "react-router-dom";

interface LogoMarkProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const LogoMark: React.FC<LogoMarkProps> = ({
  className = "",
  size = "md",
}) => {
  const sizeMap = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11",
  };

  const finalClass = className || sizeMap[size];

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 rounded-lg overflow-hidden shadow-xs border border-[#E5E4DE] dark:border-[#27313A] group-hover:border-[#1F51D0]/40 dark:group-hover:border-[#4F7FF7]/40 transition-all duration-200 ${finalClass}`}
    >
      <svg
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        aria-hidden="true"
      >
        {/* Emblem Background */}
        <rect
          width="36"
          height="36"
          rx="8"
          className="fill-[#171F24] dark:fill-[#F1F4F6] transition-colors"
        />

        {/* Cobalt status / accent node */}
        <circle
          cx="28"
          cy="8"
          r="2.5"
          className="fill-[#1F51D0] dark:fill-[#4F7FF7] transition-colors"
        />

        {/* Precision Monogram: MS */}
        <path
          d="M8 25V11h3.3l3.2 7.6 3.2-7.6H21v14h-2.5v-9.2L15.3 22h-1.6L10.5 15.8V25H8zm14.8-.2c1.2 0 2.2-.4 3-1 .8-.7 1.2-1.5 1.2-2.5 0-.7-.3-1.4-.8-1.8-.5-.5-1.2-.8-2.2-1.1l-1-.3c-.6-.2-.9-.4-1.2-.6-.3-.2-.4-.4-.4-.7 0-.4.2-.6.5-.8.3-.2.7-.3 1.2-.3.6 0 1 .1 1.4.4.4.3.6.6.7 1h2.2c-.2-1-.6-1.7-1.3-2.2-.7-.6-1.7-.8-2.9-.8-1.1 0-2.1.3-2.9.9-.7.6-1.1 1.4-1.1 2.3 0 .8.3 1.4.8 1.9.5.5 1.3.8 2.3 1.1l1 .3c.7.2 1.1.4 1.3.6.3.3.4.6.4.9 0 .4-.2.7-.5.9-.3.3-.8.4-1.4.4-.7 0-1.2-.2-1.6-.5-.4-.4-.6-.8-.7-1.4h-2.2c.1 1.1.6 2 1.4 2.6.8.6 1.9.9 3.2.9z"
          className="fill-white dark:fill-[#171F24] transition-colors"
        />
      </svg>
    </div>
  );
};

export interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  showSubtitle?: boolean;
  subtitle?: string;
  className?: string;
  asLink?: boolean;
  to?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = "md",
  showText = true,
  showSubtitle = true,
  subtitle = "Web Developer",
  className = "",
  asLink = true,
  to = "/",
}) => {
  const content = (
    <>
      <LogoMark size={size} />
      {showText && (
        <div className="flex flex-col text-left">
          <span
            className={`font-bold tracking-tight text-[#171F24] dark:text-[#F1F4F6] group-hover:text-[#1F51D0] dark:group-hover:text-[#4F7FF7] transition-colors leading-tight ${
              size === "lg"
                ? "text-lg sm:text-xl"
                : size === "sm"
                  ? "text-sm"
                  : "text-base sm:text-lg"
            }`}
          >
            Mohamed Sharfiras
          </span>
          {showSubtitle && subtitle && (
            <span
              className={`font-medium uppercase tracking-wider text-[#55626F] dark:text-[#97A3AF] transition-colors ${
                size === "lg"
                  ? "text-xs mt-1"
                  : "text-[10px] sm:text-[11px] mt-0.5"
              }`}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </>
  );

  const containerClasses = `inline-flex items-center gap-3 group select-none py-0.5 ${className}`;

  if (asLink) {
    return (
      <Link
        to={to}
        className={containerClasses}
        aria-label="Mohamed Sharfiras — Home"
      >
        {content}
      </Link>
    );
  }

  return <div className={containerClasses}>{content}</div>;
};

export default Logo;
