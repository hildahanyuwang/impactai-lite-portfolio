import React, { useState } from 'react';
import { DOCUMENT_TITLES } from '../constants';
import { DocumentType } from '../types';
import { getDbStats } from '../services/retrievalService';

// Inline Pitch Deck Component
export function PitchDeckInline() {
  const pdfUrl = `${import.meta.env.BASE_URL}ImpactAI-lite_PitchDeck_OFFLINE.pdf`;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 bg-gray-50 p-4 rounded border border-gray-200">
        <div>
          <div className="text-sm font-bold text-wb-blue">Project Pitch Deck</div>
          <div className="text-xs text-gray-500">Offline demo deck (inline preview)</div>
        </div>
      </div>

      <div className="w-full rounded-lg overflow-hidden border bg-white shadow-sm">
        <iframe
          title="ImpactAI-lite Pitch Deck"
          src={`${pdfUrl}#view=FitH`}
          className="w-full"
          style={{ height: "620px" }}
        />
      </div>

      <div className="text-xs text-gray-500 mt-2 text-center">
        If the preview does not load in your browser, open the PDF directly:
        <a className="underline ml-1 text-wb-light" href={pdfUrl} target="_blank" rel="noreferrer">
          ImpactAI-lite_PitchDeck_OFFLINE.pdf
        </a>
      </div>
    </div>
  );
}

