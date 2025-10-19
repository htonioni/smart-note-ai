import { Note } from "@/types/note";
import { Box, Card, CardContent, Chip, IconButton, Stack, Typography } from "@mui/material";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';

interface NoteCardProps {
    note: Note;
    index: number;
    onGenerateAITags: (noteId: number) => void;
    onEditNote: (note: Note) => void;
    onDeleteNote: (note: Note) => void;
    onDeleteNoteSummary: (noteId: number) => void;
    aiLoading: number | null;
}

const NoteCard = ({
    note,
    index,
    onGenerateAITags,
    onEditNote,
    onDeleteNote,
    onDeleteNoteSummary,
    aiLoading
}: NoteCardProps) => {
    return (
        <Card
            key={note.id}
            elevation={1}
            sx={{
                bgcolor: '#fff',
                borderRadius: 2,
                border: '1px solid #e2e8f0',
                transition: 'all 0.2s ease',
                animation: `slideIn 0.3s ease ${index * 0.1}s both`,
                '@keyframes slideIn': {
                    from: {
                        opacity: 0,
                        transform: 'translateY(20px)'
                    },
                    to: {
                        opacity: 1,
                        transform: 'translateY(0)'
                    }
                },
                '&:hover': {
                    borderColor: '#cbd5e0',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }
            }}
        >
            <CardContent sx={{ px: 4, py: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1, pr: 3 }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                color: '#333',
                                mb: 1,
                                wordBreak: 'break-word',
                                fontSize: '1.3rem'
                            }}
                        >
                            {note.title}
                        </Typography>
                        {note.tags && note.tags.length > 0 && (
                            <Box sx={{ mt: 0.5, mb: 2 }}>
                                <Stack direction="row" spacing={1} flexWrap="wrap">
                                    {note.tags.map((tag, index) => (
                                        <Chip
                                            key={index}
                                            label={tag}
                                            size="small"
                                            sx={{
                                                bgcolor: '#e3f2fd',
                                                color: '#1976d2',
                                                fontSize: '0.75rem',
                                                height: '24px',
                                                mb: 0.5
                                            }}
                                        />
                                    ))}
                                </Stack>
                            </Box>
                        )}
                        {note.summary && (
                            <Box sx={{
                                mt: 2,
                                mb: 2,
                                px: 2.5,
                                py: 1.5,
                                bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: 2,
                                position: 'relative',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    borderRadius: 2,
                                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                                    backdropFilter: 'blur(10px)'
                                }
                            }}>
                                <Box sx={{ position: 'relative', zIndex: 1 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Box sx={{ height: 20, mr: 1 }}>
                                                <Typography sx={{ fontSize: '12px' }}>✨</Typography>
                                            </Box>
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    fontWeight: 600,
                                                    color: '#4c1d95',
                                                    fontSize: '0.85rem',
                                                    letterSpacing: '0.5px'
                                                }}
                                            >
                                                AI Summary
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <IconButton onClick={() => onDeleteNoteSummary(note.id)}>
                                                <ClearIcon fontSize='small' />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: '#1e293b',
                                            lineHeight: 1.6,
                                            fontSize: '0.9rem',
                                            fontWeight: 500,
                                        }}
                                    >
                                        {note.summary}
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{
                                lineHeight: 1.6,
                                wordBreak: 'break-word',
                                whiteSpace: 'pre-wrap',
                            }}
                        >
                            {note.body}
                        </Typography>
                    </Box>
                    <IconButton
                        onClick={() => onGenerateAITags(note.id)}
                        // revisao: cores e icones
                        sx={{
                            bgcolor: aiLoading === note.id ? '#f5f5f5' : 'linear-gradient(45deg, #9c27b0, #673ab7)',
                            '&:hover': { bgcolor: aiLoading === note.id ? '#f5f5f5' : '#f8717180' }
                        }}
                    >
                        <AutoAwesomeIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => onEditNote(note)}
                        sx={{
                            '&:hover': {
                                bgcolor: '#0678b790',
                                color: '#045683'
                            }
                        }}
                    >
                        <EditIcon
                            fontSize='small'
                        />
                    </IconButton>
                    <IconButton
                        onClick={() => onDeleteNote(note)}
                        sx={{
                            '&:hover': {
                                bgcolor: '#fee2e2',
                                color: '#dc2626'
                            }
                        }}
                    >
                        <ClearIcon
                            fontSize='small'
                        />
                    </IconButton>
                </Box>
            </CardContent>
        </Card>
    )
};

export default NoteCard;