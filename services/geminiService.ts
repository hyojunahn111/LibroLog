
import { GoogleGenAI, Type } from "@google/genai";

// API 키를 가져오고 유효성 확인
const apiKey = process.env.API_KEY;

export const getBookDetails = async (title: string) => {
  if (!title || !apiKey) return null;
  
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `책 제목 "${title}"에 대한 정보를 한국어로 제공해줘. 줄거리와 카테고리를 포함해줘.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            category: { type: Type.STRING },
            imageUrl: { type: Type.STRING }
          },
          required: ["description", "category"]
        }
      }
    });
    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};

export const getDailyRecommendation = async (currentBooks: string[]) => {
  if (!apiKey) return null;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const context = currentBooks.length > 0 
      ? `사용자가 읽고 있는 책: [${currentBooks.join(', ')}]. 비슷한 책 하나 추천.`
      : "유명한 스테디셀러 중 하나 추천.";

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `${context} 한국어로 정보 제공.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            author: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { type: Type.STRING }
          },
          required: ["title", "author", "description", "category"]
        }
      }
    });
    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Recommendation Error:", error);
    return null;
  }
};
