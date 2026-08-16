import { useApp } from "../context/AppContext";

export function DisclaimerModal() {
  const { t, markDisclaimerSeen } = useApp();

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm px-4 pb-8">
      <div className="bg-white rounded-3xl p-7 w-full max-w-sm shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-5">
          <svg className="w-6 h-6 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <h2 className="text-[20px] font-semibold text-slate-900 tracking-tight mb-3">
          {t("disclaimer.title")}
        </h2>
        <p className="text-[14px] text-slate-600 leading-relaxed mb-7">
          {t("disclaimer.body")}
        </p>
        <button
          onClick={markDisclaimerSeen}
          className="w-full bg-slate-900 text-white rounded-2xl py-4 text-[16px] font-semibold active:scale-[0.98] transition-transform"
        >
          {t("disclaimer.cta")}
        </button>
      </div>
    </div>
  );
}
