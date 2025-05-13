import React, { useEffect } from 'react';
import Carousel from 'react-material-ui-carousel';
import { Paper } from '@mui/material';
import kastaImage from '../../assets/images/CarouseItems/kasta.jpg';
import kastaSolutionImage from '../../assets/images/CarouseItems/kasta_solution.jpg';
import './DashboardCarousel.css';

const DashboardCarousel = () => {
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
        }
    ];

    const handleCarouselClick = (link) => {
        window.open(link, '_blank', 'noopener,noreferrer');
    };

    // 确保轮播图正确显示的辅助功能
    useEffect(() => {
        // 确保轮播图容器和内容高度100%
        const carouselContainers = document.querySelectorAll('.carousel-container');
        carouselContainers.forEach(container => {
            container.style.height = '100%';
        });
    }, []);

    return (
        <div className="carousel-container">
            <Carousel
                animation="fade"
                interval={20000}
                indicators={false} // 移除底部指示器按钮
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
                sx={{ 
                    height: '100%',
                    position: 'relative',
                    '& .MuiIconButton-root': {
                        padding: '2px',
                        margin: '0 4px',
                    },
                    '& .MuiSvgIcon-root': {
                        fontSize: '10px',
                        color: 'rgba(255, 255, 255, 0.7)',
                    },
                    '& .Mui-selected .MuiSvgIcon-root': {
                        color: '#fff',
                    }
                }}
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
    );
};

export default DashboardCarousel; 