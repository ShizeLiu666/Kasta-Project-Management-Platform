import React, { useMemo, useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Badge,
  Collapse,
  Button
} from '@mui/material';
import { useNetworkDevices, useNetworkGroups } from '../../../../NetworkDetails/useNetworkQueries';
import { PRODUCT_TYPE_MAP } from '../../../../NetworkDetails/PRODUCT_TYPE_MAP';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AlarmIcon from '@mui/icons-material/Alarm';
import WorkIcon from '@mui/icons-material/Work';
import SensorsIcon from '@mui/icons-material/Sensors';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
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

// 简化自动化对话框
const AutomationDialog = ({ open, onClose, automation, deviceMap, groupMap }) => {
  if (!automation) return null;

  // 格式化时间显示
  const formatTime = (hour, minute) => {
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  };

  // 格式化星期显示
  const formatWeekdays = (weekdays) => {
    if (!weekdays) return 'None';
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return weekdays.split('').map((enabled, idx) => 
      enabled === '1' ? days[idx] : null
    ).filter(Boolean).join(', ');
  };

  const getTargetName = (item) => {
    if (!item) return 'Unknown';
    
    switch (item.targetType) {
      case 0: // Device
        return deviceMap[String(item.targetId)] || `Unknown Device`;
      case 1: // Group
        return groupMap[item.targetId] || `Unknown Group`;
      case 2: // Scene
        return `Scene ${item.targetId}`;
      default:
        return `Unknown`;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        bgcolor: '#f5f5f5',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {automation.name || `Case ${automation.caseIdx}`}
          </Typography>
          <Chip 
            label={automation.state ? "Active" : "Inactive"} 
            color={automation.state ? "success" : "default"}
            size="small"
            sx={{ ml: 1 }}
          />
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 2, pb: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Basic Information
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 2, mb: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">Rule Logic</Typography>
              <Typography variant="body2">
                {automation.logicOr ? "OR Logic" : "AND Logic"}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="caption" color="text.secondary">Time Schedule</Typography>
              <Typography variant="body2">
                {automation.periodEnable ? (
                  `${formatTime(automation.startHour, automation.startMinute)} - ${formatTime(automation.stopHour, automation.stopMinute)}`
                ) : (
                  "No time restriction"
                )}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="caption" color="text.secondary">Active Days</Typography>
              <Typography variant="body2">
                {formatWeekdays(automation.weekdays)}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />
        
        {/* Triggers Section */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Triggers ({automation.triggers?.length || 0})
          </Typography>
          
          <Box sx={{ 
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            mb: 2
          }}>
            {automation.triggers?.length > 0 ? (
              <List dense disablePadding>
                {automation.triggers.map((trigger, idx) => (
                  <ListItem 
                    key={idx}
                    divider={idx < automation.triggers.length - 1}
                    sx={{ 
                      py: 1,
                      bgcolor: idx % 2 === 0 ? '#f9f9f9' : 'white'
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {`${trigger.conditionNum}. ${trigger.elementName || 'Condition'}`}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {`Type: ${trigger.activeType === 0 ? 'High level' : 'Low level'}`}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No triggers defined
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
        
        {/* Actions Section */}
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Actions ({automation.actions?.length || 0})
          </Typography>
          
          <Box sx={{ 
            border: '1px solid #e0e0e0',
            borderRadius: 1
          }}>
            {automation.actions?.length > 0 ? (
              <List dense disablePadding>
                {automation.actions.map((action, idx) => (
                  <ListItem 
                    key={idx}
                    divider={idx < automation.actions.length - 1}
                    sx={{ 
                      py: 1,
                      bgcolor: idx % 2 === 0 ? '#f9f9f9' : 'white'
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {getTargetName(action)}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          Duration: {action.duration} {action.durationType === 0 ? 'seconds' : 'minutes'}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No actions defined
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

const SIX_INPUT = ({ devices, networkId }) => {
  const [selectedAutomation, setSelectedAutomation] = useState(null);
  const [automationDialogOpen, setAutomationDialogOpen] = useState(false);
  
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
      acc[group.groupId] = group.name;
      return acc;
    }, {});
  }, [allGroups]);

  // 预处理设备数据 - 使用 useMemo 替代 useState + useEffect
  const processedDevices = useMemo(() => {
    if (!devices?.length) return [];
    
    return devices.map(device => {
      const specificAttributes = device.specificAttributes || {};
      let signals = specificAttributes.signals || [];
      let remoteBind = specificAttributes.remoteBind || [];
      
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

      return {
        ...device,
        specificAttributes: {
          ...specificAttributes,
          signals,
          remoteBind
        }
      };
    });
  }, [devices]);

  // 获取绑定目标的名称
  const getBindingName = React.useCallback((binding) => {
    if (!binding) return '';
    
    switch (binding.bindType) {
      case 0: // Device
        return deviceMap[String(binding.bindId)] || `Unknown Device`;
      case 1: // Group
        return groupMap[binding.bindId] || `Unknown Group`;
      case 2: // Scene
        return `Scene ${binding.bindId}`;
      default:
        return `Unknown`;
    }
  }, [deviceMap, groupMap]);

  // 获取端子信息和绑定信息
  const getTerminalInfo = React.useCallback((device, terminalIndex) => {
    const signals = device.specificAttributes?.signals || [];
    const remoteBind = device.specificAttributes?.remoteBind || [];
    const signal = signals.find(signal => Number(signal.hole) === terminalIndex) || null;
    const binding = remoteBind.find(bind => Number(bind.hole) === terminalIndex) || null;
    return { signal, binding };
  }, []);

  // 检查是否有任何设备配置了特定端子
  const anyDeviceHasTerminal = React.useCallback((terminalIndex) => {
    return processedDevices.some(device => {
      const signals = device.specificAttributes?.signals || [];
      return signals.some(s => Number(s.hole) === terminalIndex && s.isConfig === 1);
    });
  }, [processedDevices]);

  // 渲染端子信息
  const renderTerminalInfo = React.useCallback((terminal) => {
    const { signal, binding } = terminal || {};
    
    if (!signal) {
      return (
        <Box sx={{ 
          padding: '12px',
          borderRadius: 1.5,
          bgcolor: '#f8f9fa',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          height: '210px',
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

    const boundDevice = binding ? allDevices.find(device => 
      String(device.did) === String(binding.bindId)
    ) : null;
    
    const deviceType = boundDevice ? getDeviceTypeFromProductType(boundDevice.productType) : null;

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
        {binding && (
          <>
            {binding.bindType === 0 && boundDevice && deviceType && (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                mt: 1
              }}>
                <img
                  src={getDeviceIcon(boundDevice.productType)}
                  alt="Device Icon"
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
                  {formatDisplayText(deviceType)}
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

  // 处理自动化规则
  const processedDevicesWithAutomation = useMemo(() => {
    if (!processedDevices?.length) return [];

    return processedDevices.map(device => {
      const specificAttributes = device.specificAttributes || {};
      let automation = specificAttributes.automation || [];
      
      if (typeof automation === 'string') {
        try {
          automation = JSON.parse(automation);
        } catch (e) {
          console.error('Failed to parse automation string:', e);
          automation = [];
        }
      }

      return {
        ...device,
        specificAttributes: {
          ...specificAttributes,
          automation
        }
      };
    });
  }, [processedDevices]);

  const handleOpenAutomationDialog = (automation) => {
    setSelectedAutomation(automation);
    setAutomationDialogOpen(true);
  };

  const handleCloseAutomationDialog = () => {
    setAutomationDialogOpen(false);
    setSelectedAutomation(null);
  };

  if (!processedDevicesWithAutomation || processedDevicesWithAutomation.length === 0) return null;

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <img
          src={require('../../../../../../assets/icons/DeviceType/SIX_INPUT.png')}
          alt="6-Input Device"
          style={{ width: 30, height: 30, marginRight: 12 }}
        />
        <Typography variant="h6" sx={{ fontWeight: 500, color: '#fbcd0b' }}>
          6-Input Device
        </Typography>
        <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
          ({processedDevicesWithAutomation.length} {processedDevicesWithAutomation.length === 1 ? 'device' : 'devices'})
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
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell
                width="15%"
                sx={{
                  borderBottom: '1px solid rgba(224, 224, 224, 0.7)',
                  fontWeight: 500,
                  padding: '12px 16px'
                }}
              >
                Device
              </TableCell>
              <TableCell
                colSpan={6}
                align="center"
                width="60%"
                sx={{
                  borderBottom: '1px solid rgba(224, 224, 224, 0.7)',
                  fontWeight: 500,
                  padding: '12px 16px'
                }}
              >
                Input Terminals
              </TableCell>
              <TableCell
                width="25%"
                align="center"
                sx={{
                  borderBottom: '1px solid rgba(224, 224, 224, 0.7)',
                  fontWeight: 500,
                  padding: '12px 16px'
                }}
              >
                Automation Rules
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell sx={{ padding: '8px 16px', borderBottom: '1px solid rgba(224, 224, 224, 0.3)' }}></TableCell>
              {[1, 2, 3, 4, 5, 6].map(terminalIndex => {
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
                      label={`Input ${terminalIndex}`}
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
              <TableCell sx={{ padding: '8px 16px', borderBottom: '1px solid rgba(224, 224, 224, 0.3)' }}></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {processedDevicesWithAutomation.map((device, deviceIndex) => (
              <TableRow
                key={device.deviceId}
                sx={{ bgcolor: 'white' }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  sx={{
                    padding: '16px',
                    borderBottom: deviceIndex === processedDevicesWithAutomation.length - 1 ? 'none' : '1px solid rgba(224, 224, 224, 0.2)',
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

                {[1, 2, 3, 4, 5, 6].map(terminalIndex => {
                  const terminal = getTerminalInfo(device, terminalIndex);
                  return (
                    <TableCell
                      key={terminalIndex}
                      align="center"
                      sx={{
                        padding: '8px',
                        width: `${60 / 6}%`,
                        height: '260px',
                        borderBottom: deviceIndex === processedDevicesWithAutomation.length - 1 ? 'none' : '1px solid rgba(224, 224, 224, 0.2)',
                      }}
                    >
                      {renderTerminalInfo(terminal)}
                    </TableCell>
                  );
                })}

                {/* Automation Rules Cell - 使用新组件 */}
                <TableCell
                  align="center"
                  sx={{
                    padding: '8px',
                    borderBottom: deviceIndex === processedDevicesWithAutomation.length - 1 ? 'none' : '1px solid rgba(224, 224, 224, 0.2)',
                  }}
                >
                  <AutomationRules 
                    device={device} 
                    deviceMap={deviceMap} 
                    groupMap={groupMap} 
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SIX_INPUT; 