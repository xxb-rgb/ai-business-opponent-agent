'use client';

import { useMemo, useState } from 'react';
import DiagnosisPanel from '@/components/DiagnosisPanel';
import OpponentChat from '@/components/OpponentChat';
import ScenarioPanel from '@/components/ScenarioPanel';
import { initialForm, pointOptions, testPacks } from '@/data/templates';
import { buildReport } from '@/lib/agentRules';
import type { FormState, Report } from '@/types/agent';

function getPointTextByIds(ids: string[]) {
  return ids
    .map((id) => pointOptions.find((item) => item.id === id)?.text)
    .filter(Boolean)
    .join('');
}

function buildFormFromPack(packIndex: number): FormState {
  const pack = testPacks[packIndex];
  const selectedText =
    'argument' in pack.form && typeof pack.form.argument === 'string'
      ? pack.form.argument
      : getPointTextByIds(pack.form.selectedPoints);

  return {
    scenario: pack.form.scenario,
    audience: pack.form.audience,
    goal: pack.form.goal,
    context: pack.form.context,
    selectedPoints: pack.form.selectedPoints,
    currentArgument: selectedText,
    tone: '专业、克制、有业务判断、有落地感',
  };
}

export default function AgentWorkspace() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [report, setReport] = useState<Report | null>(null);
  const [selectedPackIndex, setSelectedPackIndex] = useState(-1);

  const canRun = useMemo(() => {
    return form.goal.trim().length >= 4 || form.currentArgument.trim().length >= 10;
  }, [form.goal, form.currentArgument]);

  function updateForm<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function useTestPack(packIndex: number) {
    const nextForm = buildFormFromPack(packIndex);
    setSelectedPackIndex(packIndex);
    setForm(nextForm);
    setReport(null);
  }

  function togglePoint(id: string) {
    const next = form.selectedPoints.includes(id)
      ? form.selectedPoints.filter((item) => item !== id)
      : [...form.selectedPoints, id];

    setForm((prev) => ({
      ...prev,
      selectedPoints: next,
      currentArgument: getPointTextByIds(next),
    }));
  }

  function runAgent() {
    if (canRun) {
      setReport(buildReport(form));
      return;
    }

    const fallbackForm = buildFormFromPack(0);
    setSelectedPackIndex(0);
    setForm(fallbackForm);
    setReport(buildReport(fallbackForm));
  }

  function runExampleNow() {
    const nextForm =
      selectedPackIndex >= 0 ? buildFormFromPack(selectedPackIndex) : buildFormFromPack(0);

    if (selectedPackIndex < 0) {
      setSelectedPackIndex(0);
      setForm(nextForm);
    }

    setReport(buildReport(nextForm));
    setTimeout(() => {
      document.getElementById('agent-workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  }

  function reset() {
    setSelectedPackIndex(-1);
    setForm(initialForm);
    setReport(null);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-[1600px] px-4 py-5 md:px-6">
        <header className="mb-5 rounded-[28px] border border-slate-800 bg-slate-950 p-5 text-white shadow-xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">
                  AI Agent Workspace
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">
                  Mock Agent
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">
                  不接真实数据
                </span>
              </div>
              <h1 className="text-3xl font-black tracking-tight md:text-4xl">
                AI业务反方陪练 Agent
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
                模拟反方追问 · 引用原文诊断 · 生成下一轮行动卡。
                当前版本用于验证最小业务闭环，不替代专业判断。
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={runExampleNow}
                className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white hover:bg-indigo-700"
              >
                使用示例并运行
              </button>
              <button
                onClick={runAgent}
                className="rounded-2xl border border-white/20 px-5 py-3 text-sm font-black text-white hover:bg-white/10"
              >
                运行当前输入
              </button>
            </div>
          </div>
        </header>

        <section id="agent-workspace" className="grid gap-5 lg:grid-cols-[310px_1fr_390px]">
          <ScenarioPanel
            form={form}
            selectedPackIndex={selectedPackIndex}
            onUsePack={useTestPack}
            onTogglePoint={togglePoint}
            onUpdate={updateForm}
            onRun={runAgent}
            onReset={reset}
            canRun={canRun}
          />
          <OpponentChat report={report} />
          <DiagnosisPanel report={report} />
        </section>
      </div>
    </main>
  );
}
