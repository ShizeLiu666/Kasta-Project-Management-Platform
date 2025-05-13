import React from 'react';
import BasicTable from '../BasicTable';
import { Box, Typography } from '@mui/material';

// 设备类型到按钮数量的映射表
const DEVICE_TYPE_TO_BUTTONS = {
  // HRSMB系列映射规则
  'HRSMB6': 6,
  'HRSMB4': 4,
  'HRSMB3': 3,
  'HRSMB2': 2,
  'HRSMB1': 1,
  // 其他类型可以继续添加
};

// 产品类型到按钮数量的映射表
const PRODUCT_TYPE_TO_BUTTONS = {
  'skr8wl4o': null,  // 对应 HRSMB 系列，按钮数量需要从设备类型中获取
  // 其他产品类型映射可以继续添加
};

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
    
    // 获取绑定类型名称
    const getBindTypeName = (type) => {
      switch (type) {
        case 1: return 'Device';
        case 2: return 'Group';
        case 3: return 'Room';
        case 4: return 'Scene';
        default: return null;
      }
    };
    
    // 检查绑定类型是否有效
    const bindTypeName = getBindTypeName(binding.bindType);
    if (bindTypeName === null) {
      return <Typography variant="body2" color="text.secondary">No Binding</Typography>;
    }
    
    return (
      <Box sx={{ padding: 1, border: '1px solid #e0e0e0', borderRadius: 1, bgcolor: '#f9f9f9' }}>
        <Typography variant="caption" color="text.secondary" display="block">Device Type</Typography>
        <Typography variant="body2" fontWeight="medium">
          {bindTypeName} ({binding.bindType})
        </Typography>
        
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

  // 获取设备的按钮数量
  const getButtonCount = (device) => {
    // 1. 首先检查设备类型是否在映射表中
    if (device.deviceType && DEVICE_TYPE_TO_BUTTONS[device.deviceType]) {
      return DEVICE_TYPE_TO_BUTTONS[device.deviceType];
    }
    
    // 2. 尝试从HRSMB开头的设备类型中提取数字
    if (device.deviceType && device.deviceType.startsWith('HRSMB')) {
      const match = device.deviceType.match(/\d+/);
      if (match) {
        return parseInt(match[0]);
      }
    }
    
    // 3. 检查产品类型是否在映射表中
    if (device.productType && PRODUCT_TYPE_TO_BUTTONS[device.productType]) {
      return PRODUCT_TYPE_TO_BUTTONS[device.productType];
    }
    
    // 4. 尝试从设备类型中提取数字
    if (device.deviceType) {
      const match = device.deviceType.match(/\d+/);
      if (match) {
        return parseInt(match[0]);
      }
    }
    
    // 5. 尝试从来自props的productType参数中解析（原有逻辑）
    if (productType) {
      const parts = productType.split('_');
      if (parts.length > 2) {
        return parseInt(parts[2]) || 1;
      }
    }
    
    // 6. 从绑定信息推断按钮数量
    const bindings = device.specificAttributes?.remoteBind || [];
    if (bindings.length > 0) {
      const maxHole = Math.max(...bindings.map(b => parseInt(b.hole) || 0));
      return maxHole + 1; // hole从0开始，所以+1得到按钮数量
    }
    
    // 默认返回1
    return 1;
  };

  const baseColumns = [
    {
      id: 'deviceInfo',
      label: 'Device Info',
      format: (_, device) => {
        const buttonCount = getButtonCount(device);
        return (
          <Box>
            <Typography variant="body2" color="text.primary">
              Device Type: {device.deviceType || 'Unknown'}
            </Typography>
            <Typography variant="body2" color="text.primary">
              Product Type: {device.productType || 'Unknown'}
            </Typography>
            <Typography variant="body2" color="text.primary">
              Buttons: {buttonCount}
            </Typography>
          </Box>
        );
      }
    },
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
      format: (attrs, device) => {
        const idx = attrs?.activeButtonIdx || 0;
        const maxButtons = getButtonCount(device);
        return idx >= maxButtons ? '-' : `Button ${idx}`;
      }
    },
    {
      id: 'bindings',
      label: 'Bindings',
      format: (attrs, device) => {
        const bindings = attrs?.remoteBind || [];
        if (!Array.isArray(bindings) || bindings.length === 0) {
          return <Typography variant="body2" color="text.secondary">No Bindings</Typography>;
        }

        // 按照hole排序
        const sortedBindings = [...bindings].sort((a, b) => a.hole - b.hole);

        // 过滤掉无效绑定
        const validBindings = sortedBindings.filter(binding => {
          const bindTypeName = binding ? (function() {
            switch (binding.bindType) {
              case 1: return 'Device';
              case 2: return 'Group';
              case 3: return 'Room';
              case 4: return 'Scene';
              default: return null;
            }
          })() : null;
          return bindTypeName !== null;
        });

        if (validBindings.length === 0) {
          return <Typography variant="body2" color="text.secondary">No Valid Bindings</Typography>;
        }

        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {validBindings.map((binding, index) => (
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

  // 按钮数量分组设备
  const groupDevicesByButtonCount = (devices) => {
    return devices.reduce((acc, device) => {
      const buttonCount = getButtonCount(device);
      
      if (!acc[buttonCount]) {
        acc[buttonCount] = [];
      }
      
      acc[buttonCount].push(device);
      return acc;
    }, {});
  };

  // 根据 Orientation 分组设备
  const horizontalDevices = devices.filter(device => {
    const isHorizontal = device.specificAttributes?.isHorizontal;
    return isHorizontal === null || isHorizontal === 0;  // 默认显示为水平
  });
  const verticalDevices = devices.filter(device => device.specificAttributes?.isHorizontal === 1);

  // 根据按钮数量再次分组
  const horizontalGrouped = groupDevicesByButtonCount(horizontalDevices);
  const verticalGrouped = groupDevicesByButtonCount(verticalDevices);

  // 获取图标路径
  const getIconPath = (device, orientation) => {
    const buttonCount = getButtonCount(device);
    
    try {
      // 首先尝试加载HRSMB特定的设备图标
      if (device.deviceType && device.deviceType.startsWith('HRSMB')) {
        return require(`../../../../../../assets/icons/DeviceType/${device.deviceType}_${orientation === 'horizontal' ? 'h' : 'v'}.png`);
      }
      
      // 尝试加载特定的设备图标
      return require(`../../../../../../assets/icons/DeviceType/${device.deviceType}_${orientation === 'horizontal' ? 'h' : 'v'}.png`);
    } catch (error) {
      try {
        // 尝试加载通用面板图标
        return require(`../../../../../../assets/icons/DeviceType/TOUCH_PANEL_${buttonCount}_${orientation === 'horizontal' ? 'h' : 'v'}.png`);
      } catch (error2) {
        // 直接回退到未知图标
        try {
          return require(`../../../../../../assets/icons/DeviceType/UNKNOW_ICON.png`);
        } catch (fallbackError) {
          console.warn(`Failed to load any icon for device: ${device.deviceType}`);
          return null;
        }
      }
    }
  };

  return (
    <>
      {/* 渲染水平面板分组 */}
      {Object.entries(horizontalGrouped).map(([buttonCount, deviceGroup]) => (
        <BasicTable
          key={`horizontal-${buttonCount}`}
          title={`${title} ${buttonCount}-Button (Horizontal)`}
          icon={deviceGroup[0] ? getIconPath(deviceGroup[0], 'horizontal') : null}
          devices={deviceGroup}
          columns={baseColumns}
          nameColumnWidth="25%"
          formatWithDevice={true}
        />
      ))}
      
      {/* 渲染垂直面板分组 */}
      {Object.entries(verticalGrouped).map(([buttonCount, deviceGroup]) => (
        <BasicTable
          key={`vertical-${buttonCount}`}
          title={`${title} ${buttonCount}-Button (Vertical)`}
          icon={deviceGroup[0] ? getIconPath(deviceGroup[0], 'vertical') : null}
          devices={deviceGroup}
          columns={baseColumns}
          nameColumnWidth="25%"
          formatWithDevice={true}
        />
      ))}
    </>
  );
};

export default BaseTouchPanel; 