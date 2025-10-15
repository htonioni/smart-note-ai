import { notes } from '../data';

// GET /api/notes/[id]
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const noteId = Number(id);
    const note = notes.find(n => n.id === noteId);

    if (note) {
        return Response.json(note);
    } else {
        return Response.json({ error: 'Not found' }, { status: 404 })
    }
}

// PUT /api/notes/[id]
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const noteId = Number(id);
    const data = await request.json()
    const note = notes.find(n => n.id === noteId);

    // se algum campo for alterado, o valor passa a ser o novo da requisicao
    // nullish operator 
    if (note) {
        note.title = data.title ?? note.title;
        note.body = data.body ?? note.body;
        return Response.json(note);
    } else {
        return Response.json({ error: 'Not Found' }, { status: 404 })
    }

}

// DELETE /api/notes/[id]
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const noteId = Number(id);
    const index = notes.findIndex(n => n.id === noteId);

    if (index !== -1) {
        notes.splice(index, 1);
        return Response.json({ sucess: true });
    } else {
        return Response.json({ error: 'Not found' }, { status: 404 })
    }
}