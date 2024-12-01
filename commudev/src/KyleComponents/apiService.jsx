import axios from 'axios';
const API_URL = 'http://localhost:8080/api/messages';

export const getMessages = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching messages:", error);
        throw error;
    }
};

export const createMessage = async (message) => {
    try {
        const response = await axios.post(API_URL, message);
        return response.data;
    } catch (error) {
        console.error("Error creating message:", error);
        throw error;
    }
};

export const updateMessage = async (messageId, message) => {
    try {
        const response = await axios.put(`${API_URL}/${messageId}`, message);
        return response.data;
    } catch (error) {
        console.error("Error updating message:", error);
        throw error;
    }
};

export const deleteMessage = async (messageId) => {
    try {
        await axios.delete(`${API_URL}/${messageId}`);
    } catch (error) {
        console.error("Error deleting message:", error);
        throw error;
    }
};
