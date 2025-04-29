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
  Collapse,
  IconButton,
  Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import t3DimmerIcon from '../../../../../../assets/icons/DeviceType/T3_DIMMER.png';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import BrightnessLowIcon from '@mui/icons-material/BrightnessLow';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const DimmerStatus = ({ label, value, type }) => {
  switch (type) {
    case 'power':
      const isOn = value === 1;
      const color = value === undefined ? '#9e9e9e' : (isOn ? '#4caf50' : '#f44336');
      return (
        <Box sx={{ mb: 1 }}>
          <Typography variant="caption" sx={{ color: '#95a5a6', display: 'block', mb: 0.5 }}>
            {label}
          </Typography>
          <Chip 
            icon={<PowerSettingsNewIcon />}
            label={value === undefined ? '-' : (isOn ? 'ON' : 'OFF')}
            size="small"
            sx={{ 
              backgroundColor: `${color}20`,
              color: color,
              fontWeight: 500,
              '& .MuiChip-icon': { color: color }
            }}
          />
        </Box>
      );

    case 'brightness':
      if (value === undefined || value === null) return '-';
      const percentage = Math.round((value / 255) * 100);
      return (
        <Box sx={{ mb: 1 }}>
          <Typography variant="caption" sx={{ color: '#95a5a6', display: 'block', mb: 0.5 }}>
            {label}
          </Typography>
          <Chip 
            icon={<BrightnessLowIcon />}
            label={`${percentage}%`}
            size="small"
            sx={{ 
              backgroundColor: '#fbcd0b20',
              color: '#fbcd0b',
              fontWeight: 500,
              '& .MuiChip-icon': { color: '#fbcd0b' }
            }}
          />
        </Box>
      );

    case 'delay':
      return (
        <Box sx={{ mb: 1 }}>
          <Typography variant="caption" sx={{ color: '#95a5a6', display: 'block', mb: 0.5 }}>
            {label}
          </Typography>
          <Chip 
            icon={<AccessTimeIcon />}
            label={value === undefined ? '-' : `${value} min`}
            size="small"
            sx={{ 
              backgroundColor: '#edf2f7',
              color: '#718096',
              fontWeight: 500,
              '& .MuiChip-icon': { color: '#718096' }
            }}
          />
        </Box>
      );

    default:
      return null;
  }
};

const DimmerChannel = ({ data }) => {
  return (
    <Box sx={{ 
      padding: '12px',
      borderRadius: 1.5,
      bgcolor: '#f8f9fa',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      <DimmerStatus label="Power" value={data.power} type="power" />
      <DimmerStatus label="Brightness" value={data.level} type="brightness" />
      <DimmerStatus label="Delay Time" value={data.delay} type="delay" />
    </Box>
  );
};

// 获取对应按键数量的图标
const getDimmerIcon = (buttonCount) => {
  try {
    return require(`../../../../../../assets/icons/DeviceType/T3_DIMMER_${buttonCount}.png`);
  } catch (error) {
    console.warn(`Icon not found for ${buttonCount}-button dimmer, using default`);
    return t3DimmerIcon;
  }
};

// 创建单个调光器类型的组件
const DimmerTypeGroup = ({ deviceType, devices }) => {
  const [expanded, setExpanded] = useState(true);
  const buttonCount = getButtonCount(deviceType);

  // 获取按键数量
  function getButtonCount(deviceType) {
    const match = deviceType.match(/KT(\d)RSB_DIMMER/);
    return match && match[1] ? parseInt(match[1]) : 3;
  }

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
              src={getDimmerIcon(buttonCount)}
              alt={`${buttonCount}-Button T3 Dimmer`}
              style={{ width: 30, height: 30, marginRight: 12 }}
            />
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: '#fbcd0b',
              }}
            >
              {`${buttonCount}-Button T3 Dimmer`}
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
                  {Array.from({ length: buttonCount }, (_, i) => (
                    <TableCell 
                      key={i}
                      width={`${75 / buttonCount}%`}
                      align="center"
                      sx={{ 
                        borderBottom: '1px solid rgba(224, 224, 224, 0.7)',
                        fontWeight: 'bold',
                        padding: '12px 16px'
                      }}
                    >
                      {`Channel ${i + 1}`}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {devices.map((device, deviceIndex) => {
                  const channels = Array.from({ length: buttonCount }, (_, i) => ({
                    power: device.specificAttributes[`power${['First', 'Second', 'Third'][i]}`],
                    level: device.specificAttributes[`level${['First', 'Second', 'Third'][i]}`],
                    delay: device.specificAttributes[`delay${['First', 'Second', 'Third'][i]}`]
                  }));

                  return (
                    <TableRow
                      key={device.deviceId}
                      sx={{ bgcolor: 'white' }}
                    >
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

                      {channels.map((channel, index) => (
                        <TableCell 
                          key={index}
                          align="center"
                          sx={{
                            padding: '16px',
                            borderBottom: deviceIndex === devices.length - 1 ? 'none' : '1px solid rgba(224, 224, 224, 0.2)',
                          }}
                        >
                          <DimmerChannel data={channel} />
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Collapse>
      </Paper>
    </Box>
  );
};

const T3_DIMMER = ({ devices }) => {
  if (!devices || devices.length === 0) return null;

  // 按设备类型分组
  const devicesByType = devices.reduce((acc, device) => {
    if (!acc[device.deviceType]) {
      acc[device.deviceType] = [];
    }
    acc[device.deviceType].push(device);
    return acc;
  }, {});

  return (
    <Box>
      {Object.entries(devicesByType).map(([deviceType, typeDevices]) => (
        <DimmerTypeGroup 
          key={deviceType} 
          deviceType={deviceType} 
          devices={typeDevices} 
        />
      ))}
    </Box>
  );
};

export default T3_DIMMER; 