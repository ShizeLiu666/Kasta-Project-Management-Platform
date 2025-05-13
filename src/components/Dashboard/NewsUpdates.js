import React, { useState } from 'react';
import { CardTitle, Badge } from 'reactstrap';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NewsCard from './NewsCard';
import './NewsUpdates.css';

const NewsUpdates = () => {
    // 系统通知
    const [newsItems, setNewsItems] = useState([
        {
            id: 1,
            title: 'User Registration Notice',
            // date: '2023-10-25',
            content: 'This system currently only displays Network content for users registered on the Cloud platform',
            // category: 'notification',
            read: false
        },
        {
            id: 2,
            title: 'Testing Phase Announcement',
            // date: '2023-10-15',
            content: 'The current website is in testing phase. We apologize for any issues and appreciate your understanding',
            // category: 'notification',
            read: false
        }
    ]);

    const markAsRead = (id) => {
        setNewsItems(newsItems.map(item => 
            item.id === id ? { ...item, read: true } : item
        ));
    };

    return (
        <div className="news-updates-card">
            <div className="news-card-body">
                <CardTitle tag="h5" className="news-title">
                    <NotificationsIcon style={{ fontSize: 20 }} className="me-2" />
                    Notifications
                    <Badge className="ms-2 unread-badge" pill>
                        {newsItems.filter(item => !item.read).length}
                    </Badge>
                </CardTitle>
                
                <div className="news-container">
                    {newsItems.map((news) => (
                        <NewsCard 
                            key={news.id}
                            news={news}
                            onRead={markAsRead}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NewsUpdates; 