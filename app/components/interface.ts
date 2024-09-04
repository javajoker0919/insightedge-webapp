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
