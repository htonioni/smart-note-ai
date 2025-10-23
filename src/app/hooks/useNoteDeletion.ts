import { useState } from 'react';
import { Note } from '@/types/note';
import { Toast, showToast } from '@/utils/toastUtils';

export const useNoteDeletion = (
  notes: Note[],
  setNotes: (notes: Note[]) => void,
  setSelectedNoteForDeletion: (note: Note | null) => void,
  setIsDeleteModalOpen: (open: boolean) => void,
  setToast: (toast: Toast) => void
) => {
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
        setNotes(notes.filter(n => n.id !== noteId));
        setIsDeleteModalOpen(false);
        setSelectedNoteForDeletion(null);
        showToast('Note deleted!', 'success', setToast)
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
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
          showToast('Failed to delete note. Please try again.', 'error', setToast);
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