const DocumentContent: React.FC<{ type: DocumentType }> = ({ type }) => {
  const dbStats = getDbStats();

  switch (type) {
    case 'one-pager':
      return (
        <div className="prose max-w-none text-gray-700">
          <h2 className="text-2xl font-serif font-bold text-wb-blue mb-4">ImpactAI-lite: Instant Access to Causal Evidence</h2>
          <div className="grid grid-cols-2 gap-6 mb-6">
             <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-bold text-wb-blue uppercase text-sm mb-2">The Problem</h4>
                <p className="text-sm">Policymakers need answers in minutes, not months. Systematic reviews take too long, and generic AI often lacks precision. Access to rigorous evidence remains a bottleneck.</p>
             </div>
             <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-bold text-wb-blue uppercase text-sm mb-2">The Solution</h4>
                <p className="text-sm">ImpactAI-lite demonstrates a workflow combining curated evidence cards with constrained reasoning to deliver citation-backed answers.</p>
             </div>
          </div>
          
          <h3 className="font-bold text-lg mb-2">Key Value Proposition</h3>
          <ul className="list-disc pl-5 space-y-2 mb-6">
            <li><strong>Hallucination-mitigating by design:</strong> Responses are strictly constrained to retrieved evidence cards.</li>
            <li><strong>Transparent Sourcing:</strong> Every output links back to specific studies (PDF/DOI/working paper).</li>
            <li><strong>Decision-Ready Synthesis:</strong> Summarizes what the evidence suggests, with clear applicability notes and limitations.</li>
          </ul>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-6 text-sm">
             <h4 className="font-bold text-wb-blue mb-2">Offline Demo (This Repo)</h4>
             <p className="mb-2">This is a <strong>static offline demonstration</strong> designed for public viewing on GitHub Pages. It does not connect to external APIs.</p>
             <p>It simulates the experience using a "Golden Set" of studies and precomputed answers to validate the workflow without exposing API credentials.</p>
          </div>

          <div className="border-t border-gray-200 pt-4">
             <p className="text-sm font-bold text-wb-light">Status</p>
             <p className="text-sm">Seeking feedback and potential pilot partners to expand the ontology and sector coverage.</p>
          </div>
        </div>
      );
    
    case 'tech-brief':
      return (
        <div className="prose max-w-none text-gray-700">
          <h2 className="text-2xl font-serif font-bold text-wb-blue mb-4">Technical Architecture</h2>
          
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded text-sm">
            <strong>Offline Demo Note:</strong> The version you are viewing runs entirely in the browser using static JSON files. The architecture below describes the target <strong>production</strong> environment.
          </div>

          <h3 className="font-bold text-lg mb-2">1. Production RAG Pipeline (Not Included)</h3>
          <p className="mb-2">In a live deployment, the system uses a secure server-side API:</p>
          <ul className="list-disc pl-5 mb-4 text-sm">
             <li><strong>Evidence Store:</strong> Vector database (e.g., Pinecone/Chroma) storing embeddings of evidence cards.</li>
             <li><strong>Retrieval:</strong> Semantic search + metadata filtering.</li>
             <li><strong>LLM Inference:</strong> Server-side model calls (external LLM API) via backend proxy.</li>
          </ul>

          <h3 className="font-bold text-lg mb-2">2. Data Ingestion & Structuring</h3>
          <p className="mb-2">We do not ingest raw PDFs blindly. Instead, we use a "Human-in-the-Loop" extraction pipeline:</p>
          <ul className="list-disc pl-5 mb-4 text-sm">
            <li><strong>Step 1:</strong> PDF Parsing into sections.</li>
            <li><strong>Step 2:</strong> Extraction of structured JSON (Intervention, Population, Outcome, Effect Size).</li>
            <li><strong>Step 3:</strong> Research Assistant validation (Quality Flagging).</li>
          </ul>

          <h3 className="font-bold text-lg mb-2">3. Security & Controls</h3>
          <ul className="list-disc pl-5 text-sm">
            <li><strong>Rate Limiting:</strong> Prevent abuse via IP-based throttling.</li>
            <li><strong>Access Control:</strong> Token-based authentication for pilot partners.</li>
            <li><strong>Audit Logs:</strong> Recording queries and citations for quality review.</li>
          </ul>
        </div>
      );
    
    case 'deck':
      return <PitchDeckInline />;

    case 'faq':
        return (
            <div className="space-y-4">
                <h2 className="text-2xl font-serif font-bold text-wb-blue mb-4">Frequently Asked Questions</h2>
                {[
                    { q: "Is this a generic chatbot?", a: "No. General-purpose chatbots rely on training data which may be outdated or hallucinated. ImpactAI-lite only answers using the specific, validated documents in its database." },
                    { q: "How accurate is the system?", a: "Accuracy is controlled via three layers: 1) Human review of the input evidence cards, 2) Constrained prompts that forbid using outside knowledge, and 3) Automated citation checking." },
                    { q: "What happens when evidence is missing?", a: "If the database lacks relevant studies for a query, the system is designed to explicitly state 'Insufficient evidence available' and recommend narrower search terms, rather than fabricating an answer." },
                    { q: "Can I upload my own PDF?", a: "Not in this public demo. This version uses a fixed 'Golden Set' of studies to demonstrate the concept safely offline." },
                    { q: "How do you handle conflicting evidence?", a: "The system summarizes both sides. For example, if one study finds positive effects and another finds null effects, the summary will explicitly state this divergence." }
                ].map((item, i) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-4 bg-white">
                        <h4 className="font-bold text-wb-blue mb-2">{item.q}</h4>
                        <p className="text-gray-600 text-sm">{item.a}</p>
                    </div>
                ))}
            </div>
        )

    case 'eval-note':
        return (
            <div className="prose max-w-none text-gray-700">
                <h2 className="text-2xl font-serif font-bold text-wb-blue mb-4">Evaluation Rubric & Methodology</h2>
                <p>To ensure trustworthiness, the system is evaluated against a representative test set (n=4 for this offline demo).</p>
                
                <div className="overflow-x-auto mt-4">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-100 font-bold">
                            <tr>
                                <th className="p-2 border">Criterion</th>
                                <th className="p-2 border">Definition</th>
                                <th className="p-2 border">Target Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="p-2 border font-medium">Groundedness</td>
                                <td className="p-2 border">Every claim in the summary must map to a cited source.</td>
                                <td className="p-2 border text-green-700 font-bold">100%</td>
                            </tr>
                            <tr>
                                <td className="p-2 border font-medium">Citation Accuracy</td>
                                <td className="p-2 border">The cited study actually supports the claim made.</td>
                                <td className="p-2 border text-green-700 font-bold">&gt;95%</td>
                            </tr>
                            <tr>
                                <td className="p-2 border font-medium">No Overclaiming</td>
                                <td className="p-2 border">Answers accurately reflect context limits (e.g., "in rural Kenya" vs "globally").</td>
                                <td className="p-2 border text-green-700 font-bold">Pass</td>
                            </tr>
                            <tr>
                                <td className="p-2 border font-medium">Failure Safety</td>
                                <td className="p-2 border">System refuses to answer when evidence is missing.</td>
                                <td className="p-2 border text-green-700 font-bold">Pass</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    default:
      return <div>Select a document</div>;
  }
};

export const DocumentsView: React.FC = () => {
  const [activeDoc, setActiveDoc] = useState<DocumentType>('one-pager');

  return (
    <div className="flex flex-col md:flex-row gap-6 min-h-[600px]">
      {/* Sidebar */}
      <div className="md:w-64 flex-shrink-0 space-y-1">
        {(Object.keys(DOCUMENT_TITLES) as DocumentType[]).map((type) => (
          <button
            key={type}
            onClick={() => setActiveDoc(type)}
            className={`w-full text-left px-4 py-3 rounded-md text-sm font-medium transition ${
              activeDoc === type 
                ? 'bg-wb-blue text-white shadow-md' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {DOCUMENT_TITLES[type]}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white p-8 rounded-lg shadow-md border border-gray-200">
         <DocumentContent type={activeDoc} />
      </div>
    </div>
  );
};