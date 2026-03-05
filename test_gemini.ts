import { GoogleGenAI, Type } from "@google/genai";

async function main() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Сгенерируй 1 уникальный раунд для игры Где логика?",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              imagePrompts: { type: Type.ARRAY, items: { type: Type.STRING } },
              hints: { type: Type.ARRAY, items: { type: Type.STRING } },
              answer: { type: Type.STRING },
              explanation: { type: Type.STRING }
            },
            required: ["imagePrompts", "hints", "answer", "explanation"]
          }
        }
      }
    });
    console.log(response.text);
  } catch (e) {
    console.error(e);
  }
}
main();
