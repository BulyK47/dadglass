import { useState } from "react";
import { type DadObjectAssetId, type DadObjectType } from "../data/dadObjects";

interface DadObjectProps {
  type: DadObjectType;
  assetId?: DadObjectAssetId;
  imageFile?: string;
  week?: number;
  className?: string;
  variant?: number;
  label?: string;
}

function DadObjectFallback({ className, label = "" }: Pick<DadObjectProps, "className" | "label">) {
  return (
    <div className={`${className ?? ""} dad-object-figure relative select-none`} aria-label={label}>
      <div className="relative h-full w-full">
        <svg viewBox="0 0 100 120" className="h-full w-full" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={label}>
          <ellipse cx="50" cy="105" rx="30" ry="5" fill="#0f172a" opacity="0.08" />
          <rect x="24" y="28" width="52" height="58" rx="12" fill="#f8fafc" stroke="#0f172a" strokeWidth="3" />
          <rect x="34" y="40" width="32" height="9" rx="4.5" fill="#fbbf24" stroke="#0f172a" strokeWidth="2" />
          <rect x="34" y="58" width="32" height="6" rx="3" fill="#cbd5e1" />
          <rect x="34" y="70" width="24" height="6" rx="3" fill="#cbd5e1" />
        </svg>
      </div>
    </div>
  );
}

export function DadObjectAsset({ imageFile, week, className, label = "" }: DadObjectProps) {
  const [failed, setFailed] = useState(false);
  const src = imageFile ?? (week ? `/assets/dad-objects/w${week}.webp` : "");

  if (!src || failed) {
    return <DadObjectFallback className={className} label={label} />;
  }

  return (
    <div className={`${className ?? ""} dad-object-figure relative select-none`} aria-label={label}>
      <div className="relative h-full w-full">
        <img
          src={src}
          alt={label}
          className="h-full w-full object-contain"
          draggable={false}
          onError={() => setFailed(true)}
        />
      </div>
    </div>
  );
}

export function DadObjectSVG(props: DadObjectProps) {
  return <DadObjectAsset {...props} />;
}
