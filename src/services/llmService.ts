/**
 * Vendor-neutral client stub for an optional server-side model API.
 * Public GitHub Pages demo should NOT rely on this.
 *
 * Production deployments can implement /api/answer on a serverless host.
 */
import type { AnswerPayload } from '../types';

export async function fetchAnswerFromServer(query: string): Promise<AnswerPayload> {
  const res = await fetch('/api/answer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) {
    throw new Error(`Server answered with ${res.status}`);
  }
  return (await res.json()) as AnswerPayload;
}
