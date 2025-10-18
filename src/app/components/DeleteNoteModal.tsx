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
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Delete Note</DialogTitle>
            <DialogContent>
                <Typography>
                    Are you sure you want to delete "{note?.title}"? This action cannot be undone.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    onClick={handleDelete}
                    variant='contained'
                    color='error'
                    disabled={deleting}
                    endIcon={deleting ? <CircularProgress size={20} /> : null}
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    )
}
export default DeleteNoteModal