import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMessage({ ...newMessage, [name]: value });
    };

    const handleDateChange = (date) => {
        setNewMessage({ ...newMessage, dateMessage: date });
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
        setNewMessage({ dateMessage: message.dateMessage, messageContent: message.messageContent });
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
                    placeholderText="Select Date"
                    dateFormat="MMMM d, yyyy"
                    className="date-input"
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
                <div style={{ border: '2px solid black', padding: '10px', marginBottom: '20px', color: 'black' }}>
                    <p style={{ color: 'black' }}><strong>Date:</strong> {recentMessage.dateMessage.toString()}</p>
                    <p style={{ color: 'black' }}><strong>Content:</strong> {recentMessage.messageContent}</p>
                    <button onClick={() => handleEdit(recentMessage)}>Edit</button>
                    <button onClick={() => handleDelete(recentMessage.messageId)}>Delete</button>
                </div>
            )}

            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {messages.map((message) => (
                    <li key={message.messageId} style={{ marginBottom: '10px', color: 'black' }}>
                        <strong>Date:</strong> {message.dateMessage} <br />
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
