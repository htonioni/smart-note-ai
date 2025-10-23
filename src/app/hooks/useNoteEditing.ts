import { useState } from 'react';
import { Note } from '@/types/note';
import { Toast, showToast } from '@/utils/toastUtils';

export const useNoteEditing = (
  notes: Note[],
  setNotes: (notes: Note[]) => void,
  setIsEditModalOpen: (open: boolean) => void,
  setToast: (toast: Toast) => void
) => {
  const [isSavingNote, setIsSavingNote] = useState(false);

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
        showToast('Failed to update note', 'error', setToast)
      }
    } catch (error) {
      console.error('Error updating note:', error);
      showToast('Error updating note', 'error', setToast);
    } finally {
      setIsSavingNote(false);
    }
  };

  return {
    isSavingNote,
    handleSaveNoteChanges
  };
};