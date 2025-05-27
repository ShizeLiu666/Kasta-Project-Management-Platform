import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  Tooltip,
  Paper,
  Grid,
  Tabs,
  Tab
} from '@mui/material';
import { PRODUCT_TYPE_MAP } from '../../../../NetworkDetails/PRODUCT_TYPE_MAP';
import { useNetworkGroups, useNetworkScenes } from '../../../../NetworkDetails/useNetworkQueries';

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

// 格式化显示文本的函数
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

// 单个设备绑定卡片组件
const BindingCard = ({ binding, deviceMap, groupMap, sceneMap, roomMap, allDevices, allGroups, allScenes, allRooms, position }) => {
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
      case 1: // Device
        const boundDevice = allDevices.find(device => device.did === binding.bindId);
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

  // 获取绑定目标名称
  const getBindingName = () => {
    if (!binding) return '';
    
    switch (binding.bindType) {
      case 1: // Device
        return deviceMap[binding.bindId] || null;
      case 2: // Group
        // 使用gid作为匹配键
        const group = allGroups?.find(g => g.gid === binding.bindId);
        return group ? group.name : null;
      case 3: // Room
        // 使用roomMap或者从allRooms中查找
        return roomMap[binding.bindId] || 
               allRooms?.find(r => r.roomId === binding.bindId || r.rid === binding.bindId)?.name || 
               null;
      case 4: // Scene
        // 使用sid作为匹配键
        const scene = allScenes?.find(s => s.sid === binding.bindId);
        return scene ? scene.name : null;
      default:
        return null;
    }
  };

  const bindingTypeInfo = getBindingTypeInfo();
  const bindingName = getBindingName();
  
  // 如果无法找到绑定名称，显示 No Binding
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
      justifyContent: 'center',
      position: 'relative'
    }}>
      {/* <Box 
        sx={{
          position: 'absolute',
          top: 4,
          right: 4,
          color: 'rgba(0,0,0,0.3)',
          fontSize: '0.65rem',
          fontWeight: 500
        }}
      >
        {binding.bindChannel}
      </Box> */}
      
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
            text={bindingName} 
            maxLength={20}
          />
        </Typography>
      </Box>
    </Box>
  );
};

