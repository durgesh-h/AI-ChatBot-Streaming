import { model } from '../config/gemini';
import { logger } from '../utils/logger';

export const streamAIResponse = async function* (prompt: string) {
    try {
        const result = await model.generateContentStream(prompt);
        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            yield chunkText;
        }
    } catch (error) {
        logger.error("Error in streamAIResponse:", error);
        throw error;
    }
};
