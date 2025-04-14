import React from 'react';
import { 
  Box, 
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
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

const T3_SWITCH = ({ devices }) => {
  if (!devices || devices.length === 0) return null;

  // 获取按键数量
  const getButtonCount = (deviceType) => {
    const match = deviceType.match(/KT(\d)RSB_SWITCH/);
    return match && match[1] ? parseInt(match[1]) : 3;
  };

  // 按设备类型分组
  const devicesByType = devices.reduce((acc, device) => {
    if (!acc[device.deviceType]) {
      acc[device.deviceType] = [];
    }
    acc[device.deviceType].push(device);
    return acc;
  }, {});

  return (
    <>
      {Object.entries(devicesByType).map(([deviceType, typeDevices]) => {
        const buttonCount = getButtonCount(deviceType);
        
        return (
          <Box key={deviceType} sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <img
                src={getSwitchIcon(buttonCount)}
                alt={`${buttonCount}-Button T3 Switch`}
                style={{ width: 30, height: 30, marginRight: 12 }}
              />
              <Typography variant="h6" sx={{ fontWeight: 500, color: '#fbcd0b' }}>
                {`${buttonCount}-Button T3 Switch`}
              </Typography>
              <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                ({typeDevices.length} {typeDevices.length === 1 ? 'device' : 'devices'})
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
              <Table size="medium">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell 
                      width="25%" 
                      sx={{ 
                        borderBottom: '1px solid rgba(224, 224, 224, 0.7)',
                        fontWeight: 500,
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
                          fontWeight: 500,
                          padding: '12px 16px'
                        }}
                      >
                        {`Channel ${i + 1}`}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {typeDevices.map((device, deviceIndex) => {
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
                            borderBottom: deviceIndex === typeDevices.length - 1 ? 'none' : '1px solid rgba(224, 224, 224, 0.2)',
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
                              borderBottom: deviceIndex === typeDevices.length - 1 ? 'none' : '1px solid rgba(224, 224, 224, 0.2)',
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
          </Box>
        );
      })}
    </>
  );
};

export default T3_SWITCH; 