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