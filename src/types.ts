export interface AnalysisResult {
  leafType: string;
  structure: {
    shape: string;
    edges: string;
    color: string;
  };
  condition: "healthy" | "diseased" | "unknown";
  confidence: number;
  explanation: string;
  recommendations?: string[];
}

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  image?: string;
  timestamp: number;
  result?: AnalysisResult;
}
