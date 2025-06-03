import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Skeleton,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import CustomSearchBar from '../../CustomComponents/CustomSearchBar';
import axiosInstance from '../../../config';
import { getToken } from '../../auth/auth';
import { AllDeviceTypes } from '../../projects/RoomConfigurations/ExcelProcessor/ExcelProcessor';

const ProductOverview = () => {
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('all');

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

  // 处理视图模式切换
  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

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

  // 处理 AllDeviceTypes 数据
  const supportedDevices = Object.entries(AllDeviceTypes).reduce((acc, [type, models]) => {
    // 如果 models 是数组，直接使用
    if (Array.isArray(models)) {
      acc[type] = models;
    }
    // 如果 models 是对象（比如 PowerPoint Type 和 Remote Control），展平它
    else {
      Object.entries(models).forEach(([subType, subModels]) => {
        acc[`${type} - ${subType}`] = subModels;
      });
    }
    return acc;
  }, {});

  return (
    <Box sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      p: 2
    }}>
      {/* 标题栏和搜索框组合 */}
      <Box sx={{ 
        mb: 2,
        flexShrink: 0 // 防止头部被压缩
      }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 1,
        }}>
          {/* 左侧：标题和切换按钮 */}
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            minWidth: { sm: '50%' }
          }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 600, 
              color: '#2c3e50', 
              fontSize: '1rem',
              whiteSpace: 'nowrap'
            }}>
              {viewMode === 'all' ? 'All Kasta Device Types' : 'Project Supported Types'}
            </Typography>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              size="small"
            >
              <ToggleButton
                value="all"
                disableRipple
                sx={{ 
                  textTransform: 'none',
                  fontSize: '0.7rem',
                  py: 0.3,
                  px: 0.8,
                  minWidth: 'auto',
                  '&.Mui-selected': {
                    backgroundColor: '#fbcd0b',
                    color: '#2c3e50',
                    '&:hover': {
                      backgroundColor: '#fbcd0b',
                    }
                  }
                }}
              >
                All
              </ToggleButton>
              <ToggleButton
                value="supported"
                disableRipple
                sx={{ 
                  textTransform: 'none',
                  fontSize: '0.7rem',
                  py: 0.3,
                  px: 0.8,
                  minWidth: 'auto',
                  '&.Mui-selected': {
                    backgroundColor: '#fbcd0b',
                    color: '#2c3e50',
                    '&:hover': {
                      backgroundColor: '#fbcd0b',
                    }
                  }
                }}
              >
                Supported
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* 右侧：搜索框 */}
          <Box sx={{ 
            flexGrow: 1,
            maxWidth: { sm: '200px' }
          }}>
            <CustomSearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder="Search device types..."
              width="100%"
            />
          </Box>
        </Box>
      </Box>

      {/* 内容区域 - 可滚动 */}
      <Box sx={{ 
        flexGrow: 1,
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#888',
          borderRadius: '4px',
          '&:hover': {
            background: '#555',
          },
        },
      }}>
        {isLoading ? (
          <Grid container spacing={2}>
            {[1, 2].map((item) => (
              <Grid item xs={12} key={item}>
                <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ pb: 2 }}>
            {Object.entries(viewMode === 'all' ? categorizedDevices : supportedDevices).map(([category, devices]) => (
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
                  {(viewMode === 'all' ? devices : devices).map((device, index) => (
                    <Grid item xs={6} sm={4} md={6} lg={4} key={viewMode === 'all' ? device.id : index}>
                      <Card sx={{
                        boxShadow: 'none',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        },
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: '#dee2e6',
                      }}>
                        <CardContent sx={{ 
                          py: 1,
                          px: 1.5,
                          '&:last-child': { pb: 1 }
                        }}>
                          <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column',
                            gap: 0.5 
                          }}>
                            <Chip
                              label={viewMode === 'all' ? device.typeCode : device}
                              size="small"
                              sx={{
                                backgroundColor: '95a5a6',
                                color: '#2c3e50',
                                fontWeight: 500,
                                fontSize: '0.7rem'
                              }}
                            />
                            {viewMode === 'all' && (
                              <Typography
                                variant="body2"
                                sx={{
                                  color: '#666',
                                  fontSize: '0.7rem',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                              >
                                {device.description}
                              </Typography>
                            )}
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
    </Box>
  );
};

export default ProductOverview;
