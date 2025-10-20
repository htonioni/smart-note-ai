import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, CircularProgress } from '@mui/material';
import { Note } from '../../types/note';

interface DeleteNoteModalProps {
    open: boolean;
    note: Note | null;
    onClose: () => void;
    onConfirmDelete: (noteId: number) => void;
    deleting?: boolean
}

const DeleteNoteModal = ({
    open,
    note,
    onClose,
    onConfirmDelete,
    deleting,
}: DeleteNoteModalProps) => {

    const handleDelete = () => {
        if (!note) return;
        onConfirmDelete(note.id);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: 3,
                        margin: 2,
                        maxWidth: 400,
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
            <DialogContent sx={{ py: 4, px: 6, textAlign: 'center' }}>
                {/* Custom Title */}
                <Typography variant="h6" sx={{
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: '#0f172a',
                    mb: 3
                }}>
                    Delete Note
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        color: '#64748b',
                        lineHeight: 1.5,
                        mb: 1
                    }}
                >
                    Are you sure you want to delete this note?
                    <Typography component="span" sx={{ fontWeight: 600, display: 'block', mt: 1 }}>
                        {note?.title}
                    </Typography>
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color: '#64748b',
                    }}
                >
                    This action cannot be undone.
                </Typography>
            </DialogContent>

            <DialogActions sx={{
                pt: 0,
                pb: 3,
                gap: 2,
                justifyContent: 'center',
            }}>
                <Button
                    onClick={onClose}
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
                    onClick={handleDelete}
                    disabled={deleting}
                    endIcon={deleting ? <CircularProgress size={16} color="inherit" /> : null}
                    sx={{
                        borderRadius: 2,
                        px: 3,
                        py: 1,
                        bgcolor: '#ef4444',
                        color: 'white',
                        fontWeight: 500,
                        textTransform: 'none',
                        '&:hover': {
                            bgcolor: '#dc2626',
                        },
                        '&:disabled': {
                            bgcolor: '#fca5a5',
                            color: 'white'
                        }
                    }}
                >
                    {deleting ? 'Deleting...' : 'Delete'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
export default DeleteNoteModal