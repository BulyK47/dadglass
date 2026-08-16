import { GlassAsset } from "./VectorGlass";
import { DadObjectAsset } from "./DadObjectSVG";
import { getDadObjectForWeek } from "../data/dadObjects";
import { useApp } from "../context/AppContext";
import { getDisplayMeasurements } from "../utils/measurements";
import { localizeWeekText } from "../utils/localizedWeekContent";

interface GlassComparisonCardProps {
  glassType: string;
  fillDescription: string;
  fillPercent: number;
  week: number;
  trimester: string;
  babyWeight?: string;
  babyLength?: string;
}

export function GlassComparisonCard({
  glassType, fillDescription, fillPercent, week, trimester, babyWeight, babyLength
}: GlassComparisonCardProps) {
  const { comparisonMode, setComparisonMode, units, language, t } = useApp();
  const dadObj = getDadObjectForWeek(week, language);
  const isDad = comparisonMode === "dad-object";
  const measurements = getDisplayMeasurements(week, babyWeight, babyLength, units);
  const trimesterLabel = language === "ro"
    ? trimester === "First Trimester" ? t("journey.firstTrimester")
    : trimester === "Second Trimester" ? t("journey.secondTrimester")
    : trimester === "Third Trimester" ? t("journey.thirdTrimester")
    : trimester
    : trimester;
  const glassLabel = localizeWeekText(glassType, language);

  return (
    <div className="bg-gradient-to-br from-white to-slate-50/80 rounded-[2rem] p-6 mx-5 mb-5 shadow-sm border border-slate-100">
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.08em]">
          {t("home.glassComparison")}
        </div>

        {/* Mode toggle */}
        <div className="flex items-center bg-slate-100 rounded-full p-1 gap-0.5">
          <button
            onClick={() => setComparisonMode("glass")}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all duration-200 ${
              !isDad ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
            }`}
          >
            {t("journey.glass")}
          </button>
          <button
            onClick={() => setComparisonMode("dad-object")}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all duration-200 ${
              isDad ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
            }`}
          >
            {t("journey.dadObject")}
          </button>
        </div>
      </div>

      {/* Illustration */}
      <div className="flex justify-center mb-6">
        <div className="w-44 h-56">
          {isDad && dadObj
            ? <DadObjectAsset imageFile={dadObj.imageFile} assetId={dadObj.assetId} type={dadObj.type} variant={dadObj.variant ?? week - 4} label={dadObj.name} className="w-full h-full" />
            : <GlassAsset glassType={glassType} fillPercent={fillPercent} week={week} />
          }
        </div>
      </div>

      {/* Label + description */}
      <div className="text-center space-y-2">
        <div className="text-[1.625rem] font-semibold text-slate-900 leading-tight tracking-tight">
          {isDad && dadObj ? dadObj.name : glassLabel}
        </div>
        <p className="text-[14px] text-slate-600 leading-relaxed max-w-xs mx-auto">
          {isDad && dadObj ? dadObj.description : localizeWeekText(fillDescription, language)}
        </p>

        <div className="flex items-center justify-center gap-5 pt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[11px] text-slate-400 uppercase tracking-wide font-semibold">{t("common.weight")}</span>
            <span className="text-[15px] text-slate-700 font-semibold">{measurements.weight}</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[11px] text-slate-400 uppercase tracking-wide font-semibold">{t("common.length")}</span>
            <span className="text-[15px] text-slate-700 font-semibold">{measurements.length}</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-6 pt-5 border-t border-slate-200">
        <div className="flex items-center justify-between text-[12px] mb-2">
          <span className="text-slate-500 font-medium">{trimesterLabel}</span>
          <span className="text-slate-500 font-medium">{t("journey.weekOf", { w: week })}</span>
        </div>
        <div className="bg-slate-200 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-slate-600 to-slate-700 h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${((week - 4) / 36) * 100}%` }}
          />
        </div>
      </div>

      {/* Inline disclaimer */}
      <p className="text-center text-[11px] text-slate-400 mt-4">
        {language === "ro" ? "Comparațiile de mărime sunt doar repere simbolice." : "Size comparisons are symbolic references only."}
      </p>
    </div>
  );
}
