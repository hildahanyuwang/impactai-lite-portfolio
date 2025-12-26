import { EvidenceCard } from '../types';
import EVIDENCE_CARDS from '../data/evidence_cards.json';

export interface ScoredCard extends EvidenceCard {
  score: number;
}

/**
 * Keyword-weighted retrieval over a small, static evidence-card database.
 * This is intentionally simple (offline demo) and prioritizes transparency.
 */
export const retrieveTopKCards = (query: string, k: number = 6): EvidenceCard[] => {
  const cards = EVIDENCE_CARDS as EvidenceCard[];

  const q = (query || '').trim().toLowerCase();
  if (!q) return cards.slice(0, k);

  // Tokenize on non-word characters, drop very short tokens
  const tokens = q
    .split(/[^a-z0-9]+/g)
    .map(t => t.trim())
    .filter(t => t.length >= 3);

  if (tokens.length === 0) return cards.slice(0, k);

  // Field weights reflect what users see / care about in an evidence card.
  const FIELD_WEIGHTS: Array<[keyof EvidenceCard, number]> = [
    ['title', 3.0],
    ['intervention', 2.5],
    ['outcome', 2.5],
    ['summary', 2.0],
    ['population', 1.5],
    ['geography', 1.2],
    ['domain', 1.2],
    ['study_id', 0.8],
  ];

  const scoreText = (text: string, token: string) => {
    const t = text.toLowerCase();
    // Exact token match gets more than substring match
    if (t === token) return 3;
    if (t.includes(` ${token} `)) return 2;
    if (t.includes(token)) return 1;
    return 0;
  };

  const scored: ScoredCard[] = cards.map(card => {
    let score = 0;

    for (const token of tokens) {
      for (const [field, w] of FIELD_WEIGHTS) {
        const val = (card[field] ?? '') as unknown;
        if (typeof val === 'string' && val.length > 0) {
          score += w * scoreText(val, token);
        }
      }
    }

    // Small boosts for common policy phrasing that implies comparison / impact
    if (tokens.includes('impact') || tokens.includes('effect')) score *= 1.05;
    if (tokens.includes('compare') || tokens.includes('versus')) score *= 1.03;

    return { ...card, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map(({ score, ...rest }) => rest);
};

export const getCardById = (id: string): EvidenceCard | undefined => {
  return (EVIDENCE_CARDS as EvidenceCard[]).find(c => c.card_id === id);
};

export const getDbStats = () => {
  const cards = EVIDENCE_CARDS as EvidenceCard[];
  return {
    totalCards: cards.length,
    studies: new Set(cards.map(c => c.study_id)).size,
    countries: new Set(cards.map(c => c.geography.split(',').map(s => s.trim())).flat()).size,
    domains: new Set(cards.map(c => c.domain)).size,
  };
};
