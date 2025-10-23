'use client';
import { useState } from 'react';
import { Note } from '@/types/note'
import { Box, Stack, Typography, Container } from '@mui/material';
import NoteEmpty from './components/NoteEmpty';
import CreateNoteForm from './components/CreateNoteForm'
import NoteCard from './components/NoteCard';
import EditNoteModal from './components/EditNoteModal';
import DeleteNoteModal from './components/DeleteNoteModal';
import SearchBar from './components/SearchBar';
import { NoteCardSkeleton } from './components/NoteCardSkeleton'
import ScrollToTop from './components/ScrollToTop';
import { ToastNotification } from './components/ToastNotification';
import { Toast } from '@/utils/toastUtils'
import Image from 'next/image'
import Underline from '@/assets/underline.svg';
import { useNoteCreation } from './hooks/useNoteCreation';
import { useNotesLoading } from './hooks/useNotesLoading';
import { useNoteSearch } from './hooks/useNoteSearch';
import { useNoteEditing } from './hooks/useNoteEditing';
import { useNoteDeletion } from './hooks/useNoteDeletion';
import { useNoteAI } from './hooks/useNoteAI';

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([])
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);
  const [selectedNoteForDeletion, setSelectedNoteForDeletion] = useState<Note | null>(null);
  const [selectedNoteForEditing, setSelectedNoteForEditing] = useState<Note | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('')
  const [toast, setToast] = useState<Toast>({ open: false, message: '', severity: 'success' })

  const {
    isCreatingNote,
    handleCreateNote
  } = useNoteCreation(
    notes,
    setNotes,
    setToast
  );

  const {
    isSavingNote,
    handleSaveNoteChanges,
    handleRequestNoteEdit
  } = useNoteEditing(
    notes,
    setNotes,
    setSelectedNoteForEditing,
    setIsEditModalOpen,
    setToast
  );

  const {
    isDeletingNote,
    handleRequestNoteDeletion,
    handleConfirmNoteDeletion
  } = useNoteDeletion(
    notes,
    setNotes,
    setSelectedNoteForDeletion,
    setIsDeleteModalOpen,
    setToast
  )

  const {
    isAiGeneratingNoteIds,
    isDeletingSummaryNoteIds,
    handleGenerateAIForNote,
    handleDeleteNoteSummary
  } = useNoteAI(
    notes,
    setNotes,
    setToast
  );

  useNotesLoading(setNotes, setFilteredNotes, setIsLoadingNotes, setToast);
  useNoteSearch(notes, searchQuery, setFilteredNotes);

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
                        key={`${note.id}-${note.updatedAt}`}
                        note={note}
                        index={index}
                        onGenerateAI={handleGenerateAIForNote}
                        onEditNote={handleRequestNoteEdit}
                        onDeleteNote={handleRequestNoteDeletion}
                        onDeleteNoteSummary={handleDeleteNoteSummary}
                        aiLoading={isAiGeneratingNoteIds}
                        summaryDeleteLoading={isDeletingSummaryNoteIds}
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
      <ToastNotification
        toast={toast}
        onClose={() => setToast({ ...toast, open: false })}
      />
      <ScrollToTop />
    </Box>
  );
}
