import React, { useState, useMemo } from 'react';
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
  } = useNetworkDevices(networkId, {
    enabled: !!networkId,
    staleTime: 30000,
    cacheTime: 60000
  });

  // 将 renderDeviceTable 移到顶部，避免条件渲染中使用 Hook
  const renderDeviceTable = React.useCallback((productType, devicesToRender) => {
    if (!devicesToRender?.length || !productType) return null;

    try {
      const groupedDevices = groupDevicesByType(devicesToRender, productType);

      // 特殊处理 TOUCH_PANEL
      if (productType === 'TOUCH_PANEL') {
        const DeviceComponent = require('./Tables/TOUCH_PANEL/TOUCH_PANEL').default;
        return <DeviceComponent key={productType} groupedDevices={groupedDevices} networkId={networkId} />;
      }

      // 特殊处理 SIX_INPUT_FOUR_OUTPUT
      if (productType === 'SIX_INPUT_FOUR_OUTPUT') {
        const { input, output } = groupedDevices;
        
        try {
          const SixInputComponent = require('./Tables/SIX_INPUT/SIX_INPUT').default;
          const FourOutputComponent = require('./Tables/FOUR_OUTPUT/FOUR_OUTPUT').default;
          
          return (
            <>
              {input?.length > 0 && (
                <Box key={`${productType}-input`} sx={{ mb: 3 }}>
                  <SixInputComponent devices={input} networkId={networkId} />
                </Box>
              )}
              {output?.length > 0 && (
                <Box key={`${productType}-output`} sx={{ mb: 3 }}>
                  <FourOutputComponent devices={output} networkId={networkId} />
                </Box>
              )}
            </>
          );
        } catch (err) {
          console.error('Failed to load SIX_INPUT or FOUR_OUTPUT components:', err);
          return null;
        }
      }

      // 特殊处理 FIVE_BUTTON
      if (productType === 'FIVE_BUTTON') {
        const DeviceComponent = require('./Tables/FIVE_BUTTON/FIVE_BUTTON').default;
        return (
          <Box key={`${productType}-container`} sx={{ mb: 3 }}>
            <DeviceComponent 
              devices={devicesToRender} 
              networkId={networkId} 
            />
          </Box>
        );
      }

      // 其他设备类型
      const DeviceComponent = require(`./Tables/${productType}/${productType}`).default;
      return (
        <Box key={productType} sx={{ mb: 3 }}>
          <DeviceComponent devices={devicesToRender} networkId={networkId} />
        </Box>
      );
    } catch (error) {
      console.error(`Failed to load component for ${productType}`, error);
      return null;
    }
  }, [networkId]);

  // 按 ProductType 分组设备 - 将 useMemo 移到条件渲染之前
  const devicesByProductType = useMemo(() => {
    return devices.reduce((acc, device) => {
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
  }, [devices]);

  // 排序的设备类型数组
  const sortedProductTypes = useMemo(() => {
    return Object.entries(devicesByProductType)
      .sort(([typeA], [typeB]) => typeA.localeCompare(typeB));
  }, [devicesByProductType]);

  // 处理加载状态
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <Typography>Loading devices...</Typography>
      </Box>
    );
  }

  // 处理错误状态
  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', color: 'error.main' }}>
        <Typography>{error.message || 'Failed to load devices'}</Typography>
      </Box>
    );
  }

  // 处理空状态
  if (!devices.length) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', color: '#666', backgroundColor: '#fafbfc', borderRadius: '12px', border: '1px dashed #dee2e6' }}>
        <Typography variant="body1" color="text.secondary">
          No devices found in this network
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <CustomButton type="remove" onClick={() => setDeleteDeviceModalOpen(true)}>
          Delete Device
        </CustomButton>
        <CustomButton type="create" onClick={() => setUpdateDeviceModalOpen(true)}>
          Update Device Status
        </CustomButton>
        <CustomButton type="create" onClick={() => setAddDeviceModalOpen(true)}>
          Add Device
        </CustomButton>
      </Box>

      {sortedProductTypes.map(([productType, deviceList]) => (
        <React.Fragment key={`${productType}-${deviceList[0]?.deviceType || 'unknown'}`}>
          {renderDeviceTable(productType, deviceList)}
        </React.Fragment>
      ))}

      {/* Modals */}
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

export default React.memo(DeviceList);
