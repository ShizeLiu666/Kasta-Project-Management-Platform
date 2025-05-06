import React, { useState } from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Collapse,
  IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import multivueIcon from '../../../../../../assets/icons/DeviceType/MULTIVUE.png';
import { useNetworkDevices, useNetworkGroups, useNetworkScenes } from '../../../../NetworkDetails/useNetworkQueries';
import PageBindingsView from './PageBindingsView';

// 属性分组配置 - 调整页面顺序，让Pages & Bindings在首位
const ATTRIBUTE_GROUPS = {
  pages: {
    label: 'Pages & Bindings',
    attributes: [
      { key: 'memo', label: 'Memo', format: v => v || '-' },
      { key: 'pageNames', label: 'Page Names', format: v => Array.isArray(v) ? v.map(p => p.pageName).join(', ') : '-' },
      { 
        key: 'multiVueBinds', 
        label: 'Bindings', 
        format: v => Array.isArray(v) ? `${v.length} binding(s)` : 'No bindings' 
      }
    ]
  },
  display: {
    label: 'Display Settings',
    attributes: [
      { key: 'scBrightness', label: 'Screen Brightness', format: v => `${v}%` },
      { key: 'sleepTimer', label: 'Sleep Timer', format: v => v || 'Off' },
      { key: 'scCloseTimer', label: 'Screen Close Timer', format: v => v || 'Off' },
      { key: 'wakeUpMotion', label: 'Wake Up Motion', format: v => v ? 'On' : 'Off' },
      { key: 'wakeupInterface', label: 'Wakeup Interface', format: v => v || '-' },
      { key: 'boldFont', label: 'Bold Font', format: v => v ? 'On' : 'Off' }
    ]
  },
  buttons: {
    label: 'Button Settings',
    attributes: [
      { key: 'btnBrightness', label: 'Button Brightness', format: v => `${v}%` },
      { key: 'btnColorId', label: 'Button Color ID', format: v => v || '-' },
      { key: 'btnBeep', label: 'Button Beep', format: v => v ? 'On' : 'Off' },
      { 
        key: 'buttonColor', 
        label: 'Button RGB Color', 
        format: (_, attrs) => `RGB(${attrs.btnRed || 0}, ${attrs.btnGreen || 0}, ${attrs.btnBlue || 0})`
      }
    ]
  },
  formats: {
    label: 'Format Settings',
    attributes: [
      { key: 'dateFormat', label: 'Date Format', format: v => v || '-' },
      { key: 'dayFormat', label: 'Day Format', format: v => v || '-' },
      { key: 'timeFormat', label: 'Time Format', format: v => v || '-' },
      { key: 'tempFormat', label: 'Temperature Format', format: v => v || '-' },
      { key: 'language', label: 'Language', format: v => v || '-' }
    ]
  },
  system: {
    label: 'System Settings',
    attributes: [
      { key: 'gestureSensitivity', label: 'Gesture Sensitivity', format: v => v || 'Normal' },
      { key: 'fontVersion', label: 'Font Version', format: v => v || '-' },
      { key: 'iconVersion', label: 'Icon Version', format: v => v || '-' }
    ]
  }
};

