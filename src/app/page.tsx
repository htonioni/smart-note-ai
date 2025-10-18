'use client';
import { useState, useEffect } from 'react';
import { Note } from '../types/note'
import { Box, Stack, Typography, Skeleton, Container } from '@mui/material';
import NoteEmpty from './components/NoteEmpty';
import CreateNoteForm from './components/CreateNoteForm'
import NoteCard from './components/NoteCard';
import EditNoteModal from './components/EditNoteModal';
import DeleteNoteModal from './components/DeleteNoteModal';

export default function Home() {
  // core notes
  const [notes, setNotes] = useState<Note[]>([]);

  // fetching data
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState<number | null>(null)

  // modal

  // modals
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null)
  const [noteToEdit, setNoteToEdit] = useState<Note | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [savingEditedNote, setSavingEditedNote] = useState(false);

  // xisnove para dedurar toda vez que inicia o app -- checar
  useEffect(() => {
    fetch('/api/notes')
      .then(res => res.json())
      .then(data => {
        setNotes(data)
        setLoading(false)
      });
  }, []);

  // add loading to button when using post request
  const handleAddNote = async (
    title: string,
    body: string,
    aiEnabled: boolean
  ) => {

    let aiTags = null

    if (aiEnabled) {
      try {
        const aiResponse = await fetch('/api/ai/suggest-tags', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: 0, // temp
            title: title.trim(),
            body: body.trim()
          })
        });

        const aiResult = await aiResponse.json();

        if (aiResult.success) {
          aiTags = aiResult.data.tags;
        }
      } catch (error) {
        console.error('AI generation failed:', error);
      }
    }

    const response = await fetch('/api/notes', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title.trim(),
        body: body.trim(),
        tags: aiTags
      })
    })

    if (response.ok) {
      const newNote = await response.json();
      setNotes([...notes, newNote]);
    } else {
      alert('Error on add note.')
    }
  };

  const handleSaveEditedNote = async (updatedNote: Note) => {
    setSavingEditedNote(true)
    try {
      const response = await fetch(`api/notes/${updatedNote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedNote),
      })

      if (response.ok) {
        const savedNote = await response.json();
        setNotes(notes.map(n => n.id === savedNote.id ? savedNote : n));
        setEditOpen(false);
      } else {
        alert('Error updating note');
      }
    } catch (error) {
      console.error('Error updating note:', error)
      alert('Error updating note')
    } finally {
      setSavingEditedNote(false)
    }
  }

  const handleConfirmDelete = async (noteId: number) => {
    setDeleting(true)
    try {
      const response = await fetch(`/api/notes/${noteId}`, {method: 'DELETE',})

      if (response.ok) {
        setNotes(notes.filter(n => n.id !== noteId));
        setDeleteOpen(false);
        setNoteToDelete(null);
      } else {
        alert('Error deleting note')
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Error deleting note')
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteNote = async (note: Note) => {
    setNoteToDelete(note);
    setDeleteOpen(true);
  }

  const handleEditNote = (note: Note) => {
    setNoteToEdit(note);
    setEditOpen(true);  
  };

  const handleGenerateAITags = async (noteId: number) => {
    setAiLoading(noteId);
    try {
      const note = notes.find(n => n.id === noteId);
      if (!note) return;

      const response = await fetch('/api/ai/suggest-tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: note.id,
          title: note.title,
          body: note.body
        })
      })

      const result = await response.json();

      if (result.success) {
        const updatedNote = { ...note, tags: result.data.tags };

        await fetch(`/api/notes/${noteId}`, {
          method: 'PUT',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify(updatedNote)
        });

        setNotes(notes.map(n => n.id === noteId ? updatedNote : n));

        alert(`Generated tags: ${result.data.tags.join(', ')}`);
      }
    } catch (error) {
      console.error('Error generating AI tags:', error);
      alert('Failed to generate AI tags');
    } finally {
      setAiLoading(null)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f8f9fa',
        py: 4,
        px: 10,
        color: '#0f172a'
      }}
    >
      <Container maxWidth="xl">
        {/* header section */}
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 3,
              letterSpacing: '-1px',
              fontSize: { xs: '3rem', md: '4rem', lg: '4.5rem' },
              lineHeight: 1.1,
              fontFamily: 'var(--font-lexend)'
            }}
          >
            Smart
            <Box component="span" sx={{ color: '#f87171' }}>
              Note
            </Box>
            {' '}AI
          </Typography>
        </Box>

        {/* main section */}
        <Box
          sx={{
            display: 'flex',
            gap: 6,
            flexDirection: { xs: 'column', lg: 'row' },
            alignItems: { xs: 'stretch', lg: 'flex-start' },
            // fontFamily: 'var(--font-inter)'
          }}
        >
          {/* create note section */}
          <CreateNoteForm onSubmit={handleAddNote} />

          {/* List note section */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h5"
              sx={{
                mb: 2,
                fontWeight: 600,
                color: '#333',
              }}
            >
              Your Notes
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
                    <NoteEmpty />
                  )}
                  {notes.map((note, index) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      index={index}
                      onGenerateAITags={handleGenerateAITags}
                      onEditNote={handleEditNote}
                      onDeleteNote={handleDeleteNote}
                      aiLoading={aiLoading}
                    />
                  ))}
                </>
              )
              }
            </Stack>
          </Box>
        </Box>
      </Container>
      {/* revisao: dialog style */}
      <EditNoteModal
        note={noteToEdit}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={handleSaveEditedNote}
        saving={savingEditedNote}
      />
      <DeleteNoteModal
        note={noteToDelete}
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setNoteToDelete(null);
        }}
        onConfirmDelete={handleConfirmDelete}
        deleting={deleting}
      />
    </Box>
  );
}
