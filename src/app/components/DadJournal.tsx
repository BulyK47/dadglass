import { useState } from "react";
import { Plus, ChevronDown, ChevronLeft, ChevronUp, Trash2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { JournalEntry } from "../context/AppContext";
import { saveTextFile } from "../utils/saveFile";

interface DadJournalProps {
  onClose: () => void;
}

const MOODS = [
  { key: "calm", label: "Calm", labelRo: "Calm", emoji: "😌" },
  { key: "excited", label: "Excited", labelRo: "Entuziasmat", emoji: "🤩" },
  { key: "nervous", label: "Nervous", labelRo: "Neliniștit", emoji: "😟" },
  { key: "tired", label: "Tired", labelRo: "Obosit", emoji: "😴" },
  { key: "overwhelmed", label: "Overwhelmed", labelRo: "Copleșit", emoji: "😵" },
  { key: "grateful", label: "Grateful", labelRo: "Recunoscător", emoji: "🙏" },
];

const WEEKLY_PROMPTS = {
  en: [
    "What did I feel this week?",
    "One thing I did for my partner",
    "One thing I'm nervous about",
    "One thing I'm excited for",
    "A note to the baby",
  ],
  ro: [
    "Ce am simțit săptămâna asta?",
    "Un lucru pe care l-am făcut pentru partenera mea",
    "Un lucru care mă îngrijorează",
    "Un lucru care mă bucură",
    "O notiță pentru bebeluș",
  ],
};

const WEEK_PROMPTS = {
  en: [
    "What's going through your mind as you enter this pregnancy? What are you most hoping for?",
    "How are you and your partner connecting this week? What are you doing to support her?",
    "You're past the halfway point. What surprised you about pregnancy so far?",
    "What are you most nervous about as you prepare for birth? What are you most excited about?",
    "How do you feel about becoming a dad? What do you want to remember from this time?",
  ],
  ro: [
    "Ce îți trece prin minte la începutul acestei sarcini? Ce speri cel mai mult?",
    "Cum vă conectați tu și partenera ta săptămâna asta? Ce faci ca să o susții?",
    "Ați trecut de jumătatea drumului. Ce te-a surprins până acum la sarcină?",
    "Ce te îngrijorează cel mai mult pe măsură ce vă pregătiți pentru naștere? Ce te entuziasmează?",
    "Cum te simți în legătură cu faptul că vei deveni tată? Ce vrei să ții minte din perioada asta?",
  ],
};

const JOURNAL_COPY = {
  en: {
    weekPromptReady: "Week {week} prompt ready",
    thisWeeksPrompt: "This week's prompt",
    promptIdeas: "Prompt ideas",
    mood: "How are you feeling?",
    placeholder: "Write freely - this is just for you.",
    pastEntries: "Past entries",
    noEntries: "No entries yet. Write your first one above.",
    deviceOnly: "Your journal stays on this device only.",
    exportSave: "Save journal",
    exportPrint: "Print / PDF",
    exportEmpty: "Write at least one entry to export.",
    docTitle: "Pregnancy Journal",
    weekLabel: "Week",
  },
  ro: {
    weekPromptReady: "Promptul pentru săptămâna {week} este pregătit",
    thisWeeksPrompt: "Promptul săptămânii",
    promptIdeas: "Idei pentru notiță",
    mood: "Cum te simți?",
    placeholder: "Scrie liber - este doar pentru tine.",
    pastEntries: "Notițe anterioare",
    noEntries: "Nu există notițe încă. Scrie prima notiță mai sus.",
    deviceOnly: "Jurnalul rămâne doar pe acest dispozitiv.",
    exportSave: "Salvează jurnalul",
    exportPrint: "Printează / PDF",
    exportEmpty: "Scrie cel puțin o notiță pentru a exporta.",
    docTitle: "Jurnalul sarcinii",
    weekLabel: "Săptămâna",
  },
};

function escapeHTML(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Build a clean, self-contained HTML document of all journal entries. */
function buildJournalHtml(
  entries: JournalEntry[],
  language: "en" | "ro",
  docTitle: string,
  weekLabel: string,
): string {
  const rows = entries
    .map((e) => {
      const mood = MOODS.find((m) => m.key === e.mood);
      const moodLabel = mood ? `${mood.emoji} ${language === "ro" ? mood.labelRo : mood.label}` : "";
      return `<article>
        <div class="meta"><span class="wk">${weekLabel} ${e.week}</span>
        <span class="date">${escapeHTML(formatDate(e.date, language))}</span>
        <span class="mood">${escapeHTML(moodLabel)}</span></div>
        <p>${escapeHTML(e.text).replace(/\n/g, "<br>")}</p>
      </article>`;
    })
    .join("");

  return `<!doctype html><html lang="${language}"><head><meta charset="utf-8">
    <title>${escapeHTML(docTitle)}</title>
    <style>
      * { box-sizing: border-box; }
      body { font-family: -apple-system, Segoe UI, Roboto, sans-serif; color: #0f172a; margin: 32px; }
      h1 { font-size: 22px; margin: 0 0 4px; }
      .sub { color: #64748b; font-size: 13px; margin: 0 0 24px; }
      article { border-top: 1px solid #e2e8f0; padding: 14px 0; page-break-inside: avoid; }
      .meta { display: flex; gap: 10px; align-items: center; font-size: 12px; margin-bottom: 6px; }
      .wk { background: #0f172a; color: #fff; border-radius: 999px; padding: 2px 8px; font-weight: 600; }
      .date { color: #94a3b8; }
      .mood { color: #475569; }
      p { font-size: 14px; line-height: 1.55; white-space: pre-wrap; margin: 0; }
    </style></head>
    <body>
      <h1>${escapeHTML(docTitle)}</h1>
      <p class="sub">DadGlass · ${entries.length} ${language === "ro" ? "notițe" : "entries"}</p>
      ${rows}
    </body></html>`;
}

/** Save the journal as a self-contained .html file the user can keep/open/print. */
function downloadJournal(entries: JournalEntry[], language: "en" | "ro", docTitle: string, weekLabel: string) {
  const html = buildJournalHtml(entries, language, docTitle, weekLabel);
  const name = `${language === "ro" ? "jurnal-sarcina" : "pregnancy-journal"}.html`;
  // Uses the OS share sheet inside the native app, a normal download on the web.
  void saveTextFile(name, html, "text/html;charset=utf-8");
}

/** Open the print dialog (where the user can choose "Save as PDF"). */
function printJournal(entries: JournalEntry[], language: "en" | "ro", docTitle: string, weekLabel: string) {
  const html = buildJournalHtml(entries, language, docTitle, weekLabel);
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);
  const doc = iframe.contentWindow?.document;
  if (!doc) {
    iframe.remove();
    return;
  }
  doc.open();
  doc.write(html);
  doc.close();
  const win = iframe.contentWindow!;
  const cleanup = () => setTimeout(() => iframe.remove(), 500);
  win.onafterprint = cleanup;
  setTimeout(() => {
    win.focus();
    win.print();
    setTimeout(cleanup, 60000);
  }, 250);
}

function getPromptForWeek(week: number, language: "en" | "ro"): string {
  const prompts = WEEK_PROMPTS[language];
  if (week <= 12) return prompts[0];
  if (week <= 20) return prompts[1];
  if (week <= 27) return prompts[2];
  if (week <= 35) return prompts[3];
  return prompts[4];
}

function formatDate(dateStr: string, language: "en" | "ro"): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(language === "ro" ? "ro-RO" : undefined, { weekday: "short", month: "short", day: "numeric" });
}

