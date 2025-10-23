'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { Note } from '@/app/types/note'
import { Toast } from '@/utils/toastUtils';

interface NotesContextType {
    notes: Note[];
    filteredNotes: Note[];
    isLoadingNotes: boolean;
    selectedNoteForDeletion: Note | null;
    selectedNoteForEditing: Note | null;
    isDeleteModalOpen: boolean;
    isEditModalOpen: boolean;
    searchQuery: string;
    toast: Toast;
    setNotes: (notes: Note[]) => void;
    setFilteredNotes: (notes: Note[]) => void;
    setIsLoadingNotes: (loading: boolean) => void;
    setSelectedNoteForDeletion: (note: Note | null) => void;
    setSelectedNoteForEditing: (note: Note | null) => void;
    setIsDeleteModalOpen: (open: boolean) => void;
    setIsEditModalOpen: (open: boolean) => void;
    setSearchQuery: (query: string) => void;
    setToast: (toast: Toast) => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider = ({ children }: { children: ReactNode }) => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
    const [isLoadingNotes, setIsLoadingNotes] = useState(true);
    const [selectedNoteForDeletion, setSelectedNoteForDeletion] = useState<Note | null>(null);
    const [selectedNoteForEditing, setSelectedNoteForEditing] = useState<Note | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [toast, setToast] = useState<Toast>({ open: false, message: '', severity: 'success' });

    const value = {
        notes,
        filteredNotes,
        isLoadingNotes,
        selectedNoteForDeletion,
        selectedNoteForEditing,
        isDeleteModalOpen,
        isEditModalOpen,
        searchQuery,
        toast,
        setNotes,
        setFilteredNotes,
        setIsLoadingNotes,
        setSelectedNoteForDeletion,
        setSelectedNoteForEditing,
        setIsDeleteModalOpen,
        setIsEditModalOpen,
        setSearchQuery,
        setToast,
    };

    return (
        <NotesContext.Provider value={value}>
            {children}
        </NotesContext.Provider>
    );
};

export const useNotesContext = () => {
    const context = useContext(NotesContext);
    if (context === undefined) {
        throw new Error('useNotesContext must be used within a NotesProvider');
    }
    return context;
};