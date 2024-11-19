import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getMessages, createMessage, updateMessage, deleteMessage } from './apiService';
import './Message.css';

const CommuDevLogo = () => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        marginBottom: '1rem'
    }}>
        <div style={{
            backgroundColor: '#16a34a',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontSize: '1.75rem',
            fontWeight: 'bold',
            letterSpacing: '0.05em',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
            Commu<span style={{ color: '#bbf7d0' }}>Dev</span>
        </div>
    </div>
);

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
<<<<<<< Updated upstream
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
=======
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
                    <CommuDevLogo />
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
                            className="datepicker-input"
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
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            {editingMessageId ? 'Update Message' : 'Post Message'}
                        </button>
                    </form>
>>>>>>> Stashed changes
                </div>
            )}

<<<<<<< Updated upstream
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
=======
                <div style={{ display: 'grid', gap: '1rem' }}>
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
                                    transition: 'transform 0.2s ease'
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
                                            transition: 'all 0.2s ease'
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
                                            transition: 'all 0.2s ease'
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
>>>>>>> Stashed changes
        </div>
    );
};

export default MessageComponent;
