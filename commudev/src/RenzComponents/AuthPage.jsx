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
  Grid,
  Stack
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Google as GoogleIcon,
  Facebook as FacebookIcon,
  Apple as AppleIcon,
} from '@mui/icons-material';
import logo from '../assets/prof/logo.png';
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
    email: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Styles
  const styles = {
    mainContainer: {
      minHeight: '100vh',
      background: '#e4efe4',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden',
    },
    card: {
      display: 'flex',
      width: '100%',
      maxWidth: '1200px',
      minHeight: '600px',
      borderRadius: '24px',
      overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      position: 'relative',
      background: 'white',
    },
    leftSection: {
      flex: 1,
      background: `linear-gradient(135deg, #99FF99 0%, #2196F3 100%)`,
      display: { xs: 'none', md: 'flex' },
      flexDirection: 'column',
      position: 'relative',
      padding: '3rem',
      color: 'white',
    },
    rightSection: {
      flex: 1,
      background: 'white',
      padding: '3rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    formContainer: {
      width: '100%',
      maxWidth: '400px',
    },
    textField: {
      '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        backgroundColor: 'white',
        '&.Mui-focused': {
          boxShadow: '0 0 0 2px rgba(33, 150, 243, 0.2)',
        },
      },
    },
    submitButton: {
      height: 48,
      borderRadius: '12px',
      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
      color: 'white',
      fontSize: '1rem',
      fontWeight: 600,
      '&:hover': {
        background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
      },
    },
    socialButton: {
      width: '60px',
      height: '60px',
      borderRadius: '12px',
      border: '1px solid #e0e0e0',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
      },
    },
    decorativeImage: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: 'auto',
      opacity: 0.2,
    },
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
            navigate('/newsfeed');
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
      email: ''
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={styles.mainContainer}>
        <Card sx={styles.card}>
          
          {/* Left Section */}
          <Box sx={styles.leftSection}>
            <Typography variant="h3" component="h1" sx={{ color: '#40694b',mb: 2, fontWeight: 'bold' }}>
              CommuDev
            </Typography>
            <Typography variant="h6" sx={{ color: '#40694b', mb: 4 }}>
              Connect. Collaborate. Create.
            </Typography>
            <Box 
              component="img" 
              src={logo}
              alt="Decorative"
              sx={{
                width: '100%',
                height: 'auto',
                objectFit: 'cover',
                borderRadius: '16px',
                mt: 'auto'
              }}
            />
            <Box 
              component="img" 
              src="../assets/prof/logo.png?height=100&width=600" 
              alt="Decorative landmarks"
              sx={styles.decorativeImage}
            />
          </Box>

          {/* Right Section */}
          <Box sx={styles.rightSection}>
            <Box sx={styles.formContainer}>
              <Typography 
                variant="h4" 
                component="h2" 
                sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}
              >
                Welcome
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ mb: 4, textAlign: 'center', color: 'text.secondary' }}
              >
                {isLogin ? 'Login with Email' : 'Create your account'}
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
                <Stack spacing={2.5}>
                  <TextField
                    required
                    fullWidth
                    id="username"
                    label="Email"
                    value={formData.username}
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

                  {!isLogin && (
                    <>
                      <Stack direction="row" spacing={2}>
                        <TextField
                          required
                          fullWidth
                          id="firstname"
                          label="First Name"
                          value={formData.firstname}
                          onChange={handleChange}
                          sx={styles.textField}
                        />
                        <TextField
                          required
                          fullWidth
                          id="lastname"
                          label="Last Name"
                          value={formData.lastname}
                          onChange={handleChange}
                          sx={styles.textField}
                        />
                      </Stack>

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

                      <Stack direction="row" spacing={2}>
                        <TextField
                          fullWidth
                          id="age"
                          label="Age"
                          type="number"
                          value={formData.age}
                          onChange={handleChange}
                          sx={styles.textField}
                        />
                        <TextField
                          fullWidth
                          id="state"
                          label="State"
                          value={formData.state}
                          onChange={handleChange}
                          sx={styles.textField}
                        />
                      </Stack>

                      <TextField
                        fullWidth
                        id="employmentStatus"
                        label="Employment Status"
                        value={formData.employmentStatus}
                        onChange={handleChange}
                        sx={styles.textField}
                      />
                    </>
                  )}

                  <Typography 
                    variant="body2" 
                    align="right" 
                    sx={{ color: 'text.secondary', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                  >
                    Forgot your password?
                  </Typography>

                  <Button
                    type="submit"
                    fullWidth
                    disabled={loading}
                    sx={styles.submitButton}
                  >
                    {loading ? (
                      <CircularProgress size={24} sx={{ color: 'white' }} />
                    ) : (
                      'LOGIN'
                    )}
                  </Button>
                </Stack>
              </form>

              <Box sx={{ my: 3 }}>
                <Divider>
                  <Typography variant="body2" sx={{ color: 'text.secondary', px: 2 }}>
                    OR
                  </Typography>
                </Divider>
              </Box>

              <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 3 }}>
                <Button variant="outlined" sx={styles.socialButton}>
                  <GoogleIcon />
                </Button>
                <Button variant="outlined" sx={styles.socialButton}>
                  <FacebookIcon />
                </Button>
                <Button variant="outlined" sx={styles.socialButton}>
                  <AppleIcon />
                </Button>
              </Stack>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <Link
                    component="button"
                    variant="body2"
                    onClick={toggleAuthMode}
                    sx={{
                      color: 'primary.main',
                      fontWeight: 600,
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    Register Now
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Card>
      </Box>
    </ThemeProvider>
  );
};

export default AuthPage;