const MULTIVUE = ({ devices }) => {
  const [expanded, setExpanded] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0); // 默认选中第一个标签（Pages & Bindings）
  const [selectedDevice, setSelectedDevice] = useState(devices[0]?.deviceId);
  
  // 获取网络ID以查询设备、组和场景数据
  const networkId = devices[0]?.networkId;
  
  // 使用custom hooks获取设备、组和场景数据
  const { data: allDevices = [] } = useNetworkDevices(networkId);
  const { data: allGroups = [] } = useNetworkGroups(networkId);
  const { data: allScenes = [] } = useNetworkScenes(networkId);

  // 创建设备、组和场景名称映射
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

  const handleTabChange = (_, newValue) => {
    setSelectedTab(newValue);
  };

  const handleDeviceChange = (deviceId) => {
    setSelectedDevice(deviceId);
  };

  const groupKeys = Object.keys(ATTRIBUTE_GROUPS);
  const currentDevice = devices.find(d => d.deviceId === selectedDevice);
  
  // 检查当前标签是否为"Pages & Bindings"
  const isBindingsTab = groupKeys[selectedTab] === 'pages';

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
              src={multivueIcon}
              alt="MultiVue"
              style={{ width: 30, height: 30, marginRight: 12 }}
            />
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: '#fbcd0b',
              }}
            >
              MultiVue Displays
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Chip
              label={`${devices.length} ${devices.length === 1 ? 'device' : 'devices'}`}
              size="small"
              sx={{
                bgcolor: 'rgba(100, 100, 100, 0.1)',
                color: '#505050',
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

        {/* 可折叠的内容区域 */}
        <Collapse in={expanded}>
          <Box sx={{ p: 2 }}>
            {/* 设备选择器 */}
            <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {devices.map((device) => (
                <Chip
                  key={device.deviceId}
                  label={device.name}
                  onClick={() => handleDeviceChange(device.deviceId)}
                  variant={selectedDevice === device.deviceId ? "filled" : "outlined"}
                  sx={{
                    '&.MuiChip-filled': {
                      backgroundColor: '#40535c',
                      color: '#FFF',
                      '&:hover': {
                        backgroundColor: '#505050'
                      }
                    },
                    '&.MuiChip-outlined': {
                      borderColor: '#40535c',
                      color: '#40535c',
                      '&:hover': {
                        backgroundColor: 'rgba(96, 96, 96, 0.1)'
                      }
                    }
                  }}
                />
              ))}
            </Box>

            {/* 分组标签页 */}
            <Box sx={{ 
              width: '100%', 
              mb: 2, 
              '& .MuiTabs-root': {
                minHeight: 'auto'
              }
            }}>
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
                TabIndicatorProps={{
                  style: {
                    backgroundColor: '#606060'
                  }
                }}
                sx={{
                  '& .MuiTab-root': {
                    color: 'rgba(0, 0, 0, 0.6)',
                    '&.Mui-selected': {
                      color: '#505050'
                    },
                    '&:hover': {
                      color: '#505050',
                      opacity: 0.7
                    },
                    minHeight: 'auto',
                    padding: '12px 16px'
                  },
                  '& .MuiTouchRipple-root': {
                    display: 'none'
                  },
                  '& .MuiTabs-indicator': {
                    height: '2px'
                  }
                }}
              >
                {groupKeys.map((key, index) => (
                  <Tab 
                    key={key} 
                    label={ATTRIBUTE_GROUPS[key].label} 
                    id={`tab-${index}`}
                    disableRipple
                  />
                ))}
              </Tabs>
            </Box>

            {/* 内容区域 */}
            {currentDevice && (
              <>
                {/* 页面绑定视图 */}
                {isBindingsTab && (
                  <PageBindingsView 
                    device={currentDevice}
                    deviceMap={deviceMap}
                    groupMap={groupMap}
                    sceneMap={sceneMap}
                    allDevices={allDevices}
                  />
                )}

                {/* 常规属性表 */}
                {!isBindingsTab && (
                  <TableContainer 
                    component={Box} 
                    sx={{ 
                      width: '100%',
                      '& .MuiTable-root': {
                        tableLayout: 'fixed',
                        width: '100%'
                      },
                      border: '1px solid rgba(0,0,0,0.05)',
                      borderRadius: 1
                    }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ width: '30%', fontWeight: 'bold', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>Attribute</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>Value</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {ATTRIBUTE_GROUPS[groupKeys[selectedTab]].attributes.map((attr, index) => (
                          <TableRow 
                            key={attr.key}
                            sx={{ 
                              bgcolor: index % 2 === 0 ? 'rgba(0,0,0,0.01)' : 'transparent',
                              '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' }
                            }}
                          >
                            <TableCell 
                              component="th" 
                              scope="row"
                              sx={{ 
                                borderBottom: 'none', 
                                color: 'rgba(0,0,0,0.7)'
                              }}
                            >
                              {attr.label}
                            </TableCell>
                            <TableCell sx={{ borderBottom: 'none' }}>
                              {attr.format(currentDevice.specificAttributes[attr.key], currentDevice.specificAttributes)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </>
            )}
          </Box>
        </Collapse>
      </Paper>
    </Box>
  );
};

export default MULTIVUE; 