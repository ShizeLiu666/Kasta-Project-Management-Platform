import React from 'react';
import { Badge } from 'reactstrap';
import './NewsUpdates.css';

const NewsCard = ({ news }) => {
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
                return <Badge color="success" className="category-badge" pill>Fixed</Badge>;
            default:
                return <Badge color="secondary" className="category-badge" pill>Info</Badge>;
        }
    };

    // 根据category添加相应的CSS类名
    const getCategoryClass = (category) => {
        switch(category) {
            case 'notification':
                return 'news-item-notification';
            case 'bugfix':
                return 'news-item-bugfix';
            case 'update':
                return 'news-item-update';
            case 'feature':
                return 'news-item-feature';
            default:
                return 'news-item-default';
        }
    };

    const categoryClass = getCategoryClass(news.category);

    return (
        <div className={`news-item ${news.read ? 'read' : 'unread'} ${categoryClass}`}>
            <div className="news-header">
                <div className="d-flex align-items-center flex-grow-1">
                    <h6 className="news-item-title mb-0">{news.title}</h6>
                </div>
                {news.category && (
                    <div className="badge-container">
                        {getCategoryBadge(news.category)}
                    </div>
                )}
            </div>
            <p className="news-content">{news.content}</p>
        </div>
    );
};

export default NewsCard; 