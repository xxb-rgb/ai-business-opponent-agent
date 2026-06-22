import AgentAvatar from '@/components/flow/AgentAvatar';
import type { Report } from '@/types/agent';

export default function RolePreview({
  report,
  onNext,
  onBack,
}: {
  report: Report;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-8">
      <div className="mb-8">
        <div className="text-sm font-black uppercase tracking-[0.25em] text-indigo-600">
          Step 02
        </div>
        <h2 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
          反方角色已生成
        </h2>
        <p className="mt-3 text-base leading-7 text-slate-500">
          先建立对方的决策视角，再进入追问。这样后续问题会更像真实沟通，而不是普通问题列表。
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2.2rem] bg-slate-950 p-8 text-white shadow-2xl shadow-slate-200">
          <div className="flex items-start gap-5">
            <AgentAvatar size="xl" />
            <div>
              <div className="text-sm font-black uppercase tracking-[0.24em] text-indigo-200">
                Opponent Profile
              </div>
              <h3 className="mt-3 text-3xl font-black">{report.roleProfile.label}</h3>
              <p className="mt-4 text-base leading-8 text-slate-300">
                {report.roleProfile.lens}
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-3xl bg-white/10 p-5">
            <div className="text-sm font-black text-slate-300">追问风格</div>
            <div className="mt-2 text-xl font-black">{report.roleProfile.style}</div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-black text-indigo-600">关注点</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {report.roleProfile.cares.map((item) => (
                <span key={item} className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-black text-indigo-700">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-black text-indigo-600">决策逻辑</div>
            <p className="mt-4 text-lg font-black leading-8 text-slate-950">
              {report.roleProfile.decisionLogic}
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:col-span-2">
            <div className="text-sm font-black text-indigo-600">证据要求</div>
            <p className="mt-4 text-lg font-black leading-8 text-slate-950">
              {report.roleProfile.evidenceHint}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <button
          onClick={onBack}
          className="rounded-2xl border border-slate-300 bg-white px-6 py-4 font-black text-slate-800 transition hover:bg-slate-50"
        >
          返回修改输入
        </button>
        <button
          onClick={onNext}
          className="rounded-2xl bg-indigo-600 px-6 py-4 font-black text-white shadow-xl shadow-indigo-200 transition hover:bg-indigo-700"
        >
          开始接受反方追问 →
        </button>
      </div>
    </section>
  );
}
