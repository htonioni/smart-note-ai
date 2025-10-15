import { supabase } from '../supabaseClient';

const { data, error } = await supabase.from('notes').select('*');

// GET /api/notes
export async function GET() {
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json(data);
}

// POST /api/notes
export async function POST(request: Request) {
  // const { title, body } = await request.json();
  const json = await request.json()
  const title = json.title
  const body = json.body

  const { data, error } = await supabase
    .from('notes')
    .insert([{ title, body }])
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json(data, { status: 201 });
}