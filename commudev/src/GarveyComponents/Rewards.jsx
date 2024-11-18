import React, { useEffect, useState } from "react";
import {
    Box,
    Container,
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Chip,
    CircularProgress,
    Pagination
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
}));

const Rewards = () => {
    const [rewards, setRewards] = useState([]);
    const [claimedRewards, setClaimedRewards] = useState([]);
    const [totalPoints, setTotalPoints] = useState(500);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [itemsPerPage] = useState(6);

    useEffect(() => {
        fetchRewards();
        fetchClaimedRewards();
    }, []);

    const fetchRewards = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/rewards/all");
            const data = await response.json();
            setRewards(data);
        } catch (error) {
            console.error("Error fetching rewards:", error);
        }
    };

    const fetchClaimedRewards = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/rewards/claimed");
            const data = await response.json();
            setClaimedRewards(data);
        } catch (error) {
            console.error("Error fetching claimed rewards:", error);
        }
    };

    const claimReward = async (rewardId, rewardValue) => {
        if (totalPoints >= rewardValue) {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `http://localhost:8080/api/rewards/claim/${rewardId}`,
                    {
                        method: 'POST'
                    }
                );
                
                if (response.ok) {
                    // Update the local state immediately
                    setRewards(currentRewards =>
                        currentRewards.map(reward =>
                            reward.id === rewardId
                                ? { ...reward, quantity: reward.quantity - 1 }
                                : reward
                        )
                    );
                    setTotalPoints(currentPoints => currentPoints - rewardValue);
                    setClaimedRewards(current => [...current, { rewardId, claimedAt: new Date() }]);
                    alert("Reward claimed successfully!");
                } else {
                    alert("Failed to claim reward");
                }
            } catch (error) {
                console.error("Error claiming reward:", error);
                alert("Failed to claim reward");
            } finally {
                setIsLoading(false);
            }
        } else {
            alert("Not enough points to claim this reward");
        }
    };

    const handleChangePage = (event, value) => {
        setPage(value);
    };

    const indexOfLastReward = page * itemsPerPage;
    const indexOfFirstReward = indexOfLastReward - itemsPerPage;
    const currentRewards = rewards.slice(indexOfFirstReward, indexOfLastReward);

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <CardGiftcardIcon sx={{ mr: 1 }} color="primary" />
                <Typography variant="h4" component="h1">
                    Rewards Center
                </Typography>
            </Box>

            <StyledPaper elevation={3}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6">
                        Your Total Reward Points
                    </Typography>
                    <Typography variant="h4" color="primary">
                        {totalPoints} pts
                    </Typography>
                </Box>
            </StyledPaper>

            <Grid container spacing={3}>
                {currentRewards.length > 0 ? (
                    currentRewards.map((reward) => (
                        <Grid item xs={12} sm={6} md={4} key={reward.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {reward.name}
                                    </Typography>
                                    <Typography color="textSecondary" gutterBottom>
                                        {reward.type}
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                                        <Typography variant="h6" color="primary">
                                            {reward.value} pts
                                        </Typography>
                                        <Chip
                                            label={`${reward.quantity} left`}
                                            color="primary"
                                            variant="outlined"
                                        />
                                    </Box>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 2 }}
                                        disabled={totalPoints < reward.value || isLoading || reward.quantity <= 0}
                                        onClick={() => claimReward(reward.id, reward.value)}
                                    >
                                        {isLoading ? <CircularProgress size={24} /> : 'Claim Reward'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Typography>No rewards available.</Typography>
                    </Grid>
                )}
            </Grid>

            {rewards.length > itemsPerPage && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                        count={Math.ceil(rewards.length / itemsPerPage)}
                        page={page}
                        onChange={handleChangePage}
                        color="primary"
                    />
                </Box>
            )}
        </Container>
    );
};

export default Rewards;