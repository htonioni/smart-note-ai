import { TextField, Box, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { IconButton } from '@mui/material';

interface SearchBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    resultsCount: number;
}

const SearchBar = ({
    searchQuery,
    onSearchChange,
    resultsCount
}: SearchBarProps) => {
    const handleClear = () => {
        onSearchChange('');
    }

    return (
        <Box sx={{ mb: 3 }}>
            <TextField
                fullWidth
                variant='outlined'
                placeholder='Search by title, content, tags, summary or date (e.g., "today", "last week", "december", "02/17/2000", "May 04, 2025")...'
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: '#64748b' }} />
                            </InputAdornment>
                        ),
                        endAdornment: searchQuery && (
                            <InputAdornment position="end">
                                <IconButton onClick={handleClear} size="small">
                                    <ClearIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }
                }}
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
                }}
            />
            {searchQuery && (
                <Box sx={{ mt: 1, color: '#64748b', fontSize: '0.875rem' }}>
                    {resultsCount} note{resultsCount !== 1 ? 's' : ''} found
                </Box>
            )}

        </Box>
    )
}


export default SearchBar;