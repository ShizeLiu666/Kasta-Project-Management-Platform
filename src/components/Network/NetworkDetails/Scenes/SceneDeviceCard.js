import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { PRODUCT_TYPE_MAP } from '../PRODUCT_TYPE_MAP';

// 工具函数 - 从产品类型获取设备类型
const getDeviceTypeFromProductType = (productType, deviceType) => {
  // 特殊处理：相同 productType 但不同 deviceType 的情况
  if (productType === '5ozdgdrd') {
    if (deviceType === 'INPUT6') {
      return 'SIX_INPUT';
    } else if (deviceType === 'OUTPUT4') {
      return 'FOUR_OUTPUT';
    }
  }
  
  const entry = Object.entries(PRODUCT_TYPE_MAP).find(([key, value]) => key === productType);
  return entry ? entry[1] : null;
};

// 获取设备图标
const getDeviceIcon = (productType, deviceType) => {
  try {
    const deviceTypeStr = getDeviceTypeFromProductType(productType, deviceType);
    if (!deviceTypeStr) return null;
    return require(`../../../../assets/icons/DeviceType/${deviceTypeStr}.png`);
  } catch (error) {
    return require(`../../../../assets/icons/DeviceType/UNKNOW_ICON.png`);
  }
};

// 格式化显示文本
const formatDisplayText = (text) => {
  if (!text) return '';
  return text
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// 截断文本组件
const TruncatedText = ({ text, maxLength = 20 }) => {
  const truncatedText = text?.length > maxLength
    ? `${text.substring(0, maxLength)}...`
    : text || '-';

  return (
    <Tooltip
      title={text || '-'}
      placement="top"
      arrow
      sx={{
        tooltip: {
          backgroundColor: '#333',
          fontSize: '0.875rem',
          padding: '8px 12px',
          maxWidth: 'none'
        },
        arrow: {
          color: '#333'
        }
      }}
    >
      <span style={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        display: 'block'
      }}>
        {truncatedText}
      </span>
    </Tooltip>
  );
};

const SceneDeviceCard = ({ device }) => {
  // 获取设备信息，优先使用 deviceInfo，然后回退到原始设备数据
  const productType = device.deviceInfo?.productType || device.productType;
  const deviceType = device.deviceInfo?.deviceType || device.deviceType;
  const deviceTypeStr = getDeviceTypeFromProductType(productType, deviceType);
  const iconSrc = getDeviceIcon(productType, deviceType);
  
  // 获取设备名称，使用多种后备方案
  const deviceName = device.deviceInfo?.name || device.name || `Device ${device.deviceId}`;

  return (
    <Box 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        padding: 2,
        backgroundColor: '#f8f9fa',
        borderRadius: 2,
      }}
    >
      {/* 设备图标 */}
      <Box 
        sx={{ 
          width: 40, 
          height: 40, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          mb: 1,
          mx: 'auto'
        }}
      >
        <img 
          src={iconSrc}
          alt={deviceTypeStr || 'Device'}
          style={{ 
            maxWidth: '100%', 
            maxHeight: '100%',
            objectFit: 'contain'
          }}
        />
      </Box>
      
      {/* 设备类型 */}
      <Typography
        variant="caption"
        component="div"
        align="center"
        sx={{
          color: '#666',
          fontWeight: 500,
          letterSpacing: '0.2px',
          textTransform: 'uppercase',
          fontSize: '0.7rem',
          mb: 1
        }}
      >
        {formatDisplayText(deviceTypeStr) || 'Unknown Device'}
      </Typography>
      
      {/* 设备名称 */}
      <Typography
        variant="body2"
        align="center"
        sx={{
          fontWeight: 600,
          color: '#2c3e50'
        }}
      >
        <TruncatedText text={deviceName} maxLength={15} />
      </Typography>
    </Box>
  );
};

export default SceneDeviceCard;