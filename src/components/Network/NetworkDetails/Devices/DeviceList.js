import React from 'react';
import { Box, Typography } from '@mui/material';
import { useNetworkDevices } from '../useNetworkQueries';

// 产品类型映射表
const PRODUCT_TYPE_MAP = {
  'myfiewpc': 'CCT_DOWNLIGHT',
  '5atdh35u': 'DIMMER',
  'tb7prezu': 'FAN', 
  'xdddhvid': 'POWER_POINT',
  'clniiasn': 'RGB_CW', 
  'k8tngzhj': 'SOCKET_RELAY',                          
  'fphjf3jj': 'THERMOSTAT',
};

const DeviceList = ({ networkId }) => {
  // 使用 React Query hook
  const { 
    data: devices = [], 
    isLoading, 
    error 
  } = useNetworkDevices(networkId);

  // 处理加载状态
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px'
        }}
      >
        <Typography>Loading devices...</Typography>
      </Box>
    );
  }

  // 处理错误状态
  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px',
          color: 'error.main'
        }}
      >
        <Typography>{error.message || 'Failed to load devices'}</Typography>
      </Box>
    );
  }

  // 处理空状态
  if (!devices.length) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '200px',
          color: '#666',
          backgroundColor: '#fafbfc',
          borderRadius: '12px',
          border: '1px dashed #dee2e6'
        }}
      >
        <Typography variant="body1" color="text.secondary">
          No devices found in this network
        </Typography>
      </Box>
    );
  }

  // 按 ProductType 分组设备
  const devicesByProductType = devices.reduce((acc, device) => {
    const productType = PRODUCT_TYPE_MAP[device.productType];
    if (productType) {
      if (!acc[productType]) {
        acc[productType] = [];
      }
      acc[productType].push(device);
    } else {
      console.warn(`Unknown product type: ${device.productType}`);
    }
    return acc;
  }, {});

  const renderDeviceTable = (productType, devices) => {
    try {
      const DeviceComponent = require(`./Tables/${productType}/${devices[0].deviceType}`).default;
      return (
        <Box key={`${productType}-${devices[0].deviceType}`} sx={{ mb: 3 }}>
          <DeviceComponent devices={devices} />
        </Box>
      );
    } catch (error) {
      console.error(`Failed to load component for ${productType}/${devices[0].deviceType}`, error);
      return null;
    }
  };

  const sortedProductTypes = Object.entries(devicesByProductType)
    .sort(([typeA], [typeB]) => typeA.localeCompare(typeB));

  return (
    <>
      {sortedProductTypes.map(([productType, devices]) => (
        <React.Fragment key={`${productType}-${devices[0]?.deviceType || 'unknown'}`}>
          {renderDeviceTable(productType, devices)}
        </React.Fragment>
      ))}
    </>
  );
};

export default DeviceList;
