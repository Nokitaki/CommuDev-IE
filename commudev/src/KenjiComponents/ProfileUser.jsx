import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  ListItemText,
  Alert
} from '@mui/material';
import {
  PhotoCamera,
  Close as CloseIcon,
  Edit as EditIcon,
  Logout as LogoutIcon
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
    setEditedUser(user);
  }, [user]);

  const handleChange = (field) => (event) => {
    setEditedUser({
      ...editedUser,
      [field]: event.target.value
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('No user ID found');
      }
      const response = await axios.put(`http://localhost:8080/api/user/${userId}`, editedUser);
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
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
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
              rows={2}
              margin="normal"
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
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        navigate('/login');
        return false;
      }
      return userId;
    };

    const fetchUserData = async () => {
      const userId = checkAuth();
      if (!userId) return;

      try {
        const response = await axios.get(`http://localhost:8080/api/user/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        } else {
          setError('Failed to load user data. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleSave = async (updatedUser) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) throw new Error('No user ID found');
      
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Failed to update profile. Please try again.');
    }
  };

  const handleDelete = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      try {
        await axios.delete(`http://localhost:8080/api/user/${userId}`);
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        navigate('/login');
      } catch (error) {
        console.error('Error deleting user:', error);
        setError('Failed to delete profile. Please try again.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    navigate('/login');
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
        <Alert severity="error">{error}</Alert>
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
            <Grid item xs={12} md={4} sx={{ borderRight: { md: 1 }, borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                <StyledAvatar>
                  <PhotoCamera />
                </StyledAvatar>
                <Typography variant="h5" gutterBottom>
                  {user.firstname || 'No name set'} {user.lastname || ''}
                </Typography>
                <Typography color="text.secondary" sx={{ textAlign: 'center', mb: 2 }}>
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
                    <Typography variant="h6" gutterBottom>Hobbies</Typography>
                    {Array.isArray(user.hobbies) && user.hobbies.length > 0 ? (
                      user.hobbies.map((hobby, index) => (
                        <Typography key={index} color="text.secondary">{hobby}</Typography>
                      ))
                    ) : (
                      <Typography color="text.secondary">No hobbies listed</Typography>
                    )}
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2 }} variant="outlined">
                    <Typography variant="h6" gutterBottom>Goals</Typography>
                    <Typography color="text.secondary">
                      {user.goals || 'No goals set'}
                    </Typography>
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
              </Grid>
            </Grid>
          </Grid>
        </CardContent>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2, gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenEditDialog(true)}
            startIcon={<EditIcon />}
          >
            Edit Profile
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleDelete}
          >
            Delete Profile
          </Button>
          <Button
            variant="outlined"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
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