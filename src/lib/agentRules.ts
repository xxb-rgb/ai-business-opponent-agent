import { buildRoleProfile, questionBank } from '@/data/templates';
import type { ActionItem, FormState, Report, RoleProfile, ScoreItem } from '@/types/agent';

function hasEvidence(text: string) {
  return /\d|%|用户|数据|案例|结果|增长|降低|提升|成本|收入|满意度|复购|反馈|指标|样本|完成率|采纳率|转化/.test(text);
}

function hasRisk(text: string) {
  return /风险|失败|预案|如果|但是|不过|限制|边界|问题|担心|不确定|不承诺|不替代|样本/.test(text);
}

function hasAction(text: string) {
  return /计划|步骤|执行|落地|推进|安排|时间|分工|行动|下一步|验证|试点|MVP|样板|30天|90天|复盘/.test(text);
}

function shortText(text: string, max = 30) {
  const value = text.trim().replace(/\s+/g, ' ');
  return value.length > max ? `${value.slice(0, max)}...` : value;
}

function pickQuote(text: string, fallback: string) {
  const source = text.trim();
  if (!source) return fallback;
  const sentences = source
    .split(/[。！？\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
  if (sentences.length === 0) return fallback;
  const best = sentences.sort((a, b) => b.length - a.length)[0];
  return best.length > 46 ? `${best.slice(0, 46)}...` : best;
}

export function getScoreLevel(score: number) {
  if (score >= 85) return '强';
  if (score >= 70) return '可用';
  if (score >= 55) return '待补强';
  return '薄弱';
}

function buildScores(form: FormState): ScoreItem[] {
  const combined = `${form.goal} ${form.currentArgument} ${form.context}`;
  const goalQuote = pickQuote(form.goal, '当前表达目标还不够明确');
  const evidenceQuote = hasEvidence(combined)
    ? pickQuote(form.currentArgument, '已出现指标、样本或反馈意识')
    : '暂无明显数据、样本或案例支撑';
  const riskQuote = hasRisk(combined)
    ? pickQuote(form.currentArgument, '已出现风险或边界意识')
    : '暂无明确风险边界表述';
  const audienceQuote = form.audience.trim()
    ? `说服对象：${form.audience.trim()}`
    : '尚未明确说服对象';
  const actionQuote = hasAction(combined)
    ? pickQuote(form.currentArgument, '已出现试点、复盘或行动意识')
    : '暂无明确下一步行动';

  return [
    {
      label: '观点清晰度',
      score: form.goal.trim().length >= 10 ? 86 : 58,
      quote: goalQuote,
      diagnosis:
        form.goal.trim().length >= 10
          ? '核心目标已经比较明确，适合作为沟通开场。'
          : '核心目标还不够聚焦，需要先明确希望对方接受什么判断。',
      nextAction: '把目标改写成一句“我建议……”开头的结论。',
    },
    {
      label: '证据支撑度',
      score: hasEvidence(combined) ? 76 : 48,
      quote: evidenceQuote,
      diagnosis: hasEvidence(combined)
        ? '已有指标或样本意识，但还需要说明由谁提供数据、如何验收。'
        : '当前表达仍偏方向判断，需要补充数据、案例或最小样本。',
      nextAction: '补充样本来源、验收指标和30天后的决策节点。',
    },
    {
      label: '反方预案度',
      score: hasRisk(combined) ? 82 : 46,
      quote: riskQuote,
      diagnosis: hasRisk(combined)
        ? '已经主动说明边界或风险，有助于降低对方戒备。'
        : '缺少失败判断和风险边界，容易让对方担心投入失控。',
      nextAction: '补一句“当前版本不做什么，以及失败后如何判断”。',
    },
    {
      label: '对象转译度',
      score: form.audience.trim().length >= 2 ? 82 : 52,
      quote: audienceQuote,
      diagnosis: form.audience.trim().length >= 2
        ? '已经明确沟通对象，下一步需要把内容转译成对方收益。'
        : '说服对象不清，会导致反方追问不够精准。',
      nextAction: '补一句“这对你当前业务目标有什么价值”。',
    },
    {
      label: '行动明确度',
      score: hasAction(combined) ? 84 : 50,
      quote: actionQuote,
      diagnosis: hasAction(combined)
        ? '已经有试点或行动意识，适合进入资源申请。'
        : '听完后对方可能不知道下一步要批准什么。',
      nextAction: '明确最小决策：给多少时间、哪些样本、谁来配合。',
    },
  ];
}

function buildWeakPoints(scores: ScoreItem[]) {
  return [...scores]
    .sort((a, b) => a.score - b.score)
    .slice(0, 2)
    .map((item) => item.label);
}

function buildRecommendedOpening(profile: RoleProfile) {
  if (profile.type === 'hr') {
    return '我建议先用一场轻量体验工作坊验证员工在真实表达场景中的训练需求，而不是直接采购完整培训方案。这样可以在控制成本的前提下，看到参与度、反馈质量和后续转化意向。';
  }

  if (profile.type === 'customer') {
    return '我建议你先用一个低门槛体验任务，判断这套训练是否真的击中你的表达困境，而不是一开始就做完整购买决策。这样你可以用一次真实练习来判断它是否值得继续投入。';
  }

  if (profile.type === 'interviewer') {
    return '我建议先看我能否在一个真实小任务中跑通从业务理解、样板搭建到复盘输出的闭环，而不是只听我描述过往经历。这样能更快判断我是否具备岗位需要的落地能力。';
  }

  if (profile.type === 'relationship') {
    return '我想先把这件事说清楚：我不是要证明自己完全正确，而是希望我们先找到一个可以共同尝试的小动作，让问题开始往前走。';
  }

  if (profile.type === 'public') {
    return '我想先给出一个简单判断：这个主题值得关注，不是因为它听起来新，而是因为它已经影响我们做判断、表达观点和说服他人的方式。';
  }

  return '我建议先用一个轻量AI业务智能体样板验证一个真实业务流程，而不是直接投入完整系统。这样可以在控制资源投入的前提下，更快判断这个方向是否值得继续推进。';
}

function buildPracticeTasks(profile: RoleProfile, weakPoints: string[]): ActionItem[] {
  const tasks: ActionItem[] = [];

  if (weakPoints.includes('观点清晰度')) {
    tasks.push({
      title: '重写一句话结论',
      detail: '用“我建议……”开头，明确你希望对方现在批准、尝试或接受什么。',
    });
  }

  if (weakPoints.includes('证据支撑度')) {
    tasks.push({
      title: '补齐验证证据',
      detail: `优先准备：${profile.evidenceHint}`,
    });
  }

  if (weakPoints.includes('反方预案度')) {
    tasks.push({
      title: '补充风险边界',
      detail: '说明当前版本不做什么、失败后如何判断、何时停止继续投入。',
    });
  }

  if (weakPoints.includes('对象转译度')) {
    tasks.push({
      title: '改写对方价值句',
      detail: `用${profile.label}能听懂的语言说明：这件事对他的目标有什么帮助。`,
    });
  }

  if (weakPoints.includes('行动明确度')) {
    tasks.push({
      title: '明确最小下一步',
      detail: '写清楚需要多少时间、哪些样本、谁配合、什么时候复盘。',
    });
  }

  const fallback: ActionItem[] = [
    { title: '压缩表达开场', detail: '把当前表达压缩成30秒，只保留结论、对方价值和下一步。' },
    { title: '补充验收指标', detail: '至少补3个指标，例如完成率、采纳率、反馈质量或转化意向。' },
    { title: '准备二轮追问', detail: '让反方继续追问3次，并逐一补证据或边界说明。' },
  ];

  return [...tasks, ...fallback].slice(0, 3);
}

function buildEvidenceList(profile: RoleProfile): ActionItem[] {
  if (profile.type === 'hr') {
    return [
      { title: '目标人群样本', detail: '选定一个部门或一类岗位，不做全员铺开。' },
      { title: '培训产出样本', detail: '准备一个练习任务、一份反馈表和一个前后对比样本。' },
      { title: '效果验收指标', detail: '到课率、作业完成率、反馈质量、复训或采购意向。' },
    ];
  }

  if (profile.type === 'customer') {
    return [
      { title: '真实痛点案例', detail: '明确用户当前最想解决的表达困境，而不是泛泛描述能力提升。' },
      { title: '低门槛体验任务', detail: '让用户用一次练习判断是否有价值，而不是一开始就做大决策。' },
      { title: '风险承诺边界', detail: '说明不承诺立刻改变，只承诺一次可验证的训练体验。' },
    ];
  }

  if (profile.type === 'interviewer') {
    return [
      { title: '岗位能力映射', detail: '把经历对应到岗位要求，而不是只罗列过往项目。' },
      { title: '可验证作品', detail: '提供一个可点击Demo、方案文档或真实交付样本。' },
      { title: '30天上手计划', detail: '说明入职后优先理解什么、交付什么、如何复盘。' },
    ];
  }

  return [
    { title: '一个真实业务场景', detail: '销售咨询、项目复盘、学员作业或培训任务，不做抽象演示。' },
    { title: '一组脱敏样本', detail: '3—10条即可，不需要完整系统数据。' },
    { title: '三个验收指标', detail: '完成率、采纳率、反馈质量或转化意向。' },
  ];
}

function buildPromptPack(profile: RoleProfile, audience: string) {
  return [
    `请你继续扮演${audience || profile.label}，针对我的试点申请提出3个最尖锐的问题，并指出我最需要补充的证据。`,
    `请你站在${profile.label}，检查这段话是否回答了你最关心的：${profile.cares.join('、')}。`,
    '请你把我的观点改写成“结论—对方价值—验证方法—风险边界—下一步行动”的结构，语气要求：专业、克制、有业务判断。',
  ];
}

function buildBetterStructure(profile: RoleProfile, audience: string) {
  return [
    '先给结论：用“我建议……”开头，明确你希望对方现在做出的最小决策。',
    `转成对方价值：说明这对「${audience || profile.label}」当前目标有什么帮助。`,
    '说明验证方法：用真实场景、小样本和明确指标验证，而不是空谈能力。',
    '主动讲边界：说明当前版本不做什么，以及失败后如何判断。',
    '提出下一步：明确时间、样本、接口人和复盘节点。',
  ];
}

export function buildReport(form: FormState): Report {
  const audience = form.audience.trim() || '业务负责人';
  const goal = form.goal.trim() || '先用一个轻量AI业务智能体样板验证真实业务流程';
  const profile = buildRoleProfile(audience, form.scenario);
  const scores = buildScores(form);
  const weakPoints = buildWeakPoints(scores);

  return {
    title: `${form.scenario}｜${shortText(goal)}`,
    createdAt: new Date().toLocaleString('zh-CN'),
    scenario: form.scenario,
    roleName: audience,
    roleProfile: profile,
    coreClaim: `我希望说服「${audience}」接受：${goal}`,
    roleInsight: profile.decisionLogic,
    scores,
    counterQuestions: questionBank[form.scenario],
    weakPoints,
    recommendedOpening: buildRecommendedOpening(profile),
    betterStructure: buildBetterStructure(profile, audience),
    practiceTasks: buildPracticeTasks(profile, weakPoints),
    evidenceList: buildEvidenceList(profile),
    promptPack: buildPromptPack(profile, audience),
    actionCardTitle:
      profile.type === 'customer'
        ? '体验前行动清单'
        : profile.type === 'hr'
          ? '工作坊试点清单'
          : profile.type === 'interviewer'
            ? '面试推进清单'
            : '下一轮行动清单',
  };
}

export { getPointTextByIds } from '@/data/templates';
