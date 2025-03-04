// src/components/Network/NetworkDetails/Devices/Tables/RGB_CW/RGB_CW.js
import React from 'react';
import BasicTable from '../BasicTable';
import rgbcwIcon from '../../../../../../assets/icons/DeviceType/RGB_CW.png';
import { Box, Typography } from '@mui/material';

const RGB_CWType = ({ devices }) => {
  const columns = [
    {
      id: 'power',
      label: 'Power',
      format: (value) => {
        if (value === 1) return 'On';
        if (value === 0) return 'Off';
        return '-';
      }
    },
    { 
      id: 'level', 
      label: 'level',
      format: (value) => {
        if (value === undefined || value === null) return '-';
        return `${Math.round((value / 255) * 100)}%`;
      }
    },
    { 
      id: 'colorTemperature', 
      label: 'Color Temp',
      format: (value) => {
        if (value === undefined || value === null) return '-';
        return value.toString();
      }
    },
    { 
      id: 'rgb', 
      label: 'RGB',
      format: (_, device) => {
        const red = device.specificAttributes?.red;
        const green = device.specificAttributes?.green;
        const blue = device.specificAttributes?.blue;
        
        if (red === undefined || green === undefined || blue === undefined) {
          return '-';
        }
        
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography component="span" sx={{ color: '#e74c3c', fontWeight: 'bold' }}>
            {red}
            </Typography>
            <Typography component="span">
              ,
            </Typography>
            <Typography component="span" sx={{ color: '#2ecc71', fontWeight: 'bold' }}>
            {green}
            </Typography>
            <Typography component="span">
              ,
            </Typography>
            <Typography component="span" sx={{ color: '#3498db', fontWeight: 'bold' }}>
            {blue}
            </Typography>
          </Box>
        );
      }
    },
    { 
      id: 'blinkSpeed', 
      label: 'Blink Speed',
      format: (value) => {
        switch (Number(value)) {
          case -1: return 'None';
          case 0: return 'Slow';
          case 1: return 'Medium';
          case 2: return 'Fast';
          default: return '-';
        }
      }
    },
    { 
      id: 'delay', 
      label: 'Delay',
      format: (value) => {
        if (value === undefined || value === null) return '-';
        return `${value} min`;
      }
    },
    { 
      id: 'isRgb', 
      label: 'Mode',
      format: (value) => {
        switch (Number(value)) {
          case 0: return 'Color Temperature';
          case 1: return 'RGB';
          default: return '-';
        }
      }
    }
  ];

  return (
    <BasicTable
      title="RGB CW"
      icon={rgbcwIcon}
      devices={devices}
      columns={columns}
      formatWithDevice={true}
      nameColumnWidth="20%"  // 其他6列平均分配80%
    />
  );
};

export default RGB_CWType;