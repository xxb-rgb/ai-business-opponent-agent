import type { CounterQuestion, FormState, RoleProfile, RoleType, Scenario } from '@/types/agent';

export const scenarioOptions: Scenario[] = [
  '业务汇报',
  '客户说服',
  '关系沟通',
  '面试表达',
  '公众演讲',
];

export const scenarioHints: Record<Scenario, string> = {
  业务汇报: '适合试点申请、项目立项、向上管理、方案汇报。',
  客户说服: '适合销售沟通、方案提案、异议处理、商务谈判。',
  关系沟通: '适合团队协作、亲密关系、家人朋友之间的沟通表达。',
  面试表达: '适合自我介绍、经历解释、职业转向、压力面试。',
  公众演讲: '适合主题演讲、路演、课程分享、公开表达。',
};

export const pointOptions = [
  {
    id: 'mvp',
    label: '先做样板',
    description: '不直接投入完整系统',
    text: '我建议先用一个轻量AI业务智能体样板验证真实业务流程，而不是一开始投入完整系统。',
  },
  {
    id: 'real-scenario',
    label: '真实场景',
    description: '不只停留在演示',
    text: '这个样板不应该停留在工具体验，而要进入一个真实业务场景，例如销售咨询、项目复盘、学员作业或培训任务。',
  },
  {
    id: 'resource',
    label: '资源边界',
    description: '明确必须支持',
    text: '如果要进入试点，需要业务负责人支持、脱敏样本、场景接口人、工具权限和明确的复盘节奏。',
  },
  {
    id: 'metrics',
    label: '验证指标',
    description: '用指标决定是否继续',
    text: '我建议用完成率、采纳率、反馈质量、转化意向和复用可能性判断是否继续投入。',
  },
  {
    id: 'risk',
    label: '能力边界',
    description: '不替代专业判断',
    text: '当前版本只验证训练闭环，不替代专业判断，也不承诺短期必然产生业务结果。',
  },
  {
    id: 'business',
    label: '业务承接',
    description: '沉淀为可复用资产',
    text: '如果试点成立，后续可以沉淀为课程工具、销售辅助、教练点评或企业培训工作坊的组成部分。',
  },
];

export const testPacks = [
  {
    title: '业务试点',
    subtitle: '向业务负责人申请 AI 协同样板试点',
    badge: 'Internal',
    form: {
      scenario: '业务汇报' as Scenario,
      audience: '业务负责人',
      goal: '先用一个轻量AI业务智能体样板验证真实业务流程，而不是直接投入完整系统',
      context:
        '公司正在探索AI协同业务流程。业务负责人重视逻辑、细节和真实落地，希望看到我不仅能提方案，也能快速做出可交互样板。',
      argument:
        '我建议先用一个轻量AI业务智能体样板验证真实业务流程，而不是一开始投入完整系统。这个样板应该进入一个真实业务场景，例如销售咨询、项目复盘、学员作业或培训任务；试点时需要业务负责人支持、脱敏样本、场景接口人、工具权限和明确的复盘节奏。判断是否继续投入，不看概念是否新，而看完成率、采纳率、反馈质量、转化意向和复用可能性。',
      selectedPoints: ['mvp', 'real-scenario', 'resource', 'metrics', 'risk'],
    },
  },
  {
    title: '销售咨询',
    subtitle: '说服潜在用户参加表达训练类产品',
    badge: 'Growth',
    form: {
      scenario: '客户说服' as Scenario,
      audience: '潜在用户',
      goal: '让对方相信表达训练不是简单学话术，而是提升结构、反馈和真实场景表达能力',
      context:
        '用户对高客单表达课程有兴趣，但担心自己没有时间、课程效果不确定，也担心只是听一堆方法论。',
      argument:
        '我想让潜在用户先完成一次真实表达练习，而不是只听课程介绍。通过一次低门槛体验，让用户看到自己的表达卡点、反方质疑和修改方向；如果体验后用户认为反馈具体、训练任务可执行，再进入正式课程沟通。这个过程要明确边界：它不是保证立刻改变表达能力，而是帮助用户判断这套训练是否击中自己的真实困境。',
      selectedPoints: ['real-scenario', 'metrics', 'business', 'risk'],
    },
  },
  {
    title: '企业培训',
    subtitle: '向 HR 说明 AI 协同表达工作坊价值',
    badge: 'B2B',
    form: {
      scenario: '客户说服' as Scenario,
      audience: '企业HR负责人',
      goal: '让企业先用一场AI协同表达工作坊验证员工在汇报、说服和沟通中的训练需求',
      context:
        '企业内部有销售、管理者和项目负责人沟通效率低的问题，但还不确定是否需要系统采购表达类培训。',
      argument:
        '我建议企业先用一场AI协同表达工作坊验证团队真实训练需求，而不是直接采购完整培训项目。工作坊可以选择一个具体场景，例如销售异议处理、管理者汇报或跨部门沟通，让员工现场提交表达稿，由AI反方陪练模拟客户、上级或同事的质疑，再由教练带领复盘。是否继续采购，不看课堂气氛，而看参训完成率、作业提交率、HR反馈、员工自评变化和后续部门复训意向。',
      selectedPoints: ['mvp', 'real-scenario', 'metrics', 'business'],
    },
  },
  {
    title: '面试表达',
    subtitle: '解释职业转向和岗位匹配',
    badge: 'Career',
    form: {
      scenario: '面试表达' as Scenario,
      audience: '面试官',
      goal: '证明自己能把AI理解、项目管理和教育业务结合起来，快速落地一个真实试点',
      context:
        '面试官认可我的AI项目经验，但担心我对目标行业不够熟，需要看到我如何快速补业务理解并做出可验证成果。',
      argument:
        '我不把自己定位成纯技术或纯运营，而是能在业务、AI工具和项目管理之间做翻译的人。我的优势是能先做外部调研，再把业务假设拆成可交互样板，用小规模试点验证是否值得继续。入职前30天我会优先选择一个真实场景，拿3到10条脱敏样本跑通输入、诊断、行动和复盘闭环，而不是直接承诺做完整系统。',
      selectedPoints: ['mvp', 'real-scenario', 'resource', 'metrics'],
    },
  },
];

