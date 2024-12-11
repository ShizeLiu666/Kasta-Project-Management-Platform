import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography
} from '@mui/material';

const DeviceList = ({ networkId }) => {
  // 模拟设备数据
  const devices = [
    {
      deviceId: '1',
      deviceName: 'Device 1',
      deviceType: 'Type A',
      status: 'ONLINE',
      lastSeen: '2024-01-01 12:00:00'
    },
    {
      deviceId: '2',
      deviceName: 'Device 2',
      deviceType: 'Type B',
      status: 'OFFLINE',
      lastSeen: '2024-01-01 11:00:00'
    }
  ];

  // 状态样式
  const getStatusStyle = (status) => {
    switch (status) {
      case 'ONLINE':
        return { 
          color: '#4CAF50',
          fontWeight: 450
        };
      case 'OFFLINE':
        return { 
          color: '#F44336',
          fontWeight: 450
        };
      default:
        return { 
          color: '#bdbdbd',
          fontWeight: 450
        };
    }
  };

  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        boxShadow: 'none',
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        width: '100%',
        '& .MuiTable-root': {
          tableLayout: 'fixed',
          width: '100%'
        }
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell 
              sx={{ 
                width: '45%',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              Device
            </TableCell>
            <TableCell 
              sx={{ 
                width: '27.5%',
                fontWeight: 'bold',
                whiteSpace: 'nowrap'
              }}
            >
              Status
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {devices.map((device) => (
            <TableRow
              key={device.deviceId}
              sx={{
                '&:last-child td, &:last-child th': { border: 0 },
                '&:hover': { backgroundColor: '#f8f9fa' }
              }}
            >
              <TableCell sx={{ width: '45%' }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  overflow: 'hidden',
                  maxWidth: '100%'
                }}>
                  <Box sx={{ 
                    minWidth: 0,
                    flex: 1
                  }}>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        fontWeight: 600,
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {device.deviceName}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {device.deviceType}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Typography 
                  variant="body2" 
                  sx={getStatusStyle(device.status)}
                >
                  {device.status}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DeviceList;
