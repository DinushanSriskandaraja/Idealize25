import axios from "axios";

const GEMINI_API_KEY = "AIzaSyA3lF3cSCqWt7XB6qj83ey6eHyRTx9LLKA"; // Replace with your real API key
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

export interface ProductInfo {
  product: string;
  quantity: number;
  unit: string;
  price_per_unit: number;
  description: string;
  image_url: string;
}

export async function extractProductFromText(
  inputText: string
): Promise<ProductInfo> {
  const prompt = `
Extract structured data from the following message. It may be in Sinhala, Tamil, or English. Return only in this JSON format:

{
  "product": "",
  "quantity": 0,
  "unit": "",
  "price_per_unit": 0,
  "description": "",
  "image_url": "placeholder.png"
}

Message: "${inputText}"
`;

  const payload = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
  };

  try {
    const res = await axios.post(GEMINI_API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Type assertion to inform TypeScript about the expected structure
    const data = res.data as {
      candidates?: Array<{
        content?: {
          parts?: Array<{ text?: string }>;
        };
      }>;
    };

    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!raw) {
      throw new Error("No response text from Gemini API.");
    }

    // Clean and extract JSON
    const jsonStart = raw.indexOf("{");
    const jsonEnd = raw.lastIndexOf("}");
    const jsonString = raw.slice(jsonStart, jsonEnd + 1);
    const parsed = JSON.parse(jsonString);

    return parsed as ProductInfo;
  } catch (error: any) {
    console.error("Gemini API error:", error.response?.data || error.message);
    throw new Error("Failed to extract product info from Gemini.");
  }
}
