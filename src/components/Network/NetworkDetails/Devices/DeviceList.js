import React, { useEffect, useState } from 'react';
import { axiosInstance, getToken } from '../../../auth';
import { Box, Typography } from '@mui/material';

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
  const [devices, setDevices] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const token = getToken();
        if (!token) {
          console.error("No token found");
          return;
        }

        const url = '/devices/list';
        const initialResponse = await axiosInstance.post(url, {
          page: 1,
          size: 1,
          networkId: networkId
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const initialData = initialResponse.data;
        const totalSize = initialData.data.totalElements;

        if (totalSize === 0) {
          setIsEmpty(true);
          return;
        }

        const fullResponse = await axiosInstance.post(url, {
          page: 1,
          size: totalSize,
          networkId: networkId
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const fullData = fullResponse.data;
        setDevices(fullData.data.content);
      } catch (error) {
        console.error('Failed to fetch devices:', error);
      }
    };

    if (networkId) {
      fetchDevices();
    }
  }, [networkId]);

  if (isEmpty) {
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
    if (productType) {  // 只处理已映射的产品类型
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
