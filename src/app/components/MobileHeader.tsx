import { ChevronLeft, ChevronRight } from "lucide-react";
import { useApp } from "../context/AppContext";

interface MobileHeaderProps {
  week: number;
  onWeekChange: (week: number) => void;
}

export function MobileHeader({ week, onWeekChange }: MobileHeaderProps) {
  const { t } = useApp();
  const weeksToGo = 40 - week;

  return (
    <div className="bg-white/95 backdrop-blur-sm border-b border-slate-200 px-5 py-5 pt-safe sticky top-0 z-10">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => week > 4 && onWeekChange(week - 1)}
          disabled={week <= 4}
          className="p-2.5 rounded-full hover:bg-slate-100 active:bg-slate-200 disabled:opacity-20 disabled:hover:bg-transparent transition-all duration-200"
          aria-label="Previous week"
        >
          <ChevronLeft className="w-5 h-5 text-slate-700" strokeWidth={2.5} />
        </button>

        <div className="text-center flex-1">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.08em] mb-1">
            {t("home.pregnancyWeek")}
          </div>
          <div className="text-[2.25rem] font-semibold text-slate-900 leading-none tracking-tight">{week}</div>
        </div>

        <button
          onClick={() => week < 40 && onWeekChange(week + 1)}
          disabled={week >= 40}
          className="p-2.5 rounded-full hover:bg-slate-100 active:bg-slate-200 disabled:opacity-20 disabled:hover:bg-transparent transition-all duration-200"
          aria-label="Next week"
        >
          <ChevronRight className="w-5 h-5 text-slate-700" strokeWidth={2.5} />
        </button>
      </div>

      <div className="text-center text-[14px] text-slate-600 font-medium">
        {weeksToGo} {weeksToGo === 1 ? t("home.weekToGo") : t("home.weeksToGo")}
      </div>
    </div>
  );
}
