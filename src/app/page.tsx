'use client';
import { useState, useEffect } from 'react';
import { Note } from '../types/note'
import { Box, Stack, Typography, Container } from '@mui/material';
import NoteEmpty from './components/NoteEmpty';
import CreateNoteForm from './components/CreateNoteForm'
import NoteCard from './components/NoteCard';
import EditNoteModal from './components/EditNoteModal';
import DeleteNoteModal from './components/DeleteNoteModal';
import SearchBar from './components/SearchBar';
import NoteCardSkeleton from './components/NoteCardSkeleton';
import ScrollToTop from './components/ScrollToTop';
import Image from 'next/image'
import Underline from '../assets/underline.svg';

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [isAiGeneratingForNoteId, setIsAiGeneratingForNoteId] = useState<number | null>(null);
  const [isDeletingSummaryForNoteId, setIsDeletingSummaryForNoteId] = useState<number | null>(null);

  const [selectedNoteForDeletion, setSelectedNoteForDeletion] = useState<Note | null>(null);
  const [selectedNoteForEditing, setSelectedNoteForEditing] = useState<Note | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeletingNote, setIsDeletingNote] = useState(false);
  const [isSavingNote, setIsSavingNote] = useState(false);

  const [searchQuery, setSearchQuery] = useState('')
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([])

  const loadInitialNotes = async () => {
    try {
      const response = await fetch('/api/notes');
      const data = await response.json();
      setNotes(data);
      setFilteredNotes(data);
    } catch (error) {
      console.error('Failed to load notes:', error);
    } finally {
      setIsLoadingNotes(false);
    }
  };

  useEffect(() => {
    loadInitialNotes();
  }, []);

  const filterNotesByQuery = () => {
    if (!searchQuery.trim()) {
      setFilteredNotes(notes);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = notes.filter(note => {
      const titleMatch = note.title.toLowerCase().includes(query);
      const bodyMatch = note.body.toLowerCase().includes(query);
      const tagMatch = note.tags?.some(tag => tag.toLowerCase().includes(query)) || false;
      const summaryMatch = note.summary?.toLowerCase().includes(query) || false;

      return titleMatch || bodyMatch || tagMatch || summaryMatch;
    });

    setFilteredNotes(filtered);
  };

  useEffect(() => {
    filterNotesByQuery();
  }, [searchQuery, notes]);

  const handleCreateNote = async (title: string, body: string, aiEnabled: boolean) => {
    setIsCreatingNote(true);

    let generatedTags = null;
    let generatedSummary = null;

    if (aiEnabled) {
      const aiContent = await generateAIContentForNote(title, body);
      generatedTags = aiContent.tags;
      generatedSummary = aiContent.summary;
    }

    try {
      const response = await fetch('/api/notes', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          body: body.trim(),
          tags: generatedTags,
          summary: generatedSummary,
        })
      });

      if (response.ok) {
        const newNote = await response.json();
        setNotes([newNote, ...notes]);
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

  const generateAIContentForNote = async (title: string, body: string) => {
    try {
      const aiResponse = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 0, title: title.trim(), body: body.trim() })
      });

      const result = await aiResponse.json();
      if (result.success) {
        return {
          tags: result.data.tags,
          summary: result.data.summary
        };
      }
    } catch (error) {
      console.error('AI generation failed:', error);
    }
    return { tags: null, summary: null };
  };



  const handleSaveNoteChanges = async (updatedNote: Note) => {
    setIsSavingNote(true);
    try {
      const response = await fetch(`/api/notes/${updatedNote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedNote),
      });

      if (response.ok) {
        const savedNote = await response.json();
        setNotes(notes.map(n => n.id === savedNote.id ? savedNote : n));
        setIsEditModalOpen(false);
      } else {
        alert('Error updating note');
      }
    } catch (error) {
      console.error('Error updating note:', error);
      alert('Error updating note');
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleConfirmNoteDeletion = async (noteId: number) => {
    setIsDeletingNote(true);
    try {
      const response = await fetch(`/api/notes/${noteId}`, { method: 'DELETE' });

      if (response.ok) {
        setNotes(notes.filter(n => n.id !== noteId));
        setIsDeleteModalOpen(false);
        setSelectedNoteForDeletion(null);
      } else {
        alert('Error deleting note');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Error deleting note');
    } finally {
      setIsDeletingNote(false);
    }
  };

  const handleRequestNoteDeletion = (note: Note) => {
    setSelectedNoteForDeletion(note);
    setIsDeleteModalOpen(true);
  };

  const handleRequestNoteEdit = (note: Note) => {
    setSelectedNoteForEditing(note);
    setIsEditModalOpen(true);
  };

  const handleGenerateAITagsForNote = async (noteId: number) => {
    setIsAiGeneratingForNoteId(noteId);
    try {
      const note = notes.find(n => n.id === noteId);
      if (!note) return;

      const response = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: note.id,
          title: note.title,
          body: note.body,
          summary: note.summary
        })
      });

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
      setIsAiGeneratingForNoteId(null);
    }
  };

  const handleDeleteNoteSummary = async (noteId: number) => {
    setIsDeletingSummaryForNoteId(noteId);
    try {
      const note = notes.find(n => n.id === noteId);
      if (!note) return;

      const updatedNote = { ...note, summary: null };

      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedNote),
      });

      if (response.ok) {
        setNotes(notes.map(n => n.id === noteId ? updatedNote : n));
      } else {
        alert('Error deleting summary');
      }
    } catch (error) {
      console.error('Error deleting summary:', error);
      alert('Error deleting summary');
    } finally {
      setIsDeletingSummaryForNoteId(null);
    }
  };

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
              fontFamily: 'var(--font-lexend)',
              position: 'relative'
            }}
          >
            Smart
            <Box
              component="span"
              sx={{
                color: '#f87171',
                position: 'relative',
                display: 'inline-block'
              }}
            >
              Note
              <Image
                src={Underline}
                alt=""
                width={100}
                height={20}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: '85%',
                  width: '100%',
                  height: 'auto',
                }}
              />
            </Box>
            {' '}AI
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 6,
            flexDirection: { xs: 'column', lg: 'row' },
            alignItems: { xs: 'stretch', lg: 'flex-start' },
          }}
        >
          <CreateNoteForm onSubmit={handleCreateNote} isLoading={isCreatingNote} />

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
              {isLoadingNotes ? (
                <>
                  <NoteCardSkeleton index={0} />
                  <NoteCardSkeleton index={1} />
                  <NoteCardSkeleton index={2} />
                  <NoteCardSkeleton index={3} />
                </>
              ) : (
                <>
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
              )}
            </Stack>
          </Box>
        </Box>
      </Container>
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
      <ScrollToTop />
    </Box>
  );
}
