import { pointOptions, scenarioHints, scenarioOptions, testPacks } from '@/data/templates';
import type { FormState, Scenario } from '@/types/agent';

type Props = {
  form: FormState;
  selectedPackIndex: number;
  onUsePack: (index: number) => void;
  onTogglePoint: (id: string) => void;
  onUpdate: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  onRun: () => void;
  onReset: () => void;
  canRun: boolean;
};

export default function ScenarioPanel({
  form,
  selectedPackIndex,
  onUsePack,
  onTogglePoint,
  onUpdate,
  onRun,
  onReset,
  canRun,
}: Props) {
  return (
    <aside className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm lg:h-[calc(100vh-148px)] lg:overflow-y-auto">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-600">
            Configure
          </div>
          <h2 className="mt-1 text-lg font-black text-slate-950">场景构造</h2>
        </div>
        <button
          onClick={onReset}
          className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-50"
        >
          清空
        </button>
      </div>

      <div className="rounded-2xl bg-slate-50 p-3 text-xs leading-5 text-slate-500">
        小样本模式：使用模拟/脱敏材料，不接真实业务数据。
      </div>

      <div className="mt-4">
        <div className="mb-2 text-sm font-black text-slate-800">快速测试包</div>
        <div className="grid grid-cols-2 gap-2">
          {testPacks.map((pack, index) => (
            <button
              key={pack.title}
              onClick={() => onUsePack(index)}
              className={`rounded-2xl border p-3 text-left transition ${
                selectedPackIndex === index
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="text-sm font-black text-slate-950">{pack.title}</div>
              <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-slate-500">
                {pack.subtitle}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 text-sm font-black text-slate-800">场景</div>
        <div className="flex flex-wrap gap-2">
          {scenarioOptions.map((option) => (
            <button
              key={option}
              onClick={() => onUpdate('scenario', option as Scenario)}
              className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                form.scenario === option
                  ? 'border-indigo-600 bg-indigo-600 text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs leading-5 text-slate-500">{scenarioHints[form.scenario]}</p>
      </div>

      <div className="mt-4 space-y-3">
        <label className="block">
          <span className="text-sm font-black text-slate-800">反方角色</span>
          <input
            value={form.audience}
            onChange={(event) => onUpdate('audience', event.target.value)}
            placeholder="例如：业务负责人"
            className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </label>

        <label className="block">
          <span className="text-sm font-black text-slate-800">希望对方接受什么？</span>
          <textarea
            value={form.goal}
            onChange={(event) => onUpdate('goal', event.target.value)}
            rows={3}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </label>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-black text-slate-800">观点组件</span>
          <span className="text-xs text-slate-400">已选 {form.selectedPoints.length}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {pointOptions.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => onTogglePoint(item.id)}
              title={item.text}
              className={`rounded-full border px-3 py-2 text-xs font-bold transition ${
                form.selectedPoints.includes(item.id)
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {form.selectedPoints.includes(item.id) ? '✓ ' : ''}
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <details className="mt-4 rounded-2xl border border-slate-200 bg-white p-3" open>
        <summary className="cursor-pointer text-sm font-black text-slate-800">
          编辑完整文本
        </summary>
        <div className="mt-3 space-y-3">
          <label className="block">
            <span className="text-xs font-bold text-slate-500">当前表达稿</span>
            <textarea
              value={form.currentArgument}
              onChange={(event) => onUpdate('currentArgument', event.target.value)}
              rows={7}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold text-slate-500">背景信息</span>
            <textarea
              value={form.context}
              onChange={(event) => onUpdate('context', event.target.value)}
              rows={4}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>
        </div>
      </details>

      <button
        onClick={onRun}
        disabled={!canRun}
        className="mt-4 w-full rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
      >
        运行反方推演
      </button>
    </aside>
  );
}
