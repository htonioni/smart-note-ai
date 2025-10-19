import { supabase } from '../supabaseClient';


// GET /api/notes
export async function GET() {
  // revisao: add 'updated at' column to the table.
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json(data);
}

// POST /api/notes
export async function POST(request: Request) {
  // const { title, body, tags, summary } = await request.json();
  const json = await request.json()
  const title = json.title
  const body = json.body
  const tags = json.tags
  const summary = json.summary

  const { data, error } = await supabase
    .from('notes')
    .insert([{ title, body, tags: tags || [], summary }])
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json(data, { status: 201 });
}