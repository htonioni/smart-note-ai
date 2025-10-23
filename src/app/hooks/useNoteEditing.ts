import { useState } from 'react';
import { Note } from '@/types/note';
import { Toast, showToast } from '@/utils/toastUtils';

export const useNoteEditing = (
  notes: Note[],
  setNotes: (notes: Note[]) => void,
  setSelectedNoteForEditing: (note: Note | null) => void,
  setIsEditModalOpen: (open: boolean) => void,
  setToast: (toast: Toast) => void
) => {
  const [isSavingNote, setIsSavingNote] = useState(false);

  const handleRequestNoteEdit = (note: Note) => {
    setSelectedNoteForEditing(note);
    setIsEditModalOpen(true);
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
        showToast('Note updated!', 'success', setToast)
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));

        if (response.status === 404) {
          showToast('Note not found. It may have been deleted.', 'error', setToast);
        } else if (response.status === 500) {
          showToast('Server error occurred while updating note. Please try again.', 'error', setToast);
        } else if (response.status >= 500) {
          showToast('Service temporarily unavailable. Please try again in a moment.', 'error', setToast);
        } else {
          showToast('Failed to update note. Please try again.', 'error', setToast);
        }
      }
    } catch (error) {
      console.error('Error updating note:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        showToast('Connection failed. Please check your internet and try again.', 'error', setToast);
      } else {
        showToast('An unexpected error occurred while updating your note.', 'error', setToast);
      }
    } finally {
      setIsSavingNote(false);
    }
  };

  return {
    isSavingNote,
    handleSaveNoteChanges,
    handleRequestNoteEdit
  };
};