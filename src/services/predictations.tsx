import type { Disease, Prediction } from "../data/diseases";

const API_URL = "http://localhost:8000";

export async function predictDiseases(symptoms: string[]): Promise<Prediction[]> {
  const response = await fetch(`${API_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ symptoms }),
  });
  if (!response.ok) throw new Error(`Prediction failed: ${response.status}`);
  const data = await response.json();
  return data.predictions;
}

export async function fetchDiseases(): Promise<Disease[]> {
  const response = await fetch(`${API_URL}/diseases`);
  if (!response.ok) throw new Error(`Failed to fetch diseases: ${response.status}`);
  const data = await response.json();
  return data.diseases;
}

export async function fetchSymptoms(): Promise<string[]> {
  const response = await fetch(`${API_URL}/symptoms`);
  if (!response.ok) throw new Error(`Failed to fetch symptoms: ${response.status}`);
  const data = await response.json();
  return data.symptoms;
}