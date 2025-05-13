import React from 'react';
import { Badge } from 'reactstrap';
import './NewsUpdates.css';

const NewsCard = ({ news, onRead }) => {
    const getCategoryBadge = (category) => {
        if (!category) return null;
        
        switch(category) {
            case 'update':
                return <Badge color="primary" className="category-badge" pill>Update</Badge>;
            case 'notification':
                return <Badge color="danger" className="category-badge" pill>Notice</Badge>;
            case 'feature':
                return <Badge color="success" className="category-badge" pill>New Feature</Badge>;
            case 'bugfix':
                return <Badge color="warning" className="category-badge" pill>Bug Fix</Badge>;
            default:
                return <Badge color="secondary" className="category-badge" pill>Info</Badge>;
        }
    };

    return (
        <div 
            className={`news-item ${news.read ? 'read' : 'unread'}`}
            onClick={() => onRead(news.id)}
        >
            <div className="news-header">
                <div className="d-flex align-items-center flex-grow-1">
                    {!news.read && <span className="unread-dot me-2"></span>}
                    <h6 className="news-item-title mb-0">{news.title}</h6>
                </div>
                {news.category && (
                    <div className="badge-container">
                        {getCategoryBadge(news.category)}
                    </div>
                )}
            </div>
            <p className="news-date">{news.date}</p>
            <p className="news-content">{news.content}</p>
        </div>
    );
};

export default NewsCard; 