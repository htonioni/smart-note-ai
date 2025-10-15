'use client';
import { useState, useEffect } from 'react';
type Note = {
  id: number;
  title: string;
  body: string;
};
import Button from '@mui/material/Button';
import { Box, Stack, TextField, Paper, Typography, Card, CardContent, IconButton, Fade, Zoom } from '@mui/material';
import { Add as AddIcon, NoteAlt as NoteIcon } from '@mui/icons-material';


export default function Home() {

  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  // xisnove para dedurar toda vez que inicia o app
  useEffect(() => {
    fetch('/api/notes')
      .then(res => res.json())
      .then(data => setNotes(data));
  })

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
      <Paper elevation={3} sx={{ p: 4, mb: 5, width: '100%', maxWidth: 420 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
          New Note
        </Typography>
        <form onSubmit={handleAddNote}>
          <Stack spacing={2}>
            <TextField
              label="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              variant="outlined"
              required
              fullWidth
            />
            <TextField
              label="Conteúdo"
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
      <Box sx={{ width: '100%', maxWidth: 600 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
          My notes
        </Typography>
        <Stack spacing={2}>
          {notes.length === 0 && (
            <Typography color="text.secondary">You don't have notes, create a note now!.</Typography>
          )}
          {notes.map((note) => (
            <Card key={note.id} variant="outlined" sx={{ bgcolor: '#fff' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600 }} gutterBottom>
                  {note.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {note.body}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
