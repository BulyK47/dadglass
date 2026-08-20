import { useState } from "react";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";
import { useApp } from "../context/AppContext";
import { weekFromDueDate } from "../utils/dueDate";

type Step = 1 | 2 | 3;

// id is the stable, language-independent value stored in the profile; en/ro are display labels.
const TONES = [
  { id: "Calm", en: "Calm", ro: "Calm" },
  { id: "Direct", en: "Direct", ro: "Direct" },
  { id: "Warm", en: "Warm", ro: "Cald" },
  { id: "Light humor", en: "Light humor", ro: "Umor ușor" },
];

function StepDots({ current }: { current: Step }) {
  return (
    <div className="flex items-center gap-2 justify-center">
      {([1, 2, 3] as Step[]).map(s => (
        <div key={s} className={`rounded-full transition-all duration-300 ${s === current ? "w-5 h-2 bg-slate-900" : "w-2 h-2 bg-slate-300"}`} />
      ))}
    </div>
  );
}

function SelectChip({ label, selected, onToggle }: { label: string; selected: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`px-4 py-2.5 rounded-full text-[14px] font-medium transition-all duration-200 border ${
        selected
          ? "bg-slate-900 text-white border-slate-900"
          : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
      }`}
    >
      {label}
    </button>
  );
}

