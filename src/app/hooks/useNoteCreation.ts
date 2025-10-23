import { Toast, showToast } from '@/utils/toastUtils';
import { Note } from '@/types/note';
import { AIContent } from '@/types/ai';
import { useState } from "react";

export const useNoteCreation = (
    notes: Note[],
    setNotes: (notes: Note[]) => void,
    generateAIContentForNote: (title: string, body: string) => Promise<AIContent>,
    setToast: (toast: Toast) => void
) => {
    const [isCreatingNote, setIsCreatingNote] = useState(false);

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
                const newNote = await response.json();
                setNotes([newNote, ...notes]);
                showToast('Note Created successfully!', "success", setToast)
            } else {
                showToast('Failed to create note', 'error', setToast)
            }
        } catch (error) {
            console.error('Error creating note: ', error);
            showToast('Error creating note', 'error', setToast);
        } finally {
            setIsCreatingNote(false);
        }
    };

    return {
        isCreatingNote,
        handleCreateNote
    }

}