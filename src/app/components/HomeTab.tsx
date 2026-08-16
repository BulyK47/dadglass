import { useState } from "react";
import { Baby, Heart, Target, Bell, Lightbulb, ChevronRight, MessageCircle, Copy, Check, Calendar, ShieldCheck, Briefcase, Users } from "lucide-react";
import { getWeekData } from "../data/pregnancyWeeks";
import { GlassComparisonCard } from "./GlassComparisonCard";
import { BabyLookCard } from "./BabyLookCard";
import { ContentCard } from "./ContentCard";
import { ToastCard } from "./ToastCard";
import { EmergencyCard } from "./EmergencyCard";
import { useApp } from "../context/AppContext";
import { FeatureTile, type FeatureKey } from "./FeatureScreens";
import { localizeWeekList, localizeWeekText } from "../utils/localizedWeekContent";

interface HomeTabProps {
  week: number;
  onOpenJournal: () => void;
  onOpenFeature: (feature: FeatureKey) => void;
}

const WEEKLY_MESSAGES: Array<{ en: string; ro: string }> = [
  { en: "This is new, and we do not have to know everything today. I am here with you.", ro: "E ceva nou și nu trebuie să știm totul azi. Sunt aici cu tine." },
  { en: "Let us take this one small step at a time. You are not carrying this alone.", ro: "Hai să luăm totul pas cu pas. Nu duci asta singură." },
  { en: "I want to make the first appointment easier, not heavier. Tell me what would help.", ro: "Vreau să fac prima programare mai ușoară, nu mai grea. Spune-mi ce ar ajuta." },
  { en: "Even quiet weeks matter. I see the effort you are already putting in.", ro: "Și săptămânile liniștite contează. Văd deja efortul pe care îl depui." },
  { en: "If today feels uncertain, I can be steady beside you.", ro: "Dacă ziua de azi pare nesigură, pot fi eu punctul tău de sprijin." },
  { en: "I know early pregnancy can be exhausting. I can handle more of the ordinary stuff.", ro: "Știu că începutul sarcinii poate fi obositor. Pot prelua mai multe lucruri de zi cu zi." },
  { en: "We can decide who to tell, when to tell them, and what stays just ours.", ro: "Putem decide împreună cui spunem, când spunem și ce rămâne doar al nostru." },
  { en: "You do not need to make symptoms sound smaller for me. I want to understand them.", ro: "Nu trebuie să faci simptomele să pară mai mici pentru mine. Vreau să le înțeleg." },
  { en: "I am proud of us. This milestone deserves a real pause.", ro: "Sunt mândru de noi. Momentul ăsta merită o pauză adevărată." },
  { en: "As things start feeling more real, I want us to keep talking, not guessing.", ro: "Pe măsură ce totul devine mai real, vreau să vorbim, nu să ghicim." },
  { en: "I can help make space for rest, food, and whatever makes this week easier.", ro: "Pot face loc pentru odihnă, mâncare și orice face săptămâna mai ușoară." },
  { en: "The scan weeks can bring a lot of feelings. I am with you for all of them.", ro: "Săptămânile cu ecografii pot aduce multe emoții. Sunt cu tine pentru toate." },
  { en: "Let us make appointments feel like something we face together.", ro: "Hai să facem din programări ceva prin care trecem împreună." },
  { en: "I want to learn the practical stuff now so future us has less to carry.", ro: "Vreau să învăț lucrurile practice acum, ca noi de mai târziu să avem mai puțin de dus." },
  { en: "Halfway is a lot. I see the strength behind every normal-looking day.", ro: "Jumătatea drumului înseamnă mult. Văd puterea din spatele fiecărei zile care pare normală." },
  { en: "We can start preparing without rushing. Small decisions count.", ro: "Putem începe pregătirile fără grabă. Deciziile mici contează." },
  { en: "I want your comfort to be part of the plan, not an afterthought.", ro: "Vreau ca și confortul tău să fie parte din plan, nu ceva lăsat la urmă." },
  { en: "If your energy changes day to day, I will adapt with you.", ro: "Dacă energia ta se schimbă de la o zi la alta, mă adaptez și eu." },
  { en: "Let us make the home feel calmer, one corner at a time.", ro: "Hai să facem casa mai liniștită, colț cu colț." },
  { en: "I am paying attention, even when the work is quiet and practical.", ro: "Sunt atent, chiar și la lucrurile mărunte și practice." },
  { en: "You are doing something huge. I can be useful in the small things today.", ro: "Faci ceva uriaș. Azi pot fi util în lucrurile mici." },
  { en: "The third trimester is close. I want us to feel prepared, not pressured.", ro: "Trimestrul al treilea e aproape. Vreau să fim pregătiți, nu presați." },
  { en: "I can take more initiative this week. You should not have to ask for everything.", ro: "Pot lua mai multă inițiativă săptămâna asta. Nu ar trebui să ceri totul." },
  { en: "As the load gets heavier, I want my support to get more practical.", ro: "Pe măsură ce greutatea crește, vreau ca sprijinul meu să fie mai practic." },
  { en: "We do not need a perfect plan. We need a plan we can adjust together.", ro: "Nu avem nevoie de un plan perfect. Avem nevoie de un plan pe care îl ajustăm împreună." },
  { en: "I am here for the appointments, the lists, and the feelings underneath them.", ro: "Sunt aici pentru programări, liste și emoțiile de sub ele." },
  { en: "Let us protect your rest like it is part of the preparation, because it is.", ro: "Hai să protejăm odihna ta ca parte din pregătire, pentru că este." },
  { en: "If the last stretch feels intense, we can shrink today down to the next useful step.", ro: "Dacă ultima etapă pare grea, ne concentrăm doar pe următorul pas util." },
  { en: "I can double-check the practical things so your mind has fewer tabs open.", ro: "Pot verifica eu lucrurile practice, ca tu să ai mai puține pe cap." },
  { en: "We are getting closer. I want you to feel backed up, not watched.", ro: "Ne apropiem. Vreau să te simți susținută, nu monitorizată." },
  { en: "The hospital bag and the birth plan are my work too.", ro: "Mă ocup și eu de geanta de spital și de planul de naștere." },
  { en: "I will listen first, especially when decisions start feeling big.", ro: "Voi asculta mai întâi, mai ales când deciziile încep să pară mari." },
  { en: "Almost there does not mean easy. I see how much these days ask from you.", ro: "Aproape gata nu înseamnă ușor. Văd cât cer zilele astea de la tine." },
  { en: "I can be calm for both of us when the waiting feels long.", ro: "Pot fi calm pentru amândoi când așteptarea pare lungă." },
  { en: "Whatever changes this week, I want us to meet it as a team.", ro: "Orice se schimbă săptămâna asta, vreau să-i facem față ca o echipă." },
  { en: "I am ready to follow your lead and support the plan we choose together.", ro: "Sunt gata să îți urmez ritmul și să susțin planul ales împreună." },
  { en: "I am proud of you. We are right here, together, at the edge of meeting them.", ro: "Sunt mândru de tine. Suntem aici, împreună, aproape să îl întâlnim." },
];

