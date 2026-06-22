import { useEffect, useState } from 'react';
import AgentAvatar from '@/components/AgentAvatar';
import type { Report } from '@/types/agent';

export default function OpponentChat({ report }: { report: Report | null }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [replayKey, setReplayKey] = useState(0);

  useEffect(() => {
    if (!report) {
      setVisibleCount(0);
      return;
    }

    setVisibleCount(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    report.counterQuestions.forEach((_, index) => {
      timers.push(
        setTimeout(() => {
          setVisibleCount(index + 1);
        }, 420 + index * 520),
      );
    });

    return () => timers.forEach(clearTimeout);
  }, [report, replayKey]);

  const isRunning = Boolean(report && visibleCount < report.counterQuestions.length);

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white shadow-sm lg:h-[calc(100vh-148px)] lg:overflow-y-auto">
      <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/90 p-5 backdrop-blur">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <AgentAvatar size="lg" />
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-600">
                Opponent Agent
              </div>
              <h2 className="mt-1 text-xl font-black text-slate-950">
                反方智能体对话场
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                模拟对方视角下的质疑，把潜在反对意见提前暴露出来。
              </p>
            </div>
          </div>

          {report ? (
            <button
              onClick={() => setReplayKey((prev) => prev + 1)}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-50"
            >
              重新播放
            </button>
          ) : null}
        </div>
      </div>

      {!report ? (
        <div className="flex min-h-[520px] items-center justify-center p-8">
          <div className="max-w-sm text-center">
            <div className="flex justify-center">
              <AgentAvatar size="lg" />
            </div>
            <h3 className="mt-5 text-xl font-black text-slate-950">
              等待运行反方推演
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              在左侧选择测试包，点击“运行反方推演”。这里会逐条生成带角色视角的追问气泡。
            </p>
          </div>
        </div>
      ) : (
        <div className="p-5">
          <div className="rounded-[28px] bg-slate-950 p-5 text-white">
            <div className="flex items-start gap-4">
              <AgentAvatar size="md" />
              <div>
                <div className="text-sm font-black text-slate-300">
                  反方智能体 · {report.roleProfile.label}
                </div>
                <h3 className="mt-2 text-2xl font-black">
                  我已读取你的核心表达目标。
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {report.roleProfile.lens}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {report.roleProfile.cares.map((item) => (
                    <span key={item} className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-3xl bg-indigo-50 p-4">
            <div className="text-xs font-black text-indigo-700">核心表达目标</div>
            <p className="mt-2 text-sm font-bold leading-7 text-slate-900">{report.coreClaim}</p>
          </div>

          <div className="mt-5 flex items-center justify-between rounded-2xl bg-slate-50 p-3 text-xs text-slate-500">
            <span>
              Agent 状态：
              <span className="font-bold text-indigo-700">
                {isRunning ? ' 正在逐条追问...' : ' 推演完成'}
              </span>
            </span>
            <span>{visibleCount}/{report.counterQuestions.length}</span>
          </div>

          <div className="mt-5 space-y-4">
            {report.counterQuestions.slice(0, visibleCount).map((item, index) => (
              <div
                key={item.question}
                className="flex gap-3 animate-[fadeInUp_0.38s_ease-out]"
              >
                <AgentAvatar size="sm" />
                <div className="flex-1 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-black text-indigo-700">
                      追问 {index + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-500">{item.angle}</span>
                  </div>
                  <p className="mt-3 text-base leading-7 text-slate-950">{item.question}</p>
                  <p className="mt-3 rounded-2xl bg-slate-50 p-3 text-xs leading-5 text-slate-500">
                    {item.intent}
                  </p>
                </div>
              </div>
            ))}

            {isRunning ? (
              <div className="flex gap-3">
                <AgentAvatar size="sm" />
                <div className="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.2s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.1s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500" />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </section>
  );
}
