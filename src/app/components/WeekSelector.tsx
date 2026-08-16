import { ChevronLeft, ChevronRight } from "lucide-react";
import { useApp } from "../context/AppContext";

interface WeekSelectorProps {
  currentWeek: number;
  onWeekChange: (week: number) => void;
}

export function WeekSelector({ currentWeek, onWeekChange }: WeekSelectorProps) {
  const { language, t } = useApp();
  const handlePrevious = () => {
    if (currentWeek > 4) {
      onWeekChange(currentWeek - 1);
    }
  };

  const handleNext = () => {
    if (currentWeek < 40) {
      onWeekChange(currentWeek + 1);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 w-full max-w-md mx-auto">
      <button
        onClick={handlePrevious}
        disabled={currentWeek <= 4}
        className="w-11 h-11 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-700 disabled:opacity-30"
        aria-label={language === "ro" ? "Săptămâna anterioară" : "Previous week"}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      
      <div className="flex-1 text-center">
        <div className="text-sm text-slate-600">{t("home.pregnancyWeek")}</div>
        <div className="text-4xl font-bold text-slate-900">{currentWeek}</div>
        <div className="text-xs text-slate-500 mt-1">
          {40 - currentWeek} {40 - currentWeek === 1 ? t("home.weekToGo") : t("home.weeksToGo")}
        </div>
      </div>
      
      <button
        onClick={handleNext}
        disabled={currentWeek >= 40}
        className="w-11 h-11 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-700 disabled:opacity-30"
        aria-label={language === "ro" ? "Săptămâna următoare" : "Next week"}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
