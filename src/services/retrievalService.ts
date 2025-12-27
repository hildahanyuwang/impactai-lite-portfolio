import type { EvidenceCard } from "../types";
import EVIDENCE_CARDS from "../data/evidence_cards.json";

export interface ScoredCard extends EvidenceCard {
  score: number;
}

/**
 * Keyword-weighted retrieval over a small, static evidence-card database.
 * Offline demo: transparent, deterministic, and easy to audit.
 */
export const retrieveTopKCards = (query: string, k: number = 6): EvidenceCard[] => {
  const cards = EVIDENCE_CARDS as unknown as EvidenceCard[];

  const q = (query || "").trim().toLowerCase();
  if (!q) return cards.slice(0, k);

  // Tokenize on non-word characters, drop very short tokens
  const tokens = q
    .split(/[^a-z0-9]+/g)
    .map((t) => t.trim())
    .filter((t) => t.length >= 3);

  if (tokens.length === 0) return cards.slice(0, k);

  // All fields below exist in your EvidenceCard type.
  const FIELD_WEIGHTS: Array<[keyof EvidenceCard, number]> = [
    ["intervention", 2.5],
    ["outcome", 2.5],
    ["finding_summary", 2.0],
    ["domain", 1.5],
    ["geography", 1.2],
    ["citation", 1.0],
    ["study_id", 0.8],
  ];

  const scoreText = (text: string, token: string) => {
    const t = text.toLowerCase();
    // Exact token match gets more than substring match
    if (t === token) return 3;
    if (t.includes(` ${token} `)) return 2;
    if (t.includes(token)) return 1;
    return 0;
  };

  const scored: ScoredCard[] = cards.map((card) => {
    let score = 0;

    for (const token of tokens) {
      for (const [field, w] of FIELD_WEIGHTS) {
        const val = card[field];

        // All fields listed are strings except quality_flags (not used here).
        if (typeof val === "string" && val.length > 0) {
          score += w * scoreText(val, token);
        }
      }
    }

    // Small boosts for common policy phrasing that implies comparison / impact
    if (tokens.includes("impact") || tokens.includes("effect")) score *= 1.05;
    if (tokens.includes("compare") || tokens.includes("versus")) score *= 1.03;

    return { ...card, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map(({ score, ...rest }) => rest);
};

export const getCardById = (id: string): EvidenceCard | undefined => {
  return (EVIDENCE_CARDS as unknown as EvidenceCard[]).find((c) => c.card_id === id);
};

export const getDbStats = () => {
  const cards = EVIDENCE_CARDS as unknown as EvidenceCard[];

  const studyIds = new Set<string>();
  const domains = new Set<string>();
  const countries = new Set<string>();

  for (const c of cards) {
    if (c.study_id) studyIds.add(c.study_id);
    if (c.domain) domains.add(c.domain);

    // geography is a string in your type, but be defensive anyway
    const geo = typeof c.geography === "string" ? c.geography : "";
    if (geo) {
      geo
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((x) => countries.add(x));
    }
  }

  return {
    totalCards: cards.length,
    studies: studyIds.size,
    countries: countries.size,
    domains: domains.size,
  };
};
