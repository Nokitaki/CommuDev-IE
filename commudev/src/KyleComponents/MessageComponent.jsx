import React, { useState, useEffect } from 'react';
import { getMessages, createMessage, updateMessage, deleteMessage } from './apiService';

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
        setNewMessage({ dateMessage: message.dateMessage, messageContent: message.messageContent }); // Populate input fields
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
                <input
                    type="text"
                    name="dateMessage"
                    placeholder="Date"
                    value={newMessage.dateMessage}
                    onChange={handleInputChange}
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
                    {editingMessageId ? 'Update Message' : 'Create Message'} {/* Button changes based on edit mode */}
                </button>
            </form>

            {recentMessage && (
                <div style={{ border: '2px solid black', padding: '10px', marginBottom: '20px', color: 'black' }}>
                    <p style={{ color: 'black' }}><strong>Date:</strong> {recentMessage.dateMessage}</p>
                    <p style={{ color: 'black' }}><strong>Content:</strong> {recentMessage.messageContent}</p>
                    <button onClick={() => handleEdit(recentMessage)}>Edit</button> {/* Edit button for recent message */}
                    <button onClick={() => handleDelete(recentMessage.messageId)}>Delete</button>
                </div>
            )}

            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {messages.map((message) => (
                    <li key={message.messageId} style={{ marginBottom: '10px', color: 'black' }}>
                        <strong>Date:</strong> {message.dateMessage} <br />
                        <strong>Content:</strong> {message.messageContent} <br />
                        <button onClick={() => handleEdit(message)}>Edit</button> {/* Edit button for each message */}
                        <button onClick={() => handleDelete(message.messageId)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MessageComponent;
