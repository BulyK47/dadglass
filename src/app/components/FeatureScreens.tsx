import { useState, type ComponentType, type ReactNode } from "react";
import {
  Bell,
  BellRing,
  BookOpen,
  Calendar,
  CalendarPlus,
  Check,
  ChevronLeft,
  ClipboardList,
  Heart,
  MessageCircle,
  Plus,
  ShieldCheck,
  Star,
  Trash2,
  UserRound,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { usePersistedSet, usePersistedState } from "../hooks/usePersisted";
import { cancelNativeReminders, downloadICS, enableNotifications, parseDateLoose, scheduleNativeReminders, type NotificationOutcome } from "../utils/reminders";
import { isNative } from "../utils/platform";

export type FeatureKey =
  | "appointment"
  | "readiness"
  | "hospital-bag"
  | "support-reminders"
  | "ask-together"
  | "about";

interface FeatureScreenProps {
  feature: FeatureKey;
  onClose: () => void;
}

function Shell({ title, subtitle, onClose, children }: {
  title: string;
  subtitle: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const { language } = useApp();
  return (
    <div className="fixed inset-0 z-50 bg-[#fafaf9] w-full max-w-md mx-auto h-[100dvh] overflow-hidden flex flex-col">
      <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 px-5 py-5 flex-shrink-0">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-slate-600 mb-4 min-h-[44px]"
        >
          <ChevronLeft className="w-4 h-4" />
          {language === "ro" ? "Înapoi" : "Back"}
        </button>
        <h2 className="text-[1.45rem] font-semibold text-slate-900 tracking-tight leading-tight">{title}</h2>
        <p className="text-[14px] text-slate-500 leading-relaxed mt-1">{subtitle}</p>
      </header>
      <div className="flex-1 min-h-0 overflow-y-auto px-5 py-5 pb-28 space-y-4">
        {children}
      </div>
    </div>
  );
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`bg-white rounded-[1.5rem] border border-slate-200 shadow-sm p-5 ${className}`}>
      {children}
    </section>
  );
}

function SectionTitle({ icon: Icon, title, subtitle }: {
  icon: ComponentType<{ className?: string; strokeWidth?: string | number }>;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-slate-700" strokeWidth={2} />
      </div>
      <div>
        <h3 className="text-[15px] font-semibold text-slate-900 leading-snug">{title}</h3>
        {subtitle && <p className="text-[12px] text-slate-500 leading-relaxed mt-0.5">{subtitle}</p>}
      </div>
    </div>
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

function TextInput({ label, placeholder, value, onChange }: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.08em] block mb-2">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[14px] text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-slate-300"
      />
    </label>
  );
}

