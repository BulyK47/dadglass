import { useEffect, useState } from "react";
import { ChevronLeft, Share, Plus, ShieldCheck, X, Smartphone } from "lucide-react";
import { useApp } from "../context/AppContext";
import { isIOS, isStandalone, needsIOSInstall, requestPersistentStorage } from "../utils/install";

/**
 * Guides the user to install the app to their Home Screen.
 *
 * On iOS this is not cosmetic: an uninstalled web app loses ALL local data after
 * 7 days of Safari use (WebKit ITP), while Home Screen web apps are exempt. Since
 * DadGlass keeps the journal/checklist on-device, installing is what keeps it safe.
 */

const DISMISS_KEY = "dg_install_hint_dismissed";

/** Slim, dismissible banner shown only when iOS users haven't installed yet. */
export function InstallBanner({ onOpen }: { onOpen: () => void }) {
  const { language } = useApp();
  const ro = language === "ro";
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Ask for persistent storage regardless (best-effort, silent).
    void requestPersistentStorage();
    try {
      if (needsIOSInstall() && localStorage.getItem(DISMISS_KEY) !== "1") setShow(true);
    } catch {
      /* storage blocked — skip the hint */
    }
  }, []);

  if (!show) return null;

  const dismiss = () => {
    try { localStorage.setItem(DISMISS_KEY, "1"); } catch { /* ignore */ }
    setShow(false);
  };

  return (
    <div className="mx-5 mb-4 rounded-[1.25rem] border border-amber-200 bg-amber-50 p-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
          <Smartphone className="w-4 h-4 text-amber-700" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-amber-900 leading-snug">
            {ro ? "Adaugă DadGlass pe ecranul principal" : "Add DadGlass to your Home Screen"}
          </p>
          <p className="text-[12px] text-amber-800 leading-relaxed mt-1">
            {ro
              ? "Important: dacă rămâne doar ca filă în Safari, iPhone-ul poate șterge notițele după 7 zile. Instalat, rămân în siguranță."
              : "Important: kept only as a Safari tab, iPhone can erase your notes after 7 days. Installed, they stay safe."}
          </p>
          <button
            onClick={onOpen}
            className="mt-2.5 min-h-[36px] px-3 rounded-lg bg-amber-700 text-white text-[12px] font-semibold"
          >
            {ro ? "Arată-mi cum" : "Show me how"}
          </button>
        </div>
        <button
          onClick={dismiss}
          className="w-8 h-8 rounded-full flex items-center justify-center text-amber-700 flex-shrink-0"
          aria-label={ro ? "Închide" : "Dismiss"}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-[12px] font-semibold flex items-center justify-center flex-shrink-0">
        {n}
      </span>
      <span className="text-[14px] text-slate-700 leading-relaxed pt-0.5">{children}</span>
    </li>
  );
}

