import type { RefObject } from 'react';
import type { Report } from '@/types/agent';

export default function ActionCard({
  report,
  cardRef,
}: {
  report: Report;
  cardRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={cardRef}
      className="w-[1040px] rounded-[44px] bg-white p-12 text-slate-950 shadow-2xl"
    >
      <div className="flex items-start justify-between gap-8">
        <div>
          <div className="tracking-[0.35em] text-sm font-black uppercase text-indigo-600">
            NEXT ACTION CARD
          </div>
          <h3 className="mt-5 text-5xl font-black tracking-tight">
            {report.actionCardTitle}
          </h3>
          <p className="mt-6 max-w-[760px] text-2xl leading-[1.6] text-slate-600">
            {report.coreClaim}
          </p>
        </div>
        <div className="whitespace-nowrap rounded-3xl bg-slate-950 px-7 py-5 text-center text-xl font-black leading-tight text-white">
          {report.scenario}
        </div>
      </div>

      <div className="my-10 h-px bg-slate-200" />

      <div className="rounded-3xl bg-indigo-50 p-8">
        <div className="text-lg font-black text-indigo-700">建议开场</div>
        <p className="mt-4 text-2xl font-black leading-[1.6] text-slate-950">
          {report.recommendedOpening}
        </p>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-8">
        <div>
          <h4 className="text-2xl font-black">接下来要做的 3 件事</h4>
          <div className="mt-6 space-y-4">
            {report.practiceTasks.map((item, index) => (
              <div key={item.title} className="flex gap-4 rounded-3xl bg-slate-100 p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xl font-black text-white">
                  {index + 1}
                </div>
                <p className="text-xl leading-[1.6] text-slate-700">
                  <span className="font-black text-slate-950">{item.title}：</span>
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-2xl font-black">需要准备的证据</h4>
          <div className="mt-6 space-y-4">
            {report.evidenceList.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-white p-5 text-xl leading-[1.6] text-slate-700"
              >
                <span className="font-black text-slate-950">{item.title}：</span>
                {item.detail}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 rounded-3xl bg-slate-950 p-8 text-white">
        <div className="text-lg font-black text-slate-300">
          下一轮追问 Prompt
        </div>
        <p className="mt-4 text-2xl leading-[1.7]">
          {report.promptPack[0]}
        </p>
      </div>

      <div className="mt-10 text-base text-slate-400">
        由 AI 业务智能体样板生成 · 当前版本基于规则与模板，用于 MVP 场景验证
      </div>
    </div>
  );
}
