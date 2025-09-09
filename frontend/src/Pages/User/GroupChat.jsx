import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPaperPlane, FaImage, FaUser } from 'react-icons/fa';
import axios from 'axios';
import io from 'socket.io-client';
import Base_url from '../config';
import './GroupChat.css';

const GroupChat = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const token = sessionStorage.getItem('accessToken');
    const userId = sessionStorage.getItem('userId');
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);
    const [file, setFile] = useState(null);
    const fileInputRef = useRef();
    const messagesEndRef = useRef();
    const messagesContainerRef = useRef();

    useEffect(() => {
        const newSocket = io('http://localhost:5500', {
            withCredentials: true,
        });
        setSocket(newSocket);

        const fetchData = async () => {
            try {
                const [groupRes, messagesRes] = await Promise.all([
                    axios.get(`${Base_url}/groups/getgroupdata/${groupId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${Base_url}/messages/view/${groupId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                setGroup(groupRes.data);
                setMessages(messagesRes.data);
                setLoading(false);

                newSocket.emit('joinGroup', groupId);
            } catch (error) {
                console.error('Fetch error:', error);
                navigate(-1);
            }
        };

        fetchData();

        newSocket.on('receiveMessage', (message) => {
            console.log('📩 New message received:', message);
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [groupId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() && !file) return;

        try {
            let fileUrl = null;

            if (file) {
                const formData = new FormData();
                formData.append('file', file);

                const uploadRes = await axios.post(`${Base_url}/upload/file`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                });

                fileUrl = uploadRes.data.url;
            }

            socket.emit('sendMessage', {
                groupId,
                userId,
                content: newMessage,
                fileUrl
            });

            setNewMessage('');
            setFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';

        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    if (loading) {
        return (
            <div className="chat-loading">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="chat-container">
            {/* Chat Header */}
            <div className="chat-header">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <FaArrowLeft size={20} />
                </button>
                <div className="group-info">
                    <h2>{group?.name}</h2>
                    <p>{group?.users?.length || 0} members</p>
                </div>
            </div>

            {/* Messages */}
            <div className="messages-container" ref={messagesContainerRef}>
                {messages.length === 0 ? (
                    <div className="no-messages">
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    <ul className="messages-list">
                        {messages.map((message) => (
                            <li
                                key={message._id}
                                className={`message-item ${String(message.sender._id) === userId ? 'sent' : 'received'}`}
                            >
                                <div className="message-content">
                                    <div className="sender-avatar">
                                        {message.sender.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="message-bubble">
                                        <span className="sender-name" style={{ textTransform: 'capitalize' }}>
                                            {message.sender.name}
                                        </span>
                                        {message.content && <p className="message-text">{message.content}</p>}
                                        {message.file && (
                                            <div className="message-file">
                                                {/\.(jpeg|jpg|gif|png|webp)$/i.test(message.file) ? (
                                                    <img src={message.file} alt="Attachment" />
                                                ) : (
                                                    <a href={message.file} target="_blank" rel="noopener noreferrer">
                                                        View File
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                        <span className="message-time">
                                            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        ))}
                        <div ref={messagesEndRef} />
                    </ul>
                )}
            </div>

            {/* Input Box */}
            <form className="message-input-container" onSubmit={handleSendMessage}>
                {file && (
                    <div className="file-preview">
                        <span>{file.name}</span>
                        <button onClick={() => setFile(null)}>×</button>
                    </div>
                )}
                <div className="input-wrapper">
                    <div className="file-input">
                        <input
                            type="file"
                            id="file-upload"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*, .pdf, .doc, .docx"
                        />
                        <label htmlFor="file-upload">
                            <FaImage className="file-icon" />
                        </label>
                    </div>
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button type="submit" disabled={!newMessage.trim() && !file}>
                        <FaPaperPlane className="send-icon" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default GroupChat;