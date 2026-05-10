import { GoogleGenAI } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeLeaf(base64Image: string): Promise<AnalysisResult> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Analyze this leaf image and provide a JSON response with the following structure:
    {
      "leafType": "Common name of the plant/leaf",
      "structure": {
        "shape": "Description of shape",
        "edges": "Description of edges",
        "color": "Description of colors observed"
      },
      "condition": "healthy" | "diseased" | "unknown",
      "confidence": float between 0 and 1,
      "explanation": "Brief natural language explanation of findings",
      "recommendations": ["list of recommendations if diseased"]
    }
    
    Be precise. If you cannot identify it, state why in the explanation.
  `;

  const imagePart = {
    inlineData: {
      mimeType: "image/jpeg",
      data: base64Image.split(",")[1] || base64Image,
    },
  };

  const response = await ai.models.generateContent({
    model,
    contents: { parts: [imagePart, { text: prompt }] },
    config: {
      responseMimeType: "application/json",
    }
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    throw new Error("Invalid analysis format received from AI");
  }
}

export async function getChatResponse(history: any[], lastMessage: string, image?: string) {
  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: "You are an expert botanist and plant pathologist assistant for the Smart Leaf ID system. Help users identify leaves and diagnose plant health issues. Be professional, helpful, and concise.",
    }
  });

  const content: any[] = [{ text: lastMessage }];
  if (image) {
    content.unshift({
      inlineData: {
        mimeType: "image/jpeg",
        data: image.split(",")[1] || image,
      }
    });
  }

  const response = await chat.sendMessage({
    message: content
  });

  return response.text;
}
