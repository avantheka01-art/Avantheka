import React, { useState } from 'react';
import { SearchInput } from './components/SearchInput';
import { ResultCard } from './components/ResultCard';
import { fetchGroundedSearch, fetchDeepAnalysis, fetchCreativeExplanation } from './services/geminiService';
import type { GroundingChunk } from './types';

// Icons
const GoogleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.19,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.19,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.19,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z" /></svg>;
const AnalysisIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M12,6L14.5,10.5L19,12L14.5,13.5L12,18L9.5,13.5L5,12L9.5,10.5L12,6M12,2L9,9L2,12L9,15L12,22L15,15L22,12L15,9L12,2Z" /></svg>;
const CreativeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2C6.47,2 2,6.5,2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M17,17C16.5,17 16,16.5 16,16V15H8V16C8,16.5 7.5,17 7,17A1,1 0 0,1 6,16V10A1,1 0 0,1 7,9H8V8A1,1 0 0,1 9,7H15A1,1 0 0,1 16,8V9H17A1,1 0 0,1 18,10V16A1,1 0 0,1 17,17M14,13H10V11H14V13Z" /></svg>;

interface ResultState {
  content: string | null;
  sources: GroundingChunk[];
  isLoading: boolean;
  error: string | null;
  score: number | null; // Score from 0-5
}

const initialResultState: ResultState = {
  content: null,
  sources: [],
  isLoading: false,
  error: null,
  score: null,
};

// Generates a random score between 3.5 and 5 to simulate result quality
const generateRandomScore = () => {
  return Math.random() * 1.5 + 3.5;
};

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [url, setUrl] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const [groundedResult, setGroundedResult] = useState<ResultState>(initialResultState);
  const [analysisResult, setAnalysisResult] = useState<ResultState>(initialResultState);
  const [creativeResult, setCreativeResult] = useState<ResultState>(initialResultState);

  const handleSearch = async (searchQuery: string, searchUrl: string) => {
    if (!searchQuery.trim() || isSearching) return;

    setIsSearching(true);
    setGroundedResult({ ...initialResultState, isLoading: true });
    setAnalysisResult({ ...initialResultState, isLoading: true });
    setCreativeResult({ ...initialResultState, isLoading: true });

    const groundedPromise = fetchGroundedSearch(searchQuery, searchUrl)
      .then(response => {
        setGroundedResult({
          content: response.text,
          sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.filter(s => s.web?.uri) ?? [],
          isLoading: false,
          error: null,
          score: generateRandomScore(),
        });
      })
      .catch(e => {
        const errorMessage = e instanceof Error ? e.message : 'Unknown error.';
        setGroundedResult({ ...initialResultState, isLoading: false, error: errorMessage });
      });

    const analysisPromise = fetchDeepAnalysis(searchQuery, searchUrl)
      .then(response => {
        setAnalysisResult({ ...initialResultState, content: response.text, isLoading: false, error: null, score: generateRandomScore() });
      })
      .catch(e => {
        const errorMessage = e instanceof Error ? e.message : 'Unknown error.';
        setAnalysisResult({ ...initialResultState, isLoading: false, error: errorMessage });
      });
    
    const creativePromise = fetchCreativeExplanation(searchQuery, searchUrl)
      .then(response => {
        setCreativeResult({ ...initialResultState, content: response.text, isLoading: false, error: null, score: generateRandomScore() });
      })
      .catch(e => {
        const errorMessage = e instanceof Error ? e.message : 'Unknown error.';
        setCreativeResult({ ...initialResultState, isLoading: false, error: errorMessage });
      });

    await Promise.allSettled([groundedPromise, analysisPromise, creativePromise]);
    setIsSearching(false);
  };
  
  const hasEverSearched = groundedResult.isLoading || groundedResult.content || groundedResult.error;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col items-center p-4 sm:p-6">
      <header className="w-full text-center my-8 md:my-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600">
          AI Search Comparator
        </h1>
        <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
          Compare answers from Google AI, Perplexity, and ChatGPT for a richer understanding.
        </p>
      </header>

      <main className="w-full flex-grow flex flex-col items-center justify-start px-2 sm:px-4">
        <div className="w-full max-w-2xl mb-8 sticky top-4 z-10 bg-gray-900/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-700/50">
            <SearchInput
                query={query}
                setQuery={setQuery}
                url={url}
                setUrl={setUrl}
                onSearch={handleSearch}
                isLoading={isSearching}
            />
        </div>
        
        <div className="w-full flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl">
            {hasEverSearched ? (
                <>
                    <ResultCard 
                        title="Google AI"
                        icon={<GoogleIcon />}
                        {...groundedResult}
                    />
                    <ResultCard 
                        title="Perplexity"
                        icon={<AnalysisIcon />}
                        {...analysisResult}
                    />
                    <ResultCard 
                        title="ChatGPT"
                        icon={<CreativeIcon />}
                        {...creativeResult}
                    />
                </>
            ) : (
                <div className="lg:col-span-3 text-center text-gray-500 mt-16">
                    <p>Enter a topic to begin your search.</p>
                </div>
            )}
        </div>
      </main>
      <footer className="w-full text-center py-6 text-gray-600 text-sm mt-8">
        <p>Powered by the Gemini API</p>
      </footer>
    </div>
  );
};

export default App;
