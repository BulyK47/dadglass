import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { createT, TKey } from "../i18n";

export type Lang = "en" | "ro";
export type Units = "metric" | "imperial";
export type ComparisonMode = "glass" | "dad-object";

export interface ProfileData {
  dadName: string;
  partnerName: string;
  babyNickname: string;
  dueDate: string;
}

export interface DadStyleData {
  priorities: string[];
  mood: string;
  tone: string;
}

export interface JournalEntry {
  id: string;
  week: number;
  date: string;
  mood: string;
  text: string;
}

export interface AppointmentNote {
  id: string;
  createdAt: string;
  date: string;
  clinician: string;
  questions: string;
  answers: string;
  nextSteps: string;
  nextAppointment: string;
}

interface AppContextType {
  language: Lang;
  setLanguage: (lang: Lang) => void;
  units: Units;
  setUnits: (units: Units) => void;
  comparisonMode: ComparisonMode;
  setComparisonMode: (mode: ComparisonMode) => void;
  currentWeek: number;
  setCurrentWeek: (week: number) => void;
  profile: ProfileData;
  updateProfile: (updates: Partial<ProfileData>) => void;
  dadStyle: DadStyleData;
  updateDadStyle: (updates: Partial<DadStyleData>) => void;
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
  hasSeenDisclaimer: boolean;
  markDisclaimerSeen: () => void;
  completedTodos: Set<string>;
  toggleTodo: (id: string) => void;
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: JournalEntry) => void;
  deleteJournalEntry: (id: string) => void;
  appointmentNotes: AppointmentNote[];
  addAppointmentNote: (note: Omit<AppointmentNote, "id" | "createdAt">) => void;
  deleteAppointmentNote: (id: string) => void;
  bookmarkedGuides: Set<string>;
  toggleBookmark: (id: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  resetAllData: () => void;
  t: (key: TKey, vars?: Record<string, string | number>) => string;
}

const AppContext = createContext<AppContextType | null>(null);

function load<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

function usePersisted<T>(key: string, initial: T): [T, (v: T) => void] {
  const [state, setState] = useState<T>(() => load(key, initial));
  const set = (v: T) => { setState(v); save(key, v); };
  return [state, set];
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = usePersisted<Lang>("dg_lang", "en");
  const [units, setUnits] = usePersisted<Units>("dg_units", "metric");
  const [comparisonMode, setComparisonMode] = usePersisted<ComparisonMode>("dg_cmp", "glass");
  const [currentWeek, setCurrentWeek] = usePersisted<number>("dg_week", 4);
  const [profile, setProfileRaw] = usePersisted<ProfileData>("dg_profile", { dadName: "", partnerName: "", babyNickname: "", dueDate: "" });
  const [dadStyle, setDadStyleRaw] = usePersisted<DadStyleData>("dg_style", { priorities: [], mood: "", tone: "" });
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = usePersisted<boolean>("dg_onboarded", false);
  const [hasSeenDisclaimer, setHasSeenDisclaimer] = usePersisted<boolean>("dg_disclaimer", false);
  const [todosArr, setTodosArr] = usePersisted<string[]>("dg_todos", []);
  const [journalEntries, setJournalEntries] = usePersisted<JournalEntry[]>("dg_journal", []);
  const [appointmentNotes, setAppointmentNotes] = usePersisted<AppointmentNote[]>("dg_appointment_notes", []);
  const [bookmarksArr, setBookmarksArr] = usePersisted<string[]>("dg_bookmarks", []);
  const [activeTab, setActiveTab] = useState("home");

  // Keep <html lang> in sync with the selected language (accessibility / SEO).
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const completedTodos = new Set(todosArr);
  const bookmarkedGuides = new Set(bookmarksArr);

  const updateProfile = (updates: Partial<ProfileData>) => setProfileRaw({ ...profile, ...updates });
  const updateDadStyle = (updates: Partial<DadStyleData>) => setDadStyleRaw({ ...dadStyle, ...updates });
  const completeOnboarding = () => setHasCompletedOnboarding(true);
  const markDisclaimerSeen = () => setHasSeenDisclaimer(true);

  const toggleTodo = (id: string) => {
    const next = new Set(todosArr);
    next.has(id) ? next.delete(id) : next.add(id);
    setTodosArr([...next]);
  };

  const addJournalEntry = (entry: JournalEntry) => setJournalEntries([...journalEntries, entry]);
  const deleteJournalEntry = (id: string) => setJournalEntries(journalEntries.filter(e => e.id !== id));
  const addAppointmentNote = (note: Omit<AppointmentNote, "id" | "createdAt">) => {
    setAppointmentNotes([
      {
        ...note,
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        createdAt: new Date().toISOString(),
      },
      ...appointmentNotes,
    ]);
  };
  const deleteAppointmentNote = (id: string) => setAppointmentNotes(appointmentNotes.filter(n => n.id !== id));

  const resetAllData = () => {
    try {
      Object.keys(localStorage)
        .filter(k => k.startsWith("dg_"))
        .forEach(k => localStorage.removeItem(k));
    } catch {}
    location.reload();
  };

  const toggleBookmark = (id: string) => {
    const next = new Set(bookmarksArr);
    next.has(id) ? next.delete(id) : next.add(id);
    setBookmarksArr([...next]);
  };

  const t = createT(language);

  return (
    <AppContext.Provider value={{
      language, setLanguage, units, setUnits, comparisonMode, setComparisonMode,
      currentWeek, setCurrentWeek, profile, updateProfile, dadStyle, updateDadStyle,
      hasCompletedOnboarding, completeOnboarding, hasSeenDisclaimer, markDisclaimerSeen,
      completedTodos, toggleTodo, journalEntries, addJournalEntry, deleteJournalEntry,
      appointmentNotes, addAppointmentNote, deleteAppointmentNote,
      bookmarkedGuides, toggleBookmark, activeTab, setActiveTab, resetAllData, t,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
