'use client';

import { useMemo, useRef, useState } from 'react';
import { toPng } from 'html-to-image';

type Scenario =
  | '业务汇报'
  | '客户说服'
  | '关系沟通'
  | '面试表达'
  | '公众演讲';

type RoleType =
  | 'business'
  | 'hr'
  | 'customer'
  | 'interviewer'
  | 'relationship'
  | 'public';

type FormState = {
  scenario: Scenario;
  audience: string;
  goal: string;
  currentArgument: string;
  context: string;
  tone: string;
  selectedPoints: string[];
};

type ScoreItem = {
  label: string;
  score: number;
  quote: string;
  diagnosis: string;
  nextAction: string;
};

type CounterQuestion = {
  angle: string;
  question: string;
  intent: string;
};

type ActionItem = {
  title: string;
  detail: string;
};

type RoleProfile = {
  type: RoleType;
  label: string;
  lens: string;
  cares: string[];
  decisionLogic: string;
  evidenceHint: string;
};

type Report = {
  title: string;
  createdAt: string;
  scenario: Scenario;
  roleName: string;
  roleProfile: RoleProfile;
  coreClaim: string;
  roleInsight: string;
  scores: ScoreItem[];
  counterQuestions: CounterQuestion[];
  weakPoints: string[];
  recommendedOpening: string;
  betterStructure: string[];
  practiceTasks: ActionItem[];
  evidenceList: ActionItem[];
  promptPack: string[];
  actionCardTitle: string;
};

const scenarioOptions: Scenario[] = [
  '业务汇报',
  '客户说服',
  '关系沟通',
  '面试表达',
  '公众演讲',
];

const scenarioHints: Record<Scenario, string> = {
  业务汇报: '适合试点申请、项目立项、向上管理、方案汇报。',
  客户说服: '适合销售沟通、方案提案、异议处理、商务谈判。',
  关系沟通: '适合团队协作、亲密关系、家人朋友之间的沟通表达。',
  面试表达: '适合自我介绍、经历解释、职业转向、压力面试。',
  公众演讲: '适合主题演讲、路演、课程分享、公开表达。',
};

const questionBank: Record<Scenario, CounterQuestion[]> = {
  业务汇报: [
    {
      angle: '最小决策',
      question: '你希望我现在做出的最小决策是什么？',
      intent: '我在确认：你到底希望我现在批准什么，而不是听一个完整设想。',
    },
    {
      angle: '业务相关性',
      question: '这件事和我当前最关心的业务目标有什么关系？',
      intent: '我在确认：这是否与增长、交付、效率、成本或客户结果直接相关。',
    },
    {
      angle: '验证指标',
      question: '如果只给你一次小试点，你准备用什么指标证明它值得继续？',
      intent: '我在确认：你是否有可验收的结果，而不是只描述方向。',
    },
    {
      angle: '资源边界',
      question: '你需要哪些资源和授权？哪些是必须的，哪些只是加分项？',
      intent: '我在确认：这件事会不会变成一个不断扩大范围的需求。',
    },
    {
      angle: '失败判断',
      question: '如果试点失败，你如何判断是假设不成立，还是样本或执行不到位？',
      intent: '我在确认：你是否已经想清楚退出条件和复盘方式。',
    },
    {
      angle: '复用价值',
      question: '这次试点如果跑通，能不能复用到第二个、第三个业务场景？',
      intent: '我在确认：它是不是一次性Demo，还是能沉淀为方法和资产。',
    },
  ],
  客户说服: [
    {
      angle: '信任理由',
      question: '为什么我现在要相信你，而不是继续观望？',
      intent: '我在确认：你是否给出了足够的信任基础。',
    },
    {
      angle: '差异价值',
      question: '你的方案和其他替代方案相比，真正差异在哪里？',
      intent: '我在确认：你是否说清楚了不可替代的价值。',
    },
    {
      angle: '证据来源',
      question: '你提到的收益有没有证据？有没有案例？',
      intent: '我在确认：你的承诺是否可以被验证。',
    },
    {
      angle: '失败成本',
      question: '如果效果不达预期，我需要承担什么成本？',
      intent: '我在确认：试错风险是否可控。',
    },
    {
      angle: '客户立场',
      question: '为什么这不是你们单方面想卖给我？',
      intent: '我在确认：你是否真正站在客户问题上表达。',
    },
    {
      angle: '下一步',
      question: '如果我愿意继续了解，你希望我下一步做什么？',
      intent: '我在确认：你是否给了一个低阻力行动。',
    },
  ],
  关系沟通: [
    {
      angle: '表达目标',
      question: '你是在表达需求，还是在证明自己是对的？',
      intent: '我在确认：沟通目标是否清楚。',
    },
    {
      angle: '对方行动',
      question: '对方听完以后，知道自己可以具体做什么吗？',
      intent: '我在确认：你的表达是否给了可执行动作。',
    },
    {
      angle: '情绪边界',
      question: '你的表达里有没有把感受变成指责？',
      intent: '我在确认：这段话会不会引发防御。',
    },
    {
      angle: '共情程度',
      question: '你有没有承认对方也有自己的限制和感受？',
      intent: '我在确认：对方会不会感到被理解。',
    },
    {
      angle: '解决路径',
      question: '你希望这次沟通之后发生什么变化？',
      intent: '我在确认：沟通是否能走向解决。',
    },
    {
      angle: '备选方案',
      question: '如果对方暂时不同意，你准备如何继续沟通？',
      intent: '我在确认：你是否有缓冲方案。',
    },
  ],
  面试表达: [
    {
      angle: '岗位关系',
      question: '这个经历和岗位要求之间的关系是什么？',
      intent: '我在确认：你是否能把经历翻译成岗位价值。',
    },
    {
      angle: '证据支撑',
      question: '你说自己适合，有没有具体证据？',
      intent: '我在确认：你是否能用事实支撑判断。',
    },
    {
      angle: '短板处理',
      question: '你的短板是什么？你准备怎么补？',
      intent: '我在确认：你是否具备自我认知和改进路径。',
    },
    {
      angle: '差异优势',
      question: '为什么不是其他候选人，而是你？',
      intent: '我在确认：你是否有清晰差异化。',
    },
    {
      angle: '稳定逻辑',
      question: '你这段职业选择背后的稳定逻辑是什么？',
      intent: '我在确认：你不是短期逃避，而是主动选择。',
    },
    {
      angle: '上手计划',
      question: '如果你入职，前30天你会先做什么？',
      intent: '我在确认：你是否有落地意识。',
    },
  ],
  公众演讲: [
    {
      angle: '听众价值',
      question: '听众为什么要关心这个主题？',
      intent: '我在确认：你的主题是否和听众有关。',
    },
    {
      angle: '核心观点',
      question: '你的核心观点能不能用一句话说清楚？',
      intent: '我在确认：演讲是否有清晰主线。',
    },
    {
      angle: '证据案例',
      question: '有没有足够具体的故事、数据或案例支撑？',
      intent: '我在确认：观点是否可信。',
    },
    {
      angle: '结构推进',
      question: '你的表达是观点堆砌，还是有清晰推进？',
      intent: '我在确认：听众能不能跟上。',
    },
    {
      angle: '记忆点',
      question: '结尾有没有明确的行动号召或记忆点？',
      intent: '我在确认：演讲结束后听众能带走什么。',
    },
    {
      angle: '现场变化',
      question: '如果现场反馈不好，你怎么调整表达？',
      intent: '我在确认：你是否具备现场应变能力。',
    },
  ],
};

