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

  // 渲染按钮绑定信息 - 更新样式与TOUCH_PANEL一致
  const renderButtonBinding = (binding) => {
    if (!binding) {
      return (
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          padding: '12px 0'
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
        padding: '12px 16px',
        borderRadius: 1.5,
        bgcolor: '#f8f9fa',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        // borderLeft: '3px solid #fbcd0b',
        height: '100%'
      }}>
        <Typography variant="caption" color="text.secondary" fontWeight={500} display="block">
          Device Type
        </Typography>
        <Typography variant="body2" fontWeight="medium" mb={1}>
          {binding.bindType}
        </Typography>
        
        <Typography variant="caption" color="text.secondary" fontWeight={500} display="block">
          Device ID
        </Typography>
        <Typography variant="body2" fontWeight="medium" mb={1}>
          {binding.bindId}
        </Typography>
        
        <Typography variant="caption" color="text.secondary" fontWeight={500} display="block">
          Channel
        </Typography>
        <Typography variant="body2" fontWeight="medium" mb={1}>
          {binding.bindChannel ? 'Right' : 'Left'}
        </Typography>
        
        <Typography variant="caption" color="text.secondary" fontWeight={500} display="block">
          Status
        </Typography>
        <Typography variant="body2" fontWeight="medium">
          {binding.enable ? 'Enabled' : 'Disabled'}
        </Typography>
      </Box>
    );
  };

  // 检查是否有任何设备绑定了特定按钮
  const anyDeviceHasButtonBinding = (buttonIndex) => {
    return processedDevices.some(device => {
      const remoteBind = device.specificAttributes?.remoteBind || [];
      return remoteBind.some(b => Number(b.hole) === buttonIndex);
    });
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <img
          src={require('../../../../../../assets/icons/DeviceType/FIVE_BUTTON.png')}
          alt="5-Button Remote"
          style={{ width: 30, height: 30, marginRight: 12 }}
        />
        <Typography variant="h6" sx={{ fontWeight: 500, color: '#fbcd0b' }}>
          5-Button Remote
        </Typography>
        <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
          ({processedDevices.length} {processedDevices.length === 1 ? 'device' : 'devices'})
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
        <Table size="medium" sx={{ tableLayout: 'fixed' }}>
          <TableHead>
            {/* 表头第一行 */}
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell 
                width="20%" 
                sx={{ 
                  borderBottom: '1px solid rgba(224, 224, 224, 0.7)',
                  fontWeight: 500,
                  padding: '12px 16px'
                }}
              >
                Device
              </TableCell>
              <TableCell 
                width="10%" 
                sx={{ 
                  borderBottom: '1px solid rgba(224, 224, 224, 0.7)',
                  fontWeight: 500,
                  padding: '12px 16px'
                }}
              >
                Check Time
              </TableCell>
              <TableCell 
                colSpan={5} 
                align="center"
                sx={{ 
                  borderBottom: '1px solid rgba(224, 224, 224, 0.7)',
                  fontWeight: 500,
                  padding: '12px 16px'
                }}
              >
                Button Bindings
              </TableCell>
            </TableRow>
            
            {/* 表头第二行 - 按钮标签 */}
            <TableRow>
              <TableCell sx={{ padding: '8px 16px', borderBottom: '1px solid rgba(224, 224, 224, 0.3)' }}></TableCell>
              <TableCell sx={{ padding: '8px 16px', borderBottom: '1px solid rgba(224, 224, 224, 0.3)' }}></TableCell>
              {[1, 2, 3, 4, 5].map(buttonIndex => {
                const hasBinding = anyDeviceHasButtonBinding(buttonIndex);
                
                return (
                  <TableCell 
                    key={buttonIndex} 
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
            {processedDevices.map((device, deviceIndex) => (
              <TableRow
                key={device.deviceId}
                sx={{ 
                  bgcolor: 'white', // 统一设置为白色，移除斑马纹
                }}
              >
                {/* 设备名称列 */}
                <TableCell 
                  component="th" 
                  scope="row" 
                  sx={{ 
                    padding: '16px',
                    borderBottom: deviceIndex === processedDevices.length - 1 ? 'none' : '1px solid rgba(224, 224, 224, 0.2)',
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
                
                {/* 检查时间列 */}
                <TableCell 
                  sx={{ 
                    padding: '16px', 
                    borderBottom: deviceIndex === processedDevices.length - 1 ? 'none' : '1px solid rgba(224, 224, 224, 0.2)',
                  }}
                >
                  {device.specificAttributes?.checkTime || 'N/A'}
                </TableCell>
                
                {/* 按钮绑定单元格 */}
                {[1, 2, 3, 4, 5].map(buttonIndex => {
                  const binding = getButtonBinding(device, buttonIndex);
                  
                  return (
                    <TableCell 
                      key={buttonIndex} 
                      align="center"
                      sx={{
                        padding: '16px 8px',
                        borderBottom: deviceIndex === processedDevices.length - 1 ? 'none' : '1px solid rgba(224, 224, 224, 0.2)',
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