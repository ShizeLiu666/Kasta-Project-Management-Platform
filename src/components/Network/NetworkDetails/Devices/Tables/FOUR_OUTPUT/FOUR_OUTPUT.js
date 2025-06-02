import React, { useMemo, useState, useEffect } from 'react';
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
  IconButton,
  Collapse
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useNetworkDevices, useNetworkGroups, useNetworkScenes, useNetworkRooms } from '../../../../NetworkDetails/useNetworkQueries';
import { PRODUCT_TYPE_MAP } from '../../../../NetworkDetails/PRODUCT_TYPE_MAP';
import VirtualDryContacts from './VirtualDryContacts';
import AutomationRules from './AutomationRules';

// 添加工具函数
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
  if (!text) return '';
  return text
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// 复用相同的工具函数
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

const FOUR_OUTPUT = ({ devices, networkId }) => {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [expanded, setExpanded] = useState(true);
  
  // 使用 options 获取数据
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

  // 创建设备和组的映射
  const deviceMap = useMemo(() => {
    if (!allDevices?.length) return {};
    return allDevices.reduce((acc, device) => {
      acc[String(device.did)] = device.name;
      return acc;
    }, {});
  }, [allDevices]);

  const groupMap = useMemo(() => {
    if (!allGroups?.length) return {};
    return allGroups.reduce((acc, group) => {
      acc[group.gid] = group.name;
      return acc;
    }, {});
  }, [allGroups]);

  const sceneMap = useMemo(() => {
    if (!allScenes?.length) return {};
    return allScenes.reduce((acc, scene) => {
      acc[scene.sid] = scene.name;
      return acc;
    }, {});
  }, [allScenes]);

  const roomMap = useMemo(() => {
    if (!allRooms?.length) return {};
    return allRooms.reduce((acc, room) => {
      acc[room.rid] = room.name;
      return acc;
    }, {});
  }, [allRooms]);

  // 预处理设备数据
  const processedDevices = useMemo(() => {
    if (!devices?.length) return [];
    
    return devices.map(device => {
      const specificAttributes = device.specificAttributes || {};
      let signals = specificAttributes.signals || [];
      let remoteBind = specificAttributes.remoteBind || [];
      let virtualDryContacts = specificAttributes.virtualDryContacts || [];
      let automts = specificAttributes.automts || [];
      
      if (typeof signals === 'string') {
        try {
          signals = JSON.parse(signals);
        } catch (e) {
          console.error('Failed to parse signals string:', e);
          signals = [];
        }
      }
      
      if (typeof remoteBind === 'string') {
        try {
          remoteBind = JSON.parse(remoteBind);
        } catch (e) {
          console.error('Failed to parse remoteBind string:', e);
          remoteBind = [];
        }
      }

      if (typeof virtualDryContacts === 'string') {
        try {
          virtualDryContacts = JSON.parse(virtualDryContacts);
        } catch (e) {
          console.error('Failed to parse virtualDryContacts string:', e);
          virtualDryContacts = [];
        }
      }
      
      if (typeof automts === 'string') {
        try {
          automts = JSON.parse(automts);
        } catch (e) {
          console.error('Failed to parse automts string:', e);
          automts = [];
        }
      }

      return {
        ...device,
        specificAttributes: {
          ...specificAttributes,
          signals,
          remoteBind,
          virtualDryContacts,
          automts
        }
      };
    });
  }, [devices]);

  // 获取绑定目标的名称（类似于 SIX_INPUT.js）
  const getBindingName = React.useCallback((binding) => {
    if (!binding) return '';
    
    switch (binding.bindType) {
      case 0: // Device
        return deviceMap[String(binding.bindId)] || `Unknown Device (${binding.bindId})`;
      case 1: // 未知类型，可能未使用
        return `Unknown Type 1 (${binding.bindId})`;
      case 2: // Group
        return groupMap[binding.bindId] || `Unknown Group (${binding.bindId})`;
      case 3: // Room
        return roomMap[binding.bindId] || `Unknown Room (${binding.bindId})`;
      case 4: // Scene
        return sceneMap[binding.bindId] || `Unknown Scene (${binding.bindId})`;
      default:
        return `Unknown (${binding.bindId})`;
    }
  }, [deviceMap, groupMap, sceneMap, roomMap]);

  // 获取端子信息和绑定信息（类似于 SIX_INPUT.js）
  const getTerminalInfo = React.useCallback((device, terminalIndex) => {
    const signals = device.specificAttributes?.signals || [];
    const remoteBind = device.specificAttributes?.remoteBind || [];
    const signal = signals.find(signal => Number(signal.hole) === terminalIndex) || null;
    const binding = remoteBind.find(bind => Number(bind.hole) === terminalIndex) || null;
    return { signal, binding };
  }, []);

  // 检查是否有任何设备配置了特定端子（更健壮的版本）
  const anyDeviceHasTerminal = React.useCallback((terminalIndex) => {
    return processedDevices.some(device => {
      const signals = device.specificAttributes?.signals || [];
      const remoteBind = device.specificAttributes?.remoteBind || [];
      
      // 检查 signals 或 remoteBind 中是否有对应的端子
      return signals.some(s => Number(s.hole) === terminalIndex && s.isConfig === 1) || 
             remoteBind.some(b => Number(b.hole) === terminalIndex);
    });
  }, [processedDevices]);

  // 渲染端子信息（类似于 SIX_INPUT.js 但适应 FOUR_OUTPUT 的需求）
  const renderTerminalInfo = React.useCallback((terminal) => {
    const { signal, binding } = terminal || {};
    
    if (!signal) {
      return (
        <Box sx={{ 
          padding: '12px',
          borderRadius: 1.5,
          bgcolor: '#f8f9fa',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          height: '260px',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ opacity: 0.7, fontStyle: 'italic' }}
          >
            No Signal
          </Typography>
        </Box>
      );
    }

    // 获取绑定类型的图标和名称
    const getBindingTypeInfo = () => {
      switch (binding?.bindType) {
        case 0: // Device
          const boundDevice = allDevices.find(device => 
            String(device.did) === String(binding.bindId)
          );
          return {
            icon: boundDevice ? getDeviceIcon(boundDevice.productType) : null,
            typeName: boundDevice ? getDeviceTypeFromProductType(boundDevice.productType) : 'DEVICE'
          };
        case 1: // 未知类型
          return {
            icon: null,
            typeName: 'UNKNOWN'
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
            typeName: null
          };
      }
    };

    const bindingTypeInfo = binding ? getBindingTypeInfo() : null;

    return (
      <Box sx={{ 
        padding: '12px',
        borderRadius: 1.5,
        bgcolor: '#f8f9fa',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        height: '260px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Terminal Name */}
        <Box sx={{ width: '100%', textAlign: 'center' }}>
          <Typography
            variant="body2"
            component="div"
            sx={{
              color: '#2c3e50',
              fontWeight: 600,
              fontSize: '0.875rem'
            }}
          >
            <TruncatedText text={signal.name} maxLength={20} />
          </Typography>
        </Box>

        {/* Signal Type */}
        <Box sx={{ 
          textAlign: 'center', 
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px'
        }}>
          <Typography 
            variant="caption" 
            sx={{
              color: '#95a5a6',
              fontSize: '0.7rem'
            }}
          >
            Signal Type
          </Typography>
          <Typography 
            variant="body2"
            sx={{ fontWeight: 500 }}
          >
            {signal.type === 0 ? 'Toggle' : 'Momentary'}
          </Typography>
        </Box>

        {/* Binding Information */}
        {binding && bindingTypeInfo && (
          <>
            {bindingTypeInfo.icon && (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                mt: 1
              }}>
                <img
                  src={bindingTypeInfo.icon}
                  alt="Binding Icon"
                  style={{ width: 24, height: 24 }}
                />
                <Typography
                  variant="caption"
                  component="div"
                  sx={{
                    color: '#666',
                    fontWeight: 500,
                    letterSpacing: '0.2px',
                    textTransform: 'uppercase',
                    fontSize: '0.7rem',
                    mt: 0.5
                  }}
                >
                  {formatDisplayText(bindingTypeInfo.typeName)}
                </Typography>
              </Box>
            )}

            <Box sx={{ width: '100%', textAlign: 'center', mt: 1 }}>
              <Typography
                variant="body2"
                component="div"
                sx={{
                  color: '#2c3e50',
                  fontWeight: 500,
                  fontSize: '0.8rem'
                }}
              >
                <TruncatedText text={getBindingName(binding)} maxLength={20} />
              </Typography>
            </Box>

            {/* Timer Information */}
            {signal.type === 0 && (
              <Box sx={{ 
                textAlign: 'center', 
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
              }}>
                <Typography 
                  variant="caption" 
                  sx={{
                    color: '#95a5a6',
                    fontSize: '0.7rem'
                  }}
                >
                  Timer
                </Typography>
                <Typography 
                  variant="body2"
                  sx={{ 
                    fontWeight: 500,
                    color: binding.hasTimer === 1 ? '#2c3e50' : '#666'
                  }}
                >
                  {binding.hasTimer === 1 ? (
                    binding.enable === 1 ? (
                      <>
                        {`${String(binding.hour).padStart(2, '0')}:${String(binding.min).padStart(2, '0')}`}
                        <Typography
                          component="span"
                          sx={{
                            fontSize: '0.75rem',
                            color: '#95a5a6',
                            ml: 0.5
                          }}
                        >
                          ({binding.state === 1 ? 'On' : 'Off'})
                        </Typography>
                      </>
                    ) : (
                      'Disabled'
                    )
                  ) : (
                    'None'
                  )}
                </Typography>
              </Box>
            )}
          </>
        )}
      </Box>
    );
  }, [allDevices, getBindingName]);

  // 切换视图的处理函数
  const handleToggleView = () => {
    setShowDetailedView(!showDetailedView);
  };

  // 当用户点击设备行时选择设备
  const handleSelectDevice = (device) => {
    setSelectedDevice(device);
  };

  useEffect(() => {
    // 初始化时选择第一个设备
    if (processedDevices?.length > 0 && !selectedDevice) {
      setSelectedDevice(processedDevices[0]);
    }
  }, [processedDevices, selectedDevice]);

  if (!processedDevices || processedDevices.length === 0) return null;

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
        {/* 可折叠的标题区域 */}
        <Box 
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            backgroundColor: '#f8f9fa',
            borderBottom: expanded ? '1px solid rgba(224, 224, 224, 0.7)' : 'none',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={require('../../../../../../assets/icons/DeviceType/FOUR_OUTPUT.png')}
              alt="4-Output Device"
              style={{
                width: 30,
                height: 30,
                objectFit: 'contain',
                marginRight: 12
              }}
            />
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: '#fbcd0b',
              }}
            >
              4-Output Device
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
            
            {/* 切换按钮 */}
            <Tooltip title={showDetailedView ? "Show Output Terminals" : "Show Details"}>
              <IconButton 
                onClick={handleToggleView}
                disableRipple
                size="small"
                sx={{ 
                  bgcolor: '#fbcd0b20',
                  color: '#fbcd0b',
                  '&:hover': { bgcolor: '#fbcd0b30' },
                  mr: 1
                }}
              >
                {showDetailedView ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </IconButton>
            </Tooltip>
            
            <IconButton 
              size="small"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        </Box>

        {/* 可折叠的内容区域 */}
        <Collapse in={expanded}>
          {!showDetailedView ? (
            // 第一个视图：只显示 Output Terminals
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
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell
                    width="30%"
                    sx={{
                      borderBottom: '1px solid rgba(224, 224, 224, 0.7)',
                      fontWeight: 500,
                      padding: '8px 16px'
                    }}
                  >
                    Device
                  </TableCell>
                  <TableCell
                    colSpan={4}
                    align="center"
                    width="70%"
                    sx={{
                      borderBottom: '1px solid rgba(224, 224, 224, 0.7)',
                      fontWeight: 500,
                      padding: '8px 16px'
                    }}
                  >
                    Output Terminals
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ padding: '8px 16px', borderBottom: '1px solid rgba(224, 224, 224, 0.3)' }}></TableCell>
                    {[0, 1, 2, 3].map(terminalIndex => {
                    const hasTerminal = anyDeviceHasTerminal(terminalIndex);
                    return (
                      <TableCell
                        key={terminalIndex}
                        align="center"
                        sx={{
                          padding: '8px',
                          borderBottom: '1px solid rgba(224, 224, 224, 0.3)'
                        }}
                      >
                        <Chip
                            label={`Output ${terminalIndex + 1}`}
                          size="small"
                          sx={{
                            bgcolor: hasTerminal ? '#fbcd0b' : '#9e9e9e',
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
                      cursor: 'pointer',
                        height: '276.5px',
                        '&:last-child td': { border: 0 }
                    }}
                    onClick={() => handleSelectDevice(device)}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        padding: '8px 16px',
                        borderBottom: deviceIndex === processedDevices.length - 1 ? 'none' : '1px solid rgba(224, 224, 224, 0.2)',
                        height: '276.5px'
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

                      {[0, 1, 2, 3].map(terminalIndex => {
                      const terminal = getTerminalInfo(device, terminalIndex);
                      return (
                        <TableCell
                          key={terminalIndex}
                          align="center"
                          sx={{
                            padding: '8px',
                            width: `${70 / 4}%`,
                            height: '276.5px',
                            maxHeight: '276.5px',
                            borderBottom: deviceIndex === processedDevices.length - 1 ? 'none' : '1px solid rgba(224, 224, 224, 0.2)',
                            overflow: 'hidden'
                          }}
                        >
                          {renderTerminalInfo(terminal)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          ) : (
            // 第二个视图：显示 Virtual Dry Contacts 和 Automation Rules
            <Box sx={{ display: 'flex', gap: 2, p: 2 }}>
              {/* 左侧区域 - Virtual Dry Contacts */}
              <Box sx={{ width: '50%' }}>
          {selectedDevice && (
            <Paper
              elevation={0}
              variant="outlined"
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                borderColor: 'rgba(224, 224, 224, 0.7)',
                bgcolor: '#ffffff',
                height: '369px',
                maxHeight: '369px'
              }}
            >
              <Box sx={{
                bgcolor: '#f5f5f5',
                p: 1.5,
                borderBottom: '1px solid rgba(224, 224, 224, 0.7)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  Virtual Dry Contacts
                </Typography>
              </Box>
              <Box sx={{ 
                height: 'calc(369px - 52px)', 
                maxHeight: 'calc(369px - 52px)', 
                overflow: 'auto'
              }}>
                <VirtualDryContacts
                  device={selectedDevice}
                />
              </Box>
            </Paper>
          )}
        </Box>

              {/* 右侧区域 - Automation Rules */}
              <Box sx={{ width: '50%' }}>
          {selectedDevice && (
            <Paper
              elevation={0}
              variant="outlined"
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                borderColor: 'rgba(224, 224, 224, 0.7)',
                bgcolor: '#ffffff',
                height: '369px',
                maxHeight: '369px'
              }}
            >
              <Box sx={{
                bgcolor: '#f5f5f5',
                p: 1.5,
                borderBottom: '1px solid rgba(224, 224, 224, 0.7)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  Automation Rules
                </Typography>
              </Box>
              <Box sx={{ 
                height: 'calc(369px - 52px)', 
                maxHeight: 'calc(369px - 52px)', 
                overflow: 'auto'
              }}>
                <AutomationRules
                  device={selectedDevice}
                  deviceMap={deviceMap}
                  groupMap={groupMap}
                        sceneMap={sceneMap}
                        roomMap={roomMap}
                />
              </Box>
            </Paper>
          )}
        </Box>
      </Box>
          )}
        </Collapse>
      </Paper>
    </Box>
  );
};

export default FOUR_OUTPUT; 