const pointOptions = [
  {
    id: 'mvp',
    label: '先做样板，不做大系统',
    text: '我建议先用一个轻量AI业务智能体样板验证真实业务流程，而不是一开始投入完整系统。',
  },
  {
    id: 'real-scenario',
    label: '必须进入真实业务场景',
    text: '这个样板不应该停留在工具体验，而要进入一个真实业务场景，例如销售咨询、项目复盘、学员作业或培训任务。',
  },
  {
    id: 'resource',
    label: '需要明确资源支持',
    text: '如果要进入试点，需要业务负责人支持、脱敏样本、场景接口人、工具权限和明确的复盘节奏。',
  },
  {
    id: 'metrics',
    label: '用指标判断是否继续投入',
    text: '我建议用完成率、采纳率、反馈质量、转化意向和复用可能性判断是否继续投入。',
  },
  {
    id: 'risk',
    label: '明确能力边界',
    text: '当前版本只验证训练闭环，不替代专业判断，也不承诺短期必然产生业务结果。',
  },
  {
    id: 'business',
    label: '连接业务增长',
    text: '如果试点成立，后续可以沉淀为课程工具、销售辅助、教练点评或企业培训工作坊的组成部分。',
  },
];

const testPacks = [
  {
    title: '业务试点场景',
    subtitle: '向业务负责人申请一个AI协同样板试点',
    form: {
      scenario: '业务汇报' as Scenario,
      audience: '业务负责人',
      goal:
        '先用一个轻量AI业务智能体样板验证真实业务流程，而不是直接投入完整系统',
      context:
        '公司正在探索AI协同业务流程。业务负责人重视逻辑、细节和真实落地，希望看到我不仅能提方案，也能快速做出可交互样板。',
      argument:
        '我建议先用一个轻量AI业务智能体样板验证真实业务流程，而不是一开始投入完整系统。这个样板应该进入一个真实业务场景，例如销售咨询、项目复盘、学员作业或培训任务；试点时需要业务负责人支持、脱敏样本、场景接口人、工具权限和明确的复盘节奏。判断是否继续投入，不看概念是否新，而看完成率、采纳率、反馈质量、转化意向和复用可能性。',
      selectedPoints: ['mvp', 'real-scenario', 'resource', 'metrics', 'risk'],
    },
  },
  {
    title: '销售咨询场景',
    subtitle: '说服潜在用户参加表达训练类产品',
    form: {
      scenario: '客户说服' as Scenario,
      audience: '潜在用户',
      goal:
        '让对方相信表达训练不是简单学话术，而是提升结构、反馈和真实场景表达能力',
      context:
        '用户对高客单表达课程有兴趣，但担心自己没有时间、课程效果不确定，也担心只是听一堆方法论。',
      argument:
        '我想让潜在用户先完成一次真实表达练习，而不是只听课程介绍。通过一次低门槛体验，让用户看到自己的表达卡点、反方质疑和修改方向；如果体验后用户认为反馈具体、训练任务可执行，再进入正式课程沟通。这个过程要明确边界：它不是保证立刻改变表达能力，而是帮助用户判断这套训练是否击中自己的真实困境。',
      selectedPoints: ['real-scenario', 'metrics', 'business', 'risk'],
    },
  },
  {
    title: '企业培训场景',
    subtitle: '向HR说明AI协同表达工作坊价值',
    form: {
      scenario: '客户说服' as Scenario,
      audience: '企业HR负责人',
      goal:
        '让企业先用一场AI协同表达工作坊验证员工在汇报、说服和沟通中的训练需求',
      context:
        '企业内部有销售、管理者和项目负责人沟通效率低的问题，但还不确定是否需要系统采购表达类培训。',
      argument:
        '我建议企业先用一场AI协同表达工作坊验证团队真实训练需求，而不是直接采购完整培训项目。工作坊可以选择一个具体场景，例如销售异议处理、管理者汇报或跨部门沟通，让员工现场提交表达稿，由AI反方陪练模拟客户、上级或同事的质疑，再由教练带领复盘。是否继续采购，不看课堂气氛，而看参训完成率、作业提交率、HR反馈、员工自评变化和后续部门复训意向。',
      selectedPoints: ['mvp', 'real-scenario', 'metrics', 'business'],
    },
  },
];

