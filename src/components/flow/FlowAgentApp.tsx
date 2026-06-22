'use client';

import { useMemo, useState } from 'react';
import ActionCardResult from '@/components/flow/ActionCardResult';
import DiagnosisReport from '@/components/flow/DiagnosisReport';
import Landing from '@/components/flow/Landing';
import OpponentQuestionFlow from '@/components/flow/OpponentQuestionFlow';
import ProgressHeader from '@/components/flow/ProgressHeader';
import RolePreview from '@/components/flow/RolePreview';
import ScenarioSelect from '@/components/flow/ScenarioSelect';
import { getPointTextByIds, initialForm, testPacks } from '@/data/templates';
import { buildReport } from '@/lib/agentRules';
import type { FormState, Report } from '@/types/agent';

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

export default function FlowAgentApp() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [report, setReport] = useState<Report | null>(null);
  const [selectedPackIndex, setSelectedPackIndex] = useState(-1);

  const canGenerate = useMemo(() => {
    return form.goal.trim().length >= 4 || form.currentArgument.trim().length >= 10;
  }, [form.goal, form.currentArgument]);

  function scrollTop() {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function goToStep(nextStep: number) {
    setStep(nextStep);
    scrollTop();
  }

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

  function ensureReport(nextForm = form) {
    const nextReport = buildReport(nextForm);
    setReport(nextReport);
    return nextReport;
  }

  function startFlow() {
    goToStep(1);
  }

  function viewExample() {
    const nextForm = buildFormFromPack(0);
    setSelectedPackIndex(0);
    setForm(nextForm);
    const nextReport = ensureReport(nextForm);
    setReport(nextReport);
    goToStep(2);
  }

  function goRolePreview() {
    if (!canGenerate) {
      viewExample();
      return;
    }
    ensureReport();
    goToStep(2);
  }

  function canVisitStep(targetStep: number) {
    if (targetStep === 1) return true;
    return Boolean(report);
  }

  if (step === 0) {
    return <Landing onStart={startFlow} onExample={viewExample} />;
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <ProgressHeader
        currentStep={step}
        onStepClick={goToStep}
        canVisitStep={canVisitStep}
      />

      {step === 1 && (
        <ScenarioSelect
          form={form}
          selectedPackIndex={selectedPackIndex}
          onUsePack={useTestPack}
          onTogglePoint={togglePoint}
          onUpdate={updateForm}
          onNext={goRolePreview}
        />
      )}

      {step === 2 && report && (
        <RolePreview
          report={report}
          onBack={() => goToStep(1)}
          onNext={() => goToStep(3)}
        />
      )}

      {step === 3 && report && (
        <OpponentQuestionFlow
          report={report}
          onBack={() => goToStep(2)}
          onNext={() => goToStep(4)}
        />
      )}

      {step === 4 && report && (
        <DiagnosisReport
          report={report}
          onBack={() => goToStep(3)}
          onNext={() => goToStep(5)}
        />
      )}

      {step === 5 && report && (
        <ActionCardResult
          report={report}
          onBack={() => goToStep(4)}
          onRestart={() => goToStep(1)}
        />
      )}
    </main>
  );
}
