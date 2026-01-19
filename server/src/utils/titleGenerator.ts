import { model } from '../config/gemini';

export const generateChatTitle = async (firstMessage: string): Promise<string> => {
    try {
        const prompt = `Generate a very short, concise title (max 4-5 words) for a chat that starts with this message: "${firstMessage}". Do not use quotes.`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("Error generating title:", error);
        return "New Chat";
    }
};
