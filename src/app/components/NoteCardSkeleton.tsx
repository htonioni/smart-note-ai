import { Box, Card, CardContent, Skeleton, Stack, Typography } from '@mui/material';

export const NoteCardSkeleton = ({ index = 0 }: { index?: number }) => {
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
                }
            }}
        >
            <CardContent sx={{ px: 4, py: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1, pr: 3 }}>
                        <Skeleton
                            variant="rectangular"
                            width="70%"
                            height={28}
                            sx={{
                                borderRadius: 1,
                                mb: 1
                            }}
                        />

                        <Box sx={{ mt: 0.5, mb: 2 }}>
                            <Stack direction="row" spacing={1}>
                                <Skeleton
                                    variant="rectangular"
                                    width={60}
                                    height={24}
                                    sx={{ borderRadius: 3 }}
                                />
                                <Skeleton
                                    variant="rectangular"
                                    width={80}
                                    height={24}
                                    sx={{ borderRadius: 3 }}
                                />
                                <Skeleton
                                    variant="rectangular"
                                    width={45}
                                    height={24}
                                    sx={{ borderRadius: 3 }}
                                />
                            </Stack>
                        </Box>

                        <Box>
                            <Skeleton
                                variant="rectangular"
                                width="100%"
                                height={16}
                                sx={{ borderRadius: 1, mb: 0.8 }}
                            />
                            <Skeleton
                                variant="rectangular"
                                width="95%"
                                height={16}
                                sx={{ borderRadius: 1, mb: 0.8 }}
                            />
                            <Skeleton
                                variant="rectangular"
                                width="80%"
                                height={16}
                                sx={{ borderRadius: 1 }}
                            />
                        </Box>
                    </Box>

                    <Stack spacing={1} direction='row'>
                        <Skeleton
                            variant="circular"
                            width={40}
                            height={40}
                        />
                        <Skeleton
                            variant="circular"
                            width={40}
                            height={40}
                        />
                        <Skeleton
                            variant="circular"
                            width={40}
                            height={40}
                        />
                    </Stack>
                </Box>

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row-reverse',
                    mt: 2,
                    pt: 1,
                }}>
                    <Skeleton
                        variant="rectangular"
                        width={60}
                        height={12}
                        sx={{ borderRadius: 1 }}
                    />
                </Box>
            </CardContent>
        </Card>
    );
};

export const SummarySkeleton = () => {
    return (
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
                <Box sx={{ position: 'relative', zIndex: 1, mb: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ height: 20, mr: 1 }}>
                                <Typography sx={{
                                    fontSize: '12px',
                                    filter: 'grayscale(100%) saturate(0)',
                                    WebkitFilter: 'grayscale(100%) saturate(0)',
                                    opacity: 0.2
                                }}>
                                    ✨
                                </Typography>
                            </Box>
                            <Skeleton
                                variant="text"
                                width={100}
                                height={24}
                            />
                        </Box>
                        <Skeleton
                            variant="circular"
                            width={32}
                            height={32}
                        />
                    </Box>
                    <Skeleton
                        variant="text"
                        width="100%"
                        height={16}
                        sx={{ mt: 1, mb: 0.5 }}
                    />
                    <Skeleton
                        variant="text"
                        width="90%"
                        height={16}
                    />
                </Box>
            </Box>
        </Box>
    )
}