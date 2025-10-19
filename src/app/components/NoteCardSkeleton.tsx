import { Box, Card, CardContent, Skeleton, Stack } from '@mui/material';

const NoteCardSkeleton = ({ index = 0 }: { index?: number }) => {
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
                        {/* Title Skeleton */}
                        <Skeleton
                            variant="rectangular"
                            width="70%"
                            height={28}
                            sx={{
                                borderRadius: 1,
                                mb: 1
                            }}
                        />

                        {/* Tags Skeleton */}
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

                        {/* Body Content Skeleton */}
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

                    {/* Action Buttons Skeleton */}
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

                {/* Date Skeleton */}
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

export default NoteCardSkeleton;