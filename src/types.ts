export interface EvidenceCard {
  card_id: string;
  study_id: string;
  citation: string;
  domain: 'Education' | 'Health' | 'Social Protection' | 'Agriculture';
  intervention: string;
  outcome: string;
  finding_summary: string;
  geography: string;
  source_url: string;
  quality_flags: string[];
}

export interface EvidenceUsage {
  card_id: string;
  claim_supported: string;
}

export interface AIResponseSchema {
  answer_summary: string[];
  evidence_used: EvidenceUsage[]; 
  limitations: string;
  follow_up_prompts: string[];
}

export type ViewState = 'prototype' | 'documents';

export type DocumentType = 'one-pager' | 'tech-brief' | 'deck' | 'faq' | 'eval-note';