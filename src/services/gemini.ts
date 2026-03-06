import { GoogleGenAI, Type } from "@google/genai";

export type Round = {
  id: number;
  imageUrls: string[];
  hints: string[];
  answer: string;
  explanation: string;
};

export async function generateGameRounds(count: number = 10, maxRetries: number = 3): Promise<Round[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

  let response;
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Создай ${count} уникальных раундов для игры "Где логика?". 
В каждом раунде есть 3 картинки, которые связаны одним общим словом или понятием.
Для каждой картинки укажи точное название статьи в английской Википедии (Wikipedia article title), в которой есть подходящая иллюстрация (например, "Apple", "Eiffel_Tower", "Water"). Используй только очень популярные статьи, где гарантированно есть главное изображение.
Также дай короткую подсказку на русском языке для каждой картинки.
Укажи правильный ответ и объяснение связи.
Убедись, что загадки интересные, не слишком простые, но логичные. Не повторяй классические примеры, придумай новые.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                wikipediaTitles: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "3 exact English Wikipedia article titles (e.g. 'Apple', 'Car')"
                },
                hints: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "3 short hints in Russian, one for each image"
                },
                answer: {
                  type: Type.STRING,
                  description: "The common word or concept (the correct answer)"
                },
                explanation: {
                  type: Type.STRING,
                  description: "Explanation of how the images are connected to the answer"
                }
              },
              required: ["wikipediaTitles", "hints", "answer", "explanation"]
            }
          }
        }
      });
      break; // Success
    } catch (error: any) {
      attempt++;
      console.error(`Attempt ${attempt} failed:`, error);
      if (attempt >= maxRetries) {
        throw error;
      }
      // Wait before retrying (exponential backoff: 1s, 2s, 4s...)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt - 1) * 1000));
    }
  }

  const text = response?.text;
  if (!text) throw new Error("No response from Gemini");
  
  const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
  const data = JSON.parse(cleanText);
  
  const rounds: Round[] = [];
  
  for (let i = 0; i < data.length; i++) {
    const r = data[i];
    const imageUrls = [];
    for (const title of r.wikipediaTitles) {
      try {
        const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
        const wikiData = await res.json();
        if (wikiData.original && wikiData.original.source) {
          imageUrls.push(wikiData.original.source);
        } else if (wikiData.thumbnail && wikiData.thumbnail.source) {
          imageUrls.push(wikiData.thumbnail.source);
        } else {
          imageUrls.push(`https://picsum.photos/seed/${encodeURIComponent(title)}/600/600`);
        }
      } catch (e) {
        imageUrls.push(`https://picsum.photos/seed/${encodeURIComponent(title)}/600/600`);
      }
    }
    
    rounds.push({
      id: i + 1,
      imageUrls,
      hints: r.hints,
      answer: r.answer,
      explanation: r.explanation
    });
  }
  
  return rounds;
}
