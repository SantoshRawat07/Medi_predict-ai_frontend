export type Severity = "Low" | "Moderate" | "High";

export interface Disease {
  name: string;
  symptoms: string[];
  description: string;
  severity: Severity;
  prevention: string[];
}

export const DISEASES: Disease[] = [
  {
    name: "Influenza",
    symptoms: ["fever", "cough", "fatigue", "body pain", "headache", "chills"],
    description:
      "A contagious respiratory illness caused by influenza viruses that infect the nose, throat, and lungs.",
    severity: "Moderate",
    prevention: ["Annual flu vaccine", "Frequent hand washing", "Rest and hydration"],
  },
  {
    name: "Malaria",
    symptoms: ["fever", "chills", "sweating", "headache", "nausea", "fatigue"],
    description:
      "A serious mosquito-borne disease caused by Plasmodium parasites, common in tropical regions.",
    severity: "High",
    prevention: ["Use mosquito nets", "Antimalarial medication", "Avoid stagnant water"],
  },
  {
    name: "Dengue",
    symptoms: ["fever", "headache", "joint pain", "rash", "nausea", "body pain"],
    description:
      "A mosquito-borne viral infection causing high fever, severe headache, and joint pain.",
    severity: "High",
    prevention: ["Eliminate standing water", "Use repellents", "Wear long sleeves at dusk"],
  },
  {
    name: "Diabetes",
    symptoms: ["excessive thirst", "frequent urination", "fatigue", "blurred vision", "weight loss"],
    description:
      "A chronic condition that affects how your body turns food into energy due to insulin issues.",
    severity: "High",
    prevention: ["Maintain healthy weight", "Regular exercise", "Balanced low-sugar diet"],
  },
  {
    name: "Tuberculosis",
    symptoms: ["cough", "weight loss", "night sweats", "fatigue", "chest pain", "fever"],
    description:
      "A potentially serious infectious disease that mainly affects the lungs, caused by bacteria.",
    severity: "High",
    prevention: ["BCG vaccination", "Avoid close contact with infected", "Good ventilation"],
  },
  {
    name: "Asthma",
    symptoms: ["wheezing", "shortness of breath", "chest pain", "cough", "fatigue"],
    description:
      "A condition in which airways narrow and swell, producing extra mucus and difficulty breathing.",
    severity: "Moderate",
    prevention: ["Avoid known triggers", "Use prescribed inhalers", "Clean indoor air"],
  },
  {
    name: "Typhoid",
    symptoms: ["fever", "headache", "fatigue", "nausea", "body pain", "weight loss"],
    description:
      "A bacterial infection due to Salmonella Typhi causing prolonged fever and intestinal symptoms.",
    severity: "High",
    prevention: ["Safe drinking water", "Vaccination", "Proper food hygiene"],
  },
  {
    name: "Common Cold",
    symptoms: ["cough", "headache", "fatigue", "fever"],
    description:
      "A mild viral infection of the nose and throat — typically harmless and self-resolving.",
    severity: "Low",
    prevention: ["Wash hands often", "Avoid touching face", "Rest and fluids"],
  },
  {
    name: "Migraine",
    symptoms: ["headache", "nausea", "dizziness", "fatigue"],
    description:
      "A neurological condition that causes intense, debilitating headaches often with sensory disturbances.",
    severity: "Moderate",
    prevention: ["Identify triggers", "Consistent sleep", "Stay hydrated"],
  },
];

export const SUGGESTED_SYMPTOMS = [
  "Fever",
  "Headache",
  "Cough",
  "Fatigue",
  "Body Pain",
  "Nausea",
  "Dizziness",
  "Chest Pain",
  "Shortness of Breath",
  "Chills",
  "Sweating",
  "Joint Pain",
  "Weight Loss",
  "Wheezing",
  "Excessive Thirst",
  "Frequent Urination",
  "Night Sweats",
  "Blurred Vision",
  "Rash",
];

export interface Prediction {
  disease: Disease;
  confidence: number;
}

export function predictDiseases(selected: string[]): Prediction[] {
  if (selected.length === 0) return [];
  const norm = selected.map((s) => s.toLowerCase().trim());

  const scored = DISEASES.map((d) => {
    const matches = d.symptoms.filter((s) => norm.includes(s)).length;
    if (matches === 0) return null;
    const recall = matches / d.symptoms.length;
    const precision = matches / norm.length;
    const score = (recall * 0.55 + precision * 0.45) * 100;
    const confidence = Math.min(96, Math.round(40 + score * 0.6));
    return { disease: d, confidence };
  }).filter(Boolean) as Prediction[];

  return scored.sort((a, b) => b.confidence - a.confidence).slice(0, 3);
}
