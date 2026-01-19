import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

// Load env from root
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
const apiKey = process.env.GEMINI_API_KEY;

async function checkModels() {
    if (!apiKey) {
        console.error("No API KEY found");
        return;
    }
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        console.log("Fetching models from:", url);
        const response = await axios.get(url);
        console.log("Available Models:", JSON.stringify(response.data, null, 2));
    } catch (error: any) {
        console.error("Error listing models:", error.response?.data || error.message);
    }
}

checkModels();
