
export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface GroundingMetadata {
  groundingChunks: GroundingChunk[];
}

export interface Candidate {
  groundingMetadata?: GroundingMetadata;
  [key: string]: any; 
}
