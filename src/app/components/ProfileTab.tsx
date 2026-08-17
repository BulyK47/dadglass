import { type ComponentType, type ReactNode } from "react";
import { User, Calendar, Baby, Lock, Globe, Ruler, ToggleLeft, BookOpen, Info, ChevronRight, Bell, Briefcase, ShieldCheck, MessageCircle, ClipboardList, Smartphone } from "lucide-react";
import { useApp } from "../context/AppContext";
import { type FeatureKey } from "./FeatureScreens";
import { weekFromDueDate } from "../utils/dueDate";
import { isNative } from "../utils/platform";

interface ProfileTabProps {
  onOpenJournal: () => void;
  onOpenFeature: (feature: FeatureKey) => void;
  onOpenInstall: () => void;
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.08em] mb-2 px-1">
      {children}
    </div>
  );
}

function ActionRow({ icon: Icon, title, subtitle, onClick }: {
  icon: ComponentType<{ className?: string; strokeWidth?: string | number }>;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-slate-50 active:bg-slate-100 transition-colors"
    >
      <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-slate-600" strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-semibold text-slate-900">{title}</div>
        <div className="text-[12px] text-slate-500 leading-snug">{subtitle}</div>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-400" strokeWidth={2} />
    </button>
  );
}

export function ProfileTab({ onOpenJournal, onOpenFeature, onOpenInstall }: ProfileTabProps) {
  const {
    profile, updateProfile, currentWeek, setCurrentWeek,
    language, setLanguage, units, setUnits,
    comparisonMode, setComparisonMode, resetAllData, t,
  } = useApp();

  const calculatedWeek = weekFromDueDate(profile.dueDate);

  const handleDueDateChange = (dueDate: string) => {
    updateProfile({ dueDate });
    const week = weekFromDueDate(dueDate);
    if (week !== null) setCurrentWeek(week);
  };

  const nameForInitials = (profile.dadName || profile.partnerName).trim();
  const initials = nameForInitials
    ? nameForInitials.split(/\s+/).filter(Boolean).map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <div>
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-slate-200 px-5 pt-5 pb-5 pt-safe sticky top-0 z-10">
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.08em] mb-0.5">
          {t("nav.profile")}
        </div>
        <div className="text-[1.5rem] font-semibold text-slate-900 leading-none tracking-tight">
          {t("profile.title")}
        </div>
      </div>

      <div className="px-5 pt-6 pb-8 space-y-6">
        {/* Avatar */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center">
            <span className="text-[1.5rem] font-semibold text-white tracking-wide">{initials}</span>
          </div>
        </div>

        {/* Partner details */}
        <div>
          <SectionLabel>{language === "ro" ? "Detalii sarcină" : "Pregnancy Details"}</SectionLabel>
          <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
            <div className="px-5 py-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-slate-500" strokeWidth={2} />
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.08em]">
                  {t("profile.dadName")}
                </label>
              </div>
              <input
                type="text"
                value={profile.dadName}
                onChange={e => updateProfile({ dadName: e.target.value })}
                placeholder={language === "ro" ? "ex. Andrei" : "e.g. Alex"}
                className="w-full text-[16px] text-slate-900 placeholder-slate-300 bg-transparent outline-none font-medium"
              />
            </div>

            <div className="px-5 py-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-slate-500" strokeWidth={2} />
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.08em]">
                  {t("profile.partnerName")}
                </label>
              </div>
              <input
                type="text"
                value={profile.partnerName}
                onChange={e => updateProfile({ partnerName: e.target.value })}
                placeholder={language === "ro" ? "ex. Ana" : "e.g. Sarah"}
                className="w-full text-[16px] text-slate-900 placeholder-slate-300 bg-transparent outline-none font-medium"
              />
            </div>

            <div className="px-5 py-4">
              <div className="flex items-center gap-2 mb-2">
                <Baby className="w-4 h-4 text-slate-500" strokeWidth={2} />
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.08em]">
                  {t("profile.babyNickname")}
                </label>
              </div>
              <input
                type="text"
                value={profile.babyNickname}
                onChange={e => updateProfile({ babyNickname: e.target.value })}
                placeholder={language === "ro" ? "ex. Pui mic (opțional)" : "e.g. Jellybean (optional)"}
                className="w-full text-[16px] text-slate-900 placeholder-slate-300 bg-transparent outline-none font-medium"
              />
            </div>

            <div className="px-5 py-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-slate-500" strokeWidth={2} />
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.08em]">
                  {t("profile.dueDate")}
                </label>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <input
                  type="date"
                  value={profile.dueDate}
                  onChange={e => handleDueDateChange(e.target.value)}
                  className="text-[16px] text-slate-900 bg-transparent outline-none font-medium flex-1"
                />
                {calculatedWeek !== null && (
                  <div className="text-right flex-shrink-0">
                    <div className="text-[11px] text-slate-500 uppercase tracking-[0.06em] font-semibold">{t("common.week")}</div>
                    <div className="text-[1.5rem] font-semibold text-slate-900 leading-none">{calculatedWeek}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Manual week */}
        <div>
          <SectionLabel>{t("profile.currentWeek")}</SectionLabel>
          <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm">
            <div className="px-5 py-4 flex items-center justify-between">
              <div className="text-[14px] text-slate-700">
                {t("journey.weekOf", { w: currentWeek })}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => currentWeek > 4 && setCurrentWeek(currentWeek - 1)}
                  disabled={currentWeek <= 4}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-semibold text-lg disabled:opacity-30 active:bg-slate-200 transition-colors"
                >
                  -
                </button>
                <span className="text-[1.5rem] font-semibold text-slate-900 leading-none w-8 text-center tabular-nums">
                  {currentWeek}
                </span>
                <button
                  onClick={() => currentWeek < 40 && setCurrentWeek(currentWeek + 1)}
                  disabled={currentWeek >= 40}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-semibold text-lg disabled:opacity-30 active:bg-slate-200 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
            <div className="px-5 pb-4">
              <button
                onClick={() => setCurrentWeek(4)}
                className="w-full min-h-[40px] rounded-xl bg-slate-100 text-slate-700 text-[13px] font-semibold"
              >
                {language === "ro" ? "Nu știu exact - pornește de la săptămâna 4" : "Not sure yet - start from week 4"}
              </button>
              <p className="text-[12px] text-slate-500 leading-relaxed mt-2">
                {language === "ro" ? "Dacă știi săptămâna, seteaz-o aici manual." : "If you know the current week, set it manually here."}
              </p>
            </div>
          </div>
        </div>

        {/* App preferences */}
        <div>
          <SectionLabel>{language === "ro" ? "Preferințe" : "Preferences"}</SectionLabel>
          <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
            {/* Language */}
            <div className="px-5 py-4">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-4 h-4 text-slate-500" strokeWidth={2} />
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.08em]">
                  {t("profile.language")}
                </span>
              </div>
              <div className="flex gap-2">
                {(["en", "ro"] as const).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold border transition-all ${
                      language === lang
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-600 border-slate-200"
                    }`}
                  >
                    <span className="text-[11px] uppercase tracking-[0.08em]">{lang}</span>
                    <span>{lang === "en" ? "English" : "Română"}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Units */}
            <div className="px-5 py-4">
              <div className="flex items-center gap-2 mb-3">
                <Ruler className="w-4 h-4 text-slate-500" strokeWidth={2} />
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.08em]">
                  {t("profile.units")}
                </span>
              </div>
              <div className="flex gap-2">
                {(["metric", "imperial"] as const).map(u => (
                  <button
                    key={u}
                    onClick={() => setUnits(u)}
                    className={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold border transition-all ${
                      units === u
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-600 border-slate-200"
                    }`}
                  >
                    {u === "metric" ? t("profile.metric") : t("profile.imperial")}
                  </button>
                ))}
              </div>
            </div>

            {/* Comparison mode */}
            <div className="px-5 py-4">
              <div className="flex items-center gap-2 mb-3">
                <ToggleLeft className="w-4 h-4 text-slate-500" strokeWidth={2} />
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.08em]">
                  {t("profile.comparisonMode")}
                </span>
              </div>
              <div className="flex gap-2">
                {(["glass", "dad-object"] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setComparisonMode(mode)}
                    className={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold border transition-all ${
                      comparisonMode === mode
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-600 border-slate-200"
                    }`}
                  >
                    {mode === "glass" ? t("profile.glass") : t("profile.dadObject")}
                  </button>
                ))}
              </div>
            </div>

            <ActionRow
              icon={Bell}
              title={t("profile.notifications")}
              subtitle={language === "ro" ? "Alege memento de sprijin pentru parteneră" : "Choose supportive partner nudges"}
              onClick={() => onOpenFeature("support-reminders")}
            />

            <ActionRow
              icon={Calendar}
              title={t("profile.calendarSync")}
              subtitle={language === "ro" ? "Folosește fișiere .ics sau linkuri Google Calendar" : "Use .ics downloads or Google Calendar links in reminders"}
              onClick={() => onOpenFeature("appointment")}
            />
          </div>
        </div>

        {/* Features */}
        <div>
          <SectionLabel>{language === "ro" ? "Spațiul tău" : "Your Space"}</SectionLabel>
          <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
            <ActionRow icon={BookOpen} title={t("profile.journal")} subtitle={language === "ro" ? "Întrebări săptămânale și stare" : "Weekly prompts + mood tracking"} onClick={onOpenJournal} />
            <ActionRow icon={Calendar} title={language === "ro" ? "Copilot programări" : "Appointment Copilot"} subtitle={language === "ro" ? "Întrebări, notițe și pași următori" : "Questions, notes, and next steps"} onClick={() => onOpenFeature("appointment")} />
            <ActionRow icon={ShieldCheck} title={t("profile.readiness")} subtitle={language === "ro" ? "Progres încurajator pe categorii" : "Encouraging progress by category"} onClick={() => onOpenFeature("readiness")} />
            <ActionRow icon={Briefcase} title={language === "ro" ? "Geanta de spital" : "Hospital Bag"} subtitle={language === "ro" ? "Pentru ea, bebe, tata și documente" : "For her, baby, dad, documents"} onClick={() => onOpenFeature("hospital-bag")} />
            <ActionRow icon={Bell} title={language === "ro" ? "Memento de sprijin" : "Partner Support Reminders"} subtitle={language === "ro" ? "Sugestii blânde și recurente" : "Gentle recurring nudges"} onClick={() => onOpenFeature("support-reminders")} />
            <ActionRow icon={MessageCircle} title={language === "ro" ? "Întrebări împreună" : "Ask Together"} subtitle={language === "ro" ? "Subiecte de discutat în doi" : "Conversation starters to discuss"} onClick={() => onOpenFeature("ask-together")} />
            {!isNative() && (
              <ActionRow icon={Smartphone} title={language === "ro" ? "Instalează aplicația" : "Install the app"} subtitle={language === "ro" ? "Pe ecranul principal, ca datele să rămână sigure" : "To your Home Screen, so your data stays safe"} onClick={onOpenInstall} />
            )}
          </div>
        </div>

        {/* Privacy */}
        <div className="bg-slate-50 rounded-[1.25rem] border border-slate-200 p-4 flex items-start gap-3">
          <Lock className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
          <p className="text-[13px] text-slate-500 leading-relaxed">
            {t("profile.privacy")}
          </p>
        </div>

        {/* Reset all data */}
        <button
          onClick={() => {
            const msg = language === "ro"
              ? "Sigur ștergi toate datele? Profil, jurnal, checklist și notițe vor fi șterse de pe acest dispozitiv. Acțiunea nu poate fi anulată."
              : "Delete all your data? Profile, journal, checklist and notes will be removed from this device. This can't be undone.";
            if (confirm(msg)) resetAllData();
          }}
          className="w-full min-h-[44px] rounded-[1.25rem] border border-rose-200 bg-rose-50 text-rose-700 text-[13px] font-semibold"
        >
          {language === "ro" ? "Șterge toate datele mele" : "Reset all my data"}
        </button>

        {/* About & Disclaimer */}
        <div>
          <SectionLabel>{t("profile.about")}</SectionLabel>
          <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
            <div className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Info className="w-4 h-4 text-slate-400" strokeWidth={2} />
                <span className="text-[14px] text-slate-700 font-medium">DadGlass</span>
              </div>
              <span className="text-[13px] text-slate-400">v2.0</span>
            </div>
            <div className="px-5 py-3.5 flex items-center justify-between">
              <span className="text-[14px] text-slate-600">{language === "ro" ? "Acoperire" : "Coverage"}</span>
              <span className="text-[13px] text-slate-500">{language === "ro" ? "Săptămânile 4-40" : "Weeks 4-40"}</span>
            </div>
            <ActionRow
              icon={Info}
              title={language === "ro" ? "Disclaimer medical și comparații" : "Medical and comparison disclaimer"}
              subtitle={language === "ro" ? "Notă educațională și comparații simbolice" : "Full educational and symbolic-comparison note"}
              onClick={() => onOpenFeature("about")}
            />
          </div>

          <div className="mt-3 bg-amber-50 border border-amber-100 rounded-[1.25rem] p-4">
            <p className="text-[12px] text-amber-800 leading-relaxed">
              {language === "ro" ? (
                <>
                  <span className="font-semibold">Disclaimer medical:</span> DadGlass este doar pentru informare și educație. Nu înlocuiește sfatul, diagnosticul sau tratamentul medical. Comparațiile cu pahare și obiecte sunt simbolice, nu măsurători medicale. Consultați medicul, moașa sau obstetricianul pentru recomandări specifice sarcinii. Alcoolul trebuie evitat în sarcină.
                </>
              ) : (
                <>
                  <span className="font-semibold">Medical disclaimer:</span> DadGlass is for informational and educational purposes only. It does not constitute medical advice, diagnosis, or treatment. Glass and object size comparisons are symbolic and not medically accurate. Always consult your healthcare provider, midwife, or obstetrician for guidance specific to your pregnancy. Alcohol should be avoided during pregnancy.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
