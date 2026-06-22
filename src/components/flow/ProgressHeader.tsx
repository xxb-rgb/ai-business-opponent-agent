const steps = [
  '选择场景',
  '生成角色',
  '接受追问',
  '引用诊断',
  '行动卡',
];

export default function ProgressHeader({
  currentStep,
  onStepClick,
  canVisitStep,
}: {
  currentStep: number;
  onStepClick: (step: number) => void;
  canVisitStep: (step: number) => boolean;
}) {
  return (
    <div className="sticky top-0 z-40 border-b border-slate-200/80 bg-slate-50/85 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-5 py-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {steps.map((step, index) => {
            const stepIndex = index + 1;
            const active = currentStep === stepIndex;
            const enabled = canVisitStep(stepIndex);
            return (
              <button
                key={step}
                onClick={() => enabled && onStepClick(stepIndex)}
                disabled={!enabled}
                className={`flex min-w-[128px] items-center gap-2 rounded-2xl px-3 py-2 text-left transition ${
                  active
                    ? 'bg-slate-950 text-white shadow-lg shadow-slate-200'
                    : enabled
                      ? 'bg-white text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'
                      : 'bg-white/60 text-slate-300'
                }`}
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black ${
                    active ? 'bg-white text-slate-950' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {stepIndex}
                </span>
                <span className="text-sm font-black">{step}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
