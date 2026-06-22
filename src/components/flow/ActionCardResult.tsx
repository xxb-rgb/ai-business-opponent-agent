import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import ActionCard from '@/components/flow/ActionCard';
import type { Report } from '@/types/agent';

export default function ActionCardResult({
  report,
  onBack,
  onRestart,
}: {
  report: Report;
  onBack: () => void;
  onRestart: () => void;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [exporting, setExporting] = useState(false);
  const [copied, setCopied] = useState(false);

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

  async function copyOpening() {
    await navigator.clipboard.writeText(report.recommendedOpening);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-8">
      <div className="mb-8">
        <div className="text-sm font-black uppercase tracking-[0.25em] text-indigo-600">
          Step 05
        </div>
        <h2 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
          下一轮行动卡已生成
        </h2>
        <p className="mt-3 text-base leading-7 text-slate-500">
          这一步只保留一个核心成果物。你可以导出行动卡，也可以复制开场话术继续迭代。
        </p>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.22em] text-indigo-600">
              Final Output
            </div>
            <h3 className="mt-1 text-2xl font-black text-slate-950">{report.actionCardTitle}</h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {report.weakPoints.map((item) => (
              <span key={item} className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-black text-indigo-700">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="overflow-auto rounded-[2rem] bg-slate-100 p-4 md:p-6">
          <div className="mx-auto w-fit origin-top scale-[0.74] md:scale-[0.82]">
            <ActionCard report={report} cardRef={cardRef} />
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <button
            onClick={exportActionCard}
            disabled={exporting}
            className="rounded-2xl bg-slate-950 px-6 py-4 font-black text-white transition hover:bg-slate-800 disabled:bg-slate-300 md:col-span-2"
          >
            {exporting ? '正在导出图片...' : '导出行动卡图片'}
          </button>
          <button
            onClick={copyOpening}
            className="rounded-2xl border border-slate-300 bg-white px-6 py-4 font-black text-slate-800 transition hover:bg-slate-50"
          >
            {copied ? '已复制开场' : '复制开场话术'}
          </button>
          <button
            onClick={onRestart}
            className="rounded-2xl border border-slate-300 bg-white px-6 py-4 font-black text-slate-800 transition hover:bg-slate-50"
          >
            重新推演
          </button>
        </div>

        <button
          onClick={onBack}
          className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4 font-black text-slate-600 transition hover:bg-slate-100"
        >
          返回诊断
        </button>
      </div>
    </section>
  );
}