// 页面绑定表组件 - 表格布局
const PageBindingsTable = ({ 
  pages, 
  device, 
  deviceMap, 
  groupMap, 
  sceneMap, 
  roomMap,
  allDevices,
  visiblePages,
  allGroups,
  allScenes,
  allRooms,
  maxPages = 5 // 最大页数，默认为5
}) => {
  const bindings = device.specificAttributes.multiVueBinds || [];
  
  // 获取所有要显示的页面的绑定信息
  const getBindingsForPosition = (position) => {
    return visiblePages.map(pageIndex => {
      const pageBindings = bindings.filter(binding => {
        const bindingPage = Math.floor(binding.hole / 4);
        return bindingPage === pageIndex;
      });
      
      const binding = pageBindings.find(b => b.hole % 4 === position);
      return binding || null;
    });
  };

  // 为4个位置准备绑定数据
  const positionBindings = [
    getBindingsForPosition(0),
    getBindingsForPosition(1),
    getBindingsForPosition(2),
    getBindingsForPosition(3)
  ];

  // 获取页面名称
  const getPageName = (pageIndex) => {
    const page = pages.find(p => p.pageIndex === pageIndex);
    return page ? page.pageName : `Page ${pageIndex + 1}`;
  };

  // 计算每个页面应占的宽度
  const calculateColumnWidth = () => {
    const pageCount = visiblePages.length;
    // 确保列宽不会太窄
    return Math.max(11 / maxPages, 11 / pageCount);
  };

  const columnWidth = calculateColumnWidth();

  return (
    <Paper 
      elevation={0} 
      variant="outlined"
      sx={{ 
        borderRadius: 1, 
        mb: 3,
        overflow: 'hidden',
        border: 'none'
      }}
    >
      <Grid container>
        {/* 表头 - 页面名称 */}
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={1} sx={{ 
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderBottom: '1px solid rgba(0,0,0,0.05)'
            }}>
            </Grid>
            {visiblePages.map((pageIndex, index) => (
              <Grid 
                item 
                xs={columnWidth} 
                key={`header-${index}`}
                sx={{ 
                  p: 1,
                  borderBottom: '1px solid rgba(0,0,0,0.05)',
                  textAlign: 'center'
                }}
              >
                <Chip 
                  label={`Page ${pageIndex + 1}: ${getPageName(pageIndex)}`} 
                  size="small" 
                  variant="outlined"
                  sx={{ 
                    fontSize: '0.75rem',
                    color: 'rgba(0,0,0,0.6)',
                    fontWeight: 500,
                    border: '1px solid rgba(0,0,0,0.1)'
                  }}
                />
              </Grid>
            ))}
            {/* 添加空白列以保持一致的布局 */}
            {visiblePages.length < maxPages && (
              <Grid 
                item 
                xs={11 - (columnWidth * visiblePages.length)} 
                sx={{ 
                  borderBottom: '1px solid rgba(0,0,0,0.05)',
                }}
              />
            )}
          </Grid>
        </Grid>

        {/* 绑定内容行 */}
        {positionBindings.map((rowBindings, rowIndex) => (
          <Grid item xs={12} key={`row-${rowIndex}`}>
            <Grid container>
              <Grid 
                item 
                xs={1} 
                sx={{ 
                  p: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Chip 
                  label={`${rowIndex + 1}`} 
                  size="small" 
                  sx={{ 
                    bgcolor: '#40535c',
                    color: '#ffffff',
                    fontWeight: 500,
                    minWidth: '28px'
                  }}
                />
              </Grid>
              {rowBindings.map((binding, colIndex) => (
                <Grid 
                  item 
                  xs={columnWidth} 
                  key={`binding-${rowIndex}-${colIndex}`}
                  sx={{ 
                    p: 1,
                    height: 140,
                    bgcolor: rowIndex % 2 === 0 ? 'rgba(0,0,0,0.01)' : 'transparent'
                  }}
                >
                  <BindingCard 
                    binding={binding}
                    deviceMap={deviceMap}
                    groupMap={groupMap}
                    sceneMap={sceneMap}
                    roomMap={roomMap}
                    allDevices={allDevices}
                    allGroups={allGroups}
                    allScenes={allScenes}
                    allRooms={allRooms}
                    position={rowIndex}
                  />
                </Grid>
              ))}
              {/* 添加空白单元格以保持一致的布局 */}
              {visiblePages.length < maxPages && (
                <Grid 
                  item 
                  xs={11 - (columnWidth * visiblePages.length)} 
                  sx={{ 
                    bgcolor: rowIndex % 2 === 0 ? 'rgba(0,0,0,0.01)' : 'transparent'
                  }}
                />
              )}
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

// 将页面绑定视图作为主组件导出
const PageBindingsView = ({ device, deviceMap, groupMap, sceneMap, roomMap, allDevices, allGroups, allScenes, allRooms, maxPages = 5 }) => {
  // 使用 useMemo 包装 pageNames 以解决警告
  const pageNames = useMemo(() => device?.specificAttributes?.pageNames || [], [device]);
  
  // 添加状态来管理可见页面
  const [visiblePages, setVisiblePages] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  
  // 根据页面数量，计算分组
  const pageGroups = useMemo(() => {
    const groups = [];
    const allPageIndexes = pageNames.map(page => page.pageIndex);
    
    // 按照每组最多maxPages个页面进行分组
    for (let i = 0; i < allPageIndexes.length; i += maxPages) {
      groups.push(allPageIndexes.slice(i, i + maxPages));
    }
    
    // 如果没有页面，创建空分组
    if (groups.length === 0) {
      groups.push([]);
    }
    
    return groups;
  }, [pageNames, maxPages]);
  
  // 切换页面组
  useEffect(() => {
    if (pageGroups.length > 0 && currentTab >= 0 && currentTab < pageGroups.length) {
      setVisiblePages(pageGroups[currentTab]);
    }
  }, [pageGroups, currentTab]);

  // 处理标签切换
  const handleTabChange = (_, newValue) => {
    setCurrentTab(newValue);
  };

  // 获取网络ID以查询组和场景数据
  const networkId = device?.networkId;
  
  // 使用之前传入的组和场景数据，如果没有则获取
  const networksGroups = useNetworkGroups(networkId);
  const networksScenes = useNetworkScenes(networkId);
  
  const finalGroups = allGroups || networksGroups.data || [];
  const finalScenes = allScenes || networksScenes.data || [];

  return (
    <Box>
      {/* 如果有多个页面组，显示标签切换器 */}
      {pageGroups.length > 1 && (
        <Box sx={{ mb: 2 }}>
          <Tabs 
            value={currentTab} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            TabIndicatorProps={{
              style: {
                backgroundColor: '#505050' // 改为灰色主题
              }
            }}
            sx={{
              '& .MuiTab-root': {
                color: 'rgba(0, 0, 0, 0.4)',
                '&.Mui-selected': {
                  color: 'rgba(0, 0, 0, 0.7)'
                },
                '&:hover': {
                  color: 'rgba(0, 0, 0, 0.7)',
                  opacity: 0.7
                },
                fontSize: '0.75rem',
                minHeight: 36,
                padding: '0 16px'
              }
            }}
          >
            {pageGroups.map((group, index) => (
              <Tab 
                key={`tab-${index}`} 
                label={`Page Group ${index + 1}`} 
                disableRipple
              />
            ))}
          </Tabs>
        </Box>
      )}

      {/* 页面绑定表格 */}
      {visiblePages.length > 0 && (
        <PageBindingsTable
          pages={pageNames}
          device={device}
          deviceMap={deviceMap}
          groupMap={groupMap}
          sceneMap={sceneMap}
          roomMap={roomMap}
          allDevices={allDevices}
          allGroups={finalGroups}
          allScenes={finalScenes}
          allRooms={allRooms}
          visiblePages={visiblePages}
          maxPages={maxPages}
        />
      )}
    </Box>
  );
};

export default PageBindingsView; 