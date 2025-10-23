import { supabase } from '@/app/api/supabaseClient';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const noteId = Number(id)
    const { data, error } = await supabase.from('notes').select('*').eq('id', noteId).single();

    if (error) {
        return Response.json({ success: false, error: error.message }, { status: 404 });
    }
    return Response.json({ success: true, data }, { status: 200 });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { title, body, tags, summary } = await request.json();
    const { id } = await params;

    const { data, error } = await supabase
        .from('notes')
        .update({
            title,
            body,
            tags,
            summary,
            updatedAt: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

    if (error) {
        return Response.json({ success: false, error: error.message }, { status: 404 })
    }
    return Response.json({ success: true, data });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const noteId = Number(id);
    const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId)

    if (error) {
        return Response.json({ success: false, error: error.message }, { status: 404 })
    }
    return Response.json({ success: true })
}