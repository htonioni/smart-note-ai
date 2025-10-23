import { Toast, showToast } from '@/utils/toastUtils';
import { Note } from '@/types/note';
import { AIContent } from '@/types/ai';
import { useState } from "react";

export const useNoteCreation = (
    notes: Note[],
    setNotes: (notes: Note[]) => void,
    setToast: (toast: Toast) => void
) => {
    const [isCreatingNote, setIsCreatingNote] = useState(false);

    const generateAIContentForNote = async (title: string, body: string): Promise<AIContent> => {
        try {
          const aiResponse = await fetch('/api/ai/generate-content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: 0, title: title.trim(), body: body.trim() })
          });
    
          const result = await aiResponse.json();
          if (result.success) {
            return {
              tags: result.data.tags,
              summary: result.data.summary
            };
          } else {
            showToast(result.error || 'AI content generation failed', 'warning', setToast);
            return { tags: null, summary: null };
          }
        } catch (error) {
          console.error('AI generation failed:', error);
          showToast('AI service temporarily unavailable. Note will be saved without AI content.', 'warning', setToast);
          return { tags: null, summary: null };
        }
      };

    const handleCreateNote = async (
        title: string,
        body: string,
        aiEnabled: boolean
    ) => {
        setIsCreatingNote(true);

        let generatedTags = null;
        let generatedSummary = null;

        if (aiEnabled) {
            const aiContent = await generateAIContentForNote(title, body);
            generatedTags = aiContent.tags;
            generatedSummary = aiContent.summary;
        }

        try {
            const response = await fetch('/api/notes', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title.trim(),
                    body: body.trim(),
                    tags: generatedTags,
                    summary: generatedSummary,
                })
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    setNotes([result.data, ...notes]);
                    showToast('Note Created successfully!', "success", setToast)
                } else {
                    showToast(result.error || 'Failed to create note', 'error', setToast);
                }
            } else {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                const errorMessage = errorData.error || 'Failed to create note';

                if (response.status === 500) {
                    showToast('Server error occurred while creating note. Please try again.', 'error', setToast);
                } else if (response.status === 400) {
                    showToast('Invalid note data. Please check your input and try again.', 'error', setToast);
                } else if (response.status >= 500) {
                    showToast('Service temporarily unavailable. Please try again in a moment.', 'error', setToast);
                } else {
                    showToast(errorMessage, 'error', setToast);
                }
            }
        } catch (error) {
            console.error('Error creating note: ', error);
            if (error instanceof TypeError && error.message.includes('fetch')) {
                showToast('Connection failed. Please check your internet and try again.', 'error', setToast);
            } else {
                showToast('An unexpected error occurred while creating your note.', 'error', setToast);
            }
        } finally {
            setIsCreatingNote(false);
        }
    };

    return {
        isCreatingNote,
        handleCreateNote
    }

}