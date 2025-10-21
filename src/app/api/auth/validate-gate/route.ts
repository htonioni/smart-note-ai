export async function POST(request: Request) {
  try {
    const { answer } = await request.json();

    if (!answer || typeof answer !== 'string') {
      return Response.json(
        { success: false, error: 'Invalid input' },
        { status: 400 }
      );
    }

    const correctAnswer = process.env.GATE_ANSWER;

    if (!correctAnswer) {
      console.error('GATE_ANSWER environment variable is not set');
      return Response.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const normalizeAnswer = (str: string) => 
      str.toLowerCase().trim().replace(/\s+/g, ' ');

    const isCorrect = normalizeAnswer(answer) === normalizeAnswer(correctAnswer);

    if (isCorrect) {
      return Response.json({ success: true });
    } else {
      return Response.json(
        { success: false, error: 'Incorrect answer' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Gate validation error:', error);
    return Response.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
