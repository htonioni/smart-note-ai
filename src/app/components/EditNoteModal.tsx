import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
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
import { Note } from '../../types/note';


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

    useEffect(() => {
        if (note) {
            setEditTitle(note.title);
            setEditBody(note.body);
            setEditTags(note.tags || [])
            setEditTagInput('');
        }
    }, [note])


    // Tag management functions
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

        const updatedNote: Note = {
            ...note,
            title: editTitle.trim(),
            body: editBody.trim(),
            tags: editTags
        };

        onSave(updatedNote);
    };

    const handleClose = () => {
        setEditTitle('');
        setEditBody('');
        setEditTags([]);
        setEditTagInput('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Edit Note</DialogTitle>
            <DialogContent>
                <TextField
                    label='Title'
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    fullWidth
                    margin='dense'
                />
                <TextField
                    label='Content'
                    value={editBody}
                    onChange={e => setEditBody(e.target.value)}
                    fullWidth
                    margin='dense'
                    multiline
                    rows={4}
                />

                {/* tags Section */}
                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                        Tags
                    </Typography>

                    {/* Display existing tags as deletable chips */}
                    {editTags.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                {editTags.map((tag, index) => (
                                    <Chip
                                        key={index}
                                        label={tag}
                                        onDelete={() => handleRemoveTag(tag)}
                                        size="small"
                                        sx={{
                                            bgcolor: '#e3f2fd',
                                            color: '#1976d2',
                                            fontSize: '0.75rem',
                                            mb: 0.5,
                                            '& .MuiChip-deleteIcon': {
                                                color: '#1976d2',
                                                '&:hover': {
                                                    color: '#d32f2f'
                                                }
                                            }
                                        }}
                                    />
                                ))}
                            </Stack>
                        </Box>
                    )}
                    {/* input for new tags */}
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
                        margin='dense'
                        size="small"
                        helperText="Press Enter or comma to add tag"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 1
                            }
                        }}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    variant='contained'
                    disabled={saving}
                    endIcon={saving ? <CircularProgress size={20} /> : null}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default EditNoteModal;