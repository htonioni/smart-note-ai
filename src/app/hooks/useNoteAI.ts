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

        const updateResponse = await fetch(`/api/notes/${noteId}`, {
          method: 'PUT',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify(updatedNote)
        });

        if (updateResponse.ok) {
          const updateResult = await updateResponse.json();
          if (updateResult.success) {
            const updatedNotes = notes.map(n => n.id === noteId ? updatedNote : n);
            setNotes(updatedNotes);
            showToast('AI summary generated!', 'success', setToast)
          } else {
            showToast('AI content generated but failed to save. Please try again.', 'warning', setToast);
          }
        } else {
          showToast('AI content generated but failed to save. Please try again.', 'warning', setToast);
        }
      } else {
        showToast(result.error || 'Failed to generate AI content', 'error', setToast)
      }
    } catch (error) {
      console.error('Error generating AI tags:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        showToast('AI generation failed due to connection issues. Please try again.', 'error', setToast);
      } else {
        showToast('AI service temporarily unavailable. Please try again later.', 'error', setToast);
      }
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
        const result = await response.json();
        if (result.success) {
          const updatedNotes = notes.map(n => n.id === noteId ? updatedNote : n);
          setNotes(updatedNotes);
          showToast('Summary removed successfully', 'success', setToast);
        } else {
          showToast(result.error || 'Failed to remove summary.', 'error', setToast);
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        const errorMessage = errorData.error || 'Failed to remove summary';

        if (response.status === 500) {
          showToast('Server error occurred while removing summary. Please try again.', 'error', setToast);
        } else if (response.status === 404) {
          showToast('Note not found. Please refresh and try again.', 'error', setToast);
        } else if (response.status >= 500) {
          showToast('Service temporarily unavailable. Please try again in a moment.', 'error', setToast);
        } else {
          showToast(errorMessage, 'error', setToast);
        }
      }
    } catch (error) {
      console.error('Error deleting summary:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        showToast('Connection failed while removing summary. Please check your internet and try again.', 'error', setToast);
      } else {
        showToast('Failed to remove summary. Please try again.', 'error', setToast);
      }
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