import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
 
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };
 
  const validateForm = () => {
    // Reset previous errors
    setError('');
 
    // Common validations for both login and register
    if (!formData.username || !formData.password) {
      setError('Username and password are required.');
      return false;
    }
 
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }
 
    // Additional validations for registration
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
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
 
    setLoading(true);
    setError('');
    setSuccessMessage('');
 
    try {
      if (isLogin) {
        // Login request
        const response = await axios.post('http://localhost:8080/api/user/login', {
          username: formData.username,
          password: formData.password
        });
 
        if (response.data) {
          // Make sure to store the id from the response
          localStorage.setItem('userId', response.data.id.toString()); // Convert to string
          localStorage.setItem('username', response.data.username);
          setSuccessMessage('Login successful!');
          // Short delay to show success message
          setTimeout(() => {
            navigate('/profileuser');
          }, 1000);
        }
      } else {
        // Register request
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
              // Keep username for convenience
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
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Card sx={{ width: '100%', mt: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography component="h1" variant="h5" align="center" gutterBottom>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </Typography>
 
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
              {isLogin
                ? 'Please enter your credentials to continue'
                : 'Fill in your information to get started'}
            </Typography>
 
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
 
            {successMessage && (
              <Alert severity="success" sx={{ mb: 2 }}>
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
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon />
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
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
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
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon />
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
                      />
                    </Grid>
 
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        id="state"
                        label="State"
                        value={formData.state}
                        onChange={handleChange}
                      />
                    </Grid>
 
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        id="employmentStatus"
                        label="Employment Status"
                        value={formData.employmentStatus}
                        onChange={handleChange}
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
                      />
                    </Grid>
                  </>
                )}
 
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{ mt: 2 }}
                  >
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      isLogin ? 'Sign In' : 'Create Account'
                    )}
                  </Button>
                </Grid>
              </Grid>
            </form>
 
            <Box sx={{ mt: 3 }}>
              <Divider>
                <Typography variant="body2" color="text.secondary">
                  OR
                </Typography>
              </Divider>
            </Box>
 
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={toggleAuthMode}
                  sx={{ textDecoration: 'none' }}
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};
 
export default AuthPage;