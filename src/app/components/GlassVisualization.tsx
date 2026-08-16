import { GlassAsset } from "./VectorGlass";

interface GlassVisualizationProps {
  glassType: string;
  week: number;
}

export function GlassVisualization({ glassType, week }: GlassVisualizationProps) {
  const fillLevel = Math.min(100, Math.max(5, Math.round(((week - 4) / 36) * 100)));

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-full max-w-[220px]">
        <div className="h-[280px] flex items-center justify-center">
          <GlassAsset glassType={glassType} fillPercent={fillLevel} week={week} />
        </div>

        <div className="mt-4 space-y-1">
          <div className="flex justify-between text-[12px] text-slate-600 font-medium">
            <span>Week {week}</span>
            <span>{fillLevel}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-slate-600 to-slate-800 h-full rounded-full transition-all duration-500"
              style={{ width: `${fillLevel}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
