import { useState } from "react";
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

function AppInner() {
  const { hasCompletedOnboarding, hasSeenDisclaimer, activeTab, setActiveTab, currentWeek, setCurrentWeek } = useApp();
  const [showJournal, setShowJournal] = useState(false);
  const [showInstall, setShowInstall] = useState(false);
  const [feature, setFeature] = useState<FeatureKey | null>(null);

  return (
    <div className="min-h-[100dvh] bg-slate-200/70 flex justify-center">
      <div className="relative min-h-[100dvh] w-full max-w-md bg-[#fafaf9] shadow-[0_0_0_1px_rgba(15,23,42,0.06),0_24px_80px_rgba(15,23,42,0.16)]">
        {!hasCompletedOnboarding ? (
          <OnboardingFlow />
        ) : (
          <>
            {!hasSeenDisclaimer && <DisclaimerModal />}
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
              {activeTab === "profile" && <ProfileTab onOpenJournal={() => setShowJournal(true)} onOpenFeature={setFeature} onOpenInstall={() => setShowInstall(true)} />}
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
