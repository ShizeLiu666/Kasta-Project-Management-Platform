import React from 'react';
import { Chip } from '@mui/material';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BasicTable from '../BasicTable';
import dryContactIcon from '../../../../../../assets/icons/DeviceType/DRY_CONTACT.png';
import { DEVICE_CONFIGS } from '../../DeviceConfigs';

const DRY_CONTACTType = ({ devices }) => {
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
      id: 'isConfig',
      label: 'Configured',
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
      id: 'dryType',
      label: 'Type',
      format: (value) => {
        const label = value === undefined ? '-' : DEVICE_CONFIGS.DRY_CONTACT.helpers.getDryTypeText(value);
        
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
      title="Dry Contact"
      icon={dryContactIcon}
      devices={devices}
      columns={columns}
      nameColumnWidth="30%"  // 由于有4列，给名称列分配适中空间
    />
  );
};

export default DRY_CONTACTType; 