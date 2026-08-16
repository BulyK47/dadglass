import { useState } from "react";
import { Baby } from "lucide-react";
import { useApp } from "../context/AppContext";
import { getBabyLookForWeek } from "../data/babyLooks";

interface BabyLookCardProps {
  week: number;
  variant?: "home" | "detail";
}

export function BabyLookCard({ week, variant = "home" }: BabyLookCardProps) {
  const { language, t } = useApp();
  const lang = language === "ro" ? "ro" : "en";
  const look = getBabyLookForWeek(week);
  const wrapperClass = variant === "home" ? "mx-5 mb-5" : "";
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <section className={`${wrapperClass} bg-white rounded-[1.5rem] border border-slate-200 shadow-sm overflow-hidden`}>
      <div className="aspect-square bg-orange-50 overflow-hidden flex items-center justify-center">
        {imgFailed ? (
          <Baby className="w-16 h-16 text-orange-300" strokeWidth={1.5} />
        ) : (
          <img
            src={look.imagePath}
            alt={`${t("babyLook.title")} ${look.week}`}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-10 w-10 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
              <Baby className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500 font-semibold">
                {t("babyLook.subtitle")}
              </p>
              <h3 className="text-lg font-semibold text-slate-950 leading-tight">
                {t("babyLook.title")}
              </h3>
            </div>
          </div>
          <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {lang === "ro" ? `Săpt. ${look.week}` : `Week ${look.week}`}
          </span>
        </div>

        <p className="mt-4 text-[15px] leading-6 text-slate-700">{look.concept[lang]}</p>

        <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-100 p-4">
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500 font-semibold">
            {t("babyLook.visualFocus")}
          </p>
          <p className="mt-1 text-sm leading-5 text-slate-700">{look.visualFocus[lang]}</p>
        </div>

        <p className="mt-3 text-[11px] leading-4 text-slate-400">{t("babyLook.note")}</p>
      </div>
    </section>
  );
}
