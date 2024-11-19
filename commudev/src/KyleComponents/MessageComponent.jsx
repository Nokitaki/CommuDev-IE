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

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f0fff4 0%, #dcfce7 100%)',
            padding: '2rem 1rem',
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L45 15H15L30 0z' fill='%2386efac' fill-opacity='0.2'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
        }}>
            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                padding: '2rem',
                backdropFilter: 'blur(8px)'
            }}>
                <div style={{
                    textAlign: 'center',
                    marginBottom: '2rem'
                }}>
                    <svg 
                        viewBox="0 0 24 24" 
                        style={{
                            width: '48px',
                            height: '48px',
                            margin: '0 auto 1rem',
                            color: '#16a34a'
                        }}
                    >
                        <path 
                            fill="currentColor" 
                            d="M17.75 16.75L12 12.75L6.25 16.75L12 4.75L17.75 16.75ZM12 13.75L15.75 16.25L12 8.75L8.25 16.25L12 13.75Z"
                        />
                    </svg>
                    <h1 style={{
                        color: '#166534',
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        marginBottom: '0.5rem'
                    }}>Community Development</h1>
                    <p style={{
                        color: '#16a34a',
                        fontSize: '1.1rem'
                    }}>Share your ideas and contribute to our community's growth</p>
                </div>

                <div style={{
                    backgroundColor: 'rgba(240, 253, 244, 0.8)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    marginBottom: '2rem',
                    border: '1px solid #bbf7d0',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
                }}>
                    <form onSubmit={handleSubmit}>
                        <DatePicker
                            selected={newMessage.dateMessage}
                            onChange={handleDateChange}
                            placeholderText="Select Date"
                            dateFormat="dd/MM/yyyy"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                marginBottom: '1rem',
                                borderRadius: '8px',
                                border: '2px solid #bbf7d0',
                                transition: 'all 0.2s ease'
                            }}
                        />

                        <input
                            type="text"
                            name="messageContent"
                            placeholder="Type your message here..."
                            value={newMessage.messageContent}
                            onChange={handleInputChange}
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                marginBottom: '1rem',
                                borderRadius: '8px',
                                border: '2px solid #bbf7d0',
                                transition: 'all 0.2s ease'
                            }}
                        />

                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                backgroundColor: '#16a34a',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                ':hover': {
                                    backgroundColor: '#15803d',
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                                }
                            }}
                        >
                            {editingMessageId ? 'Update Message' : 'Post Message'}
                        </button>
                    </form>
                </div>

                <div style={{
                    display: 'grid',
                    gap: '1rem'
                }}>
                    {messages.length > 0 ? (
                        messages.map((message) => (
                            <div
                                key={message.messageId}
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: '10px',
                                    padding: '1.5rem',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                                    borderLeft: '4px solid #16a34a',
                                    transition: 'transform 0.2s ease',
                                    ':hover': {
                                        transform: 'translateX(4px)'
                                    }
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '0.75rem',
                                    alignItems: 'center'
                                }}>
                                    <span style={{
                                        backgroundColor: '#f0fdf4',
                                        color: '#16a34a',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '9999px',
                                        fontSize: '0.875rem',
                                        fontWeight: '500'
                                    }}>
                                        {message.dateMessage}
                                    </span>
                                </div>
                                <p style={{
                                    color: '#374151',
                                    marginBottom: '1rem',
                                    lineHeight: '1.5'
                                }}>{message.messageContent}</p>
                                <div style={{
                                    display: 'flex',
                                    gap: '0.75rem'
                                }}>
                                    <button
                                        onClick={() => handleEdit(message)}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            backgroundColor: '#dcfce7',
                                            color: '#166534',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontWeight: '500',
                                            transition: 'all 0.2s ease',
                                            ':hover': {
                                                backgroundColor: '#bbf7d0'
                                            }
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(message.messageId)}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            backgroundColor: '#fee2e2',
                                            color: '#991b1b',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontWeight: '500',
                                            transition: 'all 0.2s ease',
                                            ':hover': {
                                                backgroundColor: '#fecaca'
                                            }
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{
                            textAlign: 'center',
                            color: '#16a34a',
                            fontStyle: 'italic',
                            padding: '2rem'
                        }}>No messages yet. Be the first to share!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageComponent;