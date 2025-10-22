import { Note } from "@/types/note";
import { Box, Card, CardContent, Chip, CircularProgress, IconButton, Stack, Typography } from "@mui/material";
import { SummarySkeleton } from './NoteCardSkeleton';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import { getRelativeTime } from "@/utils/dateUtils";
import Image from 'next/image';
import generativeIcon from '@/assets/generative.svg';

interface NoteCardProps {
    note: Note;
    index: number;
    onGenerateAI: (noteId: number) => void;
    onEditNote: (note: Note) => void;
    onDeleteNote: (note: Note) => void;
    onDeleteNoteSummary: (noteId: number) => void;
    aiLoading: Set<number>;
    summaryDeleteLoading: Set<number>;
}

const NoteCard = ({
    note,
    index,
    onGenerateAI,
    onEditNote,
    onDeleteNote,
    onDeleteNoteSummary,
    aiLoading,
    summaryDeleteLoading
}: NoteCardProps) => {

    const shouldShowAIButton = !note.summary || (note.tags && note.tags.length < 4);

    return (
        <Card
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
                    <Box sx={{ flex: 1 }}>
                        <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    color: '#333',
                                    wordBreak: 'break-word',
                                    fontSize: '1.3rem'
                                }}
                            >
                                {note.title}
                            </Typography>
                            <Box>
                                {shouldShowAIButton && (
                                    <IconButton
                                        onClick={() => onGenerateAI(note.id)}
                                        disabled={aiLoading.has(note.id)}
                                        sx={{
                                            '&:hover img': {
                                                filter: 'grayscale(100%) brightness(0) opacity(0.8)'
                                            }
                                        }}
                                    >
                                        <Image
                                            src={generativeIcon}
                                            alt="Generate AI"
                                            width={24}
                                            height={24}
                                            style={{
                                                filter: 'grayscale(100%) brightness(0) opacity(0.54)',
                                                transition: 'filter 0.2s ease',
                                            }}
                                        />
                                    </IconButton>
                                )}
                                <IconButton
                                    onClick={() => onEditNote(note)}
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
                        </Box>
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
                        {aiLoading.has(note.id) ? (
                            <SummarySkeleton />
                        ) : note.summary ? (
                            <Box sx={{ pr: '2rem' }}>
                                <Box sx={{
                                    mt: 2,
                                    mb: 2,
                                    px: 2.5,
                                    py: 1.5,
                                    bgcolor: 'linear-gradient(135deg, #ff7e7e 0%, #e53e3e 100%)',
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
                                        background: 'linear-gradient(135deg, rgba(255, 126, 126, 0.1) 0%, rgba(229, 62, 62, 0.1) 100%)',
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
                                                        color: '#f87171',
                                                        fontSize: '0.85rem',
                                                        letterSpacing: '0.5px'
                                                    }}
                                                >
                                                    AI Summary
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <IconButton
                                                    onClick={() => onDeleteNoteSummary(note.id)}
                                                    disabled={summaryDeleteLoading.has(note.id)}
                                                >
                                                    {summaryDeleteLoading.has(note.id) ? (
                                                        <CircularProgress size={16} sx={{ color: '#f87171' }} />
                                                    ) : (
                                                        <ClearIcon fontSize='small' />
                                                    )}
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
                            </Box>
                        ) : null}
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

                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <Typography
                        variant="caption"
                        sx={{
                            color: '#64748b',
                            fontSize: '0.75rem',
                            fontStyle: 'italic',
                        }}
                    >
                        {getRelativeTime(note.updatedAt)}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    )
};

export default NoteCard;