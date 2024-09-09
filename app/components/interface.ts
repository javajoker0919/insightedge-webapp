export interface OpportunityProps {
  companyName: string;
  name: string;
  score: number;
  targetBuyer: {
    role: string;
    department: string;
  };
  engagementTips: {
    inbound: string[];
    outbound: string[];
  };
  outboundEmail: {
    subject: string;
    body: string;
  };
  reasoning: string;
  keywords: string;
}

export interface MarketingProps {
  tactic: string;
  tacticScore: number;
  targetPersonas: string[];
  channel: string;
  valueProposition: string;
  keyPerformanceIndicators: string[];
  strategicAlignment: string;
  callToAction: string;
}

export interface SummaryProps {
  challenges: string[];
  opportunities: string[];
  pain_points: string[];
  priorities: string[];
  summary: string[];
  keywords: {
    keyword: string;
    weight: number;
  }[];
}

export interface TenKProps {
  url: string;
  filling_date: string;
  content: string;
  item_1: string;
  item_1a: string;
}

export interface ClinicalTrialProps {
  company_name: string;
  company_symbol: string;
  nct_id: string;
  completion_date: string;
  phase: string;
  title: string;
  conditions: string;
  interventions: string;
  last_update_posted: string;
}

export interface PressReleaseProps {
  date: string;
  title: string;
  text: string;
}
