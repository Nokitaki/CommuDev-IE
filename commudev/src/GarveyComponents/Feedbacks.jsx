// Feedbacks.jsx
import React, { useState, useEffect } from 'react';
import {
    Box, Container, Paper, Typography, TextField, Button, Select, MenuItem,
    FormControl, InputLabel, Card, CardContent, Grid, CircularProgress, Divider,
    IconButton
} from '@mui/material';
import axios from 'axios';
import FeedbackIcon from '@mui/icons-material/Feedback';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Rewards from './Rewards';
 
const Feedbacks = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('feedback');
    const [form, setForm] = useState({
        feedbackType: '',
        subject: '',
        description: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editForm, setEditForm] = useState({
        feedbackType: '',
        subject: '',
        description: '',
    });
 
    const fetchFeedbacks = async () => {
        if (selectedCategory === 'feedback') {
            try {
                const response = await axios.get("http://localhost:8080/api/feedback/all");
                setFeedbacks(response.data);
            } catch (error) {
                console.error("Error fetching feedbacks:", error);
            }
        }
    };
 
    useEffect(() => {
        fetchFeedbacks();
    }, [selectedCategory]);
 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };
 
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm({ ...editForm, [name]: value });
    };
 
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
 
        const feedbackData = {
            feedbackType: form.feedbackType,
            subject: form.subject,
            description: form.description,
            dateSubmitted: new Date().toISOString().split('T')[0]
        };
 
        try {
            const response = await axios.post(
                "http://localhost:8080/api/feedback/add",
                feedbackData
            );
 
            setFeedbacks(prev => [...prev, response.data]);
            setForm({
                feedbackType: '',
                subject: '',
                description: ''
            });
 
            alert("Feedback submitted successfully!");
            fetchFeedbacks(); // Refresh the list
        } catch (error) {
            console.error("Error submitting feedback:", error);
            alert(error.response?.data?.message || "Failed to submit feedback");
        } finally {
            setIsSubmitting(false);
        }
    };
 
    const handleEditFeedback = (feedback) => {
        setEditId(feedback.feedback_id);
        setEditForm({
            feedbackType: feedback.feedbackType,
            subject: feedback.subject,
            description: feedback.description,
            dateSubmitted: feedback.dateSubmitted,
            dateResolved: feedback.dateResolved
        });
    };
 
    const handleUpdateFeedback = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await axios.put(
                `http://localhost:8080/api/feedback/${editId}`,
                {
                    ...editForm,
                    dateSubmitted: editForm.dateSubmitted || new Date().toISOString().split('T')[0]
                }
            );
 
            setFeedbacks(prev =>
                prev.map(feedback =>
                    feedback.feedback_id === editId ? response.data : feedback
                )
            );
 
            setEditId(null);
            setEditForm({
                feedbackType: '',
                subject: '',
                description: '',
                dateSubmitted: '',
                dateResolved: ''
            });
            alert("Feedback updated successfully!");
            fetchFeedbacks(); // Refresh the list
        } catch (error) {
            console.error("Error updating feedback:", error);
            alert(error.response?.data?.message || "Failed to update feedback");
        } finally {
            setIsSubmitting(false);
        }
    };
 
    const handleDeleteFeedback = async (id) => {
        if (window.confirm("Are you sure you want to delete this feedback?")) {
            try {
                await axios.delete(`http://localhost:8080/api/feedback/${id}`);
                setFeedbacks(prev => prev.filter(feedback => feedback.feedback_id !== id));
                alert("Feedback deleted successfully!");
                fetchFeedbacks(); // Refresh the list
            } catch (error) {
                console.error("Error deleting feedback:", error);
                alert(error.response?.data?.message || "Failed to delete feedback");
            }
        }
    };
 
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Button
                    variant={selectedCategory === 'feedback' ? 'contained' : 'outlined'}
                    onClick={() => setSelectedCategory('feedback')}
                    startIcon={<FeedbackIcon />}
                    sx={{ mx: 1 }}
                >
                    Feedback
                </Button>
                <Button
                    variant={selectedCategory === 'rewards' ? 'contained' : 'outlined'}
                    onClick={() => setSelectedCategory('rewards')}
                    startIcon={<CardGiftcardIcon />}
                    sx={{ mx: 1 }}
                >
                    Rewards
                </Button>
            </Box>
 
            {selectedCategory === 'feedback' ? (
                <Box>
                    <Typography variant="h4" gutterBottom>Feedback Section</Typography>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>Submit Feedback</Typography>
                        <form onSubmit={handleSubmit}>
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Feedback Type</InputLabel>
                                <Select
                                    name="feedbackType"
                                    value={form.feedbackType}
                                    onChange={handleChange}
                                    required
                                    disabled={isSubmitting}
                                >
                                    <MenuItem value="Bug Report">Bug Report</MenuItem>
                                    <MenuItem value="Feature Request">Feature Request</MenuItem>
                                    <MenuItem value="General Feedback">General Feedback</MenuItem>
                                </Select>
                            </FormControl>
 
                            <TextField
                                fullWidth
                                label="Subject"
                                name="subject"
                                value={form.subject}
                                onChange={handleChange}
                                required
                                disabled={isSubmitting}
                                sx={{ mb: 2 }}
                            />
 
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                required
                                disabled={isSubmitting}
                                multiline
                                rows={4}
                                sx={{ mb: 2 }}
                            />
 
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <CircularProgress size={24} /> : 'Submit Feedback'}
                            </Button>
                        </form>
                    </Paper>
 
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>Recent Feedback</Typography>
                        {feedbacks.length === 0 ? (
                            <Typography color="textSecondary" align="center">
                                No feedback reports available.
                            </Typography>
                        ) : (
                            feedbacks.map((feedback) => (
                                <Card key={feedback.feedback_id} sx={{ mb: 2 }}>
                                    <CardContent>
                                        <Typography variant="h6">{feedback.subject}</Typography>
                                        <Divider sx={{ my: 1 }} />
                                        <Typography variant="body2" color="textSecondary">
                                            Type: {feedback.feedbackType}
                                        </Typography>
                                        <Typography>{feedback.description}</Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            Submitted: {feedback.dateSubmitted}
                                        </Typography>
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                            <IconButton onClick={() => handleEditFeedback(feedback)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteFeedback(feedback.feedback_id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </Paper>
 
                    {editId && (
                        <Paper sx={{ p: 3, mt: 3 }}>
                            <Typography variant="h6" gutterBottom>Edit Feedback</Typography>
                            <form onSubmit={handleUpdateFeedback}>
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <InputLabel>Feedback Type</InputLabel>
                                    <Select
                                        name="feedbackType"
                                        value={editForm.feedbackType}
                                        onChange={handleEditChange}
                                        required
                                        disabled={isSubmitting}
                                    >
                                        <MenuItem value="Bug Report">Bug Report</MenuItem>
                                        <MenuItem value="Feature Request">Feature Request</MenuItem>
                                        <MenuItem value="General Feedback">General Feedback</MenuItem>
                                    </Select>
                                </FormControl>
 
                                <TextField
                                    fullWidth
                                    label="Subject"
                                    name="subject"
                                    value={editForm.subject}
                                    onChange={handleEditChange}
                                    required
                                    disabled={isSubmitting}
                                    sx={{ mb: 2 }}
                                />
 
                                <TextField
                                    fullWidth
                                    label="Description"
                                    name="description"
                                    value={editForm.description}
                                    onChange={handleEditChange}
                                    required
                                    disabled={isSubmitting}
                                    multiline
                                    rows={4}
                                    sx={{ mb: 2 }}
                                />
 
                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? <CircularProgress size={24} /> : 'Update Feedback'}
                                </Button>
                            </form>
                        </Paper>
                    )}
                </Box>
            ) : (
                <Rewards />
            )}
        </Container>
    );
};
 
export default Feedbacks;