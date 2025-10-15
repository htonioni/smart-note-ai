import { Button, Link } from "@mui/material"

interface NotePageProps {
    params: { id: string }
}

export default function NotePage({ params }: NotePageProps) {
    const note = noteList.find(n => n.id === Number(params.id))

    if (!note) {
        return <h1>Nota não encontrada</h1>
    }

    return (
        <div style={{ padding: 32 }}>
            <h1>{note.title}</h1>
            <p>{note.body}</p>
            <Link href={`/`}>
                <Button variant="outlined">
                    Voltar para Home
                </Button>
            </Link>
        </div>
    )
}

