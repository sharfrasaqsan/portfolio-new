import { useState } from "react";
import { Copy, Check } from "lucide-react";

export const CodeBlock = ({
  _node,
  inline,
  className,
  children,
  ...props
}: any) => {
  const [copied, setCopied] = useState(false);

  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";
  const codeContent = String(children).replace(/\n$/, "");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy code", e);
    }
  };

  // Inline code snippet
  if (inline || !match) {
    return (
      <code
        className="px-1.5 py-0.5 rounded text-[13px] font-mono bg-[#F2F1EC] dark:bg-[#222B33] text-[#171F24] dark:text-[#F1F4F6] border border-[#E5E4DE] dark:border-[#27313A]"
        {...props}
      >
        {children}
      </code>
    );
  }

  // Fenced Code Block
  return (
    <div className="rounded-lg border border-[#E5E4DE] dark:border-[#27313A] overflow-hidden my-6 bg-[#13171B] text-[#F1F4F6] shadow-sm">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#27313A] bg-[#171F24] text-xs font-mono">
        <span className="text-[#97A3AF] uppercase text-[11px] tracking-wider font-bold">
          {language || "CODE"}
        </span>

        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "Code copied" : "Copy code to clipboard"}
          className="flex items-center gap-1.5 px-2 py-1 rounded text-[11px] text-[#97A3AF] hover:text-white hover:bg-[#27313A] transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <div className="p-4 overflow-x-auto font-mono text-xs sm:text-sm leading-relaxed text-[#E6EDF3]">
        <pre {...props}>
          <code>{children}</code>
        </pre>
      </div>
    </div>
  );
};
