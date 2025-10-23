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
        showToast('Failed to delete note', 'error', setToast)
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      showToast('Error deleting note', 'error', setToast);
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