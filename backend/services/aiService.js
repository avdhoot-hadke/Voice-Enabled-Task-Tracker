import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const parseTaskFromText = async (text) => {
    const currentDate = new Date().toISOString().split('T')[0];

    // Define the model
    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
                    You are a task parsing assistant. Convert the user's natural language message into a structured task object.

                    CURRENT DATE: ${currentDate}

                    ------------------------
                    TITLE RULES:
                    ------------------------
                    • Title must be short and action-based (3–4 words max)
                    • Focus on the core action (e.g., "Review Authentication PR", "Fix Login", "Submit Report")
                    • Do NOT include due dates or urgency words in the title ("urgent", "tomorrow", etc.)

                    ------------------------
                    DESCRIPTION RULES:
                    ------------------------
                    • Include all extra details from the user’s message
                    • Keep full natural-language context
                    • Remove filler phrases like “create a task to” or “remind me to”

                    ------------------------
                    DATE RULES:
                    ------------------------
                    • If relative dates (“Friday”, “tomorrow”, “next week”) appear → convert to YYYY-MM-DD
                    • If no date mentioned → dueDate = null

                    ------------------------
                    DEFAULT VALUES:
                    ------------------------
                    • priority → "Medium"
                    • status → "To Do"
                    • description → ""
                    • dueDate → null

                    ------------------------
                    STRICT OUTPUT:
                    ------------------------
                    • MUST return ONLY a JSON object matching this schema exactly:
                    {
                      "title": "string",
                      "description": "string",
                      "priority": "High" | "Medium" | "Low",
                      "status": "To Do" | "In Progress" | "Done",
                      "dueDate": "YYYY-MM-DD" | null
                    }
                    • No markdown
                    • No backticks
                    • No commentary

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

