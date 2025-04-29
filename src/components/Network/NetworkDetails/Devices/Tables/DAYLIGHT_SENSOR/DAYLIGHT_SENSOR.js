import React from 'react';
import { Chip } from '@mui/material';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import BasicTable from '../BasicTable';
import daylightSensorIcon from '../../../../../../assets/icons/DeviceType/DAYLIGHT_SENSOR.png';
import { DEVICE_CONFIGS } from '../../DeviceConfigs';

const DAYLIGHT_SENSORType = ({ devices }) => {
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
      id: 'sensorBindID',
      label: 'Sensor Bind ID',
      format: (value) => DEVICE_CONFIGS.DAYLIGHT_SENSOR.helpers.getSensorBindIDText(value)
    }
  ];

  return (
    <BasicTable
      title="Daylight Sensor"
      icon={daylightSensorIcon}
      devices={devices}
      columns={columns}
      nameColumnWidth="40%"
      enhancedDisplay={false}
    />
  );
};

export default DAYLIGHT_SENSORType; 