function AppointmentCopilot({ onClose }: { onClose: () => void }) {
  const { language, appointmentNotes, addAppointmentNote, deleteAppointmentNote } = useApp();
  const ro = language === "ro";
  const [notes, setNotes] = useState({
    date: "",
    clinician: "",
    questions: "",
    answers: "",
    nextSteps: "",
    nextAppointment: "",
  });
  const [saved, setSaved] = useState(false);
  const [calDate, setCalDate] = useState("");

  const update = (key: keyof typeof notes, value: string) => setNotes((current) => ({ ...current, [key]: value }));
  const hasContent = Object.values(notes).some(value => value.trim().length > 0);

  const saveNotes = () => {
    if (!hasContent) return;
    addAppointmentNote(notes);
    setNotes({ date: "", clinician: "", questions: "", answers: "", nextSteps: "", nextAppointment: "" });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const addToCalendar = () => {
    const d = parseDateLoose(calDate);
    if (!d) return;
    downloadICS("dadglass-appointment", [{
      title: ro ? "Programare prenatală" : "Prenatal appointment",
      description: [notes.clinician, notes.nextSteps].filter(Boolean).join(" — ") || undefined,
      start: d,
      allDay: true,
    }]);
  };

  return (
    <Shell title={ro ? "Copilot programări" : "Appointment Copilot"} subtitle={ro ? "Pregătește-te, fii prezent și păstrează ce contează." : "Prepare, show up, and remember what matters."} onClose={onClose}>
      <Card>
        <SectionTitle icon={Calendar} title={ro ? "Înainte de programare" : "Before the appointment"} />
        <BulletList items={[
          ro ? "Întreab-o dacă vrea să fii acolo." : "Ask if she wants you there.",
          ro ? "Notați împreună 3 întrebări." : "Write down 3 questions together.",
          ro ? "Adu documente sau rezultate, dacă sunt necesare." : "Bring documents or test results if needed.",
          ro ? "Adaugă programarea în calendar." : "Add the appointment to your calendar.",
        ]} />
      </Card>

      <Card>
        <SectionTitle icon={MessageCircle} title={ro ? "Întrebări de pus" : "Questions to ask"} />
        <BulletList items={[
          ro ? "Creșterea este în grafic?" : "Is growth on track?",
          ro ? "La ce simptome ar trebui să fim atenți?" : "What symptoms should we watch for?",
          ro ? "Ce urmează până la următoarea programare?" : "What happens before the next appointment?",
          ro ? "Sunt analize sau teste pe care ar trebui să le înțelegem?" : "Are there any tests we should understand?",
          ro ? "Când ar trebui să sunăm, în loc să așteptăm?" : "When should we call instead of waiting?",
        ]} />
      </Card>

      <Card>
        <SectionTitle icon={UserRound} title={ro ? "În timpul programării" : "During the appointment"} />
        <BulletList items={[
          ro ? "Ascultă întâi și nu vorbi peste ea." : "Listen first and do not speak over her.",
          ro ? "Ia notițe dacă vrea asta." : "Take notes if she wants you to.",
          ro ? "Cere explicații dacă ceva nu este clar." : "Ask for explanations if something is unclear.",
          ro ? "Las-o pe ea să își exprime întrebările și preferințele." : "Let her lead with her questions and preferences.",
        ]} />
      </Card>

      <Card>
        <SectionTitle icon={Check} title={ro ? "După programare" : "After the appointment"} />
        <BulletList items={[
          ro ? "Salvează notițele." : "Save notes.",
          ro ? "Adaugă următoarea programare." : "Add the next appointment.",
          ro ? "Întreab-o cum s-a simțit." : "Ask how she felt about it.",
          ro ? "Actualizează checklist-ul." : "Update your checklist.",
        ]} />
      </Card>

      <Card>
        <SectionTitle icon={BookOpen} title={ro ? "Notițe de la programare" : "Appointment notes"} subtitle={ro ? "Se salvează local pe dispozitiv." : "Saved locally on this device."} />
        <div className="space-y-3">
          <TextInput label={ro ? "Data" : "Date"} placeholder={ro ? "ex. 12 iunie" : "e.g. 12 June"} value={notes.date} onChange={(v) => update("date", v)} />
          <TextInput label={ro ? "Doctor / moașă" : "Doctor / midwife"} placeholder={ro ? "Nume sau clinică" : "Name or clinic"} value={notes.clinician} onChange={(v) => update("clinician", v)} />
          <TextInput label={ro ? "Întrebări puse" : "Questions asked"} placeholder={ro ? "Ce ați întrebat?" : "What did you ask?"} value={notes.questions} onChange={(v) => update("questions", v)} />
          <TextInput label={ro ? "Răspunsuri" : "Answers"} placeholder={ro ? "Ce ați aflat?" : "What did you learn?"} value={notes.answers} onChange={(v) => update("answers", v)} />
          <TextInput label={ro ? "Pași următori" : "Next steps"} placeholder={ro ? "Analize, programări, task-uri" : "Tests, follow-ups, tasks"} value={notes.nextSteps} onChange={(v) => update("nextSteps", v)} />
          <TextInput label={ro ? "Următoarea programare" : "Next appointment"} placeholder={ro ? "Dată sau memento" : "Date or reminder"} value={notes.nextAppointment} onChange={(v) => update("nextAppointment", v)} />
        </div>
        {saved && (
          <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2 text-[13px] font-semibold text-emerald-800">
            {ro ? "Notița a fost salvată." : "Appointment note saved."}
          </div>
        )}
        {appointmentNotes.length > 0 && (
          <div className="mt-4 rounded-xl bg-slate-50 border border-slate-100 p-3">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.08em] mb-2">
              {ro ? "Notițe salvate" : "Saved notes"}
            </div>
            <div className="space-y-2">
              {appointmentNotes.slice(0, 3).map(note => (
                <div key={note.id} className="rounded-lg bg-white border border-slate-100 p-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-[13px] font-semibold text-slate-800">{note.date || (ro ? "Fără dată" : "No date")}</div>
                    <button
                      onClick={() => { if (confirm(ro ? "Ștergi această notiță?" : "Delete this note?")) deleteAppointmentNote(note.id); }}
                      className="text-slate-300 hover:text-rose-600 flex-shrink-0"
                      aria-label={ro ? "Șterge notița" : "Delete note"}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-[12px] text-slate-500">{note.clinician || (ro ? "Fără nume" : "No clinician")}</div>
                  {note.nextSteps && <div className="text-[12px] text-slate-600 mt-1">{note.nextSteps}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
        <button
          onClick={saveNotes}
          disabled={!hasContent}
          className="mt-4 w-full min-h-[44px] rounded-xl bg-slate-900 text-white text-[14px] font-semibold disabled:opacity-40"
        >
          {ro ? "Salvează notița" : "Save appointment note"}
        </button>
      </Card>

      <Card>
        <SectionTitle icon={CalendarPlus} title={ro ? "Adaugă în calendar" : "Add to calendar"} subtitle={ro ? "Descarcă un fișier .ics pentru aplicația ta de calendar." : "Download an .ics file for your calendar app."} />
        <input
          type="date"
          value={calDate}
          onChange={(e) => setCalDate(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[14px] text-slate-900 outline-none focus:ring-2 focus:ring-slate-300 mb-2"
        />
        <button
          onClick={addToCalendar}
          disabled={!calDate}
          className="w-full min-h-[44px] rounded-xl bg-slate-900 text-white text-[14px] font-semibold flex items-center justify-center gap-2 disabled:opacity-40"
        >
          <CalendarPlus className="w-4 h-4" />
          {ro ? "Descarcă fișier .ics" : "Download .ics file"}
        </button>
      </Card>
    </Shell>
  );
}

function ReadinessScore({ onClose }: { onClose: () => void }) {
  const { completedTodos, language, setActiveTab } = useApp();
  const ro = language === "ro";
  const score = Math.min(100, Math.round((completedTodos.size / 51) * 100));
  const subtitle = score < 30
    ? ro ? "Ești la început. Construiești bazele." : "Early days. You're building the basics."
    : score < 75
    ? ro ? "Progres bun. Continuă." : "Good progress. Keep going."
    : ro ? "Ești bine pregătit." : "Well prepared. Strong showing.";
  const done = completedTodos.size;

  return (
    <Shell title={ro ? "Scor de pregătire pentru tata" : "Dad Readiness Score"} subtitle={subtitle} onClose={onClose}>
      <Card className="bg-gradient-to-br from-white to-slate-50">
        <div className="text-center py-2">
          <div className="text-[3rem] leading-none font-semibold text-slate-900 tracking-tight">{score}%</div>
          <p className="text-[13px] text-slate-500 mt-2">{ro ? "Progres încurajator, nu judecată." : "Encouraging progress, not a judgment."}</p>
        </div>
      </Card>

      <Card>
        <SectionTitle icon={ShieldCheck} title={ro ? "Progresul tău" : "Your progress"} subtitle={ro ? "Calculat din task-urile bifate în Checklist." : "Based on the tasks you've ticked in the Checklist."} />
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[13px] font-medium text-slate-700">{ro ? "Task-uri finalizate" : "Tasks completed"}</span>
          <span className="text-[12px] font-semibold text-slate-500 tabular-nums">{done} / 51</span>
        </div>
        <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
          <div className="h-full rounded-full bg-slate-700" style={{ width: `${score}%` }} />
        </div>
      </Card>

      <Card>
        <SectionTitle icon={ClipboardList} title={ro ? "Pași recomandați" : "Recommended next actions"} />
        <BulletList items={[
          ro ? "Finalizează 2 task-uri esențiale." : "Complete 2 must-do tasks.",
          ro ? "Adaugă următoarea programare." : "Add the next appointment.",
          ro ? "Salvează un contact de urgență." : "Save one emergency contact.",
          ro ? "Citește un ghid de sprijin pentru parteneră." : "Read one partner support guide.",
        ]} />
        <button
          onClick={() => { setActiveTab("todo"); onClose(); }}
          className="mt-4 w-full min-h-[44px] rounded-xl bg-slate-900 text-white text-[14px] font-semibold"
        >
          {ro ? "Îmbunătățește scorul" : "Improve my score"}
        </button>
      </Card>
    </Shell>
  );
}

// Hospital + home prep list, adapted from a real Romanian maternity checklist.
// Keys are the English label (used as the checkbox id); BAG_LABELS_RO holds the Romanian.
const BAG_SECTIONS = {
  her: [
    "Maternity / postpartum pads",
    "Mesh postpartum underwear",
    "Toilet paper",
    "Shower gel",
    "Towel",
    "Toothbrush & toothpaste",
    "Deodorant",
    "Hair ties",
    "Loose nightgowns / pajamas (x3)",
    "Comfy slippers (a size up)",
    "Lanolin nipple cream",
    "Going-home clothes for mom",
  ],
  baby: [
    "Changing mats / pads (x3)",
    "Socks (x3)",
    "Nipple shields",
    "Car seat",
    "Nappies (2 brands to try)",
    "Nappy rash cream (Mustela / Sudocrem)",
    "Baby wash (Mustela / Lipikar)",
    "Baby wipes (water wipes)",
    "Hooded towel",
    "Muslin / cotton cloths (x2)",
    "Bodysuits (x4)",
    "Footed pants / leggings",
    "Zip or snap sleepsuits (avoid buttons)",
    "Hats (x2)",
    "Pacifiers (0-6m, x2)",
    "Baby blanket",
    "Going-home outfit for baby",
  ],
  dad: [
    "Phone charger",
    "Snacks",
    "Water bottle",
    "Change of clothes",
    "Hoodie",
    "Toiletries",
    "Pillow",
    "Cash / card",
    "Headphones",
    "Important contacts",
    "Birth plan copy",
  ],
  documents: [
    "ID",
    "Insurance / medical card",
    "Pregnancy notes & test results",
    "Birth plan",
    "Hospital forms",
  ],
  home: [
    "Breast pump (manual + electric)",
    "Crib + bedding",
    "Bassinet / Moses basket",
    "Sleeping bag",
    "Anti-roll pillow",
    "Nursing pillow",
    "Changing mat",
    "Stroller / pram",
    "Baby bathtub + support + mat",
    "Baby scale",
    "Sterilizer",
    "Bottles + warmer",
    "Nasal aspirator",
    "Room & water thermometer",
    "Body thermometer",
    "Saline drops",
    "Vitamin D drops",
    "Massage oil",
    "Cotton swabs",
    "Baby nail file / scissors",
    "Hooded bath towels (x5-7)",
    "Brush & comb",
    "Rocker / bouncer",
  ],
} as const;

const BAG_LABELS_RO: Record<string, string> = {
  // For her
  "Maternity / postpartum pads": "Tampoane / absorbante speciale",
  "Mesh postpartum underwear": "Chiloți medicinali (plasă)",
  "Toilet paper": "Hârtie igienică",
  "Shower gel": "Gel de duș",
  "Towel": "Prosop",
  "Toothbrush & toothpaste": "Periuță și pastă de dinți",
  "Deodorant": "Deodorant",
  "Hair ties": "Elastice de păr",
  "Loose nightgowns / pajamas (x3)": "Cămăși de noapte / pijamale lejere (x3)",
  "Comfy slippers (a size up)": "Papuci comozi (cu un număr mai mari)",
  "Lanolin nipple cream": "Cremă cu lanolină pentru mameloane",
  "Going-home clothes for mom": "Haine de externare pentru mama",
  // For baby
  "Changing mats / pads (x3)": "Aleze (x3)",
  "Socks (x3)": "Șosete (x3)",
  "Nipple shields": "Protecții pentru mameloane",
  "Car seat": "Scaun auto (scoică)",
  "Nappies (2 brands to try)": "Scutece (2 mărci de încercat)",
  "Nappy rash cream (Mustela / Sudocrem)": "Cremă de fund (Mustela / Sudocrem)",
  "Baby wash (Mustela / Lipikar)": "Gel de duș bebe (Mustela / Lipikar)",
  "Baby wipes (water wipes)": "Șervețele umede (water wipes)",
  "Hooded towel": "Prosop cu glugă",
  "Muslin / cotton cloths (x2)": "Scutece de muselină / bumbac (x2)",
  "Bodysuits (x4)": "Body-uri (x4)",
  "Footed pants / leggings": "Pantaloni cu botoșei",
  "Zip or snap sleepsuits (avoid buttons)": "Pijamale întregi cu fermoar/capse (evită nasturii)",
  "Hats (x2)": "Căciulițe (x2)",
  "Pacifiers (0-6m, x2)": "Suzete (0-6 luni, x2)",
  "Baby blanket": "Păturică",
  "Going-home outfit for baby": "Ținută de externare pentru bebe",
  // For dad
  "Phone charger": "Încărcător telefon",
  "Snacks": "Gustări",
  "Water bottle": "Sticlă de apă",
  "Change of clothes": "Haine de schimb",
  "Hoodie": "Hanorac",
  "Toiletries": "Produse de igienă",
  "Pillow": "Pernă",
  "Cash / card": "Cash / card",
  "Headphones": "Căști",
  "Important contacts": "Contacte importante",
  "Birth plan copy": "Copie plan de naștere",
  // Documents
  "ID": "Act de identitate",
  "Insurance / medical card": "Card de sănătate / asigurare",
  "Pregnancy notes & test results": "Dosar sarcină și analize",
  "Birth plan": "Plan de naștere",
  "Hospital forms": "Formulare spital",
  // At home
  "Breast pump (manual + electric)": "Pompă de sân (manuală + electrică)",
  "Crib + bedding": "Pătuț + lenjerie",
  "Bassinet / Moses basket": "Coș de dormit",
  "Sleeping bag": "Sac de dormit",
  "Anti-roll pillow": "Pernă antirostogolire",
  "Nursing pillow": "Pernă de alăptare",
  "Changing mat": "Saltea / pernă de înfășat",
  "Stroller / pram": "Cărucior",
  "Baby bathtub + support + mat": "Cădiță + suport + saltea de baie",
  "Baby scale": "Cântar pentru bebe",
  "Sterilizer": "Sterilizator",
  "Bottles + warmer": "Biberoane + încălzitor",
  "Nasal aspirator": "Aspirator nazal",
  "Room & water thermometer": "Termometru de cameră și apă",
  "Body thermometer": "Termometru medical",
  "Saline drops": "Ser fiziologic (doze)",
  "Vitamin D drops": "Vitamina D (picături)",
  "Massage oil": "Ulei de masaj",
  "Cotton swabs": "Bețișoare de urechi",
  "Baby nail file / scissors": "Pilă / forfecuță de unghii",
  "Hooded bath towels (x5-7)": "Prosoape mari cu glugă (x5-7)",
  "Brush & comb": "Perie și pieptăn",
  "Rocker / bouncer": "Balansoar",
};

function HospitalBag({ onClose }: { onClose: () => void }) {
  const { language } = useApp();
  const ro = language === "ro";
  const [tab, setTab] = useState<keyof typeof BAG_SECTIONS>("dad");
  const bag = usePersistedSet("dg_hospital_bag");
  const items = BAG_SECTIONS[tab];

  return (
    <Shell title={ro ? "Geanta de spital" : "Hospital Bag"} subtitle={ro ? "Ce să pui în geantă pentru spital și ce să ai pregătit acasă." : "What to pack for the hospital, plus what to have ready at home."} onClose={onClose}>
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {(Object.keys(BAG_SECTIONS) as Array<keyof typeof BAG_SECTIONS>).map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-shrink-0 min-h-[40px] px-3.5 rounded-full text-[12px] font-semibold capitalize ${tab === key ? "bg-slate-900 text-white" : "bg-white text-slate-600 border border-slate-200"}`}
          >
            {ro
              ? key === "her" ? "Pentru ea" : key === "baby" ? "Pentru bebe" : key === "dad" ? "Pentru tata" : key === "documents" ? "Documente" : "Acasă"
              : key === "her" ? "For her" : key === "baby" ? "For baby" : key === "dad" ? "For dad" : key === "documents" ? "Documents" : "At home"}
          </button>
        ))}
      </div>

      <Card className="divide-y divide-slate-100 p-0 overflow-hidden">
        {items.map((item) => {
          const done = bag.has(item);
          return (
            <button
              key={item}
              onClick={() => bag.toggle(item)}
              className="w-full flex items-center gap-3 px-5 py-4 text-left min-h-[52px]"
            >
              <span className={`w-5 h-5 rounded-md border flex items-center justify-center ${done ? "bg-slate-900 border-slate-900" : "border-slate-300"}`}>
                {done && <Check className="w-3.5 h-3.5 text-white" />}
              </span>
              <span className={`text-[14px] ${done ? "line-through text-slate-400" : "text-slate-800"}`}>
                {ro ? BAG_LABELS_RO[item] ?? item : item}
              </span>
            </button>
          );
        })}
      </Card>

      <button
        onClick={() => bag.addAll(items as unknown as string[])}
        className="w-full min-h-[44px] rounded-xl bg-slate-900 text-white text-[14px] font-semibold"
      >
        {ro ? "Marchează tot din această filă" : "Check everything in this tab"}
      </button>
    </Shell>
  );
}

const SUPPORT_REMINDERS = [
  { id: "feeling", en: "Ask how she is feeling today", ro: "Întreab-o cum se simte azi" },
  { id: "water", en: "Bring her water", ro: "Adu-i apă" },
  { id: "dinner", en: "Offer to handle dinner", ro: "Oferă-te să te ocupi de cină" },
  { id: "easier", en: "Ask what would make the day easier", ro: "Întreabă ce ar face ziua mai ușoară" },
  { id: "walk", en: "Suggest a short walk if she feels up to it", ro: "Propune o plimbare scurtă, dacă se simte în stare" },
  { id: "appointment", en: "Check if she wants company at the next appointment", ro: "Verifică dacă vrea să mergi cu ea la următoarea programare" },
  { id: "appreciate", en: "Tell her one thing you appreciate", ro: "Spune-i un lucru pe care îl apreciezi" },
] as const;

function SupportReminders({ onClose }: { onClose: () => void }) {
  const { language } = useApp();
  const ro = language === "ro";
  const [frequency, setFrequency] = usePersistedState<string>("dg_reminders_freq", "Weekly");
  const [reminderDate, setReminderDate] = usePersistedState<string>("dg_reminders_date", "");
  const selected = usePersistedSet("dg_reminders_sel");
  const [notif, setNotif] = useState<NotificationOutcome | null>(null);
  const [downloaded, setDownloaded] = useState(false);
  const [scheduled, setScheduled] = useState(0);

  const chosen = SUPPORT_REMINDERS.filter((r) => selected.has(r.id));
  const desc = ro ? "Memento de sprijin din DadGlass" : "Partner support reminder from DadGlass";
  const canExport = chosen.length > 0 && frequency !== "Off" && !(frequency === "Date" && !parseDateLoose(reminderDate));

  const handleNotifications = async () => {
    const outcome = await enableNotifications(
      ro ? "Memento DadGlass activat" : "DadGlass reminders on",
      ro ? "Îți vom aminti de gesturile de sprijin." : "We'll nudge you about supportive gestures.",
    );
    setNotif(outcome);
    // In the native app we can schedule the chosen gestures for real.
    if (outcome === "granted" && isNative()) {
      if (frequency === "Off" || chosen.length === 0) {
        await cancelNativeReminders();
        setScheduled(0);
        return;
      }
      const at = frequency === "Date" ? parseDateLoose(reminderDate) : null;
      const when = at ?? (() => { const d = new Date(); d.setHours(18, 0, 0, 0); if (d <= new Date()) d.setDate(d.getDate() + 1); return d; })();
      const repeat = frequency === "Daily" ? "daily" : frequency === "Weekly" ? "weekly" : "none";
      await cancelNativeReminders();
      const n = await scheduleNativeReminders(
        chosen.map((r) => ({ id: r.id, title: ro ? "Memento de sprijin" : "Supportive reminder", body: ro ? r.ro : r.en })),
        when,
        repeat,
      );
      setScheduled(n);
    }
  };

  const confirmDownload = () => { setDownloaded(true); setTimeout(() => setDownloaded(false), 3000); };
  const exportCalendar = () => {
    if (!canExport) return;
    if (frequency === "Date") {
      const d = parseDateLoose(reminderDate);
      if (!d) return;
      downloadICS("dadglass-reminders", chosen.map((r) => ({ title: ro ? r.ro : r.en, description: desc, start: d, allDay: true })));
      confirmDownload();
      return;
    }
    const start = new Date();
    start.setHours(18, 0, 0, 0);
    const rrule = frequency === "Daily" ? "FREQ=DAILY" : "FREQ=WEEKLY";
    downloadICS("dadglass-reminders", chosen.map((r) => ({ title: ro ? r.ro : r.en, description: desc, start, durationMinutes: 15, rrule })));
    confirmDownload();
  };

  return (
    <Shell title={ro ? "Memento de sprijin" : "Partner Support Reminders"} subtitle={ro ? "Gesturi mici care contează." : "Small gestures that matter."} onClose={onClose}>
      <Card>
        <SectionTitle icon={Bell} title={ro ? "Frecvență" : "Frequency"} subtitle={ro ? "Sugestii de sprijin, fără reproșuri." : "Supportive nudges, not guilt-based notifications."} />
        <div className="grid grid-cols-2 gap-2">
          {(["Daily", "Weekly", "Date", "Off"] as const).map((option) => (
            <button
              key={option}
              onClick={() => setFrequency(option)}
              className={`min-h-[44px] rounded-xl text-[13px] font-semibold border ${frequency === option ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200"}`}
            >
              {ro
                ? option === "Daily" ? "Zilnic" : option === "Weekly" ? "Săptămânal" : option === "Off" ? "Oprit" : "Selectați data"
                : option === "Date" ? "Pick a date" : option}
            </button>
          ))}
        </div>
        {frequency === "Date" && (
          <input
            type="date"
            value={reminderDate}
            onChange={(e) => setReminderDate(e.target.value)}
            className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[14px] text-slate-900 outline-none focus:ring-2 focus:ring-slate-300"
          />
        )}
        <p className="text-[12px] text-slate-500 leading-relaxed mt-3">
          {ro
            ? "Ca să oprești memento-urile, alege „Oprit” sau debifează gesturile. Evenimentele deja adăugate se șterg din aplicația ta de calendar."
            : "To turn reminders off, choose “Off” or untick the gestures. Events you already added are removed from your calendar app."}
        </p>
      </Card>

      <Card className="divide-y divide-slate-100 p-0 overflow-hidden">
        {SUPPORT_REMINDERS.map((item) => {
          const done = selected.has(item.id);
          return (
            <button
              key={item.id}
              onClick={() => selected.toggle(item.id)}
              className="w-full flex items-start gap-3 px-5 py-4 text-left min-h-[52px]"
            >
              <span className={`w-5 h-5 rounded-md border mt-0.5 flex items-center justify-center ${done ? "bg-slate-900 border-slate-900" : "border-slate-300"}`}>
                {done && <Check className="w-3.5 h-3.5 text-white" />}
              </span>
              <span className="text-[14px] text-slate-800 leading-relaxed">{ro ? item.ro : item.en}</span>
            </button>
          );
        })}
      </Card>

      <Card>
        <SectionTitle
          icon={CalendarPlus}
          title={ro ? "Adaugă în calendarul telefonului" : "Add to your phone's calendar"}
          subtitle={ro
            ? "Cel mai sigur mod de a primi memento-urile: ajung în calendarul tău și sună acolo, pe orice telefon."
            : "The reliable way to get reminded: these land in your calendar and alert you there, on any phone."}
        />
        <button
          onClick={exportCalendar}
          disabled={!canExport}
          className="w-full min-h-[44px] rounded-xl bg-slate-900 text-white text-[14px] font-semibold flex items-center justify-center gap-2 disabled:opacity-40"
        >
          <CalendarPlus className="w-4 h-4" />
          {ro ? "Adaugă în calendar (.ics)" : "Add to calendar (.ics)"}
        </button>
        {downloaded && (
          <p className="text-[12px] text-emerald-700 mt-2">{ro ? "Fișier de calendar (.ics) descărcat. Deschide-l ca să adaugi evenimentele." : "Calendar file (.ics) downloaded. Open it to add the events."}</p>
        )}
        {chosen.length === 0 && (
          <p className="text-[12px] text-slate-400 mt-2">{ro ? "Bifează cel puțin un memento pentru exportul în calendar." : "Tick at least one reminder to enable calendar export."}</p>
        )}
        {chosen.length > 0 && !canExport && (
          <p className="text-[12px] text-slate-400 mt-2">{ro ? "Alege „Zilnic”, „Săptămânal” sau o dată pentru a activa exportul." : "Choose Daily, Weekly, or pick a date to enable export."}</p>
        )}
      </Card>

      <Card>
        <SectionTitle
          icon={BellRing}
          title={ro ? "Notificări (opțional)" : "Notifications (optional)"}
          subtitle={ro
            ? "Trimitem o notificare de test acum. Memento-urile programate care apar singure vor veni cu aplicația din magazin."
            : "We'll send one test notification now. Scheduled reminders that pop up on their own come with the published app."}
        />
        <button
          onClick={handleNotifications}
          className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-white text-slate-700 text-[14px] font-semibold"
        >
          {ro ? "Trimite o notificare de test" : "Send a test notification"}
        </button>
        {notif === "granted" && (
          <p className="text-[12px] text-emerald-700 mt-2">
            {scheduled > 0
              ? (ro ? `Gata — ${scheduled} memento programate pe telefon.` : `Done — ${scheduled} reminders scheduled on your phone.`)
              : (ro ? "Permisiune acordată — ai primit notificarea de test." : "Permission granted — you got the test notification.")}
          </p>
        )}
        {notif === "denied" && (
          <p className="text-[12px] text-slate-500 mt-2">{ro ? "Notificările sunt blocate. Permite-le pentru DadGlass din setările telefonului." : "Notifications are blocked. Allow them for DadGlass in your phone's settings."}</p>
        )}
        {notif === "unsupported" && (
          <p className="text-[12px] text-slate-500 mt-2">{ro ? "Acest dispozitiv nu acceptă notificări web." : "This device doesn't support web notifications."}</p>
        )}
      </Card>
    </Shell>
  );
}

const ASK_TOGETHER = [
  ["Sharing the news", "Who do we want to tell first, and who should wait?", "Do we want to tell people together or separately?"],
  ["Names", "Which names feel meaningful to us, and which are off the list?", "Do we want a family name, a new name, or both?"],
  ["Appointments", "Which appointments do you want me at?", "What would make appointments feel less stressful?"],
  ["Visitors", "Who do we want around in the first week after birth?", "What boundaries do we want to set before baby arrives?"],
  ["Birth preferences", "What matters most to you during labor, and how can I support that?", "What should I know before decisions get intense?"],
  ["Money", "What costs worry us most right now?", "What can we decide this week instead of later?"],
  ["Sleep", "How do we want to protect sleep in the first weeks?", "What can we prepare now for hard nights?"],
  ["Family boundaries", "What comments or pressure do we want to handle as a team?", "Who needs a boundary before baby arrives?"],
  ["Postpartum support", "What help would actually feel helpful after birth?", "Who can we ask before we are exhausted?"],
  ["Work and leave", "What work decisions need to be clear before birth?", "How do we want to use leave, flexibility, or shifts?"],
  ["Feeding", "What kind of feeding support do you want from me?", "How should I help without taking over?"],
  ["Mental health", "How will we tell each other when we are struggling?", "Who can we ask for help without shame?"],
] as const;

const ASK_TOGETHER_RO = [
  ["Anunțarea veștii", "Cui vrem să spunem mai întâi și cine ar trebui să mai aștepte?", "Vrem să anunțăm împreună sau separat?"],
  ["Nume", "Ce nume au sens pentru noi și ce nume ies de pe listă?", "Vrem un nume de familie, un nume nou sau ambele?"],
  ["Programări", "La ce programări vrei să vin cu tine?", "Ce ar face programările mai puțin stresante?"],
  ["Vizitatori", "Pe cine vrem lângă noi în prima săptămână după naștere?", "Ce limite vrem să stabilim înainte să vină bebelușul?"],
  ["Preferințe la naștere", "Ce contează cel mai mult pentru tine în travaliu și cum pot să te susțin?", "Ce ar trebui să știu înainte ca deciziile să devină intense?"],
  ["Bani", "Ce costuri ne îngrijorează cel mai mult acum?", "Ce putem decide săptămâna asta, nu mai târziu?"],
  ["Somn", "Cum vrem să protejăm somnul în primele săptămâni?", "Ce putem pregăti acum pentru nopțile grele?"],
  ["Limite cu familia", "Ce comentarii sau presiuni vrem să gestionăm ca echipă?", "Cu cine trebuie să stabilim o limită înainte de naștere?"],
  ["Sprijin postpartum", "Ce ajutor chiar ar fi util după naștere?", "Pe cine putem întreba înainte să fim epuizați?"],
  ["Muncă și concediu", "Ce decizii legate de muncă trebuie clarificate înainte de naștere?", "Cum vrem să folosim concediul, flexibilitatea sau turele?"],
  ["Hrănire", "Ce fel de sprijin vrei de la mine pentru hrănirea bebelușului?", "Cum pot ajuta fără să preiau controlul?"],
  ["Sănătate mentală", "Cum ne spunem unul altuia când ne este greu?", "Cui putem cere ajutor fără rușine?"],
] as const;

function AskTogether({ onClose }: { onClose: () => void }) {
  const { language } = useApp();
  const ro = language === "ro";
  const discussed = usePersistedSet("dg_ask_discussed");
  const birthPlan = usePersistedSet("dg_ask_birthplan");
  const reminders = usePersistedSet("dg_ask_reminders");
  const [answers, setAnswers] = usePersistedState<Record<string, string>>("dg_ask_answers", {});

  return (
    <Shell title={ro ? "Întrebări împreună" : "Ask Together"} subtitle={ro ? "Întrebări care vă ajută să începeți conversații importante." : "Conversation starters for the two of you."} onClose={onClose}>
      {(ro ? ASK_TOGETHER_RO : ASK_TOGETHER).map(([title, question, followUp], index) => {
        const key = String(index);
        const done = discussed.has(key);
        const isBirthPlan = birthPlan.has(key);
        const hasReminder = reminders.has(key);
        return (
          <Card key={key}>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h3 className="text-[16px] font-semibold text-slate-900">{title}</h3>
                <p className="text-[14px] text-slate-700 leading-relaxed mt-2">{question}</p>
              </div>
              <MessageCircle className="w-5 h-5 text-slate-400 flex-shrink-0" />
            </div>
            <p className="text-[13px] text-slate-500 leading-relaxed mb-4">{followUp}</p>
            <textarea
              value={answers[key] ?? ""}
              onChange={(event) => { const v = event.target.value; setAnswers((current) => ({ ...current, [key]: v })); }}
              placeholder={ro ? "Scrie un răspuns scurt sau o decizie." : "Write a short answer or decision."}
              rows={2}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-[13px] text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-slate-300 resize-none mb-3"
            />
            <div className="flex flex-wrap gap-2">
              <button onClick={() => discussed.toggle(key)} className={`min-h-[36px] px-3 rounded-full text-[12px] font-semibold ${done ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>
                {done ? (ro ? "Discutat" : "Discussed") : (ro ? "Marchează discutat" : "Mark discussed")}
              </button>
              <button onClick={() => birthPlan.toggle(key)} className={`min-h-[36px] px-3 rounded-full text-[12px] font-semibold ${isBirthPlan ? "bg-sky-100 text-sky-800" : "bg-slate-100 text-slate-600"}`}>
                {isBirthPlan ? (ro ? "În plan" : "In birth plan") : (ro ? "Adaugă în plan" : "Add to birth plan")}
              </button>
              <button onClick={() => reminders.toggle(key)} className={`min-h-[36px] px-3 rounded-full text-[12px] font-semibold ${hasReminder ? "bg-purple-100 text-purple-800" : "bg-slate-100 text-slate-600"}`}>
                {hasReminder ? (ro ? "Marcat" : "Flagged") : (ro ? "Marchează pentru mai târziu" : "Flag to revisit")}
              </button>
            </div>
          </Card>
        );
      })}
    </Shell>
  );
}

function AboutDisclaimer({ onClose }: { onClose: () => void }) {
  const { language } = useApp();
  const ro = language === "ro";
  return (
    <Shell title={ro ? "Disclaimer medical și comparații" : "Medical and comparison disclaimer"} subtitle={ro ? "Secțiune permanentă Despre / Disclaimer." : "Permanent About / Disclaimer section."} onClose={onClose}>
      <Card>
        <SectionTitle icon={ShieldCheck} title="DadGlass" subtitle={ro ? "Un ghid calm și practic, săptămână cu săptămână, pentru viitori tați." : "A calm, practical, week-by-week coach for future dads."} />
        <p className="text-[14px] text-slate-700 leading-relaxed">
          {ro
            ? "DadGlass este o aplicație educațională și de organizare pentru viitori tați. Nu oferă diagnostic sau sfaturi medicale."
            : "DadGlass is an educational and organizational app for expecting dads. It does not provide medical diagnosis or medical advice."}
        </p>
      </Card>

      <Card>
        <SectionTitle icon={Star} title={ro ? "Comparații" : "Comparisons"} />
        <p className="text-[14px] text-slate-700 leading-relaxed">
          {ro
            ? "Comparațiile de mărime sunt doar repere simbolice și nu sunt recomandări pentru consumul de alcool. Alcoolul trebuie evitat în sarcină."
            : "Size comparisons are symbolic references only and are not recommendations for alcohol use or consumption. Alcohol should be avoided during pregnancy."}
        </p>
      </Card>

      <Card>
        <SectionTitle icon={Heart} title={ro ? "Întrebări medicale" : "Medical questions"} />
        <p className="text-[14px] text-slate-700 leading-relaxed">
          {ro
            ? "Dacă ai întrebări despre sarcină, simptome, alcool, medicamente sau sănătatea partenerei, discută cu un medic, o moașă sau un specialist calificat."
            : "If you have questions about pregnancy, symptoms, alcohol, medication, or your partner's health, speak with a doctor, midwife, or qualified healthcare professional."}
        </p>
      </Card>
    </Shell>
  );
}

export function FeatureScreen({ feature, onClose }: FeatureScreenProps) {
  if (feature === "appointment") return <AppointmentCopilot onClose={onClose} />;
  if (feature === "readiness") return <ReadinessScore onClose={onClose} />;
  if (feature === "hospital-bag") return <HospitalBag onClose={onClose} />;
  if (feature === "support-reminders") return <SupportReminders onClose={onClose} />;
  if (feature === "ask-together") return <AskTogether onClose={onClose} />;
  return <AboutDisclaimer onClose={onClose} />;
}

export function FeatureTile({ title, subtitle, icon: Icon, onClick }: {
  title: string;
  subtitle: string;
  icon: ComponentType<{ className?: string; strokeWidth?: string | number }>;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-[1.25rem] border border-slate-200 shadow-sm p-4 text-left flex items-center gap-3 min-h-[72px] active:scale-[0.99] transition-transform"
    >
      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4.5 h-4.5 text-slate-700" strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-semibold text-slate-900 leading-snug">{title}</div>
        <div className="text-[12px] text-slate-500 leading-snug mt-0.5">{subtitle}</div>
      </div>
      <Plus className="w-4 h-4 text-slate-300 flex-shrink-0" />
    </button>
  );
}

export function downloadReminderIcs(title: string, opts?: { start?: Date; rrule?: string }) {
  let start = opts?.start;
  if (!start) {
    start = new Date();
    start.setDate(start.getDate() + 1);
    start.setHours(9, 0, 0, 0);
  }
  // Delegate to the shared builder so SUMMARY/DESCRIPTION are properly escaped
  // (todo titles can contain commas, which break a raw .ics line).
  downloadICS("dadglass-reminder", [{
    title,
    description: "Supportive DadGlass reminder.",
    start,
    durationMinutes: 30,
    rrule: opts?.rrule,
  }]);
}
