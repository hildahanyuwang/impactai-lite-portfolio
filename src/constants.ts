import { DocumentType } from './types';

export const DOCUMENT_TITLES: Record<DocumentType, string> = {
  'one-pager': 'Project One-Pager',
  'tech-brief': 'Technical Brief',
  'deck': 'Pitch Deck (PDF)',
  'faq': 'FAQ / User Guide',
  'eval-note': 'Evaluation Note'
};

export const SUGGESTED_QUESTIONS = [
  "What interventions are most effective for improving student learning?",
  "Do cash transfers actually reduce poverty?",
  "What is the impact of school construction on wages?",
  "Compare conditional vs unconditional cash transfers for girls."
];