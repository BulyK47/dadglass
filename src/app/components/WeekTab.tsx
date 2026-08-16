import { useRef, useState, type ComponentType, type ReactNode } from "react";
import { Bookmark, Calendar, ChevronLeft, ChevronRight, ClipboardList, Heart, MapPin, MessageCircle, Baby } from "lucide-react";
import { pregnancyWeeks, type WeekData } from "../data/pregnancyWeeks";
import { getDadObjectForWeek } from "../data/dadObjects";
import { useApp } from "../context/AppContext";
import { usePersistedSet, usePersistedState } from "../hooks/usePersisted";
import { getDisplayMeasurements } from "../utils/measurements";
import { localizeWeekList, localizeWeekText } from "../utils/localizedWeekContent";
import { DadObjectAsset } from "./DadObjectSVG";
import { GlassAsset } from "./VectorGlass";
import { BabyLookCard } from "./BabyLookCard";

const GLASS_ACCENT: Record<string, { dot: string; badge: string }> = {
  "Shot Glass":        { dot: "bg-slate-400",  badge: "bg-slate-100 text-slate-600" },
  "Cordial Glass":     { dot: "bg-stone-400",  badge: "bg-stone-100 text-stone-600" },
  "Nick & Nora Glass": { dot: "bg-slate-500",  badge: "bg-slate-100 text-slate-700" },
  "Rocks Glass":       { dot: "bg-slate-600",  badge: "bg-slate-200 text-slate-700" },
  "Wine Glass":        { dot: "bg-rose-400",   badge: "bg-rose-50 text-rose-700" },
  "Highball Glass":    { dot: "bg-sky-400",    badge: "bg-sky-50 text-sky-700" },
  "Collins Glass":     { dot: "bg-teal-400",   badge: "bg-teal-50 text-teal-700" },
  "Goblet":            { dot: "bg-purple-400", badge: "bg-purple-50 text-purple-700" },
  "Hurricane Glass":   { dot: "bg-orange-400", badge: "bg-orange-50 text-orange-700" },
  "Pint Glass":        { dot: "bg-amber-500",  badge: "bg-amber-50 text-amber-700" },
};

function getGlassAccent(glassType: string) {
  const value = glassType.toLowerCase();
  if (value.includes("shot")) return GLASS_ACCENT["Shot Glass"];
  if (value.includes("cordial")) return GLASS_ACCENT["Cordial Glass"];
  if (value.includes("rocks")) return GLASS_ACCENT["Rocks Glass"];
  if (value.includes("nick")) return GLASS_ACCENT["Nick & Nora Glass"];
  if (value.includes("wine")) return GLASS_ACCENT["Wine Glass"];
  if (value.includes("goblet")) return GLASS_ACCENT["Goblet"];
  if (value.includes("highball")) return GLASS_ACCENT["Highball Glass"];
  if (value.includes("collins")) return GLASS_ACCENT["Collins Glass"];
  if (value.includes("hurricane")) return GLASS_ACCENT["Hurricane Glass"];
  if (value.includes("pint") || value.includes("mug")) return GLASS_ACCENT["Pint Glass"];
  return { dot: "bg-slate-400", badge: "bg-slate-100 text-slate-600" };
}

type TrimesterFilter = "all" | "First Trimester" | "Second Trimester" | "Third Trimester" | "Birth";

