import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { getMessages, createMessage, updateMessage, deleteMessage } from './apiService';

const MessageComponent = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState({ dateMessage: '', messageContent: '' });
    const [editingMessageId, setEditingMessageId] = useState(null);

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
                setMessages(messages.map((msg) => (msg.messageId === editingMessageId ? updatedMessage : msg))); 
                setEditingMessageId(null);
            } else {
                const createdMessage = await createMessage(newMessage); 
                setMessages([...messages, createdMessage]);
            }
            setNewMessage({ dateMessage: '', messageContent: '' });
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
            setMessages(messages.filter((message) => message.messageId !== messageId));
        } catch (error) {
            console.error("Error deleting message:", error);
        }
    };

    const handleCancelEdit = () => {
        setEditingMessageId(null);
        setNewMessage({ dateMessage: '', messageContent: '' });
    };

    return (
        <div style={{
            maxWidth: '600px',
            margin: '20px auto',
            padding: '20px',
            borderRadius: '8px',
            backgroundColor: '#fff',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            border: '1px solid #ddd'
        }}>
            <h2 style={{
                color: '#1E90FF',
                textAlign: 'center',
                fontWeight: 'bold',
                marginBottom: '20px'
            }}>Post Your Message</h2>
            
            <form onSubmit={handleSubmit} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                marginBottom: '20px'
            }}>
                <DatePicker
                    selected={newMessage.dateMessage}
                    onChange={handleDateChange}
                    placeholderText="Select Date"
                    dateFormat="dd/MM/yyyy"
                    style={{
                        padding: '10px',
                        fontSize: '16px',
                        borderRadius: '4px',
                        border: '1px solid #1E90FF',
                        backgroundColor: '#fff',
                        color: '#000'
                    }}
                />

                <input
                    type="text"
                    name="messageContent"
                    placeholder="Type your message..."
                    value={newMessage.messageContent}
                    onChange={handleInputChange}
                    required
                    style={{
                        padding: '10px',
                        fontSize: '16px',
                        borderRadius: '4px',
                        border: '1px solid #1E90FF',
                        backgroundColor: '#fff',
                        color: '#000'
                    }}
                />

                <button type="submit" style={{
                    padding: '12px 0',
                    fontSize: '16px',
                    borderRadius: '4px',
                    backgroundColor: '#1E90FF',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    marginTop: '10px'
                }}>
                    {editingMessageId ? 'Update Message' : 'Add Message'}
                </button>
            </form>

            {messages.length > 0 ? (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {messages.map((message) => (
                        <li key={message.messageId} style={{
                            padding: '15px',
                            border: '1px solid #1E90FF',
                            borderRadius: '8px',
                            marginBottom: '15px',
                            backgroundColor: '#f9f9f9',
                            color: '#000'
                        }}>
                            <p><strong>Date:</strong> {message.dateMessage}</p>
                            <p><strong>Message:</strong> {message.messageContent}</p>
                            <button onClick={() => handleEdit(message)} style={{
                                marginRight: '5px',
                                padding: '8px 15px',
                                backgroundColor: '#1E90FF',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}>
                                Edit
                            </button>
                            <button onClick={() => handleDelete(message.messageId)} style={{
                                padding: '8px 15px',
                                backgroundColor: '#FF6347',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}>
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p style={{
                    textAlign: 'center',
                    color: '#aaa',
                    fontStyle: 'italic'
                }}>No posts available.</p>
            )}
        </div>
    );
};

export default MessageComponent;
