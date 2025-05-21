import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

type LeadDetails = {
  name: string;
  company: string;
  email: string;
  phone: string;
  website?: string;
  address?: string;
  status: string;
  priority: string;
  source?: string;
  lastContact: string;
  notes?: string;
  conversation?: { message: string; timestamp: Date }[];
};

export async function getAISuggestions(leadDetails: LeadDetails): Promise<string[]> {
  const prompt = `
You are a sales assistant AI. Based on the following lead's details, suggest 3 short and actionable follow-up steps to increase engagement and improve conversion. Suggestions should be smart, human-like, and context-aware.

Lead Details:
Name: ${leadDetails.name}
Company: ${leadDetails.company}
Status: ${leadDetails.status}
Priority: ${leadDetails.priority}
Source: ${leadDetails.source ?? "N/A"}
Last Contact: ${new Date(leadDetails.lastContact).toLocaleString()}
Notes: ${leadDetails.notes ?? "N/A"}

Recent Messages:
${(leadDetails.conversation ?? [])
    .map(c => `- (${new Date(c.timestamp).toLocaleString()}): ${c.message}`)
    .join('\n')}

Generate follow-up suggestions just three small points. Make each suggestion of one small line with bullets and no bold characters. Do not include any other text or explanation.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash", // or "gemini-1.5-pro" / "gemini-1.0-pro" / "gemini-2.0-flash" if supported
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  const suggestionText = response.candidates?.[0]?.content?.parts?.[0]?.text || '';

const suggestions: string[] = suggestionText
    .split('\n')
    .map((s: string): string => s.replace(/^\d+\.\s*/, '').trim())
    .filter((s: string): s is string => Boolean(s));

  return suggestions;
}
