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
      className="w-[920px] rounded-[40px] bg-white p-10 text-slate-950 shadow-2xl"
    >
      <div className="flex items-start justify-between gap-8">
        <div>
          <div className="tracking-[0.32em] text-xs font-black uppercase text-indigo-600">
            NEXT ACTION CARD
          </div>
          <h3 className="mt-4 text-4xl font-black tracking-tight">
            {report.actionCardTitle}
          </h3>
          <p className="mt-4 max-w-[660px] text-lg leading-[1.65] text-slate-600">
            {report.coreClaim}
          </p>
        </div>
        <div className="whitespace-nowrap rounded-2xl bg-slate-950 px-5 py-3 text-center text-base font-black leading-tight text-white">
          {report.scenario}
        </div>
      </div>

      <div className="my-8 h-px bg-slate-200" />

      <div className="rounded-3xl bg-indigo-50 p-6">
        <div className="text-sm font-black text-indigo-700">下一轮开场</div>
        <p className="mt-3 text-xl font-black leading-[1.6] text-slate-950">
          {report.recommendedOpening}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4">
        {report.practiceTasks.map((item, index) => (
          <div key={item.title} className="rounded-3xl bg-slate-100 p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-black text-white">
              {index + 1}
            </div>
            <div className="mt-4 text-lg font-black text-slate-950">{item.title}</div>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-3xl bg-slate-950 p-6 text-white">
        <div className="text-sm font-black text-slate-300">优先准备的证据</div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {report.evidenceList.slice(0, 3).map((item) => (
            <div key={item.title} className="rounded-2xl bg-white/10 p-4">
              <div className="text-sm font-black text-white">{item.title}</div>
              <p className="mt-2 text-xs leading-5 text-slate-300">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 text-sm text-slate-400">
        由 AI 业务智能体样板生成 · 当前版本用于 MVP 场景验证
      </div>
    </div>
  );
}
