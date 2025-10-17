'use client';
import { useState, useEffect } from 'react';
import { Note } from '../types/note'
import { Button, Box, Stack, TextField, Paper, Typography, Card, CardContent, IconButton, Skeleton, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Container, FormControlLabel, Checkbox, Chip } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';



export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [aiEnabled, setAiEnabled] = useState(false);

  // fetching data
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // creating note?
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  // modals
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null)
  const [editOpen, setEditOpen] = useState(false);
  const [editNote, setEditNote] = useState<Note | null>(null);

  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');


  // xisnove para dedurar toda vez que inicia o app -- checar
  useEffect(() => {
    fetch('/api/notes')
      .then(res => res.json())
      .then(data => {
        setNotes(data)
        setLoading(false)
      });
  }, []);

  // add loading to button when using post request
  const handleAddNote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    let aiTags = null;

    if (aiEnabled) {
      try {
        const aiResponse = await fetch('/api/ai/suggest-tags', {
          method: 'POST',
          headers: { 'Content-Type ': 'application/json' },
          body: JSON.stringify({
            id: 0, // temp
            title: title.trim(),
            body: body.trim()
          })
        });

        const aiResult = await aiResponse.json();

        if (aiResult.success) {
          aiTags = aiResult.data.tags;
        }
      } catch (error) {
        console.error('AI generation failed:', error);
      }
    }

    const response = await fetch('/api/notes', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title.trim(),
        body: body.trim(),
        tags: aiTags
      })
    })

    if (response.ok) {
      const newNote = await response.json();
      setNotes([...notes, newNote]);
      setTitle('');
      setBody('');
      setAiEnabled(false);
    } else {
      alert('Error on add note.')
    }
  };

  const handleDeleteNote = async (note: Note) => {
    setNoteToDelete(note);
    setDeleteOpen(true);
  }

  const handleEditNote = (note: Note) => {
    setEditNote(note);
    setEditTitle(note.title);
    setEditBody(note.body);
    setEditOpen(true);
  };

  const handleGenerateAITags = async (noteId: number) => {
    try {
      const note = notes.find(n => n.id === noteId);
      if (!note) return;

      const response = await fetch('/api/ai/suggest-tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: note.id,
          title: note.title,
          body: note.body
        })
      })

      const result = await response.json();

      if (result.success) {
        const updatedNote = { ...note, tags: result.data.tags };

        await fetch(`/api/notes/${noteId}`, {
          method: 'PUT',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify(updatedNote)
        });

        setNotes(notes.map(n => n.id === noteId ? updatedNote : n));

        alert(`Generated tags: ${result.data.tags.join(', ')}`);
      }
    } catch (error) {
      console.error('Error generating AI tags:', error);
      alert('Failed to generate AI tags');
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f8f9fa',
        py: 4,
        px: 10,
        color: '#0f172a'
      }}
    >
      <Container maxWidth="xl">
        {/* header section */}
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 3,
              letterSpacing: '-1px',
              fontSize: { xs: '3rem', md: '4rem', lg: '4.5rem' },
              lineHeight: 1.1,
              fontFamily: 'var(--font-lexend)'
            }}
          >
            Smart
            <Box component="span" sx={{ color: '#f87171' }}>
              Note
            </Box>
            {' '}AI
          </Typography>
        </Box>

        {/* main section */}
        <Box
          sx={{
            display: 'flex',
            gap: 6,
            flexDirection: { xs: 'column', lg: 'row' },
            alignItems: { xs: 'stretch', lg: 'flex-start' },
            // fontFamily: 'var(--font-inter)'
          }}
        >
          {/* create note section */}
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
              <form onSubmit={handleAddNote}>
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
                  <FormControlLabel
                    control={<Checkbox checked={aiEnabled} onChange={(e) => setAiEnabled(e.target.checked)} />}
                    label="Auto generate AI tags"
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
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
                    Add Note
                  </Button>
                </Stack>
              </form>
            </Paper>
          </Box>

          {/* List note section */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h5"
              sx={{
                mb: 2,
                fontWeight: 600,
                color: '#333',
              }}
            >
              Your Notes
            </Typography>
            <Stack spacing={2}>
              {loading ? (
                <>
                  <Skeleton variant='rectangular' animation="wave" height={100} />
                  <Skeleton variant='rectangular' animation="wave" height={100} />
                  <Skeleton variant='rectangular' animation="wave" height={100} />
                </>
              ) : (
                <>
                  {notes.length === 0 && (
                    <Paper
                      elevation={1}
                      sx={{
                        p: 12,
                        textAlign: 'center',
                        borderRadius: 2,
                        bgcolor: '#ffffff',
                        border: '1px solid #e2e8f0'
                      }}
                    >
                      <DescriptionOutlinedIcon
                        sx={{
                          fontSize: 64,
                          color: '#cbd5e0',
                          mb: 4
                        }}
                      />
                      <Typography
                        variant="h5"
                        sx={{
                          color: '#333',
                          fontWeight: 600,
                          mb: 2
                        }}
                      >
                        No notes yet
                      </Typography>
                      <Typography
                        sx={{
                          color: '#64748b',
                          fontSize: '1.1rem'
                        }}
                      >
                        Create your first note to get started
                      </Typography>
                    </Paper>
                  )}
                  {notes.map((note, index) => (
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
                            {note.tags && note.tags.length > 0 && (
                              <Box sx={{ mt: 2, mb: 1 }}>
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
                          </Box>
                          <IconButton
                            onClick={() => handleGenerateAITags(note.id)}
                            sx={{
                              bgcolor: 'linear-gradient(45deg, #9c27b0, #673ab7)',
                              '&:hover': { bgcolor: '#f8717180' }
                            }}
                          >
                            <AutoAwesomeIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleEditNote(note)}
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
                            onClick={() => handleDeleteNote(note)}
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
                  ))}
                </>
              )
              }
            </Stack>
          </Box>
        </Box>
      </Container>
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
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
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setEditOpen(false)
              setEditTitle('')
              setEditBody('')
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              if (!editNote) return;
              setSaving(true)
              const response = await fetch(`/api/notes/${editNote.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: editTitle.trim(), body: editBody.trim() }),
              });
              setSaving(false)
              if (response.ok) {
                const updateNote = await response.json();
                setNotes(notes.map(n => n.id === updateNote.id ? updateNote : n))
                setEditOpen(false);
              } else {
                alert('Error updating note');
              }
            }}
            variant='contained'
            disabled={saving}
            endIcon={saving ? <CircularProgress size={20} /> : null}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Delete Note</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{noteToDelete?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button
            onClick={async () => {
              if (!noteToDelete) return;
              setSaving(true)
              const response = await fetch(`/api/notes/${noteToDelete.id}`, { method: 'DELETE' });
              setSaving(false)
              if (response.ok) {
                setNotes(notes.filter(n => n.id !== noteToDelete.id));
                setDeleteOpen(false);
              } else {
                alert("Error deleting note")
              }
            }}
            variant='contained'
            color='error'
            disabled={saving}
            endIcon={saving ? <CircularProgress size={20} /> : null}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