function getMessageForWeek(week: number, lang: string): string {
  const index = Math.min(Math.max(week, 4), 40) - 4;
  return WEEKLY_MESSAGES[index][lang === "ro" ? "ro" : "en"];
}

function getQuestionForWeek(week: number) {
  if (week <= 12) return "What symptoms should we watch for between appointments?";
  if (week <= 20) return "What should we ask at the next scan or appointment?";
  if (week <= 28) return "What support would make this week feel lighter?";
  if (week <= 36) return "What do we still need before birth feels manageable?";
  return "When should we call instead of waiting?";
}

function getQuestionForWeekRo(week: number) {
  if (week <= 12) return "La ce simptome ar trebui să fim atenți între programări?";
  if (week <= 20) return "Ce ar trebui să întrebăm la următoarea ecografie sau programare?";
  if (week <= 28) return "Ce sprijin ar face săptămâna asta mai ușoară?";
  if (week <= 36) return "Ce ne mai trebuie ca nașterea să pară gestionabilă?";
  return "Când ar trebui să sunăm, în loc să așteptăm?";
}

const WEEKLY_NOT_TO_SAY: Array<{ en: { dont: string; say: string }; ro: { dont: string; say: string } }> = [
  { en: { dont: "So what happens now?", say: "We can take the next step together." }, ro: { dont: "Și acum ce facem?", say: "Putem face următorul pas împreună." } },
  { en: { dont: "Try not to think about it.", say: "Tell me what is on your mind." }, ro: { dont: "Încearcă să nu te gândești.", say: "Spune-mi ce ai în minte." } },
  { en: { dont: "It is probably fine.", say: "If you are worried, let us ask." }, ro: { dont: "Probabil e bine.", say: "Dacă te îngrijorează, hai să întrebăm." } },
  { en: { dont: "Already tired?", say: "I can take something off your plate." }, ro: { dont: "Deja ești obosită?", say: "Pot prelua ceva de pe lista ta." } },
  { en: { dont: "You are being dramatic.", say: "That sounds uncomfortable. I am listening." }, ro: { dont: "Dramatizezi.", say: "Sună neplăcut. Te ascult." } },
  { en: { dont: "Just eat something.", say: "What food feels possible right now?" }, ro: { dont: "Mănâncă și tu ceva.", say: "Ce mâncare pare posibilă acum?" } },
  { en: { dont: "Can we tell everyone now?", say: "How do you want to share the news?" }, ro: { dont: "Putem spune tuturor acum?", say: "Cum vrei să dăm vestea?" } },
  { en: { dont: "You are worrying too much.", say: "Let us write the question down." }, ro: { dont: "Îți faci prea multe griji.", say: "Hai să notăm întrebarea." } },
  { en: { dont: "At least the first part is over.", say: "That first stretch took a lot from you." }, ro: { dont: "Măcar a trecut prima parte.", say: "Prima etapă a cerut mult de la tine." } },
  { en: { dont: "You look normal to me.", say: "How are you actually feeling today?" }, ro: { dont: "Mie mi se pare că arăți normal.", say: "Cum te simți de fapt azi?" } },
  { en: { dont: "Do we really need another appointment?", say: "I will help keep track of the appointments." }, ro: { dont: "Chiar mai trebuie o programare?", say: "Te ajut să ținem evidența programărilor." } },
  { en: { dont: "This scan is routine.", say: "It makes sense to feel a lot before a scan." }, ro: { dont: "E doar o ecografie de rutină.", say: "E normal să simți multe înainte de ecografie." } },
  { en: { dont: "I do not know what to ask.", say: "Let us choose three questions together." }, ro: { dont: "Nu știu ce să întreb.", say: "Hai să alegem trei întrebări împreună." } },
  { en: { dont: "You decide, I do not mind.", say: "I want to help decide this with you." }, ro: { dont: "Decizi tu, mie mi-e indiferent.", say: "Vreau să decidem asta împreună." } },
  { en: { dont: "Halfway means easy now, right?", say: "Halfway is big. What would help this week?" }, ro: { dont: "La jumătate înseamnă că e ușor acum, nu?", say: "Jumătatea e importantă. Ce ar ajuta săptămâna asta?" } },
  { en: { dont: "We have plenty of time.", say: "Let us handle one small task now." }, ro: { dont: "Avem destul timp.", say: "Hai să rezolvăm un lucru mic acum." } },
  { en: { dont: "That purchase can wait forever.", say: "Let us decide what matters first." }, ro: { dont: "Cumpărătura asta poate aștepta la nesfârșit.", say: "Hai să decidem ce contează prima dată." } },
  { en: { dont: "Why are you uncomfortable again?", say: "What position or break would help?" }, ro: { dont: "Iar ești inconfortabilă?", say: "Ce poziție sau pauză ar ajuta?" } },
  { en: { dont: "I thought nesting was just a joke.", say: "I can help make this space feel ready." }, ro: { dont: "Credeam că pregătirea casei e o glumă.", say: "Pot ajuta să pregătim spațiul." } },
  { en: { dont: "Just send me the list.", say: "Let us go through the list together." }, ro: { dont: "Trimite-mi lista și gata.", say: "Hai să trecem prin listă împreună." } },
  { en: { dont: "You are still emotional?", say: "There is a lot happening. I am here." }, ro: { dont: "Încă ești emoțională?", say: "Se întâmplă multe. Sunt aici." } },
  { en: { dont: "Third trimester already? That was fast.", say: "This has been a lot. I see that." }, ro: { dont: "Deja trimestrul trei? A trecut repede.", say: "A fost mult. Văd asta." } },
  { en: { dont: "Tell me exactly what to do.", say: "I will pick something useful and do it." }, ro: { dont: "Spune-mi exact ce să fac.", say: "Aleg ceva util și mă ocup." } },
  { en: { dont: "The birth plan is your thing.", say: "I want to understand the birth plan too." }, ro: { dont: "Planul de naștere e treaba ta.", say: "Vreau să înțeleg și eu planul de naștere." } },
  { en: { dont: "Do we need to talk about visitors now?", say: "Let us set boundaries before we are tired." }, ro: { dont: "Trebuie să vorbim acum despre vizitatori?", say: "Hai să stabilim limite înainte să fim obosiți." } },
  { en: { dont: "You packed too much.", say: "Let us pack what helps you feel ready." }, ro: { dont: "Ai împachetat prea multe.", say: "Hai să punem ce te ajută să te simți pregătită." } },
  { en: { dont: "I cannot do much until baby arrives.", say: "There are useful things I can do today." }, ro: { dont: "Nu prea am ce face până vine bebe.", say: "Sunt lucruri utile pe care le pot face azi." } },
  { en: { dont: "You should sleep while you can.", say: "How can I help you actually rest?" }, ro: { dont: "Dormi cât mai poți.", say: "Cum te pot ajuta să te odihnești cu adevărat?" } },
  { en: { dont: "Stop checking the bag.", say: "I can check the bag with you once more." }, ro: { dont: "Nu mai verifica geanta.", say: "Pot verifica geanta cu tine încă o dată." } },
  { en: { dont: "You are moving so slowly.", say: "Take your time. I can adjust." }, ro: { dont: "Te miști prea încet.", say: "Ia-ți timpul. Mă adaptez." } },
  { en: { dont: "I already know what to do.", say: "Tell me what support feels right to you." }, ro: { dont: "Știu deja ce am de făcut.", say: "Spune-mi ce sprijin ți se potrivește." } },
  { en: { dont: "It cannot be that uncomfortable.", say: "I believe you. What would ease it?" }, ro: { dont: "Nu poate fi chiar atât de neplăcut.", say: "Te cred. Ce ar ușura lucrurile?" } },
  { en: { dont: "Any day now, right?", say: "Waiting can be hard. I am here in it." }, ro: { dont: "Stă să vină, nu?", say: "Așteptarea poate fi grea. Sunt aici cu tine." } },
  { en: { dont: "Why are you nervous now?", say: "This is big. We can breathe through it." }, ro: { dont: "De ce ești emoționată acum?", say: "E un moment important. Respirăm împreună." } },
  { en: { dont: "Let us just get it over with.", say: "I will follow your pace and the medical guidance." }, ro: { dont: "Hai să terminăm odată.", say: "Îți urmez ritmul și recomandările medicale." } },
  { en: { dont: "I am bored of waiting.", say: "I know waiting asks a lot. I am staying present." }, ro: { dont: "M-am plictisit de așteptat.", say: "Știu că așteptarea cere mult. Suntem împreună." } },
  { en: { dont: "Do not panic.", say: "I am right here. Let us take the next step." }, ro: { dont: "Nu intra în panică.", say: "Sunt aici. Trecem împreună la următorul pas." } },
];

