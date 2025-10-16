'use client';
type Note = {
  id: number;
  title: string;
  body: string;
};
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { Box, Stack, TextField, Paper, Typography, Card, CardContent, IconButton, Skeleton, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';



export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const [editOpen, setEditOpen] = useState(false);
  const [editNote, setEditNote] = useState<Note | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const [saving, setSaving] = useState(false);



  // xisnove para dedurar toda vez que inicia o app
  useEffect(() => {
    fetch('/api/notes')
      .then(res => res.json())
      .then(data => {
        setNotes(data)
        setLoading(false)
      });
  }, []);

  const handleAddNote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    const response = await fetch('/api/notes', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body })
    })

    if (response.ok) {
      const newNote = await response.json();
      setNotes([...notes, newNote]);
      setTitle('');
      setBody('');
    } else {
      alert('Error on add note.')
    }
  };

  const handleDeleteNote = async (noteIdToBeDeleted: number) => {
    const response = await fetch(`/api/notes/${noteIdToBeDeleted}`, {
      method: "DELETE"
    });

    if (response.ok) {
      setNotes(notes.filter(note => note.id !== noteIdToBeDeleted))
    } else {
      alert("Error deleting note")
    }
  }

  const handleEditNote = (note: Note) => {
    setEditNote(note);
    setEditTitle(note.title);
    setEditBody(note.body);
    setEditOpen(true);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f5f6fa',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        py: 6,
      }}
    >
      <Typography variant="h3" component="h1" sx={{ mb: 4, fontWeight: 700, color: '#1976d2' }}>
        SmartNote AI
      </Typography>

      <Box sx={{ display: 'flex' }}>
        <Box sx={{ width: '40vw' }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
            New Note
          </Typography>
          <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 420, height: '60vh' }}>
            <form onSubmit={handleAddNote}>
              <Stack spacing={2}>
                <TextField
                  label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  variant="outlined"
                  required
                  fullWidth
                />
                <TextField
                  label="Content"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  variant="outlined"
                  multiline
                  rows={4}
                  required
                  fullWidth
                />
                <Button type="submit" variant="contained" size="large" sx={{ alignSelf: 'flex-end' }}>
                  Add Note
                </Button>
              </Stack>
            </form>
          </Paper>
        </Box>
        <Box sx={{ width: '40vw' }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
            My notes
          </Typography>
          <Stack spacing={2}>
            {loading ? (
              <>
                <Skeleton variant='rectangular' animation="wave" height={100} />
                <Skeleton variant='rectangular' animation="wave" height={100} />
                <Skeleton variant='rectangular' animation="wave" height={100} />
              </>
            ) : (
              <>
                {notes.length === 0 && (
                  <Typography color="text.secondary">You don't have notes, create a note now!.</Typography>
                )}
                {notes.map((note) => (
                  <Card key={note.id} variant="outlined" sx={{ bgcolor: '#fff' }}>
                    <CardContent sx={{ display: "flex", justifyContent: 'space-between' }}>
                      <Box >
                        <Typography variant="h6" sx={{ fontWeight: 600 }} gutterBottom>
                          {note.title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {note.body}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                          <IconButton onClick={() => handleEditNote(note)}>
                            <EditIcon
                              fontSize='small'
                            />
                          </IconButton>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                          <IconButton onClick={() => handleDeleteNote(note.id)}>
                            <ClearIcon
                              fontSize='small'
                            />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </>
            )
            }
          </Stack>
        </Box>
      </Box>
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Note</DialogTitle>
        <DialogContent>
          <TextField
            label='Title'
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            fullWidth
            margin='dense'
          />
          <TextField
            label='Content'
            value={editBody}
            onChange={e => setEditBody(e.target.value)}
            fullWidth
            margin='dense'
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setEditOpen(false)
              setEditTitle('')
              setEditBody('')
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              if (!editNote) return;
              setSaving(true)
              const response = await fetch(`/api/notes/${editNote.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: editTitle.trim(), body: editBody.trim() }),
              });
              setSaving(false)
              if (response.ok) {
                const updateNote = await response.json();
                setNotes(notes.map(n => n.id === updateNote.id ? updateNote : n))
                setEditOpen(false);
              } else {
                alert('Error updating note');
              }
            }}
            variant='contained'
            disabled={saving}
            endIcon={saving ? <CircularProgress size={20} /> : null}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
