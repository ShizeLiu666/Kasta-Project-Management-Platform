import React from 'react';
import { Row, Col } from 'reactstrap';
// import ComponentCard from '../CustomComponents/ComponentCard';
import { getUserDetails } from '../../components/auth/auth';
import UserInfo from './UserInfo';
import './UserInfo.css';
import ProductOverview from './ProductOverview';
import NetworkOverview from './NetworkOverview';
import NewsUpdates from './NewsUpdates';
import DashboardCarousel from './DashboardCarousel';
import './DashboardPage.css';

const DashboardPage = () => {
    const userDetails = getUserDetails();

    return (
        <div className="dashboard-container">
            <div className="dashboard-content">
                {/* 顶部信息区域 */}
                <Row className="top-section g-2 g-md-3">
                    {/* 轮播图区域 */}
                    <Col xl="6" lg="6" md="12" sm="12" className="order-1">
                        <div className="info-card carousel-wrapper">
                            <DashboardCarousel />
                        </div>
                    </Col>
                    {/* 新闻更新区域 */}
                    <Col xl="3" lg="3" md="6" sm="12" className="order-2">
                        <div className="info-card news-updates-container">
                            <NewsUpdates />
                        </div>
                    </Col>
                    {/* 用户信息区域 */}
                    <Col xl="3" lg="3" md="6" sm="12" className="order-3">
                        <div className="info-card user-info-container">
                            <UserInfo userDetails={userDetails} />
                        </div>
                    </Col>
                </Row>

                {/* 底部信息区域 */}
                <Row className="bottom-section g-2 g-md-3">
                    {/* 网络概览区域 */}
                    <Col xl="5" lg="5" md="12" sm="12" className="order-4">
                        <div className="info-card">
                            <NetworkOverview />
                        </div>
                    </Col>
                    {/* 产品概览区域 */}
                    <Col xl="7" lg="7" md="12" sm="12" className="order-5">
                        <div className="info-card">
                            <ProductOverview />
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default DashboardPage;