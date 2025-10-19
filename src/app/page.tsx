'use client';
import { useState, useEffect } from 'react';
import { Note } from '../types/note'
import { Box, Stack, Typography, Skeleton, Container } from '@mui/material';
import NoteEmpty from './components/NoteEmpty';
import CreateNoteForm from './components/CreateNoteForm'
import NoteCard from './components/NoteCard';
import EditNoteModal from './components/EditNoteModal';
import DeleteNoteModal from './components/DeleteNoteModal';
import SearchBar from './components/SearchBar';
import NoteCardSkeleton from './components/NoteCardSkeleton';

export default function Home() {
  // core notes
  const [notes, setNotes] = useState<Note[]>([]);

  // fetching data
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);
  const [isAiGeneratingForNoteId, setIsAiGeneratingForNoteId] = useState<number | null>(null);
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [isDeletingSummaryForNoteId, setIsDeletingSummaryForNoteId] = useState<number | null>(null);

  // modals state management
  const [selectedNoteForDeletion, setSelectedNoteForDeletion] = useState<Note | null>(null);
  const [selectedNoteForEditing, setSelectedNoteForEditing] = useState<Note | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeletingNote, setIsDeletingNote] = useState(false);
  const [isSavingNote, setIsSavingNote] = useState(false);

  // seachbar states
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([])

  // load all notes when component mounts
  useEffect(() => {
    fetch('/api/notes')
      .then(res => res.json())
      .then(data => {
        setNotes(data)
        setFilteredNotes(data) // filtered notes
        setIsLoadingNotes(false)
      });
  }, []);

  // searchbar
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredNotes(notes);
      return;
    }

    const query = searchQuery.toLowerCase()

    const filtered = notes.filter(note => {
      const titleMatch = note.title.toLowerCase().includes(query);
      const bodyMatch = note.body.toLowerCase().includes(query);
      const tagMatch = note.tags?.some(tag =>
        tag.toLowerCase().includes(query)
      ) || false
      const summaryMatch = note.summary?.toLowerCase().includes(query) || false

      return titleMatch || bodyMatch || tagMatch || summaryMatch
    })

    setFilteredNotes(filtered);
  }, [searchQuery, notes])

  // Handle note creation with optional AI tag generation
  // revisao: adicionar um loading ao botao de enviar
  const handleCreateNote = async (
    title: string,
    body: string,
    aiEnabled: boolean
  ) => {
    setIsCreatingNote(true);

    let generatedTags = null
    let generatedSummary = null

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

        const aiGenerationResult = await aiResponse.json();
        console.log("This is the result IA: ", aiGenerationResult)

        if (aiGenerationResult.success) {
          generatedTags = aiGenerationResult.data.tags;
          generatedSummary = aiGenerationResult.data.summary;
        }
      } catch (error) {
        console.error('AI generation failed:', error);
      }
    }

    try {
      const noteCreationResponse = await fetch('/api/notes', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          body: body.trim(),
          tags: generatedTags,
          summary: generatedSummary,
        })
      })

      if (noteCreationResponse.ok) {
        const newNote = await noteCreationResponse.json();
        setNotes([...notes, newNote]);
      } else {
        alert('Error on add note.')
      }
    } catch (error) {
      console.error('Error creating note: ', error);
      alert('Error creating note.')
    } finally {
      setIsCreatingNote(false);
    }
  };

  const handleSaveNoteChanges = async (updatedNote: Note) => {
    setIsSavingNote(true)
    try {
      const response = await fetch(`/api/notes/${updatedNote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedNote),
      })

      if (response.ok) {
        const savedNote = await response.json();
        setNotes(notes.map(n => n.id === savedNote.id ? savedNote : n));
        setIsEditModalOpen(false);
      } else {
        alert('Error updating note');
      }
    } catch (error) {
      console.error('Error updating note:', error)
      alert('Error updating note')
    } finally {
      setIsSavingNote(false)
    }
  }

  const handleConfirmNoteDeletion = async (noteId: number) => {
    setIsDeletingNote(true)
    try {
      const response = await fetch(`/api/notes/${noteId}`, { method: 'DELETE', })

      if (response.ok) {
        setNotes(notes.filter(n => n.id !== noteId));
        setIsDeleteModalOpen(false);
        setSelectedNoteForDeletion(null);
      } else {
        alert('Error deleting note')
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Error deleting note')
    } finally {
      setIsDeletingNote(false)
    }
  }

  const handleRequestNoteDeletion = async (note: Note) => {
    setSelectedNoteForDeletion(note);
    setIsDeleteModalOpen(true);
  }

  const handleRequestNoteEdit = (note: Note) => {
    setSelectedNoteForEditing(note);
    setIsEditModalOpen(true);
  };

  const handleGenerateAITagsForNote = async (noteId: number) => {
    setIsAiGeneratingForNoteId(noteId);
    try {
      const note = notes.find(n => n.id === noteId);
      if (!note) return;

      const response = await fetch('/api/ai/suggest-tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: note.id,
          title: note.title,
          body: note.body,
          summary: note.summary
        })
      })

      const result = await response.json();

      if (result.success) {
        const updatedNote = { ...note, tags: result.data.tags, summary: result.data.summary };

        await fetch(`/api/notes/${noteId}`, {
          method: 'PUT',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify(updatedNote)
        });

        setNotes(notes.map(n => n.id === noteId ? updatedNote : n));
      }
    } catch (error) {
      console.error('Error generating AI tags:', error);
      alert('Failed to generate AI tags');
    } finally {
      setIsAiGeneratingForNoteId(null)
    }
  }

  // revisao: adicionar loading para deletion
  const handleDeleteNoteSummary = async (noteId: number) => {
    setIsDeletingSummaryForNoteId(noteId);
    try {
      const note = notes.find(n => n.id === noteId);
      if (!note) return;

      const updatedNote = { ...note, summary: null };

      // update in db
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedNote),
      })

      if (response.ok) {
        // update local state
        setNotes(notes.map(n => n.id === noteId ? updatedNote : n));
      } else {
        alert('Error deleting summary');
      }

    } catch (error) {
      console.error('Error deleting summary');
      alert('Error deleting summary');
    } finally {
      setIsDeletingSummaryForNoteId(null);
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
          <CreateNoteForm onSubmit={handleCreateNote} isLoading={isCreatingNote} />

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
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                resultsCount={filteredNotes.length}
              />
              {/* guard case */}
              {isLoadingNotes ? (
                <>
                  <NoteCardSkeleton index={0} />
                  <NoteCardSkeleton index={1} />
                  <NoteCardSkeleton index={2} />
                </>
              ) : (
                <>
                  {/* conditional rendering */}
                  {filteredNotes.length === 0 && searchQuery.trim() ? (
                    <Box sx={{
                      textAlign: 'center',
                      py: 4,
                      color: '#64748b'
                    }}>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        No notes found
                      </Typography>
                      <Typography variant="body2">
                        Try adjusting your search terms
                      </Typography>
                    </Box>
                  ) : filteredNotes.length === 0 ? (
                    <NoteEmpty />
                  ) : (
                    filteredNotes.map((note, index) => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        index={index}
                        onGenerateAITags={handleGenerateAITagsForNote}
                        onEditNote={handleRequestNoteEdit}
                        onDeleteNote={handleRequestNoteDeletion}
                        onDeleteNoteSummary={handleDeleteNoteSummary}
                        aiLoading={isAiGeneratingForNoteId}
                        summaryDeleteLoading={isDeletingSummaryForNoteId}
                      />
                    ))
                  )}
                </>
              )
              }
            </Stack>
          </Box>
        </Box>
      </Container>
      {/* revisao: dialog style */}
      <EditNoteModal
        note={selectedNoteForEditing}
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveNoteChanges}
        saving={isSavingNote}
      />
      <DeleteNoteModal
        note={selectedNoteForDeletion}
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedNoteForDeletion(null);
        }}
        onConfirmDelete={handleConfirmNoteDeletion}
        deleting={isDeletingNote}
      />
    </Box>
  );
}
