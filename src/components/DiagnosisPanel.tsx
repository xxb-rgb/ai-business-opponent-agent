import { toPng } from 'html-to-image';
import { useRef, useState } from 'react';
import ActionCard from '@/components/ActionCard';
import RadarChart from '@/components/RadarChart';
import { getScoreLevel } from '@/lib/agentRules';
import type { Report } from '@/types/agent';

export default function DiagnosisPanel({ report }: { report: Report | null }) {
  const [cardReady, setCardReady] = useState(false);
  const [exporting, setExporting] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  async function exportActionCard() {
    if (!cardRef.current || !report) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#ffffff',
      });
      const link = document.createElement('a');
      link.download = 'ai-agent-next-action-card.png';
      link.href = dataUrl;
      link.click();
    } finally {
      setExporting(false);
    }
  }

  if (!report) {
    return (
      <aside className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm lg:h-[calc(100vh-148px)]">
        <div className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-600">Result</div>
        <h2 className="mt-1 text-xl font-black text-slate-950">诊断与行动区</h2>
        <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm leading-7 text-slate-500">
          推演完成后，这里会显示引用诊断、优先补强项和行动卡。
        </div>
      </aside>
    );
  }

  return (
    <aside className="rounded-[28px] border border-slate-200 bg-white shadow-sm lg:h-[calc(100vh-148px)] lg:overflow-y-auto">
      <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/90 p-5 backdrop-blur">
        <div className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-600">Diagnosis</div>
        <h2 className="mt-1 text-xl font-black text-slate-950">诊断与行动</h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">引用原文判断短板，再生成下一轮行动卡。</p>
      </div>

      <div className="space-y-5 p-5">
        <div className="rounded-3xl bg-slate-950 p-5 text-white">
          <div className="text-xs font-black text-slate-400">综合判断</div>
          <p className="mt-2 text-lg font-black leading-7">
            可以进入轻量试点沟通，但需优先补强：{report.weakPoints.join('、')}。
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-300">{report.roleInsight}</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-sm font-black text-slate-700">能力雷达</div>
          <div className="mt-2 h-56">
            <RadarChart scores={report.scores} />
          </div>
        </div>

        <div className="space-y-3">
          {report.scores.map((item) => (
            <details key={item.label} className="rounded-3xl border border-slate-200 bg-white p-4 open:bg-indigo-50/35">
              <summary className="cursor-pointer list-none">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-black text-slate-950">{item.label}</div>
                    <div className="mt-1 text-xs text-slate-500">{getScoreLevel(item.score)}</div>
                  </div>
                  <div className="text-2xl font-black text-indigo-600">{item.score}</div>
                </div>
                <div className="mt-3 h-1.5 rounded-full bg-slate-100">
                  <div className="h-1.5 rounded-full bg-indigo-600" style={{ width: `${item.score}%` }} />
                </div>
              </summary>
              <div className="mt-4 rounded-2xl bg-white p-3 text-xs leading-5 text-slate-600">
                <span className="font-black text-indigo-700">引用原文：</span>“{item.quote}”
              </div>
              <p className="mt-3 text-xs leading-6 text-slate-600">
                <span className="font-black text-slate-950">判断：</span>{item.diagnosis}
              </p>
              <p className="mt-2 text-xs leading-6 text-slate-600">
                <span className="font-black text-slate-950">下一步：</span>{item.nextAction}
              </p>
            </details>
          ))}
        </div>

        <div className="rounded-3xl bg-indigo-50 p-5">
          <div className="text-sm font-black text-indigo-700">建议下一轮开场</div>
          <p className="mt-3 text-base font-black leading-7 text-slate-950">{report.recommendedOpening}</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-black text-slate-950">行动卡</div>
              <p className="mt-1 text-xs text-slate-500">把结果变成可带走的下一轮行动清单。</p>
            </div>
            <button
              onClick={() => setCardReady(true)}
              className="rounded-2xl bg-indigo-600 px-4 py-2 text-xs font-black text-white hover:bg-indigo-700"
            >
              生成
            </button>
          </div>

          {cardReady ? (
            <div className="overflow-hidden rounded-2xl bg-slate-50 p-3">
              <div className="origin-top-left scale-[0.31]">
                <ActionCard report={report} cardRef={cardRef} />
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-xs text-slate-500">
              点击“生成”后预览行动卡。
            </div>
          )}

          <button
            onClick={exportActionCard}
            disabled={!cardReady || exporting}
            className="mt-3 w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {exporting ? '正在导出...' : '导出行动卡图片'}
          </button>
        </div>
      </div>
    </aside>
  );
}
