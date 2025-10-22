import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({});

async function generateTagsAndSummary(title: string, body: string) {
    const prompt = `
        Analyze this note and provide:
        1. Exactly 3-4 relevant tags (single words , lowercase, no special characters)
        2. A smart summary that explains WHY this note matters, what category it belongs to, or what the user is trying to achieve. DO NOT just repeat what's written - instead, provide insight about the note's purpose, urgency, or context. Keep it concise and valuable. (212 characters maximum, including all letters, spaces, and punctuation marks.)

        Note Title: "${title}"
        Note Content: "${body}"

        Examples of GOOD summaries:
        - "Weekend productivity plan with home maintenance tasks and built-in motivation system"
        - "Recipe collection for quick weeknight meals under 30 minutes" 
        - "Meeting notes from Q4 planning session with action items for marketing team"

        Return ONLY a JSON object in this exact format:
        {
            "tags": ["tag1", "tag2", "tag3", "tag4"],
            "summary": "Insightful summary here."
        }
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        if (!response.text) {
            throw new Error('No response text from Gemini');
        }
        
        let cleanText = response.text.trim();
        if (cleanText.startsWith('```json')) {
            cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (cleanText.startsWith('```')) {
            cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }

        const aiResponse = JSON.parse(cleanText);

        return {
            success: true,
            data: aiResponse
        }
    } catch (error) {
        console.error('Gemini AI Error:', error);
        return {
            success: false,
            error: 'Failed to generate AI Content'
        };
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, body: noteBody } = body;
        if (!title || !noteBody) {
            return Response.json(
                { success: false, error: "title and body are required" },
                { status: 400 }
            );
        }

        const aiResult = await generateTagsAndSummary(title, noteBody);

        if (!aiResult.success) {
            return Response.json(
                { success: false, error: aiResult.error },
                { status: 500 }
            );
        }

        return Response.json({
            success: true,
            data: aiResult.data
        });
    } catch (error) {
        console.error('Route Error:', error);
        return Response.json(
            { success: false, error: "Invalid JSON" },
            { status: 400 }
        );
    }
}