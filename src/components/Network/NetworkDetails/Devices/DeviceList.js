import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useNetworkDevices } from '../useNetworkQueries';
import { PRODUCT_TYPE_MAP } from '../PRODUCT_TYPE_MAP';
import CustomButton from '../../../CustomComponents/CustomButton';
import AddDeviceModal from './AddDeviceModal';
import UpdateDeviceModal from './UpdateDeviceModal';
import DeleteDeviceModal from './DeleteDeviceModal';

// 添加设备分组函数
const groupDevicesByType = (devices, productType) => {
  switch (productType) {
    case 'TOUCH_PANEL':
      return {
        horizontal: devices.filter(device => {
          const isHorizontal = device.specificAttributes?.isHorizontal;
          return isHorizontal === null || isHorizontal === 0;
        }),
        vertical: devices.filter(device => 
          device.specificAttributes?.isHorizontal === 1
        )
      };
    case 'SIX_INPUT_FOUR_OUTPUT':
      return {
        input: devices.filter(device => device.deviceType === '6RSIBH'),
        output: devices.filter(device => device.deviceType !== '6RSIBH')
      };
    default:
      return { default: devices };
  }
};

const DeviceList = ({ networkId }) => {
  const [addDeviceModalOpen, setAddDeviceModalOpen] = useState(false);
  const [updateDeviceModalOpen, setUpdateDeviceModalOpen] = useState(false);
  const [deleteDeviceModalOpen, setDeleteDeviceModalOpen] = useState(false);
  
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
      console.warn(`Unknown product type: ${device.productType} for device ${device.name}`);
    }
    return acc;
  }, {});

  const renderDeviceTable = (productType, devices) => {
    try {
      const groupedDevices = groupDevicesByType(devices, productType);

      // 特殊处理 TOUCH_PANEL
      if (productType === 'TOUCH_PANEL') {
        const DeviceComponent = require('./Tables/TOUCH_PANEL/TOUCH_PANEL').default;
        return <DeviceComponent groupedDevices={groupedDevices} />;
      }

      // 特殊处理 SIX_INPUT_FOUR_OUTPUT
      if (productType === 'SIX_INPUT_FOUR_OUTPUT') {
        const { input, output } = groupedDevices;
        return (
          <>
            {input.length > 0 && (
              <Box key="input" sx={{ mb: 3 }}>
                {require('./Tables/SIX_INPUT/SIX_INPUT').default({ devices: input })}
              </Box>
            )}
            {output.length > 0 && (
              <Box key="output" sx={{ mb: 3 }}>
                {require('./Tables/FOUR_OUTPUT/FOUR_OUTPUT').default({ devices: output })}
              </Box>
            )}
          </>
        );
      }

      // 其他设备类型的处理保持不变
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
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <CustomButton
          type="remove"
          onClick={() => setDeleteDeviceModalOpen(true)}
        >
          Delete Device
        </CustomButton>
        <CustomButton
          type="create"
          onClick={() => setUpdateDeviceModalOpen(true)}
        >
          Update Device Status
        </CustomButton>
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

      <UpdateDeviceModal
        isOpen={updateDeviceModalOpen}
        toggle={() => setUpdateDeviceModalOpen(false)}
        devices={devices}
        onSuccess={() => {
          setUpdateDeviceModalOpen(false);
          refetch();
        }}
      />

      <DeleteDeviceModal
        isOpen={deleteDeviceModalOpen}
        toggle={() => setDeleteDeviceModalOpen(false)}
        devices={devices}
        networkId={networkId}
        onSuccess={() => {
          setDeleteDeviceModalOpen(false);
          refetch();
        }}
      />
    </>
  );
};

export default DeviceList;
