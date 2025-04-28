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
import t3SwitchIcon from '../../../../../../assets/icons/DeviceType/T3_SWITCH.png';

const SwitchStatus = ({ label, value, type }) => {
  let displayValue = '-';

  switch (type) {
    case 'power':
      displayValue = value === 1 ? 'On' : 'Off';
      break;
    case 'delay':
      displayValue = `${value || 0}min`;
      break;
    default:
      displayValue = value || '-';
  }

  return (
    <Box sx={{ textAlign: 'center', mb: 1 }}>
      <Typography 
        variant="caption" 
        sx={{
          color: '#95a5a6',
          display: 'block',
          fontSize: '0.7rem'
        }}
      >
        {label}
      </Typography>
      <Typography 
        variant="body2"
        sx={{ fontWeight: 500 }}
      >
        {displayValue}
      </Typography>
    </Box>
  );
};

const SwitchChannel = ({ data }) => {
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
      <SwitchStatus label="Power" value={data.power} type="power" />
      <SwitchStatus label="Delay Time" value={data.delay} type="delay" />
    </Box>
  );
};

// 获取对应按键数量的图标
const getSwitchIcon = (buttonCount) => {
  try {
    return require(`../../../../../../assets/icons/DeviceType/T3_SWITCH_${buttonCount}.png`);
  } catch (error) {
    console.warn(`Icon not found for ${buttonCount}-button switch, using default`);
    return t3SwitchIcon;
  }
};

// 创建单个开关类型的组件
const SwitchTypeGroup = ({ deviceType, devices }) => {
  const [expanded, setExpanded] = useState(true);
  const buttonCount = getButtonCount(deviceType);

  // 获取按键数量
  function getButtonCount(deviceType) {
    const match = deviceType.match(/KT(\d)RSB_SWITCH/);
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
              src={getSwitchIcon(buttonCount)}
              alt={`${buttonCount}-Button T3 Switch`}
              style={{ width: 30, height: 30, marginRight: 12 }}
            />
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: '#fbcd0b',
              }}
            >
              {`${buttonCount}-Button T3 Switch`}
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
                          <SwitchChannel data={channel} />
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

const T3_SWITCH = ({ devices }) => {
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
        <SwitchTypeGroup 
          key={deviceType} 
          deviceType={deviceType} 
          devices={typeDevices} 
        />
      ))}
    </Box>
  );
};

export default T3_SWITCH; 