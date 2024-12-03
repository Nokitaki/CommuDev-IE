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
  Favorite,
  PhotoCamera,
  Close as CloseIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import axios from 'axios';
import { MessageCircle } from 'lucide-react';



const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(16),
  height: theme.spacing(16),
  marginBottom: theme.spacing(2)
}));
const MessageButton = ({ recipientId, recipientName }) => {
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem('userId');

  const handleMessageClick = () => {
    if (currentUserId === recipientId) {
      alert("You cannot send a message to yourself");
      return;
    }

    localStorage.setItem('selectedRecipientId', recipientId);
    localStorage.setItem('selectedRecipientName', recipientName);
    navigate('/messages');
  };

  return (
    <Button
      variant="contained"
      startIcon={<MessageCircle />}
      onClick={handleMessageClick}
      sx={{
        mt: 4,
        mb: 2,
        width: '100%',
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        color: 'white',
        boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
        '&:hover': {
          background: 'linear-gradient(45deg, #1976D2 30%, #21CBF3 90%)',
        },
        borderRadius: '8px',
        textTransform: 'none',
        fontSize: '1rem',
        padding: '10px 20px',
      }}
    >
      Send Message
    </Button>
  );
};

// Edit Profile Dialog Component
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
      let response;
      if (editedUser.id) {
        response = await axios.put(`http://localhost:8080/api/user/${editedUser.id}`, editedUser);
      } else {
        response = await axios.post('http://localhost:8080/api/user/add', editedUser);
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

// Main Profile Component
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
        const response = await axios.get('http://localhost:8080/api/user/all');
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
      await axios.delete(`http://localhost:8080/api/user/${user.id}`);
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
                <Typography color="text.secondary">
                  {user.biography || 'No biography available'}
                </Typography>
<<<<<<< Updated upstream
=======

                <List sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 2 }}>
                  {[
                    { label: 'Age', value: user.age },
                    { label: 'State', value: user.state },
                    { label: 'Employment', value: user.employmentStatus }
                  ].map((item, index) => (
                    <ListItem key={index} sx={{ py: 2 }}>
                      <ListItemText
                        primary={<Typography variant="body2" color="text.secondary">{item.label}</Typography>}
                        secondary={<Typography variant="subtitle1" sx={{ fontWeight: 500 }}>{item.value || 'Not specified'}</Typography>}
                      />
                    </ListItem>
                  ))}
                </List>
>>>>>>> Stashed changes
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

              {/* Message Button */}
              <MessageButton 
                recipientId={user.userId}
                recipientName={`${user.firstname} ${user.lastname}`}
              />
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