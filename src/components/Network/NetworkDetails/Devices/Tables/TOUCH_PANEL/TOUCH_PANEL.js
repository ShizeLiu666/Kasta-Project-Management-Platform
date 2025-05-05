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
import { useNetworkDevices, useNetworkGroups, useNetworkScenes } from '../../../../NetworkDetails/useNetworkQueries';
import { PRODUCT_TYPE_MAP } from '../../../../NetworkDetails/PRODUCT_TYPE_MAP';

// 解析设备类型信息
const parseDeviceType = (deviceType) => {
  // 特殊面板处理
  if (deviceType === 'CW_PANEL') return { buttonCount: 2, type: 'CCT Panel', hasBacklight: true };
  if (deviceType === 'RGB_PANEL') return { buttonCount: 3, type: 'RGB Panel', hasBacklight: true };
  if (deviceType === 'RGBCW_PANEL') return { buttonCount: 4, type: 'RGBCW Panel', hasBacklight: true };

  // 提取按键数量和类型
  let buttonCount = 0;
  let type = '';
  let hasBacklight = true;

  // 标准面板 (BWS)
  if (deviceType.includes('BWS')) {
    buttonCount = parseInt(deviceType.match(/\d/)?.[0]) || 0;
    type = 'Standard Panel';
  }
  // T3 版本 (KT*RSB)
  else if (deviceType.startsWith('KT') && deviceType.includes('RSB')) {
    buttonCount = parseInt(deviceType.match(/\d/)?.[0]) || 0;
    if (deviceType.includes('_SWITCH')) {
      type = 'T3 Switch Panel';
    } else if (deviceType.includes('_DIMMER')) {
      type = 'T3 Dimmer Panel';
    } else {
      type = 'T3 Panel';
    }
  }
  // D8 版本 (KD*RSB)
  else if (deviceType.startsWith('KD') && deviceType.includes('RSB')) {
    buttonCount = parseInt(deviceType.match(/\d/)?.[0]) || 0;
    type = 'D8 Panel';
  }
  // Edgy 版本 (EDGY*RB)
  else if (deviceType.startsWith('EDGY')) {
    buttonCount = parseInt(deviceType.match(/\d/)?.[0]) || 0;
    type = 'Edgy Panel';
  }
  // Integral 版本 (INTEGRAL*RB)
  else if (deviceType.startsWith('INTEGRAL')) {
    buttonCount = parseInt(deviceType.match(/\d/)?.[0]) || 0;
    type = 'Integral Panel';
  }
  // Hesperus 版本 (HESPERUS*CSB)
  else if (deviceType.startsWith('HESPERUS')) {
    buttonCount = parseInt(deviceType.match(/\d/)?.[0]) || 0;
    type = 'Hesperus Panel';
    hasBacklight = true;
  }
  // P 版本 (KD*RS)
  else if (deviceType.startsWith('KD') && deviceType.endsWith('RS')) {
    buttonCount = parseInt(deviceType.match(/\d/)?.[0]) || 0;
    type = 'P Panel';
  }
  // P 版本开关和调光器 (KD*TS_*)
  else if (deviceType.startsWith('KD') && deviceType.includes('TS_')) {
    buttonCount = parseInt(deviceType.match(/\d/)?.[0]) || 0;
    if (deviceType.includes('_SWITCH')) {
      type = 'P Switch Panel';
    } else if (deviceType.includes('_DIMMER')) {
      type = 'P Dimmer Panel';
    }
  }
  // Co base 版本 (HS*RSCB)
  else if (deviceType.startsWith('HS') && deviceType.includes('RSCB')) {
    buttonCount = parseInt(deviceType.match(/\d/)?.[0]) || 0;
    type = 'Co Base Panel';
  }

  return { buttonCount, type, hasBacklight };
};

// 首先添加一个反向映射函数
const getDeviceTypeFromProductType = (productType) => {
  const entry = Object.entries(PRODUCT_TYPE_MAP).find(([key, value]) => key === productType);
  return entry ? entry[1] : null;
};

