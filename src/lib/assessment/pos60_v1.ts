// POS-60 assessment config.
// Replace the placeholder POS60_V1 payload below with the full object provided by the product team.

export type PosDomainKey = 'focus' | 'planning' | 'execution' | 'collaboration' | 'resilience';

export type PosFacet = {
  key: string;
  label: string;
  description?: string;
};

export type PosQuestion = {
  id: string;
  prompt?: string;
  statement?: string;
  text?: string;
  domain: PosDomainKey;
  facet: string;
  reverse_scored?: boolean;
};

export type PosAssessmentConfig = {
  key: 'pos60';
  version: 'v1';
  domains: Record<PosDomainKey, { label: string; color?: string; facets: PosFacet[] }>;
  questions: PosQuestion[];
};

export const POS60_V1: PosAssessmentConfig = {
  key: 'pos60',
  version: 'v1',
  domains: {
    focus: { label: 'Focus', facets: [] },
    planning: { label: 'Planning', facets: [] },
    execution: { label: 'Execution', facets: [] },
    collaboration: { label: 'Collaboration', facets: [] },
    resilience: { label: 'Resilience', facets: [] },
  },
  questions: [
    // TODO: Paste the provided POS-60 question bank here (preserve IDs and reverse_scored flags).
  ],
};
