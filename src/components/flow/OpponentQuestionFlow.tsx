import { useEffect, useState } from 'react';
import AgentAvatar from '@/components/flow/AgentAvatar';
import type { Report } from '@/types/agent';

const QUESTION_INTERVAL = 650;

export default function OpponentQuestionFlow({
  report,
  onNext,
  onBack,
}: {
  report: Report;
  onNext: () => void;
  onBack: () => void;
}) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [replayKey, setReplayKey] = useState(0);

  useEffect(() => {
    setVisibleCount(0);
    const timers: ReturnType<typeof setTimeout>[] = [];

    report.counterQuestions.forEach((_, index) => {
      timers.push(
        setTimeout(() => {
          setVisibleCount(index + 1);
        }, 360 + index * QUESTION_INTERVAL),
      );
    });

    return () => timers.forEach(clearTimeout);
  }, [report, replayKey]);

  const finished = visibleCount >= report.counterQuestions.length;
  const visibleQuestions = report.counterQuestions.slice(0, visibleCount);

  return (
    <section className="mx-auto max-w-5xl px-5 py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-sm font-black uppercase tracking-[0.25em] text-indigo-600">
            Step 03
          </div>
          <h2 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
            反方正在逐条追问
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-500">
            系统会自动展开完整追问。你可以跳过等待，直接进入引用诊断。
          </p>
        </div>

        <button
          onClick={() => setReplayKey((prev) => prev + 1)}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"
        >
          重新播放
        </button>
      </div>

      <div className="rounded-[2rem] bg-slate-950 p-5 text-white">
        <div className="flex items-start gap-4">
          <AgentAvatar size="lg" />
          <div>
            <div className="text-sm font-black text-slate-300">
              反方智能体 · {report.roleProfile.label}
            </div>
            <p className="mt-2 text-xl font-black leading-8">
              我会从 {report.roleProfile.cares.join('、')} 等角度追问你。
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between rounded-3xl bg-white p-4 shadow-sm">
        <div className="text-sm font-bold text-slate-500">
          推演进度：
          <span className="font-black text-indigo-700">{visibleCount}/{report.counterQuestions.length}</span>
        </div>
        <div className="h-2 w-48 rounded-full bg-slate-100">
          <div
            className="h-2 rounded-full bg-indigo-600 transition-all"
            style={{ width: `${(visibleCount / report.counterQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {visibleQuestions.map((item, index) => (
          <div key={item.question} className="flex gap-4 animate-[fadeInUp_0.35s_ease-out]">
            <AgentAvatar size="sm" />
            <div className="flex-1 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-100">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-black text-indigo-700">
                  追问 {index + 1}
                </span>
                <span className="text-sm font-black text-slate-500">{item.angle}</span>
              </div>
              <p className="mt-4 text-2xl font-black leading-10 text-slate-950">
                {item.question}
              </p>
              <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-500">
                {item.intent}
              </p>
            </div>
          </div>
        ))}

        {!finished ? (
          <div className="flex gap-4">
            <AgentAvatar size="sm" />
            <div className="rounded-[1.75rem] border border-slate-200 bg-white px-6 py-5 shadow-lg shadow-slate-100">
              <div className="flex gap-1.5">
                <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.2s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.1s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500" />
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <button
          onClick={onBack}
          className="rounded-2xl border border-slate-300 bg-white px-6 py-4 font-black text-slate-800 transition hover:bg-slate-50"
        >
          返回角色卡
        </button>

        <button
          onClick={onNext}
          className="rounded-2xl bg-indigo-600 px-6 py-4 font-black text-white shadow-xl shadow-indigo-200 transition hover:bg-indigo-700 md:col-span-2"
        >
          {finished ? '查看引用诊断 →' : '跳过等待，查看诊断 →'}
        </button>
      </div>
    </section>
  );
}
