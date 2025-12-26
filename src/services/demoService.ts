import { AIResponseSchema } from "../types";
import DEMO_OUTPUTS from "../data/demo_outputs.json";

// Config flag for optional Online Mode
// In production/GitHub Pages this will be undefined/false, forcing offline mode.
const USE_ONLINE_API = import.meta.env.VITE_USE_ONLINE_API === 'true';

// Simulate network delay for realism in offline mode
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getDemoAnswer = async (question: string): Promise<AIResponseSchema | null> => {
  
  // OPTIONAL: Online Mode (Protected)
  // This path is only taken if the environment variable is explicitly set.
  if (USE_ONLINE_API) {
    try {
        const response = await fetch('/api/answer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: question })
        });
        
        if (response.ok) {
            return await response.json();
        }
        console.warn("Online API failed, falling back to offline demo data.");
    } catch (e) {
        console.warn("Online API unavailable, falling back to offline demo data.");
    }
  }

  // DEFAULT: Offline Mode
  await delay(800); // Simulate processing time

  // Normalize query to find match in static JSON
  const normalizedQuery = question.trim();
  
  // @ts-ignore - JSON import typing
  const output = DEMO_OUTPUTS[normalizedQuery];

  if (output) {
    return output as AIResponseSchema;
  }

  return null;
};