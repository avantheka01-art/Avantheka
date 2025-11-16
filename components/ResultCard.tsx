import React from 'react';
import type { GroundingChunk } from '../types';
import { LoadingSpinner } from './LoadingSpinner';

interface ResultCardProps {
  title: string;
  icon: React.ReactNode;
  content: string | null;
  sources?: GroundingChunk[];
  isLoading: boolean;
  error: string | null;
  score: number | null; // Score from 0 to 5
}

const LinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
);

// Star icon component for the rating
const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg className={`w-5 h-5 ${filled ? 'text-yellow-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

// StarRating component to display the score
const StarRating = ({ rating }: { rating: number }) => {
  const roundedRating = Math.round(rating);
  const stars = Array.from({ length: 5 }, (_, i) => (
    <StarIcon key={i} filled={i < roundedRating} />
  ));
  return <div className="flex items-center">{stars}</div>;
};


export const ResultCard: React.FC<ResultCardProps> = ({ title, icon, content, sources, isLoading, error, score }) => {
  const validSources = sources?.filter(s => s.web?.uri) ?? [];

  return (
    <div className="w-full h-full bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 flex flex-col border border-gray-700 transition-all duration-300 ease-in-out min-h-[300px]">
      <div className="flex items-center mb-4 flex-shrink-0">
        <div className="w-8 h-8 mr-3 text-purple-400">{icon}</div>
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">{title}</h2>
        {score !== null && !isLoading && !error && (
          <div className="ml-auto">
            <StarRating rating={score} />
          </div>
        )}
      </div>
      <div className="flex-grow overflow-y-auto prose prose-invert max-w-none text-gray-300">
        {isLoading && <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>}
        {error && (
            <div className="text-red-300 bg-red-900/50 p-3 rounded-lg">
                <p className="font-semibold">Request Failed</p>
                <p className="text-sm mt-1">{error}</p>
            </div>
        )}
        {!isLoading && !error && content && (
            <div className="whitespace-pre-wrap">
                {content}
            </div>
        )}
         {!isLoading && !content && !error && (
            <div className="flex items-center justify-center h-full text-gray-500">
                <p>Waiting for query...</p>
            </div>
        )}
      </div>
      {validSources.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-700 flex-shrink-0">
          <h3 className="text-md font-semibold text-gray-400 mb-3">Sources</h3>
          <ul className="space-y-2 max-h-32 overflow-y-auto">
            {validSources.map((source, index) => (
              <li key={index}>
                <a
                  href={source.web!.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors duration-200 text-sm group flex items-start space-x-2"
                >
                  <div className="flex-shrink-0 pt-1"><LinkIcon /></div>
                  <span className="group-hover:text-white transition-colors duration-200 break-all">{source.web!.title || source.web!.uri}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