function DetailSection({ title, icon: Icon, children }: {
  title: string;
  icon: ComponentType<{ className?: string; strokeWidth?: string | number }>;
  children: ReactNode;
}) {
  return (
    <section className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm p-5">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center">
          <Icon className="w-4 h-4 text-slate-700" strokeWidth={2} />
        </div>
        <h3 className="text-[15px] font-semibold text-slate-900">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-[14px] text-slate-700 leading-relaxed">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function questionForWeek(week: number) {
  if (week <= 12) return "What symptoms should we watch for between appointments?";
  if (week <= 20) return "What should we ask at the scan?";
  if (week <= 28) return "What support would make this week easier?";
  if (week <= 36) return "What do we still need before birth feels manageable?";
  return "When should we call instead of waiting?";
}

function questionForWeekRo(week: number) {
  if (week <= 12) return "La ce simptome ar trebui să fim atenți între programări?";
  if (week <= 20) return "Ce ar trebui să întrebăm la ecografie?";
  if (week <= 28) return "Ce sprijin ar face săptămâna asta mai ușoară?";
  if (week <= 36) return "Ce ne mai trebuie ca nașterea să pară gestionabilă?";
  return "Când ar trebui să sunăm, în loc să așteptăm?";
}

function WeekDetailScreen({ weekData, onBack, onSetCurrent }: {
  weekData: WeekData;
  onBack: () => void;
  onSetCurrent: () => void;
}) {
  const { comparisonMode, units, language, t } = useApp();
  const ro = language === "ro";
  const weekBookmarks = usePersistedSet("dg_week_bookmarks");
  const [weekNotes, setWeekNotes] = usePersistedState<Record<string, string>>("dg_week_notes", {});
  const bookmarkKey = String(weekData.week);
  const bookmarked = weekBookmarks.has(bookmarkKey);
  const dadObj = getDadObjectForWeek(weekData.week, language);
  const comparisonLabel = comparisonMode === "dad-object" && dadObj ? dadObj.name : localizeWeekText(weekData.glassType, language);
  const measurements = getDisplayMeasurements(weekData.week, weekData.babyWeight, weekData.babyLength, units);

  return (
    <div>
      <div className="bg-white/95 backdrop-blur-sm border-b border-slate-200 px-5 py-5 sticky top-0 z-10">
        <button onClick={onBack} className="inline-flex items-center gap-2 min-h-[44px] text-[13px] font-semibold text-slate-600 mb-3">
          <ChevronLeft className="w-4 h-4" />
          {t("nav.journey")}
        </button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.08em] mb-0.5">
              {ro ? "Detalii săptămână" : "Week Detail"}
            </div>
            <h2 className="text-[1.5rem] font-semibold text-slate-900 leading-none tracking-tight">
              {t("journey.weekOf", { w: weekData.week })}
            </h2>
            <p className="text-[13px] text-slate-500 mt-2">{comparisonLabel} · {measurements.weight} · {measurements.length}</p>
          </div>
          <button
            onClick={() => weekBookmarks.toggle(bookmarkKey)}
            className={`w-11 h-11 rounded-full flex items-center justify-center border ${bookmarked ? "bg-amber-100 border-amber-200 text-amber-700" : "bg-white border-slate-200 text-slate-400"}`}
            aria-label={ro ? "Salvează săptămâna" : "Save week"}
          >
            <Bookmark className="w-5 h-5" fill={bookmarked ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      <div className="px-5 py-5 pb-8 space-y-4">
        <BabyLookCard week={weekData.week} variant="detail" />

        <DetailSection icon={Baby} title={ro ? "Dezvoltarea bebelușului" : "Baby development"}>
          <p className="text-[14px] text-slate-700 leading-relaxed mb-3">{localizeWeekText(weekData.babyThisWeek.summary, language)}</p>
          <BulletList items={localizeWeekList(weekData.babyThisWeek.milestones, language)} />
        </DetailSection>

        <DetailSection icon={Heart} title={ro ? "Ce poate simți partenera" : "Partner may feel"}>
          <div className="space-y-4">
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.08em] mb-2">{t("home.physical")}</div>
              <BulletList items={localizeWeekList(weekData.momThisWeek.physical, language)} />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.08em] mb-2">{t("home.emotionalState")}</div>
              <BulletList items={localizeWeekList(weekData.momThisWeek.emotional, language)} />
            </div>
          </div>
        </DetailSection>

        <DetailSection icon={ClipboardList} title={ro ? "Acțiuni pentru tata și checklist" : "Dad actions and checklist"}>
          <BulletList items={localizeWeekList(weekData.dadActions, language)} />
          <div className="mt-4 rounded-xl bg-slate-50 border border-slate-100 p-3">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.08em] mb-1">{ro ? "Săptămâna asta" : "This week"}</div>
            <p className="text-[13px] text-slate-700 leading-relaxed">{localizeWeekText(weekData.headsUp, language)}</p>
          </div>
        </DetailSection>

        <DetailSection icon={MessageCircle} title={t("home.questionToAsk")}>
          <p className="text-[14px] text-slate-800 leading-relaxed">{ro ? questionForWeekRo(weekData.week) : questionForWeek(weekData.week)}</p>
          {weekData.sayThis && (
            <p className="text-[13px] text-slate-500 leading-relaxed mt-3">{ro ? "Încearcă să spui" : "Try saying"}: "{localizeWeekText(weekData.sayThis, language)}"</p>
          )}
        </DetailSection>

        <DetailSection icon={Calendar} title={ro ? "Notițe de la programare" : "Appointment notes"}>
          <div className="space-y-3">
            {[
              ["Questions asked", "Întrebări puse"],
              ["Answers", "Răspunsuri"],
              ["Next steps", "Pași următori"],
              ["Next appointment", "Următoarea programare"],
            ].map(([label, labelRo]) => {
              const noteKey = `${weekData.week}:${label}`;
              return (
                <label key={label} className="block">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.08em] block mb-1.5">{ro ? labelRo : label}</span>
                  <input
                    value={weekNotes[noteKey] ?? ""}
                    onChange={(e) => { const v = e.target.value; setWeekNotes((cur) => ({ ...cur, [noteKey]: v })); }}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-[14px] outline-none focus:ring-2 focus:ring-slate-300"
                    placeholder={ro ? "Adaugă o notiță" : "Add a note"}
                  />
                </label>
              );
            })}
          </div>
        </DetailSection>

        <button
          onClick={onSetCurrent}
          className="w-full min-h-[44px] rounded-xl bg-slate-900 text-white text-[14px] font-semibold"
        >
          {ro ? "Setează ca săptămână curentă" : "Set as current week"}
        </button>
      </div>
    </div>
  );
}

