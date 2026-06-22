import AgentAvatar from '@/components/flow/AgentAvatar';

export default function Landing({
  onStart,
  onExample,
}: {
  onStart: () => void;
  onExample: () => void;
}) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_10%,rgba(79,70,229,0.14),transparent_34%),linear-gradient(180deg,#f8fafc,#eef2ff_60%,#f8fafc)] text-slate-950">
      <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
        <section className="overflow-hidden rounded-[2.25rem] border border-slate-200 bg-white shadow-2xl shadow-slate-200/70">
          <div className="grid gap-8 p-7 md:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:p-12">
            <div className="flex flex-col justify-center">
              <div className="mb-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-bold text-white">
                  AI Business Agent
                </span>
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                  Mock Demo
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                  不接真实数据
                </span>
              </div>

              <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
                AI业务反方陪练
                <span className="block text-indigo-600">Agent</span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-9 text-slate-600">
                在重要表达前，先让一个“反方智能体”替你模拟质疑。
                它会追问漏洞、引用原文诊断，并生成下一轮行动清单。
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={onStart}
                  className="rounded-2xl bg-indigo-600 px-6 py-4 text-base font-black text-white shadow-xl shadow-indigo-200 transition hover:bg-indigo-700"
                >
                  开始一次反方推演
                </button>
                <button
                  onClick={onExample}
                  className="rounded-2xl border border-slate-300 bg-white px-6 py-4 text-base font-black text-slate-900 transition hover:bg-slate-50"
                >
                  直接查看示例
                </button>
              </div>

              <div className="mt-8 grid gap-3 md:grid-cols-3">
                {[
                  ['反方追问', '模拟对方真实质疑'],
                  ['引用诊断', '引用原文指出漏洞'],
                  ['行动卡', '生成下一轮清单'],
                ].map(([title, desc]) => (
                  <div key={title} className="rounded-3xl bg-slate-50 p-4">
                    <div className="font-black text-slate-950">{title}</div>
                    <div className="mt-1 text-sm text-slate-500">{desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-[440px] rounded-[2rem] bg-slate-950 p-6 text-white">
              <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_22%_18%,rgba(79,70,229,0.45),transparent_28%),radial-gradient(circle_at_80%_70%,rgba(14,165,233,0.22),transparent_30%)]" />
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-200">
                      Opponent Agent
                    </div>
                    <div className="mt-2 text-2xl font-black">
                      反方智能体已待命
                    </div>
                  </div>
                  <AgentAvatar size="lg" />
                </div>

                <div className="space-y-4">
                  <div className="w-[88%] rounded-3xl bg-white p-5 text-slate-950">
                    <div className="text-xs font-black text-indigo-600">追问 1｜最小决策</div>
                    <p className="mt-2 text-lg font-black leading-8">
                      你希望我现在做出的最小决策是什么？
                    </p>
                  </div>
                  <div className="ml-auto w-[82%] rounded-3xl border border-white/15 bg-white/10 p-5">
                    <div className="text-xs font-black text-slate-300">引用诊断</div>
                    <p className="mt-2 text-base leading-7 text-white">
                      你的目标已明确，但证据支撑和风险边界需要优先补强。
                    </p>
                  </div>
                  <div className="w-[78%] rounded-3xl bg-indigo-500 p-5">
                    <div className="text-xs font-black text-indigo-100">下一步行动</div>
                    <p className="mt-2 text-base font-black leading-7">
                      补齐样本、指标和30天复盘节点。
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl bg-white/10 p-4 text-sm leading-6 text-slate-300">
                  当前版本为规则与模板驱动，用于 MVP 场景验证。
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