export function DadJournal({ onClose }: DadJournalProps) {
  const { currentWeek, journalEntries, addJournalEntry, deleteJournalEntry, language, t } = useApp();
  const copy = JOURNAL_COPY[language];
  const [showForm, setShowForm] = useState(journalEntries.length === 0);
  const [selectedMood, setSelectedMood] = useState("");
  const [text, setText] = useState("");
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

  const prompt = getPromptForWeek(currentWeek, language);

  const handleSubmit = () => {
    if (!text.trim()) return;
    const entry: JournalEntry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      week: currentWeek,
      date: new Date().toISOString(),
      mood: selectedMood,
      text: text.trim(),
    };
    addJournalEntry(entry);
    setText("");
    setSelectedMood("");
    setShowForm(false);
  };

  const sorted = [...journalEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="fixed inset-0 z-50 bg-[#fafaf9] flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-5 py-5">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-slate-600 mb-4 min-h-[44px]"
        >
          <ChevronLeft className="w-4 h-4" />
          {language === "ro" ? "Înapoi" : "Back"}
        </button>
        <div>
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.08em] mb-0.5">
            {copy.weekLabel} {currentWeek}
          </div>
          <h2 className="text-[1.25rem] font-semibold text-slate-900 tracking-tight">{t("journal.title")}</h2>
          <p className="text-[12px] text-slate-500 mt-0.5">{t("journal.subtitle")}</p>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-5 pt-5 pb-6 space-y-4">
          {/* New entry button / form toggle */}
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full flex items-center gap-3 bg-white border border-slate-200 rounded-[1.5rem] px-5 py-4 shadow-sm hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center flex-shrink-0">
                <Plus className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-[14px] font-semibold text-slate-900">{t("journal.write")}</div>
                <div className="text-[12px] text-slate-500">{copy.weekPromptReady.replace("{week}", String(currentWeek))}</div>
              </div>
            </button>
          ) : (
            <div className="bg-white border border-slate-200 rounded-[1.5rem] p-5 shadow-sm">
              {/* Prompt */}
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.08em] mb-2">
                {copy.thisWeeksPrompt}
              </div>
              <p className="text-[14px] text-slate-700 leading-relaxed italic mb-5">
                "{prompt}"
              </p>

              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 mb-5">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.08em] mb-2">
                  {copy.promptIdeas}
                </div>
                <ul className="space-y-1.5">
                  {WEEKLY_PROMPTS[language].map(item => (
                    <li key={item} className="text-[12px] text-slate-600 leading-relaxed">• {item}</li>
                  ))}
                </ul>
              </div>

              {/* Mood selector */}
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.08em] mb-2">
                {copy.mood}
              </div>
              <div className="grid grid-cols-3 gap-2 mb-5">
                {MOODS.map(mood => (
                  <button
                    key={mood.key}
                    onClick={() => setSelectedMood(selectedMood === mood.key ? "" : mood.key)}
                    className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border transition-all ${
                      selectedMood === mood.key
                        ? "bg-slate-900 border-slate-900"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <span className="text-lg">{mood.emoji}</span>
                    <span className={`text-[10px] font-semibold ${selectedMood === mood.key ? "text-white" : "text-slate-500"}`}>
                      {language === "ro" ? mood.labelRo : mood.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Text area */}
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder={copy.placeholder}
                rows={5}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-slate-300 resize-none mb-4"
              />

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => { setShowForm(false); setText(""); setSelectedMood(""); }}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-[14px] font-semibold text-slate-600 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                >
                  {t("common.cancel")}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!text.trim()}
                  className="flex-1 py-3 rounded-xl bg-slate-900 text-white text-[14px] font-semibold disabled:opacity-40 active:scale-[0.98] transition-all"
                >
                  {t("journal.save")}
                </button>
              </div>
            </div>
          )}

          {/* Past entries */}
          {sorted.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.08em] mb-3">
                {copy.pastEntries}
              </div>
              <div className="space-y-2.5">
                {sorted.map(entry => {
                  const mood = MOODS.find(m => m.key === entry.mood);
                  const isExpanded = expandedEntry === entry.id;
                  return (
                    <div key={entry.id} className="bg-white border border-slate-200 rounded-[1.5rem] shadow-sm overflow-hidden">
                      <button
                        onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}
                        className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[12px] font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-full">
                              {copy.weekLabel} {entry.week}
                            </span>
                            {mood && (
                              <span className="text-[12px] text-slate-500">
                                {mood.emoji} {language === "ro" ? mood.labelRo : mood.label}
                              </span>
                            )}
                          </div>
                          <div className="text-[12px] text-slate-400">{formatDate(entry.date, language)}</div>
                        </div>
                        {isExpanded
                          ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" strokeWidth={2} />
                          : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" strokeWidth={2} />
                        }
                      </button>
                      {isExpanded && (
                        <div className="px-4 pb-4 border-t border-slate-100">
                          <p className="text-[14px] text-slate-700 leading-relaxed pt-3 whitespace-pre-wrap">
                            {entry.text}
                          </p>
                          <button
                            onClick={() => { if (confirm(language === "ro" ? "Ștergi această notiță?" : "Delete this entry?")) deleteJournalEntry(entry.id); }}
                            className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-rose-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            {language === "ro" ? "Șterge" : "Delete"}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {journalEntries.length === 0 && !showForm && (
            <p className="text-center text-[13px] text-slate-400 py-8">
              {copy.noEntries}
            </p>
          )}

          <p className="text-center text-[11px] text-slate-400 pt-2">
            {copy.deviceOnly}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => downloadJournal(sorted, language, copy.docTitle, copy.weekLabel)}
              disabled={journalEntries.length === 0}
              className="flex-1 min-h-[44px] rounded-xl bg-slate-900 text-white text-[13px] font-semibold disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed active:scale-[0.99] transition-transform"
            >
              {copy.exportSave}
            </button>
            <button
              onClick={() => printJournal(sorted, language, copy.docTitle, copy.weekLabel)}
              disabled={journalEntries.length === 0}
              className="flex-1 min-h-[44px] rounded-xl border border-slate-300 bg-white text-slate-700 text-[13px] font-semibold disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.99] transition-transform"
            >
              {copy.exportPrint}
            </button>
          </div>
          {journalEntries.length === 0 && (
            <p className="text-center text-[11px] text-slate-400">{copy.exportEmpty}</p>
          )}
        </div>
      </div>
    </div>
  );
}
