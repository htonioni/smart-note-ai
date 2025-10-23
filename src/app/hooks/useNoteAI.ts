import { useState } from 'react';
import { Note } from '@/types/note';
import { Toast, showToast } from '@/utils/toastUtils';

export const useNoteAI = (
  notes: Note[],
  setNotes: (notes: Note[]) => void,
  setToast: (toast: Toast) => void
) => {
  const [isAiGeneratingNoteIds, setIsAiGeneratingNoteIds] = useState<Set<number>>(new Set());
  const [isDeletingSummaryNoteIds, setIsDeletingSummaryNoteIds] = useState<Set<number>>(new Set());

  const handleGenerateAIForNote = async (noteId: number) => {
    setIsAiGeneratingNoteIds(prev => new Set([...prev, noteId]));
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
        const updatedNotes = notes.map(n => n.id === noteId ? updatedNote : n);
        setNotes(updatedNotes);
        showToast('AI summary generated!', 'success', setToast)
      }
    } catch (error) {
      console.error('Error generating AI tags:', error);
      showToast('Failed to generate AI content', 'error', setToast)
    } finally {
      setIsAiGeneratingNoteIds(prev => {
        const updated = new Set(prev);
        updated.delete(noteId);
        return updated;
      });
    }
  };

  const handleDeleteNoteSummary = async (noteId: number) => {
    setIsDeletingSummaryNoteIds(prev => new Set([...prev, noteId]));
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
        const updatedNotes = notes.map(n => n.id === noteId ? updatedNote : n);
        setNotes(updatedNotes);
      } else {
        showToast('Failed to delete note summary', 'error', setToast)
      }
    } catch (error) {
      console.error('Error deleting summary:', error);
      showToast('Failed to delete note summary', 'error', setToast)
    } finally {
      setIsDeletingSummaryNoteIds(prev => {
        const updated = new Set(prev);
        updated.delete(noteId);
        return updated;
      });
    }
  };

  return {
    isAiGeneratingNoteIds,
    isDeletingSummaryNoteIds,
    handleGenerateAIForNote,
    handleDeleteNoteSummary
  };
};