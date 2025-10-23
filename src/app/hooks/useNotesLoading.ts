import { useEffect } from "react";
import { useNotesContext } from '@/app/context/NotesContext';

export const useNotesLoading = () => {
    const { setNotes, setFilteredNotes, setIsLoadingNotes, setToast } = useNotesContext();
    useEffect(() => {
        const loadInitialNotes = async () => {
            try {
                const response = await fetch('/api/notes');
                const result = await response.json();

                if (result.success) {
                    setNotes(result.data);
                    setFilteredNotes(result.data);
                } else {
                    throw new Error(result.error || 'Failed to load notes');
                }
            } catch (error) {
                console.error('Failed to load notes:', error);
                const errorMessage = error instanceof Error && error.message.includes('fetch')
                    ? 'Failed to load your notes. Please check your internet connection and try refreshing the page.'
                    : 'Failed to load your notes. Please try refreshing the page.';
                setToast({ open: true, message: errorMessage, severity: 'error' });
            } finally {
                setIsLoadingNotes(false);
            }
        };

        loadInitialNotes();
    }, [setNotes, setFilteredNotes, setIsLoadingNotes, setToast]);
};
