import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    Stack,
    Chip,
    CircularProgress
} from '@mui/material';
import { Note } from '@/types/note';


interface EditNoteModalProps {
    open: boolean;
    note: Note | null;
    onClose: () => void;
    onSave: (updatedNote: Note) => void;
    saving?: boolean;
}

const EditNoteModal = ({
    open,
    note,
    onClose,
    onSave,
    saving
}: EditNoteModalProps) => {

    const [editTitle, setEditTitle] = useState('');
    const [editBody, setEditBody] = useState('');
    const [editTags, setEditTags] = useState<string[]>([]);
    const [editTagInput, setEditTagInput] = useState('');
    const [touchedTitle, setTouchedTitle] = useState(false);
    const [touchedBody, setTouchedBody] = useState(false);

    useEffect(() => {
        if (note && open) {
            setEditTitle(note.title);
            setEditBody(note.body);
            setEditTags(note.tags || []);
            setEditTagInput('');
            setTouchedTitle(false);
            setTouchedBody(false);
        }
    }, [note, open])


    const handleAddTag = (tagToAdd: string) => {
        const trimmedTag = tagToAdd.trim();
        if (trimmedTag && !editTags.includes(trimmedTag)) {
            setEditTags([...editTags, trimmedTag]);
        }
        setEditTagInput('');
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setEditTags(editTags.filter(tag => tag !== tagToRemove));
    };

    const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            handleAddTag(editTagInput);
        }
    };

    const handleSave = () => {
        if (!note) return;

        // simple guard: don't allow empty title/body
        if (editTitle.trim() === '' || editBody.trim() === '') {
            setTouchedTitle(true);
            setTouchedBody(true);
            return;
        }

        const updatedNote: Note = {
            ...note,
            title: editTitle.trim(),
            body: editBody.trim(),
            tags: editTags
        };

        onSave(updatedNote);
    };

    const handleClose = () => {
        onClose();
        setTimeout(() => {
            setEditTitle('');
            setEditBody('');
            setEditTags([]);
            setEditTagInput('');
            setTouchedTitle(false);
            setTouchedBody(false);
        }, 100);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: 3,
                        margin: 2,
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                        border: '1px solid #f1f5f9',
                    }
                }
            }}
            sx={{
                '& .MuiBackdrop-root': {
                    backgroundColor: 'rgba(15, 23, 42, 0.4)',
                }
            }}
        >
            <DialogContent sx={{
                px: 3
            }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        color: '#0f172a',
                        pb: 2,
                    }}>
                    Edit Note
                </Typography>

                <Stack spacing={3}>
                    <TextField
                        label='Title'
                        value={editTitle}
                        onChange={(e) => {
                            if (e.target.value.length <= 60) {
                                setEditTitle(e.target.value)
                            }
                        }}
                        helperText={
                            touchedTitle && editTitle.trim() === ''
                                ? "This field can't be empty"
                                : `${editTitle.length}/60 characters`
                        }
                        onBlur={() => setTouchedTitle(true)}
                        fullWidth
                        variant="outlined"
                        error={touchedTitle && editTitle.trim() === ''}
                        sx={{
                            '& .MuiOutlinedInput-root': { borderRadius: 2 }
                        }}
                    />

                    <TextField
                        label='Content'
                        value={editBody}
                        onChange={(e) => {
                            if (e.target.value.length <= 1500) {
                                setEditBody(e.target.value)
                            }
                        }}
                        onBlur={() => setTouchedBody(true)}
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        error={touchedBody && editBody.trim() === ''}
                        helperText={
                            touchedBody && editBody.trim() === ''
                                ? "This field can't be empty"
                                : `${editBody.length}/1,500 characters`
                        }
                        sx={{
                            '& .MuiOutlinedInput-root': { borderRadius: 2 }
                        }}
                    />

                    <Box>
                        <Typography variant="body2" sx={{
                            color: '#64748b',
                            mb: 2,
                            fontWeight: 500
                        }}>
                            Tags
                        </Typography>

                        {editTags.length > 0 && (
                            <Box sx={{ mb: 2 }}>
                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                    {editTags.map((tag, index) => (
                                        <Chip
                                            key={index}
                                            label={tag}
                                            onDelete={() => handleRemoveTag(tag)}
                                            size="small"
                                            sx={{
                                                bgcolor: '#f8f9fa',
                                                color: '#0f172a',
                                                border: '1px solid #e2e8f0',
                                                fontSize: '0.8rem',
                                                mb: 0.5,
                                                '& .MuiChip-deleteIcon': {
                                                    color: '#64748b',
                                                    '&:hover': {
                                                        color: '#ef4444'
                                                    }
                                                }
                                            }}
                                        />
                                    ))}
                                </Stack>
                            </Box>
                        )}

                        <TextField
                            label='Add new tag'
                            value={editTagInput}
                            onChange={e => setEditTagInput(e.target.value)}
                            onKeyPress={handleTagInputKeyPress}
                            onBlur={() => {
                                if (editTagInput.trim()) {
                                    handleAddTag(editTagInput);
                                }
                            }}
                            fullWidth
                            size="small"
                            helperText="Press Enter or comma to add tag"
                            sx={{
                                '& .MuiOutlinedInput-root': { borderRadius: 2 }
                            }}
                        />
                    </Box>
                </Stack>
            </DialogContent>

            <DialogActions sx={{
                p: 3,
                pt: 1,
                gap: 2,
            }}>
                <Button
                    onClick={handleClose}
                    sx={{
                        borderRadius: 2,
                        px: 3,
                        py: 1,
                        color: '#64748b',
                        bgcolor: '#f8f9fa',
                        fontWeight: 500,
                        textTransform: 'none',
                        border: '1px solid #e2e8f0',
                        '&:hover': {
                            bgcolor: '#f1f5f9',
                        }
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={saving || editTitle.trim() === '' || editBody.trim() === ''}
                    endIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
                    sx={{
                        borderRadius: 2,
                        px: 3,
                        py: 1,
                        bgcolor: '#0f172a',
                        color: 'white',
                        fontWeight: 500,
                        textTransform: 'none',
                        '&:hover': {
                            bgcolor: '#1e293b',
                        },
                        '&:disabled': {
                            bgcolor: '#64748b',
                        }
                    }}
                >
                    {saving ? 'Saving...' : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default EditNoteModal;