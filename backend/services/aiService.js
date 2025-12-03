import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const parseTaskFromText = async (text) => {
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Define the model
    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        // Force JSON generation for reliability
        generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
            You are a task parsing assistant. Convert the user's natural language message into a structured task object.

            CURRENT DATE: ${currentDate}

            ------------------------
            STRICT OUTPUT RULES:
            ------------------------
            1. You MUST return ONLY a JSON object. No explanations, no text, no markdown, no backticks.
            2. The JSON must match the schema exactly (same keys, correct types).
            3. Do not invent information not given in the input.
            4. If a field is missing in the input:
            - priority → "Medium"
            - status → "To Do"
            - description → ""
            - dueDate → null

            ------------------------
            DATE RULES:
            ------------------------
            • If user mentions relative dates ("tomorrow", "next week", "this Friday", "day after tomorrow"), 
            compute the correct YYYY-MM-DD based on CURRENT DATE.
            • If the text contains no date → dueDate = null
            • Output date ONLY in YYYY-MM-DD format.

            ------------------------
            OUTPUT JSON SCHEMA:
            {
                "title": "string",
                "description": "string",
                "priority": "High" | "Medium" | "Low",
                "status": "To Do" | "In Progress" | "Done",
                "dueDate": "YYYY-MM-DD" | null
            }

            ------------------------
            USER INPUT:
            "${text}"
`;


    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const textResponse = response.text();

        // Clean up if the model adds markdown backticks (though responseMimeType usually fixes this)
        const jsonString = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(jsonString);

    } catch (error) {
        console.error("Gemini API Error:", error);
        // Fallback: If AI fails, just return the text as a title
        return {
            title: text,
            priority: "Medium",
            status: "To Do",
            description: "AI failed to parse details, please edit manually."
        };
    }
};

