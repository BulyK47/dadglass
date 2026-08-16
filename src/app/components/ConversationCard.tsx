import { MessageCircle } from "lucide-react";
import { useApp } from "../context/AppContext";

interface ConversationCardProps {
  sayThis: string;
  notThat: string;
}

export function ConversationCard({ sayThis, notThat }: ConversationCardProps) {
  const { t } = useApp();
  return (
    <div className="bg-white rounded-[1.5rem] p-6 mx-5 mb-5 shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
          <MessageCircle className="w-5 h-5 text-emerald-600" strokeWidth={2} />
        </div>
        <h2 className="text-[17px] font-semibold text-slate-900 tracking-tight">
          {t("home.sayThisNotThat")}
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[12px] font-semibold text-emerald-700 uppercase tracking-wide">
              {t("home.sayThis")}
            </span>
          </div>
          <p className="text-[15px] text-slate-700 leading-relaxed pl-3.5 italic">
            "{sayThis}"
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            <span className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide">
              {t("home.maybeDontSay")}
            </span>
          </div>
          <p className="text-[15px] text-slate-500 leading-relaxed pl-3.5 italic line-through decoration-slate-300">
            "{notThat}"
          </p>
        </div>
      </div>
    </div>
  );
}
