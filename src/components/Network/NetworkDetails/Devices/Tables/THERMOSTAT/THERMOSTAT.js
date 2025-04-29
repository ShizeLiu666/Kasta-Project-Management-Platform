// src/components/Network/NetworkDetails/Devices/Tables/THERMOSTAT/THERMOSTAT.js
import React from 'react';
import { Chip } from '@mui/material';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import SettingsIcon from '@mui/icons-material/Settings';
import SpeedIcon from '@mui/icons-material/Speed';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BasicTable from '../BasicTable';
import thermostatIcon from '../../../../../../assets/icons/DeviceType/THERMOSTAT.png';
import { DEVICE_CONFIGS } from '../../DeviceConfigs';

const THERMOSTATType = ({ devices }) => {
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
      id: 'currentTemperature',
      label: 'Current Temp',
      format: (value) => {
        const temp = DEVICE_CONFIGS.THERMOSTAT.helpers.getTemperatureText(value);
        return (
          <Chip 
            icon={<ThermostatIcon />}
            label={temp || '-'}
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
      id: 'setTemperature',
      label: 'Set Temp',
      format: (value) => {
        const temp = DEVICE_CONFIGS.THERMOSTAT.helpers.getTemperatureText(value);
        return (
          <Chip 
            icon={<ThermostatIcon />}
            label={temp || '-'}
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
      id: 'mode',
      label: 'Mode',
      format: (value) => {
        const label = DEVICE_CONFIGS.THERMOSTAT.helpers.getModeText(value);
        return (
          <Chip 
            icon={<SettingsIcon />}
            label={label || '-'}
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
      id: 'fanSpeed',
      label: 'Fan Speed',
      format: (value) => {
        const speed = DEVICE_CONFIGS.THERMOSTAT.helpers.getFanSpeedText(value);
        return (
          <Chip 
            icon={<SpeedIcon />}
            label={speed || '-'}
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
        const delay = DEVICE_CONFIGS.THERMOSTAT.helpers.getDelayMinutes(value);
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
      title="Thermostat"
      icon={thermostatIcon}
      devices={devices}
      columns={columns}
      nameColumnWidth="20%"
      enhancedDisplay={false}
    />
  );
};

export default THERMOSTATType;