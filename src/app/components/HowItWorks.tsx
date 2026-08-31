import { type ComponentType, useState } from "react";
import { Ruler, Calendar, CheckSquare, BookOpen, Lock, ChevronLeft, ChevronRight } from "lucide-react";
import { useApp } from "../context/AppContext";

/**
 * A short, skippable walkthrough of what the five tabs are for, shown once
 * after onboarding and reopenable from Profile.
 *
 * Deliberately a set of cards rather than coach-marks pinned to live elements:
 * anchored highlights have to re-measure on scroll, tab change and rotation,
 * and the bottom nav is fixed with a safe-area inset, which is exactly the kind
 * of thing that breaks on one phone model and nowhere else. Cards also leave
 * room to say *why* the glass comparisons exist, which an arrow pointing at a
 * button cannot do — and that is the single most-asked question about this app.
 */

interface Slide {
  icon: ComponentType<{ className?: string; strokeWidth?: string | number }>;
  en: { title: string; body: string };
  ro: { title: string; body: string };
}

const SLIDES: Slide[] = [
  {
    icon: Ruler,
    en: {
      title: "Your week, at a size you can picture",
      body: "Home shows how big the baby is right now next to a familiar glass — or, if you prefer, an everyday object like a mug or a set of keys. Tap the toggle to switch. The glasses are size references, nothing more: alcohol should be avoided in pregnancy, and the easiest support you can give is not drinking either.",
    },
    ro: {
      title: "Săptămâna ta, la o mărime pe care ți-o poți imagina",
      body: "Ecranul Acasă îți arată cât de mare e bebelușul acum, comparat cu un pahar cunoscut — sau, dacă preferi, cu un obiect de zi cu zi, o cană sau un set de chei. Apeși pe comutator ca să schimbi. Paharele sunt doar repere de mărime: alcoolul trebuie evitat în sarcină, iar cel mai simplu sprijin pe care i-l poți da e să nu bei nici tu.",
    },
  },
  {
    icon: Calendar,
    en: {
      title: "What's happening, and what you can do about it",
      body: "Parcurs — Journey — walks all 37 weeks. Each one tells you what's going on with the baby, what she may be feeling physically and emotionally, one concrete thing you can do this week, and the sentences that help versus the ones that land badly.",
    },
    ro: {
      title: "Ce se întâmplă și ce poți face concret",
      body: "Parcurs îți deschide toate cele 37 de săptămâni. Fiecare îți spune ce se întâmplă cu bebelușul, cum s-ar putea simți ea fizic și emoțional, un lucru concret pe care îl poți face săptămâna asta, și ce propoziții ajută față de cele care pică prost.",
    },
  },
  {
    icon: CheckSquare,
    en: {
      title: "51 things to do, not all at once",
      body: "The checklist is sorted by trimester and by how much each task matters. Filters fold away so the list stays readable, and anything with a deadline can go straight into your phone's calendar as a reminder.",
    },
    ro: {
      title: "51 de lucruri de făcut, nu toate deodată",
      body: "Checklistul e împărțit pe trimestre și după cât de mult contează fiecare sarcină. Filtrele se pliază ca să rămână lista lizibilă, iar orice are termen poate ajunge direct în calendarul telefonului, ca memento.",
    },
  },
  {
    icon: BookOpen,
    en: {
      title: "The guides, and the bag by the door",
      body: "Handbook explains labour, the birth plan and the postpartum weeks in plain language, plus a glossary of the words you'll hear at appointments. The hospital bag list is a checklist you tick off — and there's an appointment co-pilot for the questions worth asking.",
    },
    ro: {
      title: "Ghidurile și geanta de lângă ușă",
      body: "Ghidul explică travaliul, planul de naștere și săptămânile de după, pe înțelesul tuturor, plus un glosar cu termenii pe care îi vei auzi la consultații. Lista pentru geanta de spital e un checklist pe care îl bifezi — iar copilotul de programări îți dă întrebările care merită puse.",
    },
  },
  {
    icon: Lock,
    en: {
      title: "The journal is yours, and it stays here",
      body: "Write a short note each week; they become the thing you'll want to read later. There is no account and no server — everything you type stays on this phone, and Profile has one button that erases all of it.",
    },
    ro: {
      title: "Jurnalul e al tău și rămâne aici",
      body: "Scrie câte o notiță scurtă în fiecare săptămână; alea sunt lucrurile pe care vei vrea să le recitești mai târziu. Nu există cont și nu există server — tot ce scrii rămâne pe telefonul ăsta, iar în Profil ai un buton care șterge absolut tot.",
    },
  },
];

export function HowItWorks({ onClose }: { onClose: () => void }) {
  const { language } = useApp();
  const ro = language === "ro";
  const [index, setIndex] = useState(0);

  const slide = SLIDES[index];
  const copy = ro ? slide.ro : slide.en;
  const Icon = slide.icon;
  const last = index === SLIDES.length - 1;

  return (
    <div className="fixed inset-0 z-50 bg-[#fafaf9] w-full max-w-md mx-auto h-[100dvh] overflow-hidden flex flex-col">
      <header className="flex items-center justify-between px-5 py-4 pt-safe flex-shrink-0">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.08em]">
          {ro ? "Cum funcționează" : "How it works"}
        </span>
        <button
          onClick={onClose}
          className="min-h-[44px] px-2 text-[13px] font-semibold text-slate-500"
        >
          {ro ? "Sari peste" : "Skip"}
        </button>
      </header>

      <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-4 flex flex-col justify-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center mb-6">
          <Icon className="w-7 h-7 text-white" strokeWidth={1.8} />
        </div>
        <h2 className="text-[1.6rem] font-semibold text-slate-900 tracking-tight leading-tight mb-3">
          {copy.title}
        </h2>
        <p className="text-[15px] text-slate-600 leading-relaxed">
          {copy.body}
        </p>
      </div>

      <div className="flex-shrink-0 px-6 pb-8 pb-safe space-y-5">
        <div className="flex items-center gap-2 justify-center">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${i === index ? "w-5 h-2 bg-slate-900" : "w-2 h-2 bg-slate-300"}`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIndex(i => Math.max(0, i - 1))}
            disabled={index === 0}
            aria-label={ro ? "Înapoi" : "Back"}
            className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <button
            onClick={() => (last ? onClose() : setIndex(i => i + 1))}
            className="flex-1 bg-slate-900 text-white rounded-2xl py-3.5 text-[16px] font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            {last ? (ro ? "Am înțeles" : "Got it") : (ro ? "Mai departe" : "Next")}
            {!last && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
