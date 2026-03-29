export interface Outfit {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
}

export interface TryOnResult {
  id: string;
  originalImage: string;
  resultImage: string;
  outfit: Outfit;
  aiAnalysis?: {
    confidence: number;
    size: string;
    styleMatch: string;
    suggestion: string;
  };
}