const initialForm: FormState = {
  scenario: '业务汇报',
  audience: '',
  goal: '',
  currentArgument: '',
  context: '',
  tone: '专业、克制、有业务判断、有落地感',
  selectedPoints: [],
};

const steps = [
  { id: 0, title: '产品假设' },
  { id: 1, title: '构造输入' },
  { id: 2, title: '反方追问' },
  { id: 3, title: '引用诊断' },
  { id: 4, title: '重组行动' },
];

function hasEvidence(text: string) {
  return /\d|%|用户|数据|案例|结果|增长|降低|提升|成本|收入|满意度|复购|反馈|指标|样本|完成率|采纳率|转化/.test(
    text,
  );
}

function hasRisk(text: string) {
  return /风险|失败|预案|如果|但是|不过|限制|边界|问题|担心|不确定|不承诺|不替代|样本/.test(
    text,
  );
}

function hasAction(text: string) {
  return /计划|步骤|执行|落地|推进|安排|时间|分工|行动|下一步|验证|试点|MVP|样板|30天|90天|复盘/.test(
    text,
  );
}

function shortText(text: string, max = 30) {
  const value = text.trim().replace(/\s+/g, ' ');
  return value.length > max ? `${value.slice(0, max)}...` : value;
}

function getScoreLevel(score: number) {
  if (score >= 85) return '强';
  if (score >= 70) return '可用';
  if (score >= 55) return '待补强';
  return '薄弱';
}