function getWhatNotToSayForWeek(week: number, language: string) {
  const index = Math.min(Math.max(week, 4), 40) - 4;
  return WEEKLY_NOT_TO_SAY[index][language === "ro" ? "ro" : "en"];
}

function WhatNotToSayCard({ week }: { week: number }) {
  const { t, language } = useApp();
  const pair = getWhatNotToSayForWeek(week, language);
  return (
    <div className="bg-white rounded-[1.5rem] p-5 mx-5 mb-4 shadow-sm border border-slate-100">
      <div className="flex items-center gap-2.5 mb-4">
        <MessageCircle className="w-5 h-5 text-slate-500" strokeWidth={2} />
        <h3 className="text-[16px] font-semibold text-slate-900 tracking-tight">{t("home.whatNotToSay")}</h3>
      </div>
      <div className="space-y-3">
        <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mt-0.5 flex-shrink-0 w-14">{language === "ro" ? "Evită" : "Don't"}</div>
          <p className="text-[14px] text-slate-500 italic line-through decoration-slate-300">"{pair.dont}"</p>
        </div>
        <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
          <div className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wide mt-0.5 flex-shrink-0 w-14">{language === "ro" ? "Spune" : "Instead"}</div>
          <p className="text-[14px] text-emerald-900 italic">"{pair.say}"</p>
        </div>
      </div>
    </div>
  );
}

