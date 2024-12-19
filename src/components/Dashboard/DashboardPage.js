import React from 'react';
import { Row, Col } from 'reactstrap';
import ComponentCard from '../CustomComponents/ComponentCard';
import Carousel from 'react-material-ui-carousel';
import { Paper } from '@mui/material';
import kastaImage from '../../assets/images/CarouseItems/kasta.jpg';
import kastaSolutionImage from '../../assets/images/CarouseItems/kasta_solution.jpg';
import { getUserDetails } from '../auth';
import UserInfo from './UserInfo';
import './DashboardUserInfo.css';
import ProductOverview from './ProductOverview';
import NetworkOverview from './NetworkOverview';

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
        <div>
            <Row>
                <Col md="12">
                    <ComponentCard title="" showTitle={false}>
                        <Row className="mb-4">
                            <Col md="9">
                                <div style={{
                                    height: '500px',
                                    overflow: 'auto',
                                    borderRadius: '12px',
                                    boxShadow: '0 2px 12px rgba(0,0,0,0.05)'
                                }}>
                                    <Carousel
                                        animation="fade"
                                        interval={20000}
                                        indicators={true}
                                        navButtonsAlwaysVisible={true}
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
                                                bottom: '20px',
                                                zIndex: 1
                                            }
                                        }}
                                    >
                                        {carouselItems.map((item, index) => (
                                            <Paper
                                                key={index}
                                                elevation={0}
                                                onClick={() => handleCarouselClick(item.link)}
                                                sx={{
                                                    height: '500px',
                                                    backgroundColor: item.bgColor,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    color: 'white',
                                                    padding: '20px',
                                                    textAlign: 'center',
                                                    borderRadius: '4px',
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
                                                        height: '50%',
                                                        background: 'linear-gradient(transparent, rgba(0.2,0.3,0.5,1))',
                                                        borderRadius: '0 0 4px 4px',
                                                    }
                                                }}
                                            >
                                                <div style={{
                                                    position: 'absolute',
                                                    bottom: '40px',
                                                    zIndex: 1,
                                                    color: 'white',
                                                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                                                }}>
                                                    <h3 style={{ margin: 0 }}>{item.name}</h3>
                                                    <p style={{ margin: '10px 0' }}>{item.description}</p>
                                                </div>
                                            </Paper>
                                        ))}
                                    </Carousel>
                                </div>
                            </Col>
                            <Col md="3">
                                <UserInfo userDetails={userDetails} />
                            </Col>
                        </Row>
                        <Row className="mb-4">
                            <Col md="6">
                                <div style={{
                                    height: '500px',
                                    backgroundColor: '#fff',
                                    borderRadius: '12px',
                                    boxShadow: '0 2px 12px rgba(0,0,0,0.05)'
                                }}>
                                    <NetworkOverview />
                                </div>
                            </Col>
                            <Col md="6">
                                <div style={{
                                    height: '500px',
                                    overflow: 'auto',
                                    backgroundColor: '#fff',
                                    borderRadius: '12px',
                                    boxShadow: '0 2px 12px rgba(0,0,0,0.05)'
                                }}>
                                    <ProductOverview />
                                </div>
                            </Col>
                        </Row>
                    </ComponentCard>
                </Col>
            </Row>
        </div>
    );
};

export default DashboardPage;