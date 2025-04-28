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
  const [expanded, setExpanded] = useState(true);
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
            </Box>

            {/* 属性表格 */}
            {currentDevice && (
              <TableContainer 
                component={Box} 
                sx={{ 
                  width: '100%',
                  '& .MuiTable-root': {
                    tableLayout: 'fixed',
                    width: '100%'
                  },
                  border: '1px solid #dee2e6',
                  borderRadius: 1
                }}
              >
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
        </Collapse>
      </Paper>
    </Box>
  );
};

export default MULTIVUE; 