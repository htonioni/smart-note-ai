'use client';
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
import Image from 'next/image'
import Underline from '@/assets/underline.svg';
import { NotesProvider } from '@/app/context/NotesContext';
import { useNoteCreation } from './hooks/useNoteCreation';
import { useNotesLoading } from './hooks/useNotesLoading';
import { useNoteSearch } from './hooks/useNoteSearch';
import { useNoteEditing } from './hooks/useNoteEditing';
import { useNoteDeletion } from './hooks/useNoteDeletion';
import { useNoteAI } from './hooks/useNoteAI';
import { useNotesContext } from './context/NotesContext';

function HomeContent() {
  const {
    filteredNotes,
    isLoadingNotes,
    selectedNoteForDeletion,
    selectedNoteForEditing,
    isDeleteModalOpen,
    isEditModalOpen,
    searchQuery,
    toast,
    setIsDeleteModalOpen,
    setIsEditModalOpen,
    setSearchQuery,
    setToast,
    setSelectedNoteForDeletion,
  } = useNotesContext();

  const {
    isCreatingNote,
    handleCreateNote
  } = useNoteCreation();

  const {
    isSavingNote,
    handleSaveNoteChanges,
    handleRequestNoteEdit
  } = useNoteEditing();

  const {
    isDeletingNote,
    handleRequestNoteDeletion,
    handleConfirmNoteDeletion
  } = useNoteDeletion();

  const {
    isAiGeneratingNoteIds,
    isDeletingSummaryNoteIds,
    handleGenerateAIForNote,
    handleDeleteNoteSummary
  } = useNoteAI();

  useNotesLoading();
  useNoteSearch();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f8f9fa',
        py: 4,
        px: { xs: 0.8, sm: 4, md: 6, lg: 10 },
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
              fontSize: { xs: '2.9rem', md: '4rem', lg: '4.5rem' },
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
                fontSize: { xs: '1.4rem', md: '1.5rem', lg: '1.6rem' },
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

export default function Home() {
  return (
    <NotesProvider>
      <HomeContent />
    </NotesProvider>
  );
}
