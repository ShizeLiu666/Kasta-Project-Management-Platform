// src/components/Network/NetworkDetails/Devices/Tables/RGB_CW/RGB_CW.js
import React from 'react';
import { Box, Chip } from '@mui/material';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import BrightnessLowIcon from '@mui/icons-material/BrightnessLow';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import SpeedIcon from '@mui/icons-material/Speed';
import SettingsIcon from '@mui/icons-material/Settings';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BasicTable from '../BasicTable';
import rgbcwIcon from '../../../../../../assets/icons/DeviceType/RGB_CW.png';

const RGB_CWType = ({ devices }) => {
  const columns = [
    {
      id: 'power',
      label: 'Power',
      format: (value) => {
        const isOn = value === 1;
        const color = value === undefined ? '#9e9e9e' : (isOn ? '#4caf50' : '#f44336');
        return (
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
        );
      }
    },
    {
      id: 'level',
      label: 'Level',
      format: (value) => {
        if (value === undefined || value === null) return '-';
        const percentage = Math.round((value / 255) * 100);
        return (
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
        );
      }
    },
    { 
      id: 'colorTemperature', 
      label: 'Color Temp',
      format: (value) => {
        if (value === undefined || value === null) return '-';
        return (
          <Chip 
            icon={<ThermostatIcon />}
            label={`${value}K`}
            size="small"
            sx={{ 
              backgroundColor: '#ff980020',
              color: '#ff9800',
              fontWeight: 500,
              '& .MuiChip-icon': { color: '#ff9800' }
            }}
          />
        );
      }
    },
    {
      id: 'isRgb',
      label: 'Mode',
      format: (value) => {
        const isRgb = value === 1;
        const label = value === undefined ? '-' : (isRgb ? 'RGB' : 'Color Temperature');
        return (
          <Chip 
            icon={<SettingsIcon />}
            label={label}
            size="small"
            sx={{ 
              backgroundColor: '#1976d120',
              color: '#1976d1',
              fontWeight: 500,
              '& .MuiChip-icon': { color: '#1976d1' }
            }}
          />
        );
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
            <Chip 
              label={red}
              size="small"
              sx={{ 
                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                color: '#f44336',
                fontWeight: 500,
                minWidth: '45px'
              }}
            />
            <Chip 
              label={green}
              size="small"
              sx={{ 
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                color: '#4caf50',
                fontWeight: 500,
                minWidth: '45px'
              }}
            />
            <Chip 
              label={blue}
              size="small"
              sx={{ 
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                color: '#2196f3',
                fontWeight: 500,
                minWidth: '45px'
              }}
            />
          </Box>
        );
      }
    },
    { 
      id: 'blinkSpeed', 
      label: 'Blink Speed',
      format: (value) => {
        let label;
        switch (Number(value)) {
          case -1: label = 'None'; break;
          case 0: label = 'Slow'; break;
          case 1: label = 'Medium'; break;
          case 2: label = 'Fast'; break;
          default: label = '-';
        }
        return (
          <Chip 
            icon={<SpeedIcon />}
            label={label}
            size="small"
            sx={{ 
              backgroundColor: '#9c27b020',
              color: '#9c27b0',
              fontWeight: 500,
              '& .MuiChip-icon': { color: '#9c27b0' }
            }}
          />
        );
      }
    },
    { 
      id: 'delay', 
      label: 'Delay',
      format: (value) => {
        if (value === undefined || value === null) {
          return (
            <Chip 
              icon={<AccessTimeIcon />}
              label="-"
              size="small"
              sx={{ 
                backgroundColor: '#edf2f7',
                color: '#718096',
                fontWeight: 500,
                '& .MuiChip-icon': { color: '#718096' }
              }}
            />
          );
        }
        return (
          <Chip 
            icon={<AccessTimeIcon />}
            label={`${value} min`}
            size="small"
            sx={{ 
              backgroundColor: '#edf2f7',
              color: '#718096',
              fontWeight: 500,
              '& .MuiChip-icon': { color: '#718096' }
            }}
          />
        );
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
      nameColumnWidth="20%"
      enhancedDisplay={false}
    />
  );
};

export default RGB_CWType;