export type Scenario =
  | '业务汇报'
  | '客户说服'
  | '关系沟通'
  | '面试表达'
  | '公众演讲';

export type RoleType =
  | 'business'
  | 'hr'
  | 'customer'
  | 'interviewer'
  | 'relationship'
  | 'public';

export type FormState = {
  scenario: Scenario;
  audience: string;
  goal: string;
  currentArgument: string;
  context: string;
  tone: string;
  selectedPoints: string[];
};

export type ScoreItem = {
  label: string;
  score: number;
  quote: string;
  diagnosis: string;
  nextAction: string;
};

export type CounterQuestion = {
  angle: string;
  question: string;
  intent: string;
};

export type ActionItem = {
  title: string;
  detail: string;
};

export type RoleProfile = {
  type: RoleType;
  label: string;
  lens: string;
  cares: string[];
  decisionLogic: string;
  evidenceHint: string;
  style: string;
};

export type Report = {
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
