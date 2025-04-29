import React from 'react';
import { Chip } from '@mui/material';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import FlareIcon from '@mui/icons-material/Flare';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BasicTable from '../BasicTable';
import vcalSocketIcon from '../../../../../../assets/icons/DeviceType/VCAL_SOCKET.png';
import { DEVICE_CONFIGS } from '../../DeviceConfigs';

const VCAL_SOCKETType = ({ devices }) => {
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
      id: 'lockStatus',
      label: 'Lock Status',
      format: (value) => {
        const isLocked = value === 1;
        const color = value === undefined ? '#9e9e9e' : (isLocked ? '#f44336' : '#4caf50');
        return (
          <Chip 
            icon={isLocked ? <LockOutlinedIcon /> : <LockOpenIcon />}
            label={value === undefined ? '-' : (isLocked ? 'Locked' : 'Unlocked')}
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
      id: 'backLight',
      label: 'Back Light',
      format: (value) => {
        const isOn = value === 1;
        const color = value === undefined ? '#9e9e9e' : (isOn ? '#4caf50' : '#f44336');
        return (
          <Chip 
            icon={<FlareIcon />}
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
      id: 'delay',
      label: 'Delay',
      format: (value) => {
        const delay = DEVICE_CONFIGS.VCAL_SOCKET.helpers.getDelayMinutes(value);
        return (
          <Chip 
            icon={<AccessTimeIcon />}
            label={delay || '-'}
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
      title="VCAL Socket"
      icon={vcalSocketIcon}
      devices={devices}
      columns={columns}
      nameColumnWidth="30%"
      enhancedDisplay={false}
    />
  );
};

export default VCAL_SOCKETType; 