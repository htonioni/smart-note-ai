import { Note } from "@/types/note";
import { useEffect } from "react";

export const useNotesLoading = (
    setNotes: (notes: Note[]) => void,
    setFilteredNotes: (notes: Note[]) => void,
    setIsLoadingNotes: (loading: boolean) => void
) => {
    useEffect(() => {
        const loadInitialNotes = async () => {
            try {
                const response = await fetch('/api/notes');
                const data = await response.json();
                setNotes(data);
                setFilteredNotes(data);
            } catch (error) {
                console.error('Failed to load notes:', error);
            } finally {
                setIsLoadingNotes(false);
            }
        };

        loadInitialNotes();
    }, [setNotes, setFilteredNotes, setIsLoadingNotes]);
};