import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/AuthPage.css';

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
    employmentStatus: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      username: '',
      password: '',
      firstname: '',
      lastname: '',
      middleinit: '',
      dateOfBirth: '',
      age: '',
      state: '',
      employmentStatus: ''
    });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const validateForm = () => {
    if (!formData.username || !formData.password) {
      setError('Please fill in all required fields.');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }
    if (!isLogin) {
      if (!formData.firstname || !formData.lastname) {
        setError('Please fill in all required fields.');
        return false;
      }
      if (formData.age && (isNaN(formData.age) || formData.age < 0)) {
        setError('Please enter a valid age.');
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

    try {
      if (isLogin) {
        const response = await axios.post('http://localhost:8080/api/user/login', {
          username: formData.username,
          password: formData.password
        });

        if (response.status === 200 && response.data) {
          localStorage.setItem('userId', response.data.id);
          localStorage.setItem('username', response.data.username);
          
          navigate(`/user/${response.data.id}`);
        }
      } else {
        const response = await axios.post('http://localhost:8080/api/user/add', {
          ...formData,
          age: formData.age ? parseInt(formData.age) : 0
        });

        if (response.status === 201) {
          console.log('User registered successfully:', response.data);
          setIsLogin(true);
          setFormData(prev => ({
            ...prev,
            password: '', 
            username: formData.username 
          }));
          setError('Registration successful! Please login.');
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

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p className="auth-subtitle">
          {isLogin 
            ? 'Please enter your credentials to continue' 
            : 'Fill in your information to get started'}
        </p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter your username"
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {!isLogin && (
            <>
              <div className="form-group">
                <label htmlFor="firstname">First Name</label>
                <input
                  id="firstname"
                  type="text"
                  value={formData.firstname}
                  onChange={handleChange}
                  required
                  placeholder="John"
                  autoComplete="given-name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="middleinit">Middle Initial</label>
                <input
                  id="middleinit"
                  type="text"
                  value={formData.middleinit}
                  onChange={handleChange}
                  maxLength="1"
                  placeholder="M"
                  autoComplete="additional-name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastname">Last Name</label>
                <input
                  id="lastname"
                  type="text"
                  value={formData.lastname}
                  onChange={handleChange}
                  required
                  placeholder="Doe"
                  autoComplete="family-name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="dateOfBirth">Date of Birth</label>
                <input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  autoComplete="bday"
                />
              </div>

              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="25"
                />
              </div>

              <div className="form-group">
                <label htmlFor="state">State</label>
                <input
                  id="state"
                  type="text"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="CA"
                  autoComplete="address-level1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="employmentStatus">Employment Status</label>
                <input
                  id="employmentStatus"
                  type="text"
                  value={formData.employmentStatus}
                  onChange={handleChange}
                  placeholder="Employed"
                />
              </div>
            </>
          )}
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button type="button" onClick={toggleAuthMode} className="toggle-auth">
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;