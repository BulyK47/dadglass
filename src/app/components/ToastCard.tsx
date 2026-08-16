import { Wine } from "lucide-react";
import { useApp } from "../context/AppContext";
import { localizeWeekText } from "../utils/localizedWeekContent";

interface ToastCardProps {
  toast: string;
  week: number;
}

export function ToastCard({ toast, week }: ToastCardProps) {
  const { language } = useApp();

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-[1.5rem] p-5 mx-5 mb-5 border border-amber-100">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
          <Wine className="w-5 h-5 text-amber-600" strokeWidth={2} />
        </div>
        <div className="flex-1">
          <div className="text-[11px] font-semibold text-amber-700 uppercase tracking-wide mb-0.5">
            {language === "ro" ? `Toastul săptămânii ${week}` : `Week ${week} Toast`}
          </div>
          <p className="text-[16px] font-medium text-amber-900 italic leading-snug">
            "{localizeWeekText(toast, language)}"
          </p>
        </div>
      </div>
    </div>
  );
}
