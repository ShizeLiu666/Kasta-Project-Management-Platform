import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Tooltip
} from '@mui/material';
import { useNetworkDevices, useNetworkGroups } from '../../../../NetworkDetails/useNetworkQueries';
import { PRODUCT_TYPE_MAP } from '../../../../NetworkDetails/PRODUCT_TYPE_MAP';

const getDeviceTypeFromProductType = (productType) => {
  const entry = Object.entries(PRODUCT_TYPE_MAP).find(([key, value]) => key === productType);
  return entry ? entry[1] : null;
};

const getDeviceIcon = (productType) => {
  try {
    const deviceType = getDeviceTypeFromProductType(productType);
    if (!deviceType) return null;
    return require(`../../../../../../assets/icons/DeviceType/${deviceType}.png`);
  } catch (error) {
    return require(`../../../../../../assets/icons/DeviceType/UNKNOW_ICON.png`);
  }
};

const formatDisplayText = (text) => {
  return text
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

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
      <span
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          display: 'block'
        }}
      >
        {truncatedText}
      </span>
    </Tooltip>
  );
};

const FIVE_BUTTON = ({ devices, networkId }) => {
  const [processedDevices, setProcessedDevices] = useState([]);
  
  // 获取所有设备和组的数据用于名称映射
  const { data: allDevices = [] } = useNetworkDevices(networkId);
  const { data: allGroups = [] } = useNetworkGroups(networkId);

  // 创建设备和组的映射
  const deviceMap = React.useMemo(() => {
    return allDevices.reduce((acc, device) => {
      acc[device.did] = device.name;
      return acc;
    }, {});
  }, [allDevices]);

  const groupMap = React.useMemo(() => {
    return allGroups.reduce((acc, group) => {
      acc[group.groupId] = group.name;
      return acc;
    }, {});
  }, [allGroups]);

  // 获取绑定类型显示文本
  // const getBindingTypeText = (type) => {
  //   switch (type) {
  //     case 0:
  //       return 'Device';
  //     case 1:
  //       return 'Group';
  //     case 2:
  //       return 'Scene';
  //     default:
  //       return 'Unknown';
  //   }
  // };

  // 获取绑定目标的名称
  const getBindingName = (binding) => {
    if (!binding) return '';
    
    switch (binding.bindType) {
      case 0: // Device
        return deviceMap[binding.bindId] || `Unknown Device`;
      case 1: // Group
        return groupMap[binding.bindId] || `Unknown Group`;
      case 2: // Scene
        return `Scene ${binding.bindId}`;
      default:
        return `Unknown`;
    }
  };

  // 预处理设备数据，确保remoteBind字段正确
  useEffect(() => {
    if (devices && devices.length > 0) {
      const processed = devices.map(device => {
        const specificAttributes = device.specificAttributes || {};
        let remoteBind = specificAttributes.remoteBind || [];
        if (typeof remoteBind === 'string') {
          try {
            remoteBind = JSON.parse(remoteBind);
          } catch (e) {
            console.error('Failed to parse remoteBind string:', e);
            remoteBind = [];
          }
        }
        return {
          ...device,
          specificAttributes: {
            ...specificAttributes,
            remoteBind
          }
        };
      });
      setProcessedDevices(processed);
    } else {
      setProcessedDevices([]);
    }
  }, [devices]);

  if (!processedDevices || processedDevices.length === 0) return null;

  // 获取按钮绑定信息
  const getButtonBinding = (device, buttonIndex) => {
    const remoteBind = device.specificAttributes?.remoteBind || [];
    return remoteBind.find(binding => Number(binding.hole) === buttonIndex) || null;
  };

  // 渲染按钮绑定信息
  const renderButtonBinding = (binding) => {
    if (!binding) {
      return (
        <Box sx={{ 
          padding: '12px',
          borderRadius: 1.5,
          bgcolor: '#f8f9fa',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          height: '160px',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              opacity: 0.7,
              fontStyle: 'italic'
            }}
          >
            No Binding
          </Typography>
        </Box>
      );
    }
    
    const boundDevice = allDevices.find(device => device.did === binding.bindId);
    const deviceType = boundDevice ? getDeviceTypeFromProductType(boundDevice.productType) : null;
    
    return (
      <Box sx={{ 
        padding: '12px',
        borderRadius: 1.5,
        bgcolor: '#f8f9fa',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        height: '160px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {binding.bindType === 0 && boundDevice && deviceType && (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%'
          }}>
            <img
              src={getDeviceIcon(boundDevice.productType)}
              alt="Device Icon"
              style={{ 
                width: 28,
                height: 28,
                marginBottom: 4
              }}
            />
            <Box sx={{ 
              width: '100%', 
              textAlign: 'center',
            }}>
              <Typography
                variant="caption"
                component="div"
                sx={{
                  color: '#666',
                  fontWeight: 500,
                  letterSpacing: '0.2px',
                  textTransform: 'uppercase',
                  fontSize: '0.7rem'
                }}
              >
                {formatDisplayText(deviceType)}
              </Typography>
            </Box>
          </Box>
        )}
        
        <Box sx={{ 
          width: '100%',
          textAlign: 'center'
        }}>
          <Typography
            variant="body2"
            component="div"
            sx={{
              color: '#2c3e50',
              fontWeight: 600,
              fontSize: '0.875rem'
            }}
          >
            <TruncatedText 
              text={getBindingName(binding)} 
              maxLength={20}
            />
          </Typography>
        </Box>
        
        {binding.bindChannel !== null && (
          <Box sx={{ 
            textAlign: 'center',
            width: '100%'
          }}>
            <Typography 
              variant="caption" 
              sx={{
                color: '#95a5a6',
                display: 'block',
                fontSize: '0.7rem'
              }}
            >
              Channel
            </Typography>
            <Typography 
              variant="body2"
              sx={{
                color: '#34495e',
                fontWeight: 500
              }}
            >
              {binding.bindChannel ? 'Right' : 'Left'}
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  // 检查是否有任何设备绑定了特定按钮
  const anyDeviceHasButtonBinding = (buttonIndex) => {
    return processedDevices.some(device => {
      const remoteBind = device.specificAttributes?.remoteBind || [];
      return remoteBind.some(b => Number(b.hole) === buttonIndex);
    });
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <img
          src={require('../../../../../../assets/icons/DeviceType/FIVE_BUTTON.png')}
          alt="5-Button Remote"
          style={{ width: 30, height: 30, marginRight: 12 }}
        />
        <Typography variant="h6" sx={{ fontWeight: 500, color: '#fbcd0b' }}>
          5-Button Remote
        </Typography>
        <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
          ({processedDevices.length} {processedDevices.length === 1 ? 'device' : 'devices'})
        </Typography>
      </Box>
      
      <TableContainer 
        component={Paper} 
        elevation={0}
        variant="outlined" 
        sx={{ 
          borderRadius: 2,
          overflow: 'hidden',
          borderColor: 'rgba(224, 224, 224, 0.7)'
        }}
      >
        <Table size="medium" sx={{ tableLayout: 'fixed' }}>
          <TableHead>
            {/* 表头第一行 */}
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell 
                width="20%" 
                sx={{ 
                  borderBottom: '1px solid rgba(224, 224, 224, 0.7)',
                  fontWeight: 500,
                  padding: '12px 16px'
                }}
              >
                Device
              </TableCell>
              <TableCell 
                width="10%" 
                sx={{ 
                  borderBottom: '1px solid rgba(224, 224, 224, 0.7)',
                  fontWeight: 500,
                  padding: '12px 16px'
                }}
              >
                Check Time
              </TableCell>
              <TableCell 
                colSpan={5} 
                align="center"
                sx={{ 
                  borderBottom: '1px solid rgba(224, 224, 224, 0.7)',
                  fontWeight: 500,
                  padding: '12px 16px'
                }}
              >
                Button Bindings
              </TableCell>
            </TableRow>
            
            {/* 表头第二行 - 按钮标签 */}
            <TableRow>
              <TableCell sx={{ padding: '8px 16px', borderBottom: '1px solid rgba(224, 224, 224, 0.3)' }}></TableCell>
              <TableCell sx={{ padding: '8px 16px', borderBottom: '1px solid rgba(224, 224, 224, 0.3)' }}></TableCell>
              {[1, 2, 3, 4, 5].map(buttonIndex => {
                const hasBinding = anyDeviceHasButtonBinding(buttonIndex);
                
                return (
                  <TableCell 
                    key={buttonIndex} 
                    align="center" 
                    sx={{ 
                      padding: '8px',
                      borderBottom: '1px solid rgba(224, 224, 224, 0.3)'
                    }}
                  >
                    <Chip 
                      label={`Button ${buttonIndex}`} 
                      size="small" 
                      sx={{ 
                        bgcolor: hasBinding ? '#fbcd0b' : '#9e9e9e',
                        color: '#ffffff',
                        fontWeight: 500,
                        padding: '0 2px'
                      }}
                    />
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          
          <TableBody>
            {processedDevices.map((device, deviceIndex) => (
              <TableRow
                key={device.deviceId}
                sx={{ 
                  bgcolor: 'white', // 统一设置为白色，移除斑马纹
                }}
              >
                {/* 设备名称列 */}
                <TableCell 
                  component="th" 
                  scope="row" 
                  sx={{ 
                    padding: '16px',
                    borderBottom: deviceIndex === processedDevices.length - 1 ? 'none' : '1px solid rgba(224, 224, 224, 0.2)',
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {device.name}
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{ color: '#95a5a6', ml: 0.5, fontWeight: 400 }}
                      >
                        - {device.deviceId}
                      </Typography>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {device.appearanceShortname}
                    </Typography>
                  </Box>
                </TableCell>
                
                {/* 检查时间列 */}
                <TableCell 
                  sx={{ 
                    padding: '16px', 
                    borderBottom: deviceIndex === processedDevices.length - 1 ? 'none' : '1px solid rgba(224, 224, 224, 0.2)',
                  }}
                >
                  {device.specificAttributes?.checkTime || 'N/A'}
                </TableCell>
                
                {/* 按钮绑定单元格 */}
                {[1, 2, 3, 4, 5].map(buttonIndex => {
                  const binding = getButtonBinding(device, buttonIndex);
                  
                  return (
                    <TableCell 
                      key={buttonIndex} 
                      align="center"
                      sx={{
                        padding: '16px 8px',
                        borderBottom: deviceIndex === processedDevices.length - 1 ? 'none' : '1px solid rgba(224, 224, 224, 0.2)',
                      }}
                    >
                      {renderButtonBinding(binding)}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default FIVE_BUTTON; 