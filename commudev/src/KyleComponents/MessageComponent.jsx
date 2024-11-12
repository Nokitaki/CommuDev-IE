import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getMessages, createMessage, updateMessage, deleteMessage } from './apiService';
import './Message.css';

const MessageComponent = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState({ dateMessage: '', messageContent: '' });
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [recentMessage, setRecentMessage] = useState(null);

    useEffect(() => {
        loadMessages();
    }, []);

    const loadMessages = async () => {
        try {
            const data = await getMessages();
            setMessages(data);
        } catch (error) {
            console.error("Error loading messages:", error);
        }
    };

    const handleDateChange = (date) => {
        setNewMessage({ ...newMessage, dateMessage: date });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMessage({ ...newMessage, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingMessageId) {
                await updateMessage(editingMessageId, newMessage);
                const updatedMessage = { ...newMessage, messageId: editingMessageId };
                setRecentMessage(updatedMessage);
                setEditingMessageId(null);
            } else {
                const createdMessage = await createMessage(newMessage);
                setRecentMessage(createdMessage);
            }
            setNewMessage({ dateMessage: '', messageContent: '' });
            loadMessages();
        } catch (error) {
            console.error("Error saving message:", error);
        }
    };

    const handleEdit = (message) => {
        setEditingMessageId(message.messageId);
        setNewMessage({ dateMessage: new Date(message.dateMessage), messageContent: message.messageContent });
    };

    const handleDelete = async (messageId) => {
        try {
            await deleteMessage(messageId);
            loadMessages();
            if (recentMessage && recentMessage.messageId === messageId) {
                setRecentMessage(null);
            }
        } catch (error) {
            console.error("Error deleting message:", error);
        }
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h2>Messages</h2>
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
            <DatePicker
                selected={newMessage.dateMessage}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select Date"
                className="small-date-picker" 
                required
/>

                <input
                    type="text"
                    name="messageContent"
                    placeholder="Content"
                    value={newMessage.messageContent}
                    onChange={handleInputChange}
                    required
                />
                <button type="submit">
                    {editingMessageId ? 'Update Message' : 'Create Message'}
                </button>
            </form>

            {recentMessage && (
                <div className="recent-message">
                    <p><strong>Date:</strong> {recentMessage.dateMessage.toLocaleDateString()}</p>
                    <p><strong>Content:</strong> {recentMessage.messageContent}</p>
                    <button onClick={() => handleEdit(recentMessage)}>Edit</button>
                    <button onClick={() => handleDelete(recentMessage.messageId)}>Delete</button>
                </div>
            )}

            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {messages.map((message) => (
                    <li key={message.messageId} className="message-item">
                        <strong>Date:</strong> {new Date(message.dateMessage).toLocaleDateString()} <br />
                        <strong>Content:</strong> {message.messageContent} <br />
                        <button onClick={() => handleEdit(message)}>Edit</button>
                        <button onClick={() => handleDelete(message.messageId)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MessageComponent;
