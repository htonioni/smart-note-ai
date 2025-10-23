import { supabase } from '../supabaseClient';

export async function GET() {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('updatedAt', { ascending: false });

  if (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
  return Response.json({ success: true, data });
}

export async function POST(request: Request) {
  const json = await request.json()
  const title = json.title
  const body = json.body
  const tags = json.tags
  const summary = json.summary

  const { data, error } = await supabase
    .from('notes')
    .insert([{
      title,
      body,
      tags: tags || [],
      summary,
      updatedAt: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
  return Response.json({ success: true, data }, { status: 201 });
}