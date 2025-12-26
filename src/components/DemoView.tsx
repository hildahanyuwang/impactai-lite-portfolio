import React, { useState } from 'react';
import { getDemoAnswer } from '../services/demoService';
import { retrieveTopKCards, getCardById, getDbStats } from '../services/retrievalService';
import { SUGGESTED_QUESTIONS } from '../constants';
import { AIResponseSchema, EvidenceCard } from '../types';

export const DemoView: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResponseSchema | null>(null);
  const [retrievedContext, setRetrievedContext] = useState<EvidenceCard[]>([]);
  const [showDbModal, setShowDbModal] = useState(false);
  const [offlineNotice, setOfflineNotice] = useState(false);

  const handleSearch = async (query: string) => {
    setQuestion(query);
    setLoading(true);
    setResult(null);
    setRetrievedContext([]);
    setOfflineNotice(false);

    // 1. Simulate Retrieval (for visualization)
    const topK = retrieveTopKCards(query, 6);
    setRetrievedContext(topK);

    // 2. Get Precomputed Answer
    try {
      const data = await getDemoAnswer(query);
      
      setLoading(false);

      if (data) {
        setResult(data);
      } else {
        // If no precomputed answer exists for this query in the demo
        setOfflineNotice(true);
      }
    } catch (e) {
      setLoading(false);
      setOfflineNotice(true);
    }
  };

  const dbStats = getDbStats();

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative">
      
      {/* Search Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-serif font-bold text-wb-blue">Ask a Policy Question</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          ImpactAI-lite answers questions using only a curated, QA-reviewed set of publicly available impact evaluations.
        </p>
        <button 
          onClick={() => setShowDbModal(true)}
          className="text-xs text-wb-light hover:underline font-medium bg-blue-50 px-3 py-1 rounded-full"
        >
          What’s in the database? ({dbStats.studies} studies included)
        </button>
      </div>

      {/* Input Section */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-wb-blue transition"
            placeholder="e.g., Does tutoring improve math scores?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(question)}
          />
          <button
            onClick={() => handleSearch(question)}
            disabled={loading || !question.trim()}
            className="bg-wb-blue text-white px-6 py-3 rounded-md font-semibold hover:bg-opacity-90 transition disabled:opacity-50 min-w-[100px]"
          >
            {loading ? (
                <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </span>
            ) : 'Search'}
          </button>
        </div>

        {/* Offline Notice */}
        {offlineNotice && (
          <div className="mt-4 p-4 bg-yellow-50 text-yellow-800 rounded border border-yellow-200 text-sm">
            <h4 className="font-bold mb-1">Offline Demo Mode</h4>
            <p className="mb-2">This is a static portfolio demo with no external API connection.</p>
            <p>The query you entered has not been precomputed. Please try one of the sample queries below to see the output format.</p>
          </div>
        )}

        {/* Suggested Questions */}
        {!result && !loading && (
          <div className="mt-6">
            <p className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">Try these queries:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSearch(q)}
                  className="bg-blue-50 text-wb-blue text-sm px-3 py-1.5 rounded-full hover:bg-blue-100 transition border border-blue-100"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Retrieval Debug Info */}
      {(loading || (result && retrievedContext.length > 0)) && (
        <div className="text-xs text-gray-400 text-center animate-pulse">
           Using Top-{retrievedContext.length} relevant evidence cards from static demo database.
        </div>
      )}

      {/* Results View */}
      {result && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Main Answer Card */}
          <div className="bg-white rounded-lg shadow-md border-t-4 border-wb-light overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold text-wb-blue mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-wb-light" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                Evidence-Based Answer (Demo Output)
              </h3>
              <ul className="space-y-3">
                {result.answer_summary.map((point, i) => (
                  <li key={i} className="flex gap-3 text-gray-800 leading-relaxed">
                    <span className="text-wb-light font-bold mt-1">•</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
               <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Applicability & Limitations</h4>
               <p className="text-sm text-gray-600 italic">{result.limitations}</p>
            </div>
          </div>

          {/* Evidence Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
               <h3 className="text-lg font-bold text-wb-blue">Supporting Evidence (Sources)</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {result.evidence_used.map((item) => {
                const card = getCardById(item.card_id);
                
                if (!card) return null;
                return (
                  <div key={item.card_id} className="p-6 hover:bg-blue-50 transition duration-150">
                    <div className="flex justify-between items-start mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-wb-blue">
                        {card.domain}
                      </span>
                      <a href={card.source_url} target="_blank" rel="noreferrer" className="text-wb-light text-sm hover:underline flex items-center gap-1">
                        View Source 
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                      </a>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1">{card.citation}</h4>
                    {item.claim_supported && (
                        <p className="text-sm text-gray-800 italic mb-2 border-l-2 border-wb-light pl-2">
                            "{item.claim_supported}"
                        </p>
                    )}
                    <p className="text-sm text-gray-600 mb-2"><strong>Intervention:</strong> {card.intervention}</p>
                    <p className="text-sm text-gray-800 bg-gray-50 p-2 rounded border border-gray-200">
                      <strong>Finding:</strong> {card.finding_summary}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Follow-up Prompts */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 bg-wb-blue/5 rounded-lg border border-wb-blue/10">
             <span className="text-sm font-bold text-wb-blue">Explore further:</span>
             <div className="flex flex-wrap gap-2 justify-end">
               {result.follow_up_prompts.map((prompt, i) => (
                 <button 
                  key={i}
                  onClick={() => handleSearch(prompt)}
                  className="text-xs bg-white text-wb-blue px-3 py-1.5 rounded shadow-sm hover:shadow border border-gray-200 transition"
                 >
                   {prompt}
                 </button>
               ))}
             </div>
          </div>
        </div>
      )}

      {/* Database Stats Modal */}
      {showDbModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[90] backdrop-blur-sm" onClick={() => setShowDbModal(false)}>
          <div className="bg-white p-0 rounded-lg shadow-xl max-w-2xl w-full mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
             <div className="bg-wb-blue text-white p-6 flex justify-between items-center">
               <h3 className="text-xl font-serif font-bold">Inclusion Criteria & Coverage (Demo)</h3>
               <button onClick={() => setShowDbModal(false)} className="text-white/70 hover:text-white">✕</button>
             </div>
             <div className="p-6">
                <div className="grid grid-cols-4 gap-4 mb-8 text-center">
                    <div className="bg-gray-50 p-4 rounded border border-gray-100">
                        <div className="text-2xl font-bold text-wb-light">{dbStats.studies}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Studies</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded border border-gray-100">
                        <div className="text-2xl font-bold text-wb-light">{dbStats.totalCards}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Ev. Cards</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded border border-gray-100">
                        <div className="text-2xl font-bold text-wb-light">{dbStats.countries}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Countries</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded border border-gray-100">
                        <div className="text-2xl font-bold text-wb-light">{dbStats.domains}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Sectors</div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="font-bold text-wb-blue border-b pb-2">Inclusion Criteria</h4>
                    <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                        <li><strong>Publicly Available:</strong> Only studies with open-access PDFs or NBER/IZA working papers.</li>
                        <li><strong>Methodology:</strong> Rigorous Impact Evaluations (RCTs, RDD, Diff-in-Diff).</li>
                        <li><strong>Granularity:</strong> Studies reporting specific quantitative outcomes.</li>
                    </ul>

                    <h4 className="font-bold text-wb-blue border-b pb-2 mt-6">Offline Demo Note</h4>
                    <p className="text-sm text-gray-700">
                        This version of the application uses a static local file (JSON) to simulate the database. 
                        In a production environment, this would be replaced by a vector database with semantic search.
                    </p>
                </div>
             </div>
             <div className="bg-gray-50 p-4 text-right">
                <button onClick={() => setShowDbModal(false)} className="text-sm font-bold text-gray-500 hover:text-gray-800">Close</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};