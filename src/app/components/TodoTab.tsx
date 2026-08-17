import { useState } from "react";
import {
  Bell,
  Calendar,
  CheckSquare,
  ClipboardList,
  Download,
  FileText,
  ShieldCheck,
  Square,
  StickyNote,
  X,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { usePersistedSet, usePersistedState } from "../hooks/usePersisted";
import { downloadReminderIcs, type FeatureKey } from "./FeatureScreens";

type Priority = "must" | "should" | "nice";
type Stage = "t1" | "t2" | "t3" | "birth" | "postpartum";
type Topic = "medical" | "admin" | "homePrep" | "emotional" | "birthPrep" | "postpartum";
type ViewFilter = "all" | "this-week" | "overdue" | "reminders";

interface TodoItem {
  id: string;
  text: string;
  category: Stage;
  topic: Topic;
  priority: Priority;
  weeks?: string;
}

interface TodoTabProps {
  onOpenFeature: (feature: FeatureKey) => void;
}

const TODO_ITEMS: TodoItem[] = [
  { id: "t1-1", category: "t1", topic: "medical", priority: "must", text: "Confirm pregnancy with a healthcare provider", weeks: "Wk 4-6" },
  { id: "t1-2", category: "t1", topic: "medical", priority: "must", text: "Book the first prenatal appointment", weeks: "Wk 5-7" },
  { id: "t1-3", category: "t1", topic: "medical", priority: "should", text: "Research prenatal vitamins - look for 400 mcg folic acid", weeks: "Wk 4-5" },
  { id: "t1-4", category: "t1", topic: "emotional", priority: "should", text: "Decide who to tell and when", weeks: "Wk 6-8" },
  { id: "t1-5", category: "t1", topic: "admin", priority: "should", text: "Set up a shared calendar for prenatal appointments", weeks: "Wk 5-8" },
  { id: "t1-6", category: "t1", topic: "medical", priority: "must", text: "Attend the first prenatal appointment", weeks: "Wk 8-10" },
  { id: "t1-7", category: "t1", topic: "admin", priority: "must", text: "Check your workplace parental leave entitlement", weeks: "Wk 8-12" },
  { id: "t1-8", category: "t1", topic: "admin", priority: "should", text: "Start saving - calculate what parental leave will cover", weeks: "Wk 8-12" },
  { id: "t1-9", category: "t1", topic: "medical", priority: "must", text: "Discuss genetic screening tests and your preferences", weeks: "Wk 10-12" },
  { id: "t1-10", category: "t1", topic: "emotional", priority: "nice", text: "Mark the end of the first trimester - it is a milestone", weeks: "Wk 12" },

  { id: "t2-1", category: "t2", topic: "medical", priority: "must", text: "Book the 20-week anatomy scan", weeks: "Wk 13-16" },
  { id: "t2-2", category: "t2", topic: "birthPrep", priority: "must", text: "Register for a birthing class", weeks: "Wk 14-20" },
  { id: "t2-3", category: "t2", topic: "medical", priority: "should", text: "Book an infant CPR course", weeks: "Wk 16-24" },
  { id: "t2-4", category: "t2", topic: "emotional", priority: "should", text: "Decide whether you want to find out the sex", weeks: "Wk 16-20" },
  { id: "t2-5", category: "t2", topic: "medical", priority: "must", text: "Attend the anatomy scan together", weeks: "Wk 18-22" },
  { id: "t2-6", category: "t2", topic: "homePrep", priority: "should", text: "Research and choose a pram/stroller", weeks: "Wk 16-24" },
  { id: "t2-7", category: "t2", topic: "homePrep", priority: "should", text: "Research car seat options", weeks: "Wk 16-24" },
  { id: "t2-8", category: "t2", topic: "homePrep", priority: "should", text: "Start planning the nursery or sleeping space", weeks: "Wk 20-26" },
  { id: "t2-9", category: "t2", topic: "admin", priority: "nice", text: "Create a baby registry or shared shopping list", weeks: "Wk 20-26" },
  { id: "t2-10", category: "t2", topic: "emotional", priority: "nice", text: "Start conversations about names if ready", weeks: "Wk 16-26" },
  { id: "t2-11", category: "t2", topic: "birthPrep", priority: "must", text: "Discuss birth plan preferences with your partner", weeks: "Wk 20-26" },
  { id: "t2-12", category: "t2", topic: "admin", priority: "must", text: "Notify your employer about paternity leave dates", weeks: "Wk 20-24" },
  { id: "t2-13", category: "t2", topic: "emotional", priority: "nice", text: "Plan a babymoon if you are having one", weeks: "Wk 18-26" },
  { id: "t2-14", category: "t2", topic: "admin", priority: "should", text: "Open or top up savings for the baby", weeks: "Wk 20-26" },

  { id: "t3-1", category: "t3", topic: "homePrep", priority: "must", text: "Purchase and install the car seat", weeks: "Wk 27-32" },
  { id: "t3-2", category: "t3", topic: "homePrep", priority: "must", text: "Get the car seat installation inspected", weeks: "Wk 27-34" },
  { id: "t3-3", category: "t3", topic: "birthPrep", priority: "must", text: "Tour the birth facility", weeks: "Wk 28-32" },
  { id: "t3-4", category: "t3", topic: "birthPrep", priority: "must", text: "Finalize and print the birth plan", weeks: "Wk 30-34" },
  { id: "t3-5", category: "t3", topic: "homePrep", priority: "should", text: "Set up the nursery", weeks: "Wk 27-35" },
  { id: "t3-6", category: "t3", topic: "homePrep", priority: "should", text: "Wash and prepare baby clothes and bedding", weeks: "Wk 30-36" },
  { id: "t3-7", category: "t3", topic: "birthPrep", priority: "must", text: "Pack her hospital bag", weeks: "Wk 32-36" },
  { id: "t3-8", category: "t3", topic: "birthPrep", priority: "must", text: "Pack your own bag for the hospital stay", weeks: "Wk 32-36" },
  { id: "t3-9", category: "t3", topic: "postpartum", priority: "nice", text: "Cook and freeze meals for the postpartum period", weeks: "Wk 32-38" },
  { id: "t3-10", category: "t3", topic: "birthPrep", priority: "should", text: "Learn real labor vs. Braxton Hicks", weeks: "Wk 28-36" },
  { id: "t3-11", category: "t3", topic: "admin", priority: "must", text: "Complete paternity leave paperwork with employer", weeks: "Wk 30-36" },
  { id: "t3-12", category: "t3", topic: "admin", priority: "should", text: "Arrange childcare or pet care for when labor starts", weeks: "Wk 34-38" },

  { id: "b-1", category: "birth", topic: "birthPrep", priority: "must", text: "Know the 5-1-1 rule for real contractions", weeks: "Now" },
  { id: "b-2", category: "birth", topic: "medical", priority: "must", text: "Save the hospital and midwife numbers in your phone", weeks: "Now" },
  { id: "b-3", category: "birth", topic: "birthPrep", priority: "must", text: "Know the fastest route to the birth facility", weeks: "Now" },
  { id: "b-4", category: "birth", topic: "birthPrep", priority: "must", text: "Keep the car fueled or charged at all times", weeks: "Now" },
  { id: "b-5", category: "birth", topic: "emotional", priority: "should", text: "Have your support team on standby", weeks: "Now" },
  { id: "b-6", category: "birth", topic: "birthPrep", priority: "must", text: "Review the birth plan one last time together", weeks: "Now" },
  { id: "b-7", category: "birth", topic: "medical", priority: "must", text: "Know when to call - and what to say when you do", weeks: "Now" },

  { id: "p-1", category: "postpartum", topic: "postpartum", priority: "must", text: "Prepare easy meals for the first week home", weeks: "Wk 36-40" },
  { id: "p-2", category: "postpartum", topic: "emotional", priority: "must", text: "Set visitor boundaries before birth", weeks: "Wk 34-40" },
  { id: "p-3", category: "postpartum", topic: "medical", priority: "must", text: "Save pediatrician and midwife numbers", weeks: "Wk 34-40" },
  { id: "p-4", category: "postpartum", topic: "homePrep", priority: "should", text: "Prepare a diaper and feeding station", weeks: "Wk 34-40" },
  { id: "p-5", category: "postpartum", topic: "postpartum", priority: "should", text: "Plan night shifts and protected sleep blocks", weeks: "Wk 36-40" },
  { id: "p-6", category: "postpartum", topic: "medical", priority: "should", text: "Learn newborn warning signs", weeks: "Wk 36-40" },
  { id: "p-7", category: "postpartum", topic: "emotional", priority: "must", text: "Check in on your partner's recovery", weeks: "After birth" },
  { id: "p-8", category: "postpartum", topic: "postpartum", priority: "should", text: "Check in on your own mental health", weeks: "After birth" },
];

const TODO_TEXT_RO: Record<string, string> = {
  "t1-1": "Confirmă sarcina cu un specialist",
  "t1-2": "Programează prima consultație prenatală",
  "t1-3": "Caută vitamine prenatale - urmărește 400 mcg acid folic",
  "t1-4": "Decideți cui spuneți și când",
  "t1-5": "Setează un calendar comun pentru programările prenatale",
  "t1-6": "Mergeți împreună la prima consultație prenatală",
  "t1-7": "Verifică drepturile de concediu parental la job",
  "t1-8": "Calculează bugetul pentru concediul parental",
  "t1-9": "Discutați testele genetice și preferințele voastre",
  "t1-10": "Marcați finalul primului trimestru - este un moment important",
  "t2-1": "Programează ecografia morfologică de 20 de săptămâni",
  "t2-2": "Înscrieți-vă la un curs de naștere",
  "t2-3": "Programează un curs de prim ajutor pentru bebeluși",
  "t2-4": "Decideți dacă vreți să aflați sexul bebelușului",
  "t2-5": "Mergeți împreună la ecografia morfologică",
  "t2-6": "Caută și alege un cărucior",
  "t2-7": "Caută opțiuni de scaun auto",
  "t2-8": "Planificați camera sau spațiul de somn",
  "t2-9": "Creează o listă comună de cumpărături pentru bebe",
  "t2-10": "Începeți discuțiile despre nume, dacă sunteți pregătiți",
  "t2-11": "Discutați preferințele pentru planul de naștere",
  "t2-12": "Anunță angajatorul despre perioada de concediu paternal",
  "t2-13": "Planificați o escapadă înainte de naștere, dacă vreți",
  "t2-14": "Pune bani deoparte pentru cheltuielile bebelușului",
  "t3-1": "Cumpără și instalează scaunul auto",
  "t3-2": "Verifică instalarea scaunului auto",
  "t3-3": "Faceți un tur al maternității sau clinicii",
  "t3-4": "Finalizează și printează planul de naștere",
  "t3-5": "Pregătiți camera sau colțul bebelușului",
  "t3-6": "Spală și pregătește hainele și lenjeria bebelușului",
  "t3-7": "Pregătește geanta ei pentru spital",
  "t3-8": "Pregătește-ți propria geantă pentru spital",
  "t3-9": "Gătește și congelează mese pentru postpartum",
  "t3-10": "Învață diferența dintre travaliu real și Braxton Hicks",
  "t3-11": "Finalizează actele pentru concediul paternal",
  "t3-12": "Organizează îngrijirea copiilor sau animalelor când începe travaliul",
  "b-1": "Învață regula 5-1-1 pentru contracții reale",
  "b-2": "Salvează numerele maternității și moașei în telefon",
  "b-3": "Știi cel mai rapid traseu către maternitate",
  "b-4": "Ține mașina alimentată sau încărcată",
  "b-5": "Anunță echipa de sprijin să fie disponibilă",
  "b-6": "Revizuiți împreună planul de naștere",
  "b-7": "Știi când să suni și ce să spui",
  "p-1": "Pregătește mese simple pentru prima săptămână acasă",
  "p-2": "Stabiliți limite pentru vizitatori înainte de naștere",
  "p-3": "Salvează numerele pediatrului și moașei",
  "p-4": "Pregătește un spațiu pentru scutece și hrănire",
  "p-5": "Planificați ture de noapte și blocuri de somn protejat",
  "p-6": "Învață semnele de alarmă la nou-născut",
  "p-7": "Verifică recuperarea partenerei",
  "p-8": "Verifică și sănătatea ta mentală",
};

const STAGES: Array<{ key: Stage | "all"; label: string }> = [
  { key: "all", label: "checklist.all" },
  { key: "t1", label: "checklist.firstTrimester" },
  { key: "t2", label: "checklist.secondTrimester" },
  { key: "t3", label: "checklist.thirdTrimester" },
  { key: "birth", label: "checklist.birthPrepSection" },
  { key: "postpartum", label: "checklist.postpartum" },
];

const PRIORITIES: Array<{ key: Priority | "all"; label: string; color: string; activeColor: string }> = [
  { key: "all", label: "All", color: "bg-slate-100 text-slate-600", activeColor: "bg-slate-900 text-white" },
  { key: "must", label: "Must do", color: "bg-red-50 text-red-700", activeColor: "bg-red-600 text-white" },
  { key: "should", label: "Should do", color: "bg-amber-50 text-amber-800", activeColor: "bg-amber-600 text-white" },
  { key: "nice", label: "Nice to do", color: "bg-emerald-50 text-emerald-700", activeColor: "bg-emerald-600 text-white" },
];

const VIEW_FILTERS: Array<{ key: ViewFilter; label: string; labelRo: string }> = [
  { key: "all", label: "All tasks", labelRo: "Toate" },
  { key: "this-week", label: "This week", labelRo: "Săptămâna asta" },
  { key: "overdue", label: "Overdue", labelRo: "Întârziate" },
  { key: "reminders", label: "Reminders", labelRo: "Memento" },
];

const TOPIC_FILTERS: Array<{ key: Topic | "all"; label: string; labelRo: string }> = [
  { key: "all", label: "All topics", labelRo: "Toate" },
  { key: "medical", label: "Medical", labelRo: "Medical" },
  { key: "admin", label: "Admin", labelRo: "Admin" },
  { key: "homePrep", label: "Home prep", labelRo: "Acasă" },
  { key: "emotional", label: "Emotional support", labelRo: "Sprijin emoțional" },
  { key: "birthPrep", label: "Birth prep", labelRo: "Naștere" },
  { key: "postpartum", label: "Postpartum", labelRo: "Postpartum" },
];

const STAGE_LABELS: Record<Stage, string> = {
  t1: "checklist.firstTrimester",
  t2: "checklist.secondTrimester",
  t3: "checklist.thirdTrimester",
  birth: "checklist.birthPrepSection",
  postpartum: "checklist.postpartum",
};

const TOPIC_LABELS: Record<Topic, string> = {
  medical: "Medical",
  admin: "Admin",
  homePrep: "Home prep",
  emotional: "Emotional support",
  birthPrep: "Birth prep",
  postpartum: "Postpartum",
};

const TOPIC_LABELS_RO: Record<Topic, string> = {
  medical: "Medical",
  admin: "Admin",
  homePrep: "Acasă",
  emotional: "Sprijin emoțional",
  birthPrep: "Naștere",
  postpartum: "Postpartum",
};

function todoText(item: TodoItem, language: string) {
  return language === "ro" ? TODO_TEXT_RO[item.id] ?? item.text : item.text;
}

function topicLabel(topic: Topic, language: string) {
  return language === "ro" ? TOPIC_LABELS_RO[topic] : TOPIC_LABELS[topic];
}

const PRIORITY_DOT: Record<Priority, string> = {
  must: "bg-red-500",
  should: "bg-amber-500",
  nice: "bg-emerald-500",
};

function weekRange(item: TodoItem) {
  const nums = [...(item.weeks ?? "").matchAll(/\d+/g)].map(match => Number(match[0]));
  if (nums.length === 0) return null;
  return { start: nums[0], end: nums[nums.length - 1] };
}

function isThisWeekTask(item: TodoItem, currentWeek: number) {
  if (item.category === "birth") return currentWeek >= 36;
  if (item.category === "postpartum") return currentWeek >= 34;
  const range = weekRange(item);
  if (!range) return false;
  return currentWeek >= range.start && currentWeek <= range.end;
}

function isOverdueTask(item: TodoItem, currentWeek: number, completed: boolean) {
  if (completed) return false;
  const range = weekRange(item);
  return !!range && currentWeek > range.end;
}

function ReminderSheet({ item, onClose, onSetReminder, onRemoveReminder, isSet, language }: {
  item: TodoItem;
  onClose: () => void;
  onSetReminder: (id: string) => void;
  onRemoveReminder: (id: string) => void;
  isSet: boolean;
  language: string;
}) {
  const ro = language === "ro";
  const title = todoText(item, language);
  const OPTIONS = [
    { id: "tomorrow", label: ro ? "Mâine dimineață" : "Tomorrow morning" },
    { id: "weekend", label: ro ? "În weekend" : "This weekend" },
    { id: "custom", label: ro ? "Selectați data" : "Pick a date" },
    { id: "weekly", label: ro ? "Repetă săptămânal" : "Repeat weekly" },
  ];
  const [optionId, setOptionId] = useState("tomorrow");
  const [customDate, setCustomDate] = useState("");

  const reminderStart = (): Date | null => {
    if (optionId === "custom") {
      const d = new Date(customDate);
      if (isNaN(d.getTime())) return null;
      d.setHours(9, 0, 0, 0);
      return d;
    }
    const d = new Date();
    if (optionId === "weekend") {
      const add = ((6 - d.getDay()) + 7) % 7 || 7; // next Saturday
      d.setDate(d.getDate() + add);
      d.setHours(10, 0, 0, 0);
    } else {
      d.setDate(d.getDate() + 1); // tomorrow (also start for weekly)
      d.setHours(9, 0, 0, 0);
    }
    return d;
  };
  const rrule = optionId === "weekly" ? "FREQ=WEEKLY" : undefined;
  const start = reminderStart();
  const ready = start !== null;

  const pad = (n: number) => String(n).padStart(2, "0");
  const gcalStamp = (dt: Date) =>
    `${dt.getUTCFullYear()}${pad(dt.getUTCMonth() + 1)}${pad(dt.getUTCDate())}T${pad(dt.getUTCHours())}${pad(dt.getUTCMinutes())}00Z`;
  const openGoogleCalendar = () => {
    if (!start) return;
    const text = encodeURIComponent(title);
    const details = encodeURIComponent(ro ? "Memento de sprijin DadGlass." : "Supportive DadGlass reminder.");
    const end = new Date(start.getTime() + 30 * 60000);
    const dates = `${gcalStamp(start)}/${gcalStamp(end)}`;
    const recur = rrule ? `&recur=RRULE:${rrule}` : "";
    window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}&dates=${dates}${recur}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 px-4 pb-4">
      <div className="w-full max-w-md bg-white rounded-t-[1.75rem] border border-slate-200 shadow-2xl p-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="text-[18px] font-semibold text-slate-900">{ro ? "Adaugă un memento" : "Add reminder"}</h3>
            <p className="text-[13px] text-slate-500 leading-relaxed mt-1">{title}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
            <X className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          {OPTIONS.map((o) => (
            <button
              key={o.id}
              onClick={() => setOptionId(optionId === o.id ? "tomorrow" : o.id)}
              className={`min-h-[44px] rounded-xl text-[13px] font-semibold border px-3 ${optionId === o.id ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200"}`}
            >
              {o.label}
            </button>
          ))}
        </div>

        {optionId === "custom" && (
          <input
            type="date"
            value={customDate}
            onChange={(e) => setCustomDate(e.target.value)}
            className="w-full mb-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[14px] text-slate-900 outline-none focus:ring-2 focus:ring-slate-300"
          />
        )}

        <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 mb-4">
          <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-600 mb-2">
            <Calendar className="w-4 h-4" />
            {ro ? "Sincronizare calendar" : "Calendar sync"}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => start && downloadReminderIcs(title, { start, rrule })} disabled={!ready} className="min-h-[40px] rounded-lg bg-white border border-slate-200 text-[12px] font-semibold text-slate-600 disabled:opacity-40">
              Apple
            </button>
            <button onClick={openGoogleCalendar} disabled={!ready} className="min-h-[40px] rounded-lg bg-white border border-slate-200 text-[12px] font-semibold text-slate-600 disabled:opacity-40">
              Google
            </button>
            <button onClick={() => start && downloadReminderIcs(title, { start, rrule })} disabled={!ready} className="min-h-[40px] rounded-lg bg-white border border-slate-200 text-[12px] font-semibold text-slate-600 flex items-center justify-center gap-1 disabled:opacity-40">
              <Download className="w-3.5 h-3.5" />
              .ics
            </button>
          </div>
          {optionId === "custom" && !ready && (
            <p className="text-[11px] text-slate-400 mt-2">{ro ? "Alege o dată mai sus." : "Pick a date above first."}</p>
          )}
        </div>

        <p className="text-[11px] text-slate-400 mb-2">
          {ro ? "Marchează sarcina ca memento. Pentru o alertă reală, folosește calendarul de mai sus." : "Marks this task as a reminder. For an actual alert, use the calendar above."}
        </p>
        <button
          onClick={() => { onSetReminder(item.id); onClose(); }}
          className="w-full min-h-[48px] rounded-xl bg-slate-900 text-white text-[14px] font-semibold"
        >
          {isSet ? (ro ? "Actualizează memento-ul" : "Update reminder") : (ro ? "Setează memento-ul" : "Set supportive reminder")}
        </button>
        {isSet && (
          <button
            onClick={() => { onRemoveReminder(item.id); onClose(); }}
            className="w-full min-h-[44px] mt-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-[14px] font-semibold"
          >
            {ro ? "Oprește memento-ul" : "Turn off reminder"}
          </button>
        )}
      </div>
    </div>
  );
}

