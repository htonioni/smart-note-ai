import { useState } from 'react';
import { Note } from '@/app/types/note';
import { showToast } from '@/utils/toastUtils';
import { useNotesContext } from '@/app/context/NotesContext';

export const useNoteEditing = () => {
  const { notes, setNotes, setSelectedNoteForEditing, setIsEditModalOpen, setToast } = useNotesContext();
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
        const result = await response.json();
        if (result.success) {
          setNotes(notes.map(n => n.id === result.data.id ? result.data : n));
          setIsEditModalOpen(false);
          showToast('Note updated!', 'success', setToast)
        } else {
          showToast(result.error || 'Failed to update note.', 'error', setToast);
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        const serverMessage = errorData?.error || 'Failed to update note.';
        console.warn('Update note failed:', serverMessage);

        if (response.status === 404) {
          showToast('Note not found. It may have been deleted.', 'error', setToast);
        } else if (response.status === 500) {
          showToast('Server error occurred while updating note. Please try again.', 'error', setToast);
        } else if (response.status >= 500) {
          showToast('Service temporarily unavailable. Please try again in a moment.', 'error', setToast);
        } else {
          showToast(serverMessage, 'error', setToast);
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
