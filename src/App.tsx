import React, { useState } from 'react';
import { ViewState } from './types';
import { DemoView } from './components/DemoView';
import { DocumentsView } from './components/DocumentsView';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('prototype');

  return (
    <div className="min-h-screen bg-wb-gray flex flex-col font-sans">
      
      {/* Navigation Bar */}
      <header className="bg-wb-blue text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
             {/* Logo Placeholder */}
             <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-wb-blue font-bold text-xl">
               I
             </div>
             <div>
               <h1 className="text-xl font-serif font-bold leading-tight">ImpactAI-lite</h1>
               <p className="text-xs text-blue-200 uppercase tracking-widest">Growth & Communications Portfolio</p>
             </div>
          </div>
          
          <nav className="flex gap-1">
             <button 
               onClick={() => setView('prototype')}
               className={`px-4 py-2 rounded-md text-sm font-medium transition ${view === 'prototype' ? 'bg-white/10 text-white' : 'text-blue-100 hover:text-white'}`}
             >
               Live Prototype
             </button>
             <button 
               onClick={() => setView('documents')}
               className={`px-4 py-2 rounded-md text-sm font-medium transition ${view === 'documents' ? 'bg-white/10 text-white' : 'text-blue-100 hover:text-white'}`}
             >
               Project Documents
             </button>
          </nav>

          <div className="hidden md:block text-xs text-blue-300">
             Candidate: Hilda (Hanyu) Wang
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-6">
        <div className="max-w-6xl mx-auto">
           {view === 'prototype' ? (
             <DemoView />
           ) : (
             <DocumentsView />
           )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-gray-500">
           <p className="mb-2"><strong>Disclaimer:</strong> Independent portfolio project for job application purposes only. Not affiliated with or endorsed by the World Bank. Uses publicly available studies.</p>
           <p>Offline Demo (Static Outputs). Production version would use a server-side LLM API.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;