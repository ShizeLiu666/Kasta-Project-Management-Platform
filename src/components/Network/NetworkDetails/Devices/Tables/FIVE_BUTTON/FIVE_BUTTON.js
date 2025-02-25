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
  Chip
} from '@mui/material';

const FIVE_BUTTON = ({ devices }) => {
  const [processedDevices, setProcessedDevices] = useState([]);

  // 预处理设备数据，确保remoteBind字段正确
  useEffect(() => {
    if (devices && devices.length > 0) {
      const processed = devices.map(device => {
        // 确保specificAttributes存在
        const specificAttributes = device.specificAttributes || {};
        
        // 确保remoteBind是数组
        let remoteBind = specificAttributes.remoteBind || [];
        if (typeof remoteBind === 'string') {
          try {
            remoteBind = JSON.parse(remoteBind);
          } catch (e) {
            console.error('Failed to parse remoteBind string:', e);
            remoteBind = [];
          }
        }
        
        // 返回处理后的设备对象
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

  if (!processedDevices || processedDevices.length === 0) return null;

  // 获取按钮绑定信息
  const getButtonBinding = (device, buttonIndex) => {
    const remoteBind = device.specificAttributes?.remoteBind || [];
    return remoteBind.find(binding => Number(binding.hole) === buttonIndex) || null;
  };

  // 渲染按钮绑定信息
  const renderButtonBinding = (binding) => {
    if (!binding) return <Typography variant="body2" color="text.secondary">No Binding</Typography>;
    
    return (
      <Box sx={{ padding: 1, border: '1px solid #e0e0e0', borderRadius: 1, bgcolor: '#f9f9f9' }}>
        <Typography variant="caption" color="text.secondary" display="block">Device Type</Typography>
        <Typography variant="body2" fontWeight="medium">{binding.bindType}</Typography>
        
        <Typography variant="caption" color="text.secondary" display="block" mt={1}>Device ID</Typography>
        <Typography variant="body2" fontWeight="medium">{binding.bindId}</Typography>
        
        <Typography variant="caption" color="text.secondary" display="block" mt={1}>Channel</Typography>
        <Typography variant="body2" fontWeight="medium">{binding.bindChannel ? 'Right' : 'Left'}</Typography>
        
        <Typography variant="caption" color="text.secondary" display="block" mt={1}>Status</Typography>
        <Typography variant="body2" fontWeight="medium">{binding.enable ? 'Enabled' : 'Disabled'}</Typography>
      </Box>
    );
  };

  // 检查设备是否有特定按钮的绑定
  const hasButtonBinding = (device, buttonIndex) => {
    return !!getButtonBinding(device, buttonIndex);
  };

  // 检查是否有任何设备绑定了特定按钮
  const anyDeviceHasButtonBinding = (buttonIndex) => {
    return processedDevices.some(device => hasButtonBinding(device, buttonIndex));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <img
          src={require('../../../../../../assets/icons/DeviceType/FIVE_BUTTON.png')}
          alt="5-Button Remote"
          style={{ width: 30, height: 30, marginRight: 8 }}
        />
        <Typography variant="h6" sx={{ fontWeight: 500, color: '#fbcd0b' }}>
          5-Button Remote
        </Typography>
        <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
          ({processedDevices.length} {processedDevices.length === 1 ? 'device' : 'devices'})
        </Typography>
      </Box>
      
      <TableContainer component={Paper} variant="outlined">
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell width="20%">Device</TableCell>
              <TableCell width="10%">Check Time</TableCell>
              <TableCell colSpan={5} align="center">Button Bindings</TableCell>
            </TableRow>
            <TableRow sx={{ 
              backgroundColor: '#ffffff',
              '& th, & td': {
                borderBottom: 'none'
              }
            }}>
              <TableCell colSpan={2}></TableCell>
              {[1, 2, 3, 4, 5].map(buttonIndex => (
                <TableCell key={buttonIndex} align="center" width="14%">
                  <Chip 
                    label={`Button ${buttonIndex}`} 
                    size="small" 
                    sx={{ 
                      bgcolor: anyDeviceHasButtonBinding(buttonIndex) ? '#fbcd0b' : '#9e9e9e',
                      color: '#ffffff',
                      fontWeight: 500
                    }}
                  />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {processedDevices.map((device) => (
              <TableRow
                key={device.deviceId}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
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
                <TableCell>{device.specificAttributes?.checkTime || 'N/A'}</TableCell>
                
                {/* 按钮绑定单元格 */}
                {[1, 2, 3, 4, 5].map(buttonIndex => {
                  const binding = getButtonBinding(device, buttonIndex);
                  const isButtonBound = !!binding;
                  return (
                    <TableCell 
                      key={buttonIndex} 
                      align="center"
                      sx={{
                        borderLeft: isButtonBound ? '2px solid #fbcd0b' : 'none',
                        backgroundColor: 'transparent',
                        padding: '0px 16px 6px 16px'
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
    </Box>
  );
};

export default FIVE_BUTTON; 