function MessageForHerCard({ week }: { week: number }) {
  const { t, language, dadStyle } = useApp();
  const [copied, setCopied] = useState(false);
  // Default the tone from the dad's onboarding style preference.
  const initialTone: "base" | "casual" | "emotional" =
    dadStyle.tone === "Warm" ? "emotional" : dadStyle.tone === "Light humor" ? "casual" : "base";
  const [tone, setTone] = useState<"base" | "casual" | "emotional">(initialTone);
  const baseMessage = getMessageForWeek(week, language);
  const message = tone === "casual"
    ? language === "ro"
      ? `${baseMessage} Facem pas cu pas, împreună.`
      : `${baseMessage} One step at a time, together.`
    : tone === "emotional"
    ? language === "ro"
      ? `${baseMessage} Vreau să știi că văd cât de mult duci.`
      : `${baseMessage} I want you to know I see how much you're carrying.`
    : baseMessage;

  const handleCopy = () => {
    navigator.clipboard.writeText(message).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-[1.5rem] p-5 mx-5 mb-4 border border-amber-100">
      <div className="text-[11px] font-semibold text-amber-700 uppercase tracking-[0.08em] mb-3">
        {t("home.messageForHer")}
      </div>
      <p className="text-[15px] text-amber-900 leading-relaxed italic mb-4">
        "{message}"
      </p>
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 text-[13px] font-semibold text-amber-800 bg-white/70 px-3 py-2 rounded-lg border border-amber-200 active:scale-[0.98] transition-all"
      >
        {copied
          ? <><Check className="w-3.5 h-3.5" />{language === "ro" ? "Copiat" : "Copied"}</>
          : <><Copy className="w-3.5 h-3.5" />{language === "ro" ? "Copiază" : "Copy to send"}</>
        }
      </button>
      <div className="text-[11px] font-semibold text-amber-700/80 uppercase tracking-[0.06em] mt-4 mb-2">
        {language === "ro" ? "Tonul mesajului" : "Message tone"}
      </div>
      <div className="flex flex-wrap gap-2">
        {([
          { id: "base", ro: "Simplu", en: "Simple" },
          { id: "casual", ro: "Mai relaxat", en: "More casual" },
          { id: "emotional", ro: "Mai emoțional", en: "More emotional" },
        ] as const).map((o) => (
          <button
            key={o.id}
            onClick={() => setTone(o.id)}
            className={`px-3 py-2 rounded-full border text-[12px] font-semibold transition-all ${
              tone === o.id ? "bg-amber-700 text-white border-amber-700" : "bg-white/70 border-amber-200 text-amber-800"
            }`}
          >
            {language === "ro" ? o.ro : o.en}
          </button>
        ))}
      </div>
    </div>
  );
}

