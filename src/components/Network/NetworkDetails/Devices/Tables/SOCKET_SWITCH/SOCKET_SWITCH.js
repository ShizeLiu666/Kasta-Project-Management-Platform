import React from 'react';
import { Chip } from '@mui/material';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BasicTable from '../BasicTable';
import SOCKET_SWITCHIcon from '../../../../../../assets/icons/DeviceType/SOCKET_SWITCH.png';

const SWITCHType = ({ devices }) => {
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
      title="Socket Switch"
      icon={SOCKET_SWITCHIcon}
      devices={devices}
      columns={columns}
      nameColumnWidth="40%"
      enhancedDisplay={false}
    />
  );
};

export default SWITCHType; 