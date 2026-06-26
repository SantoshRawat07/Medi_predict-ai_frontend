export type Severity = "Low" | "Moderate" | "High";

export interface Disease {
  name: string;
  symptoms: string[];
  description: string;
  severity: Severity;
  prevention: string[];
}

export interface Prediction {
  disease: Disease;
  confidence: number;
}