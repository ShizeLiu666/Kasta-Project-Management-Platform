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
  Chip
} from '@mui/material';
import multivueIcon from '../../../../../../assets/icons/DeviceType/MULTIVUE.png';

// 属性分组配置
const ATTRIBUTE_GROUPS = {
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
  },
  customization: {
    label: 'Customization',
    attributes: [
      { key: 'memo', label: 'Memo', format: v => v || '-' },
      { key: 'pageNames', label: 'Page Names', format: v => Array.isArray(v) ? v.join(', ') : '-' },
      { 
        key: 'multiVueBinds', 
        label: 'Bindings', 
        format: v => Array.isArray(v) ? `${v.length} binding(s)` : 'No bindings' 
      }
    ]
  }
};

const MULTIVUE = ({ devices }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedDevice, setSelectedDevice] = useState(devices[0]?.deviceId);

  const handleTabChange = (_, newValue) => {
    setSelectedTab(newValue);
  };

  const handleDeviceChange = (deviceId) => {
    setSelectedDevice(deviceId);
  };

  const groupKeys = Object.keys(ATTRIBUTE_GROUPS);
  const currentDevice = devices.find(d => d.deviceId === selectedDevice);

  return (
    <Box sx={{ width: '100%' }}>
      {/* 标题区域 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, boxShadow: 'none',  border: 'none',}}>
        <img src={multivueIcon} alt="MultiVue" style={{ width: 30, height: 30 }} />
        <Typography variant="h6" sx={{ color: '#fbcd0b' }}>
          MultiVue Displays
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ({devices.length} {devices.length === 1 ? 'device' : 'devices'})
        </Typography>
      </Box>

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
                backgroundColor: '#fbcd0b',
                color: '#FFF',
                '&:hover': {
                  backgroundColor: '#e3b800'
                }
              },
              '&.MuiChip-outlined': {
                borderColor: '#fbcd0b',
                color: '#fbcd0b',
                '&:hover': {
                  backgroundColor: 'rgba(251, 205, 11, 0.1)'
                }
              }
            }}
          />
        ))}
      </Box>

      {/* 分组标签页 */}
      <Paper sx={{ 
        width: '100%', 
        mb: 2, 
        boxShadow: 'none',    // 移除阴影
        border: 'none',       // 移除边框
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
              backgroundColor: '#fbcd0b'
            }
          }}
          sx={{
            '& .MuiTab-root': {
              color: 'rgba(0, 0, 0, 0.6)',
              '&.Mui-selected': {
                color: '#fbcd0b'
              },
              '&:hover': {
                color: '#fbcd0b',
                opacity: 0.7
              },
              minHeight: 'auto',    // 减少标签高度
              padding: '12px 16px'   // 调整标签内边距
            },
            '& .MuiTouchRipple-root': {
              display: 'none'
            },
            '& .MuiTabs-indicator': {
              height: '2px'         // 调整指示器高度
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
      </Paper>

      {/* 属性表格 */}
      {currentDevice && (
        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #dee2e6' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '30%', fontWeight: 'bold' }}>Attribute</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ATTRIBUTE_GROUPS[groupKeys[selectedTab]].attributes.map((attr) => (
                <TableRow key={attr.key}>
                  <TableCell component="th" scope="row">
                    {attr.label}
                  </TableCell>
                  <TableCell>
                    {attr.format(currentDevice.specificAttributes[attr.key], currentDevice.specificAttributes)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default MULTIVUE; 