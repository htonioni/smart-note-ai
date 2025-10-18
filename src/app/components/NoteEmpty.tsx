import { Paper, Typography } from "@mui/material"
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';


const NoteEmpty = () => {
    return (
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
    )
}

export default NoteEmpty;