import React, { useState, useEffect } from 'react';

interface SearchInputProps {
  query: string;
  setQuery: (query: string) => void;
  url: string;
  setUrl: (url: string) => void;
  onSearch: (query: string, url: string) => void;
  isLoading: boolean;
}

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
    </svg>
);


export const SearchInput: React.FC<SearchInputProps> = ({ query, setQuery, url, setUrl, onSearch, isLoading }) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let timerInterval: number | undefined;

    if (isLoading) {
      setElapsedTime(0); // Reset timer on new search
      timerInterval = window.setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, url);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl flex flex-col items-center gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask anything..."
          className="w-full px-5 py-4 text-white bg-gray-800 border-2 border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300"
          disabled={isLoading}
          required
        />
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Optional: Paste a website or social media URL for context..."
          className="w-full px-5 py-3 text-sm text-gray-300 bg-gray-800 border-2 border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="flex items-center justify-center px-8 py-3 w-auto text-white font-semibold bg-purple-600 rounded-full hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition duration-300 mt-2"
        >
          {isLoading ? 'Searching...' : <><SearchIcon /><span className="ml-2">Search</span></>}
        </button>
        {isLoading && (
            <div className="text-center text-gray-400 mt-4">
                <p>Comparing perspectives...</p>
                <p className="mt-2 text-2xl font-mono text-purple-400">{elapsedTime}s</p>
            </div>
        )}
      </form>
  );
};