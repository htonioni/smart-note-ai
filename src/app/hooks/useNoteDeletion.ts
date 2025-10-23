import { useState } from 'react';
import { Note } from '@/app/types/note';
import { showToast } from '@/utils/toastUtils';
import { useNotesContext } from '@/app/context/NotesContext';

export const useNoteDeletion = () => {
  const { notes, setNotes, setSelectedNoteForDeletion, setIsDeleteModalOpen, setToast } = useNotesContext();
  const [isDeletingNote, setIsDeletingNote] = useState(false);

  const handleRequestNoteDeletion = (note: Note) => {
    setSelectedNoteForDeletion(note);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmNoteDeletion = async (noteId: number) => {
    setIsDeletingNote(true);
    try {
      const response = await fetch(`/api/notes/${noteId}`, { method: 'DELETE' });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setNotes(notes.filter(n => n.id !== noteId));
          setIsDeleteModalOpen(false);
          setSelectedNoteForDeletion(null);
          showToast('Note deleted!', 'success', setToast)
        } else {
          showToast(result.error || 'Failed to delete note.', 'error', setToast);
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        const serverMessage = errorData?.error || 'Failed to delete note.';
        console.warn('Delete note failed:', serverMessage);

        if (response.status === 404) {
          showToast('Note not found. It may have already been deleted.', 'error', setToast);
          setNotes(notes.filter(n => n.id !== noteId));
          setIsDeleteModalOpen(false);
          setSelectedNoteForDeletion(null);
        } else if (response.status === 500) {
          showToast('Server error occurred while deleting note. Please try again.', 'error', setToast);
        } else if (response.status >= 500) {
          showToast('Service temporarily unavailable. Please try again in a moment.', 'error', setToast);
        } else {
          showToast(serverMessage, 'error', setToast);
        }
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        showToast('Connection failed. Please check your internet and try again.', 'error', setToast);
      } else {
        showToast('An unexpected error occurred while deleting your note.', 'error', setToast);
      }
    } finally {
      setIsDeletingNote(false);
    }
  };

  return {
    isDeletingNote,
    handleRequestNoteDeletion,
    handleConfirmNoteDeletion
  };
};
