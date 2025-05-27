import React, { useState } from 'react';
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
  Tooltip,
  Collapse,
  IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useNetworkDevices, useNetworkGroups, useNetworkScenes, useNetworkRooms } from '../../../../NetworkDetails/useNetworkQueries';
import { PRODUCT_TYPE_MAP } from '../../../../NetworkDetails/PRODUCT_TYPE_MAP';
import pirIcon from '../../../../../../assets/icons/DeviceType/PIR.png';

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

const PIR = ({ devices, networkId }) => {
  const [expanded, setExpanded] = useState(true);
  
  // 获取所有设备、组、场景和房间的数据
  const { data: allDevices = [] } = useNetworkDevices(networkId, {
    enabled: !!networkId,
    staleTime: 30000,
    cacheTime: 60000
  });
  const { data: allGroups = [] } = useNetworkGroups(networkId, {
    enabled: !!networkId,
    staleTime: 30000,
    cacheTime: 60000
  });
  const { data: allScenes = [] } = useNetworkScenes(networkId, {
    enabled: !!networkId,
    staleTime: 30000,
    cacheTime: 60000
  });
  const { data: allRooms = [] } = useNetworkRooms(networkId, {
    enabled: !!networkId,
    staleTime: 30000,
    cacheTime: 60000
  });

  // 预处理设备数据
  const processedDevices = React.useMemo(() => {
    if (!devices?.length) return [];
    
    return devices.map(device => {
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
  }, [devices]);

  // 创建设备和房间的映射
  const deviceMap = React.useMemo(() => {
    if (!allDevices?.length) return {};
    return allDevices.reduce((acc, device) => {
      acc[device.did] = device.name;
      return acc;
    }, {});
  }, [allDevices]);

  const roomMap = React.useMemo(() => {
    if (!allRooms?.length) return {};
    return allRooms.reduce((acc, room) => {
      if (room && room.roomId && room.name) {
        acc[room.roomId] = room.name;
      }
      if (room && room.rid && room.name) {
        acc[room.rid] = room.name;
      }
      return acc;
    }, {});
  }, [allRooms]);

  // 检查是否有任何设备绑定了特定通道
  const anyDeviceHasChannelBinding = (devices, channelIndex) => {
    return devices.some(device => {
      const remoteBind = device.specificAttributes?.remoteBind || [];
      return remoteBind.some(b => parseInt(b.hole) === channelIndex);
    });
  };

  // 获取通道绑定信息
  const getChannelBinding = (device, channelIndex) => {
    const remoteBind = device.specificAttributes?.remoteBind || [];
    return remoteBind.find(binding => parseInt(binding.hole) === channelIndex) || null;
  };

  // 获取绑定目标的名称
  const getBindingName = React.useCallback((binding) => {
    if (!binding) return '';
    
    switch (binding.bindType) {
      case 1: // Device
        return deviceMap[binding.bindId] || null;
      case 2: // Group
        const group = allGroups.find(g => g.gid === binding.bindId);
        return group ? group.name : null;
      case 3: // Room
        return roomMap[binding.bindId] || 
               allRooms?.find(r => r.roomId === binding.bindId || r.rid === binding.bindId)?.name || 
               null;
      case 4: // Scene
        const scene = allScenes.find(s => s.sid === binding.bindId);
        return scene ? scene.name : null;
      default:
        return null;
    }
  }, [deviceMap, allGroups, roomMap, allRooms, allScenes]);

  // 渲染通道绑定信息
  const renderChannelBinding = (binding) => {
    if (!binding) {
      return (
        <Box sx={{ 
          padding: '12px',
          borderRadius: 1.5,
          bgcolor: '#f8f9fa',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          height: '120px',
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

    // 检查绑定名称是否有效
    const bindingName = getBindingName(binding);
    if (bindingName === null) {
      return (
        <Box sx={{ 
          padding: '12px',
          borderRadius: 1.5,
          bgcolor: '#f8f9fa',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          height: '120px',
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
    
    // 获取绑定类型的图标和名称
    const getBindingTypeInfo = () => {
      switch (binding.bindType) {
        case 1: // Device
          const boundDevice = allDevices.find(device => 
            device.did === binding.bindId || 
            Number(device.did) === Number(binding.bindId)
          );
          return {
            icon: boundDevice ? getDeviceIcon(boundDevice.productType) : null,
            typeName: boundDevice ? getDeviceTypeFromProductType(boundDevice.productType) : 'DEVICE'
          };
        case 2: // Group
          return {
            icon: require('../../../../../../assets/icons/NetworkOverview/Group.png'),
            typeName: 'GROUP'
          };
        case 3: // Room
          return {
            icon: require('../../../../../../assets/icons/NetworkOverview/Room.png'),
            typeName: 'ROOM'
          };
        case 4: // Scene
          return {
            icon: require('../../../../../../assets/icons/NetworkOverview/Scene.png'),
            typeName: 'SCENE'
          };
        default:
          return {
            icon: null,
            typeName: 'UNKNOWN'
          };
      }
    };

    const bindingTypeInfo = getBindingTypeInfo();
    
    return (
      <Box sx={{ 
        padding: '12px',
        borderRadius: 1.5,
        bgcolor: '#f8f9fa',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        height: '120px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {bindingTypeInfo.icon && (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%'
          }}>
            <img
              src={bindingTypeInfo.icon}
              alt="Binding Icon"
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
                {formatDisplayText(bindingTypeInfo.typeName)}
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
      </Box>
    );
  };
      
      return (
    <Box sx={{ mb: 4 }}>
      <Paper 
        elevation={0}
          variant="outlined"
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          borderColor: 'rgba(224, 224, 224, 0.7)'
        }}
      >
        {/* 标题区域 */}
        <Box 
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            backgroundColor: '#f8f9fa',
            borderBottom: expanded ? '1px solid #dee2e6' : 'none',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={pirIcon}
              alt="PIR Motion Sensor"
              style={{ width: 30, height: 30, marginRight: 12 }}
            />
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: '#686868',
              }}
            >
              PIR Motion Sensor
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Chip
              label={`${processedDevices.length} ${processedDevices.length === 1 ? 'device' : 'devices'}`}
              size="small"
              sx={{
                bgcolor: 'rgba(251, 205, 11, 0.1)',
                color: '#fbcd0b',
                fontWeight: 500,
                mr: 1
              }}
            />
            <IconButton 
          size="small"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        </Box>

        {/* 可折叠的表格内容 */}
        <Collapse in={expanded}>
          <TableContainer 
            component={Box} 
          sx={{
              width: '100%',
              '& .MuiTable-root': {
                tableLayout: 'fixed',
                width: '100%'
              }
            }}
          >
            <Table size="medium">
              <TableHead>
                {/* 表头第一行 */}
                <TableRow>
                  <TableCell 
                    width="25%" 
                    sx={{ 
                      borderBottom: '1px solid rgba(224, 224, 224, 0.7)',
                      fontWeight: 'bold',
                      padding: '12px 16px'
                    }}
                  >
                    Device
                  </TableCell>
                  <TableCell 
                    colSpan={2} 
                    align="center"
                    sx={{ 
                      borderBottom: '1px solid rgba(224, 224, 224, 0.7)',
                      fontWeight: 'bold',
                      padding: '12px 16px'
                    }}
                  >
                    Channel Bindings
                  </TableCell>
                </TableRow>
                
                {/* 表头第二行 - 通道标签 */}
                <TableRow>
                  <TableCell sx={{ padding: '8px 16px', borderBottom: '1px solid rgba(224, 224, 224, 0.3)' }}></TableCell>
                  {[1, 2].map(channelIndex => {
                    const hasBinding = anyDeviceHasChannelBinding(processedDevices, channelIndex);

  return (
                      <TableCell 
                        key={channelIndex} 
                        align="center" 
                        sx={{ 
                          padding: '8px',
                          borderBottom: '1px solid rgba(224, 224, 224, 0.3)'
                        }}
                      >
                      <Chip 
                        label={`Channel ${channelIndex}`} 
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
                      bgcolor: 'white',
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
                          <Tooltip title={`Device ID: ${device.deviceId || ''} | DID: ${device.did || ''}`}>
                            <Typography
                              component="span"
                              variant="body2"
                              sx={{
                                color: '#95a5a6',
                                ml: 0.5,
                                fontWeight: 400,
                                cursor: 'pointer',
                                textDecoration: 'underline dotted',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: 120,
                                verticalAlign: 'middle',
                                display: 'inline-block'
                              }}
                            >
                              {`- ${device.deviceId.substring(0, 8)}...`}
                            </Typography>
                          </Tooltip>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {device.deviceType} - {device.appearanceShortname}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    {/* 通道绑定单元格 */}
                    {[1, 2].map(channelIndex => {
                      const binding = getChannelBinding(device, channelIndex);
                      
                      return (
                        <TableCell 
                          key={channelIndex} 
                          align="center"
                          sx={{
                            padding: '8px',
                            width: `${75 / 2}%`, // 2个通道平均分配75%的宽度
                            height: '140px',
                            borderBottom: deviceIndex === processedDevices.length - 1 ? 'none' : '1px solid rgba(224, 224, 224, 0.2)',
                          }}
                        >
                          {renderChannelBinding(binding)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Collapse>
      </Paper>
    </Box>
  );
};

export default React.memo(PIR); 