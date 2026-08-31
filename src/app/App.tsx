import { useEffect, useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { OnboardingFlow } from "./components/OnboardingFlow";
import { DisclaimerModal } from "./components/DisclaimerModal";
import { MobileHeader } from "./components/MobileHeader";
import { BottomNav } from "./components/BottomNav";
import { HomeTab } from "./components/HomeTab";
import { WeekTab } from "./components/WeekTab";
import { TodoTab } from "./components/TodoTab";
import { LearnTab } from "./components/LearnTab";
import { ProfileTab } from "./components/ProfileTab";
import { DadJournal } from "./components/DadJournal";
import { FeatureScreen, type FeatureKey } from "./components/FeatureScreens";
import { InstallBanner, InstallGuide } from "./components/InstallGuide";
import { HowItWorks } from "./components/HowItWorks";
import { usePersistedState } from "./hooks/usePersisted";
import { hasAskedForReview, requestInAppReview, REVIEW_JOURNAL_THRESHOLD, REVIEW_TODO_THRESHOLD } from "./utils/review";

function AppInner() {
  const {
    hasCompletedOnboarding, hasSeenDisclaimer, activeTab, setActiveTab, currentWeek, setCurrentWeek,
    completedTodos, journalEntries,
  } = useApp();
  const [showJournal, setShowJournal] = useState(false);
  const [showInstall, setShowInstall] = useState(false);
  const [feature, setFeature] = useState<FeatureKey | null>(null);

  // The walkthrough shows itself once after onboarding, and can be reopened
  // from Profile afterwards; `dg_howto_seen` is what makes it once.
  const [howToSeen, setHowToSeen] = usePersistedState<boolean>("dg_howto_seen", false);
  const [howToReopened, setHowToReopened] = useState(false);
  const howToOpen = hasCompletedOnboarding && (howToReopened || !howToSeen);
  const closeHowTo = () => { setHowToSeen(true); setHowToReopened(false); };

  /*
   * Ask Play for a review once the app has actually been useful — ten checklist
   * items ticked, or three journal entries written. Play's guidelines forbid
   * asking the user anything first, so there is no "Enjoying DadGlass?" prompt:
   * the request fires on its own and Play decides whether to show anything.
   * See utils/review.ts.
   */
  useEffect(() => {
    if (hasAskedForReview()) return;
    if (!hasCompletedOnboarding || !hasSeenDisclaimer || howToOpen) return;
    const earned =
      completedTodos.size >= REVIEW_TODO_THRESHOLD ||
      journalEntries.length >= REVIEW_JOURNAL_THRESHOLD;
    if (earned) void requestInAppReview();
  }, [completedTodos.size, journalEntries.length, hasCompletedOnboarding, hasSeenDisclaimer, howToOpen]);

  return (
    <div className="min-h-[100dvh] bg-slate-200/70 flex justify-center">
      <div className="relative min-h-[100dvh] w-full max-w-md bg-[#fafaf9] shadow-[0_0_0_1px_rgba(15,23,42,0.06),0_24px_80px_rgba(15,23,42,0.16)]">
        {!hasCompletedOnboarding ? (
          <OnboardingFlow />
        ) : (
          <>
            {!hasSeenDisclaimer && <DisclaimerModal />}
            {howToOpen && <HowItWorks onClose={closeHowTo} />}
            {showJournal && <DadJournal onClose={() => setShowJournal(false)} />}
            {showInstall && <InstallGuide onClose={() => setShowInstall(false)} />}
            {feature && <FeatureScreen feature={feature} onClose={() => setFeature(null)} />}

            {activeTab === "home" && (
              <MobileHeader week={currentWeek} onWeekChange={setCurrentWeek} />
            )}

            <main className="pb-nav">
              {activeTab === "home" && (
                <div className="pt-4">
                  <InstallBanner onOpen={() => setShowInstall(true)} />
                </div>
              )}
              {activeTab === "home"    && <HomeTab week={currentWeek} onOpenJournal={() => setShowJournal(true)} onOpenFeature={setFeature} />}
              {activeTab === "week"    && <WeekTab />}
              {activeTab === "todo"    && <TodoTab onOpenFeature={setFeature} />}
              {activeTab === "learn"   && <LearnTab onOpenFeature={setFeature} />}
              {activeTab === "profile" && <ProfileTab onOpenJournal={() => setShowJournal(true)} onOpenFeature={setFeature} onOpenInstall={() => setShowInstall(true)} onOpenHowItWorks={() => setHowToReopened(true)} />}
            </main>

            <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
          </>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
