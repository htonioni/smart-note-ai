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
        if (note && open) {
            setEditTitle(note.title);
            setEditBody(note.body);
            setEditTags(note.tags || [])
            setEditTagInput('');
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
                {/* Custom Title */}
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
                        onChange={e => setEditTitle(e.target.value)}
                        fullWidth
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '& fieldset': {
                                    borderColor: '#e2e8f0'
                                },
                                '&:hover fieldset': {
                                    borderColor: '#cbd5e0',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#075985',
                                    borderWidth: 2
                                }
                            },
                            '& .MuiInputLabel-root': {
                                color: '#64748b',
                                '&.Mui-focused': {
                                    color: '#075985'
                                }
                            }
                        }}
                    />

                    <TextField
                        label='Content'
                        value={editBody}
                        onChange={e => setEditBody(e.target.value)}
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '& fieldset': {
                                    borderColor: '#e2e8f0'
                                },
                                '&:hover fieldset': {
                                    borderColor: '#cbd5e0',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#075985',
                                    borderWidth: 2
                                }
                            },
                            '& .MuiInputLabel-root': {
                                color: '#64748b',
                                '&.Mui-focused': {
                                    color: '#075985'
                                }
                            }
                        }}
                    />

                    {/* Clean Tags Section */}
                    <Box>
                        <Typography variant="body2" sx={{
                            color: '#64748b',
                            mb: 2,
                            fontWeight: 500
                        }}>
                            Tags
                        </Typography>

                        {/* Display existing tags */}
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
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '& fieldset': {
                                        borderColor: '#e2e8f0'
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#cbd5e0',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#075985'
                                    }
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#64748b',
                                    '&.Mui-focused': {
                                        color: '#075985'
                                    }
                                }
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
                    disabled={saving}
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