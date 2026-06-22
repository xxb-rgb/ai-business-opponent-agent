import { pointOptions, scenarioHints, scenarioOptions, testPacks } from '@/data/templates';
import type { FormState, Scenario } from '@/types/agent';

export default function ScenarioSelect({
  form,
  selectedPackIndex,
  onUsePack,
  onTogglePoint,
  onUpdate,
  onNext,
}: {
  form: FormState;
  selectedPackIndex: number;
  onUsePack: (index: number) => void;
  onTogglePoint: (id: string) => void;
  onUpdate: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  onNext: () => void;
}) {
  const selectedPack = selectedPackIndex >= 0 ? testPacks[selectedPackIndex] : null;
  const selectedPoints = pointOptions.filter((item) => form.selectedPoints.includes(item.id));

  return (
    <section className="mx-auto max-w-6xl px-5 py-8">
      <div className="mb-8">
        <div className="text-sm font-black uppercase tracking-[0.25em] text-indigo-600">
          Step 01
        </div>
        <h2 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
          选择本轮推演样本
        </h2>
        <p className="mt-3 text-base leading-7 text-slate-500">
          这里不是流程步骤，而是“测试包库”。选择一个样本后，系统会自动生成角色、目标和表达稿。
        </p>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.24em] text-indigo-600">
              Sample Pack Library
            </div>
            <h3 className="mt-1 text-2xl font-black text-slate-950">测试包库</h3>
          </div>
          <p className="text-sm leading-6 text-slate-500">
            选择一个业务样本，作为本轮反方推演的输入起点。
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          {testPacks.map((pack, index) => {
            const active = selectedPackIndex === index;
            return (
              <button
                key={pack.title}
                onClick={() => onUsePack(index)}
                className={`group relative overflow-hidden rounded-3xl border p-4 text-left transition ${
                  active
                    ? 'border-indigo-500 bg-indigo-50 shadow-lg shadow-indigo-100'
                    : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-black ${
                      active ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div
                    className={`rounded-full px-3 py-1 text-[11px] font-black ${
                      active ? 'bg-white text-indigo-700' : 'bg-slate-950 text-white'
                    }`}
                  >
                    {pack.badge}
                  </div>
                </div>

                <div className="mt-8 text-xl font-black text-slate-950">{pack.title}</div>
                <p className="mt-2 min-h-[44px] text-sm leading-6 text-slate-500">{pack.subtitle}</p>

                <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3">
                  <span className="text-xs font-bold text-slate-400">
                    {active ? '当前已选择' : '点击使用样本'}
                  </span>
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-black ${
                      active ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {active ? '✓' : '→'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
                Selected Brief
              </div>
              <h3 className="mt-2 text-2xl font-black text-slate-950">
                {selectedPack ? selectedPack.title : '尚未选择测试包'}
              </h3>
            </div>
            {selectedPack ? (
              <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-white">
                {selectedPack.badge}
              </span>
            ) : null}
          </div>

          {selectedPack ? (
            <div className="mt-6 space-y-4">
              <div className="rounded-3xl bg-slate-50 p-4">
                <div className="text-xs font-black text-slate-400">反方角色</div>
                <div className="mt-1 text-lg font-black text-slate-950">{form.audience}</div>
              </div>
              <div className="rounded-3xl bg-indigo-50 p-4">
                <div className="text-xs font-black text-indigo-700">推演目标</div>
                <div className="mt-2 text-base font-black leading-7 text-slate-950">{form.goal}</div>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <div className="text-xs font-black text-slate-400">业务背景</div>
                <div className="mt-2 text-sm leading-7 text-slate-600">{form.context}</div>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
              请选择上方任一测试包，系统会自动生成本轮推演的角色、目标和表达稿。
            </div>
          )}

          <details className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
            <summary className="cursor-pointer font-black text-slate-800">
              高级编辑：角色与目标
            </summary>
            <div className="mt-4 space-y-4">
              <div>
                <div className="mb-2 text-sm font-black text-slate-700">场景类型</div>
                <div className="flex flex-wrap gap-2">
                  {scenarioOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => onUpdate('scenario', option as Scenario)}
                      className={`rounded-full border px-3 py-2 text-sm font-bold transition ${
                        form.scenario === option
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-500">{scenarioHints[form.scenario]}</p>
              </div>

              <label className="block">
                <span className="text-sm font-black text-slate-700">反方角色</span>
                <input
                  value={form.audience}
                  onChange={(event) => onUpdate('audience', event.target.value)}
                  placeholder="例如：业务负责人"
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </label>

              <label className="block">
                <span className="text-sm font-black text-slate-700">希望对方接受什么？</span>
                <textarea
                  value={form.goal}
                  onChange={(event) => onUpdate('goal', event.target.value)}
                  rows={4}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </label>
            </div>
          </details>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
            Argument Builder
          </div>
          <h3 className="mt-2 text-2xl font-black text-slate-950">本轮观点组件</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            左侧测试包会带出默认组件。你可以增删组件，系统会同步更新完整表达稿。
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {pointOptions.map((item) => (
              <button
                key={item.id}
                onClick={() => onTogglePoint(item.id)}
                className={`rounded-2xl border p-4 text-left transition ${
                  form.selectedPoints.includes(item.id)
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs font-black ${
                      form.selectedPoints.includes(item.id)
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-slate-300 text-transparent'
                    }`}
                  >
                    ✓
                  </div>
                  <div>
                    <div className="font-black text-slate-950">{item.label}</div>
                    <div className="mt-1 text-xs font-bold text-slate-400">{item.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-3xl bg-slate-950 p-5 text-white">
            <div className="text-xs font-black text-slate-400">已选择组件</div>
            {selectedPoints.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedPoints.map((item) => (
                  <span key={item.id} className="rounded-full bg-white/10 px-3 py-1 text-xs font-black">
                    {item.label}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-300">尚未选择观点组件。</p>
            )}
          </div>

          <details className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <summary className="cursor-pointer font-black text-slate-800">
              高级编辑：查看完整表达稿
            </summary>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="text-sm font-bold text-slate-600">当前表达稿</span>
                <textarea
                  value={form.currentArgument}
                  onChange={(event) => onUpdate('currentArgument', event.target.value)}
                  rows={7}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-slate-600">背景信息</span>
                <textarea
                  value={form.context}
                  onChange={(event) => onUpdate('context', event.target.value)}
                  rows={4}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </label>
            </div>
          </details>
        </div>
      </div>

      <button
        onClick={onNext}
        className="mt-6 w-full rounded-2xl bg-slate-950 px-6 py-4 text-lg font-black text-white shadow-xl shadow-slate-200 transition hover:bg-slate-800"
      >
        生成反方角色 →
      </button>
    </section>
  );
}
