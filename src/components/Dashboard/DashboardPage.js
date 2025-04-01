import React from 'react';
import { Row, Col } from 'reactstrap';
// import ComponentCard from '../CustomComponents/ComponentCard';
import Carousel from 'react-material-ui-carousel';
import { Paper } from '@mui/material';
import kastaImage from '../../assets/images/CarouseItems/kasta.jpg';
import kastaSolutionImage from '../../assets/images/CarouseItems/kasta_solution.jpg';
import { getUserDetails } from '../../components/auth/auth';
import UserInfo from './UserInfo';
import './UserInfo.css';
import ProductOverview from './ProductOverview';
import NetworkOverview from './NetworkOverview';
import './DashboardPage.css';

const DashboardPage = () => {
    const userDetails = getUserDetails();

    const carouselItems = [
        {
            name: "Welcome to KASTA",
            description: "Smart control solutions designed in Australia",
            bgColor: "transparent",
            image: kastaImage,
            link: "https://www.kasta.com.au"
        },
        {
            name: "Kasta Solution",
            description: "Discover our achievements across diverse projects",
            bgColor: "transparent",
            image: kastaSolutionImage,
            link: "https://kastasolutions.com"
        },
        // {
        //   name: "Network Control",
        //   description: "Monitor and control your networks efficiently",
        //   bgColor: "#ff9800",
        //   image: "url_to_image_3",
        //   link: "/admin/network"
        // }
    ];

    const handleCarouselClick = (link) => {
        window.open(link, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-content">
                <Row className="carousel-section g-2 g-md-3">
                    <Col lg="8" md="7" sm="12">
                        <div className="carousel-container">
                            <Carousel
                                animation="fade"
                                interval={20000}
                                indicators={true}
                                navButtonsAlwaysVisible={true}
                                height="100%"
                                navButtonsProps={{
                                    style: {
                                        backgroundColor: '#000000',
                                        borderRadius: 0,
                                        padding: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                    }
                                }}
                                indicatorContainerProps={{
                                    style: {
                                        position: 'absolute',
                                        bottom: '10px',
                                        zIndex: 1
                                    }
                                }}
                                sx={{ height: '100%' }}
                            >
                                {carouselItems.map((item, index) => (
                                    <Paper
                                        key={index}
                                        elevation={0}
                                        onClick={() => handleCarouselClick(item.link)}
                                        className="CarouselItem"
                                        sx={{
                                            height: '100% !important',
                                            backgroundColor: item.bgColor,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            color: 'white',
                                            padding: '20px',
                                            textAlign: 'center',
                                            borderRadius: '8px',
                                            backgroundImage: `url(${item.image})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            backgroundRepeat: 'no-repeat',
                                            cursor: 'pointer',
                                            position: 'relative',
                                            '&::after': {
                                                content: '""',
                                                position: 'absolute',
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                height: '40%',
                                                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                                                borderRadius: '0 0 8px 8px',
                                            }
                                        }}
                                    >
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '25px',
                                            zIndex: 1,
                                            width: '100%',
                                            color: 'white',
                                            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                                            padding: '0 20px'
                                        }}>
                                            <h3 style={{ margin: 0 }}>{item.name}</h3>
                                            <p style={{ margin: '8px 0' }}>{item.description}</p>
                                        </div>
                                    </Paper>
                                ))}
                            </Carousel>
                        </div>
                    </Col>
                    <Col lg="4" md="5" sm="12">
                        <div className="info-card">
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