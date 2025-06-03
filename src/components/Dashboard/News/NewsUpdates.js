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
            category: 'notification',
            read: false
        },
        {
            id: 2,
            title: 'Testing Phase Announcement',
            content: 'The current website is in testing phase. We apologize for any issues and appreciate your understanding',
            category: 'notification',
            read: false
        },
        {
            id: 3,
            title: 'Binding Information Display',
            content: 'Binding information display for 5IN / 6IN / 4OUT devices has been fixed and improved',
            category: 'bugfix',
            read: false
        },
        {
            id: 4,
            title: 'Room Type Binding Support',
            content: 'System now supports proper binding to room type configurations',
            category: 'bugfix',
            read: false
        },
        {
            id: 5,
            title: 'Scene Group Device Display',
            content: 'Correct display of all included devices when a group is bound by a scene has been implemented',
            category: 'bugfix',
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