export const initialForm: FormState = {
  scenario: '业务汇报',
  audience: '',
  goal: '',
  currentArgument: '',
  context: '',
  tone: '专业、克制、有业务判断、有落地感',
  selectedPoints: [],
};

export const questionBank: Record<Scenario, CounterQuestion[]> = {
  业务汇报: [
    { angle: '最小决策', question: '你希望我现在做出的最小决策是什么？', intent: '确认你到底希望我现在批准什么，而不是听一个完整设想。' },
    { angle: '业务相关性', question: '这件事和我当前最关心的业务目标有什么关系？', intent: '确认它是否与增长、交付、效率、成本或客户结果直接相关。' },
    { angle: '验证指标', question: '如果只给你一次小试点，你准备用什么指标证明它值得继续？', intent: '确认你是否有可验收的结果，而不是只描述方向。' },
    { angle: '资源边界', question: '你需要哪些资源和授权？哪些是必须的，哪些只是加分项？', intent: '确认这件事会不会变成一个不断扩大范围的需求。' },
    { angle: '失败判断', question: '如果试点失败，你如何判断是假设不成立，还是样本或执行不到位？', intent: '确认你是否已经想清楚退出条件和复盘方式。' },
    { angle: '复用价值', question: '这次试点如果跑通，能不能复用到第二个、第三个业务场景？', intent: '确认它是不是一次性 Demo，还是能沉淀为方法和资产。' },
  ],
  客户说服: [
    { angle: '信任理由', question: '为什么我现在要相信你，而不是继续观望？', intent: '确认你是否给出了足够的信任基础。' },
    { angle: '差异价值', question: '你的方案和其他替代方案相比，真正差异在哪里？', intent: '确认你是否说清楚了不可替代的价值。' },
    { angle: '证据来源', question: '你提到的收益有没有证据？有没有案例？', intent: '确认你的承诺是否可以被验证。' },
    { angle: '失败成本', question: '如果效果不达预期，我需要承担什么成本？', intent: '确认试错风险是否可控。' },
    { angle: '客户立场', question: '为什么这不是你们单方面想卖给我？', intent: '确认你是否真正站在客户问题上表达。' },
    { angle: '下一步', question: '如果我愿意继续了解，你希望我下一步做什么？', intent: '确认你是否给了一个低阻力行动。' },
  ],
  关系沟通: [
    { angle: '表达目标', question: '你是在表达需求，还是在证明自己是对的？', intent: '确认沟通目标是否清楚。' },
    { angle: '对方行动', question: '对方听完以后，知道自己可以具体做什么吗？', intent: '确认你的表达是否给了可执行动作。' },
    { angle: '情绪边界', question: '你的表达里有没有把感受变成指责？', intent: '确认这段话会不会引发防御。' },
    { angle: '共情程度', question: '你有没有承认对方也有自己的限制和感受？', intent: '确认对方会不会感到被理解。' },
    { angle: '解决路径', question: '你希望这次沟通之后发生什么变化？', intent: '确认沟通是否能走向解决。' },
    { angle: '备选方案', question: '如果对方暂时不同意，你准备如何继续沟通？', intent: '确认你是否有缓冲方案。' },
  ],
  面试表达: [
    { angle: '岗位关系', question: '这个经历和岗位要求之间的关系是什么？', intent: '确认你是否能把经历翻译成岗位价值。' },
    { angle: '证据支撑', question: '你说自己适合，有没有具体证据？', intent: '确认你是否能用事实支撑判断。' },
    { angle: '短板处理', question: '你的短板是什么？你准备怎么补？', intent: '确认你是否具备自我认知和改进路径。' },
    { angle: '差异优势', question: '为什么不是其他候选人，而是你？', intent: '确认你是否有清晰差异化。' },
    { angle: '稳定逻辑', question: '你这段职业选择背后的稳定逻辑是什么？', intent: '确认你不是短期逃避，而是主动选择。' },
    { angle: '上手计划', question: '如果你入职，前30天你会先做什么？', intent: '确认你是否有落地意识。' },
  ],
  公众演讲: [
    { angle: '听众价值', question: '听众为什么要关心这个主题？', intent: '确认你的主题是否和听众有关。' },
    { angle: '核心观点', question: '你的核心观点能不能用一句话说清楚？', intent: '确认演讲是否有清晰主线。' },
    { angle: '证据案例', question: '有没有足够具体的故事、数据或案例支撑？', intent: '确认观点是否可信。' },
    { angle: '结构推进', question: '你的表达是观点堆砌，还是有清晰推进？', intent: '确认听众能不能跟上。' },
    { angle: '记忆点', question: '结尾有没有明确的行动号召或记忆点？', intent: '确认演讲结束后听众能带走什么。' },
    { angle: '现场变化', question: '如果现场反馈不好，你怎么调整表达？', intent: '确认你是否具备现场应变能力。' },
  ],
};

