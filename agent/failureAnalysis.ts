import { GoogleGenAI } from "@google/genai";
import { envConfig } from "../config/env.config";
import { failurePrompt } from "../Prompt/FailurePrompt";

if (!envConfig.API_KEY) {
  throw new Error("API_KEY is not defined in the environment variables.");
}
const client = new GoogleGenAI({ apiKey: envConfig.API_KEY });

function isTransientModelError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /\b(429|500|502|503|504)\b|temporarily unavailable|high demand/i.test(message);
}

export async function analyzeFailure(
  testName: string,
  errorMessage: string,
  stackTrace: string
): Promise<string> {
  const prompt = failurePrompt.build(testName, errorMessage, stackTrace);
  let response;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      response = await client.models.generateContent({
        model: process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
        contents: prompt,
      });
      break;
    } catch (error) {
      if (!isTransientModelError(error) || attempt === 1) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }

  if (!response?.text) {
    throw new Error("Failure analysis response was empty.");
  }

  return response.text;
}