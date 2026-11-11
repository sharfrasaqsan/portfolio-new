import { useState, useEffect } from "react";

export const TimezoneStatus = ({ compact = false }: { compact?: boolean }) => {
  const [timeString, setTimeString] = useState("");
  const [isWorkingHours, setIsWorkingHours] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        // Format current time in Asia/Colombo
        const formatter = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Colombo",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
        setTimeString(formatter.format(now));

        // Check hour and day of week in Colombo
        const parts = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Colombo",
          hour: "numeric",
          minute: "numeric",
          weekday: "short",
          hour12: false,
        }).formatToParts(now);

        const hourPart = parts.find((p) => p.type === "hour")?.value;
        const minutePart = parts.find((p) => p.type === "minute")?.value;
        const weekdayPart = parts.find((p) => p.type === "weekday")?.value;

        const currentHour = parseInt(hourPart || "0", 10);
        const currentMinute = parseInt(minutePart || "0", 10);
        const timeInMinutes = currentHour * 60 + currentMinute;

        // Working hours: Monday - Friday, 08:30 (510 min) to 18:30 (1110 min)
        const isWeekday = weekdayPart !== "Sat" && weekdayPart !== "Sun";
        const withinHours =
          isWeekday && timeInMinutes >= 510 && timeInMinutes <= 1110;

        setIsWorkingHours(withinHours);
      } catch {
        setTimeString("11:00 AM");
        setIsWorkingHours(true);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 30000); // 30-sec refresh
    return () => clearInterval(interval);
  }, []);

  if (!timeString) return null;

  if (compact) {
    return (
      <div
        className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#55626F] dark:text-[#97A3AF]"
        title="Current local time in Colombo, Sri Lanka (UTC+5:30)"
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isWorkingHours ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
          }`}
          aria-hidden="true"
        />
        <span>Colombo {timeString}</span>
      </div>
    );
  }

  return (
    <div
      className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#1B2228] text-xs font-mono text-[#55626F] dark:text-[#97A3AF] shadow-2xs"
      title="Colombo, Sri Lanka standard working hours: 08:30 – 18:30 (UTC+5:30)"
    >
      <span
        className={`w-2 h-2 rounded-full ${
          isWorkingHours ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
        }`}
        aria-hidden="true"
      />
      <span className="text-[#171F24] dark:text-[#F1F4F6] font-semibold">
        Colombo {timeString}
      </span>
      <span className="text-[#55626F]/60 dark:text-[#97A3AF]/60">·</span>
      <span>{isWorkingHours ? "Available now" : "Offline"}</span>
    </div>
  );
};
