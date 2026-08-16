import { Home, Calendar, CheckSquare, BookOpen, User } from "lucide-react";
import { useApp } from "../context/AppContext";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { t } = useApp();

  const NAV_ITEMS = [
    { id: "home",    icon: Home,        label: t("nav.home") },
    { id: "week",    icon: Calendar,    label: t("nav.journey") },
    { id: "todo",    icon: CheckSquare, label: t("nav.checklist") },
    { id: "learn",   icon: BookOpen,    label: t("nav.handbook") },
    { id: "profile", icon: User,        label: t("nav.profile") },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 bg-white/95 backdrop-blur-sm border-t border-slate-200 px-2 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-around h-16">
        {NAV_ITEMS.map((item) => {
          const active = item.id === activeTab;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 ${
                active
                  ? "text-slate-900"
                  : "text-slate-400 hover:text-slate-600 active:scale-95"
              }`}
            >
              <item.icon className="w-[22px] h-[22px]" strokeWidth={active ? 2.5 : 2} />
              <span className={`text-[10px] tracking-wide ${active ? "font-semibold" : "font-medium"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
