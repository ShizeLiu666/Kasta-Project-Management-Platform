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
                <Row className="carousel-section g-2 g-md-3">
                    <Col lg="6" md="6" sm="12">
                        <DashboardCarousel />
                    </Col>
                    <Col lg="3" md="3" sm="12" className="news-updates-container">
                        <NewsUpdates />
                    </Col>
                    <Col lg="3" md="3" sm="12">
                        <div className="info-card user-info-container">
                            <UserInfo userDetails={userDetails} />
                        </div>
                    </Col>
                </Row>

                <Row className="info-section g-2 g-md-3">
                    <Col lg="5" md="12">
                        <div className="info-card">
                            <NetworkOverview />
                        </div>
                    </Col>
                    <Col lg="7" md="12">
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