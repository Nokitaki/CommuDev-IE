// AuthPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  Container,
  Divider,
  Grid
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon
} from '@mui/icons-material';

// Create theme
const theme = createTheme({
  typography: {
    fontFamily: '"Poppins", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstname: '',
    lastname: '',
    middleinit: '',
    dateOfBirth: '',
    age: '',
    state: '',
    employmentStatus: '',
    email: '',
    biography: '',
    goals: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Styles
  const styles = {
    mainContainer: {
      marginTop: '6%',
      minHeight: '100vh',
      background: '#e4efe4',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      py: 4,
      px: 2
    },
    logoContainer: {
      textAlign: 'center',
      marginBottom: 4,
      animation: 'fadeIn 0.5s ease-in',
    },
    brandText: {
      fontSize: '2.5rem',
      fontWeight: 800,
      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: 1,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    brandUnderline: {
      width: 80,
      height: 4,
      margin: '8px auto',
      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
      borderRadius: 2,
    },
    card: {
      width: '100%',
      borderRadius: 4,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
    },
    formContainer: {
      p: 4,
    },
    textField: {
      '& .MuiOutlinedInput-root': {
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
        },
        '&.Mui-focused': {
          backgroundColor: '#fff',
          boxShadow: '0 0 0 2px rgba(33, 150, 243, 0.2)',
        },
      },
    },
    submitButton: {
      height: 48,
      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
      color: 'white',
      boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
      '&:hover': {
        background: 'linear-gradient(45deg, #1976D2 30%, #21CBF3 90%)',
      },
    },
    dividerContainer: {
      my: 3,
    },
    toggleLink: {
      cursor: 'pointer',
      color: '#2196F3',
      fontWeight: 600,
      '&:hover': {
        textDecoration: 'underline',
      },
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Form validation
  const validateForm = () => {
    setError('');

    if (!formData.username || !formData.password) {
      setError('Username and password are required.');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }

    if (!isLogin) {
      if (!formData.firstname || !formData.lastname) {
        setError('First name and last name are required.');
        return false;
      }

      if (formData.age && (isNaN(formData.age) || formData.age < 0)) {
        setError('Please enter a valid age.');
        return false;
      }

      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        setError('Please enter a valid email address.');
        return false;
      }
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      if (isLogin) {
        const response = await axios.post('http://localhost:8080/api/user/login', {
          username: formData.username,
          password: formData.password
        });
      
        if (response.data) {
          localStorage.setItem('userId', response.data.id.toString());
          localStorage.setItem('username', response.data.username);
          setSuccessMessage('Login successful!');
          
          setTimeout(() => {
            navigate('/profileuser');
          }, 1000);
        }
      } else {
        const response = await axios.post('http://localhost:8080/api/user/add', {
          ...formData,
          age: formData.age ? parseInt(formData.age) : null
        });

        if (response.status === 201) {
          setSuccessMessage('Registration successful! Please login.');
          setTimeout(() => {
            setIsLogin(true);
            setFormData(prev => ({
              ...prev,
              password: '',
              username: formData.username
            }));
          }, 1000);
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(
        err.response?.data?.message ||
        (isLogin ? 'Invalid username or password.' : 'An error occurred during registration.')
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccessMessage('');
    setFormData({
      username: '',
      password: '',
      firstname: '',
      lastname: '',
      middleinit: '',
      dateOfBirth: '',
      age: '',
      state: '',
      employmentStatus: '',
      email: '',
      biography: '',
      goals: ''
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={styles.mainContainer}>
        <Container maxWidth="sm">
          {/* Logo Section */}
          <Box sx={styles.logoContainer}>
            <Typography component="h1" sx={styles.brandText}>
              <span>{'<'}</span>
              CommuDev
              <span>{'>'}</span>
            </Typography>
            <Box sx={styles.brandUnderline} />
            <Typography
              variant="subtitle1"
              sx={{
                color: '#666',
                mt: 1,
                fontWeight: 500,
              }}
            >
              Connect. Collaborate. Create.
            </Typography>
          </Box>

          {/* Form Card */}
          <Card sx={styles.card}>
            <CardContent sx={styles.formContainer}>
              <Typography 
                variant="h5" 
                component="h2" 
                align="center" 
                gutterBottom
                sx={{ fontWeight: 700, mb: 3 }}
              >
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              {successMessage && (
                <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                  {successMessage}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="username"
                      label="Username"
                      value={formData.username}
                      onChange={handleChange}
                      sx={styles.textField}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="password"
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      sx={styles.textField}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="primary" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {!isLogin && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          required
                          fullWidth
                          id="firstname"
                          label="First Name"
                          value={formData.firstname}
                          onChange={handleChange}
                          sx={styles.textField}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          required
                          fullWidth
                          id="lastname"
                          label="Last Name"
                          value={formData.lastname}
                          onChange={handleChange}
                          sx={styles.textField}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          id="email"
                          label="Email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          sx={styles.textField}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <EmailIcon color="primary" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id="age"
                          label="Age"
                          type="number"
                          value={formData.age}
                          onChange={handleChange}
                          sx={styles.textField}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id="state"
                          label="State"
                          value={formData.state}
                          onChange={handleChange}
                          sx={styles.textField}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          id="employmentStatus"
                          label="Employment Status"
                          value={formData.employmentStatus}
                          onChange={handleChange}
                          sx={styles.textField}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          id="biography"
                          label="Biography"
                          multiline
                          rows={3}
                          value={formData.biography}
                          onChange={handleChange}
                          sx={styles.textField}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          id="goals"
                          label="Goals"
                          multiline
                          rows={2}
                          value={formData.goals}
                          onChange={handleChange}
                          sx={styles.textField}
                        />
                      </Grid>
                    </>
                  )}

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      fullWidth
                      disabled={loading}
                      sx={styles.submitButton}
                    >
                      {loading ? (
                        <CircularProgress size={24} sx={{ color: 'white' }} />
                      ) : (
                        isLogin ? 'Sign In' : 'Create Account'
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </form>

              <Box sx={styles.dividerContainer}>
                <Divider>
                  <Typography variant="body2" color="textSecondary">
                    OR
                  </Typography>
                </Divider>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2">
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                  <Link
                    component="button"
                    variant="body2"
                    onClick={toggleAuthMode}
                    sx={styles.toggleLink}
                  >
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </Link>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default AuthPage;