function getPointTextByIds(ids: string[]) {
  return ids
    .map((id) => pointOptions.find((item) => item.id === id)?.text)
    .filter(Boolean)
    .join('');
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

function inferRoleType(audience: string, scenario: Scenario): RoleType {
  const text = `${audience} ${scenario}`;
  if (/HR|人力|培训|企业/.test(text)) return 'hr';
  if (/客户|用户|学员|采购|甲方/.test(text)) return 'customer';
  if (/面试|面试官|招聘|候选/.test(text)) return 'interviewer';
  if (/伴侣|家人|朋友|亲密|关系/.test(text)) return 'relationship';
  if (/听众|观众|公开|演讲/.test(text)) return 'public';
  return 'business';
}

function buildRoleProfile(audience: string, scenario: Scenario): RoleProfile {
  const type = inferRoleType(audience, scenario);

  const profiles: Record<RoleType, RoleProfile> = {
    business: {
      type,
      label: '业务负责人视角',
      lens: '我只关心这件事是否能用小成本验证真实价值。',
      cares: ['业务相关性', '资源边界', '验收指标', '失败判断'],
      decisionLogic:
        '先判断是否值得给一次小试点，再决定是否进入更长期投入。',
      evidenceHint:
        '真实业务场景、脱敏样本、验收指标、30天后决策节点。',
    },
    hr: {
      type,
      label: '企业HR视角',
      lens: '我关心员工是否真的需要、培训是否可交付、效果是否可衡量。',
      cares: ['人群匹配', '培训产出', '组织成本', '效果评估'],
      decisionLogic:
        '先判断能否用一场低风险体验课验证团队需求，再看是否采购。',
      evidenceHint:
        '目标人群、课程样本、试点部门、反馈问卷、培训后行为变化。',
    },
    customer: {
      type,
      label: '潜在用户视角',
      lens: '我关心它是否解决我的真实问题，而不是只听起来很有概念。',
      cares: ['痛点命中', '可信证据', '试错成本', '下一步门槛'],
      decisionLogic:
        '先判断它是不是适合我，再决定是否继续了解或付费。',
      evidenceHint:
        '用户痛点、相似案例、体验任务、低门槛下一步、风险承诺边界。',
    },
    interviewer: {
      type,
      label: '面试官视角',
      lens: '我关心你的经历是否能迁移到岗位，且能否快速上手。',
      cares: ['岗位匹配', '证据案例', '短板处理', '上手计划'],
      decisionLogic:
        '先判断你是否能解释清楚迁移价值，再判断是否值得推进。',
      evidenceHint:
        'STAR案例、岗位能力映射、短板补齐路径、30天上手计划。',
    },
    relationship: {
      type,
      label: '沟通对象视角',
      lens: '我关心你是在解决问题，还是在证明自己是对的。',
      cares: ['情绪边界', '共情程度', '具体请求', '后续关系'],
      decisionLogic:
        '先判断这段话是否让我愿意继续沟通，再判断是否接受请求。',
      evidenceHint:
        '事实描述、感受表达、具体请求、对方选择空间、备选方案。',
    },
    public: {
      type,
      label: '听众视角',
      lens: '我关心这件事为什么值得听，以及我能带走什么。',
      cares: ['听众价值', '核心观点', '故事证据', '行动号召'],
      decisionLogic:
        '先判断主题是否与我有关，再判断观点是否值得记住。',
      evidenceHint:
        '听众痛点、核心金句、故事案例、数据支撑、结尾行动。',
    },
  };

  return profiles[type];
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

function buildRecommendedOpening(form: FormState, profile: RoleProfile) {
  const audience = form.audience.trim() || '对方';

  if (profile.type === 'hr') {
    return `我建议先用一场轻量体验工作坊，验证员工在真实表达场景中的训练需求，而不是直接采购完整培训方案。这样可以让${audience}在控制成本的前提下，看到参与度、反馈质量和后续转化意向。`;
  }

  if (profile.type === 'customer') {
    return `我建议你先用一个低门槛体验任务，判断这套训练是否真的击中你的表达困境，而不是一开始就做完整购买决策。这样你可以用一次真实练习来判断它是否值得继续投入。`;
  }

  if (profile.type === 'interviewer') {
    return `我建议先看我能否在一个真实小任务中跑通从业务理解、样板搭建到复盘输出的闭环，而不是只听我描述过往经历。这样能更快判断我是否具备岗位需要的落地能力。`;
  }

  if (profile.type === 'relationship') {
    return `我想先把这件事说清楚：我不是要证明自己完全正确，而是希望我们先找到一个可以共同尝试的小动作，让问题开始往前走。`;
  }

  if (profile.type === 'public') {
    return `我想先给出一个简单判断：这个主题值得关注，不是因为它听起来新，而是因为它已经影响我们做判断、表达观点和说服他人的方式。`;
  }

  return `我建议先用一个轻量AI业务智能体样板，验证一个真实业务流程，而不是直接投入完整系统。这样可以在控制资源投入的前提下，更快判断这个方向是否值得继续推进。`;
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
    {
      title: '压缩表达开场',
      detail: '把当前表达压缩成30秒，只保留结论、对方价值和下一步。',
    },
    {
      title: '补充验收指标',
      detail: '至少补3个指标，例如完成率、采纳率、反馈质量或转化意向。',
    },
    {
      title: '准备二轮追问',
      detail: '让反方继续追问3次，并逐一补证据或边界说明。',
    },
  ];

  return [...tasks, ...fallback].slice(0, 3);
}

function buildEvidenceList(profile: RoleProfile): ActionItem[] {
  if (profile.type === 'hr') {
    return [
      {
        title: '目标人群样本',
        detail: '选定一个部门或一类岗位，不做全员铺开。',
      },
      {
        title: '培训产出样本',
        detail: '至少准备一个练习任务、一份反馈表和一个前后对比样本。',
      },
      {
        title: '效果验收指标',
        detail: '到课率、作业完成率、反馈质量、复训或采购意向。',
      },
    ];
  }

  if (profile.type === 'customer') {
    return [
      {
        title: '真实痛点案例',
        detail: '明确用户当前最想解决的表达困境，而不是泛泛描述能力提升。',
      },
      {
        title: '低门槛体验任务',
        detail: '让用户用一次练习判断是否有价值，而不是一开始就做大决策。',
      },
      {
        title: '风险承诺边界',
        detail: '说明不承诺立刻改变，只承诺一次可验证的训练体验。',
      },
    ];
  }

  if (profile.type === 'interviewer') {
    return [
      {
        title: '岗位能力映射',
        detail: '把经历对应到岗位要求，而不是只罗列过往项目。',
      },
      {
        title: '可验证作品',
        detail: '提供一个可点击Demo、方案文档或真实交付样本。',
      },
      {
        title: '30天上手计划',
        detail: '说明入职后优先理解什么、交付什么、如何复盘。',
      },
    ];
  }

  return [
    {
      title: '一个真实业务场景',
      detail: '销售咨询、项目复盘、学员作业或培训任务，不做抽象演示。',
    },
    {
      title: '一组脱敏样本',
      detail: '3—10条即可，不需要完整系统数据。',
    },
    {
      title: '三个验收指标',
      detail: '完成率、采纳率、反馈质量或转化意向。',
    },
  ];
}

function buildPromptPack(profile: RoleProfile, audience: string) {
  return [
    `请你继续扮演${audience || profile.label}，针对我的试点申请提出3个最尖锐的问题，并指出我最需要补充的证据。`,
    `请你站在${profile.label}，检查这段话是否回答了你最关心的：${profile.cares.join('、')}。`,
    `请你把我的观点改写成“结论—对方价值—验证方法—风险边界—下一步行动”的结构，语气要求：专业、克制、有业务判断。`,
  ];
}

function buildBetterStructure(profile: RoleProfile, audience: string) {
  return [
    '第一步：先给结论，用“我建议……”开头，明确你希望对方现在做出的最小决策。',
    `第二步：转成对方价值，说明这对「${audience || profile.label}」当前目标有什么帮助。`,
    '第三步：说明验证方法，用真实场景、小样本和明确指标验证，而不是空谈能力。',
    '第四步：主动讲边界，说明当前版本不做什么，以及失败后如何判断。',
    '第五步：提出下一步，明确时间、样本、接口人和复盘节点。',
  ];
}

function buildReport(form: FormState): Report {
  const audience = form.audience.trim() || '业务负责人';
  const goal =
    form.goal.trim() ||
    '先用一个轻量AI业务智能体样板验证真实业务流程';
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
    recommendedOpening: buildRecommendedOpening(form, profile),
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

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-black tracking-tight text-slate-950">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-2 text-base leading-7 text-slate-500">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function AgentAvatar({ size = 'lg' }: { size?: 'sm' | 'lg' | 'xl' }) {
  const sizeClass =
    size === 'xl'
      ? 'h-20 w-20'
      : size === 'lg'
        ? 'h-16 w-16'
        : 'h-11 w-11';

  return (
    <div
      className={`${sizeClass} relative flex shrink-0 items-center justify-center rounded-3xl bg-slate-950 shadow-lg shadow-indigo-100`}
    >
      <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.65),transparent_35%),radial-gradient(circle_at_70%_70%,rgba(14,165,233,0.35),transparent_38%)]" />
      <div className="relative flex h-[62%] w-[62%] items-center justify-center rounded-2xl border border-white/35 bg-white/10">
        <div className="absolute top-[28%] left-[27%] h-1.5 w-1.5 rounded-full bg-white" />
        <div className="absolute top-[28%] right-[27%] h-1.5 w-1.5 rounded-full bg-white" />
        <div className="absolute bottom-[25%] h-1 w-8 rounded-full bg-white/80" />
      </div>
      <div className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-white bg-indigo-500" />
    </div>
  );
}

