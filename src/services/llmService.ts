import type { AnswerPayload, AnswerResponse } from "../types";

export async function fetchAnswerFromServer(payload: AnswerPayload): Promise<AnswerResponse> {
  const res = await fetch("/api/answer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`Server answered with ${res.status}`);
  return (await res.json()) as AnswerResponse;
}
