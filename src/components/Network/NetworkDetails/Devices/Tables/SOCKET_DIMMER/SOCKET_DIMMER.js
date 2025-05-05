import React from 'react';
import { Chip } from '@mui/material';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BrightnessLowIcon from '@mui/icons-material/BrightnessLow';
import BasicTable from '../BasicTable';
import socketDimmerIcon from '../../../../../../assets/icons/DeviceType/SOCKET_DIMMER.png';

const SOCKET_DIMMER = ({ devices }) => {
  const columns = [
    {
      id: 'power',
      label: 'Power',
      format: (value) => {
        const isOn = value === 1;
        const label = value === undefined ? '-' : (isOn ? 'ON' : 'OFF');
        const color = value === undefined ? '#9e9e9e' : (isOn ? '#4caf50' : '#f44336');
        
        return (
          <Chip 
            icon={<PowerSettingsNewIcon />}
            label={label}
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
      title="Socket Dimmer"
      icon={socketDimmerIcon}
      devices={devices}
      columns={columns}
      nameColumnWidth="30%"
      formatWithDevice={true}
    />
  );
};

export default SOCKET_DIMMER; 