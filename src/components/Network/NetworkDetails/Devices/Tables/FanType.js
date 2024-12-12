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
import fanIcon from '../../../../../assets/icons/DeviceType/FAN.png';

const FanType = ({ devices }) => {
  // Define columns for fan type devices
  const columns = [
    { 
      id: 'name', 
      label: 'Device', 
      width: '30%' 
    },
    { 
      id: 'isHaveFanLight', 
      label: 'Has Light', 
      width: '17.5%',
      format: (value) => {
        if (value === 1) return 'Yes';
        if (value === 0) return 'No';
        return '-';
      }
    },
    { 
      id: 'fanLightState', 
      label: 'Light Status', 
      width: '17.5%',
      format: (value) => {
        if (value === 1) return 'On';
        if (value === 0) return 'Off';
        return '-';
      }
    },
    { 
      id: 'fanState', 
      label: 'Fan Status', 
      width: '17.5%',
      format: (value) => {
        if (value === 1) return 'On';
        if (value === 0) return 'Off';
        return '-';
      }
    },
    { 
      id: 'isConfigFanLight', 
      label: 'Light Configured', 
      width: '17.5%',
      format: (value) => {
        if (value === 1) return 'Yes';
        if (value === 0) return 'No';
        return '-';
      }
    }
  ];

  return (
    <Box>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          mb: 2,
          pl: 0
        }}
      >
        <img 
          src={fanIcon} 
          alt="Fan"
          style={{ 
            width: 30,
            height: 30,
            objectFit: 'contain'
          }}
        />
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 500,
            color: '#fbcd0b',
            mb: 0.5,
            ml: 0.5
          }}
        >
          Fan
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            ml: 0.5,
            color: 'text.secondary'
          }}
        >
          ({devices.length} {devices.length === 1 ? 'device' : 'devices'})
        </Typography>
      </Box>

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
              {columns.map(column => (
                <TableCell 
                  key={column.id}
                  sx={{ 
                    width: column.width,
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    backgroundColor: '#f8f9fa'
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
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
                {columns.map(column => {
                  if (column.id === 'name') {
                    return (
                      <TableCell key={column.id} sx={{ width: column.width }}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          overflow: 'hidden',
                          maxWidth: '100%'
                        }}>
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography 
                              variant="subtitle2" 
                              sx={{ 
                                fontWeight: 600,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {device.name}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {device.appearanceShortname}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                    );
                  }
                  
                  return (
                    <TableCell key={column.id} align="center">
                      <Typography variant="body2">
                        {column.format ? 
                          column.format(device.specificAttributes[column.id]) : 
                          device.specificAttributes[column.id]}
                      </Typography>
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

export default FanType;