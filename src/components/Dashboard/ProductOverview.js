import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Skeleton
} from '@mui/material';
import CustomSearchBar from '../CustomComponents/CustomSearchBar';
import axiosInstance from '../../config';
import { getToken } from '../auth';

const ProductOverview = () => {
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // 获取设备类型数据
  useEffect(() => {
    const fetchDeviceTypes = async () => {
      try {
        const token = getToken();
        const response = await axiosInstance.get('/device-types', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setDeviceTypes(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching device types:', error);
        setIsLoading(false);
      }
    };

    fetchDeviceTypes();
  }, []);

  // 过滤设备类型
  const filteredDeviceTypes = deviceTypes.filter(device => 
    device.typeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 分类设备类型
  const categorizedDevices = filteredDeviceTypes.reduce((acc, device) => {
    const category = device.typeCode.includes('_') 
      ? device.typeCode.split('_')[0] 
      : 'OTHER';
    
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(device);
    return acc;
  }, {});

  return (
    <Box sx={{ p: 2, height: '100%' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50', fontSize: '1rem' }}>
          Device Types Overview
        </Typography>
        <CustomSearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder="Search device types..."
          width="200px"
        />
      </Box>

      {isLoading ? (
        <Grid container spacing={2}>
          {[1, 2].map((item) => (
            <Grid item xs={12} key={item}>
              <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ overflowY: 'auto', height: 'calc(100% - 60px)' }}>
          {Object.entries(categorizedDevices).map(([category, devices]) => (
            <Box key={category} sx={{ mb: 3 }}>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  mb: 1, 
                  fontWeight: 600, 
                  color: '#2c3e50',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontSize: '0.75rem'
                }}
              >
                {category}
              </Typography>
              <Grid container spacing={1}>
                {devices.map((device) => (
                  <Grid item xs={12} key={device.id}>
                    <Card 
                      sx={{ 
                        borderRadius: '8px',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Chip 
                            label={device.typeCode}
                            size="small"
                            sx={{ 
                              backgroundColor: 'rgba(251, 205, 11, 0.1)',
                              color: '#2c3e50',
                              fontWeight: 500,
                              fontSize: '0.75rem'
                            }}
                          />
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#666',
                              fontSize: '0.75rem',
                              ml: 1
                            }}
                          >
                            {device.description}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ProductOverview;
