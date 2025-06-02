// src/components/Network/NetworkDetails/Devices/Tables/FAN/FAN.js
import React from 'react';
import { Chip } from '@mui/material';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
// import LightbulbIcon from '@mui/icons-material/Lightbulb';
import LightbulbIcon from '@mui/icons-material/Flare';
import BasicTable from '../BasicTable';
import fanIcon from '../../../../../../assets/icons/DeviceType/FAN.png';

const FanType = ({ devices }) => {
  const columns = [
    {
      id: 'isHaveFanLight',
      label: 'Has Light',
      format: (value) => {
        const hasLight = value === 1;
        const label = value === undefined ? '-' : (hasLight ? 'Yes' : 'No');
        const color = value === undefined ? '#9e9e9e' : (hasLight ? '#4caf50' : '#f44336');
        
        return (
          <Chip 
            icon={<LightbulbIcon />}
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
      id: 'fanLightState',
      label: 'Light Status',
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
      id: 'isConfigFanLight',
      label: 'Light Configured',
      format: (value) => {
        const isConfigured = value === 1;
        const label = value === undefined ? '-' : (isConfigured ? 'Yes' : 'No');
        const color = value === undefined ? '#9e9e9e' : (isConfigured ? '#4caf50' : '#f44336');
        
        return (
          <Chip 
            icon={<CheckCircleIcon />}
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
      id: 'fanState',
      label: 'Fan Status',
      format: (value) => {
        let label;
        switch (Number(value)) {
          case 0: label = 'OFF'; break;
          case 1: label = 'LOW'; break;
          case 2: label = 'MEDIUM'; break;
          case 3: label = 'HIGH'; break;
          default: label = '-';
        }
        
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
      title="Fan"
      icon={fanIcon}
      devices={devices}
      columns={columns}
      nameColumnWidth="25%"
      enhancedDisplay={false}
    />
  );
};

export default FanType;