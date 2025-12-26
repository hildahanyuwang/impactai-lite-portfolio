# impactai-lite-portfolio

Offline demo + comms artifacts (one-pager, technical brief, pitch deck, FAQ) for an evidence-grounded policy assistant.

## What this is

ImpactAI-lite is an offline, static portfolio demo that showcases how an evidence-grounded policy Q&A experience can be presented with:
- Clear, decision-ready summaries
- Traceable evidence links for auditability
- Explicit applicability notes and limitations
- Follow-up prompts for structured exploration

This public version is intentionally offline (no external model calls) so it can be safely published and reviewed without exposing any credentials.

## What this is not
- Not a production system
- Not affiliated with or endorsed by the World Bank (see disclaimer below)
- Not a general-purpose chatbot; outputs are constrained to a curated demo set

## Demo scope (offline)
- The demo renders precomputed outputs for a small set of sample policy questions.
- Evidence and outputs are stored locally in the repository.
- If a user enters an unknown query, the UI prompts them to try a sample query.

## Repository structure
- src/ — React UI and demo logic
- src/data/evidence_cards.json — curated evidence cards with source_url links
- src/data/demo_outputs.json — precomputed answers keyed by sample queries
- public/ImpactAI-lite_PitchDeck_OFFLINE.pdf — embedded pitch deck preview

## Run locally
npm install
npm run dev

## Build
npm run build
npm run preview

## Deploy to GitHub Pages
This project is configured for GitHub Pages at:
https://hildahanyuwang.github.io/impactai-lite-portfolio/

Ensure vite.config.ts includes:
base: "/impactai-lite-portfolio/"

Recommended: deploy via GitHub Actions (build + publish to Pages).

## Disclaimer
Independent portfolio project for job application purposes only.
Not affiliated with or endorsed by the World Bank. Uses publicly available studies.