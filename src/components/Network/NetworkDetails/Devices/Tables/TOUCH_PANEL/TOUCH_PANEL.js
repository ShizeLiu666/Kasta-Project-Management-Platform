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

// 产品类型到设备类型的映射
const PRODUCT_TYPE_TO_DEVICE_TYPE = {
  'skr8wl4o': 'HRSMB', // 注意这里故意不指定数字，让代码从deviceType提取
  // 可以添加更多映射
};

// 反向映射函数
const getDeviceTypeFromProductType = (productType) => {
  // 先检查我们的自定义映射
  if (PRODUCT_TYPE_TO_DEVICE_TYPE[productType]) {
    return PRODUCT_TYPE_TO_DEVICE_TYPE[productType];
  }
  
  // 然后检查全局映射
  const entry = Object.entries(PRODUCT_TYPE_MAP).find(([key, value]) => key === productType);
  return entry ? entry[1] : null;
};

// 更新获取设备图标的函数
const getDeviceIcon = (productType) => {
  try {
    const deviceType = getDeviceTypeFromProductType(productType);
    if (!deviceType) return null;
    
    // 不再尝试加载HRSMB特定图标
    return require(`../../../../../../assets/icons/DeviceType/${deviceType}.png`);
  } catch (error) {
    try {
      // 直接回退到未知图标，不尝试加载TOUCH_PANEL.png
      return require(`../../../../../../assets/icons/DeviceType/UNKNOW_ICON.png`);
    } catch (fallbackError) {
      // console.error("无法加载任何图标", fallbackError);
      return null;
    }
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
const PanelTypeGroup = ({ buttonCount, devices, orientation, deviceMap, groupMap, sceneMap, allDevices, allGroups, allScenes }) => {
  const [expanded, setExpanded] = useState(true);
  
  // 获取图标路径 - 修改为使用默认图标，避免路径错误
  const getIconPath = (count, orientation) => {
    // 不管是否为HRSMB面板，都统一使用TOUCH_PANEL格式图标
    try {
      // 尝试使用按钮数量特定图标
      return require(`../../../../../../assets/icons/DeviceType/TOUCH_PANEL_${count}_${orientation === 'horizontal' ? 'h' : 'v'}.png`);
    } catch (error) {
      // 直接回退到未知图标
      try {
        return require(`../../../../../../assets/icons/DeviceType/UNKNOW_ICON.png`);
      } catch (fallbackError) {
        // console.error("无法加载图标:", fallbackError);
        return null;
      }
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
    
    // 可以添加日志方便调试
    // console.log(`Finding name for: type=${binding.bindType}, id=${binding.bindId}`);
    // console.log(`Available groups:`, allGroups.map(g => `id=${g.groupId}, gid=${g.gid}`));
    
    switch (binding.bindType) {
      case 1: // Device (修正为1)
        return deviceMap[binding.bindId] || `Unknown Device`;
      case 2: // Group (修正为2)
        // 尝试查找组ID匹配，如果没有则通过直接查找allGroups
        const group = allGroups.find(g => g.groupId === binding.bindId);
        return group ? group.name : `Unknown Group`;
      case 3: // Room (新增)
        return `Room #${binding.bindId}`;
      case 4: // Scene (修正为4)
        // 尝试查找场景ID匹配，如果没有则通过直接查找allScenes
        const scene = allScenes.find(s => s.sceneId === binding.bindId);
        return scene ? scene.name : `Unknown Scene`;
      default:
        return `Unknown Type (${binding.bindType || 'undefined'})`;
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
        case 1: // Device (修正为1)
          const boundDevice = allDevices.find(device => device.did === binding.bindId);
          return {
            icon: boundDevice ? getDeviceIcon(boundDevice.productType) : null,
            typeName: boundDevice ? getDeviceTypeFromProductType(boundDevice.productType) : 'DEVICE'
          };
        case 2: // Group (修正为2)
          return {
            icon: require('../../../../../../assets/icons/NetworkOverview/Group.png'),
            typeName: 'GROUP'
          };
        case 3: // Room (新增)
          return {
            icon: require('../../../../../../assets/icons/NetworkOverview/Group.png'), // 使用Group图标或其他适当的图标
            typeName: 'ROOM'
          };
        case 4: // Scene (修正为4)
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
                color: '#686868',
              }}
            >
              {/* 检查是否为HRSMB系列 */}
              {devices.some(d => d.deviceType && d.deviceType.startsWith('HRSMB')) 
                ? `HRSMB${buttonCount} Panel (${orientation === 'horizontal' ? 'Horizontal' : 'Vertical'})` 
                : `${buttonCount}-Button Touch Panel (${orientation === 'horizontal' ? 'Horizontal' : 'Vertical'})`}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Chip
              label={`${devices.length} ${devices.length === 1 ? 'device' : 'devices'}`}
              size="small"
              sx={{
                bgcolor: 'rgba(100, 100, 100, 0.1)',
                color: '#606060',
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
                    const buttonIndex = index;  // 修改为从0开始，与hole值对应
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
                              {`- ${device.deviceId.substring(0, 8)}...`}
                            </Typography>
                          </Tooltip>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {device.deviceType} - {device.appearanceShortname}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    {/* 按钮绑定单元格 */}
                    {Array.from({ length: buttonCount }, (_, index) => {
                      const buttonIndex = index;  // 修改为从0开始，与hole值对应
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
  // 如果没有提供分组设备，尝试使用所有设备
  let { horizontal: horizontalDevices = [], vertical: verticalDevices = [] } = groupedDevices || {};
  
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

  // 对各设备进行解析和分类
  const enhanceDeviceType = (device) => {
    // 关键修改：正确提取按钮数量
    let buttonCount = device.deviceType.match(/\d+/);
    buttonCount = buttonCount ? parseInt(buttonCount[0]) : null;
    
    // 如果deviceType中没有数字，则从remoteBind判断
    if (!buttonCount && device.specificAttributes && device.specificAttributes.remoteBind) {
      buttonCount = device.specificAttributes.remoteBind.length;
    }
    
    // 如果仍无法确定，使用默认值
    buttonCount = buttonCount || 1;
    
    const type = device.deviceType;
    
    // 增强设备对象，添加解析后的信息用于分组
    return {
      ...device,
      parsedButtonCount: buttonCount,
      parsedType: type
    };
  };

  // 确保所有设备都经过增强
  horizontalDevices = horizontalDevices.map(enhanceDeviceType);
  verticalDevices = verticalDevices.map(enhanceDeviceType);

  // 如果没有传入分组设备，尝试筛选并自动分组
  if (horizontalDevices.length === 0 && verticalDevices.length === 0 && allDevices.length > 0) {
    // console.log("尝试从所有设备中找出触控面板...");
    
    // 尝试从所有设备中找出触控面板
    const touchPanels = allDevices.filter(device => {
      // HRSMB系列或其他特殊处理
      if (device.deviceType?.startsWith('HRSMB') || 
          PRODUCT_TYPE_TO_DEVICE_TYPE[device.productType] || 
          device.deviceType?.includes('PANEL')) {
        return true;
      }
      
      // 检查是否有remoteBind属性，这通常表明它是触控面板
      const hasBindings = Array.isArray(device.specificAttributes?.remoteBind) && 
                        device.specificAttributes.remoteBind.length > 0;
      
      return hasBindings;
    }).map(enhanceDeviceType);
    
    // console.log(`找到 ${touchPanels.length} 个触控面板设备`);
    
    // 根据isHorizontal属性分组
    horizontalDevices = touchPanels.filter(device => {
      const isHorizontal = device.specificAttributes?.isHorizontal;
      return isHorizontal === null || isHorizontal === 0 || isHorizontal === undefined;
    });
    
    verticalDevices = touchPanels.filter(device => 
      device.specificAttributes?.isHorizontal === 1
    );
    
    // console.log(`分组: ${horizontalDevices.length} 个水平设备, ${verticalDevices.length} 个垂直设备`);
  }
  
  if (!horizontalDevices?.length && !verticalDevices?.length) return null;
  
  // 按按键数量分组
  const groupByButtonCount = (devices) => {
    // console.log("按按钮数量分组...");
    // 打印一下各设备的按钮数量，便于调试
    devices.forEach(device => {
      // console.log(`设备 ${device.name}: deviceType=${device.deviceType}, parsedButtonCount=${device.parsedButtonCount}`);
    });
    
    return devices.reduce((acc, device) => {
      // 使用已解析的按钮数量
      const buttonCount = device.parsedButtonCount || 1;
      
      if (!acc[buttonCount]) {
        acc[buttonCount] = [];
      }
      acc[buttonCount].push(device);
      return acc;
    }, {});
  };

  const horizontalGrouped = groupByButtonCount(horizontalDevices || []);
  const verticalGrouped = groupByButtonCount(verticalDevices || []);
  
  // console.log("分组结果:", Object.keys(horizontalGrouped), Object.keys(verticalGrouped));

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
          allGroups={allGroups}
          allScenes={allScenes}
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
          allGroups={allGroups}
          allScenes={allScenes}
        />
      ))}
    </Box>
  );
};

export default TOUCH_PANEL; 