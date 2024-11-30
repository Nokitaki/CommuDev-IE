import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
};

export const userService = {
    getUserProfile: async (userId) => {
        try {
            const response = await axios.get(`${API_URL}/users/${userId}`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateProfile: async (userId, userData) => {
        try {
            const response = await axios.put(`${API_URL}/users/${userId}`, userData, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteProfile: async (userId) => {
        try {
            await axios.delete(`${API_URL}/users/${userId}`, {
                headers: getAuthHeader()
            });
        } catch (error) {
            throw error;
        }
    }
};