export function OnboardingFlow() {
  const { setLanguage, language, updateProfile, updateDadStyle, completeOnboarding, markDisclaimerSeen, setCurrentWeek, t } = useApp();
  const [step, setStep] = useState<Step>(1);
  const [accepted, setAccepted] = useState(false);
  const [localProfile, setLocalProfile] = useState({ dadName: "", partnerName: "", babyNickname: "", dueDate: "", firstBaby: "" as "" | "yes" | "no" | "prefer-not" });
  const [selectedTone, setSelectedTone] = useState("");
  const [manualWeek, setManualWeek] = useState<number | null>(4);

  const handleFinish = () => {
    updateProfile(localProfile);
    updateDadStyle({ tone: selectedTone });
    // Due date takes precedence when set; otherwise use the manual week stepper.
    const week = weekFromDueDate(localProfile.dueDate) ?? manualWeek ?? 4;
    setCurrentWeek(week);
    completeOnboarding();
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] flex flex-col">
      {/* Screen 1: Welcome + language + consent (you select to proceed) */}
      {step === 1 && (
        <div className="flex-1 flex flex-col items-center px-7 pt-12 pb-8 overflow-y-auto text-center">
          {/* Language toggle */}
          <div className="flex items-center bg-slate-100 rounded-full p-1 gap-1 mb-8">
            {(["en", "ro"] as const).map(lang => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all duration-200 ${
                  language === lang ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                }`}
              >
                {lang === "en" ? "🇬🇧 English" : "🇷🇴 Română"}
              </button>
            ))}
          </div>

          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#0b1220] to-[#1e293b] flex items-center justify-center mb-6 shadow-lg">
            {/* Matches assets/icon-source.svg (the app icon) */}
            <svg viewBox="0 0 40 40" className="w-11 h-11" fill="none">
              <defs>
                <clipPath id="dgGlassBody">
                  <path d="M11.4 11.7 L13.6 29.2 Q13.6 30.5 14.8 30.5 L25.2 30.5 Q26.4 30.5 26.4 29.2 L28.6 11.7 Z" />
                </clipPath>
              </defs>
              {/* liquid */}
              <g clipPath="url(#dgGlassBody)">
                <rect x="10.9" y="16.3" width="18.2" height="15" fill="#f59e0b" />
                <ellipse cx="20" cy="16.5" rx="8.1" ry="1.2" fill="#e59313" opacity="0.45" />
              </g>
              {/* highlight */}
              <rect x="15.1" y="18.4" width="1.3" height="9.8" rx="0.65" fill="#fdf3e0" opacity="0.92" />
              {/* body outline */}
              <path d="M11.4 11.7 L13.6 29.2 Q13.6 30.5 14.8 30.5 L25.2 30.5 Q26.4 30.5 26.4 29.2 L28.6 11.7"
                    stroke="#ffffff" strokeWidth="1.05" strokeLinejoin="round" strokeLinecap="round" />
              {/* rim */}
              <ellipse cx="20" cy="11.7" rx="8.6" ry="1.5" stroke="#ffffff" strokeWidth="1.05" />
            </svg>
          </div>
          <h1 className="text-[1.9rem] font-semibold text-slate-900 tracking-tight leading-tight mb-3">
            {t("onboarding.welcome.title")}
          </h1>
          <p className="text-[15px] text-slate-600 leading-relaxed mb-6 max-w-xs">
            {t("onboarding.welcome.subtitle")}
          </p>

          {/* Disclaimer + privacy (GDPR) — read and agree before entering */}
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-4 text-left shadow-sm mb-4">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.08em] mb-2">
              {language === "ro" ? "Înainte să începi" : "Before you start"}
            </div>
            <ul className="space-y-2 text-[13px] text-slate-600 leading-relaxed">
              <li className="flex gap-2"><span className="text-slate-400">•</span><span>{language === "ro" ? "DadGlass oferă informații și sprijin, nu sfaturi medicale. Pentru orice ține de sarcină, întreabă un medic sau o moașă." : "DadGlass is information and support, not medical advice. For anything about the pregnancy, ask a doctor or midwife."}</span></li>
              <li className="flex gap-2"><span className="text-slate-400">•</span><span>{language === "ro" ? "Comparațiile cu pahare/obiecte sunt doar simbolice; alcoolul trebuie evitat în sarcină." : "Glass/object comparisons are symbolic only; alcohol should be avoided in pregnancy."}</span></li>
              <li className="flex gap-2"><span className="text-slate-400">•</span><span>{language === "ro" ? "Confidențialitate (GDPR): datele tale rămân pe acest dispozitiv. Nu colectăm, nu trimitem și nu partajăm nimic. Le poți șterge oricând din Profil." : "Privacy (GDPR): your data stays on this device. We don't collect, send, or share anything. You can delete it anytime in Profile."}</span></li>
            </ul>
            <button
              type="button"
              onClick={() => setAccepted(v => !v)}
              className="mt-3 flex items-start gap-2.5 text-left w-full"
            >
              <span className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 ${accepted ? "bg-slate-900 border-slate-900" : "border-slate-300"}`}>
                {accepted && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
              </span>
              <span className="text-[13px] font-semibold text-slate-800">
                {language === "ro" ? "Am citit și sunt de acord." : "I've read and agree."}
              </span>
            </button>
          </div>

          <button
            onClick={() => { markDisclaimerSeen(); setStep(2); }}
            disabled={!accepted}
            className="w-full max-w-sm bg-slate-900 text-white rounded-2xl py-4 text-[16px] font-semibold active:scale-[0.98] transition-transform disabled:opacity-40 disabled:active:scale-100"
          >
            {t("onboarding.welcome.cta")}
          </button>
        </div>
      )}

      {/* Screen 2: Pregnancy setup */}
      {step === 2 && (
        <div className="flex-1 flex flex-col px-6 pt-16 pb-8 overflow-y-auto">
          <div className="mb-10">
            <StepDots current={2} />
          </div>
          <h2 className="text-[1.75rem] font-semibold text-slate-900 tracking-tight mb-8">
            {t("onboarding.setup.title")}
          </h2>

          <div className="space-y-5 mb-auto">
            {/* Dad's name */}
            <div>
              <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-[0.08em] block mb-2">
                {t("profile.dadName")}
              </label>
              <input
                type="text"
                value={localProfile.dadName}
                onChange={e => setLocalProfile(p => ({ ...p, dadName: e.target.value }))}
                placeholder={language === "ro" ? "ex. Andrei" : "e.g. Alex"}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-[16px] text-slate-900 outline-none focus:border-slate-400 transition-colors"
              />
            </div>

            {/* Partner name */}
            <div>
              <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-[0.08em] block mb-2">
                {t("profile.partnerName")}
              </label>
              <input
                type="text"
                value={localProfile.partnerName}
                onChange={e => setLocalProfile(p => ({ ...p, partnerName: e.target.value }))}
                placeholder={t("onboarding.setup.partnerNamePlaceholder")}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-[16px] text-slate-900 outline-none focus:border-slate-400 transition-colors"
              />
            </div>

            {/* Baby nickname */}
            <div>
              <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-[0.08em] block mb-2">
                {t("profile.babyNickname")}
              </label>
              <input
                type="text"
                value={localProfile.babyNickname}
                onChange={e => setLocalProfile(p => ({ ...p, babyNickname: e.target.value }))}
                placeholder={t("onboarding.setup.babyNicknamePlaceholder")}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-[16px] text-slate-900 outline-none focus:border-slate-400 transition-colors"
              />
            </div>

            {/* Due date (primary) */}
            <div>
              <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-[0.08em] block mb-2">
                {t("profile.dueDate")}
              </label>
              <input
                type="date"
                value={localProfile.dueDate}
                onChange={e => setLocalProfile(p => ({ ...p, dueDate: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-[16px] text-slate-900 outline-none focus:border-slate-400 transition-colors"
              />
              <p className="text-[12px] text-slate-500 leading-relaxed mt-2">
                {language === "ro" ? "Calculăm automat săptămâna din data probabilă." : "We'll work out the week from your due date."}
              </p>
            </div>

            {/* Current week (shown directly below — no tab to switch) */}
            <div>
              <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-[0.08em] block mb-2">
                {language === "ro" ? "Sau setează săptămâna curentă" : "Or set the current week"}
              </label>
              <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3">
                <button type="button" onClick={() => setManualWeek(w => Math.max(4, (w ?? 4) - 1))} className="text-slate-600 font-bold text-lg w-8 h-8 flex items-center justify-center">-</button>
                <span className="flex-1 text-center text-[18px] font-semibold text-slate-900">{t("common.week")} {manualWeek ?? 4}</span>
                <button type="button" onClick={() => setManualWeek(w => Math.min(40, (w ?? 4) + 1))} className="text-slate-600 font-bold text-lg w-8 h-8 flex items-center justify-center">+</button>
              </div>
              <p className="text-[12px] text-slate-400 leading-relaxed mt-2">
                {language === "ro" ? "Folosit dacă nu ai completat data probabilă. O poți schimba oricând din Profil." : "Used if you didn't set a due date. You can change it anytime in Profile."}
              </p>
            </div>

            {/* First baby */}
            <div>
              <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-[0.08em] block mb-3">
                {t("onboarding.setup.firstBaby")}
              </label>
              <div className="flex gap-2">
                {(["yes", "no", "prefer-not"] as const).map(v => (
                  <button
                    key={v}
                    onClick={() => setLocalProfile(p => ({ ...p, firstBaby: v }))}
                    className={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold border transition-all ${
                      localProfile.firstBaby === v
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-600 border-slate-200"
                    }`}
                  >
                    {v === "yes" ? t("onboarding.setup.yes") : v === "no" ? t("onboarding.setup.no") : t("onboarding.setup.preferNot")}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button onClick={() => setStep(1)} className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 bg-slate-900 text-white rounded-2xl py-3.5 text-[16px] font-semibold active:scale-[0.98] transition-transform"
            >
              {t("common.next")}
            </button>
          </div>
        </div>
      )}

      {/* Screen 3: Dad style */}
      {step === 3 && (
        <div className="flex-1 flex flex-col px-6 pt-16 pb-8 overflow-y-auto">
          <div className="mb-10">
            <StepDots current={3} />
          </div>
          <h2 className="text-[1.75rem] font-semibold text-slate-900 tracking-tight mb-8">
            {t("onboarding.style.title")}
          </h2>

          <div className="space-y-8 mb-auto">
            {/*
              Only the tone is asked for now. Two more questions used to sit
              here — "what do you want most from the app" and "how do you feel
              right now" — and neither answer was ever read anywhere. Asking
              them made the app promise a personalisation it did not perform.
              Ask again when something actually consumes the answer.
            */}
            {/* Tone */}
            <div>
              <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-[0.08em] block mb-3">
                {t("onboarding.style.tone")}
              </label>
              <div className="flex flex-wrap gap-2">
                {TONES.map(tone => (
                  <SelectChip key={tone.id} label={language === "ro" ? tone.ro : tone.en} selected={selectedTone === tone.id} onToggle={() => setSelectedTone(tone.id === selectedTone ? "" : tone.id)} />
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button onClick={() => setStep(2)} className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <button
              onClick={handleFinish}
              className="flex-1 bg-slate-900 text-white rounded-2xl py-3.5 text-[16px] font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
              {t("onboarding.style.cta")}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
