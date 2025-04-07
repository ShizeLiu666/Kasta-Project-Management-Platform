import React from 'react';
import BasicTable from '../BasicTable';
import { Box, Typography } from '@mui/material';

const BaseTouchPanel = ({ 
  devices, 
  title, 
  productType,  // 新增 productType 参数
  hasBacklight = true,  // 是否支持背光
  extraColumns = []  // 额外的列配置
}) => {
  // 渲染按钮绑定信息
  const renderButtonBinding = (binding) => {
    if (!binding) return <Typography variant="body2" color="text.secondary">No Binding</Typography>;
    
    return (
      <Box sx={{ padding: 1, border: '1px solid #e0e0e0', borderRadius: 1, bgcolor: '#f9f9f9' }}>
        <Typography variant="caption" color="text.secondary" display="block">Device Type</Typography>
        <Typography variant="body2" fontWeight="medium">{binding.bindType}</Typography>
        
        <Typography variant="caption" color="text.secondary" display="block" mt={1}>Device ID</Typography>
        <Typography variant="body2" fontWeight="medium">{binding.bindId}</Typography>
        
        <Typography variant="caption" color="text.secondary" display="block" mt={1}>Channel</Typography>
        <Typography variant="body2" fontWeight="medium">{binding.bindChannel ? 'Right' : 'Left'}</Typography>
        
        <Typography variant="caption" color="text.secondary" display="block" mt={1}>Status</Typography>
        <Typography variant="body2" fontWeight="medium">{binding.enable ? 'Enabled' : 'Disabled'}</Typography>

        {binding.hasTimer === 1 && (
          <>
            <Typography variant="caption" color="text.secondary" display="block" mt={1}>Timer</Typography>
            <Typography variant="body2" fontWeight="medium">
              {`${binding.hour.toString().padStart(2, '0')}:${binding.min.toString().padStart(2, '0')}`}
            </Typography>
          </>
        )}
      </Box>
    );
  };

  const baseColumns = [
    {
      id: 'backlight',
      label: 'Backlight',
      format: (attrs) => {
        const enabled = attrs?.backLightEnabled;
        
        // 直接根据 backLightEnabled 的值判断
        if (enabled === 1) {
          return 'On';
        } else if (enabled === 0) {
          return 'Off';
        } else {
          return 'N/A';
        }
      }
    },
    {
      id: 'activeButton',
      label: 'Active Button',
      format: (attrs) => {
        const idx = attrs?.activeButtonIdx || 0;
        const maxButtons = parseInt(productType.split('_')[2]) || 1;
        return idx > maxButtons ? '-' : `Button ${idx}`;
      }
    },
    {
      id: 'bindings',
      label: 'Bindings',
      format: (attrs) => {
        const bindings = attrs?.remoteBind || [];
        if (!Array.isArray(bindings) || bindings.length === 0) {
          return <Typography variant="body2" color="text.secondary">No Bindings</Typography>;
        }

        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {bindings.map((binding, index) => (
              <Box 
                key={index}
                sx={{
                  borderLeft: '2px solid #fbcd0b',
                  paddingLeft: 1
                }}
              >
                <Typography variant="caption" color="text.secondary" display="block">
                  Button {binding.hole}
                </Typography>
                {renderButtonBinding(binding)}
              </Box>
            ))}
          </Box>
        );
      }
    },
    ...extraColumns
  ];

  // 根据 Orientation 分组设备
  const horizontalDevices = devices.filter(device => {
    const isHorizontal = device.specificAttributes?.isHorizontal;
    return isHorizontal === null || isHorizontal === 0;  // 默认显示为水平
  });
  const verticalDevices = devices.filter(device => device.specificAttributes?.isHorizontal === 1);

  // 获取图标路径
  const getIconPath = (orientation) => {
    try {
      return require(`../../../../../../assets/icons/DeviceType/${productType}_${orientation === 'horizontal' ? 'h' : 'v'}.png`);
    } catch (error) {
      console.warn(`Failed to load icon for ${productType}_${orientation === 'horizontal' ? 'h' : 'v'}.png`);
      // 返回一个默认图标或者 null
      return null;
    }
  };

  return (
    <>
      {horizontalDevices.length > 0 && (
        <BasicTable
          title={`${title} (Horizontal)`}
          icon={getIconPath('horizontal')}
          devices={horizontalDevices}
          columns={baseColumns}
          nameColumnWidth="25%"
        />
      )}
      {verticalDevices.length > 0 && (
        <BasicTable
          title={`${title} (Vertical)`}
          icon={getIconPath('vertical')}
          devices={verticalDevices}
          columns={baseColumns}
          nameColumnWidth="25%"
        />
      )}
    </>
  );
};

export default BaseTouchPanel; 