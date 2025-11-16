import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import type { Candidate } from '../types';

// This type alias ensures that all properties of GenerateContentResponse (including .text) are preserved.
export type SearchResponse = GenerateContentResponse & {
  candidates?: Candidate[];
};

const getAi = () => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const createPromptWithUrl = (prompt: string, url?: string) => {
  if (url && url.trim()) {
    return `${prompt}\n\nPlease use the content from the following URL as additional context. If it's a social media link, consider the conversational tone and public sentiment in your response: ${url}`;
  }
  return prompt;
};

export const fetchGroundedSearch = async (query: string, url?: string): Promise<SearchResponse> => {
  const ai = getAi();
  const prompt = `Provide a factual, concise summary for the query: "${query}".`;
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: createPromptWithUrl(prompt, url),
    config: {
      tools: [{ googleSearch: {} }],
    },
  });
  return response as SearchResponse;
};

export const fetchDeepAnalysis = async (query: string, url?: string): Promise<GenerateContentResponse> => {
  const ai = getAi();
  const prompt = query;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: createPromptWithUrl(prompt, url),
    config: {
      systemInstruction: "You are an expert analyst. Provide a deep, structured, and comprehensive analysis of the user's query. Use markdown for formatting, including headings, lists, and bold text to improve readability.",
    }
  });
  return response;
};

export const fetchCreativeExplanation = async (query: string, url?: string): Promise<GenerateContentResponse> => {
  const ai = getAi();
  const prompt = query;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: createPromptWithUrl(prompt, url),
    config: {
      systemInstruction: "You are a friendly and helpful AI assistant. Explain the user's query in a clear, conversational, and easy-to-understand way. Use analogies and simple language where helpful.",
    }
  });
  return response;
};