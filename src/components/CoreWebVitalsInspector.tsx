import { useState } from "react";
import { Activity, CheckCircle2 } from "lucide-react";

interface MetricDetail {
  id: "lcp" | "inp" | "cls";
  name:
    | "Largest Contentful Paint"
    | "Interaction to Next Paint"
    | "Cumulative Layout Shift";
  acronym: "LCP" | "INP" | "CLS";
  value: string;
  rating: "Good" | "Needs Improvement";
  benchmark: string;
  industryAvg: string;
  summary: string;
  optimizations: string[];
}

const METRICS: MetricDetail[] = [
  {
    id: "lcp",
    acronym: "LCP",
    name: "Largest Contentful Paint",
    value: "0.85s",
    rating: "Good",
    benchmark: "Google Threshold: < 2.5s",
    industryAvg: "eCommerce Average: 3.2s",
    summary:
      "Measures perceived loading speed by marking the render time of the main above-the-fold content element.",
    optimizations: [
      "Priority fetch priority (fetchpriority='high') on primary hero media",
      "Explicit image dimensions to prevent layout recalculations",
      "CDN edge caching via Cloudinary with automatic WebP/AVIF compression",
      "Zero render-blocking scripts in the critical head path",
    ],
  },
  {
    id: "inp",
    acronym: "INP",
    name: "Interaction to Next Paint",
    value: "42ms",
    rating: "Good",
    benchmark: "Google Threshold: < 200ms",
    industryAvg: "Web Average: 180ms",
    summary:
      "Measures user responsiveness by tracking latency across all discrete clicks, taps, and keyboard inputs throughout the page lifecycle.",
    optimizations: [
      "Lightweight in-memory content caching avoiding unneeded re-queries",
      "Passive event listeners and requestAnimationFrame for scroll transitions",
      "Code-split admin bundles ensuring client main thread stays idle",
      "Component-level state isolation preventing parent subtree re-renders",
    ],
  },
  {
    id: "cls",
    acronym: "CLS",
    name: "Cumulative Layout Shift",
    value: "0.00",
    rating: "Good",
    benchmark: "Google Threshold: < 0.10",
    industryAvg: "eCommerce Average: 0.18",
    summary:
      "Measures visual stability by quantifying unexpected layout shifts that cause users to miss-click or lose reading position.",
    optimizations: [
      "Mandatory aspect-ratio and explicit dimensions on all media containers",
      "Anti-flash client theme script executing synchronously in document head",
      "Font display: swap with preconnected font origins",
      "Reserved skeleton loader geometry matching hydrated content dimensions",
    ],
  },
];

export const CoreWebVitalsInspector = () => {
  const [selectedId, setSelectedId] = useState<"lcp" | "inp" | "cls">("lcp");
  const selectedMetric = METRICS.find((m) => m.id === selectedId) || METRICS[0];

  return (
    <div className="rounded-lg border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#1B2228] p-6 sm:p-8 space-y-6 shadow-2xs">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E4DE] dark:border-[#27313A]">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#1F51D0] dark:text-[#4F7FF7]">
            <Activity className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Core Web Vitals Telemetry</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[#171F24] dark:text-[#F1F4F6] mt-0.5">
            Production Engineering Benchmarks
          </h3>
        </div>

        <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#F2F1EC] dark:bg-[#222B33] text-[#55626F] dark:text-[#97A3AF] self-start sm:self-auto">
          Audit: Lighthouse 100 / Mobile CWV
        </span>
      </div>

      {/* Metric Selector Cards */}
      <div
        role="tablist"
        aria-label="Core Web Vitals metrics"
        className="grid grid-cols-1 sm:grid-cols-3 gap-3"
      >
        {METRICS.map((metric) => {
          const isSelected = selectedId === metric.id;
          return (
            <button
              key={metric.id}
              role="tab"
              aria-selected={isSelected}
              onClick={() => setSelectedId(metric.id)}
              className={`p-4 rounded-md border text-left transition-all cursor-pointer ${
                isSelected
                  ? "border-[#1F51D0] dark:border-[#4F7FF7] bg-[#FBFBFA] dark:bg-[#13171B] ring-1 ring-[#1F51D0]/30 shadow-xs"
                  : "border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#1B2228] hover:bg-[#F2F1EC]/60 dark:hover:bg-[#222B33]/60"
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-mono text-xs font-bold text-[#171F24] dark:text-[#F1F4F6]">
                  {metric.acronym}
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                  {metric.rating}
                </span>
              </div>
              <p className="text-2xl font-mono font-extrabold text-[#171F24] dark:text-[#F1F4F6]">
                {metric.value}
              </p>
              <p className="text-[11px] text-[#55626F] dark:text-[#97A3AF] truncate mt-0.5">
                {metric.name}
              </p>
            </button>
          );
        })}
      </div>

      {/* Selected Metric Deep Dive */}
      <div
        role="tabpanel"
        className="p-5 rounded-md bg-[#FBFBFA] dark:bg-[#13171B] border border-[#E5E4DE] dark:border-[#27313A] space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E5E4DE] dark:border-[#27313A]">
          <div>
            <span className="font-mono text-xs font-bold text-[#1F51D0] dark:text-[#4F7FF7]">
              {selectedMetric.name} ({selectedMetric.acronym})
            </span>
            <p className="text-xs text-[#55626F] dark:text-[#97A3AF] mt-0.5">
              {selectedMetric.summary}
            </p>
          </div>
          <div className="text-xs font-mono text-[#55626F] dark:text-[#97A3AF] space-y-0.5 shrink-0 sm:text-right">
            <p className="text-emerald-700 dark:text-emerald-400 font-semibold">
              {selectedMetric.benchmark}
            </p>
            <p className="text-[11px]">{selectedMetric.industryAvg}</p>
          </div>
        </div>

        {/* Applied Engineering Techniques */}
        <div className="space-y-2">
          <p className="text-[11px] font-mono uppercase tracking-wider text-[#171F24] dark:text-[#F1F4F6] font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Applied Architectural Implementations:</span>
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#55626F] dark:text-[#97A3AF]">
            {selectedMetric.optimizations.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 bg-[#FFFFFF] dark:bg-[#1B2228] p-2.5 rounded border border-[#E5E4DE]/60 dark:border-[#27313A]/60"
              >
                <span className="text-emerald-600 dark:text-emerald-400 font-mono text-xs shrink-0">
                  &bull;
                </span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
