import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface ContentCardProps {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
  variant?: "default" | "sage" | "warm";
}

export function ContentCard({ icon: Icon, title, children, variant = "default" }: ContentCardProps) {
  const variants = {
    default: {
      bg: "bg-white",
      border: "border-slate-200",
      iconColor: "text-slate-600"
    },
    sage: {
      bg: "bg-gradient-to-br from-emerald-50/80 to-emerald-50/40",
      border: "border-emerald-100/60",
      iconColor: "text-emerald-700"
    },
    warm: {
      bg: "bg-gradient-to-br from-amber-50/70 to-amber-50/30",
      border: "border-amber-100/50",
      iconColor: "text-amber-700"
    }
  };
  
  const style = variants[variant];
  
  return (
    <div className={`${style.bg} border ${style.border} rounded-[1.5rem] p-6 mx-5 mb-4 shadow-sm`}>
      <div className="flex items-center gap-2.5 mb-5">
        <Icon className={`w-5 h-5 ${style.iconColor}`} strokeWidth={2.2} />
        <h3 className="text-[17px] font-semibold text-slate-900 tracking-tight">{title}</h3>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}
