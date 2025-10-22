import { Toast } from "@/utils/toastUtils";
import { Alert, Snackbar, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

interface ToastNotificationProps {
    toast: Toast;
    onClose: () => void;
}

export const ToastNotification = ({ toast, onClose }: ToastNotificationProps) => {
    return (
        <Snackbar
            open={toast.open}
            autoHideDuration={3000}
            onClose={onClose}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            key={toast.message}
        >
            <Alert
                severity={toast.severity}
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={onClose}
                    >
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                }
                sx={{
                    width: '100%',
                    fontSize: '1rem',
                    fontWeight: 500,
                    padding: '8px 16px',
                    borderRadius: '8px',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                    backgroundColor: '#ffffff',
                    color: '#6c6c6c',
                    border: 'none',
                    '& .MuiAlert-icon': {
                        fontSize: '24px',
                        marginRight: '12px',
                    },
                    '& .MuiAlert-action': {
                        marginRight: 0,
                        paddingLeft: '16px',
                        '& .MuiIconButton-root': {
                            color: '#6b7280',
                            opacity: 0.8,
                            '&:hover': {
                                opacity: 1,
                                backgroundColor: 'rgba(0, 0, 0, 0.04)'
                            }
                        }
                    }
                }}
            >
                {toast.message}
            </Alert>
        </Snackbar>
    );
};