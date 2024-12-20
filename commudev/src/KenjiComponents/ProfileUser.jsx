import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, CardContent, TextField, Button, Grid, Typography,
  Avatar, IconButton, Paper, Box, styled, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, Divider,
  List, ListItem, ListItemText, Alert, MenuItem
} from '@mui/material';
import {
  PhotoCamera, Close as CloseIcon, Edit as EditIcon,
  Logout as LogoutIcon, Delete as DeleteIcon, Add as AddIcon
} from '@mui/icons-material';
import axios from 'axios';
import { MessageCircle } from 'lucide-react';
import { Email, Person, LocationOn, Work } from '@mui/icons-material';
import UserActivityTracker from './UserActivityTracker';


const ProfileCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', // Soft blue-grey gradient
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(20),
  height: theme.spacing(20),
  border: '4px solid rgba(255,255,255,0.7)',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    opacity: 0.9
  }
}));

const StatCard = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.8)', 
  borderRadius: '15px',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4]
  }
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

const EditProfileDialog = ({ open, onClose, user, onSave }) => {
  const [editedUser, setEditedUser] = useState(user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setEditedUser({
        ...user,
        languageSkills: user.languageSkills || JSON.stringify([])
      });
    }
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
      if (!userId) throw new Error('No user ID found');
  
      
      const updatedUser = {
        ...editedUser,
        biography: editedUser.biography || '',
        goals: editedUser.goals || '',
       
        languageSkills: typeof editedUser.languageSkills === 'string' ? 
          editedUser.languageSkills : 
          JSON.stringify(editedUser.languageSkills || [])
      };
  
      console.log('Saving user data:', updatedUser); 
  
      const response = await axios.put(`http://localhost:8080/api/user/${userId}`, updatedUser);
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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
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
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
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
              label="Email"
              value={editedUser?.email || ''}
              onChange={handleChange('email')}
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
              label="Country"
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
    helperText="Enter hobbies separated by commas"
    margin="normal"
  />
</Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>Languages</Typography>
            {editedUser?.languageSkills && 
  JSON.parse(editedUser.languageSkills).map((lang, index) => (
    <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
      <TextField
        label="Language"
        value={lang.language}
        onChange={(e) => {
          const skills = JSON.parse(editedUser.languageSkills);
          skills[index].language = e.target.value;
          setEditedUser({
            ...editedUser,
            languageSkills: JSON.stringify(skills)
          });
        }}
        sx={{ flex: 1 }}
      />
      <TextField
        select
        label="Proficiency"
        value={lang.proficiency}
        onChange={(e) => {
          const skills = JSON.parse(editedUser.languageSkills);
          skills[index].proficiency = e.target.value;
          setEditedUser({
            ...editedUser,
            languageSkills: JSON.stringify(skills)
          });
        }}
        sx={{ width: '200px' }}
      >
        <MenuItem value="Native">Native</MenuItem>
        <MenuItem value="Fluent">Fluent</MenuItem>
        <MenuItem value="Intermediate">Intermediate</MenuItem>
        <MenuItem value="Basic">Basic</MenuItem>
      </TextField>
      <IconButton 
        onClick={() => {
          const skills = JSON.parse(editedUser.languageSkills);
          skills.splice(index, 1);
          setEditedUser({
            ...editedUser,
            languageSkills: JSON.stringify(skills)
          });
        }}
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  ))
}
          <Button
  startIcon={<AddIcon />}
  onClick={() => {
    const currentSkills = editedUser.languageSkills ? 
      JSON.parse(editedUser.languageSkills) : [];
    setEditedUser({
      ...editedUser,
      languageSkills: JSON.stringify([
        ...currentSkills,
        { language: '', proficiency: 'Basic' }
      ])
    });
  }}
>
  Add Language
</Button>
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
  const fileInputRef = useRef(null);
  const [selectedSection, setSelectedSection] = useState(null);
  useEffect(() => {
    const checkAuth = () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        navigate('/');
        return false;
      }
      return userId;
    };

    const fetchUserData = async () => {
      const userId = checkAuth();
      if (!userId) return;
    
      try {
        const response = await axios.get(`http://localhost:8080/api/user/${userId}`);
        if (response.data) {
          setUser({
            ...response.data,
            profilePicture: response.data.profilePicture ? 
              `http://localhost:8080${response.data.profilePicture}` : null,
            languageSkills: response.data.languageSkills || JSON.stringify([])  
          });
        } else {
          throw new Error('No data received');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem('userId');
          localStorage.removeItem('username');
          navigate('/');
        } else {
          setError('Failed to load user data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);



  const SectionDialog = ({ section, open, onClose }) => {
    if (!section) return null;
    
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              {section.icon} {section.title}
            </Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {Array.isArray(section.data) && section.data.length > 0 ? (
            <List>
              {section.data.map((item, idx) => (
                <ListItem key={idx}>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="text.secondary">
              No {section.title.toLowerCase()} yet
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    );
  };




  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append('image', file);
  
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.post(
        `http://localhost:8080/api/user/${userId}/profile-picture`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      
      const imageUrl = `http://localhost:8080${response.data.imageUrl}`;
      setUser(prev => ({ ...prev, profilePicture: imageUrl }));
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload profile picture');
    }
  };

  const handleSave = async (updatedUser) => {
    setUser(prev => ({
      ...updatedUser,
      profilePicture: prev.profilePicture,
      languageSkills: updatedUser.languageSkills || JSON.stringify([])  
    }));
  };

  const handleDelete = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      try {
        await axios.delete(`http://localhost:8080/api/user/${userId}`);
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        navigate('/');
      } catch (error) {
        console.error('Error deleting user:', error);
        setError('Failed to delete profile. Please try again.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    navigate('/');
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
      <ProfileCard elevation={5}>
        <CardContent>
          <Grid container spacing={6}>
            <Grid item xs={12} md={4} sx={{ 
              borderRight: { md: '2px solid rgba(0,0,0,0.1)' },
              position: 'relative'
            }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                mb: 4,
                position: 'relative'
              }}>
                <StyledAvatar
                  src={user.profilePicture}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {!user.profilePicture && <PhotoCamera sx={{ fontSize: 40 }} />}
                </StyledAvatar>
                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <Typography 
                  variant="h4" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  {user.firstname || 'No name set'} {user.lastname || ''}
                </Typography>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    textAlign: 'center', 
                    mb: 3,
                    color: 'text.secondary',
                    fontStyle: 'italic',
                    maxWidth: '80%'
                  }}
                >
                  {user.biography || 'No biography available'}
                </Typography>

                <Paper elevation={3} sx={{ width: '100%', mt: 2, overflow: 'hidden' }}>
      {[
        { label: 'Age', value: user.age, icon: <Person sx={{ color: 'primary.main' }}/> },
        { label: 'Email', value: user.email, icon: <Email sx={{ color: 'primary.main' }}/> },
        { label: 'Country', value: user.state, icon: <LocationOn sx={{ color: 'primary.main' }}/> },
        { label: 'Employment', value: user.employmentStatus, icon: <Work sx={{ color: 'primary.main' }}/> }
      ].map((item, index, arr) => (
        <Box key={item.label}>
          <Box sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            '&:hover': {
              bgcolor: 'rgba(0,0,0,0.02)'
            }
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              {item.icon}
              <Typography color="text.secondary" variant="body2">
                {item.label}
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              {item.value || 'Not specified'}
            </Typography>
          </Box>
          {index < arr.length - 1 && <Divider />}
        </Box>
      ))}
    </Paper>

              </Box>
            </Grid>

            <Grid item xs={12} md={8}>
             <Grid container spacing={3}>
  {[
    { 
      title: 'Languages', 
      data: user.languageSkills ? 
        JSON.parse(user.languageSkills).map(lang => 
          `${lang.language} ${
            lang.proficiency === 'Native' ? '🔵' :
            lang.proficiency === 'Fluent' ? '🟢' :
            lang.proficiency === 'Intermediate' ? '🟡' : '⚪'
          } ${lang.proficiency}`
        ) : [], 
      icon: '🌐'
    },
    { title: 'Hobbies', data: [user.hobbies], icon: '🎯' },
    { title: 'Goals', data: [user.goals], icon: '🎯' },
    { 
      title: 'Recent Activity', 
      data: [<UserActivityTracker userId={user.userId} />], 
      icon: '📋' 
    }
  ].map((section, index) => (
    <Grid item xs={12} sm={6} key={index}>
      <StatCard 
  elevation={2} 
  sx={{ 
    p: 3,
    height: 200,
    cursor: 'pointer',
    overflow: 'auto',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: 8
    }
  }}
  onClick={() => setSelectedSection(section)}
>
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
    <Typography variant="h6" sx={{ mr: 1 }}>
      {section.icon} {section.title}
    </Typography>
  </Box>
  {Array.isArray(section.data) ? 
    section.data.map((item, i) => 
      React.isValidElement(item) ? item : 
      <Typography key={i} color="text.secondary">{item}</Typography>
    ) :
    <Typography color="text.secondary">{section.data}</Typography>
  }
</StatCard>
    </Grid>
  ))}

              </Grid>

              <MessageButton 
                recipientId={user.userId}
                recipientName={`${user.firstname} ${user.lastname}`}
              />
            </Grid>
          </Grid>
        </CardContent>

        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            p: 3, 
            gap: 2,
            borderTop: '1px solid rgba(0,0,0,0.1)',
            background: 'rgba(255,255,255,0.5)'
          }}
        >
          <Button
            onClick={() => navigate('/newsfeed')} 
            variant="contained"
            color="primary"
            sx={{ 
              borderRadius: '20px',
              textTransform: 'none'
            }}
          >
            Back to Homepage
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenEditDialog(true)}
            startIcon={<EditIcon />}
            sx={{ 
              borderRadius: '20px',
              textTransform: 'none',
              px: 3
            }}
          >
            Edit Profile
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleDelete}
            sx={{ 
              borderRadius: '20px',
              textTransform: 'none'
            }}
          >
            Delete Account
          </Button>
          <Button
            variant="outlined"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{ 
              borderRadius: '20px',
              textTransform: 'none'
            }}
          >
            Logout
          </Button>
        </Box>
      </ProfileCard>

      <EditProfileDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        user={user}
        onSave={handleSave}
      />
      <SectionDialog 
      section={selectedSection} 
      open={Boolean(selectedSection)} 
      onClose={() => setSelectedSection(null)} 
    />
     
    </Box>
  );
};

export default ProfileUser;