function Stepper({
  activeStep,
  setActiveStep,
  report,
}: {
  activeStep: number;
  setActiveStep: (step: number) => void;
  report: Report | null;
}) {
  return (
    <div className="grid grid-cols-5 gap-2 rounded-3xl border border-slate-200 bg-white p-2 shadow-sm">
      {steps.map((step) => {
        const disabled = step.id >= 2 && !report;
        return (
          <button
            key={step.id}
            disabled={disabled}
            onClick={() => setActiveStep(step.id)}
            className={`rounded-2xl px-3 py-3 text-sm font-semibold transition ${
              activeStep === step.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                : disabled
                  ? 'cursor-not-allowed bg-slate-50 text-slate-300'
                  : 'bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'
            }`}
          >
            <div className="text-xs opacity-70">Step {step.id}</div>
            <div>{step.title}</div>
          </button>
        );
      })}
    </div>
  );
}

function MiniRadar({ scores }: { scores: ScoreItem[] }) {
  const size = 260;
  const center = size / 2;
  const maxRadius = 92;
  const points = scores.map((item, index) => {
    const angle = (Math.PI * 2 * index) / scores.length - Math.PI / 2;
    const radius = (item.score / 100) * maxRadius;
    return {
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
      labelX: center + Math.cos(angle) * (maxRadius + 28),
      labelY: center + Math.sin(angle) * (maxRadius + 28),
      label: item.label,
    };
  });

  const polygon = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full">
      {[0.25, 0.5, 0.75, 1].map((scale) => {
        const ring = scores
          .map((_, index) => {
            const angle = (Math.PI * 2 * index) / scores.length - Math.PI / 2;
            const radius = maxRadius * scale;
            return `${center + Math.cos(angle) * radius},${
              center + Math.sin(angle) * radius
            }`;
          })
          .join(' ');
        return (
          <polygon
            key={scale}
            points={ring}
            fill="none"
            stroke="#dbe3f0"
            strokeWidth="1"
          />
        );
      })}
      {scores.map((_, index) => {
        const angle = (Math.PI * 2 * index) / scores.length - Math.PI / 2;
        return (
          <line
            key={index}
            x1={center}
            y1={center}
            x2={center + Math.cos(angle) * maxRadius}
            y2={center + Math.sin(angle) * maxRadius}
            stroke="#dbe3f0"
            strokeWidth="1"
          />
        );
      })}
      <polygon
        points={polygon}
        fill="rgba(79,70,229,0.18)"
        stroke="#4f46e5"
        strokeWidth="3"
      />
      {points.map((point) => (
        <circle key={point.label} cx={point.x} cy={point.y} r="4" fill="#4f46e5" />
      ))}
      {points.map((point) => (
        <text
          key={`${point.label}-label`}
          x={point.labelX}
          y={point.labelY}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="11"
          fill="#334155"
          fontWeight="700"
        >
          {point.label}
        </text>
      ))}
    </svg>
  );
}

function DiagnosticCard({ item }: { item: ScoreItem }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-lg font-black text-slate-950">{item.label}</div>
          <div className="mt-1 text-sm text-slate-500">
            {getScoreLevel(item.score)}
          </div>
        </div>
        <div className="text-4xl font-black text-indigo-600">{item.score}</div>
      </div>
      <div className="mt-4 h-2 rounded-full bg-slate-100">
        <div
          className="h-2 rounded-full bg-indigo-600"
          style={{ width: `${item.score}%` }}
        />
      </div>
      <div className="mt-4 rounded-2xl bg-indigo-50 p-4 text-sm leading-6 text-slate-700">
        <span className="font-bold text-indigo-700">引用原文：</span>
        “{item.quote}”
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-700">
        <span className="font-bold text-slate-950">判断：</span>
        {item.diagnosis}
      </p>
      <p className="mt-2 text-sm leading-7 text-slate-700">
        <span className="font-bold text-slate-950">下一步：</span>
        {item.nextAction}
      </p>
    </div>
  );
}

