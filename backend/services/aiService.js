import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const parseTaskFromText = async (text) => {
    const currentDate = new Date().toISOString().split('T')[0];

    const systemPrompt = `
    You are a task management assistant. Extract task details from the user's input.
    Current Date: ${currentDate} (Use this to calculate relative dates like "tomorrow").
    
    Return a valid JSON object with these keys:
    - title (string): The main task.
    - description (string): Any extra details (optional).
    - priority (string): 'High', 'Medium', or 'Low' (Default: Medium).
    - status (string): 'To Do', 'In Progress', 'Done' (Default: To Do).
    - dueDate (string): YYYY-MM-DD format. Return null if no date mentioned.

    Example Input: "Remind me to submit the report by Friday, high priority."
    Example Output: {"title": "Submit the report", "priority": "High", "dueDate": "2025-12-05", "status": "To Do"}
  `;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: text }
            ],
            temperature: 0,
            response_format: { type: "json_object" }
        });

        const content = response.choices[0].message.content;
        return JSON.parse(content);
    } catch (error) {
        console.error("OpenAI API Error:", error);
        throw new Error("Failed to parse task via AI");
    }
};

