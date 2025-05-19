import React from 'react';
import { CardTitle, Badge } from 'reactstrap';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NewsCard from './NewsCard';
import './NewsUpdates.css';

const NewsUpdates = () => {
    // 系统通知
    const newsItems = [
        {
            id: 1,
            title: 'User Registration Notice',
            content: 'This system currently only displays Network content for users registered on the Cloud platform',
            read: false
        },
        {
            id: 2,
            title: 'Testing Phase Announcement',
            content: 'The current website is in testing phase. We apologize for any issues and appreciate your understanding',
            read: false
        }
    ];

    const unreadCount = newsItems.filter(item => !item.read).length;

    return (
        <div className="news-updates-card">
            <div className="news-card-body">
                <CardTitle tag="h5" className="news-title">
                    <div className="notification-icon-wrapper">
                        <NotificationsIcon style={{ fontSize: 20 }} className="me-2" />
                    </div>
                    Notifications
                    <Badge className="ms-2 unread-badge" pill>
                        {unreadCount}
                    </Badge>
                </CardTitle>
                
                <div className="news-container">
                    {newsItems.map((news) => (
                        <NewsCard 
                            key={news.id}
                            news={news}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NewsUpdates; 