/** Full-screen install instructions. */
export function InstallGuide({ onClose }: { onClose: () => void }) {
  const { language } = useApp();
  const ro = language === "ro";
  const installed = isStandalone();
  const ios = isIOS();

  return (
    <div className="fixed inset-0 z-50 bg-[#fafaf9] w-full max-w-md mx-auto h-[100dvh] overflow-hidden flex flex-col">
      <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 px-5 py-5 pt-safe flex-shrink-0">
        <button onClick={onClose} className="inline-flex items-center gap-2 text-[13px] font-semibold text-slate-600 mb-4 min-h-[44px]">
          <ChevronLeft className="w-4 h-4" />
          {ro ? "Înapoi" : "Back"}
        </button>
        <h2 className="text-[1.45rem] font-semibold text-slate-900 tracking-tight leading-tight">
          {ro ? "Instalează aplicația" : "Install the app"}
        </h2>
        <p className="text-[14px] text-slate-500 leading-relaxed mt-1">
          {ro ? "Ca s-o ai pe ecranul principal și datele să rămână în siguranță." : "So it lives on your Home Screen and your data stays safe."}
        </p>
      </header>

      <div className="flex-1 min-h-0 overflow-y-auto px-5 py-5 pb-28 space-y-4">
        {installed && (
          <div className="rounded-[1.25rem] border border-emerald-200 bg-emerald-50 p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" strokeWidth={2} />
            <p className="text-[13px] text-emerald-900 leading-relaxed">
              {ro ? "Gata — aplicația este deja instalată. Notițele tale sunt în siguranță pe acest dispozitiv." : "You're all set — the app is already installed. Your notes are safe on this device."}
            </p>
          </div>
        )}

        {!installed && (
          <>
            {/* iPhone */}
            <section className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm p-5">
              <h3 className="text-[15px] font-semibold text-slate-900 mb-1">iPhone / iPad</h3>
              <p className="text-[12px] text-slate-500 mb-4">{ro ? "Din Safari (sau Chrome)" : "From Safari (or Chrome)"}</p>
              <ol className="space-y-3">
                <Step n={1}>
                  {ro ? <>Apasă butonul <strong>Partajare</strong> <Share className="w-3.5 h-3.5 inline -mt-0.5" /> din bara de jos.</> : <>Tap the <strong>Share</strong> button <Share className="w-3.5 h-3.5 inline -mt-0.5" /> in the bottom bar.</>}
                </Step>
                <Step n={2}>
                  {ro ? <>Derulează și alege <strong>„Adaugă pe ecranul principal"</strong> <Plus className="w-3.5 h-3.5 inline -mt-0.5" />.</> : <>Scroll down and choose <strong>"Add to Home Screen"</strong> <Plus className="w-3.5 h-3.5 inline -mt-0.5" />.</>}
                </Step>
                <Step n={3}>
                  {ro ? <>Apasă <strong>Adaugă</strong>. Deschide apoi aplicația <strong>de pe iconița nouă</strong>, nu din Safari.</> : <>Tap <strong>Add</strong>. From now on open it <strong>from the new icon</strong>, not from Safari.</>}
                </Step>
              </ol>
              {ios && (
                <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 p-3">
                  <p className="text-[12px] text-amber-900 leading-relaxed">
                    {ro
                      ? "De ce contează: iPhone-ul șterge datele site-urilor ținute doar în Safari după ~7 zile. Aplicațiile de pe ecranul principal sunt scutite de această regulă."
                      : "Why it matters: iPhone erases data for sites kept only in Safari after ~7 days. Home Screen apps are exempt from that rule."}
                  </p>
                </div>
              )}
            </section>

            {/* Android */}
            <section className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm p-5">
              <h3 className="text-[15px] font-semibold text-slate-900 mb-1">Android</h3>
              <p className="text-[12px] text-slate-500 mb-4">{ro ? "Din Chrome" : "From Chrome"}</p>
              <ol className="space-y-3">
                <Step n={1}>{ro ? <>Apasă meniul <strong>⋮</strong> din dreapta sus.</> : <>Tap the <strong>⋮</strong> menu at the top right.</>}</Step>
                <Step n={2}>{ro ? <>Alege <strong>„Instalează aplicația"</strong> (sau „Adaugă pe ecranul principal").</> : <>Choose <strong>"Install app"</strong> (or "Add to Home screen").</>}</Step>
              </ol>
            </section>
          </>
        )}

        {/* Backup advice — always useful */}
        <section className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm p-5">
          <h3 className="text-[15px] font-semibold text-slate-900 mb-2">{ro ? "Fă-ți o copie a jurnalului" : "Keep a copy of your journal"}</h3>
          <p className="text-[14px] text-slate-700 leading-relaxed">
            {ro
              ? "Toate datele stau doar pe acest dispozitiv — nimic nu pleacă spre vreun server. Din Jurnal poți folosi „Salvează jurnalul” ca să păstrezi o copie."
              : "All your data lives only on this device — nothing is sent to any server. In the Journal, use “Save journal” to keep a copy."}
          </p>
          <p className="text-[12px] text-slate-500 leading-relaxed mt-2">
            {ro
              ? "Notă: dacă ștergi iconița aplicației sau golești datele browserului, notițele se șterg."
              : "Note: deleting the app icon or clearing browser data will erase your notes."}
          </p>
        </section>
      </div>
    </div>
  );
}
