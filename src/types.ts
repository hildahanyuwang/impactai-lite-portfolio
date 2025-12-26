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

export type AnswerPayload = {
  query: string;
  top_k?: number;
  mode?: "offline" | "online";
};

export type AnswerResponse = {
  answer_summary: string[];
  evidence_used: Array<{
    card_id: string;
    claim_supported?: string;
    source_url?: string;
  }>;
  limitations?: string;
  follow_up_prompts?: string[];
};
