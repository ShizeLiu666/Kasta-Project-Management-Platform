import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useNetworkDevices } from '../useNetworkQueries';
import { PRODUCT_TYPE_MAP } from '../PRODUCT_TYPE_MAP';
import CustomButton from '../../../CustomComponents/CustomButton';
import AddDeviceModal from './AddDeviceModal';

const DeviceList = ({ networkId }) => {
  const [addDeviceModalOpen, setAddDeviceModalOpen] = useState(false);
  
  // 使用 React Query hook
  const { 
    data: devices = [], 
    isLoading, 
    error,
    refetch
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
      // 特殊处理 TOUCH_PANEL
      if (productType === 'TOUCH_PANEL') {
        // 按 deviceType 进一步分组
        const devicesByType = devices.reduce((acc, device) => {
          const type = device.deviceType;
          if (!acc[type]) {
            acc[type] = [];
          }
          acc[type].push(device);
          return acc;
        }, {});

        // 渲染每种类型的面板
        return Object.entries(devicesByType).map(([deviceType, typeDevices]) => {
          try {
            // 改用通用的 TouchPanel 组件，而不是尝试加载特定的组件
            const TouchPanelComponent = require('./Tables/TOUCH_PANEL/TouchPanel').default;
            return (
              <Box key={`TOUCH_PANEL-${deviceType}`} sx={{ mb: 3 }}>
                <TouchPanelComponent devices={typeDevices} />
              </Box>
            );
          } catch (error) {
            console.error(`Failed to load TouchPanel component`, error);
            return null;
          }
        });
      }

      // 其他设备类型保持原有逻辑
      const DeviceComponent = require(`./Tables/${productType}/${productType}`).default;
      return (
        <Box key={productType} sx={{ mb: 3 }}>
          <DeviceComponent devices={devices} />
        </Box>
      );
    } catch (error) {
      console.error(`Failed to load component for ${productType}`, error);
      return null;
    }
  };

  const sortedProductTypes = Object.entries(devicesByProductType)
    .sort(([typeA], [typeB]) => typeA.localeCompare(typeB));

  const handleAddDevice = () => {
    setAddDeviceModalOpen(true);
  };

  return (
    <>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <CustomButton
          type="create"
          onClick={handleAddDevice}
        >
          Add Device
        </CustomButton>
      </Box>

      {sortedProductTypes.map(([productType, devices]) => (
        <React.Fragment key={`${productType}-${devices[0]?.deviceType || 'unknown'}`}>
          {renderDeviceTable(productType, devices)}
        </React.Fragment>
      ))}

      <AddDeviceModal
        isOpen={addDeviceModalOpen}
        toggle={() => setAddDeviceModalOpen(false)}
        networkId={networkId}
        onSuccess={() => {
          setAddDeviceModalOpen(false);
          refetch();
        }}
      />
    </>
  );
};

export default DeviceList;