export function WeekTab() {
  const { currentWeek, setCurrentWeek, comparisonMode, setComparisonMode, units, language, t } = useApp();
  const [trimesterFilter, setTrimesterFilter] = useState<TrimesterFilter>("all");
  const [selectedWeek, setSelectedWeek] = useState<WeekData | null>(null);
  const currentRowRef = useRef<HTMLButtonElement | null>(null);

  const jumpToCurrent = () => {
    // Make sure the current week is visible (reset the filter), then scroll to it.
    setTrimesterFilter("all");
    setTimeout(() => currentRowRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 60);
  };

  const progressPct = Math.round(((currentWeek - 4) / 36) * 100);

  const filteredWeeks = trimesterFilter === "all"
    ? pregnancyWeeks
    : trimesterFilter === "Birth"
    ? pregnancyWeeks.filter(w => w.week >= 37)
    : pregnancyWeeks.filter(w => w.trimester === trimesterFilter);

  const trimesters: Array<{ label: string; key: TrimesterFilter; i18nKey: string }> = [
    { label: "All",    key: "all",              i18nKey: "checklist.all" },
    { label: "First",  key: "First Trimester",  i18nKey: "journey.firstTrimester" },
    { label: "Second", key: "Second Trimester", i18nKey: "journey.secondTrimester" },
    { label: "Third",  key: "Third Trimester",  i18nKey: "journey.thirdTrimester" },
    { label: "Birth",  key: "Birth",            i18nKey: "checklist.birthPrepSection" },
  ];

  const grouped = trimesterFilter === "all" ? [
    { label: t("journey.firstTrimester"),  weeks: filteredWeeks.filter(w => w.trimester === "First Trimester") },
    { label: t("journey.secondTrimester"), weeks: filteredWeeks.filter(w => w.trimester === "Second Trimester") },
    { label: t("journey.thirdTrimester"),  weeks: filteredWeeks.filter(w => w.trimester === "Third Trimester") },
  ] : [{ label: trimesterFilter, weeks: filteredWeeks }];

  if (selectedWeek) {
    return (
      <WeekDetailScreen
        weekData={selectedWeek}
        onBack={() => setSelectedWeek(null)}
        onSetCurrent={() => {
          setCurrentWeek(selectedWeek.week);
          setSelectedWeek(null);
        }}
      />
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-slate-200 px-5 py-5 sticky top-0 z-10">
        <div className="flex items-start justify-between mb-1">
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.08em] mb-0.5">
              {t("journey.yourJourney")}
            </div>
            <div className="text-[1.5rem] font-semibold text-slate-900 leading-none tracking-tight">
              {t("journey.weekOf", { w: currentWeek })}
            </div>
          </div>
          <button
            onClick={jumpToCurrent}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-[12px] font-semibold text-slate-700 active:bg-slate-200 transition-colors mt-1"
          >
            <MapPin className="w-3 h-3" strokeWidth={2.5} />
            {t("journey.jumpToCurrent")}
          </button>
        </div>

        <div className="flex items-center gap-3 mt-3 mb-3">
          <div className="flex-1 bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-slate-600 to-slate-700 h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-[12px] text-slate-500 font-medium tabular-nums">{progressPct}%</span>
        </div>

        {/* Trimester filter tabs */}
        <div className="flex flex-wrap gap-1.5 pb-0.5">
          {trimesters.map(tri => (
            <button
              key={tri.key}
              onClick={() => setTrimesterFilter(tri.key)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-200 ${
                trimesterFilter === tri.key
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {tri.key === "Birth" ? (language === "ro" ? "Naștere" : "Birth") : t(tri.i18nKey as any)}
            </button>
          ))}
        </div>

        <div className="flex items-center bg-slate-100 rounded-full p-1 gap-0.5 mt-3 w-fit">
          <button
            onClick={() => setComparisonMode("glass")}
            className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all ${comparisonMode === "glass" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
          >
            {t("journey.glass")}
          </button>
          <button
            onClick={() => setComparisonMode("dad-object")}
            className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all ${comparisonMode === "dad-object" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
          >
            {t("journey.dadObject")}
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="px-5 pt-5 pb-6 space-y-6">
        {grouped.map((group) => (
          <div key={group.label}>
            {trimesterFilter === "all" && (
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.08em] mb-3">
                {group.label}
              </div>
            )}

            <div className="bg-white rounded-[1.5rem] border border-slate-200 overflow-hidden shadow-sm divide-y divide-slate-100">
              {group.weeks.map((week) => {
                const isCurrent = week.week === currentWeek;
                const isPast = week.week < currentWeek;
                const accent = getGlassAccent(week.glassType);
                const dadObj = getDadObjectForWeek(week.week, language);
                const badgeLabel = comparisonMode === "dad-object" && dadObj ? dadObj.name : localizeWeekText(week.glassType, language);
                const measurements = getDisplayMeasurements(week.week, week.babyWeight, week.babyLength, units);

                return (
                  <button
                    key={week.week}
                    ref={isCurrent ? currentRowRef : undefined}
                    onClick={() => setSelectedWeek(week)}
                    className={`w-full flex items-center gap-4 px-4 py-3.5 text-left transition-colors duration-150 active:bg-slate-50 ${
                      isCurrent ? "bg-slate-50" : "bg-white hover:bg-slate-50/60"
                    }`}
                  >
                    {/* Week number */}
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-[13px] font-semibold transition-all ${
                      isCurrent
                        ? "bg-slate-900 text-white"
                        : isPast
                        ? "bg-slate-100 text-slate-500"
                        : "bg-slate-50 text-slate-400"
                    }`}>
                      {week.week}
                    </div>

                    {comparisonMode === "glass" ? (
                      <div className="w-10 h-12 flex-shrink-0 -my-1" aria-hidden="true">
                        <GlassAsset
                          glassType={week.glassType}
                          fillPercent={week.fillPercent}
                          week={week.week}
                        />
                      </div>
                    ) : dadObj ? (
                      <div className="w-10 h-12 flex-shrink-0 -my-1" aria-hidden="true">
                        <DadObjectAsset
                          imageFile={dadObj.imageFile}
                          assetId={dadObj.assetId}
                          type={dadObj.type}
                          variant={dadObj.variant ?? week.week - 4}
                          label={dadObj.name}
                          className="w-full h-full"
                        />
                      </div>
                    ) : null}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className={`text-[12px] px-2 py-0.5 rounded-full font-medium ${accent.badge}`}>
                          {badgeLabel}
                        </span>
                        {isCurrent && (
                          <span className="text-[11px] font-semibold text-slate-900 bg-slate-200 px-2 py-0.5 rounded-full">
                            {t("common.current")}
                          </span>
                        )}
                      </div>
                      <p className={`text-[13px] leading-snug truncate ${isCurrent ? "text-slate-800 font-medium" : isPast ? "text-slate-500" : "text-slate-400"}`}>
                        {localizeWeekText(week.babyThisWeek.milestones[0], language)}
                      </p>
                    </div>

                    {/* Weight + Length */}
                    <div className="text-right flex-shrink-0 flex flex-col items-end gap-0.5">
                      <div className={`text-[12px] font-semibold tabular-nums leading-tight ${isCurrent ? "text-slate-800" : isPast ? "text-slate-500" : "text-slate-300"}`}>
                        {measurements.weight}
                      </div>
                      <div className={`text-[11px] tabular-nums leading-tight ${isCurrent ? "text-slate-500" : isPast ? "text-slate-400" : "text-slate-300"}`}>
                        {measurements.length}
                      </div>
                      <ChevronRight className={`w-4 h-4 mt-1 ${isCurrent ? "text-slate-700" : "text-slate-300"}`} strokeWidth={2} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <p className="text-center text-[12px] text-slate-400 pb-2">
          {t("journey.tapToView")}
        </p>
      </div>
    </div>
  );
}
