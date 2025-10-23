import { useEffect } from 'react';
import { Note } from '@/types/note';
import { parseDateSearch, isNoteInDateRange } from '@/utils/dateSearchUtils';

export const useNoteSearch = (
    notes: Note[],
    searchQuery: string,
    setFilteredNotes: (notes: Note[]) => void
) => {
    useEffect(() => {
        const filterNotesByQuery = () => {
            if (!searchQuery.trim()) {
                setFilteredNotes(notes);
                return;
            }

            const query = searchQuery.toLowerCase();
            const dateSearchResult = parseDateSearch(query);

            const filtered = notes.filter(note => {
                if (dateSearchResult.isDateSearch && dateSearchResult.dateRange) {
                    return isNoteInDateRange(note.updatedAt, dateSearchResult.dateRange);
                }

                // otherwise regular search
                const titleMatch = note.title.toLowerCase().includes(query);
                const bodyMatch = note.body.toLowerCase().includes(query);
                const tagMatch = note.tags?.some(tag => tag.toLowerCase().includes(query)) || false;
                const summaryMatch = note.summary?.toLowerCase().includes(query) || false;

                return titleMatch || bodyMatch || tagMatch || summaryMatch;
            });

            setFilteredNotes(filtered);
        };

        filterNotesByQuery();
    }, [searchQuery, notes, setFilteredNotes]);
}