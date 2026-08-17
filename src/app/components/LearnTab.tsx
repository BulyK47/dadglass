import { useState, type ComponentType, type ReactNode } from "react";
import { ChevronDown, ChevronUp, AlertTriangle, Heart, FileText, Brain, Home, BookOpen, Star, Search, Phone, Calendar, MessageCircle, Briefcase } from "lucide-react";
import { useApp } from "../context/AppContext";
import { FeatureTile, type FeatureKey } from "./FeatureScreens";

interface LearnSection {
  id: string;
  icon: ComponentType<{ className?: string; strokeWidth?: string | number }>;
  title: string;
  subtitle: string;
  tags: string[];
  content: ReactNode;
  variant?: "default" | "alert";
  readTime?: string;
}

interface LearnTabProps {
  onOpenFeature: (feature: FeatureKey) => void;
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function SubHeading({ children }: { children: ReactNode }) {
  return (
    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.08em] pt-2">
      {children}
    </div>
  );
}

function AlertBox({ children }: { children: ReactNode }) {
  return (
    <div className="bg-orange-50 border border-orange-200 rounded-xl p-3.5">
      <p className="text-[13px] text-orange-800 leading-relaxed">{children}</p>
    </div>
  );
}

const SECTIONS: LearnSection[] = [
  {
    id: "labor",
    icon: AlertTriangle,
    title: "Signs of Labor",
    subtitle: "When to go, when to wait",
    tags: ["labor", "emergency", "birth"],
    variant: "alert",
    content: (
      <div className="space-y-4">
        <AlertBox>
          <strong>The 5-1-1 rule:</strong> Call when contractions are every 5 minutes, lasting 1 minute each, for 1 hour. If in doubt, call anyway.
        </AlertBox>

        <div>
          <SubHeading>Real Contractions</SubHeading>
          <BulletList items={[
            "Come at regular intervals and get closer together over time",
            "Last 30–70 seconds and grow longer and stronger",
            "Don't ease up when she walks, rests, or changes position",
            "Often start in the lower back and move forward",
          ]} />
        </div>

        <div>
          <SubHeading>Braxton Hicks (Practice Contractions)</SubHeading>
          <BulletList items={[
            "Irregular — no consistent pattern or timing",
            "Don't intensify over time",
            "Usually ease with rest, movement, or water",
            "Uncomfortable but not painful for most",
          ]} />
        </div>

        <div>
          <SubHeading>Other Signs</SubHeading>
          <BulletList items={[
            "Waters breaking — can be a gush or a slow trickle",
            "Mucus plug or bloody show — a pink or brown discharge",
            "Sudden increase in pelvic pressure or \"lightening\"",
          ]} />
        </div>

        <div>
          <SubHeading>Call Immediately If</SubHeading>
          <BulletList items={[
            "Waters break (note the time, colour, and smell)",
            "Any bright red bleeding",
            "Baby's movements have significantly reduced",
            "She has a severe headache, vision changes, or sudden swelling",
          ]} />
        </div>
      </div>
    ),
  },
  {
    id: "labor-support",
    icon: Heart,
    title: "Supporting Her in Labor",
    subtitle: "Your role in the room",
    tags: ["labor", "partner support", "birth"],
    content: (
      <div className="space-y-4">
        <p>You're there to be a steady, calm presence — not to solve problems or manage pain. Your job is to show up and stay in it with her.</p>

        <div>
          <SubHeading>What Actually Helps</SubHeading>
          <BulletList items={[
            "Ask how she wants to be supported — and keep checking in",
            "Cold flannel on the forehead or warm pack on the lower back",
            "Offer ice chips, sips of water, and lip balm",
            "Breathing with her, or counting quietly through contractions",
            "Light pressure on the lower back or hips during contractions (ask first)",
            "Keep the room calm — dim lights, quiet voice, minimal visitors",
          ]} />
        </div>

        <div>
          <SubHeading>Being Her Advocate</SubHeading>
          <BulletList items={[
            "Know her birth plan and speak up for it when she can't",
            "Ask the team to explain anything that's happening",
            "Say: \"Can we have a moment before we decide?\" — it's always okay to ask",
            "Don't let yourself be intimidated by the clinical environment",
          ]} />
        </div>

        <div>
          <SubHeading>What Not to Say</SubHeading>
          <BulletList items={[
            "\"Just relax\" or \"calm down\" — she knows",
            "\"How much longer?\" — nobody knows",
            "\"Is this normal?\" — ask the midwife, not her",
            "Anything about your own discomfort",
          ]} />
        </div>

        <p className="text-slate-600 italic">Silence with a hand held is one of the most powerful things you can offer.</p>
      </div>
    ),
  },
  {
    id: "what-not-to-say",
    icon: MessageCircle,
    title: "What Not To Say",
    subtitle: "Better words for hard moments",
    tags: ["partner support", "mental health", "communication"],
    readTime: "3 min read",
    content: (
      <div className="space-y-4">
        <p>Pregnancy can make ordinary sentences land harder. The goal is not perfect wording; it is to stay kind, curious, and on her side.</p>

        {[
          ["You're overreacting.", "I'm here. Tell me what you need."],
          ["At least...", "That sounds really hard."],
          ["How much longer?", "You're doing great. I'm with you."],
          ["Just relax.", "What would make today easier?"],
        ].map(([dont, say]) => (
          <div key={dont} className="grid grid-cols-1 gap-2">
            <div className="rounded-xl bg-slate-50 p-3">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.08em] mb-1">Do not say</div>
              <p className="text-[14px] text-slate-500 italic line-through decoration-slate-300">"{dont}"</p>
            </div>
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3">
              <div className="text-[10px] font-semibold text-emerald-700 uppercase tracking-[0.08em] mb-1">Say instead</div>
              <p className="text-[14px] text-emerald-900 italic">"{say}"</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "birth-plan",
    icon: FileText,
    title: "Birth Plan Basics",
    subtitle: "Preferences, not a contract",
    tags: ["birth plan", "birth", "partner support"],
    content: (
      <div className="space-y-4">
        <p>A birth plan communicates preferences — it's not a binding document. Labor is unpredictable. The goal is a shared understanding going in, not a rigid script.</p>

        <div>
          <SubHeading>What to Cover</SubHeading>
          <BulletList items={[
            "Pain management preferences (epidural, gas and air, water, movement)",
            "Positions for labor and delivery",
            "Who's in the room — and who isn't",
            "Monitoring: continuous or intermittent",
            "Pushing: directed or instinct-led",
            "Cord clamping: immediate or delayed",
            "Skin-to-skin after birth — for both of you",
            "Feeding intentions",
            "What happens if a caesarean becomes necessary",
          ]} />
        </div>

        <div>
          <SubHeading>Keep It</SubHeading>
          <BulletList items={[
            "Short — one page max, bullet points",
            "Positive — \"we'd prefer\" rather than \"we don't want\"",
            "Flexible — birth rarely follows a plan exactly",
          ]} />
        </div>

        <p className="text-slate-600">Discuss it with your midwife at an antenatal appointment so there are no surprises on the day.</p>
      </div>
    ),
  },
  {
    id: "dad-mental-health",
    icon: Brain,
    title: "Dad Mental Health",
    subtitle: "What they don't tell you",
    tags: ["mental health", "dad", "emotional"],
    content: (
      <div className="space-y-4">
        <p>Fear, anxiety, and not feeling ready are normal. They don't make you a bad father. They make you a human being facing something that actually matters.</p>

        <div>
          <SubHeading>What's Normal</SubHeading>
          <BulletList items={[
            "Feeling disconnected from the pregnancy — especially early on",
            "Anxiety about finances, your relationship, or your own father",
            "Worry about being enough",
            "Fear about something going wrong",
          ]} />
        </div>

        <div>
          <SubHeading>Paternal Postnatal Depression</SubHeading>
          <BulletList items={[
            "Affects around 1 in 10 new fathers — it's real and underdiagnosed",
            "Can show as persistent irritability, withdrawing, exhaustion beyond normal, or feeling detached from the baby",
            "Often starts 3–6 months after birth",
          ]} />
        </div>

        <div>
          <SubHeading>What Helps</SubHeading>
          <BulletList items={[
            "Talking to someone — a friend, GP, or therapist",
            "Peer support from other dads",
            "Not pretending everything is fine when it isn't",
            "Staying connected to the pregnancy, even when it feels abstract",
          ]} />
        </div>

        <p className="text-slate-600">If you're struggling: PANDAS Foundation, Postpartum Support International (PSI), and your GP are good starting points. You don't have to wait until it's serious.</p>
      </div>
    ),
  },
  {
    id: "postpartum",
    icon: Home,
    title: "Postpartum: The First Month",
    subtitle: "Recovery, sleep, visitors, and dad mental health",
    tags: ["postpartum", "newborn", "partner support"],
    readTime: "7 min read",
    content: (
      <div className="space-y-4">
        <p>The first week is raw. Nobody is sleeping. Everyone is adjusting. Your job is to protect the environment so recovery and feeding can happen.</p>

        <div>
          <SubHeading>Baby</SubHeading>
          <BulletList items={[
            "Feeds 8–12 times per day — every 2–3 hours, around the clock",
            "Produces meconium (dark green/black) for the first day or two, then yellow",
            "Sleeps in short bursts — not through the night",
            "Skin-to-skin with you is beneficial too, not just with her",
          ]} />
        </div>

        <div>
          <SubHeading>Your Main Jobs</SubHeading>
          <BulletList items={[
            "Protect her sleep — take the baby when you can",
            "Feed her — she needs proper meals, not just toast",
            "Manage visitors — they're for you, not her. Keep it short.",
            "Handle the logistics: nappies, washing, burping, settling",
            "Tell the people who matter how everyone is doing",
          ]} />
        </div>

        <div>
          <SubHeading>Baby Blues vs. Postnatal Depression</SubHeading>
          <BulletList items={[
            "Baby blues: weeping, emotional sensitivity in the first few days — normal, hormonal, passes",
            "PND: persistent low mood, anxiety, disconnection after 2+ weeks — needs professional support",
            "If you're worried: say something to your midwife or GP. Don't wait and see.",
          ]} />
        </div>

        <div>
          <SubHeading>First Month Map</SubHeading>
          <BulletList items={[
            "First 24 hours: protect quiet, food, hydration, and skin-to-skin time",
            "First week: take visitor management, laundry, dishes, and supply runs",
            "Sleep deprivation: plan shifts before everyone is exhausted",
            "Breastfeeding support: bring water, snacks, pillows, and encouragement without hovering",
            "Returning to work: decide what can be handed off before leave ends",
            "Relationship after baby: keep small moments of affection alive, even when tired",
          ]} />
        </div>

        <div>
          <SubHeading>Dad Mental Health After Birth</SubHeading>
          <BulletList items={[
            "Irritability, numbness, panic, or withdrawing can be signs you need support",
            "Check in with yourself weekly, not only with your partner",
            "Ask for help early. Support is part of being useful, not a failure",
          ]} />
        </div>

        <p className="text-slate-600 italic">It's okay if love doesn't hit you like a truck the moment baby arrives. For many dads it builds over days and weeks. That's normal.</p>
      </div>
    ),
  },
  {
    id: "glossary",
    icon: BookOpen,
    title: "Glossary",
    subtitle: "Words you'll hear at appointments",
    tags: ["glossary", "terms", "appointments"],
    content: (
      <div className="space-y-3">
        {[
          ["Antenatal / Prenatal", "Before birth — antenatal care is pregnancy care."],
          ["Braxton Hicks", "Practice contractions. Irregular, usually painless. Not the real thing."],
          ["Colostrum", "The first milk — thick, yellow, and extremely nutritious. Produced from late pregnancy."],
          ["Crowning", "When the baby's head becomes visible at the vaginal opening during pushing."],
          ["Dilation", "How open the cervix is. Measured 0–10 cm. 10 cm = time to push."],
          ["Effacement", "The cervix thinning. Often expressed as a percentage (100% = fully effaced)."],
          ["Episiotomy", "A surgical cut to widen the vaginal opening if needed during delivery."],
          ["GBS", "Group B Strep — a common bacteria screened for late in pregnancy. Usually not harmful to adults."],
          ["Lanugo", "Fine hair that covers the fetus. Mostly disappears before birth."],
          ["Meconium", "Baby's first poo — dark green or black. Normal."],
          ["Mucus plug", "Seals the cervix during pregnancy. Losing it can signal approaching labor."],
          ["NICU", "Neonatal intensive care unit — for premature or unwell babies."],
          ["Oxytocin", "Hormone that drives contractions and bonding. Sometimes given as a drip (Syntocinon/Pitocin)."],
          ["Postpartum / Postnatal", "After birth. Postpartum care is care after delivery."],
          ["Vernix", "Waxy white coating on newborn skin. Protective. Can be left to absorb."],
        ].map(([term, definition]) => (
          <div key={term} className="flex gap-3">
            <span className="text-[13px] font-semibold text-slate-800 leading-relaxed flex-shrink-0 w-36">{term}</span>
            <span className="text-[13px] text-slate-600 leading-relaxed">{definition}</span>
          </div>
        ))}
      </div>
    ),
  },
];

const FILTER_CHIPS = [
  { key: "labor",          label: "Labor", labelRo: "Travaliu" },
  { key: "partner support",label: "Partner support", labelRo: "Sprijin parteneră" },
  { key: "birth plan",     label: "Birth plan", labelRo: "Plan naștere" },
  { key: "mental health",  label: "Mental health", labelRo: "Sănătate mentală" },
  { key: "postpartum",     label: "Postpartum", labelRo: "Postpartum" },
  { key: "glossary",       label: "Glossary", labelRo: "Glosar" },
  { key: "emergency",      label: "Emergency", labelRo: "Urgențe" },
];

function normalizeSearch(value: string) {
  return value
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const SECTION_COPY_RO: Record<string, { title: string; subtitle: string }> = {
  labor: { title: "Semnele travaliului", subtitle: "Când mergeți, când mai așteptați" },
  "labor-support": { title: "Cum o susții în travaliu", subtitle: "Rolul tău în sală" },
  "what-not-to-say": { title: "Ce să nu spui", subtitle: "Cuvinte mai bune pentru momente grele" },
  "birth-plan": { title: "Bazele planului de naștere", subtitle: "Preferințe, nu contract" },
  "dad-mental-health": { title: "Sănătatea mentală a tatălui", subtitle: "Ce nu ți se spune destul" },
  postpartum: { title: "Postpartum: prima lună", subtitle: "Recuperare, somn, vizitatori și sănătatea tatălui" },
  glossary: { title: "Glosar", subtitle: "Cuvinte pe care le vei auzi la programări" },
};

const RO_ARTICLE_CONTENT: Record<string, ReactNode> = {
  labor: (
    <div className="space-y-4">
      <AlertBox>
        <strong>Regula 5-1-1:</strong> sunați când contracțiile apar la fiecare 5 minute, durează 1 minut și continuă timp de 1 oră. Dacă nu sunteți siguri, sunați oricum.
      </AlertBox>
      <div>
        <SubHeading>Contracții reale</SubHeading>
        <BulletList items={[
          "Apar regulat și devin mai apropiate în timp",
          "Durează de obicei 30-70 de secunde și devin mai intense",
          "Nu se opresc când merge, se odihnește sau schimbă poziția",
          "Pot începe în zona lombară și se mută spre față",
        ]} />
      </div>
      <div>
        <SubHeading>Braxton Hicks</SubHeading>
        <BulletList items={[
          "Sunt neregulate și fără un tipar clar",
          "Nu cresc constant în intensitate",
          "Se pot calma cu odihnă, hidratare sau schimbarea poziției",
        ]} />
      </div>
      <div>
        <SubHeading>Sunați imediat dacă</SubHeading>
        <BulletList items={[
          "Se rupe apa",
          "Apare sângerare roșu aprins",
          "Mișcările bebelușului scad semnificativ",
          "Are durere de cap severă, tulburări de vedere sau umflare bruscă",
        ]} />
      </div>
    </div>
  ),
  "labor-support": (
    <div className="space-y-4">
      <p>Rolul tău este să fii prezent, calm și atent. Nu trebuie să rezolvi totul; trebuie să o ajuți să se simtă auzită și susținută.</p>
      <div>
        <SubHeading>Ce ajută concret</SubHeading>
        <BulletList items={[
          "Întreabă cum vrea să fie susținută și revino periodic",
          "Oferă apă, balsam de buze, comprese reci sau căldură pe spate",
          "Ține evidența întrebărilor și notițelor importante",
          "Vorbește cu personalul medical doar când ea vrea asta",
        ]} />
      </div>
      <div>
        <SubHeading>Ce să eviți</SubHeading>
        <BulletList items={[
          "Nu minimaliza durerea sau frica",
          "Nu prelua conversația peste ea",
          "Nu transforma sprijinul într-o listă de ordine",
        ]} />
      </div>
    </div>
  ),
  "what-not-to-say": (
    <div className="space-y-4">
      <p>În momente grele, formularea contează. Scopul nu este să ai replica perfectă, ci să rămâi empatic și prezent.</p>
      <div>
        <SubHeading>Evită</SubHeading>
        <BulletList items={[
          "\"Exagerezi.\"",
          "\"Măcar...\"",
          "\"Cât mai durează?\"",
          "\"Relaxează-te.\"",
        ]} />
      </div>
      <div>
        <SubHeading>Spune mai bine</SubHeading>
        <BulletList items={[
          "\"Sunt aici. Spune-mi de ce ai nevoie.\"",
          "\"Sună foarte greu.\"",
          "\"Te descurci foarte bine. Sunt cu tine.\"",
          "\"Ce ar face ziua de azi mai ușoară?\"",
        ]} />
      </div>
    </div>
  ),
  "birth-plan": (
    <div className="space-y-4">
      <p>Planul de naștere este o listă de preferințe, nu un contract. Ajută echipa medicală să înțeleagă ce contează pentru voi.</p>
      <div>
        <SubHeading>Includeți</SubHeading>
        <BulletList items={[
          "Cine este prezent în sală",
          "Preferințe pentru durere și confort",
          "Cum vreți să fie comunicate deciziile",
          "Preferințe pentru contact piele pe piele și primele momente",
          "Limite pentru vizitatori după naștere",
        ]} />
      </div>
      <AlertBox>Rămâneți flexibili. Dacă situația medicală se schimbă, întrebați ce opțiuni există și ce este urgent.</AlertBox>
    </div>
  ),
  "dad-mental-health": (
    <div className="space-y-4">
      <p>Și tații pot trece prin anxietate, oboseală, presiune sau schimbări emoționale în sarcină și după naștere.</p>
      <div>
        <SubHeading>Semne de urmărit</SubHeading>
        <BulletList items={[
          "Iritabilitate constantă sau retragere",
          "Somn foarte prost chiar și când există ocazia",
          "Gânduri copleșitoare sau teamă persistentă",
          "Consumul de alcool sau muncă excesivă ca evitare",
        ]} />
      </div>
      <div>
        <SubHeading>Ce poți face</SubHeading>
        <BulletList items={[
          "Vorbește cu partenera sau cu cineva de încredere",
          "Cere ajutor medical dacă simptomele persistă",
          "Păstrează mici rutine: somn, mâncare, mișcare, pauze",
        ]} />
      </div>
    </div>
  ),
  postpartum: (
    <div className="space-y-4">
      <p>Prima lună este despre recuperare, somn fragmentat și adaptare. Sprijinul tău practic contează enorm.</p>
      <div>
        <SubHeading>Primele zile</SubHeading>
        <BulletList items={[
          "Ține evidența programărilor și a semnelor de alarmă",
          "Pregătește mâncare simplă și apă la îndemână",
          "Limitează vizitatorii dacă ea are nevoie de liniște",
          "Întreabă zilnic cum se simte fizic și emoțional",
        ]} />
      </div>
      <div>
        <SubHeading>Somn și ture</SubHeading>
        <BulletList items={[
          "Stabiliți ture realiste, nu perfecte",
          "Preia schimbatul, adusul apei sau liniștitul bebelușului",
          "Dormi când se poate; oboseala nu este o competiție",
        ]} />
      </div>
      <AlertBox>Dacă apare tristețe intensă, anxietate severă, gânduri de autovătămare sau îngrijorare că bebelușul nu este în siguranță, cereți ajutor medical imediat.</AlertBox>
    </div>
  ),
  glossary: (
    <div className="space-y-3">
      {[
        ["Contracții", "Strângeri ale uterului care pot indica travaliul sau pot fi contracții de pregătire."],
        ["Dilatație", "Cât de deschis este colul uterin, măsurat de obicei de la 0 la 10 cm."],
        ["Ștergerea colului", "Subțierea colului uterin înainte de naștere."],
        ["Dop gelatinos", "Secreție care a sigilat colul uterin; pierderea lui poate anunța apropierea travaliului."],
        ["Postpartum", "Perioada de după naștere, când corpul se recuperează și familia se adaptează."],
        ["NICU / ATI neonatală", "Secție specializată pentru bebeluși prematuri sau cu nevoi medicale."],
      ].map(([term, definition]) => (
        <div key={term} className="flex gap-3">
          <span className="text-[13px] font-semibold text-slate-800 leading-relaxed flex-shrink-0 w-32">{term}</span>
          <span className="text-[13px] text-slate-600 leading-relaxed">{definition}</span>
        </div>
      ))}
    </div>
  ),
};

function EmergencyCard() {
  const { language } = useApp();
  const ro = language === "ro";
  const items = ro ? [
    "Sângerare vaginală roșu aprins",
    "Durere de cap severă sau bruscă, mai ales cu modificări de vedere",
    "Umflarea rapidă a feței, mâinilor sau picioarelor",
    "Mișcările bebelușului au încetinit mult sau s-au oprit",
    "Se rupe apa înainte de 37 de săptămâni",
    "Durere în piept sau dificultăți de respirație",
    "Febră mare (38°C / 100.4°F sau peste)",
    "Durere abdominală severă care nu cedează",
  ] : [
    "Any bright red vaginal bleeding",
    "Severe or sudden headache, especially with vision changes",
    "Swelling of the face, hands, or feet coming on rapidly",
    "Baby's movements have significantly slowed or stopped",
    "Waters break before 37 weeks",
    "Chest pain or difficulty breathing",
    "High fever (38°C / 100.4°F or above)",
    "Severe abdominal pain that doesn't ease",
  ];
  return (
    <div className="bg-red-50 border border-red-200 rounded-[1.5rem] p-5 mb-3">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
          <Phone className="w-4 h-4 text-red-600" strokeWidth={2} />
        </div>
        <div>
          <h3 className="text-[15px] font-semibold text-red-900 leading-snug">{ro ? "Când să suni imediat" : "When to call immediately"}</h3>
          <p className="text-[12px] text-red-700">{ro ? "Nu aștepta - sună acum dacă apare oricare dintre acestea" : "Don't wait - call now if she has any of these"}</p>
        </div>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
            <span className="text-[13px] text-red-800 leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
      {/* The list is a prompt to call, never a rule for when not to. Someone reads
          this at 3am and decides whether to wake a midwife; if their symptom is
          not on it, the absence must not read as reassurance. */}
      <p className="text-[12px] text-red-800 leading-relaxed mt-3 pt-3 border-t border-red-200">
        {ro
          ? "Lista nu e completă. Orice altceva vă îngrijorează — sunați oricum."
          : "This list isn't exhaustive. Anything else that worries you — call anyway."}
      </p>
    </div>
  );
}

function AccordionSection({ section, isOpen, onToggle, isBookmarked, onBookmark }: {
  section: LearnSection;
  isOpen: boolean;
  onToggle: () => void;
  isBookmarked: boolean;
  onBookmark: () => void;
}) {
  const { language, t } = useApp();
  const ro = language === "ro";
  const Icon = section.icon;
  const copy = ro ? SECTION_COPY_RO[section.id] : null;
  const readTime = section.readTime
    ? ro ? section.readTime.replace("min read", "min citire") : section.readTime
    : `4 ${t("handbook.readTime")}`;
  return (
    <div className={`bg-white rounded-[1.5rem] border shadow-sm overflow-hidden ${
      section.variant === "alert" ? "border-orange-200" : "border-slate-200"
    }`}>
      <div className="flex items-center">
        <button
          onClick={onToggle}
          className="flex-1 flex items-center gap-3.5 px-5 py-4 text-left transition-colors duration-150 hover:bg-slate-50/60 active:bg-slate-50"
        >
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
            section.variant === "alert" ? "bg-orange-50" : "bg-slate-50"
          }`}>
            <Icon className={`w-5 h-5 ${section.variant === "alert" ? "text-orange-600" : "text-slate-600"}`} strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-semibold text-slate-900 leading-snug">{copy?.title ?? section.title}</div>
            <div className="text-[13px] text-slate-500 leading-snug">{copy?.subtitle ?? section.subtitle}</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">
              {readTime}
            </div>
          </div>
          {isOpen
            ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" strokeWidth={2} />
            : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" strokeWidth={2} />
          }
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); onBookmark(); }}
          aria-label={isBookmarked ? (ro ? "Elimină din salvate" : "Remove bookmark") : (ro ? "Salvează ghidul" : "Bookmark guide")}
          className="px-4 py-4 text-slate-300 hover:text-amber-500 transition-colors"
        >
          <Star
            className="w-4 h-4"
            strokeWidth={2}
            fill={isBookmarked ? "currentColor" : "none"}
            color={isBookmarked ? "#f59e0b" : undefined}
          />
        </button>
      </div>

      {isOpen && (
        <div className="px-5 pb-5 border-t border-slate-100">
          <div className="pt-4 text-[14px] text-slate-700 leading-relaxed space-y-4">
            {ro && RO_ARTICLE_CONTENT[section.id] ? RO_ARTICLE_CONTENT[section.id] : section.content}
          </div>
          <p className="text-[11px] text-slate-400 mt-5 pt-4 border-t border-slate-100">
            {t("handbook.educational")}
          </p>
        </div>
      )}
    </div>
  );
}

export function LearnTab({ onOpenFeature }: LearnTabProps) {
  const { bookmarkedGuides, toggleBookmark, t, language } = useApp();
  const ro = language === "ro";
  const [openId, setOpenId] = useState<string | null>("labor");
  const [search, setSearch] = useState("");
  const [activeChip, setActiveChip] = useState<string | null>(null);
  const [showBookmarks, setShowBookmarks] = useState(false);

  const q = normalizeSearch(search.trim());

  const filteredSections = SECTIONS.filter(s => {
    if (showBookmarks && !bookmarkedGuides.has(s.id)) return false;
    if (activeChip && !s.tags.includes(activeChip)) return false;
    if (q) {
      const roCopy = SECTION_COPY_RO[s.id];
      const localizedTags = s.tags.map(tag => FILTER_CHIPS.find(chip => chip.key === tag)?.labelRo ?? tag);
      const haystack = ro
        ? [roCopy?.title, roCopy?.subtitle, ...localizedTags]
        : [s.title, s.subtitle, ...s.tags];
      return haystack.some(value => value && normalizeSearch(value).includes(q)) || (
        s.title.toLowerCase().includes(q) ||
        s.subtitle.toLowerCase().includes(q) ||
        s.tags.some(tag => tag.includes(q))
      );
    }
    return true;
  });

  return (
    <div>
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-slate-200 px-5 py-5 sticky top-0 z-10">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.08em] mb-0.5">
              {t("nav.handbook")}
            </div>
            <div className="text-[1.5rem] font-semibold text-slate-900 leading-none tracking-tight">
              {t("handbook.title")}
            </div>
          </div>
          <button
            onClick={() => { setShowBookmarks(v => !v); setActiveChip(null); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all ${
              showBookmarks
                ? "bg-amber-100 text-amber-800"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            <Star className="w-3.5 h-3.5" strokeWidth={2} fill={showBookmarks ? "currentColor" : "none"} />
            {t("handbook.savedGuides")}
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={2} />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setActiveChip(null); setShowBookmarks(false); }}
            placeholder={t("handbook.search")}
            className="w-full bg-slate-100 rounded-xl pl-10 pr-4 py-2.5 text-[14px] text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-1.5 pb-0.5">
          {FILTER_CHIPS.map(chip => (
            <button
              key={chip.key}
              onClick={() => {
                setActiveChip(activeChip === chip.key ? null : chip.key);
                setSearch("");
                setShowBookmarks(false);
              }}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-200 ${
                activeChip === chip.key
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {ro ? chip.labelRo : chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="px-5 pt-5 pb-6 space-y-3">
        {!activeChip && !showBookmarks && !q && (
          <div className="space-y-2.5 mb-3">
            <FeatureTile title={ro ? "Copilot programări" : "Appointment Copilot"} subtitle={ro ? "Pregătește întrebări și salvează notițe" : "Prepare questions and save notes"} icon={Calendar} onClick={() => onOpenFeature("appointment")} />
            <FeatureTile title={ro ? "Geanta de spital" : "Hospital Bag"} subtitle={ro ? "Verifică ce trebuie împachetat" : "Check what to pack"} icon={Briefcase} onClick={() => onOpenFeature("hospital-bag")} />
          </div>
        )}

        {/* Emergency card - always pinned unless filtering to a specific non-emergency topic */}
        {(!activeChip || activeChip === "emergency") && !showBookmarks && !q && <EmergencyCard />}

        {showBookmarks && bookmarkedGuides.size === 0 && (
          <div className="text-center py-12">
            <Star className="w-8 h-8 text-slate-200 mx-auto mb-3" strokeWidth={1.5} />
            <p className="text-[14px] text-slate-400">{t("handbook.savedEmpty")}</p>
          </div>
        )}

        {filteredSections.map(section => (
          <AccordionSection
            key={section.id}
            section={section}
            isOpen={openId === section.id}
            onToggle={() => setOpenId(openId === section.id ? null : section.id)}
            isBookmarked={bookmarkedGuides.has(section.id)}
            onBookmark={() => toggleBookmark(section.id)}
          />
        ))}

        {filteredSections.length === 0 && (q || activeChip) && (
          <div className="text-center py-12">
            <p className="text-[14px] text-slate-400">{ro ? "Niciun ghid nu se potrivește căutării." : "No guides match your search."}</p>
          </div>
        )}
      </div>
    </div>
  );
}
