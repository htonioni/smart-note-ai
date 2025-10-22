import { useState } from 'react'
import { Box, Button, Paper, Stack, TextField, Typography, CircularProgress } from "@mui/material"

interface CreateNoteFormProps {
    onSubmit: (title: string, body: string, aiEnabled: boolean) => void;
    isLoading: boolean;
}

const CreateNoteForm = ({ onSubmit, isLoading = false }: CreateNoteFormProps) => {

    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [aiEnabled, setAiEnabled] = useState(false);


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!title.trim() || !body.trim()) return;

        onSubmit(title.trim(), body.trim(), aiEnabled);

        setTitle('');
        setBody('');
        setAiEnabled(false);
    }

    return (
        <Box sx={{ flex: { xs: '1', lg: '0 0 500px' } }}>
            <Typography
                variant="h5"
                sx={{
                    mb: 2,
                    fontWeight: 600,
                    color: '#333'
                }}
            >
                Create New Note
            </Typography>
            <Paper
                elevation={1}
                sx={{
                    p: 4,
                    borderRadius: 2,
                    bgcolor: '#fffff',
                    border: '1px solid #e2e8f0',
                    position: 'sticky',
                    top: 24,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                    }
                }}
            >
                <form onSubmit={handleSubmit}>
                    <Stack spacing={4}>
                        <TextField
                            label="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            variant="outlined"
                            required
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    bgcolor: '#f8f9fa',
                                    '& fieldset': {
                                        borderColor: '#e2e8f0'
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#cbd5e0',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#4299e1',
                                        borderWidth: 2
                                    }
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#64748b',
                                    '&.Mui-focused': {
                                        color: '#4299e1'
                                    }
                                }
                            }}
                        />
                        <TextField
                            label="Content"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            variant="outlined"
                            multiline
                            rows={4}
                            required
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    bgcolor: '#f8f9fa',
                                    '& fieldset': {
                                        borderColor: '#e2e8f0'
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#cbd5e0',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#4299e1',
                                        borderWidth: 2
                                    }
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#64748b',
                                    '&.Mui-focused': {
                                        color: '#4299e1'
                                    }
                                }
                            }}
                        />
                        <Box sx={{ mb: 2 }}>
                            <Box
                                onClick={() => setAiEnabled(!aiEnabled)}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    gap: 2
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 50,
                                        height: 26,
                                        borderRadius: 13,
                                        bgcolor: aiEnabled ? '#075985' : '#e2e8f0',
                                        position: 'relative',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            bgcolor: aiEnabled ? '#075985' : '#cbd5e0'
                                        }
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 22,
                                            height: 22,
                                            borderRadius: '50%',
                                            bgcolor: 'white',
                                            position: 'absolute',
                                            top: 2,
                                            left: aiEnabled ? 26 : 2,
                                            transition: 'all 0.3s ease',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                        }}
                                    />
                                </Box>
                                <Typography variant="body2" sx={{ color: '#4a5568' }}>
                                    AI Enabled
                                </Typography>
                            </Box>
                        </Box>
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={isLoading}
                            endIcon={isLoading ? <CircularProgress color='inherit' size={20} /> : null}
                            sx={{
                                borderRadius: 2,
                                py: 1.75,
                                bgcolor: '#0f172a',
                                color: '#ffffff',
                                fontWeight: 600,
                                textTransform: 'none',
                                fontSize: '1rem',
                                boxShadow: 'none',
                                '&:hover': {
                                    bgcolor: '#075985',
                                    boxShadow: '0 4px 12px rgba(45, 55, 72, 0.3)'
                                }
                            }}
                        >
                            {isLoading ? 'Creating ...' : 'Add Note'}
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Box>
    )
}

export default CreateNoteForm