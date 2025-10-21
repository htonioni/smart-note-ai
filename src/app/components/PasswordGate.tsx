import { useState } from 'react';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

interface PasswordGateProps {
  onSuccess: () => void;
}

const PasswordGate = ({ onSuccess }: PasswordGateProps) => {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/validate-gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer }),
      });

      const result = await response.json();

      if (result.success) {
        sessionStorage.setItem('gateAuthenticated', 'true');
        onSuccess();
      } else {
        setError('Incorrect answer. Please try again.');
        setAnswer('');
      }
    } catch (error) {
      console.error('Validation error:', error);
      setError('Verification failed. Please try again.');
      setAnswer('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f5f799 0%, #e8e8ed99 100%)',
        backdropFilter: 'blur(10px)',
        zIndex: 9999,
        animation: 'fadeIn 0.3s ease-in',
        '@keyframes fadeIn': {
          from: {
            opacity: 0,
          },
          to: {
            opacity: 1,
          },
        },
      }}
    >
      <Box
        sx={{
          maxWidth: 380,
          width: '90%',
          textAlign: 'center',
          animation: 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          '@keyframes slideUp': {
            from: {
              transform: 'translateY(30px)',
              opacity: 0,
            },
            to: {
              transform: 'translateY(0)',
              opacity: 1,
            },
          },
        }}
      >
        <Box
          sx={{
            mb: 6,
            display: 'flex',
            justifyContent: 'center',
            animation: 'scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            '@keyframes scaleIn': {
              from: {
                transform: 'scale(0.8)',
                opacity: 0,
              },
              to: {
                transform: 'scale(1)',
                opacity: 1,
              },
            },
          }}
        >
          <Box
            sx={{
              width: 70,
              height: 70,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f87171 0%, #f87171 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 30px rgba(248, 113, 113, 0.3)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <LockIcon sx={{ color: 'white', fontSize: 36, fontWeight: 300 }} />
          </Box>
        </Box>

        <Typography
          sx={{
            fontSize: '2rem',
            fontWeight: 600,
            color: '#1d1d1f',
            mb: 2,
            letterSpacing: '-0.5px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          Verification Required
        </Typography>

        <Typography
          sx={{
            fontSize: '0.95rem',
            color: '#86868b',
            mb: 6,
            lineHeight: 1.6,
            fontWeight: 400,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          What is the best company of all time?
        </Typography>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            fullWidth
            type="text"
            placeholder="Your answer"
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              setError('');
            }}
            disabled={isLoading}
            autoFocus
            error={!!error}
            helperText={error}
            InputProps={{
              sx: {
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                fontSize: '0.95rem',
                color: '#1d1d1f',
                '&::placeholder': {
                  color: '#a1a1a6',
                  opacity: 1,
                },
              },
            }}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                '& fieldset': {
                  borderColor: error ? '#ff3b30' : 'rgba(0, 0, 0, 0.08)',
                },
                '&:hover fieldset': {
                  borderColor: error ? '#ff3b30' : 'rgba(0, 0, 0, 0.12)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: error ? '#ff3b30' : '#0071e3',
                  borderWidth: 1,
                },
              },
              '& .MuiFormHelperText-root': {
                color: '#ff3b30',
                fontSize: '0.8rem',
                marginTop: '6px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            disabled={!answer.trim() || isLoading}
            sx={{
              borderRadius: '12px',
              py: 1.75,
              bgcolor: '#0f172a',
              color: 'white',
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.95rem',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              letterSpacing: '0.3px',
              border: 'none',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 4px 15px rgba(15, 23, 42, 0.2)',
              '&:hover': {
                bgcolor: '#1a2332',
                boxShadow: '0 8px 25px rgba(15, 23, 42, 0.3)',
                transform: 'translateY(-2px)',
              },
              '&:active': {
                transform: 'translateY(0)',
              },
              '&:disabled': {
                bgcolor: '#d5d5d7',
                color: '#a1a1a6',
                boxShadow: 'none',
                cursor: 'not-allowed',
              },
            }}
          >
            {isLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={18} color="inherit" />
                <span>Verifying</span>
              </Box>
            ) : (
              'Unlock'
            )}
          </Button>
        </form>

        <Typography
          sx={{
            display: 'block',
            mt: 5,
            color: '#a1a1a6',
            fontSize: '0.8rem',
            fontWeight: 400,
            letterSpacing: '0.3px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          Demo access protected
        </Typography>
      </Box>
    </Box>
  );
};

export default PasswordGate;
