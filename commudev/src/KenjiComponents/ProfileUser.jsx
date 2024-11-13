import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Typography,
  Avatar,
  IconButton,
  Paper,
  Box,
  styled,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import {
  PhotoCamera,
  Close as CloseIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import axios from 'axios';

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(16),
  height: theme.spacing(16),
  marginBottom: theme.spacing(2)
}));


const EditProfileDialog = ({ open, onClose, user, onSave }) => {
  const [editedUser, setEditedUser] = useState(user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      setEditedUser(user);
      setError(null);
    }
  }, [open, user]);

  const handleChange = (field) => (event) => {
    setEditedUser(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (editedUser.id) {
        response = await axios.put(`http://localhost:8080/users/${editedUser.id}`, editedUser);
      } else {
        response = await axios.post('http://localhost:8080/users/add', editedUser);
      }
      onSave(response.data);
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
      setError('Failed to save changes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Edit Profile
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              value={editedUser?.firstname || ''}
              onChange={handleChange('firstname')}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              value={editedUser?.lastname || ''}
              onChange={handleChange('lastname')}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Biography"
              value={editedUser?.biography || ''}
              onChange={handleChange('biography')}
              multiline
              rows={4}
              margin="normal"
              placeholder="Tell us about yourself..."
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Age"
              type="number"
              value={editedUser?.age || ''}
              onChange={handleChange('age')}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="State"
              value={editedUser?.state || ''}
              onChange={handleChange('state')}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Employment Status"
              value={editedUser?.employmentStatus || ''}
              onChange={handleChange('employmentStatus')}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Goals"
              value={editedUser?.goals || ''}
              onChange={handleChange('goals')}
              multiline
              rows={3}
              margin="normal"
              placeholder="What are your goals?"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Hobbies"
              value={editedUser?.hobbies || ''}
              onChange={handleChange('hobbies')}
              multiline
              rows={3}
              margin="normal"
              placeholder="What are your hobbies?"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};


const ProfileUser = () => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('userProfile');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/users/all');
        const fetchedUser = response.data[0];
        setUser(fetchedUser);
        localStorage.setItem('userProfile', JSON.stringify(fetchedUser));
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data.');
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, []);

  const handleSave = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('userProfile', JSON.stringify(updatedUser));
  };

  const handleDelete = async () => {
    if (!user?.id) return;

    try {
      await axios.delete(`http://localhost:8080/users/${user.id}`);
      setUser(null);
      localStorage.removeItem('userProfile');
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user.');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>No user data available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', p: 4 }}>
      <Card elevation={3}>
        <CardContent>
          <Grid container spacing={6}>
            {/* Left Column */}
            <Grid item xs={12} md={4} sx={{ borderRight: 1, borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <StyledAvatar>
                  <PhotoCamera />
                </StyledAvatar>
              </Box>

              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                  {user.firstname || 'No name set'} {user.lastname || ''}
                </Typography>
                <Typography color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                  {user.biography || 'No biography available'}
                </Typography>
              </Box>

              <List>
                <ListItem>
                  <ListItemText
                    primary="Age"
                    secondary={user.age || 'Not specified'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="State"
                    secondary={user.state || 'Not specified'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Employment Status"
                    secondary={user.employmentStatus || 'Not specified'}
                  />
                </ListItem>
              </List>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2 }} variant="outlined">
                    <Typography variant="h6" gutterBottom>Rewards</Typography>
                    {Array.isArray(user.rewards) && user.rewards.length > 0 ? (
                      user.rewards.map((reward, index) => (
                        <Typography key={index} color="text.secondary">{reward}</Typography>
                      ))
                    ) : (
                      <Typography color="text.secondary">No rewards yet</Typography>
                    )}
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2 }} variant="outlined">
                    <Typography variant="h6" gutterBottom>Followers</Typography>
                    <Typography color="text.secondary">
                      {user.followers || 0} followers
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper sx={{ p: 2 }} variant="outlined">
                    <Typography variant="h6" gutterBottom>About Me</Typography>
                    <Typography color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                      {user.biography || 'Add your biography to tell others about yourself.'}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper sx={{ p: 2 }} variant="outlined">
                    <Typography variant="h6" gutterBottom>Goals</Typography>
                    <Typography color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                      {user.goals || 'Share your goals and aspirations.'}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper sx={{ p: 2 }} variant="outlined">
                    <Typography variant="h6" gutterBottom>Hobbies</Typography>
                    <Typography color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                      {user.hobbies || 'Tell others about your hobbies and interests.'}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenEditDialog(true)}
            startIcon={<EditIcon />}
          >
            Edit Profile
          </Button>
          {user?.id && (
            <Button
              variant="outlined"
              color="error"
              onClick={handleDelete}
              sx={{ ml: 2 }}
            >
              Delete Profile
            </Button>
          )}
        </Box>
      </Card>

      <EditProfileDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        user={user}
        onSave={handleSave}
      />
    </Box>
  );
};  

export default ProfileUser;