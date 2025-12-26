import type { EvidenceCard } from "../types";
import EVIDENCE_CARDS from "../data/evidence_cards.json";

export interface ScoredCard extends EvidenceCard {
  score: number;
}

/**
 * Keyword-weighted retrieval over a small, static evidence-card database.
 * Offline demo: keep it transparent, deterministic, and easy to audit.
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

  /**
   * IMPORTANT:
   * Do NOT type fields as `keyof EvidenceCard` here, because the EvidenceCard
   * type may not include some retrieval-only fields (e.g., title/summary/population).
   * We keep it as string keys and safely read values.
   */
  const FIELD_WEIGHTS = [
    ["title", 3.0],
    ["intervention", 2.5],
    ["outcome", 2.5],
    ["summary", 2.0],
    ["population", 1.5],
    ["geography", 1.2],
    ["domain", 1.2],
    ["study_id", 0.8],
  ] as const;

  type FieldKey = (typeof FIELD_WEIGHTS)[number][0];

  const normalizeText = (v: unknown): string => {
    if (!v) return "";
    if (typeof v === "string") return v;
    if (Array.isArray(v)) return v.map((x) => String(x)).join(" ");
    // allow numbers/booleans etc.
    return String(v);
  };

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
        const val = (card as unknown as Record<FieldKey, unknown>)[field];
        const text = normalizeText(val);
        if (text.length > 0) {
          score += w * scoreText(text, token);
        }
      }
    }

    // Small boosts for common policy phrasing that implies comparison / impact
    if (tokens.includes("impact") || tokens.includes("effect")) score *= 1.05;
    if (tokens.includes("compare") || tokens.includes("versus")) score *= 1.03;

    return { ...(card as EvidenceCard), score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map(({ score, ...rest }) => rest);
};

export const getCardById = (id: string): EvidenceCard | undefined => {
  return (EVIDENCE_CARDS as unknown as EvidenceCard[]).find(
    (c: any) => c?.card_id === id
  );
};

export const getDbStats = () => {
  const cards = EVIDENCE_CARDS as unknown as EvidenceCard[];

  const studyIds = new Set<string>();
  const domains = new Set<string>();
  const countries = new Set<string>();

  for (const c of cards as any[]) {
    if (c?.study_id) studyIds.add(String(c.study_id));
    if (c?.domain) domains.add(String(c.domain));

    const geo = typeof c?.geography === "string" ? c.geography : "";
    if (geo) {
      geo
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean)
        .forEach((x: string) => countries.add(x));
    }
  }

  return {
    totalCards: cards.length,
    studies: studyIds.size,
    countries: countries.size,
    domains: domains.size,
  };
};
