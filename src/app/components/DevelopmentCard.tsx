import { type ReactNode } from "react";
import { Baby, Heart, Scale, TrendingUp } from "lucide-react";
import type { WeekData } from "../data/pregnancyWeeks";
import { useApp } from "../context/AppContext";
import { getDisplayMeasurements } from "../utils/measurements";
import { localizeWeekList, localizeWeekText } from "../utils/localizedWeekContent";

interface DevelopmentCardProps {
  data: WeekData;
}

function Panel({ children, variant = "default" }: { children: ReactNode; variant?: "default" | "warm" }) {
  return (
    <section className={`rounded-[1.5rem] border p-5 shadow-sm ${
      variant === "warm" ? "bg-amber-50 border-amber-100" : "bg-white border-slate-200"
    }`}>
      {children}
    </section>
  );
}

export function DevelopmentCard({ data }: DevelopmentCardProps) {
  const { units, language, t } = useApp();
  const ro = language === "ro";
  const measurements = getDisplayMeasurements(data.week, data.babyWeight, data.babyLength, units);
  const milestones = localizeWeekList(data.babyThisWeek.milestones, language);

  return (
    <div className="space-y-4 w-full">
      <Panel>
        <div className="flex items-center gap-2 mb-3">
          <Scale className="h-5 w-5 text-slate-600" />
          <h3 className="text-[15px] font-semibold text-slate-900">{ro ? "Mărimea săptămânii" : "Size This Week"}</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-[12px] text-slate-500">{t("common.weight")}</div>
            <div className="text-[16px] font-semibold text-slate-900">{measurements.weight}</div>
          </div>
          <div>
            <div className="text-[12px] text-slate-500">{t("common.length")}</div>
            <div className="text-[16px] font-semibold text-slate-900">{measurements.length}</div>
          </div>
        </div>
      </Panel>

      <Panel>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-5 w-5 text-slate-600" />
          <h3 className="text-[15px] font-semibold text-slate-900">{ro ? "Etape de dezvoltare" : "Development Milestones"}</h3>
        </div>
        <ul className="space-y-2">
          {milestones.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Baby className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
              <span className="text-[14px] text-slate-700 leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel variant="warm">
        <div className="flex items-center gap-2 mb-3">
          <Heart className="h-5 w-5 text-amber-700" />
          <h3 className="text-[15px] font-semibold text-amber-950">{ro ? "Sfatul săptămânii pentru tata" : "Dad Tip of the Week"}</h3>
        </div>
        <p className="text-[14px] text-amber-900 leading-relaxed">{localizeWeekText(data.dadTip, language)}</p>
      </Panel>
    </div>
  );
}