export function buildRoleProfile(audience: string, scenario: Scenario): RoleProfile {
  const text = `${audience} ${scenario}`;
  const type: RoleType = /HR|人力|培训|企业/.test(text)
    ? 'hr'
    : /客户|用户|学员|采购|甲方/.test(text)
      ? 'customer'
      : /面试|面试官|招聘|候选/.test(text)
        ? 'interviewer'
        : /伴侣|家人|朋友|亲密|关系/.test(text)
          ? 'relationship'
          : /听众|观众|公开|演讲/.test(text)
            ? 'public'
            : 'business';

  const profiles: Record<RoleType, RoleProfile> = {
    business: {
      type,
      label: '业务负责人视角',
      lens: '只关心这件事是否能用小成本验证真实价值。',
      cares: ['业务相关性', '资源边界', '验收指标', '失败判断'],
      decisionLogic: '先判断是否值得给一次小试点，再决定是否进入更长期投入。',
      evidenceHint: '真实业务场景、脱敏样本、验收指标、30天后决策节点。',
      style: '现实、克制、关注投入产出',
    },
    hr: {
      type,
      label: '企业HR视角',
      lens: '关心员工是否真的需要、培训是否可交付、效果是否可衡量。',
      cares: ['人群匹配', '培训产出', '组织成本', '效果评估'],
      decisionLogic: '先判断能否用一场低风险体验课验证团队需求，再看是否采购。',
      evidenceHint: '目标人群、课程样本、试点部门、反馈问卷、培训后行为变化。',
      style: '关注组织价值和复训可能',
    },
    customer: {
      type,
      label: '潜在用户视角',
      lens: '关心它是否解决我的真实问题，而不是只听起来很有概念。',
      cares: ['痛点命中', '可信证据', '试错成本', '下一步门槛'],
      decisionLogic: '先判断它是不是适合我，再决定是否继续了解或付费。',
      evidenceHint: '用户痛点、相似案例、体验任务、低门槛下一步、风险承诺边界。',
      style: '直接、谨慎、关注体验价值',
    },
    interviewer: {
      type,
      label: '面试官视角',
      lens: '关心你的经历是否能迁移到岗位，且能否快速上手。',
      cares: ['岗位匹配', '证据案例', '短板处理', '上手计划'],
      decisionLogic: '先判断你是否能解释清楚迁移价值，再判断是否值得推进。',
      evidenceHint: 'STAR案例、岗位能力映射、短板补齐路径、30天上手计划。',
      style: '追问证据和稳定性',
    },
    relationship: {
      type,
      label: '沟通对象视角',
      lens: '关心你是在解决问题，还是在证明自己是对的。',
      cares: ['情绪边界', '共情程度', '具体请求', '后续关系'],
      decisionLogic: '先判断这段话是否让我愿意继续沟通，再判断是否接受请求。',
      evidenceHint: '事实描述、感受表达、具体请求、对方选择空间、备选方案。',
      style: '敏感、关注情绪和边界',
    },
    public: {
      type,
      label: '听众视角',
      lens: '关心这件事为什么值得听，以及我能带走什么。',
      cares: ['听众价值', '核心观点', '故事证据', '行动号召'],
      decisionLogic: '先判断主题是否与我有关，再判断观点是否值得记住。',
      evidenceHint: '听众痛点、核心金句、故事案例、数据支撑、结尾行动。',
      style: '关注记忆点和现场价值',
    },
  };

  return profiles[type];
}


export function getPointTextByIds(ids: string[]) {
  return ids
    .map((id) => pointOptions.find((item) => item.id === id)?.text)
    .filter(Boolean)
    .join('');
}
