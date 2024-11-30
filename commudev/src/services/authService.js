const API_URL = 'http://localhost:8080/api/auth';

export const authService = {
    login: async (username, password) => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
    
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }
    
            // Make sure you're storing the correct userId
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId); // Check this value
            console.log('Stored userId:', data.userId); // Debug log
            
            return data;
        } catch (error) {
            throw error;
        }
    },
    
    register: async (userData) => {
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }
            
            return data;
        } catch (error) {
            throw error;
        }
    },

    logout: async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_URL}/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Logout failed');
            }

            // Clear local storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } catch (error) {
            throw error;
        }
    },
};