function ThisWeekSummaryCard({ weekData, week, expanded, onExpand }: { weekData: ReturnType<typeof getWeekData>; week: number; expanded: boolean; onExpand: () => void }) {
  const { t, language } = useApp();
  if (!weekData) return null;

  const trimesterStatus = weekData.trimester === "First Trimester"
    ? t("home.firstTrimesterEnding")
    : weekData.trimester === "Second Trimester"
    ? t("home.secondTrimester")
    : t("home.thirdTrimester");

  const blocks = [
    { label: language === "ro" ? "Bebelușul" : "Baby this week", text: localizeWeekText(weekData.babyThisWeek.milestones[0], language) },
    { label: language === "ro" ? "Ea poate simți" : "She may be feeling", text: localizeWeekText(weekData.momThisWeek.physical[0], language) },
    { label: language === "ro" ? "Cum poți ajuta" : "How you can help", text: localizeWeekText(weekData.dadActions[0], language) },
    { label: language === "ro" ? "Un lucru de făcut" : "One thing to do", text: localizeWeekText(weekData.dadActions[1] || weekData.dadActions[0], language) },
    { label: language === "ro" ? "Întrebare" : "Question to ask", text: language === "ro" ? getQuestionForWeekRo(week) : getQuestionForWeek(week) },
  ];

  return (
    <div className="bg-white rounded-[1.75rem] mx-5 mb-4 shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-6 pt-5 pb-4">
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.08em] mb-0.5">
          {trimesterStatus}
        </div>
        <h2 className="text-[20px] font-semibold text-slate-900 tracking-tight">
          {t("home.thisWeekForDad")}
        </h2>
        <div className="text-[13px] text-slate-400 font-medium">{t("journey.weekOf", { w: week })}</div>
      </div>

      <div className="border-t border-slate-100 divide-y divide-slate-100">
        {blocks.map((block, i) => (
          <div key={i} className="px-6 py-3.5 flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 flex-shrink-0" />
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.08em] mb-0.5">
                {block.label}
              </div>
              <p className="text-[14px] text-slate-700 leading-relaxed">{block.text}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onExpand}
        className="w-full flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100 text-[13px] font-semibold text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors"
      >
        {expanded ? (language === "ro" ? "Ascunde detaliile" : "Hide full breakdown") : t("home.viewFullBreakdown")}
        <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${expanded ? "rotate-90" : ""}`} />
      </button>
    </div>
  );
}

function DadMoveCard({ actions }: { actions: string[] }) {
  const { t, language } = useApp();
  return (
    <div className="bg-white rounded-[1.5rem] p-5 mx-5 mb-4 shadow-sm border border-slate-100">
      <div className="flex items-center gap-2.5 mb-4">
        <Target className="w-5 h-5 text-slate-600" strokeWidth={2} />
        <h3 className="text-[16px] font-semibold text-slate-900 tracking-tight">{t("home.dadMoveThisWeek")}</h3>
      </div>
      <div className="space-y-2.5">
        {localizeWeekList(actions.slice(0, 3), language).map((action, index) => (
          <div key={action} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-5 h-5 rounded-md border-2 border-slate-300 flex-shrink-0 mt-0.5 flex items-center justify-center text-[10px] font-semibold text-slate-500">
              {index + 1}
            </div>
            <p className="text-[14px] text-slate-700 leading-relaxed">{action}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FullWeekBreakdown({ weekData }: { weekData: NonNullable<ReturnType<typeof getWeekData>> }) {
  const { t, language } = useApp();

  return (
    <>
      <ContentCard icon={Baby} title={t("home.babyThisWeek")}>
        <p className="text-[14px] text-slate-700 leading-relaxed">{localizeWeekText(weekData.babyThisWeek.summary, language)}</p>
        <ul className="space-y-2.5 mt-3">
          {localizeWeekList(weekData.babyThisWeek.milestones, language).map((m, i) => (
            <li key={i} className="flex items-start gap-3 text-[14px] text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
              <span className="leading-relaxed">{m}</span>
            </li>
          ))}
        </ul>
      </ContentCard>

      <ContentCard icon={Heart} title={t("home.sheMayFeel")} variant="sage">
        <div>
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.08em] mb-3">{t("home.physical")}</div>
          <ul className="space-y-2">
            {localizeWeekList(weekData.momThisWeek.physical, language).map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-[14px] text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        {weekData.momThisWeek.emotional.length > 0 && (
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.08em] mb-3">{t("home.emotionalState")}</div>
            <ul className="space-y-2">
              {localizeWeekList(weekData.momThisWeek.emotional, language).map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[14px] text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </ContentCard>

      <ContentCard icon={Bell} title={t("home.watchOuts")}>
        <p className="text-[14px] text-slate-700 leading-relaxed">{localizeWeekText(weekData.headsUp, language)}</p>
      </ContentCard>

      {weekData.emergencyContact && (
        <EmergencyCard symptoms={weekData.emergencyContact.urgentSymptoms} advice={weekData.emergencyContact.advice} />
      )}

      <ContentCard icon={Lightbulb} title={t("home.dadMode")} variant="warm">
        <p className="text-[15px] text-slate-700 leading-relaxed italic">"{localizeWeekText(weekData.dadTip, language)}"</p>
      </ContentCard>
    </>
  );
}

function QuickTools({ onOpenJournal, onOpenFeature }: Pick<HomeTabProps, "onOpenJournal" | "onOpenFeature">) {
  const { language } = useApp();
  const ro = language === "ro";
  return (
    <div className="mx-5 mb-4">
      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.08em] mb-3 px-1">
        {ro ? "Instrumente" : "Tools"}
      </div>
      <div className="space-y-2.5">
        <FeatureTile title={ro ? "Copilot programări" : "Appointment Copilot"} subtitle={ro ? "Întrebări și notițe" : "Prep questions and save notes"} icon={Calendar} onClick={() => onOpenFeature("appointment")} />
        <FeatureTile title={ro ? "Scor de pregătire" : "Dad Readiness Score"} subtitle={ro ? "Următorii pași utili" : "Encouraging next actions"} icon={ShieldCheck} onClick={() => onOpenFeature("readiness")} />
        <FeatureTile title={ro ? "Geanta de spital" : "Hospital Bag"} subtitle={ro ? "Ea, bebe, tata, documente" : "For her, baby, dad, documents"} icon={Briefcase} onClick={() => onOpenFeature("hospital-bag")} />
        <FeatureTile title={ro ? "Întrebări împreună" : "Ask Together"} subtitle={ro ? "Întrebări de discutat împreună" : "Conversation starters"} icon={Users} onClick={() => onOpenFeature("ask-together")} />
        <FeatureTile title={ro ? "Jurnalul tatălui" : "Dad Journal"} subtitle={ro ? "Notițe private săptămânale" : "Private weekly notes"} icon={MessageCircle} onClick={onOpenJournal} />
      </div>
    </div>
  );
}

export function HomeTab({ week, onOpenJournal, onOpenFeature }: HomeTabProps) {
  const { t, profile, language } = useApp();
  const weekData = getWeekData(week);
  const [expanded, setExpanded] = useState(true);

  if (!weekData) return null;

  const dadName = profile.dadName?.trim();

  return (
    <div className="pt-4">
      {/* MARKER-MAKE-KIT-INVOKED */}

      {/* Personalized greeting */}
      {dadName && (
        <div className="mx-5 mb-3 text-[15px] font-semibold text-slate-800">
          {language === "ro" ? `Bună, ${dadName} 👋` : `Hi, ${dadName} 👋`}
        </div>
      )}

      {/* Weekly toast */}
      {weekData.toast && <ToastCard toast={weekData.toast} week={week} />}

      {/* Glass / Dad Object comparison — hero feature */}
      <GlassComparisonCard
        glassType={weekData.glassType}
        fillDescription={weekData.fillDescription}
        fillPercent={weekData.fillPercent}
        week={week}
        trimester={weekData.trimester}
        babyWeight={weekData.babyWeight}
        babyLength={weekData.babyLength}
      />

      <BabyLookCard week={week} />

      {/* This Week for Dad — compact summary */}
      <ThisWeekSummaryCard
        weekData={weekData}
        week={week}
        expanded={expanded}
        onExpand={() => setExpanded(v => !v)}
      />

      {expanded && <FullWeekBreakdown weekData={weekData} />}

      <DadMoveCard actions={weekData.dadActions} />

      <QuickTools onOpenJournal={onOpenJournal} onOpenFeature={onOpenFeature} />

      {/* Message for her */}
      <MessageForHerCard week={week} />

      {/* What not to say */}
      <WhatNotToSayCard week={week} />

      <div className="mx-5 mb-5 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <p className="text-[11px] text-slate-500 leading-relaxed text-center">
          {t("disclaimer.short")}
        </p>
      </div>
    </div>
  );
}
