import RadarChart from '@/components/flow/RadarChart';
import { getScoreLevel } from '@/lib/agentRules';
import type { Report, ScoreItem } from '@/types/agent';

function PriorityCard({ item, index }: { item: ScoreItem; index: number }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-black text-indigo-600">优先补强 {index + 1}</div>
          <h3 className="mt-2 text-2xl font-black text-slate-950">{item.label}</h3>
        </div>
        <div className="text-5xl font-black text-indigo-600">{item.score}</div>
      </div>

      <div className="mt-5 rounded-2xl bg-indigo-50 p-4 text-sm leading-7 text-slate-700">
        <span className="font-black text-indigo-700">引用原文：</span>
        “{item.quote}”
      </div>

      <p className="mt-4 text-base leading-8 text-slate-700">
        <span className="font-black text-slate-950">判断：</span>
        {item.diagnosis}
      </p>
      <p className="mt-2 text-base leading-8 text-slate-700">
        <span className="font-black text-slate-950">下一步：</span>
        {item.nextAction}
      </p>
    </div>
  );
}

export default function DiagnosisReport({
  report,
  onNext,
  onBack,
}: {
  report: Report;
  onNext: () => void;
  onBack: () => void;
}) {
  const priorityItems = [...report.scores]
    .sort((a, b) => a.score - b.score)
    .slice(0, 2);
  const otherItems = report.scores.filter((item) => !priorityItems.includes(item));

  return (
    <section className="mx-auto max-w-6xl px-5 py-8">
      <div className="mb-8">
        <div className="text-sm font-black uppercase tracking-[0.25em] text-indigo-600">
          Step 04
        </div>
        <h2 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
          引用原文做诊断
        </h2>
        <p className="mt-3 text-base leading-7 text-slate-500">
          不平均用力，先找到最容易被质疑的两个短板。
        </p>
      </div>

      <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl shadow-slate-200">
        <div className="text-sm font-black text-indigo-200">总体判断</div>
        <p className="mt-3 text-3xl font-black leading-[1.35]">
          可以进入下一轮沟通，但需要优先补强：{report.weakPoints.join('、')}。
        </p>
        <p className="mt-4 text-base leading-8 text-slate-300">{report.roleInsight}</p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-black text-slate-950">能力雷达</h3>
          <div className="mt-4 h-80">
            <RadarChart scores={report.scores} />
          </div>
        </div>

        <div className="space-y-4">
          {priorityItems.map((item, index) => (
            <PriorityCard key={item.label} item={item} index={index} />
          ))}
        </div>
      </div>

      <details className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
        <summary className="cursor-pointer text-lg font-black text-slate-950">
          查看其他诊断维度
        </summary>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {otherItems.map((item) => (
            <div key={item.label} className="rounded-2xl bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-black text-slate-950">{item.label}</div>
                  <div className="mt-1 text-xs text-slate-500">{getScoreLevel(item.score)}</div>
                </div>
                <div className="text-2xl font-black text-indigo-600">{item.score}</div>
              </div>
              <p className="mt-3 text-xs leading-6 text-slate-500">{item.nextAction}</p>
            </div>
          ))}
        </div>
      </details>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <button
          onClick={onBack}
          className="rounded-2xl border border-slate-300 bg-white px-6 py-4 font-black text-slate-800 transition hover:bg-slate-50"
        >
          返回反方追问
        </button>
        <button
          onClick={onNext}
          className="rounded-2xl bg-indigo-600 px-6 py-4 font-black text-white shadow-xl shadow-indigo-200 transition hover:bg-indigo-700"
        >
          生成下一轮行动卡 →
        </button>
      </div>
    </section>
  );
}
