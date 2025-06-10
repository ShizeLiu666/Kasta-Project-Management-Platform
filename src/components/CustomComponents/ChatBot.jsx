import React, { useState, useRef, useEffect } from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    Button
} from 'reactstrap';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import SupportModal from './SupportModal';
import './ChatBot.css';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [supportModalOpen, setSupportModalOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! I'm Kasta Assistant. I can help you with common questions. Please select the help you need:",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    // Function to render message text with clickable links
    const renderMessageWithLinks = (text) => {
        const urlRegex = /(https?:\/\/[^\s]+|\/downloads\/[^\s]+|DOWNLOAD:[^\s]+)/g;
        const parts = text.split(urlRegex);
        
        return parts.map((part, index) => {
            if (urlRegex.test(part)) {
                const isDownload = part.startsWith('/downloads/') || part.startsWith('DOWNLOAD:');
                const isExternalLink = part.startsWith('http');
                
                if (isDownload) {
                    const downloadPath = part.startsWith('DOWNLOAD:') ? part.replace('DOWNLOAD:', '') : part;
                    return (
                        <a 
                            key={index}
                            href={downloadPath}
                            download="Kasta Commission System User Guide.docx"
                            style={{
                                color: '#fbcd0b',
                                textDecoration: 'underline',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                // Force download
                                const link = document.createElement('a');
                                link.href = downloadPath;
                                link.download = 'Kasta Commission System User Guide.docx';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }}
                        >
                            📥 Download User Guide
                        </a>
                    );
                } else if (isExternalLink) {
                    return (
                        <a 
                            key={index}
                            href={part}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: '#1e88e5',
                                textDecoration: 'underline',
                                fontWeight: 'bold'
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            {part}
                        </a>
                    );
                }
            }
            return part.split('\n').map((line, lineIndex) => (
                <div key={`${index}-${lineIndex}`}>{line}</div>
            ));
        });
    };

    const predefinedQuestions = [
        {
            id: 1,
            question: "I have a problem or need help",
            answer: "I'll open a support form for you to describe your issue. Our team will get back to you as soon as possible!"
        },
        {
            id: 2,
            question: "How to use Kasta Commission System?",
            answer: "You can download our comprehensive user guide by clicking the link below:\n\nKasta Commission System User Guide (Download)\nDOWNLOAD:/downloads/Kasta%20Commission%20System%20User%20Guide.docx\n\nThis guide contains step-by-step instructions on how to effectively use the Kasta Commission System for your projects."
        },
        {
            id: 3,
            question: "How can I learn about Kasta products?",
            answer: "Please visit this link to learn more about our products: https://kasta.com.au/our-products/\n\nYou'll find information about our App, Gateways, Interfaces, Power solutions, Lighting, Air Movement, Window controls, Door and Gate systems, and Irrigation products."
        },
        // {
        //     id: 4,
        //     question: "How to view operation logs?",
        //     answer: "To view operation logs:\n1. Click 'Operation Log' in the sidebar\n2. Filter by time range\n3. Filter by operation type\n4. Click details to view specific operation information"
        // },
        // {
        //     id: 5,
        //     question: "How to modify personal profile?",
        //     answer: "To modify personal profile:\n1. Click your avatar in the top right corner\n2. Select 'Edit Profile'\n3. Modify the information you want to update\n4. Click 'Save' to confirm changes"
        // }
    ];

    const quickReplies = [
        "I have a problem or need help",
        "How to use Kasta Commission System?",
        "How can I learn about Kasta products?",
        // "What to do if I forgot my password?",
        // "How to view operation logs?",
        // "How to modify personal profile?"
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const toggleSupportModal = () => {
        setSupportModalOpen(!supportModalOpen);
    };

    const handleQuickReply = (question) => {
        const userMessage = {
            id: Date.now(),
            text: question,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true);

        // Simulate bot thinking time
        setTimeout(() => {
            const predefinedQ = predefinedQuestions.find(q => q.question === question);
            const botResponse = {
                id: Date.now() + 1,
                text: predefinedQ ? predefinedQ.answer : "Sorry, I can't answer this question at the moment. Please contact customer service for more help.",
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);

            // If it's the support question, open the support modal after a short delay
            if (question === "I have a problem or need help") {
                setTimeout(() => {
                    toggleSupportModal();
                }, 1000);
            }
        }, 1000);
    };

    const handleSupportSubmit = (supportData) => {
        // Add a confirmation message from bot
        const confirmationMessage = {
            id: Date.now(),
            text: "Thank you for your support request! We will process it as soon as possible. Thank you for your patience.",
            sender: 'bot',
            timestamp: new Date()
        };
        setMessages(prev => [...prev, confirmationMessage]);
    };

    return (
        <>
            {/* Chat Window */}
            {isOpen && (
                <div className="chatbot-container">
                    <Card className="chatbot-card">
                        <CardHeader className="chatbot-header">
                            <div className="d-flex align-items-center">
                                <SmartToyIcon className="me-2" style={{ color: '#FFF' }} />
                                <span className="fw-bold">Kasta Assistant</span>
                                <div className="ms-auto">
                                    <Button
                                        color="link"
                                        size="sm"
                                        onClick={toggleChat}
                                        className="text-muted p-1"
                                    >
                                        <CloseIcon />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardBody className="chatbot-body">
                            <div className="messages-container">
                                {messages.map((message) => (
                                    <div key={message.id} className={`message ${message.sender}`}>
                                        <div className="message-avatar">
                                            {message.sender === 'bot' ? (
                                                <SmartToyIcon style={{ color: '#fbcd0b', fontSize: '20px' }} />
                                            ) : (
                                                <PersonIcon style={{ color: '#1e88e5', fontSize: '20px' }} />
                                            )}
                                        </div>
                                        <div className="message-content">
                                            <div className="message-text">
                                                {renderMessageWithLinks(message.text)}
                                            </div>
                                            <div className="message-time">
                                                {message.timestamp.toLocaleTimeString('en-US', { 
                                                    hour: '2-digit', 
                                                    minute: '2-digit' 
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="message bot">
                                        <div className="message-avatar">
                                            <SmartToyIcon style={{ color: '#fbcd0b', fontSize: '20px' }} />
                                        </div>
                                        <div className="message-content">
                                            <div className="typing-indicator">
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                            
                            {/* Quick Reply Buttons */}
                            <div className="quick-replies">
                                <div className="quick-replies-title">How can I help you?</div>
                                <div className="quick-replies-buttons">
                                    {quickReplies.map((reply, index) => (
                                        <Button
                                            key={index}
                                            size="sm"
                                            outline
                                            color="primary"
                                            className="quick-reply-btn"
                                            onClick={() => handleQuickReply(reply)}
                                        >
                                            {reply}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            )}

            {/* Floating Button */}
            <div className="chatbot-float-button" onClick={toggleChat}>
                <ChatIcon style={{ fontSize: '24px', color: 'white' }} />
                {!isOpen && <div className="notification-badge">?</div>}
            </div>

            {/* Support Modal */}
            <SupportModal
                isOpen={supportModalOpen}
                toggle={toggleSupportModal}
                onSubmit={handleSupportSubmit}
            />
        </>
    );
};

export default ChatBot; 