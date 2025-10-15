import { supabase } from '../../supabaseClient';


async function getNoteById(id: number) {
    const { data, error } = await supabase.from('notes').select('*').eq('id', id).single();
    return { data, error };
}

// entender melhor sobre noteId, note, { id }
// GET /api/notes/[id]
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const noteId = Number(id)
    const { data, error } = await supabase.from('notes').select('*').eq('id', noteId).single();

    if (error) {
        return Response.json({ error: error.message }, { status: 404 });
    }
    return Response.json(data, { status: 201 });
}

// PUT /api/notes/[id]
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const noteId = Number(id);
    // this is the data from the sent request
    const { title, body } = await request.json();

    const { data, error } = await supabase 
        .from('notes')
        .update({ title, body })
        .eq('id', noteId)
        .select()
        .single()
    
    // se algum campo for alterado, o valor passa a ser o novo da requisicao
    // nullish operator 
    if (error) {
        return Response.json({ error: error.message }, { status: 404 })
    } 
    return Response.json(data);

}

// DELETE /api/notes/[id]
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const noteId = Number(id);
    const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId)

    if (error) {
        return Response.json({ error: error.message }, { status: 404 })
    } 
    return Response.json({ success: true })
}