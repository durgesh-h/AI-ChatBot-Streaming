import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set in environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");
// using gemini-flash-latest as 2.0-flash hit quota limits
export const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