// 获取设备图标的函数
const getDeviceIcon = (productType) => {
  try {
    const deviceType = getDeviceTypeFromProductType(productType);
    if (!deviceType) return null;
    return require(`../../../../../../assets/icons/DeviceType/${deviceType}.png`);
  } catch (error) {
    return require(`../../../../../../assets/icons/DeviceType/UNKNOW_ICON.png`);
  }
};

// 添加格式化显示文本的函数
const formatDisplayText = (text) => {
  return text
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// 修改 TruncatedText 组件
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

// 创建单个面板组组件
const PanelTypeGroup = ({ buttonCount, devices, orientation, deviceMap, groupMap, sceneMap, allDevices }) => {
  const [expanded, setExpanded] = useState(true);
  
  // 获取图标路径
  const getIconPath = (count, orientation) => {
    try {
      return require(`../../../../../../assets/icons/DeviceType/TOUCH_PANEL_${count}_${orientation}.png`);
    } catch (error) {
      return null;
    }
  };

  // 检查是否有任何设备绑定了特定按钮
  const anyDeviceHasButtonBinding = (devices, buttonIndex) => {
    return devices.some(device => {
      const remoteBind = device.specificAttributes?.remoteBind || [];
      return remoteBind.some(b => parseInt(b.hole) === buttonIndex);
    });
  };

  // 获取按钮绑定信息
  const getButtonBinding = (device, buttonIndex) => {
    const remoteBind = device.specificAttributes?.remoteBind || [];
    return remoteBind.find(binding => parseInt(binding.hole) === buttonIndex) || null;
  };

  // 更新获取绑定目标的名称
  const getBindingName = (binding) => {
    if (!binding) return '';
    
    switch (binding.bindType) {
      case 0: // Device
        return deviceMap[binding.bindId] || `Unknown Device`;
      case 1: // Group
        return groupMap[binding.bindId] || `Unknown Group`;
      case 2: // Scene
        return sceneMap[binding.bindId] || `Unknown Scene`;
      default:
        return `Unknown`;
    }
  };

  // 更新渲染按钮绑定
  const renderButtonBinding = (binding) => {
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

    // 获取绑定类型的图标和名称
    const getBindingTypeInfo = () => {
      switch (binding.bindType) {
        case 0: // Device
          const boundDevice = allDevices.find(device => device.did === binding.bindId);
          return {
            icon: boundDevice ? getDeviceIcon(boundDevice.productType) : null,
            typeName: boundDevice ? getDeviceTypeFromProductType(boundDevice.productType) : 'DEVICE'
          };
        case 1: // Group
          return {
            icon: require('../../../../../../assets/icons/NetworkOverview/Group.png'),
            typeName: 'GROUP'
          };
        case 2: // Scene
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
        {/* 标题区域 - 与 BasicTable 一致的可点击标题栏 */}
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
              src={getIconPath(buttonCount, orientation === 'horizontal' ? 'h' : 'v')}
              alt={`${buttonCount}-Button Panel`}
              style={{ width: 30, height: 30, marginRight: 12 }}
            />
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: '#fbcd0b',
              }}
            >
              {`${buttonCount}-Button Touch Panel (${orientation === 'horizontal' ? 'Horizontal' : 'Vertical'})`}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Chip
              label={`${devices.length} ${devices.length === 1 ? 'device' : 'devices'}`}
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
          <TableContainer component={Box}>
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
                    colSpan={buttonCount} 
                    align="center"
                    sx={{ 
                      borderBottom: '1px solid rgba(224, 224, 224, 0.7)',
                      fontWeight: 'bold',
                      padding: '12px 16px'
                    }}
                  >
                    Button Bindings
                  </TableCell>
                </TableRow>
                
                {/* 表头第二行 - 按钮标签 */}
                <TableRow>
                  <TableCell sx={{ padding: '8px 16px', borderBottom: '1px solid rgba(224, 224, 224, 0.3)' }}></TableCell>
                  {Array.from({ length: buttonCount }, (_, index) => {
                    const buttonIndex = index + 1;
                    const hasBinding = anyDeviceHasButtonBinding(devices, buttonIndex);
                    
                    return (
                      <TableCell 
                        key={`header-button-${buttonIndex}`} 
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
                {devices.map((device, deviceIndex) => (
                  <TableRow
                    key={`device-row-${device.deviceId}`}
                    sx={{ bgcolor: 'white' }}
                  >
                    {/* 设备名称列 */}
                    <TableCell 
                      component="th" 
                      scope="row" 
                      sx={{ 
                        padding: '16px',
                        borderBottom: deviceIndex === devices.length - 1 ? 'none' : '1px solid rgba(224, 224, 224, 0.2)',
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
                              {`- ${device.deviceId} | ${device.did}`}
                            </Typography>
                          </Tooltip>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {device.appearanceShortname}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    {/* 按钮绑定单元格 */}
                    {Array.from({ length: buttonCount }, (_, index) => {
                      const buttonIndex = index + 1;
                      const binding = getButtonBinding(device, buttonIndex);
                      
                      return (
                        <TableCell 
                          key={`${device.deviceId}-button-${buttonIndex}`}
                          align="center"
                          sx={{
                            padding: '8px',
                            width: `${75 / buttonCount}%`,
                            height: '140px',
                            borderBottom: deviceIndex === devices.length - 1 ? 'none' : '1px solid rgba(224, 224, 224, 0.2)',
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
        </Collapse>
      </Paper>
    </Box>
  );
};

const TOUCH_PANEL = ({ groupedDevices, networkId }) => {
  const { horizontal: horizontalDevices, vertical: verticalDevices } = groupedDevices;
  
  // 添加 scenes 数据获取
  const { data: allDevices = [] } = useNetworkDevices(networkId);
  const { data: allGroups = [] } = useNetworkGroups(networkId);
  const { data: allScenes = [] } = useNetworkScenes(networkId);

  // 更新映射关系，添加 scenes
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

  const sceneMap = React.useMemo(() => {
    return allScenes.reduce((acc, scene) => {
      acc[scene.sceneId] = scene.name;
      return acc;
    }, {});
  }, [allScenes]);

  if (!horizontalDevices?.length && !verticalDevices?.length) return null;
  
  // 按按键数量分组
  const groupByButtonCount = (devices) => {
    return devices.reduce((acc, device) => {
      const { buttonCount } = parseDeviceType(device.deviceType);
      if (!acc[buttonCount]) {
        acc[buttonCount] = [];
      }
      acc[buttonCount].push(device);
      return acc;
    }, {});
  };

  const horizontalGrouped = groupByButtonCount(horizontalDevices || []);
  const verticalGrouped = groupByButtonCount(verticalDevices || []);

  return (
    <Box>
      {/* 渲染水平面板 */}
      {Object.entries(horizontalGrouped).map(([buttonCount, devices]) => (
        <PanelTypeGroup 
          key={`horizontal-group-${buttonCount}`}
          buttonCount={parseInt(buttonCount)}
          devices={devices}
          orientation="horizontal"
          deviceMap={deviceMap}
          groupMap={groupMap}
          sceneMap={sceneMap}
          allDevices={allDevices}
        />
      ))}
      
      {/* 渲染垂直面板 */}
      {Object.entries(verticalGrouped).map(([buttonCount, devices]) => (
        <PanelTypeGroup 
          key={`vertical-group-${buttonCount}`}
          buttonCount={parseInt(buttonCount)}
          devices={devices}
          orientation="vertical"
          deviceMap={deviceMap}
          groupMap={groupMap}
          sceneMap={sceneMap}
          allDevices={allDevices}
        />
      ))}
    </Box>
  );
};

export default TOUCH_PANEL; 