import { AlertCircle } from "lucide-react";
import { useApp } from "../context/AppContext";
import { localizeWeekList, localizeWeekText } from "../utils/localizedWeekContent";

interface EmergencyCardProps {
  symptoms: string[];
  advice: string;
}

export function EmergencyCard({ symptoms, advice }: EmergencyCardProps) {
  const { language } = useApp();
  const ro = language === "ro";
  const localizedSymptoms = localizeWeekList(symptoms, language);
  const localizedAdvice = localizeWeekText(advice, language);

  return (
    <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-[1.5rem] p-6 mx-5 mb-5 border border-red-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
          <AlertCircle className="w-5 h-5 text-red-600" strokeWidth={2} />
        </div>
        <h2 className="text-[17px] font-semibold text-red-900 tracking-tight">
          {ro ? "Când să suni medicul" : "When to Call the Doctor"}
        </h2>
      </div>

      <div className="space-y-3 mb-4">
        <p className="text-[13px] font-medium text-red-800 uppercase tracking-wide">
          {ro ? "Cere sfat medical urgent dacă are:" : "Call for urgent medical advice if she has:"}
        </p>
        <ul className="space-y-2">
          {localizedSymptoms.map((symptom, index) => (
            <li key={index} className="flex items-start gap-3 text-[14px] text-red-900">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span className="leading-relaxed">{symptom}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-[13px] text-red-800 leading-relaxed bg-white/50 rounded-lg p-3">
        {localizedAdvice}
      </p>
    </div>
  );
}
