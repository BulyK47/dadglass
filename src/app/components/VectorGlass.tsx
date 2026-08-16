import { useState, type ComponentType } from "react";
import {
  ShotGlass,
  CordialGlass,
  RocksGlass,
  NickAndNoraGlass,
  WineGlass,
  GobletGlass,
  HighballGlass,
  CollinsGlass,
  HurricaneGlass,
  PintGlass
} from './glasses';
import { assetUrl } from "../utils/assetUrl";

interface VectorGlassProps {
  glassType: string;
  fillPercent: number;
  week?: number;
}

function getBaseGlassType(glassType: string) {
  const value = glassType.toLowerCase();
  if (value.includes("shot")) return "Shot Glass";
  if (value.includes("cordial")) return "Cordial Glass";
  if (value.includes("rocks")) return "Rocks Glass";
  if (value.includes("nick")) return "Nick & Nora Glass";
  if (value.includes("wine")) return "Wine Glass";
  if (value.includes("goblet")) return "Goblet";
  if (value.includes("highball")) return "Highball Glass";
  if (value.includes("collins")) return "Collins Glass";
  if (value.includes("hurricane")) return "Hurricane Glass";
  if (value.includes("pint") || value.includes("mug")) return "Pint Glass";
  return glassType;
}

export function VectorGlass({ glassType, fillPercent }: VectorGlassProps) {
  const glassComponents: Record<string, ComponentType<{ fillPercent: number; className?: string }>> = {
    "Shot Glass": ShotGlass,
    "Cordial Glass": CordialGlass,
    "Rocks Glass": RocksGlass,
    "Nick & Nora Glass": NickAndNoraGlass,
    "Wine Glass": WineGlass,
    "Goblet": GobletGlass,
    "Highball Glass": HighballGlass,
    "Collins Glass": CollinsGlass,
    "Hurricane Glass": HurricaneGlass,
    "Pint Glass": PintGlass,
  };

  const GlassComponent = glassComponents[getBaseGlassType(glassType)] || WineGlass;

  return (
    <div className="w-full h-full flex items-center justify-center" style={{ maxHeight: "280px", maxWidth: "200px" }}>
      <GlassComponent fillPercent={fillPercent} className="w-full h-full" />
    </div>
  );
}

export function GlassAsset({ glassType, fillPercent, week }: VectorGlassProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const imageSrc = week ? assetUrl(`assets/glasses/w${week}.webp`) : "";

  if (week && !imageFailed) {
    return (
      <div className="w-full h-full flex items-center justify-center" style={{ maxHeight: "280px", maxWidth: "220px" }}>
        <img
          src={imageSrc}
          alt={glassType}
          className="h-full w-full object-contain"
          draggable={false}
          onError={() => setImageFailed(true)}
        />
      </div>
    );
  }

  return <VectorGlass glassType={glassType} fillPercent={fillPercent} />;
}