function ActionCard({
  report,
  cardRef,
}: {
  report: Report;
  cardRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={cardRef}
      className="w-[1080px] rounded-[48px] bg-white p-12 text-slate-950 shadow-2xl"
    >
      <div className="flex items-start justify-between gap-8">
        <div>
          <div className="tracking-[0.35em] text-sm font-black uppercase text-indigo-600">
            NEXT ACTION CARD
          </div>
          <h3 className="mt-5 text-5xl font-black tracking-tight">
            {report.actionCardTitle}
          </h3>
          <p className="mt-6 max-w-[760px] text-2xl leading-[1.6] text-slate-600">
            {report.coreClaim}
          </p>
        </div>
        <div className="whitespace-nowrap rounded-3xl bg-slate-950 px-7 py-5 text-center text-xl font-black leading-tight text-white">
          {report.scenario}
        </div>
      </div>

      <div className="my-10 h-px bg-slate-200" />

      <div className="rounded-3xl bg-indigo-50 p-8">
        <div className="text-lg font-black text-indigo-700">建议开场</div>
        <p className="mt-4 text-2xl font-black leading-[1.6] text-slate-950">
          {report.recommendedOpening}
        </p>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-8">
        <div>
          <h4 className="text-2xl font-black">接下来要做的 3 件事</h4>
          <div className="mt-6 space-y-4">
            {report.practiceTasks.map((item, index) => (
              <div key={item.title} className="flex gap-4 rounded-3xl bg-slate-100 p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xl font-black text-white">
                  {index + 1}
                </div>
                <p className="text-xl leading-[1.6] text-slate-700">
                  <span className="font-black text-slate-950">{item.title}：</span>
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-2xl font-black">需要准备的证据</h4>
          <div className="mt-6 space-y-4">
            {report.evidenceList.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-white p-5 text-xl leading-[1.6] text-slate-700"
              >
                <span className="font-black text-slate-950">{item.title}：</span>
                {item.detail}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 rounded-3xl bg-slate-950 p-8 text-white">
        <div className="text-lg font-black text-slate-300">
          下一轮追问 Prompt
        </div>
        <p className="mt-4 text-2xl leading-[1.7]">
          {report.promptPack[0]}
        </p>
      </div>

      <div className="mt-10 text-base text-slate-400">
        由 AI 业务智能体样板生成 · 当前版本基于规则与模板，用于 MVP 场景验证
      </div>
    </div>
  );
}

export default function Home() {
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [report, setReport] = useState<Report | null>(null);
  const [cardReady, setCardReady] = useState(false);
  const [exporting, setExporting] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const canGenerate = useMemo(() => {
    return form.goal.trim().length >= 4 || form.currentArgument.trim().length >= 10;
  }, [form.goal, form.currentArgument]);

  function updateForm<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function useTestPack(packIndex: number) {
    const pack = testPacks[packIndex];
    const selectedText =
      'argument' in pack.form && typeof pack.form.argument === 'string'
        ? pack.form.argument
        : getPointTextByIds(pack.form.selectedPoints);
    setForm({
      scenario: pack.form.scenario,
      audience: pack.form.audience,
      goal: pack.form.goal,
      context: pack.form.context,
      selectedPoints: pack.form.selectedPoints,
      currentArgument: selectedText,
      tone: '专业、克制、有业务判断、有落地感',
    });
    setReport(null);
    setCardReady(false);
  }

  function togglePoint(id: string) {
    const next = form.selectedPoints.includes(id)
      ? form.selectedPoints.filter((item) => item !== id)
      : [...form.selectedPoints, id];

    updateForm('selectedPoints', next);
    updateForm('currentArgument', getPointTextByIds(next));
  }

  function generateAndGoNext() {
    const nextReport = buildReport(form);
    setReport(nextReport);
    setCardReady(false);
    setActiveStep(2);
  }

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

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-6xl px-5 py-8 md:px-8">
        <header className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-xl">
          <div className="mb-5 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium">
              AI业务智能体样板
            </span>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium">
              反方陪练 Agent
            </span>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium">
              MVP验证工具
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tight md:text-5xl">
            AI反方陪练 Agent v0.1
          </h1>
          <p className="mt-5 max-w-4xl text-base leading-8 text-slate-200 md:text-lg">
            用一个可交互样板验证：用户在表达、说服、汇报、面试等场景中，
            是否需要AI帮助他模拟反方、引用原文诊断，并生成下一轮行动清单。
          </p>
        </header>

        <div className="mt-6">
          <Stepper
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            report={report}
          />
        </div>

        <div className="mt-6">
          {activeStep === 0 && (
            <Section
              title="Step 0｜产品假设"
              subtitle="当前Demo只验证一个最小Agent闭环，不承载完整业务方案。"
            >
              <div className="grid gap-5 md:grid-cols-3">
                <div className="rounded-3xl bg-indigo-50 p-6">
                  <div className="text-sm font-black text-indigo-700">
                    要验证的问题
                  </div>
                  <div className="mt-3 text-2xl font-black text-slate-950">
                    反方陪练能否成为表达训练入口
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    用户是否愿意把自己的观点交给AI，让AI模拟质疑、引用原文诊断并生成训练动作。
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-100 p-6">
                  <div className="text-sm font-black text-slate-500">
                    Agent 分工
                  </div>
                  <div className="mt-3 text-2xl font-black text-slate-950">
                    提问官 × 诊断官 × 训练官
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    把一次表达练习拆成反方追问、引用诊断、重组行动三个明确环节。
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-950 p-6 text-white">
                  <div className="text-sm font-black text-slate-300">
                    展示重点
                  </div>
                  <div className="mt-3 text-2xl font-black">
                    三天内做出可测试MVP
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    体现我能从业务假设快速拆到交互、规则、输出和下一步试点。
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveStep(1)}
                className="mt-8 w-full rounded-2xl bg-indigo-600 px-6 py-4 text-lg font-black text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
              >
                开始构造测试场景
              </button>
            </Section>
          )}

          {activeStep === 1 && (
            <Section
              title="Step 1｜构造输入"
              subtitle="用测试包和观点组件快速生成样本，也支持手动修改。"
            >
              <div className="space-y-8">
                <div>
                  <h3 className="mb-4 text-lg font-black">选择测试包</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    {testPacks.map((pack, index) => (
                      <button
                        key={pack.title}
                        onClick={() => useTestPack(index)}
                        className="rounded-3xl border border-slate-200 bg-white p-5 text-left transition hover:border-indigo-300 hover:bg-indigo-50"
                      >
                        <div className="font-black text-slate-950">
                          {pack.title}
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          {pack.subtitle}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-black">
                    勾选要测试的观点组件
                  </h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    {pointOptions.map((item) => (
                      <label
                        key={item.id}
                        className={`cursor-pointer rounded-2xl border p-4 transition ${
                          form.selectedPoints.includes(item.id)
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={form.selectedPoints.includes(item.id)}
                            onChange={() => togglePoint(item.id)}
                            className="mt-1 h-4 w-4"
                          />
                          <div>
                            <div className="font-black text-slate-950">
                              {item.label}
                            </div>
                            <p className="mt-1 text-sm leading-6 text-slate-500">
                              {item.text}
                            </p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-black text-slate-700">
                      选择场景
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {scenarioOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => updateForm('scenario', option)}
                          className={`rounded-2xl border px-4 py-3 text-left text-sm font-black transition ${
                            form.scenario === option
                              ? 'border-indigo-600 bg-indigo-600 text-white'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <p className="mt-2 text-sm text-slate-500">
                      {scenarioHints[form.scenario]}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-black text-slate-700">
                        你想说服谁？
                      </label>
                      <input
                        value={form.audience}
                        onChange={(event) =>
                          updateForm('audience', event.target.value)
                        }
                        placeholder="例如：业务负责人"
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-black text-slate-700">
                        你希望对方接受什么？
                      </label>
                      <input
                        value={form.goal}
                        onChange={(event) =>
                          updateForm('goal', event.target.value)
                        }
                        placeholder="例如：先用30天验证一个样板"
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black text-slate-700">
                    当前表达稿或核心观点
                  </label>
                  <textarea
                    value={form.currentArgument}
                    onChange={(event) =>
                      updateForm('currentArgument', event.target.value)
                    }
                    rows={6}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black text-slate-700">
                    背景信息
                  </label>
                  <textarea
                    value={form.context}
                    onChange={(event) =>
                      updateForm('context', event.target.value)
                    }
                    rows={4}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <button
                  onClick={() => {
                    const next = buildReport(form);
                    setReport(next);
                    setCardReady(false);
                    setActiveStep(2);
                  }}
                  disabled={!canGenerate}
                  className="w-full rounded-2xl bg-indigo-600 px-6 py-4 text-lg font-black text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                >
                  生成报告并进入反方追问
                </button>
              </div>
            </Section>
          )}

          {activeStep === 2 && report && (
            <Section
              title="Step 2｜反方追问"
              subtitle="模拟对方视角下的质疑，把潜在反对意见提前暴露出来。"
            >
              <div className="rounded-[2rem] bg-slate-950 p-6 text-white">
                <div className="flex items-start gap-5">
                  <AgentAvatar size="lg" />
                  <div>
                    <div className="text-sm font-black text-slate-300">
                      反方智能体 · {report.roleProfile.label}
                    </div>
                    <h3 className="mt-2 text-2xl font-black">
                      我已读取你的核心表达目标。
                    </h3>
                    <p className="mt-3 text-base leading-7 text-slate-300">
                      {report.roleProfile.lens}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {report.roleProfile.cares.map((item) => (
                        <span
                          key={item}
                          className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {report.counterQuestions.map((item, index) => (
                  <div key={item.question} className="flex gap-4">
                    <AgentAvatar size="sm" />
                    <div className="flex-1 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="text-sm font-black text-indigo-600">
                        反方追问 {index + 1}｜{item.angle}
                      </div>
                      <p className="mt-3 text-lg leading-8 text-slate-950">
                        {item.question}
                      </p>
                      <p className="mt-3 rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-500">
                        {item.intent}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid gap-3 md:grid-cols-2">
                <button
                  onClick={() => setActiveStep(1)}
                  className="rounded-2xl border border-slate-300 bg-white px-6 py-4 font-black text-slate-800 transition hover:bg-slate-100"
                >
                  返回修改输入
                </button>
                <button
                  onClick={() => setActiveStep(3)}
                  className="rounded-2xl bg-indigo-600 px-6 py-4 font-black text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
                >
                  进入诊断，看看最容易被质疑的地方
                </button>
              </div>
            </Section>
          )}

          {activeStep === 3 && report && (
            <Section
              title="Step 3｜引用诊断"
              subtitle="不是泛泛评分，而是引用你的原文，判断哪里最容易被质疑。"
            >
              <div className="grid gap-5 lg:grid-cols-[1fr_1.05fr_1.05fr]">
                <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5">
                  <div className="text-sm font-black text-slate-500">
                    能力雷达图
                  </div>
                  <div className="mx-auto mt-3 h-72 w-full">
                    <MiniRadar scores={report.scores} />
                  </div>
                  <div className="mt-5 rounded-3xl bg-white p-5">
                    <div className="font-black text-slate-950">
                      当前总体判断
                    </div>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      可以进入轻量试点沟通，但需要优先补强：
                      <span className="font-black text-indigo-700">
                        {report.weakPoints.join('、')}
                      </span>
                      。
                    </p>
                    <div className="mt-4 rounded-2xl bg-indigo-50 p-4 text-sm leading-6 text-slate-700">
                      <span className="font-black text-indigo-700">
                        角色判断：
                      </span>
                      {report.roleInsight}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {report.scores.slice(0, 3).map((item) => (
                    <DiagnosticCard key={item.label} item={item} />
                  ))}
                </div>

                <div className="space-y-4">
                  {report.scores.slice(3).map((item) => (
                    <DiagnosticCard key={item.label} item={item} />
                  ))}
                </div>
              </div>

              <div className="mt-8 grid gap-3 md:grid-cols-2">
                <button
                  onClick={() => setActiveStep(2)}
                  className="rounded-2xl border border-slate-300 bg-white px-6 py-4 font-black text-slate-800 transition hover:bg-slate-100"
                >
                  返回反方追问
                </button>
                <button
                  onClick={() => setActiveStep(4)}
                  className="rounded-2xl bg-indigo-600 px-6 py-4 font-black text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
                >
                  生成下一轮行动
                </button>
              </div>
            </Section>
          )}

          {activeStep === 4 && report && (
            <Section
              title="Step 4｜重组行动"
              subtitle="根据角色、场景和诊断短板，生成下一轮可执行动作。"
            >
              <div className="mb-6 rounded-3xl bg-slate-950 p-5 text-white">
                <div className="text-sm font-black text-slate-300">
                  本轮行动生成依据
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  <div className="rounded-2xl bg-white/10 p-4">
                    <div className="text-xs text-slate-300">反方角色</div>
                    <div className="mt-1 font-black">{report.roleProfile.label}</div>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4">
                    <div className="text-xs text-slate-300">优先补强</div>
                    <div className="mt-1 font-black">{report.weakPoints.join('、')}</div>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4">
                    <div className="text-xs text-slate-300">证据方向</div>
                    <div className="mt-1 font-black">{report.roleProfile.evidenceHint}</div>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-3">
                <div className="rounded-3xl bg-indigo-50 p-6 lg:col-span-3">
                  <div className="text-sm font-black text-indigo-700">
                    建议你下一轮开场这样说
                  </div>
                  <p className="mt-4 text-2xl font-black leading-[1.6] text-slate-950">
                    {report.recommendedOpening}
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5">
                  <h3 className="text-xl font-black">建议表达结构</h3>
                  <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
                    {report.betterStructure.map((item) => (
                      <p key={item}>{item}</p>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5">
                  <h3 className="text-xl font-black">下一步行动任务</h3>
                  <div className="mt-4 space-y-3">
                    {report.practiceTasks.map((item, index) => (
                      <div key={item.title} className="flex gap-3 rounded-2xl bg-slate-50 p-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-black text-white">
                          {index + 1}
                        </div>
                        <p className="text-sm leading-7 text-slate-700">
                          <span className="font-black text-slate-950">
                            {item.title}：
                          </span>
                          {item.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5">
                  <h3 className="text-xl font-black">继续压力测试</h3>
                  <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
                    {report.promptPack.map((item, index) => (
                      <div key={item} className="rounded-2xl bg-slate-50 p-4">
                        <div className="mb-1 font-black text-slate-950">
                          Prompt {index + 1}
                        </div>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-[2rem] border border-slate-200 bg-slate-50 p-5">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black">行动卡预览</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      生成一张可以带走的下一轮行动清单，用于复盘或沟通。
                    </p>
                  </div>
                  <button
                    onClick={() => setCardReady(true)}
                    className="rounded-2xl bg-indigo-600 px-5 py-3 font-black text-white transition hover:bg-indigo-700"
                  >
                    生成行动卡
                  </button>
                </div>

                {cardReady ? (
                  <div className="overflow-auto rounded-3xl bg-white p-4">
                    <div className="origin-top-left scale-[0.62]">
                      <ActionCard report={report} cardRef={cardRef} />
                    </div>
                  </div>
                ) : (
                  <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
                    点击“生成行动卡”后，将展示可导出的下一轮行动清单。
                  </div>
                )}
              </div>

              <div className="mt-8 grid gap-3 md:grid-cols-2">
                <button
                  onClick={() => setActiveStep(3)}
                  className="rounded-2xl border border-slate-300 bg-white px-6 py-4 font-black text-slate-800 transition hover:bg-slate-100"
                >
                  返回引用诊断
                </button>
                <button
                  onClick={exportActionCard}
                  disabled={!cardReady || exporting}
                  className="rounded-2xl bg-slate-950 px-6 py-4 font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {exporting ? '正在导出图片...' : '导出行动卡图片'}
                </button>
              </div>
            </Section>
          )}
        </div>

        <footer className="mt-8 rounded-3xl bg-white p-5 text-sm leading-7 text-slate-500">
          <div className="font-black text-slate-900">版本说明</div>
          <p className="mt-2">
            当前Demo用于面试沟通和MVP路径验证：不处理真实用户隐私数据，
            不替代专业判断，不承诺短期业务结果。业务应用场景、资源需求和后续迭代计划放入配套方案文档。
          </p>
        </footer>
      </div>
    </main>
  );
}
