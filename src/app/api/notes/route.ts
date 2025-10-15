import { notes } from './data'

// GET /api/notes
export async function GET() {
  return Response.json(notes);
}

// POST /api/notes
export async function POST(request: Request) {
  const data = await request.json();
  const newNote = {
    id: notes.length ? notes[notes.length - 1].id + 1 : 1,
    title: data.title,
    body: data.body,
  };
  notes.push(newNote);
  return Response.json(newNote, { status: 201 });
}