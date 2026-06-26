import { Prediction } from "../data/diseases";

const API_URL = "http://localhost:8000";

export async function predictDiseases(
  symptoms: string[]
): Promise<Prediction[]> {

  const response = await fetch(
    `${API_URL}/predict`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        symptoms,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Prediction failed");
  }

  const data = await response.json();

  return data.predictions;
}