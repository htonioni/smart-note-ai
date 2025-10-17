import { GoogleGenAI } from '@google/genai';

// client gets API key from the variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

async function generateTagsAndSummary(title: string, body: string) {
    const prompt = `
        Analyze this note and provide:
        1. Exactly 3-4 relevant tags (single words , lowercase, no special characters)
        2. A 3-sentence summary in English

        Note Title: "${title}"
        Note Content: "${body}"

        Return ONLY a JSON object in this exact format:
        {
            "tags": ["tag1", "tag2", "tag3", "tag4"],
            "summary": "First sentence. Second sentence. Third sentence."
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
        
        // response text cleaner - remove markdown code blocks
        let cleanText = response.text.trim();
        if (cleanText.startsWith('```json')) {
            cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (cleanText.startsWith('```')) {
            cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }

        // parsing the response (into object)
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
        // parse the JSON body from the request
        const body = await request.json();
        const { id, title, body: noteBody } = body;
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