export function TodoTab({ onOpenFeature }: TodoTabProps) {
  const { completedTodos, toggleTodo, currentWeek, language, t } = useApp();
  const ro = language === "ro";
  const [activeStage, setActiveStage] = useState<Stage | "all">("all");
  const [activePriority, setActivePriority] = useState<Priority | "all">("all");
  const [activeTopic, setActiveTopic] = useState<Topic | "all">("all");
  const [activeView, setActiveView] = useState<ViewFilter>("all");
  const reminders = usePersistedSet("dg_todo_reminders");
  const [reminderItem, setReminderItem] = useState<TodoItem | null>(null);
  const [notesOpen, setNotesOpen] = useState<string | null>(null);
  const [notes, setNotes] = usePersistedState<Record<string, string>>("dg_todo_notes", {});

  const filtered = TODO_ITEMS
    .filter(item => activeStage === "all" || item.category === activeStage)
    .filter(item => activePriority === "all" || item.priority === activePriority)
    .filter(item => activeTopic === "all" || item.topic === activeTopic)
    .filter(item => {
      if (activeView === "this-week") return isThisWeekTask(item, currentWeek);
      if (activeView === "overdue") return isOverdueTask(item, currentWeek, completedTodos.has(item.id));
      if (activeView === "reminders") return reminders.has(item.id);
      return true;
    });

  const completedCount = TODO_ITEMS.filter(item => completedTodos.has(item.id)).length;
  const totalCount = TODO_ITEMS.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);
  const thisWeekCount = TODO_ITEMS.filter(item => isThisWeekTask(item, currentWeek) && !completedTodos.has(item.id)).length;

  const sectionGroups = (["t1", "t2", "t3", "birth", "postpartum"] as Stage[])
    .map(key => ({
      key,
      label: t(STAGE_LABELS[key] as any),
      items: filtered.filter(item => item.category === key),
    }))
    .filter(group => group.items.length > 0);

  return (
    <div>
      {reminderItem && (
        <ReminderSheet
          item={reminderItem}
          isSet={reminders.has(reminderItem.id)}
          onClose={() => setReminderItem(null)}
          onSetReminder={(id) => { if (!reminders.has(id)) reminders.toggle(id); }}
          onRemoveReminder={(id) => { if (reminders.has(id)) reminders.toggle(id); }}
          language={language}
        />
      )}

      <div className="bg-white/95 backdrop-blur-sm border-b border-slate-200 px-5 py-5 pt-safe sticky top-0 z-10">
        <div className="flex items-baseline justify-between mb-2">
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.08em] mb-0.5">
              {t("checklist.title")}
            </div>
            <div className="text-[1.5rem] font-semibold text-slate-900 leading-none tracking-tight">
              {t("checklist.doneOf", { done: completedCount, total: totalCount })}
            </div>
          </div>
          <button
            onClick={() => onOpenFeature("readiness")}
            className="text-right rounded-xl px-3 py-2 bg-slate-50 border border-slate-200 min-h-[44px]"
          >
            <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">{ro ? "Pregătire" : "Readiness"}</div>
            <div className="text-[18px] leading-none font-semibold text-slate-900 tabular-nums">{progressPct}%</div>
          </button>
        </div>

        <div className="bg-slate-200 rounded-full h-2 overflow-hidden mb-3">
          <div
            className="bg-gradient-to-r from-slate-600 to-slate-800 h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="flex gap-2 mb-3">
          <button
            onClick={() => onOpenFeature("hospital-bag")}
            className="flex-1 min-h-[44px] rounded-xl bg-slate-900 text-white text-[12px] font-semibold flex items-center justify-center gap-2"
          >
            <ClipboardList className="w-4 h-4" />
            {ro ? "Geanta de spital" : "Hospital Bag"}
          </button>
          <button
            onClick={() => onOpenFeature("support-reminders")}
            className="flex-1 min-h-[44px] rounded-xl bg-slate-100 text-slate-700 text-[12px] font-semibold flex items-center justify-center gap-2"
          >
            <Bell className="w-4 h-4" />
            {ro ? "Sprijin" : "Support nudges"}
          </button>
        </div>

        <div className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 mb-3 flex items-center gap-3">
          <ShieldCheck className="w-4 h-4 text-slate-600 flex-shrink-0" />
          <div className="text-[12px] text-slate-600 leading-snug">
            {ro
              ? <><span className="font-semibold text-slate-800">{thisWeekCount}</span> task-uri nefinalizate sunt relevante în jurul săptămânii {currentWeek}.</>
              : <><span className="font-semibold text-slate-800">{thisWeekCount}</span> unfinished tasks are relevant around week {currentWeek}.</>
            }
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 pb-1 mb-2">
          {VIEW_FILTERS.map(filter => (
            <button
              key={filter.key}
              onClick={() => setActiveView(filter.key)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all ${activeView === filter.key ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}
            >
              {ro ? filter.labelRo : filter.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5 pb-1 mb-2">
          {PRIORITIES.map(priority => (
            <button
              key={priority.key}
              onClick={() => setActivePriority(priority.key)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-200 ${activePriority === priority.key ? priority.activeColor : priority.color}`}
            >
              {priority.key === "must" ? t("checklist.mustDo") : priority.key === "should" ? t("checklist.shouldDo") : priority.key === "nice" ? t("checklist.niceToDo") : ro ? "Toate" : priority.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5 pb-1 mb-2">
          {TOPIC_FILTERS.map(topic => (
            <button
              key={topic.key}
              onClick={() => setActiveTopic(topic.key)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all ${activeTopic === topic.key ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}
            >
              {ro ? topic.labelRo : topic.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5 pb-0.5">
          {STAGES.map(stage => (
            <button
              key={stage.key}
              onClick={() => setActiveStage(stage.key)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-200 ${activeStage === stage.key ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              {t(stage.label as any)}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pt-5 pb-32 space-y-6">
        {completedCount === totalCount && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-[1.25rem] p-4 text-center">
            <p className="text-[14px] text-emerald-900 font-semibold">{t("checklist.allDone")}</p>
          </div>
        )}

        {sectionGroups.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[14px] text-slate-400">{
              activeView === "reminders"
                ? (ro ? "Nu ai niciun memento setat încă." : "No reminders set yet.")
                : completedCount === totalCount
                ? t("checklist.allDone")
                : (ro ? "Niciun task pentru aceste filtre." : "No tasks match these filters.")
            }</p>
          </div>
        )}

        {sectionGroups.map(group => {
          const groupCompleted = group.items.filter(item => completedTodos.has(item.id)).length;
          return (
            <div key={group.key}>
              <div className="flex items-center justify-between mb-3">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.08em]">
                  {group.label}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {groupCompleted}/{group.items.length}
                </div>
              </div>

              <div className="bg-white rounded-[1.5rem] border border-slate-200 overflow-hidden shadow-sm divide-y divide-slate-100">
                {group.items.map(item => {
                  const done = completedTodos.has(item.id);
                  const reminderSet = reminders.has(item.id);
                  const noteText = notes[item.id] ?? "";

                  return (
                    <div key={item.id} className={done ? "bg-slate-50/70" : "bg-white"}>
                      <div className="flex items-start gap-3.5 px-4 py-4">
                        <button
                          onClick={() => toggleTodo(item.id)}
                          className="w-8 h-8 -ml-1 flex items-center justify-center flex-shrink-0"
                          aria-label={done ? "Mark incomplete" : "Mark complete"}
                        >
                          {done
                            ? <CheckSquare className="w-5 h-5 text-slate-900" strokeWidth={2} />
                            : <Square className="w-5 h-5 text-slate-300" strokeWidth={2} />
                          }
                        </button>

                        <div className="flex-1 min-w-0">
                          <p className={`text-[14px] leading-relaxed ${done ? "line-through text-slate-400" : "text-slate-800"}`}>
                            {todoText(item, language)}
                          </p>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            {item.weeks && (
                              <span className="text-[11px] text-slate-500 font-medium bg-slate-100 rounded-full px-2 py-0.5">{item.weeks}</span>
                            )}
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide">
                              <span className={`w-1.5 h-1.5 rounded-full ${PRIORITY_DOT[item.priority]}`} />
                              <span className={done ? "text-slate-300" : item.priority === "must" ? "text-red-600" : item.priority === "should" ? "text-amber-700" : "text-emerald-700"}>
                                {item.priority === "must" ? t("checklist.mustDo") : item.priority === "should" ? t("checklist.shouldDo") : t("checklist.niceToDo")}
                              </span>
                            </span>
                            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 bg-slate-100 rounded-full px-2 py-0.5">
                              {topicLabel(item.topic, language)}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <button
                            onClick={() => setReminderItem(item)}
                            className={`w-9 h-9 rounded-full flex items-center justify-center border ${reminderSet ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-400 border-slate-200"}`}
                            aria-label="Add reminder"
                          >
                            <Bell className="w-4 h-4" strokeWidth={2} />
                          </button>
                          <button
                            onClick={() => setNotesOpen(notesOpen === item.id ? null : item.id)}
                            className={`w-9 h-9 rounded-full flex items-center justify-center border ${noteText ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-white text-slate-400 border-slate-200"}`}
                            aria-label="Add notes"
                          >
                            <StickyNote className="w-4 h-4" strokeWidth={2} />
                          </button>
                        </div>
                      </div>

                      {notesOpen === item.id && (
                        <div className="px-4 pb-4 pl-[4.25rem]">
                          <label className="block">
                            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500 mb-1.5 block">{ro ? "Notițe opționale" : "Optional notes"}</span>
                            <textarea
                              rows={3}
                              value={noteText}
                              onChange={(e) => setNotes(current => ({ ...current, [item.id]: e.target.value }))}
                              placeholder={ro ? "Adaugă detalii, întrebări sau un plan." : "Add details, questions, or a plan."}
                              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-[13px] text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-slate-300 resize-none"
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div className="bg-slate-50 rounded-[1.25rem] border border-slate-200 p-4 flex items-start gap-3">
          <FileText className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
          <p className="text-[12px] text-slate-500 leading-relaxed">
            {ro
              ? "Checklist-ul și memento-urile rămân pe acest dispozitiv. Sunt sugestii de sprijin, nu un sistem de judecată."
              : "Checklist and reminder data stays on this device. Reminders are supportive nudges, not a scorecard."}
          </p>
        </div>
      </div>
    </div>
  );
}
