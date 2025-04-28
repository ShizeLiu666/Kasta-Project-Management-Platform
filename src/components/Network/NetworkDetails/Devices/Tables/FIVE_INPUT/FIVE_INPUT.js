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
  Tooltip,
  Collapse,
  IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useNetworkDevices, useNetworkGroups } from '../../../../NetworkDetails/useNetworkQueries';
import { PRODUCT_TYPE_MAP } from '../../../../NetworkDetails/PRODUCT_TYPE_MAP';

// 工具函数复用
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

const FIVE_INPUT = ({ devices, networkId }) => {
  const [expanded, setExpanded] = useState(true);
  const [processedDevices, setProcessedDevices] = useState([]);

  // 获取所有设备和组的数据
  const { data: allDevices = [] } = useNetworkDevices(networkId);
  const { data: allGroups = [] } = useNetworkGroups(networkId);

  // 创建设备和组的映射
  const deviceMap = React.useMemo(() => {
    return allDevices.reduce((acc, device) => {
      acc[String(device.did)] = device.name;
      return acc;
    }, {});
  }, [allDevices]);

  const groupMap = React.useMemo(() => {
    return allGroups.reduce((acc, group) => {
      acc[group.groupId] = group.name;
      return acc;
    }, {});
  }, [allGroups]);

  // 获取绑定目标的名称
  const getBindingName = (binding) => {
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
  };

  // 预处理设备数据
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

  // 获取按钮绑定信息
  const getInputBinding = (device, inputIndex) => {
    const remoteBind = device.specificAttributes?.remoteBind || [];
    return remoteBind.find(binding => Number(binding.hole) === inputIndex) || null;
  };

  // 渲染绑定信息
  const renderInputBinding = (binding) => {
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
            sx={{ opacity: 0.7, fontStyle: 'italic' }}
          >
            No Binding
                        </Typography>
        </Box>
      );
    }

    const boundDevice = allDevices.find(device => 
      String(device.did) === String(binding.bindId)
    );
    const deviceType = boundDevice ? getDeviceTypeFromProductType(boundDevice.productType) : null;
    
    return (
      <Box sx={{ 
        padding: '12px',
        borderRadius: 1.5,
        bgcolor: '#f8f9fa',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        height: '210px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px', // 增加间距
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Device Icon 和 Type */}
        {binding.bindType === 0 && boundDevice && deviceType && (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            mb: 0.5
          }}>
            <img
              src={getDeviceIcon(boundDevice.productType)}
              alt="Device Icon"
              style={{ width: 24, height: 24 }} // 稍微减小图标尺寸
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
        
        {/* Device/Group Name */}
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
            <TruncatedText text={getBindingName(binding)} maxLength={20} />
          </Typography>
        </Box>
        
        {/* Input Type */}
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
            Input Type
                        </Typography>
          <Typography 
            variant="body2"
            sx={{ 
              fontWeight: 500,
              color: binding.inputType === 0 ? '#2c3e50' : '#666'
            }}
          >
            {binding.inputType === 0 ? 'Toggle' : 'Momentary'}
                        </Typography>
        </Box>

        {/* Timer Section - 始终显示 */}
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
              color: binding.inputType === 0 && binding.hasTimer === 1 ? '#2c3e50' : '#666'
            }}
          >
            {binding.inputType === 1 ? (
              'None'
            ) : binding.hasTimer === 1 ? (
              <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                {binding.enable === 1 ? (
                  <>
                    {`${String(binding.hour).padStart(2, '0')}:${String(binding.min).padStart(2, '0')}`}
                    <Typography
                      component="span"
                      sx={{
                        fontSize: '0.75rem',
                        color: '#95a5a6',
                      }}
                    >
                      ({binding.state === 1 ? 'On' : 'Off'})
                        </Typography>
                      </>
                ) : (
                  'Disabled'
                )}
              </Box>
            ) : (
              'None'
            )}
          </Typography>
        </Box>
      </Box>
    );
  };

  // 检查是否有任何设备绑定了特定输入
  const anyDeviceHasInputBinding = (inputIndex) => {
    return processedDevices.some(device => {
      const remoteBind = device.specificAttributes?.remoteBind || [];
      return remoteBind.some(b => Number(b.hole) === inputIndex);
    });
  };

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
        {/* 标题区域 - 与 BasicTable 一致 */}
        <Box 
          onClick={() => setExpanded(!expanded)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            backgroundColor: '#f8f9fa',
            borderBottom: expanded ? '1px solid #dee2e6' : 'none',
            cursor: 'pointer',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={require('../../../../../../assets/icons/DeviceType/FIVE_INPUT.png')}
              alt="5-Input Device"
              style={{ width: 30, height: 30, marginRight: 12 }}
            />
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: '#fbcd0b',
              }}
            >
              5-Input Device
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
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
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
                    colSpan={5} 
                    align="center"
                    sx={{ 
                      borderBottom: '1px solid rgba(224, 224, 224, 0.7)',
                      fontWeight: 'bold',
                      padding: '12px 16px'
                    }}
                  >
                    Input Bindings
                  </TableCell>
                </TableRow>
                
                {/* 表头第二行 - 输入标签 */}
                <TableRow>
                  <TableCell sx={{ padding: '8px 16px', borderBottom: '1px solid rgba(224, 224, 224, 0.3)' }}></TableCell>
                  {[1, 2, 3, 4, 5].map(inputIndex => {
                    const hasBinding = anyDeviceHasInputBinding(inputIndex);
                    
                    return (
                      <TableCell 
                        key={inputIndex} 
                        align="center" 
                        sx={{ 
                          padding: '8px',
                          borderBottom: '1px solid rgba(224, 224, 224, 0.3)'
                        }}
                      >
                      <Chip 
                        label={`Input ${inputIndex}`} 
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
                {/* 保持原有的表格内容逻辑 */}
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
                    
                    {/* 输入绑定单元格 */}
                    {[1, 2, 3, 4, 5].map(inputIndex => {
                      const binding = getInputBinding(device, inputIndex);
                      
                      return (
                        <TableCell 
                          key={inputIndex} 
                          align="center"
                          sx={{
                            padding: '8px',
                            width: `${75 / 5}%`,
                            height: '160px',
                            borderBottom: deviceIndex === processedDevices.length - 1 ? 'none' : '1px solid rgba(224, 224, 224, 0.2)',
                          }}
                        >
                          {renderInputBinding(binding)}
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

export default React.memo(FIVE_INPUT); 